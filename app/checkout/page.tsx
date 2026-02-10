"use client"

import { useRouter } from "next/navigation"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { RazorpayPayment } from "@/components/razorpay-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCart } from "@/lib/cart"
import { useOrder } from "@/hooks/use-order"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, removeItem, getTotalPrice, clearCart } = useCart()
  const totalPrice = getTotalPrice()

  const handlePaymentInitiated = (orderId: string) => {
    console.log("Payment initiated with order ID:", orderId)
    // Payment will be handled by Razorpay checkout modal
  }

  const handlePaymentSuccess = () => {
    console.log("Payment successful, clearing cart")
    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center p-8">
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">Your cart is empty</p>
              <Link href="/">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <p>
                              {item.brand} {item.discount}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.price}</TableCell>
                        <TableCell className="text-right font-medium">₹{item.price * item.quantity}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 pt-6 border-t space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div>
            <RazorpayPayment 
              amount={totalPrice} 
              items={items} 
              onPaymentInitiated={handlePaymentInitiated}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
