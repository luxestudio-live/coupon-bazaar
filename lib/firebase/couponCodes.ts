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
  writeBatch,
  limit,
  getDoc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

const COUPON_CODES_COLLECTION = "couponCodes"

export interface CouponCode {
  id: string
  couponId: string
  code: string
  isUsed: boolean
  usedBy?: string
  usedAt?: Timestamp
  createdAt: Timestamp
}

// Add multiple coupon codes for a coupon
export const addCouponCodes = async (couponId: string, codes: string[]) => {
  try {
    const batch = writeBatch(db)
    const codesCollection = collection(db, COUPON_CODES_COLLECTION)
    
    codes.forEach((code) => {
      const docRef = doc(codesCollection)
      batch.set(docRef, {
        couponId,
        code: code.trim(),
        isUsed: false,
        createdAt: Timestamp.now(),
      })
    })
    
    await batch.commit()
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Get available codes for a coupon
export const getAvailableCodes = async (couponId: string, quantity: number): Promise<CouponCode[]> => {
  try {
    const q = query(
      collection(db, COUPON_CODES_COLLECTION),
      where("couponId", "==", couponId),
      where("isUsed", "==", false),
      // Also filter out any codes with legacy/manual 'used: true' field
      // Firestore does not support 'where' on two fields for same property, so filter in-memory
      limit(1000) // fetch more than needed, will filter below
    )
    const querySnapshot = await getDocs(q)
    let codes: CouponCode[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      // Exclude if legacy/manual 'used' is true
      if (!data.used) {
        codes.push({
          id: doc.id,
          ...data,
        } as CouponCode)
      }
    })
    // Return only up to requested quantity
    return codes.slice(0, quantity)
  } catch (error) {
    console.error("Error fetching available codes:", error)
    return []
  }
}

// Get count of available codes for a coupon
export const getAvailableCodesCount = async (couponId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, COUPON_CODES_COLLECTION),
      where("couponId", "==", couponId),
      where("isUsed", "==", false)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.size
  } catch (error) {
    console.error("Error counting available codes:", error)
    return 0
  }
}

// Mark codes as used
export const markCodesAsUsed = async (codeIds: string[], userId: string) => {
  try {
    const batch = writeBatch(db)
    
    codeIds.forEach((codeId) => {
      const docRef = doc(db, COUPON_CODES_COLLECTION, codeId)
      batch.update(docRef, {
        isUsed: true,
        usedBy: userId,
        usedAt: Timestamp.now(),
      })
    })
    
    await batch.commit()
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Delete all codes for a coupon
export const deleteCouponCodes = async (couponId: string) => {
  try {
    const q = query(
      collection(db, COUPON_CODES_COLLECTION),
      where("couponId", "==", couponId)
    )
    
    const querySnapshot = await getDocs(q)
    const batch = writeBatch(db)
    
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Get all codes for a coupon (admin view)
export const getCouponCodesByCouponId = async (couponId: string): Promise<CouponCode[]> => {
  try {
    const q = query(
      collection(db, COUPON_CODES_COLLECTION),
      where("couponId", "==", couponId)
    )
    
    const querySnapshot = await getDocs(q)
    const codes: CouponCode[] = []
    
    querySnapshot.forEach((doc) => {
      codes.push({
        id: doc.id,
        ...doc.data(),
      } as CouponCode)
    })
    
    // Sort by createdAt in memory instead of Firestore
    codes.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    
    return codes
  } catch (error) {
    console.error("Error fetching coupon codes:", error)
    return []
  }
}
