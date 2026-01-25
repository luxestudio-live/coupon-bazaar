import { NextRequest, NextResponse } from "next/server"
import { getAvailableCodes, markCodesAsUsed } from "@/lib/firebase/couponCodes"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, paymentId, orderId } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    const allocatedItems = []
    let totalAmount = 0

    // Process each coupon in the order
    for (const item of items) {
      const { couponId, quantity, brand, discount, price } = item

      // Get available codes for this coupon
      const availableCodes = await getAvailableCodes(couponId, quantity)

      if (availableCodes.length < quantity) {
        return NextResponse.json(
          { error: `Not enough codes available for ${brand} ${discount}. Only ${availableCodes.length} left.` },
          { status: 400 }
        )
      }

      // Mark these codes as used
      const codeIds = availableCodes.map(c => c.id)
      const userId = paymentId || `guest_${Date.now()}`
      
      const { error } = await markCodesAsUsed(codeIds, userId)
      
      if (error) {
        return NextResponse.json({ error: "Failed to allocate codes" }, { status: 500 })
      }

      // Add to allocated items with actual code strings
      allocatedItems.push({
        brand,
        discount,
        quantity,
        codes: availableCodes.map(c => c.code),
        price: price || 0,
        description: item.description || ''
      })

      totalAmount += (price || 0) * quantity
    }

    // Fetch payment details from Razorpay to get customer info
    let customerInfo = {
      email: "",
      contact: "",
      name: ""
    }

    try {
      if (paymentId && paymentId.startsWith("pay_")) {
        const payment = await razorpay.payments.fetch(paymentId)
        customerInfo = {
          email: payment.email || "",
          contact: payment.contact || "",
          name: payment.notes?.name || ""
        }
        console.log("Fetched customer info from Razorpay:", customerInfo)
      }
    } catch (error) {
      console.error("Error fetching payment details from Razorpay:", error)
    }

    // Save order to Firestore
    const orderData = {
      paymentId: paymentId || orderId || "ORD-" + Date.now(),
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

    const orderRef = await addDoc(collection(db, "orders"), orderData)

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      items: allocatedItems,
    })
  } catch (error: any) {
    console.error("Error purchasing coupon codes:", error)
    return NextResponse.json(
      { error: "Failed to purchase coupon codes" },
      { status: 500 }
    )
  }
}
