import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, items } = body

    console.log("Creating Razorpay order for amount:", amount)

    // Validate request
    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 })
    }

    // Check if Razorpay credentials are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    // Create Razorpay order
    const orderOptions = {
      amount: amount * 100, // Convert to paise
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
