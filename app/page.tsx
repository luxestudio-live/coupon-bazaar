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
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 md:py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            Buy Verified Coupons
            <br />
            <span className="text-primary">Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 text-balance">
            Get instant access to verified discount coupons with UPI payment
          </p>
          <TrustBadges />
        </section>

        {/* Coupons Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Available Coupons</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No coupons available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          )}
        </section>
      </main>

      <WhatsAppButton />
    </div>
  )
}
