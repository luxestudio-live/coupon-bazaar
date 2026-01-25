"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye, EyeOff, PackagePlus } from "lucide-react"
import { EditCouponDialog } from "./edit-coupon-dialog"
import { ManageCodesDialog } from "./manage-codes-dialog"
import type { Coupon } from "@/lib/cart"
import { getCoupons, deleteCoupon, toggleCouponVisibility } from "@/lib/firebase/coupons"
import { deleteCouponCodes } from "@/lib/firebase/couponCodes"

interface CouponTableProps {
  onUpdate?: () => void
}

export function CouponTable({ onUpdate }: CouponTableProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [managingCoupon, setManagingCoupon] = useState<Coupon | null>(null)
  const [isManageCodesDialogOpen, setIsManageCodesDialogOpen] = useState(false)

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const data = await getCoupons()
      setCoupons(data)
    } catch (error) {
      console.error("Failed to load coupons:", error)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon? All associated codes will also be deleted.")) {
      const { error: codesError } = await deleteCouponCodes(id)
      const { error } = await deleteCoupon(id)
      if (error || codesError) {
        alert("Error deleting coupon: " + (error || codesError))
      } else {
        loadCoupons()
        onUpdate?.()
      }
    }
  }

  const handleManageCodes = (coupon: Coupon) => {
    setManagingCoupon(coupon)
    setIsManageCodesDialogOpen(true)
  }

  const handleManageCodesSuccess = () => {
    loadCoupons()
    onUpdate?.()
  }

  const handleToggleVisibility = async (id: string, currentHidden: boolean) => {
    const { error } = await toggleCouponVisibility(id, !currentHidden)
    if (error) {
      alert("Error updating coupon: " + error)
    } else {
      loadCoupons()
      onUpdate?.()
    }
  }

  const handleEditSuccess = () => {
    loadCoupons()
    setIsEditDialogOpen(false)
    setEditingCoupon(null)
    onUpdate?.()
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No coupons available. Add your first coupon to get started.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.brand}</TableCell>
                  <TableCell>{coupon.discount}</TableCell>
                  <TableCell>₹{coupon.price}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.stock < 10 ? "destructive" : "secondary"}>
                      {coupon.stock} left
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.hidden ? "outline" : "default"}>
                      {coupon.hidden ? "Hidden" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleManageCodes(coupon)}
                        title="Manage Codes"
                      >
                        <PackagePlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleVisibility(coupon.id, coupon.hidden || false)}
                        title={coupon.hidden ? "Show" : "Hide"}
                      >
                        {coupon.hidden ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(coupon)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

      <ManageCodesDialog
        open={isManageCodesDialogOpen}
        onOpenChange={setIsManageCodesDialogOpen}
        coupon={managingCoupon}
        onSuccess={handleManageCodesSuccess}
      />
        </Table>
      </div>

      {editingCoupon && (
        <EditCouponDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          coupon={editingCoupon}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
