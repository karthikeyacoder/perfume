"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Order } from "@/lib/db"

interface AccountOrdersProps {
  userId: string
}

export default function AccountOrders({ userId }: AccountOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and track your orders</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <PackageIcon className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and track your orders</CardDescription>
        </CardHeader>
      </Card>

      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Order #{order.id.split("-")[1]}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>{format(new Date(order.createdAt), "MMMM d, yyyy")}</span>
                </div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">
                  {order.items.reduce((total, item) => total + item.quantity, 0)} items
                </p>
                <p className="font-medium">₹{order.total.toFixed(2)}</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/account/orders/${order.id}`} className="flex justify-between">
                  View Order Details
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

