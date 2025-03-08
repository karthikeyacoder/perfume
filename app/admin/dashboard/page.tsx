"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import { Package, Search, ShoppingBag, Truck, Users, Check, Clock, BoxIcon, BarChart3, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/AuthContext"
import type { Order, OrderStatus } from "@/lib/db"

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      console.log("No user found, redirecting to login")
      router.push("/login")
      return
    }

    // Check if user is admin
    if (user.role !== "admin") {
      console.log("User is not admin, redirecting to home")
      toast.error("You don't have permission to access the admin dashboard")
      router.push("/")
      return
    }

    console.log("Admin user authenticated, fetching orders")

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
          setFilteredOrders(data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, router])

  useEffect(() => {
    // Filter orders based on status and search query
    let result = [...orders]

    if (statusFilter && statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) => order.id.toLowerCase().includes(query) || order.userId.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(result)
  }, [orders, statusFilter, searchQuery])

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Status updated to ${newStatus} by admin`,
        }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("An error occurred while updating the order status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "packing":
        return "bg-purple-100 text-purple-800"
      case "dispatched":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "packing":
        return <BoxIcon className="h-4 w-4" />
      case "dispatched":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Check className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  // Debug information
  console.log("Current user:", user)
  console.log("Is loading:", isLoading)
  console.log("Orders count:", orders.length)

  // If user is not admin or not logged in, show a message
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-light mb-8">Loading...</h1>
          <p>Please wait while we check your credentials.</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-light mb-8">Access Denied</h1>
          <p>You don't have permission to access the admin dashboard.</p>
          <Button className="mt-4" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-light mb-8">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-blue-100 mr-4">
                <ShoppingBag className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold">{orders.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100 mr-4">
                <Truck className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="text-2xl font-semibold">
                  {orders.filter((o) => ["pending", "processing", "packing", "dispatched"].includes(o.status)).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-purple-100 mr-4">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Customers</p>
                <p className="text-2xl font-semibold">{new Set(orders.map((o) => o.userId)).size}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-red-100 mr-4">
                <RefreshCcw className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Returns</p>
                <p className="text-2xl font-semibold">
                  {Math.floor(orders.length * 0.08)} {/* Simulated 8% return rate */}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Visitors Overview</CardTitle>
              <CardDescription>Monthly website visitors</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Visitor analytics will be available soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders & Returns</CardTitle>
              <CardDescription>Monthly orders and returns</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Order analytics will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {["pending", "processing", "packing", "dispatched", "delivered", "cancelled"].map((status) => {
                const count = orders.filter((o) => o.status === status).length
                const percentage = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0

                return (
                  <div key={status} className="text-center">
                    <div
                      className={`rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center ${getStatusColor(status)}`}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <p className="mt-2 font-medium capitalize">{status}</p>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-500">{percentage}%</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="packing">Packing</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No orders found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.split("-")[1]}</TableCell>
                            <TableCell>{order.userId}</TableCell>
                            <TableCell>{format(new Date(order.createdAt), "MM/dd/yyyy")}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Select
                                  value={order.status}
                                  onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                                >
                                  <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Update status" />
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
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/admin/orders/${order.id}`}>View</Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-20 text-center text-gray-500">Product management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-20 text-center text-gray-500">Customer management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

