"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/context/AuthContext"
import type { Order, Product } from "@/lib/db"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchOrderDetails = async () => {
      try {
        // Fetch order
        const orderResponse = await fetch(`/api/orders/${params.id}`)
        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order")
        }
        const orderData = await orderResponse.json()

        // Check if the order belongs to this user or if user is admin
        if (orderData.userId !== user.id && user.role !== "admin") {
          router.push("/account/orders")
          return
        }

        setOrder(orderData)

        // Fetch all products to get product details
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products")
        }
        const productsData = await productsResponse.json()

        // Convert to a map for easy lookup
        const productsMap = productsData.reduce((acc: Record<string, Product>, product: Product) => {
          acc[product.id] = product
          return acc
        }, {})

        setProducts(productsMap)
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id, user, router])

  if (!user) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "processing":
      case "packing":
        return <Package className="h-5 w-5" />
      case "dispatched":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const renderSkeleton = () => (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/account/orders">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <Skeleton className="h-8 w-36" />
          </div>

          {renderSkeleton()}
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light">Order #{order.id.split("-")[1]}</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex justify-between mb-4">
                {["pending", "processing", "dispatched", "delivered"].map((status, index) => (
                  <div
                    key={status}
                    className={`flex flex-col items-center z-10 ${
                      ["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) >= index
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`rounded-full p-2 border ${
                        ["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) >= index
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <span className="text-xs mt-2 capitalize">{status}</span>
                  </div>
                ))}
              </div>

              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) * 33.33}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Current Status: <span className="font-medium capitalize">{order.status}</span>
              </p>
              {order.statusHistory.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Last Updated:{" "}
                  {format(
                    new Date(order.statusHistory[order.statusHistory.length - 1].timestamp),
                    "MMMM d, yyyy h:mm a",
                  )}
                </p>
              )}
              {order.trackingInfo && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Tracking Information</p>
                  <p className="text-sm text-gray-600">Tracking Number: {order.trackingInfo.number}</p>
                  <Link href={order.trackingInfo.url} target="_blank" className="text-sm text-primary hover:underline">
                    Track Package
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item) => {
                    const product = products[item.productId]
                    if (!product) return null

                    return (
                      <div key={item.productId} className="flex gap-4">
                        <div className="relative w-20 h-20">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`} className="font-medium hover:underline">
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {product.volume} / {product.type}
                          </p>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="font-medium">₹{(product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.shippingAddress && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

