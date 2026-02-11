import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getAvailableCodes, markCodesAsUsed } from "@/lib/firebase/couponCodes"
import { collection, addDoc, Timestamp, doc, getDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, items } = body

    // Validate request
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    const isValid = generatedSignature === razorpay_signature

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 })
    }

    // Check if payment has already been processed (prevent duplicate submissions)
    const ordersRef = collection(db, "orders")
    const existingOrderQuery = query(ordersRef, where("paymentId", "==", razorpay_payment_id))
    const existingOrders = await getDocs(existingOrderQuery)

    if (!existingOrders.empty) {
      console.log(`Payment ${razorpay_payment_id} already processed. Preventing duplicate.`)
      return NextResponse.json({ 
        error: "Payment already processed", 
        message: "This payment has already been used to purchase coupons"
      }, { status: 400 })
    }

    // Fetch the Razorpay order to verify amount paid
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id)
    const amountPaid = razorpayOrder.amount / 100 // Convert from paise to rupees

    console.log("Amount paid:", amountPaid)

    // Payment verified successfully, now validate items and allocate coupon codes
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    // Re-calculate expected amount from database prices
    let expectedAmount = 0
    const validatedItems = []

    for (const item of items) {
      const { couponId, quantity } = item

      if (!couponId || !quantity) {
        return NextResponse.json({ error: "Invalid item data" }, { status: 400 })
      }

      // Fetch actual price from database
      const couponDoc = await getDoc(doc(db, "coupons", couponId))
      
      if (!couponDoc.exists()) {
        return NextResponse.json({ error: `Coupon not found: ${couponId}` }, { status: 404 })
      }

      const couponData = couponDoc.data()
      const actualPrice = couponData.price
      
      expectedAmount += actualPrice * quantity
      
      validatedItems.push({
        couponId,
        quantity,
        price: actualPrice,
        brand: couponData.brand,
        discount: couponData.discount,
        description: couponData.description
      })
    }

    console.log("Expected amount from database:", expectedAmount)

    // Verify amount paid matches expected amount
    if (Math.abs(amountPaid - expectedAmount) > 0.01) {
      console.error(`Payment amount mismatch! Paid: ${amountPaid}, Expected: ${expectedAmount}`)
      return NextResponse.json({ 
        error: "Payment amount mismatch", 
        details: { paid: amountPaid, expected: expectedAmount }
      }, { status: 400 })
    }

    const allocatedItems = []
    let totalAmount = 0

    // Process each validated coupon in the order
    for (const item of validatedItems) {
      const { couponId, quantity, brand, discount, price, description } = item

      // Get available codes for this coupon (with race condition awareness)
      const availableCodes = await getAvailableCodes(couponId, quantity)

      if (availableCodes.length < quantity) {
        // Stock depleted - could be race condition or genuine out of stock
        console.error(`Insufficient stock for ${brand} ${discount}. Requested: ${quantity}, Available: ${availableCodes.length}`)
        return NextResponse.json(
          { 
            error: `Not enough codes available for ${brand} ${discount}`, 
            details: `Only ${availableCodes.length} codes available. This payment will be refunded automatically or contact support.`
          },
          { status: 400 }
        )
      }

      // Mark these codes as used (atomic operation to prevent double-assignment)
      const codeIds = availableCodes.map(c => c.id)
      const userId = razorpay_payment_id
      
      const { error } = await markCodesAsUsed(codeIds, userId)
      
      if (error) {
        console.error(`Failed to allocate codes for ${brand} ${discount}:`, error)
        return NextResponse.json({ 
          error: "Failed to allocate codes", 
          details: "Please contact support with your payment ID"
        }, { status: 500 })
      }

      // Add to allocated items with actual code strings
      allocatedItems.push({
        brand,
        discount,
        quantity,
        codes: availableCodes.map(c => c.code),
        price,
        description
      })

      totalAmount += price * quantity
    }

    // Fetch payment details from Razorpay to get customer info
    let customerInfo = {
      email: "",
      contact: "",
      name: ""
    }

    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id)
      customerInfo = {
        email: payment.email || "",
        contact: payment.contact || "",
        name: payment.notes?.name || ""
      }
      console.log("Fetched customer info from Razorpay:", customerInfo)
    } catch (error) {
      console.error("Error fetching payment details from Razorpay:", error)
    }

    // Save order to Firestore
    const orderData = {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      totalAmount,
      timestamp: Timestamp.now(),
      customer: customerInfo,
      items: allocatedItems.map(item => ({
        brand: item.brand,
        discount: item.discount,
        description: item.description,
        price: item.price,
        quantity: item.quantity
      })),
      couponCodes: allocatedItems.flatMap(item => 
        item.codes.map(code => ({
          code,
          brand: item.brand,
          discount: item.discount
        }))
      )
    }

    const ordersRef = collection(db, "orders")
    const orderDoc = await addDoc(ordersRef, orderData)

    console.log("Order saved to Firestore:", orderDoc.id)

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: orderDoc.id,
      allocatedCodes: allocatedItems
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
