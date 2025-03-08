"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { toast } from "sonner"
import { ChevronLeft, Check, Truck, Package, Clock, AlertTriangle, BoxIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/AuthContext"
import type { Order, OrderStatus, Product } from "@/lib/db"

export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [statusNote, setStatusNote] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      toast.error("You don't have permission to access this page")
      router.push("/")
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
        setOrder(orderData)

        if (orderData.trackingInfo) {
          setTrackingNumber(orderData.trackingInfo.number)
          setTrackingUrl(orderData.trackingInfo.url)
        }

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
        toast.error("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id, user, router])

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || `Status updated to ${newStatus} by admin`,
        }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrder(updatedOrder)
        setStatusNote("")
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("An error occurred while updating the order status")
    }
  }

  const updateTrackingInfo = async () => {
    if (!order) return

    if (!trackingNumber) {
      toast.error("Tracking number is required")
      return
    }

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingInfo: {
            number: trackingNumber,
            url: trackingUrl || `https://example.com/track?number=${trackingNumber}`,
          },
        }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrder(updatedOrder)
        toast.success("Tracking information updated")
      } else {
        toast.error("Failed to update tracking information")
      }
    } catch (error) {
      console.error("Error updating tracking info:", error)
      toast.error("An error occurred while updating tracking information")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "packing":
        return <BoxIcon className="h-5 w-5" />
      case "dispatched":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <Check className="h-5 w-5" />
      case "cancelled":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-light">Loading Order...</h1>
          </div>
          <div className="h-96 flex items-center justify-center">
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-light">Order Not Found</h1>
          </div>
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500 mb-4">The requested order could not be found</p>
              <Button asChild>
                <Link href="/admin/dashboard">Return to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
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
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light">Order #{order.id.split("-")[1]}</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Order Details</span>
                  <Badge
                    className={`capitalize ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription>Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-sm font-medium">Customer ID</p>
                      <p className="text-gray-600">{order.userId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Total</p>
                      <p className="text-gray-600">₹{order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Items</p>
                      <p className="text-gray-600">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Order Fulfillment Progress</h3>
                    <div className="relative">
                      <div className="flex justify-between mb-4">
                        {["pending", "processing", "packing", "dispatched", "delivered"].map((status, index) => (
                          <div
                            key={status}
                            className={`flex flex-col items-center z-10 ${
                              ["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) >=
                              index
                                ? "text-primary"
                                : "text-gray-400"
                            }`}
                          >
                            <div
                              className={`rounded-full p-2 border ${
                                ["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) >=
                                index
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
                            width: `${["pending", "processing", "packing", "dispatched", "delivered"].indexOf(order.status) * 25}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Update Order Status</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(value as OrderStatus)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="packing">Packing</SelectItem>
                            <SelectItem value="dispatched">Dispatched</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Add Status Note</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Status Note</DialogTitle>
                            <DialogDescription>
                              Add a note to the status update that will be visible in the order history.
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="E.g., Package delayed due to weather conditions"
                          />
                          <DialogFooter>
                            <Button onClick={() => updateOrderStatus(order.status as OrderStatus)}>
                              Update Status
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Add Tracking Information</h3>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="trackingNumber">Tracking Number</Label>
                          <Input
                            id="trackingNumber"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder="Enter tracking number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
                          <Input
                            id="trackingUrl"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            placeholder="https://example.com/track"
                          />
                        </div>
                      </div>
                      <Button onClick={updateTrackingInfo} disabled={!trackingNumber} variant="outline">
                        Update Tracking Info
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                        <div className="relative w-20 h-20 flex-shrink-0">
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

            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`rounded-full p-1.5 ${
                          history.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : history.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {getStatusIcon(history.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium capitalize">{history.status}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(history.timestamp), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                        {history.note && <p className="text-gray-600 text-sm mt-1">{history.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
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

                  {order.trackingInfo && (
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Tracking Information</h3>
                      <p className="text-sm">
                        Tracking #: <span className="font-mono">{order.trackingInfo.number}</span>
                      </p>
                      {order.trackingInfo.url && (
                        <a
                          href={order.trackingInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Track Shipment
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {order.shippingAddress && (
              <Card>
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

            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customer ID: {order.userId}</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href={`/admin/customers/${order.userId}`}>View Customer</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/account/bills?orderId=${order.id}`} target="_blank">
                    Generate Invoice
                  </Link>
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    toast.success("Email sent to customer with order details")
                  }}
                >
                  Send Order Update Email
                </Button>

                {order.status === "delivered" ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      toast.success("Delivery confirmation email sent to customer")
                    }}
                  >
                    Send Delivery Confirmation
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

