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
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-2 hover:border-primary/20">
      {/* Header with badge */}
      <div className="p-5 pb-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-600">Available</span>
        </div>
        {isLowStock && (
          <Badge variant="destructive" className="gap-1 animate-pulse">
            🔥 Low Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-bold text-xl mb-1 text-balance group-hover:text-primary transition-colors">
            {coupon.brand}
          </h3>
          <p className="text-base font-semibold text-muted-foreground">
            {coupon.discount}
          </p>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {coupon.description}
        </p>
        
        {/* Price and Stock */}
        <div className="flex items-end justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ₹{coupon.price}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">In Stock</p>
            <p className="text-lg font-bold">{coupon.stock}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-3">
        <div className="flex items-center border-2 rounded-lg bg-muted/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-sm font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
            onClick={() => setQuantity(Math.min(50, quantity + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={handleAddToCart} 
          className="flex-1 gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30" 
          disabled={coupon.stock === 0}
          size="lg"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
