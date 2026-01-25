import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Coupon } from "@/lib/cart"
import { getAvailableCodesCount } from "./couponCodes"

const COUPONS_COLLECTION = "coupons"

export interface CouponData {
  brandId: string
  brand: string
  discount: string
  price: number
  stock: number
  description: string
  image: string
  hidden?: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const addCoupon = async (couponData: Omit<CouponData, "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, COUPONS_COLLECTION), {
      ...couponData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const addMultipleCoupons = async (coupons: Omit<CouponData, "createdAt" | "updatedAt">[]) => {
  try {
    const promises = coupons.map((coupon) =>
      addDoc(collection(db, COUPONS_COLLECTION), {
        ...coupon,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    )
    await Promise.all(promises)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const updateCoupon = async (id: string, couponData: Partial<CouponData>) => {
  try {
    const couponRef = doc(db, COUPONS_COLLECTION, id)
    await updateDoc(couponRef, {
      ...couponData,
      updatedAt: Timestamp.now(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteCoupon = async (id: string) => {
  try {
    await deleteDoc(doc(db, COUPONS_COLLECTION, id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getCoupons = async (): Promise<Coupon[]> => {
  try {
    const q = query(collection(db, COUPONS_COLLECTION), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const coupons: Coupon[] = []
    
    for (const document of querySnapshot.docs) {
      const data = document.data()
      // Get real-time available stock from couponCodes collection
      const availableStock = await getAvailableCodesCount(document.id)
      
      coupons.push({
        id: document.id,
        brand: data.brand,
        discount: data.discount,
        price: data.price,
        stock: availableStock,
        image: data.image,
        description: data.description,
        hidden: data.hidden || false,
      })
    }
    
    return coupons
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return []
  }
}

export const getCouponsByBrand = async (brandId: string): Promise<Coupon[]> => {
  try {
    const q = query(
      collection(db, COUPONS_COLLECTION),
      where("brandId", "==", brandId),
      orderBy("createdAt", "desc")
    )
    const querySnapshot = await getDocs(q)
    
    const coupons: Coupon[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      coupons.push({
        id: doc.id,
        brand: data.brand,
        discount: data.discount,
        price: data.price,
        stock: data.stock,
        image: data.image,
        description: data.description,
        hidden: data.hidden || false,
      })
    })
    
    return coupons
  } catch (error) {
    console.error("Error fetching coupons by brand:", error)
    return []
  }
}

export const toggleCouponVisibility = async (id: string, hidden: boolean) => {
  return updateCoupon(id, { hidden })
}
