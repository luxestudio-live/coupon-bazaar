"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Receipt, Package, History } from "lucide-react"
import { logout } from "@/lib/firebase/auth"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="flex items-center space-x-1">
            <Link href="/admin/dashboard">
              <Button 
                variant={pathname === "/admin/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/inventory">
              <Button 
                variant={pathname === "/admin/inventory" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            </Link>
            <Link href="/admin/transactions">
              <Button 
                variant={pathname === "/admin/transactions" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Receipt className="h-4 w-4" />
                Transactions
              </Button>
            </Link>
            <Link href="/admin/usage-history">
              <Button 
                variant={pathname === "/admin/usage-history" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                Usage History
              </Button>
            </Link>
              <Link href="/admin/unused-coupons">
                <Button 
                  variant={pathname === "/admin/unused-coupons" ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  Unused Coupons
                </Button>
              </Link>
          </nav>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
