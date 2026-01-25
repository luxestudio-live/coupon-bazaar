"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"

// Pages that should be accessible during maintenance
const ALLOWED_PATHS = [
  "/maintenance",
  "/admin/login",
  "/admin/dashboard",
  "/admin/inventory",
  "/admin/transactions",
  "/admin/usage-history",
]

export function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (MAINTENANCE_MODE) {
      const isAllowed = ALLOWED_PATHS.some(path => pathname?.startsWith(path))
      
      if (!isAllowed) {
        router.replace("/maintenance")
      }
    }
  }, [pathname, router])

  // If in maintenance mode and not on allowed page, show nothing while redirecting
  if (MAINTENANCE_MODE && !ALLOWED_PATHS.some(path => pathname?.startsWith(path))) {
    return null
  }

  return <>{children}</>
}
