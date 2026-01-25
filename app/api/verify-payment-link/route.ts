import { type NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const razorpay_payment_id = searchParams.get("razorpay_payment_id")
  const razorpay_payment_link_id = searchParams.get("razorpay_payment_link_id")
  const razorpay_payment_link_reference_id = searchParams.get("razorpay_payment_link_reference_id")
  const razorpay_payment_link_status = searchParams.get("razorpay_payment_link_status")
  const razorpay_signature = searchParams.get("razorpay_signature")

  console.log("Payment link callback received:", {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_status
  })

  // Check if payment was successful
  if (razorpay_payment_link_status === "paid" && razorpay_payment_id) {
    // Get order ID from localStorage (will be available on client side)
    // Redirect to success page with payment details
    const successUrl = `/success/process?payment_id=${razorpay_payment_id}&link_id=${razorpay_payment_link_id}`
    return redirect(successUrl)
  } else {
    // Payment failed or cancelled
    return redirect(`/checkout?payment=failed`)
  }
}
