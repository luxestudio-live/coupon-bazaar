"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Copy, Download, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/types/order"

export default function SuccessPage() {
  const params = useParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasLoadedRef = useRef(false)
  const hasDownloadedRef = useRef(false)

  const handleDownloadTxt = () => {
    if (!order) return
    
    // Create text content
    let content = `Order Confirmation - ${order.id}\n`
    content += `Date: ${new Date(order.createdAt).toLocaleString()}\n`
    content += `Total Paid: ₹${order.total}\n`
    content += `\n${'='.repeat(50)}\n\n`
    
    order.items.forEach((item, index) => {
      content += `${index + 1}. ${item.brand} - ${item.discount} (Quantity: ${item.quantity})\n`
      content += `${'─'.repeat(40)}\n`
      item.codes.forEach((code, codeIndex) => {
        content += `   Code ${codeIndex + 1}: ${code}\n`
      })
      content += `\n`
    })
    
    content += `${'='.repeat(50)}\n`
    content += `Thank you for your purchase!\n\n`
    content += `IMPORTANT: If any code is blocked by the brand, no refund or replacement would be given.\n`
    content += `If you face any issue with coupon please contact on instagram.com/trylooters\n`
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coupon-codes-${order.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Download Complete",
      description: "Your coupon codes have been downloaded",
    })
  }

  useEffect(() => {
    // Auto-download TXT file once when order is loaded
    if (order && !hasDownloadedRef.current) {
      hasDownloadedRef.current = true
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        handleDownloadTxt()
      }, 500)
    }
  }, [order])

  useEffect(() => {
    // Prevent running multiple times in strict mode
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    
    const orderData = localStorage.getItem('lastOrder')
    
    if (orderData) {
      try {
        const parsedOrder = JSON.parse(orderData)
        setOrder(parsedOrder)
        setIsLoading(false)
        clearCart()
        // Don't remove localStorage here - let user stay on page
      } catch (error) {
        console.error('Failed to parse order data:', error)
        setIsLoading(false)
        setTimeout(() => router.push('/'), 2000)
      }
    } else {
      // No order found, redirect to home after a delay
      setIsLoading(false)
      setTimeout(() => router.push('/'), 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">✅ Payment Successful!</CardTitle>
              <p className="text-muted-foreground">Order #{order.id}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                ⚠️ Important: If any code is blocked by the brand, no refund or replacement would be given.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Coupons</h3>
                <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-2 bg-transparent">
                  <Download className="h-3 w-3" />
                  Download TXT
                </Button>
              </div>

              {order.items.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      🎫 {item.brand} {item.discount} (x{item.quantity})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {item.codes.map((code, codeIndex) => (
                      <div
                        key={codeIndex}
                        className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm"
                      >
                        <span>{code}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(code)
                            toast({
                              title: "Code Copied",
                              description: `${code} copied to clipboard`,
                            })
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-6 border-t flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-primary">₹{order.total}</p>
              </div>
              <Link href="/">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
