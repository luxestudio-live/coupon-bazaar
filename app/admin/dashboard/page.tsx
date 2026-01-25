"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin/admin-header"
import { BrandTable } from "@/components/admin/brand-table"
import { CouponTable } from "@/components/admin/coupon-table"
import { AddBrandDialog } from "@/components/admin/add-brand-dialog"
import { AddCouponDialog } from "@/components/admin/add-coupon-dialog"
import { Plus, Tag, Ticket } from "lucide-react"
import { getCurrentUser } from "@/lib/firebase/auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAddBrandDialogOpen, setIsAddBrandDialogOpen] = useState(false)
  const [isAddCouponDialogOpen, setIsAddCouponDialogOpen] = useState(false)
  const [brandRefreshKey, setBrandRefreshKey] = useState(0)
  const [couponRefreshKey, setCouponRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("brands")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    getCurrentUser().then((user) => {
      if (!user) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
      setLoading(false)
    })
  }, [router])

  const handleBrandAdded = () => {
    setBrandRefreshKey((prev) => prev + 1)
    setIsAddBrandDialogOpen(false)
  }

  const handleCouponAdded = () => {
    setCouponRefreshKey((prev) => prev + 1)
    setIsAddCouponDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage brands and coupons for your store. Start by adding brands first.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Brands
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Coupons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Brand Management</CardTitle>
                  <CardDescription>
                    Add and manage brands before creating coupons
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddBrandDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Brand
                </Button>
              </CardHeader>
              <CardContent>
                <BrandTable key={brandRefreshKey} onUpdate={() => setBrandRefreshKey((prev) => prev + 1)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Coupon Management</CardTitle>
                  <CardDescription>
                    View and manage all coupons for your brands
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddCouponDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Coupon
                </Button>
              </CardHeader>
              <CardContent>
                <CouponTable key={couponRefreshKey} onUpdate={() => setCouponRefreshKey((prev) => prev + 1)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddBrandDialog
          open={isAddBrandDialogOpen}
          onOpenChange={setIsAddBrandDialogOpen}
          onSuccess={handleBrandAdded}
        />

        <AddCouponDialog
          open={isAddCouponDialogOpen}
          onOpenChange={setIsAddCouponDialogOpen}
          onSuccess={handleCouponAdded}
        />
      </main>
    </div>
  )
}
