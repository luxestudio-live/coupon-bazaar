"use client"

import { useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useOrder } from "@/hooks/use-order"

function ProcessPaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createOrder } = useOrder()
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    if (hasProcessedRef.current) return
    hasProcessedRef.current = true

    const processPayment = async () => {
      const paymentId = searchParams.get("payment_id")
      const linkId = searchParams.get("link_id")

      if (!paymentId) {
        router.push("/checkout?payment=failed")
        return
      }

      try {
        // Get order details from localStorage
        const pendingOrderStr = localStorage.getItem('pendingOrder')
        if (!pendingOrderStr) {
          console.error("No pending order found")
          router.push("/")
          return
        }

        const pendingOrder = JSON.parse(pendingOrderStr)
        
        // Create order in database
        const order = await createOrder(
          pendingOrder.items,
          pendingOrder.amount,
          paymentId,
          linkId || paymentId
        )

        if (order) {
          // Clear pending order
          localStorage.removeItem('pendingOrder')
          // Redirect to success page
          router.push(`/success/${order.id}`)
        } else {
          router.push("/checkout?payment=failed")
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        router.push("/checkout?payment=failed")
      }
    }

    processPayment()
  }, [searchParams, createOrder, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Processing your payment...</h2>
        <p className="text-muted-foreground">Please wait while we confirm your order</p>
      </div>
    </div>
  )
}

export default function ProcessPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <ProcessPaymentContent />
    </Suspense>
  )
}
