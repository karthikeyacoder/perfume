"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/CartContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const products = {
  "maison-louis-marie-no04": {
    name: "Maison Louis Marie No.04",
    price: 150,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0006.jpg-YRkV2XJ9JiUv1BHMFknuTQBzDunS4j.jpeg",
    description:
      "A sophisticated blend of sandalwood and cedarwood with a delicate touch of vanilla. This refined scent captures the essence of Bois de Balincourt.",
    volume: "15ml",
    type: "Perfume Oil",
  },
  "woman-signature": {
    name: "WOMAN Signature Fragrance",
    price: 120,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0004.jpg-iIpe3jjYQuKV6sqlygbieHb1I8afzI.jpeg",
    description:
      "A bold and feminine fragrance that combines floral notes with warm amber undertones. Perfect for the modern woman.",
    volume: "50ml",
    type: "Eau de Parfum",
  },
  "maison-louis-marie-collection": {
    name: "Maison Louis Marie Collection",
    price: 180,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0007.jpg-bIeSD0JHQBvbqkaHj3iz9EiAlTGr5m.jpeg",
    description:
      "The signature collection featuring our most beloved scent. A timeless fragrance that embodies luxury and sophistication.",
    volume: "15ml",
    type: "Perfume Oil",
  },
  "luxury-collection-set": {
    name: "Luxury Collection Set",
    price: 450,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0005.jpg-RNXoMjnsimSASxFJmhzSRPNnXOb76H.jpeg",
    description:
      "A complete set of our premium fragrances. Each bottle contains a unique scent crafted with the finest ingredients.",
    volume: "6 x 15ml",
    type: "Gift Set",
  },
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [showAddedToCartDialog, setShowAddedToCartDialog] = useState(false)
  const product = products[params.slug as keyof typeof products]
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = () => {
    addToCart({
      id: params.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    setShowAddedToCartDialog(true)
  }

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
          <h1 className="text-2xl font-light">Back to Shop</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="aspect-square relative bg-gray-50">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-8" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-light mb-2">{product.name}</h1>
              <p className="text-gray-600">
                {product.volume} / {product.type}
              </p>
            </div>

            <div className="text-2xl">₹{product.price}.00</div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleAddToCart}>
                  ADD TO CART
                </Button>
                <Button variant="outline" className="flex-1">
                  ADD TO WISHLIST
                </Button>
              </div>
            </div>

            {/* Expandable Sections */}
            {[
              {
                title: "FUNCTIONS",
                content:
                  "A luxurious fragrance that combines floral and oriental notes for a sophisticated and lasting scent.",
              },
              {
                title: "NOTES",
                content: "Top: Bergamot, Pink Pepper\nHeart: Orchid, Jasmine\nBase: Vanilla, Amber, Musk",
              },
              {
                title: "PAYMENT & DELIVERY",
                content: "Free shipping on orders over $150. Express delivery available.",
              },
            ].map((section) => (
              <div key={section.title} className="border-t pt-4">
                <button
                  className="w-full flex justify-between items-center py-2"
                  onClick={() => setActiveTab(activeTab === section.title ? null : section.title)}
                >
                  <span className="font-medium">{section.title}</span>
                  <ChevronDown
                    className={`transform transition-transform ${activeTab === section.title ? "rotate-180" : ""}`}
                  />
                </button>
                {activeTab === section.title && (
                  <div className="py-4 text-gray-600 whitespace-pre-line">{section.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-24">
          <h2 className="text-2xl font-light mb-12">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(products)
              .filter(([slug, _]) => slug !== params.slug)
              .map(([slug, product]) => (
                <Link
                  href={`/product/${slug}`}
                  key={slug}
                  className="group cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(`/product/${slug}`)
                  }}
                >
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium group-hover:text-gray-600">{product.name}</h3>
                    <div className="text-sm">₹{product.price}.00</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />
      <Dialog open={showAddedToCartDialog} onOpenChange={setShowAddedToCartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Added to Cart</DialogTitle>
            <DialogDescription>{product.name} has been added to your cart.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowAddedToCartDialog(false)}>
              Continue Shopping
            </Button>
            <Button asChild>
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

