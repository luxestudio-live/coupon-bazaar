import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    // Check if Razorpay credentials are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    // Calculate total amount from database prices (security: prevent client price manipulation)
    let calculatedAmount = 0

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
      
      calculatedAmount += actualPrice * quantity
    }

    console.log("Calculated amount from database:", calculatedAmount)

    // Create Razorpay order
    const orderOptions = {
      amount: calculatedAmount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        items: JSON.stringify(items),
        itemCount: items?.length || 0
      }
    }

    console.log("Creating Razorpay order with options:", orderOptions)
    const order = await razorpay.orders.create(orderOptions)
    console.log("Razorpay order created successfully:", order.id)

    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    })
  } catch (error: any) {
    console.error("Error creating Razorpay payment link:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    
    const errorMessage = error?.error?.description || error?.message || String(error)
    const errorCode = error?.error?.code || error?.statusCode || 'UNKNOWN'
    
    return NextResponse.json({ 
      error: "Failed to create payment link", 
      details: errorMessage,
      code: errorCode,
      rawError: error?.error || {}
    }, { status: 500 })
  }
}
