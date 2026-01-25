import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Coupon {
  id: string
  brand: string
  discount: string
  price: number
  stock: number
  image: string
  description: string
  hidden?: boolean
}

export interface CartItem extends Coupon {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (coupon: Coupon, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (coupon, quantity) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === coupon.id)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === coupon.id ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          })
        } else {
          set({ items: [...items, { ...coupon, quantity }] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "coupon-cart",
    },
  ),
)
