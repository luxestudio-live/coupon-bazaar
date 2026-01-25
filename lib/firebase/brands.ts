import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  getDoc,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Brand } from "@/components/admin/brand-table"

const BRANDS_COLLECTION = "brands"

export interface BrandData {
  name: string
  logoUrl: string
  description?: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export const addBrand = async (brandData: Omit<BrandData, "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, BRANDS_COLLECTION), {
      ...brandData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const updateBrand = async (id: string, brandData: Partial<BrandData>) => {
  try {
    const brandRef = doc(db, BRANDS_COLLECTION, id)
    await updateDoc(brandRef, {
      ...brandData,
      updatedAt: Timestamp.now(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteBrand = async (id: string) => {
  try {
    await deleteDoc(doc(db, BRANDS_COLLECTION, id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const q = query(collection(db, BRANDS_COLLECTION), orderBy("name", "asc"))
    const querySnapshot = await getDocs(q)
    
    const brands: Brand[] = []
    
    // Get coupon counts for each brand
    for (const docSnap of querySnapshot.docs) {
      const brandData = docSnap.data()
      
      // Count coupons for this brand
      const couponsQuery = query(
        collection(db, "coupons"),
        where("brandId", "==", docSnap.id)
      )
      const couponsSnapshot = await getDocs(couponsQuery)
      
      brands.push({
        id: docSnap.id,
        ...brandData,
        couponCount: couponsSnapshot.size,
      } as Brand)
    }
    
    return brands
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

export const getBrandById = async (id: string): Promise<Brand | null> => {
  try {
    const docRef = doc(db, BRANDS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Brand
    }
    return null
  } catch (error) {
    console.error("Error fetching brand:", error)
    return null
  }
}
