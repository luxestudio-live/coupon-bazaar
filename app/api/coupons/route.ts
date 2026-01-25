import { NextResponse } from "next/server"
import { getCoupons } from "@/lib/firebase/coupons"

export async function GET() {
  try {
    const coupons = await getCoupons()
    // Filter out hidden coupons for public API
    const visibleCoupons = coupons.filter((coupon) => !coupon.hidden)
    return NextResponse.json(visibleCoupons)
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
  }
}
