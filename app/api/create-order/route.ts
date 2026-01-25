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

    console.log("Creating payment link for amount:", amount)

    // Validate request
    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 })
    }

    // Check if Razorpay credentials are configured
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured")
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    // Create payment link (works without website approval!)
    const paymentLinkOptions = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      description: `Purchase ${items?.length || 1} coupon code(s)`,
      customer: {
        name: "",
        email: "",
        contact: ""
      },
      notify: {
        sms: false,
        email: false
      },
      reminder_enable: false,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://coupon-bazaar.vercel.app'}/api/verify-payment-link`,
      callback_method: "get"
    }

    console.log("Creating Razorpay payment link with options:", paymentLinkOptions)
    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions)
    console.log("Razorpay payment link created successfully:", paymentLink.id)

    return NextResponse.json({ 
      paymentLink: paymentLink.short_url,
      paymentLinkId: paymentLink.id
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
