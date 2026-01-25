"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/admin-header"
import { getCoupons } from "@/lib/firebase/coupons"
import { getDocs as getBrandDocs, collection as brandCollection } from "firebase/firestore"


interface Coupon {
  id: string
  code: string
  brand: string
  discount: string
  used?: boolean
  isUsed?: boolean
}

interface Brand {
  id: string
  name: string
}


export default function UnusedCouponsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [offers, setOffers] = useState<Coupon[]>([])
  const [selectedOffer, setSelectedOffer] = useState<string>("")
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [marking, setMarking] = useState<string | null>(null)

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      const snapshot = await getBrandDocs(brandCollection(db, "brands"))
      const data: Brand[] = []
      snapshot.forEach((doc) => {
        const d = doc.data()
        data.push({ id: doc.id, name: d.name })
      })
      setBrands(data)
    }
    fetchBrands()
  }, [])

  // Fetch offers when brand is selected (using getCoupons, then filter by brand)
  useEffect(() => {
    if (!selectedBrand) {
      setOffers([])
      setSelectedOffer("")
      return
    }
    const fetchOffers = async () => {
      const allCoupons = await getCoupons()
      const offers = allCoupons.filter(c => c.brand === brands.find(b => b.id === selectedBrand)?.name)
      setOffers(offers)
      setSelectedOffer("")
    }
    fetchOffers()
  }, [selectedBrand, brands])

  // Fetch unused coupons when offer is selected
  useEffect(() => {
    if (!selectedOffer) {
      setCoupons([])
      return
    }
    const fetchCoupons = async () => {
      setLoading(true)
      // Find the selected offer/coupon object for mapping brand/discount
      const offerObj = offers.find(o => o.id === selectedOffer)
      const q = query(
        collection(db, "couponCodes"),
        where("couponId", "==", selectedOffer)
      )
      const querySnapshot = await getDocs(q)
      const data: Coupon[] = []
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data()
        if ((d.isUsed === false || d.isUsed === undefined) && (d.used === false || d.used === undefined)) {
          data.push({
            id: docSnap.id,
            code: d.code,
            brand: d.brand || offerObj?.brand || "",
            discount: d.discount || offerObj?.discount || "",
            used: d.used,
            isUsed: d.isUsed,
          })
        }
      })
      setCoupons(data)
      setLoading(false)
    }
    fetchCoupons()
  }, [selectedOffer, offers])

  const markAsUsed = async (couponId: string) => {
    setMarking(couponId)
    const couponRef = doc(db, "couponCodes", couponId)
    await updateDoc(couponRef, { used: true, isUsed: true, usedBy: "admin", usedAt: new Date() })
    setCoupons((prev) => prev.filter((c) => c.id !== couponId))
    setMarking(null)
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Unused Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <select
                  className="border rounded px-3 py-2 min-w-[160px]"
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Offer</label>
                <select
                  className="border rounded px-3 py-2 min-w-[160px]"
                  value={selectedOffer}
                  onChange={e => setSelectedOffer(e.target.value)}
                  disabled={!selectedBrand}
                >
                  <option value="">Select Offer</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.id}>{offer.discount}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2">Code</th>
                    <th className="text-left px-4 py-2">Brand</th>
                    <th className="text-left px-4 py-2">Discount</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-right px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">Loading...</td></tr>
                  ) : coupons.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No unused coupons found.</td></tr>
                  ) : (
                    coupons.map((coupon) => (
                      <tr key={coupon.id} className="border-t">
                        <td className="px-4 py-2 font-mono">{coupon.code}</td>
                        <td className="px-4 py-2">{coupon.brand}</td>
                        <td className="px-4 py-2">{coupon.discount}</td>
                        <td className="px-4 py-2">
                          <span className="inline-block rounded bg-secondary px-2 py-1 text-xs">Unused</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={marking === coupon.id}
                            onClick={() => markAsUsed(coupon.id)}
                          >
                            {marking === coupon.id ? "Marking..." : "Mark as Used"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
