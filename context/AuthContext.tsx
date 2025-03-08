"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"

export type AuthUser = {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
}

type AuthContextType = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("User loaded from localStorage:", parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Special case for admin login in demo
      if (email === "admin@fragrancechapter.com" && password === "admin123") {
        const adminUser = {
          id: "admin-1",
          email: "admin@fragrancechapter.com",
          name: "Admin User",
          role: "admin",
        }
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        console.log("Admin user set:", adminUser)
        setIsLoading(false)
        return true
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to login")
        setIsLoading(false)
        return false
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
      setIsLoading(false)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to signup")
        setIsLoading(false)
        return false
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Signup error:", error)
      setError("An error occurred during signup")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, error }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

