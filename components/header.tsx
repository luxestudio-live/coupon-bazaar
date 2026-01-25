"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Ticket } from "lucide-react"
import { useCart } from "@/lib/cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { getTotalItems, getTotalPrice } = useCart()
  const [mounted, setMounted] = useState(false)
  const [prevCount, setPrevCount] = useState(0)
  const [animate, setAnimate] = useState(false)
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Trigger animation when cart count changes
  useEffect(() => {
    if (mounted && totalItems > prevCount) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 600)
      return () => clearTimeout(timer)
    }
    setPrevCount(totalItems)
  }, [totalItems, mounted, prevCount])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Ticket className="h-6 w-6 text-primary" />
          <span>CouponBazaar</span>
        </Link>

        <Link href="/checkout">
          <Button variant="outline" className="relative gap-2 bg-transparent">
            <ShoppingCart className={`h-4 w-4 transition-transform ${animate ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Cart</span>
            {mounted && totalItems > 0 && (
              <>
                <Badge 
                  variant="default" 
                  className={`ml-1 absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold transition-transform ${
                    animate ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalItems}
                </Badge>
                <span className="hidden md:inline text-muted-foreground ml-1">₹{totalPrice}</span>
              </>
            )}
            {animate && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
