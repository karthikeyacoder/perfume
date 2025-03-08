"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@fragrancechapter.com")
  const [password, setPassword] = useState("admin123")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.role === "admin") {
          // Already logged in as admin, redirect to dashboard
          router.push("/admin/simple-dashboard")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        // Clear invalid user data
        localStorage.removeItem("user")
      }
    }
  }, [router])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check admin credentials
      if (email === "admin@fragrancechapter.com" && password === "admin123") {
        // Set admin user in localStorage
        const adminUser = {
          id: "admin-1",
          email: "admin@fragrancechapter.com",
          name: "Admin User",
          role: "admin",
        }

        // Store admin user in localStorage
        localStorage.setItem("user", JSON.stringify(adminUser))

        toast.success("Admin login successful")

        // Redirect to admin dashboard using Next.js router
        router.push("/admin/simple-dashboard")
      } else {
        toast.error("Invalid admin credentials")
      }
    } catch (err) {
      console.error("Admin login error:", err)
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light">Admin Login</CardTitle>
            <CardDescription>Enter your admin credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login as Admin"}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
              <p className="font-medium mb-1">Admin Credentials:</p>
              <p>
                <strong>Email:</strong> admin@fragrancechapter.com
              </p>
              <p>
                <strong>Password:</strong> admin123
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

