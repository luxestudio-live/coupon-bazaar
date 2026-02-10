"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { CouponCard } from "@/components/coupon-card"
import { TrustBadges } from "@/components/trust-badges"
import { WhatsAppButton } from "@/components/whatsapp-button"
import type { Coupon } from "@/lib/cart"

export default function Home() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons')
      const data = await response.json()
      setCoupons(data)
    } catch (error) {
      console.error("Failed to fetch coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Instant Delivery • 100% Verified Codes
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                Get Premium Coupons
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Instantly
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                Access verified discount codes from top brands. Fast, secure, and delivered straight to your screen.
              </p>
              
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <TrustBadges />
              </div>
            </div>
          </div>
        </section>

        {/* Coupons Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Available Coupons</h2>
              <p className="text-muted-foreground">Choose from our verified collection</p>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-xl p-6 animate-pulse bg-card">
                  <div className="h-6 bg-muted rounded-lg w-1/3 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
                  <div className="h-10 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/30">
              <div className="text-6xl mb-4">🎫</div>
              <p className="text-lg font-medium mb-2">No coupons available</p>
              <p className="text-muted-foreground">Check back soon for new deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon, index) => (
                <div 
                  key={coupon.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CouponCard coupon={coupon} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <WhatsAppButton />
    </div>
  )
}
