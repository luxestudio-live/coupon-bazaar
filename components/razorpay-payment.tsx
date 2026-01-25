"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface RazorpayPaymentProps {
  amount: number
  items: any[]
  onPaymentInitiated: (paymentLinkId: string) => void
}

export function RazorpayPayment({ amount, items, onPaymentInitiated }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)

    try {
      console.log("Creating payment link for amount:", amount)
      
      // Create payment link on server
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, items }),
      })

      const data = await response.json()

      if (!response.ok || !data.paymentLink) {
        console.error("Payment link creation failed:", data)
        const errorMsg = `${data.error || "Unknown error"}\nDetails: ${data.details || "No details"}\nCode: ${data.code || "N/A"}`
        alert(errorMsg)
        setLoading(false)
        return
      }

      console.log("Payment link created:", data.paymentLink)
      
      // Store order details in localStorage before redirect
      localStorage.setItem('pendingOrder', JSON.stringify({
        items,
        amount,
        paymentLinkId: data.paymentLinkId,
        timestamp: Date.now()
      }))
      
      onPaymentInitiated(data.paymentLinkId)
      
      // Redirect to Razorpay's hosted payment page
      window.location.href = data.paymentLink
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>You'll be redirected to secure Razorpay payment page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary text-2xl">₹{amount}</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Payment...
              </>
            ) : (
              <>Pay ₹{amount}</>
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              🔒 Secure payment powered by Razorpay
            </p>
            <p className="text-xs text-muted-foreground">
              Supports UPI, Cards, NetBanking & Wallets
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
