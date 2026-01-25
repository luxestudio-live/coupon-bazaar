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
import { Pencil, Trash2 } from "lucide-react"
import { EditBrandDialog } from "./edit-brand-dialog"
import Image from "next/image"
import { getBrands, deleteBrand } from "@/lib/firebase/brands"

export interface Brand {
  id: string
  name: string
  logoUrl: string
  description?: string
  couponCount?: number
}

interface BrandTableProps {
  onUpdate?: () => void
}

export function BrandTable({ onUpdate }: BrandTableProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    const brandsData = await getBrands()
    setBrands(brandsData)
  }

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand? All associated coupons will be affected.")) {
      const { error } = await deleteBrand(id)
      if (error) {
        alert("Error deleting brand: " + error)
      } else {
        loadBrands()
        onUpdate?.()
      }
    }
  }

  const handleEditSuccess = () => {
    loadBrands()
    setIsEditDialogOpen(false)
    setEditingBrand(null)
    onUpdate?.()
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Coupons</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No brands available. Add your first brand to get started.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className="h-10 w-10 relative rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      {brand.logoUrl ? (
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png"
                          }}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {brand.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {brand.couponCount || 0} coupons
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(brand)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(brand.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingBrand && (
        <EditBrandDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          brand={editingBrand}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  )
}
