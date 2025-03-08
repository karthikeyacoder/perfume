import type { Product, Order } from "./db"

const API_URL = "/api"

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const res = await fetch(`${API_URL}/products`)
      if (!res.ok) throw new Error("Failed to fetch products")
      return res.json()
    },
    getById: async (id: string): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}`)
      if (!res.ok) throw new Error("Failed to fetch product")
      return res.json()
    },
    create: async (product: Omit<Product, "id">): Promise<Product> => {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
      if (!res.ok) throw new Error("Failed to create product")
      return res.json()
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update product")
      return res.json()
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete product")
    },
  },
  orders: {
    getAll: async (): Promise<Order[]> => {
      const res = await fetch(`${API_URL}/orders`)
      if (!res.ok) throw new Error("Failed to fetch orders")
      return res.json()
    },
    getById: async (id: string): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders/${id}`)
      if (!res.ok) throw new Error("Failed to fetch order")
      return res.json()
    },
    create: async (order: Omit<Order, "id">): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      })
      if (!res.ok) throw new Error("Failed to create order")
      return res.json()
    },
    update: async (id: string, updates: Partial<Order>): Promise<Order> => {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error("Failed to update order")
      return res.json()
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_URL}/orders/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete order")
    },
  },
}

