"use client";
// Type definitions for coupon inventory
interface CouponCode {
  id: string;
  code: string;
  isUsed: boolean;
}

interface CouponInventory {
  couponId: string;
  brand: string;
  discount: string;
  description: string;
  price: number;
  totalCodes: number;
  availableCodes: number;
  usedCodes: number;
  allCodes: CouponCode[];
}

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getCurrentUser } from "@/lib/firebase/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, AlertCircle, Eye } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"

export default function InventoryPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<CouponInventory[]>([])
  const [filteredInventory, setFilteredInventory] = useState<CouponInventory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoupon, setSelectedCoupon] = useState<CouponInventory | null>(null)
  const [isCodesDialogOpen, setIsCodesDialogOpen] = useState(false)
  const [showUsedCodes, setShowUsedCodes] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
        fetchInventory()
      }
      setLoading(false)
    })
  }, [router])

  const fetchInventory = async () => {
    try {
      console.log("Fetching inventory...")
      const couponsRef = collection(db, "coupons")
      const couponsSnapshot = await getDocs(couponsRef)
      
      console.log("Found " + couponsSnapshot.size + " coupons")
      
      const inventoryData: CouponInventory[] = []

      for (const couponDoc of couponsSnapshot.docs) {
        const couponData = couponDoc.data()
        
        console.log("Processing coupon: " + couponData.brand + " " + couponData.discount)
        
        const codesRef = collection(db, "couponCodes")
        const codesQuery = query(
          codesRef,
          where("couponId", "==", couponDoc.id)
        )
        const codesSnapshot = await getDocs(codesQuery)
        
        console.log("Found " + codesSnapshot.size + " codes for " + couponData.brand)
        
        const allCodes: CouponCode[] = []
        let availableCount = 0
        let usedCount = 0

        codesSnapshot.forEach(codeDoc => {
          const codeData = codeDoc.data()
          allCodes.push({
            id: codeDoc.id,
            code: codeData.code,
            isUsed: codeData.isUsed || false
          })
          if (codeData.isUsed) {
            usedCount++
          } else {
            availableCount++
          }
        })

        inventoryData.push({
          couponId: couponDoc.id,
          brand: couponData.brand || "Unknown",
          discount: couponData.discount || "",
          description: couponData.description || "",
          price: couponData.price || 0,
          totalCodes: allCodes.length,
          availableCodes: availableCount,
          usedCodes: usedCount,
          allCodes: allCodes
        })
      }

      inventoryData.sort((a, b) => a.brand.localeCompare(b.brand))
      
      console.log("Inventory data:", inventoryData)
      setInventory(inventoryData)
      setFilteredInventory(inventoryData)
    } catch (error) {
      console.error("Error fetching inventory:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert("Error loading inventory: " + errorMessage)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = inventory.filter(item => 
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.discount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredInventory(filtered)
    } else {
      setFilteredInventory(inventory)
    }
  }, [searchTerm, inventory])

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

  const totalAvailable = filteredInventory.reduce((sum, item) => sum + item.availableCodes, 0)
  const totalUsed = filteredInventory.reduce((sum, item) => sum + item.usedCodes, 0)
  const lowStockItems = filteredInventory.filter(item => item.availableCodes < 5 && item.availableCodes > 0)
  const outOfStockItems = filteredInventory.filter(item => item.availableCodes === 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coupon Inventory</h1>
          <p className="text-muted-foreground">
            Track available and used coupon codes by brand and offer
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Available</CardDescription>
              <CardTitle className="text-3xl text-green-600">{totalAvailable}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Used</CardDescription>
              <CardTitle className="text-3xl text-gray-600">{totalUsed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Low Stock</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{lowStockItems.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Out of Stock</CardDescription>
              <CardTitle className="text-3xl text-red-600">{outOfStockItems.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {outOfStockItems.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{outOfStockItems.length} coupon(s) out of stock:</strong>{" "}
              {outOfStockItems.map(item => item.brand + " " + item.discount).join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {lowStockItems.length > 0 && (
          <Alert className="mb-6 border-orange-500">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription>
              <strong>{lowStockItems.length} coupon(s) running low:</strong>{" "}
              {lowStockItems.map(item => item.brand + " " + item.discount + " (" + item.availableCodes + " left)").join(", ")}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by brand, discount, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupon Stock</CardTitle>
            <CardDescription>
              Showing {filteredInventory.length} of {inventory.length} coupons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand & Offer</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead className="text-center">Used</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {searchTerm ? "No coupons found matching your search" : "No coupons in inventory"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.couponId}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold">{item.brand}</p>
                            <p className="text-sm text-muted-foreground">{item.discount}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm max-w-xs">
                          {item.description}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{item.price}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            variant={item.availableCodes === 0 ? "destructive" : item.availableCodes < 5 ? "outline" : "secondary"}
                            className={item.availableCodes < 5 && item.availableCodes > 0 ? "border-orange-500 text-orange-700" : ""}
                          >
                            {item.availableCodes}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.usedCodes}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {item.totalCodes}
                        </TableCell>
                        <TableCell>
                          {item.availableCodes === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.availableCodes < 5 ? (
                            <Badge className="bg-orange-500">Low Stock</Badge>
                          ) : (
                            <Badge variant="secondary">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCoupon(item)
                              setShowUsedCodes(false)
                              setIsCodesDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Codes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isCodesDialogOpen} onOpenChange={setIsCodesDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedCoupon?.brand} - {selectedCoupon?.discount}
              </DialogTitle>
              <DialogDescription>
                {selectedCoupon?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Available</CardDescription>
                    <CardTitle className="text-2xl text-green-600">
                      {selectedCoupon?.availableCodes}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Used</CardDescription>
                    <CardTitle className="text-2xl text-gray-600">
                      {selectedCoupon?.usedCodes}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total</CardDescription>
                    <CardTitle className="text-2xl">
                      {selectedCoupon?.totalCodes}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>


              <div className="flex gap-2 mb-2">
                <Button
                  variant={!showUsedCodes ? "default" : "outline"}
                  onClick={() => setShowUsedCodes(false)}
                  className="flex-1"
                >
                  Available Codes ({selectedCoupon?.availableCodes})
                </Button>
                <Button
                  variant={showUsedCodes ? "default" : "outline"}
                  onClick={() => setShowUsedCodes(true)}
                  className="flex-1"
                >
                  Used Codes ({selectedCoupon?.usedCodes})
                </Button>
              </div>


              <div className="flex gap-2 mb-4">
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadCodes(selectedCoupon, false)}
                  disabled={!selectedCoupon || selectedCoupon.availableCodes === 0}
                >
                  Download Available Codes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownloadCodes(selectedCoupon, true)}
                  disabled={!selectedCoupon || selectedCoupon.usedCodes === 0}
                >
                  Download Used Codes
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {showUsedCodes ? "Used Coupon Codes" : "Available Coupon Codes"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCoupon?.allCodes
                      .filter(code => showUsedCodes ? code.isUsed : !code.isUsed)
                      .map((code, index) => (
                        <div
                          key={code.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              #{index + 1}
                            </span>
                            <code className="font-mono font-semibold">
                              {code.code}
                            </code>
                          </div>
                          <Badge variant={code.isUsed ? "secondary" : "default"}>
                            {code.isUsed ? "Used" : "Available"}
                          </Badge>
                        </div>
                      ))}
                    {selectedCoupon?.allCodes.filter(code => showUsedCodes ? code.isUsed : !code.isUsed).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No {showUsedCodes ? "used" : "available"} codes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
// Download handler for codes (must be outside component for Turbopack)
function handleDownloadCodes(selectedCoupon: CouponInventory | null, used: boolean) {
  if (!selectedCoupon) return;
  const codes = selectedCoupon.allCodes.filter(code => used ? code.isUsed : !code.isUsed);
  if (codes.length === 0) return;
  let content = `${selectedCoupon.brand} - ${selectedCoupon.discount}\n`;
  content += used ? 'Used Coupon Codes:\n' : 'Available Coupon Codes:\n';
  codes.forEach((code, idx) => {
    content += `${idx + 1}. ${code.code}\n`;
  });
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedCoupon.brand}-${selectedCoupon.discount}-${used ? 'used' : 'available'}-codes.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
}
