"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, error } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For demo purposes, directly check admin credentials
      if (email === "admin@fragrancechapter.com" && password === "admin123") {
        // Manually set admin user in localStorage for demo
        const adminUser = {
          id: "admin-1",
          email: "admin@fragrancechapter.com",
          name: "Admin User",
          role: "admin",
        }
        localStorage.setItem("user", JSON.stringify(adminUser))

        toast.success("Admin login successful")
        router.push("/admin/simple-dashboard")
        return
      }

      const success = await login(email, password)
      if (success) {
        toast.success("Login successful")
        router.push("/")
      } else {
        toast.error(error || "Invalid credentials")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast.error("An error occurred during login")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-light">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-800">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black font-medium hover:text-gray-800">
                Sign up
              </Link>
            </p>

            <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>
                <strong>Admin:</strong> admin@fragrancechapter.com / admin123
              </p>
              <p>
                <strong>Customer:</strong> customer@example.com / password123
              </p>
            </div>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

