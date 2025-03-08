"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function CartPage() {
  const { cart, addToCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(cart.map((item) => [item.id, item.quantity])),
  )

  useEffect(() => {
    // Update quantities when cart changes
    setQuantities(Object.fromEntries(cart.map((item) => [item.id, item.quantity])))
  }, [cart])

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }))
      addToCart({ id, name: "", price: 0, quantity: newQuantity, image: "" })
    }
  }

  const handleRemove = (id: string) => {
    removeFromCart(id)
    setQuantities((prev) => {
      const newQuantities = { ...prev }
      delete newQuantities[id]
      return newQuantities
    })
  }

  const subtotal = cart.reduce((total, item) => total + item.price * quantities[item.id], 0)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <Link href={`/product/${item.id}`} className="flex items-center space-x-4 flex-grow">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{quantities[item.id]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-6" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

