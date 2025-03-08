"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/AuthContext"
import AccountOrders from "./orders/orders"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-light mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Name</p>
                  <p>{user.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p>{user.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Account Type</p>
                  <p className="capitalize">{user.role}</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline">Edit Profile</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout()
                      toast.success("Logged out successfully")
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <AccountOrders userId={user.id} />
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 py-4">You haven't saved any addresses yet.</p>
                <Button>Add New Address</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

