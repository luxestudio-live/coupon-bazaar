"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart, type Coupon } from "@/lib/cart"
import { useToast } from "@/hooks/use-toast"

interface CouponCardProps {
  coupon: Coupon
}

export function CouponCard({ coupon }: CouponCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(coupon, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity}x ${coupon.brand} ${coupon.discount} added to your cart.`,
    })
    setQuantity(1)
  }

  const isLowStock = coupon.stock < 10

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="p-4 pb-0 flex items-center justify-between">
        <div className="flex-1" />
        {isLowStock && (
          <Badge variant="destructive" className="gap-1">
            🔥 Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 text-balance">
          {coupon.brand} {coupon.discount}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{coupon.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">₹{coupon.price}</p>
            <p className="text-xs text-muted-foreground">per coupon</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{coupon.stock} left</p>
            <p className="text-xs text-muted-foreground">in stock</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.min(50, quantity + 1))}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <Button onClick={handleAddToCart} className="flex-1 gap-2" disabled={coupon.stock === 0}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
