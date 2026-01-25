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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Coupon } from "@/lib/cart"
import type { Brand } from "./brand-table"
import { getBrands } from "@/lib/firebase/brands"
import { updateCoupon } from "@/lib/firebase/coupons"

interface EditCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon
  onSuccess: () => void
}

export function EditCouponDialog({ open, onOpenChange, coupon, onSuccess }: EditCouponDialogProps) {
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [formData, setFormData] = useState({
    discount: "",
    price: "",
    stock: "",
    description: "",
  })

  useEffect(() => {
    if (open) {
      loadBrands()
    }
    if (coupon) {
      loadBrands().then((brandsData) => {
        const matchingBrand = brandsData.find((b: Brand) => b.name === coupon.brand)
        if (matchingBrand) {
          setSelectedBrand(matchingBrand.id)
        }
      })
      
      setFormData({
        discount: coupon.discount,
        price: coupon.price.toString(),
        stock: coupon.stock.toString(),
        description: coupon.description || "",
      })
    }
  }, [coupon, open])

  const loadBrands = async () => {
    const brandsData = await getBrands()
    setBrands(brandsData)
    return brandsData
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement actual API call
      // const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
      //   method: "PUT",
      const brand = brands.find((b) => b.id === selectedBrand)
      if (!brand) return

      const { error } = await updateCoupon(coupon.id, {
        brandId: selectedBrand,
        brand: brand.name,
        discount: formData.discount,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        image: brand.logoUrl,
      })
      
      if (error) {
        alert("Error updating coupon: " + error)
      } else {
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to update coupon:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
          <DialogDescription>
            Update the coupon details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-discount">Discount</Label>
              <Input
                id="edit-discount"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="e.g., 50% Off, Flat ₹150 Off"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Valid on orders above ₹999"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
