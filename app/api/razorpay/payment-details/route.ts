import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID required" }, { status: 400 })
    }

    if (!paymentId.startsWith("pay_")) {
      return NextResponse.json({ 
        error: "Invalid payment ID format",
        details: null 
      }, { status: 400 })
    }

    const payment = await razorpay.payments.fetch(paymentId)

    return NextResponse.json({
      success: true,
      details: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email || null,
        contact: payment.contact || null,
        createdAt: payment.created_at,
        bank: payment.bank || null,
        wallet: payment.wallet || null,
        vpa: payment.vpa || null,
        acquirerData: payment.acquirer_data || null,
      }
    })
  } catch (error: any) {
    console.error("Error fetching payment details:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch payment details",
        message: error.message 
      },
      { status: 500 }
    )
  }
}
