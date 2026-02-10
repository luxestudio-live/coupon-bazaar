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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative bg-gradient-to-br from-primary to-blue-600 p-2.5 rounded-lg shadow-lg group-hover:shadow-xl transition-all">
              <Ticket className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopEase
            </span>
            <span className="text-xs font-medium text-muted-foreground -mt-1">
              By TryLooters
            </span>
          </div>
        </Link>

        <Link href="/checkout">
          <Button 
            variant="outline" 
            className="relative gap-2 h-11 px-4 md:px-6 bg-gradient-to-r from-background to-muted/30 border-2 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
          >
            <ShoppingCart className={`h-5 w-5 transition-all group-hover:text-primary ${animate ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline font-semibold">Cart</span>
            {mounted && totalItems > 0 && (
              <>
                <Badge 
                  variant="default" 
                  className={`ml-2 absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-primary to-blue-600 shadow-lg transition-transform ${
                    animate ? 'scale-125' : 'scale-100'
                  }`}
                >
                  {totalItems}
                </Badge>
                <span className="hidden md:inline text-sm font-semibold text-primary ml-2 px-2 py-0.5 rounded-md bg-primary/10">
                  ₹{totalPrice}
                </span>
              </>
            )}
            {animate && (
              <span className="absolute -top-2 -right-2 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
