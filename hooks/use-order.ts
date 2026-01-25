"use client"

import { useState } from "react"

export interface Order {
  id: string
  items: Array<{
    brand: string
    discount: string
    quantity: number
    codes: string[]
  }>
  total: number
  createdAt: string
}

export function useOrder() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (cartItems: any[], totalPrice: number, paymentId?: string, orderId?: string): Promise<Order | null> => {
    setIsProcessing(true)
    setError(null)

    try {
      // Call API to allocate actual codes from Firestore
      const response = await fetch('/api/purchase-coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            couponId: item.id,
            quantity: item.quantity,
            brand: item.brand,
            discount: item.discount,
            price: item.price,
            description: item.description,
          })),
          paymentId,
          orderId,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to allocate coupon codes')
      }

      const order: Order = {
        id: orderId || data.orderId,
        items: data.items,
        total: totalPrice,
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage for success page
      localStorage.setItem('lastOrder', JSON.stringify(order))

      return order
    } catch (err) {
      setError("Failed to create order. Please try again.")
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const verifyPayment = async (orderId: string, upiId: string): Promise<boolean> => {
    setIsProcessing(true)
    setError(null)

    try {
      // Simulate payment verification
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return true
    } catch (err) {
      setError("Payment verification failed. Please try again.")
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  return { createOrder, verifyPayment, isProcessing, error }
}
