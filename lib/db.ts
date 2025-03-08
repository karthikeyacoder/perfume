export type Product = {
  id: string
  name: string
  price: number
  image: string
  description: string
  volume: string
  type: string
}

export type User = {
  id: string
  email: string
  password: string // In a real app, this would be hashed
  name: string
  role: "customer" | "admin"
  orders: string[] // Array of order IDs
}

export type OrderStatus = "pending" | "processing" | "packing" | "dispatched" | "delivered" | "cancelled"

export type Order = {
  id: string
  userId: string
  items: { productId: string; quantity: number }[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  shippingAddress?: {
    fullName: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  trackingInfo?: {
    number: string
    url: string
  }
  statusHistory: {
    status: OrderStatus
    timestamp: string
    note?: string
  }[]
}

let products: Product[] = [
  {
    id: "maison-louis-marie-no04",
    name: "Maison Louis Marie No.04",
    price: 150,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0006.jpg-YRkV2XJ9JiUv1BHMFknuTQBzDunS4j.jpeg",
    description:
      "A sophisticated blend of sandalwood and cedarwood with a delicate touch of vanilla. This refined scent captures the essence of Bois de Balincourt.",
    volume: "15ml",
    type: "Perfume Oil",
  },
  {
    id: "woman-signature",
    name: "WOMAN Signature Fragrance",
    price: 120,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0004.jpg-iIpe3jjYQuKV6sqlygbieHb1I8afzI.jpeg",
    description:
      "A bold and feminine fragrance that combines floral notes with warm amber undertones. Perfect for the modern woman.",
    volume: "50ml",
    type: "Eau de Parfum",
  },
  {
    id: "maison-louis-marie-collection",
    name: "Maison Louis Marie Collection",
    price: 180,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0007.jpg-bIeSD0JHQBvbqkaHj3iz9EiAlTGr5m.jpeg",
    description:
      "The signature collection featuring our most beloved scent. A timeless fragrance that embodies luxury and sophistication.",
    volume: "15ml",
    type: "Perfume Oil",
  },
  {
    id: "luxury-collection-set",
    name: "Luxury Collection Set",
    price: 450,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0005.jpg-RNXoMjnsimSASxFJmhzSRPNnXOb76H.jpeg",
    description:
      "A complete set of our premium fragrances. Each bottle contains a unique scent crafted with the finest ingredients.",
    volume: "6 x 15ml",
    type: "Gift Set",
  },
]

let users: User[] = [
  {
    id: "admin-1",
    email: "admin@fragrancechapter.com",
    password: "admin123", // In a real app, this would be hashed
    name: "Admin User",
    role: "admin",
    orders: [],
  },
  {
    id: "user-1",
    email: "customer@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Sample Customer",
    role: "customer",
    orders: ["order-1"],
  },
]

let orders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    items: [
      { productId: "maison-louis-marie-no04", quantity: 2 },
      { productId: "woman-signature", quantity: 1 },
    ],
    total: 420,
    status: "processing",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
    shippingAddress: {
      fullName: "Sample Customer",
      address: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
      country: "India",
    },
    statusHistory: [
      {
        status: "pending",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        status: "processing",
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        note: "Payment confirmed",
      },
    ],
  },
]

export const db = {
  products: {
    getAll: () => products,
    getById: (id: string) => products.find((p) => p.id === id),
    create: (product: Omit<Product, "id">) => {
      const newProduct = { ...product, id: Date.now().toString() }
      products.push(newProduct)
      return newProduct
    },
    update: (id: string, updates: Partial<Product>) => {
      const index = products.findIndex((p) => p.id === id)
      if (index !== -1) {
        products[index] = { ...products[index], ...updates }
        return products[index]
      }
      return null
    },
    delete: (id: string) => {
      products = products.filter((p) => p.id !== id)
    },
  },
  users: {
    getAll: () => users,
    getById: (id: string) => users.find((u) => u.id === id),
    getByEmail: (email: string) => users.find((u) => u.email === email),
    create: (user: Omit<User, "id">) => {
      const newUser = { ...user, id: `user-${Date.now()}` }
      users.push(newUser)
      return newUser
    },
    update: (id: string, updates: Partial<User>) => {
      const index = users.findIndex((u) => u.id === id)
      if (index !== -1) {
        users[index] = { ...users[index], ...updates }
        return users[index]
      }
      return null
    },
    delete: (id: string) => {
      users = users.filter((u) => u.id !== id)
    },
  },
  orders: {
    getAll: () => orders,
    getById: (id: string) => orders.find((o) => o.id === id),
    getByUserId: (userId: string) => orders.filter((o) => o.userId === userId),
    create: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString()
      const newOrder = {
        ...order,
        id: `order-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      }
      orders.push(newOrder)

      // Add order ID to user's orders
      const userIndex = users.findIndex((u) => u.id === order.userId)
      if (userIndex !== -1) {
        users[userIndex].orders = [...users[userIndex].orders, newOrder.id]
      }

      return newOrder
    },
    update: (id: string, updates: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>) => {
      const index = orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        orders[index] = {
          ...orders[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        }
        return orders[index]
      }
      return null
    },
    updateStatus: (id: string, status: OrderStatus, note?: string) => {
      const index = orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        const timestamp = new Date().toISOString()
        const statusUpdate = { status, timestamp, note }

        orders[index] = {
          ...orders[index],
          status,
          updatedAt: timestamp,
          statusHistory: [...orders[index].statusHistory, statusUpdate],
        }
        return orders[index]
      }
      return null
    },
    delete: (id: string) => {
      // Remove order ID from user's orders first
      const order = orders.find((o) => o.id === id)
      if (order) {
        const userIndex = users.findIndex((u) => u.id === order.userId)
        if (userIndex !== -1) {
          users[userIndex].orders = users[userIndex].orders.filter((orderId) => orderId !== id)
        }
      }
      orders = orders.filter((o) => o.id !== id)
    },
  },
}

