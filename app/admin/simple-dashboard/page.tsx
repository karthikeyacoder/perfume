"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, subDays, isSameDay } from "date-fns"
import { toast } from "sonner"
import { Package, ShoppingBag, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SimpleChart } from "@/components/simple-chart"
import type { Order } from "@/lib/db"

export default function SimpleDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin user is in localStorage
    const storedUser = localStorage.getItem("user")
    console.log("Stored user:", storedUser)

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        console.log("Parsed user:", parsedUser)
        setUser(parsedUser)

        if (parsedUser.role !== "admin") {
          console.log("User is not admin, redirecting")
          toast.error("You don't have permission to access the admin dashboard")
          router.push("/")
          return
        }

        setIsAuthenticated(true)
        // Fetch orders
        fetchOrders()
      } catch (error) {
        console.error("Error parsing stored user:", error)
        router.push("/admin-login")
      }
    } else {
      // No user found, redirect to admin login
      console.log("No user found, redirecting to login")
      router.push("/admin-login")
    }
  }, [router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("An error occurred while fetching orders")
    } finally {
      setIsLoading(false)
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

  // Prepare data for charts
  const prepareOrdersChartData = () => {
    // Last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i)
      const dayOrders = orders.filter((order) => isSameDay(new Date(order.createdAt), date))

      return {
        label: format(date, "dd/MM"),
        value: dayOrders.length,
        color: "#4f46e5",
      }
    }).reverse()

    return last7Days
  }

  const prepareStatusChartData = () => {
    const statusCounts = {
      pending: 0,
      processing: 0,
      packing: 0,
      dispatched: 0,
      delivered: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status as keyof typeof statusCounts]++
      }
    })

    return [
      { label: "Pending", value: statusCounts.pending, color: "#fbbf24" },
      { label: "Processing", value: statusCounts.processing, color: "#60a5fa" },
      { label: "Packing", value: statusCounts.packing, color: "#a78bfa" },
      { label: "Dispatched", value: statusCounts.dispatched, color: "#818cf8" },
      { label: "Delivered", value: statusCounts.delivered, color: "#34d399" },
      { label: "Cancelled", value: statusCounts.cancelled, color: "#f87171" },
    ]
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/admin-login")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checking authentication...</h1>
          <p>Please wait while we verify your credentials.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-light">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

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
                <Package className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold">{orders.filter((o) => o.status === "delivered").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Orders Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <SimpleChart data={prepareOrdersChartData()} title="Daily Orders" height={250} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <SimpleChart data={prepareStatusChartData()} title="Orders by Status" height={250} />
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center py-8">No orders found</p>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id.split("-")[1]}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), "MM/dd/yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

