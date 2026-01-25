"use client"

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
import { Search, Download, Eye, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PaymentDetails {
  id: string
  amount: number
  currency: string
  status: string
  method: string
  email: string | null
  contact: string | null
  createdAt: number
  bank: string | null
  wallet: string | null
  vpa: string | null
  acquirerData: any
}

interface UsedCode {
  id: string
  code: string
  couponId: string
  brand: string
  discount: string
  usedBy: string
  usedAt: any
}

export default function UsageHistoryPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usedCodes, setUsedCodes] = useState<UsedCode[]>([])
  const [filteredCodes, setFilteredCodes] = useState<UsedCode[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
        fetchUsageHistory()
      }
      setLoading(false)
    })
  }, [router])

  const fetchUsageHistory = async () => {
    try {
      console.log("Fetching usage history from couponCodes...")
      
      const codesRef = collection(db, "couponCodes")
      const usedQuery = query(codesRef, where("isUsed", "==", true))
      const codesSnapshot = await getDocs(usedQuery)
      
      console.log("Found " + codesSnapshot.size + " used codes")
      
      const couponMap = new Map()
      const usedCodesData: UsedCode[] = []
      
      for (const codeDoc of codesSnapshot.docs) {
        const codeData = codeDoc.data()
        
        let brand = "Unknown"
        let discount = ""
        
        if (!couponMap.has(codeData.couponId)) {
          const couponDoc = await getDocs(query(collection(db, "coupons"), where("__name__", "==", codeData.couponId)))
          if (!couponDoc.empty) {
            const couponData = couponDoc.docs[0].data()
            couponMap.set(codeData.couponId, {
              brand: couponData.brand || "Unknown",
              discount: couponData.discount || ""
            })
            brand = couponData.brand || "Unknown"
            discount = couponData.discount || ""
          }
        } else {
          const cached = couponMap.get(codeData.couponId)
          brand = cached.brand
          discount = cached.discount
        }
        
        usedCodesData.push({
          id: codeDoc.id,
          code: codeData.code,
          couponId: codeData.couponId,
          brand: brand,
          discount: discount,
          usedBy: codeData.usedBy || "Unknown",
          usedAt: codeData.usedAt
        })
      }
      
      usedCodesData.sort((a, b) => {
        if (!a.usedAt) return 1
        if (!b.usedAt) return -1
        return b.usedAt.toMillis() - a.usedAt.toMillis()
      })
      
      console.log("Processed " + usedCodesData.length + " used codes")
      setUsedCodes(usedCodesData)
      setFilteredCodes(usedCodesData)
    } catch (error) {
      console.error("Error fetching usage history:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert("Error loading usage history: " + errorMessage)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = usedCodes.filter(code => 
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.discount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.usedBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCodes(filtered)
    } else {
      setFilteredCodes(usedCodes)
    }
  }, [searchTerm, usedCodes])

  const fetchPaymentDetails = async (paymentId: string) => {
    setLoadingPayment(true)
    setPaymentDetails(null)
    setIsDialogOpen(true)
    
    try {
      const response = await fetch("/api/razorpay/payment-details?paymentId=" + paymentId)
      const data = await response.json()
      
      if (data.success && data.details) {
        setPaymentDetails(data.details)
      } else {
        alert("Could not fetch payment details: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error fetching payment details:", error)
      alert("Error fetching payment details")
    } finally {
      setLoadingPayment(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  const exportToCSV = async () => {
    try {
      const exportButton = document.querySelector('button') as HTMLButtonElement
      if (exportButton) {
        exportButton.disabled = true
        exportButton.textContent = "Fetching details..."
      }

      const enrichedData = []
      
      for (const code of filteredCodes) {
        let paymentInfo = {
          amount: "",
          email: "",
          contact: "",
          method: "",
          bank: "",
          wallet: "",
          vpa: "",
          rrn: ""
        }

        if (code.usedBy.startsWith("pay_")) {
          try {
            const response = await fetch("/api/razorpay/payment-details?paymentId=" + code.usedBy)
            const data = await response.json()
            
            if (data.success && data.details) {
              const details = data.details
              paymentInfo = {
                amount: details.amount ? "Rs " + details.amount : "",
                email: details.email || "",
                contact: details.contact || "",
                method: details.method || "",
                bank: details.bank || "",
                wallet: details.wallet || "",
                vpa: details.vpa || "",
                rrn: details.acquirerData?.rrn || ""
              }
            }
          } catch (error) {
            console.error("Error fetching payment details for " + code.usedBy, error)
          }
        }

        enrichedData.push({
          dateUsed: formatDate(code.usedAt),
          couponCode: code.code,
          brand: code.brand,
          discount: code.discount,
          paymentId: code.usedBy,
          amount: paymentInfo.amount,
          customerEmail: paymentInfo.email,
          customerPhone: paymentInfo.contact,
          paymentMethod: paymentInfo.method,
          bank: paymentInfo.bank,
          wallet: paymentInfo.wallet,
          upiId: paymentInfo.vpa,
          rrn: paymentInfo.rrn
        })
      }

      const csvContent = [
        ["Date Used", "Coupon Code", "Brand", "Discount", "Payment ID", "Amount", "Customer Email", "Customer Phone", "Payment Method", "Bank", "Wallet", "UPI ID", "RRN"].join(","),
        ...enrichedData.map(row => [
          row.dateUsed,
          row.couponCode,
          row.brand,
          row.discount,
          row.paymentId,
          row.amount,
          row.customerEmail,
          row.customerPhone ? "=\"" + row.customerPhone + "\"" : "",
          row.paymentMethod,
          row.bank,
          row.wallet,
          row.upiId,
          row.rrn
        ].join(","))
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "usage_history_" + new Date().toISOString().split("T")[0] + ".csv"
      a.click()

      if (exportButton) {
        exportButton.disabled = false
        exportButton.innerHTML = '<svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Export CSV'
      }
    } catch (error) {
      console.error("Error exporting CSV:", error)
      alert("Error exporting CSV")
    }
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

  const totalUsed = filteredCodes.length
  const uniqueCoupons = new Set(filteredCodes.map(c => c.couponId)).size
  const uniqueUsers = new Set(filteredCodes.map(c => c.usedBy)).size

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Usage History</h1>
          <p className="text-muted-foreground">
            Track all used coupon codes from your inventory
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Codes Used</CardDescription>
              <CardTitle className="text-3xl text-green-600">{totalUsed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Different Coupons</CardDescription>
              <CardTitle className="text-3xl">{uniqueCoupons}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Unique Customers</CardDescription>
              <CardTitle className="text-3xl">{uniqueUsers}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code, brand, discount, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Used Coupon Codes</CardTitle>
            <CardDescription>
              Showing {filteredCodes.length} of {usedCodes.length} used codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date Used</TableHead>
                    <TableHead>Coupon Code</TableHead>
                    <TableHead>Brand & Offer</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {searchTerm ? "No used codes found matching your search" : "No codes have been used yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(code.usedAt)}
                        </TableCell>
                        <TableCell>
                          <code className="font-mono font-semibold bg-muted px-2 py-1 rounded">
                            {code.code}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold">{code.brand}</p>
                            <p className="text-sm text-muted-foreground">{code.discount}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {code.usedBy.startsWith("pay_") ? code.usedBy.substring(0, 12) + "..." : code.usedBy}
                            </code>
                            {code.usedBy.startsWith("pay_") && (
                              <Badge variant="secondary" className="text-xs">Razorpay</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {code.usedBy.startsWith("pay_") ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPaymentId(code.usedBy)
                                fetchPaymentDetails(code.usedBy)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Payment ID: {selectedPaymentId}
            </DialogDescription>
          </DialogHeader>

          {loadingPayment ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paymentDetails ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <p className="font-semibold text-lg">₹{paymentDetails.amount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        <Badge variant={paymentDetails.status === "captured" ? "default" : "secondary"}>
                          {paymentDetails.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Payment Method:</span>
                      <p className="font-medium capitalize">{paymentDetails.method}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Created On:</span>
                      <p className="font-medium">
                        {new Date(paymentDetails.createdAt * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(paymentDetails.email || paymentDetails.contact) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {paymentDetails.email && (
                      <div>
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <p className="font-medium">{paymentDetails.email}</p>
                      </div>
                    )}
                    {paymentDetails.contact && (
                      <div>
                        <span className="text-sm text-muted-foreground">Contact:</span>
                        <p className="font-medium">{paymentDetails.contact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {(paymentDetails.bank || paymentDetails.wallet || paymentDetails.vpa) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment Method Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {paymentDetails.bank && (
                      <div>
                        <span className="text-sm text-muted-foreground">Bank:</span>
                        <p className="font-medium">{paymentDetails.bank}</p>
                      </div>
                    )}
                    {paymentDetails.wallet && (
                      <div>
                        <span className="text-sm text-muted-foreground">Wallet:</span>
                        <p className="font-medium">{paymentDetails.wallet}</p>
                      </div>
                    )}
                    {paymentDetails.vpa && (
                      <div>
                        <span className="text-sm text-muted-foreground">UPI ID:</span>
                        <p className="font-medium">{paymentDetails.vpa}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {paymentDetails.acquirerData && Object.keys(paymentDetails.acquirerData).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bank Transaction Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {paymentDetails.acquirerData.bank_transaction_id && (
                      <div>
                        <span className="text-sm text-muted-foreground">Bank Transaction ID:</span>
                        <p className="font-mono text-sm">{paymentDetails.acquirerData.bank_transaction_id}</p>
                      </div>
                    )}
                    {paymentDetails.acquirerData.rrn && (
                      <div>
                        <span className="text-sm text-muted-foreground">RRN (Reference Number):</span>
                        <p className="font-mono text-sm font-semibold">{paymentDetails.acquirerData.rrn}</p>
                      </div>
                    )}
                    {paymentDetails.acquirerData.upi_transaction_id && (
                      <div>
                        <span className="text-sm text-muted-foreground">UPI Transaction ID:</span>
                        <p className="font-mono text-sm">{paymentDetails.acquirerData.upi_transaction_id}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No payment details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
