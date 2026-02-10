import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Footer } from "@/components/footer"
import { MaintenanceCheck } from "@/components/maintenance-check"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopEase By TryLooters - Buy Verified Coupons Instantly",
  description:
    "Get instant access to verified discount coupons with Razorpay payment. 1000+ coupons sold, instant delivery guaranteed.",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <MaintenanceCheck>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </MaintenanceCheck>
        <Analytics />
      </body>
    </html>
  )
}
