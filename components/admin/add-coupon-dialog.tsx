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
import { Plus, Trash2 } from "lucide-react"
import type { Brand } from "./brand-table"
import { getBrands } from "@/lib/firebase/brands"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { addCouponCodes } from "@/lib/firebase/couponCodes"

interface AddCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface CouponFormData {
  discount: string
  price: string
  description: string
  codes: string
}

export function AddCouponDialog({ open, onOpenChange, onSuccess }: AddCouponDialogProps) {
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [coupons, setCoupons] = useState<CouponFormData[]>([
    {
      discount: "",
      price: "",
      description: "",
      codes: "",
    },
  ])

  useEffect(() => {
    if (open) {
      loadBrands()
    }
  }, [open])

  const loadBrands = async () => {
    const brandsData = await getBrands()
    setBrands(brandsData)
  }

  const addCouponForm = () => {
    setCoupons([
      ...coupons,
      {
        discount: "",
        price: "",
        description: "",
        codes: "",
      },
    ])
  }

  const removeCouponForm = (index: number) => {
    if (coupons.length > 1) {
      setCoupons(coupons.filter((_, i) => i !== index))
    }
  }

  const updateCoupon = (index: number, field: keyof CouponFormData, value: string) => {
    const updated = [...coupons]
    updated[index][field] = value
    setCoupons(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedBrand) {
      alert("Please select a brand")
      return
    }

    setLoading(true)

    try {
      const brand = brands.find((b) => b.id === selectedBrand)
      if (!brand) return

      // Add each coupon with its codes
      for (const coupon of coupons) {
        // Split codes by newline and filter empty lines
        const codes = coupon.codes.split('\n').map(c => c.trim()).filter(c => c.length > 0)
        
        if (codes.length === 0) {
          alert("Please add at least one code for each coupon")
          setLoading(false)
          return
        }

        // Create coupon document
        const couponRef = await addDoc(collection(db, "coupons"), {
          brandId: selectedBrand,
          brand: brand.name,
          discount: coupon.discount,
          price: parseFloat(coupon.price),
          description: coupon.description,
          image: brand.logoUrl || "",
          hidden: false,
          createdAt: new Date(),
        })

        // Add individual codes for this coupon
        await addCouponCodes(couponRef.id, codes)
      }

      // Reset form
      setSelectedBrand("")
      setCoupons([
        {
          discount: "",
          price: "",
          description: "",
          codes: "",
        },
      ])
      
      onSuccess()
    } catch (error) {
      console.error("Failed to add coupons:", error)
      alert("Error adding coupons. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Coupons</DialogTitle>
          <DialogDescription>
            Select a brand and add one or multiple coupons for it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="brand">Select Brand *</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No brands available. Please add a brand first.
                    </div>
                  ) : (
                    brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {brands.length === 0 && (
                <p className="text-xs text-amber-600">
                  You need to add at least one brand before creating coupons.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Coupons</Label>
                <Button type="button" onClick={addCouponForm} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Coupon
                </Button>
              </div>

              {coupons.map((coupon, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                  {coupons.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeCouponForm(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                  
                  <div className="text-sm font-medium text-muted-foreground">
                    Coupon #{index + 1}
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`discount-${index}`}>Discount *</Label>
                      <Input
                        id={`discount-${index}`}
                        value={coupon.discount}
                        onChange={(e) => updateCoupon(index, "discount", e.target.value)}
                        placeholder="e.g., 50% Off, Flat ₹150 Off"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`price-${index}`}>Price (₹) *</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        value={coupon.price}
                        onChange={(e) => updateCoupon(index, "price", e.target.value)}
                        placeholder="99"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`description-${index}`}>Description *</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={coupon.description}
                        onChange={(e) => updateCoupon(index, "description", e.target.value)}
                        placeholder="Valid on orders above ₹999"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`codes-${index}`}>Coupon Codes (one per line) *</Label>
                      <Textarea
                        id={`codes-${index}`}
                        value={coupon.codes}
                        onChange={(e) => updateCoupon(index, "codes", e.target.value)}
                        placeholder="SAVE50&#10;DEAL100&#10;OFFER25&#10;..."
                        rows={4}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter each coupon code on a new line. Total codes = Stock available
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || brands.length === 0}>
              {loading ? "Adding..." : `Add ${coupons.length} Coupon${coupons.length > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
