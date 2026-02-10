"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayPaymentProps {
  amount: number
  items: any[]
  onPaymentInitiated: (orderId: string) => void
  onSuccess?: () => void
}

export function RazorpayPayment({ amount, items, onPaymentInitiated, onSuccess }: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Payment gateway is loading. Please wait...")
      return
    }

    setLoading(true)

    try {
      console.log("Creating Razorpay order for amount:", amount)
      
      // Create order on server
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, items }),
      })

      const data = await response.json()

      if (!response.ok || !data.orderId) {
        console.error("Order creation failed:", data)
        const errorMsg = `${data.error || "Unknown error"}\nDetails: ${data.details || "No details"}`
        alert(errorMsg)
        setLoading(false)
        return
      }

      console.log("Order created:", data.orderId)
      
      // Store order details in localStorage
      localStorage.setItem('pendingOrder', JSON.stringify({
        items,
        amount,
        orderId: data.orderId,
        timestamp: Date.now()
      }))
      
      onPaymentInitiated(data.orderId)
      
      // Prepare items for verification with couponId
      const itemsForVerification = items.map(item => ({
        couponId: item.id,
        brand: item.brand,
        discount: item.discount,
        description: item.description,
        price: item.price,
        quantity: item.quantity
      }))
      
      // Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "ShopEase By TryLooters",
        description: `Purchase ${items.length} coupon code(s)`,
        order_id: data.orderId,
        handler: async function (response: any) {
          console.log("Payment successful:", response)
          
          // Verify payment on server
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: itemsForVerification
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyResponse.ok && verifyData.success) {
            // Format order data for success page
            const orderForStorage = {
              id: verifyData.orderId,
              paymentId: verifyData.paymentId,
              total: amount,
              createdAt: new Date().toISOString(),
              items: verifyData.allocatedCodes.map((item: any) => ({
                brand: item.brand,
                discount: item.discount,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                codes: item.codes
              }))
            }
            
            // Store order in localStorage for success page
            localStorage.setItem('lastOrder', JSON.stringify(orderForStorage))
            localStorage.removeItem('pendingOrder')
            
            // Navigate to success page (cart will be cleared there)
            window.location.href = `/success/${verifyData.orderId}`
          } else {
            alert("Payment verification failed. Please contact support.")
            setLoading(false)
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
            console.log("Payment cancelled by user")
          }
        },
        theme: {
          color: "#0070f3"
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
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
        <CardDescription>Secure checkout powered by Razorpay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-primary text-2xl">₹{amount}</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : !scriptLoaded ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Payment Gateway...
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
