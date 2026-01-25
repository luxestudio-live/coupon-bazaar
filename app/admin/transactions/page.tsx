"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, query, orderBy, getDocs, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getCurrentUser } from "@/lib/firebase/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Order {
  id: string
  timestamp: any
  totalAmount: number
  paymentId: string
  customer?: {
    email?: string
    contact?: string
    name?: string
  }
  items: Array<{
    brand: string
    discount: string
    description: string
    price: number
    quantity: number
  }>
  couponCodes: Array<{
    code: string
    brand: string
    discount: string
  }>
}

export default function TransactionsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
        fetchOrders()
      }
      setLoading(false)
    })
  }, [router])

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders from Firestore...")
      const ordersRef = collection(db, "orders")
      const q = query(ordersRef, orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)
      
      console.log(`Found ${querySnapshot.size} orders`)
      
      const ordersData: Order[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log("Order data:", data)
        ordersData.push({
          id: doc.id,
          ...data
        } as Order)
      })
      
      console.log("Processed orders:", ordersData)
      setOrders(ordersData)
      setFilteredOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
      alert(`Error loading transactions: ${error}`)
    }
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.contact || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.brand.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.couponCodes.some(code => 
          code.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [searchTerm, orders])

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Order ID", "Date", "Customer Email", "Customer Contact", "Customer Name", "Amount", "Payment ID", "Items", "Coupons Count", "Coupon Codes"].join(","),
      ...filteredOrders.map(order => [
        order.id,
        formatDate(order.timestamp),
        order.customer?.email || "N/A",
        order.customer?.contact || "N/A",
        order.customer?.name || "N/A",
        order.totalAmount,
        order.paymentId,
        order.items.map(i => i.brand + " " + i.discount + " x" + i.quantity).join("; "),
        order.couponCodes.length,
        order.couponCodes.map(c => c.code).join("; ")
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailDialogOpen(true)
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

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = filteredOrders.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            View all orders and issued coupon codes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-3xl">{totalOrders}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">₹{totalRevenue}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Order Value</CardDescription>
              <CardTitle className="text-3xl">
                ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Export */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Order ID, Payment ID, Customer Email/Contact, Brand, or Coupon Code..."
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

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              Showing {filteredOrders.length} of {orders.length} transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment ID</TableHead>
                    <TableHead className="text-center">Coupons</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        {searchTerm ? "No transactions found matching your search" : "No transactions yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(order.timestamp)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {order.id.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                navigator.clipboard.writeText(order.id)
                                alert("Order ID copied to clipboard")
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            {order.customer?.email || order.customer?.contact ? (
                              <>
                                {order.customer.name && (
                                  <p className="font-medium">{order.customer.name}</p>
                                )}
                                {order.customer.email && (
                                  <p className="text-muted-foreground">{order.customer.email}</p>
                                )}
                                {order.customer.contact && (
                                  <p className="text-xs text-muted-foreground">{order.customer.contact}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No info</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                {item.brand} {item.discount} × {item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{order.totalAmount}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {order.paymentId.substring(0, 12)}...
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="font-semibold">
                            {order.couponCodes.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
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
      </main>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Transaction ID:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">{selectedOrder?.id}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  if (selectedOrder?.id) {
                    navigator.clipboard.writeText(selectedOrder.id)
                    alert("Transaction ID copied to clipboard")
                  }
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">{formatDate(selectedOrder.timestamp)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">₹{selectedOrder.totalAmount}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Payment ID:</span>
                    <p className="font-mono text-xs">{selectedOrder.paymentId}</p>
                  </div>
                </div>
              </div>

              {selectedOrder.customer && (selectedOrder.customer.email || selectedOrder.customer.contact) && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        {selectedOrder.customer.name && (
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{selectedOrder.customer.name}</p>
                          </div>
                        )}
                        {selectedOrder.customer.email && (
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{selectedOrder.customer.email}</p>
                          </div>
                        )}
                        {selectedOrder.customer.contact && (
                          <div>
                            <span className="text-muted-foreground">Contact:</span>
                            <p className="font-medium">{selectedOrder.customer.contact}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedOrder.customer && (selectedOrder.customer.email || selectedOrder.customer.contact || selectedOrder.customer.name) && (
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="grid gap-2 text-sm">
                        {selectedOrder.customer.name && (
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{selectedOrder.customer.name}</p>
                          </div>
                        )}
                        {selectedOrder.customer.email && (
                          <div>
                            <span className="text-muted-foreground">Email:</span>
                            <p className="font-medium">{selectedOrder.customer.email}</p>
                          </div>
                        )}
                        {selectedOrder.customer.contact && (
                          <div>
                            <span className="text-muted-foreground">Contact:</span>
                            <p className="font-medium">{selectedOrder.customer.contact}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Items Purchased</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.brand} {item.discount}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Issued Coupon Codes</h3>
                  <Badge variant="default" className="text-base px-3 py-1">
                    {selectedOrder.couponCodes.length} {selectedOrder.couponCodes.length === 1 ? "Code" : "Codes"} Issued
                  </Badge>
                </div>
                <div className="space-y-2">
                  {selectedOrder.couponCodes.map((coupon, idx) => (
                    <Card key={idx} className="bg-primary/5">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">{coupon.brand} {coupon.discount}</p>
                            <p className="font-mono text-lg font-bold">{coupon.code}</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
