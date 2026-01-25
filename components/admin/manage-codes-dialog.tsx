"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { addCouponCodes, getCouponCodesByCouponId } from "@/lib/firebase/couponCodes"
import type { Coupon } from "@/lib/cart"

interface ManageCodesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon | null
  onSuccess: () => void
}

export function ManageCodesDialog({ open, onOpenChange, coupon, onSuccess }: ManageCodesDialogProps) {
  const [loading, setLoading] = useState(false)
  const [newCodes, setNewCodes] = useState("")
  const [stats, setStats] = useState({ total: 0, used: 0, available: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (open && coupon) {
      loadStats()
    }
  }, [open, coupon])

  const loadStats = async () => {
    if (!coupon) return
    
    setLoadingStats(true)
    const codes = await getCouponCodesByCouponId(coupon.id)
    const used = codes.filter((c) => c.isUsed).length
    const available = codes.filter((c) => !c.isUsed).length
    
    setStats({
      total: codes.length,
      used,
      available,
    })
    setLoadingStats(false)
  }

  const handleAddCodes = async () => {
    if (!coupon || !newCodes.trim()) return

    setLoading(true)
    try {
      const codes = newCodes
        .split('\n')
        .map(code => code.trim())
        .filter(code => code.length > 0)

      if (codes.length === 0) {
        alert("Please enter at least one code")
        setLoading(false)
        return
      }

      const { error } = await addCouponCodes(coupon.id, codes)
      
      if (error) {
        alert("Error adding codes: " + error)
      } else {
        setNewCodes("")
        await loadStats()
        onSuccess()
        alert(`Successfully added ${codes.length} new code(s)`)
      }
    } catch (error) {
      console.error("Failed to add codes:", error)
      alert("Error adding codes. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!coupon) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Coupon Codes</DialogTitle>
          <DialogDescription>
            {coupon.brand} - {coupon.discount}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 flex-shrink-0">
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{loadingStats ? "..." : stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Codes</div>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{loadingStats ? "..." : stats.available}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{loadingStats ? "..." : stats.used}</div>
              <div className="text-xs text-muted-foreground">Used</div>
            </div>
          </div>

          {/* Add new codes */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <Label htmlFor="new-codes" className="flex-shrink-0">Add New Codes</Label>
            <Textarea
              id="new-codes"
              value={newCodes}
              onChange={(e) => setNewCodes(e.target.value)}
              placeholder="NEWCODE1&#10;NEWCODE2&#10;NEWCODE3&#10;..."
              className="flex-1 min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground flex-shrink-0">
              Enter each new coupon code on a separate line
            </p>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleAddCodes} 
            disabled={loading || !newCodes.trim()}
          >
            {loading ? "Adding..." : "Add Codes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
