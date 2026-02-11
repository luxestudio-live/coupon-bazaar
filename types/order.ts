// Type definition for orders
export interface Order {
  id: string
  items: Array<{
    brand: string
    discount: string
    quantity: number
    codes: string[]
    price?: number
    description?: string
  }>
  total: number
  createdAt: string
}
