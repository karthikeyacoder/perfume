"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Star, StarHalf, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

type Product = {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  gender: "Men" | "Women" | "Unisex"
  brand: string
  rating: number
  reviews: number
  discount: number
  slug: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Maison Louis Marie No.04",
    price: 150,
    originalPrice: 180,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0006.jpg-YRkV2XJ9JiUv1BHMFknuTQBzDunS4j.jpeg",
    category: "Perfume Oil",
    gender: "Unisex",
    brand: "Maison Louis Marie",
    rating: 4.8,
    reviews: 1243,
    discount: 17,
    slug: "maison-louis-marie-no04",
  },
  {
    id: 2,
    name: "WOMAN Signature Fragrance",
    price: 120,
    originalPrice: 150,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0004.jpg-iIpe3jjYQuKV6sqlygbieHb1I8afzI.jpeg",
    category: "Perfume",
    gender: "Women",
    brand: "WOMAN",
    rating: 4.6,
    reviews: 892,
    discount: 20,
    slug: "woman-signature",
  },
  {
    id: 3,
    name: "Maison Louis Marie Collection",
    price: 180,
    originalPrice: 220,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0007.jpg-bIeSD0JHQBvbqkaHj3iz9EiAlTGr5m.jpeg",
    category: "Perfume Oil",
    gender: "Unisex",
    brand: "Maison Louis Marie",
    rating: 4.9,
    reviews: 567,
    discount: 18,
    slug: "maison-louis-marie-collection",
  },
  {
    id: 4,
    name: "Luxury Collection Set",
    price: 450,
    originalPrice: 600,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0005.jpg-RNXoMjnsimSASxFJmhzSRPNnXOb76H.jpeg",
    category: "Gift Set",
    gender: "Unisex",
    brand: "Luxury Collection",
    rating: 4.7,
    reviews: 324,
    discount: 25,
    slug: "luxury-collection-set",
  },
]

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [filters, setFilters] = useState({
    priceRange: "",
    gender: "",
    discount: "0",
  })
  const [showFilterModal, setShowFilterModal] = useState(false)

  const brands = Array.from(new Set(products.map((p) => p.brand)))
  const priceRanges = ["Up to ₹300", "₹300 - ₹400", "₹400 - ₹600", "₹600 - ₹800", "Over ₹800"]

  useEffect(() => {
    let result = [...products]

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map((p) => Number.parseInt(p.replace(/[^\d]/g, "")))
      result = result.filter((p) => {
        if (filters.priceRange.startsWith("Up to")) return p.price <= min
        if (filters.priceRange.startsWith("Over")) return p.price > min
        return p.price >= min && p.price <= max
      })
    }

    if (filters.gender) {
      result = result.filter((p) => p.gender.toLowerCase() === filters.gender.toLowerCase())
    }

    if (filters.discount) {
      const discountValue = Number.parseInt(filters.discount)
      result = result.filter((p) => p.discount >= discountValue)
    }

    setFilteredProducts(result)
  }, [filters])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light">Shop All Fragrances</h1>
        </div>

        <div className="lg:flex lg:gap-8">
          <div className="lg:w-64 mb-8 lg:mb-0">
            <div className="lg:hidden mb-4">
              <Button onClick={() => setShowFilterModal(true)} className="w-full justify-between" variant="outline">
                Filters
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {showFilterModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold mb-4">Filters</h2>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={filters.priceRange === range}
                            onChange={() => setFilters((f) => ({ ...f, priceRange: range }))}
                          />
                          <span>{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Gender</h3>
                    <div className="space-y-2">
                      {["Male", "Female", "Other"].map((gender) => (
                        <label key={gender} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={filters.gender === gender}
                            onChange={() => setFilters((f) => ({ ...f, gender: gender }))}
                          />
                          <span>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Discount</h3>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="10"
                      value={filters.discount}
                      onChange={(e) => setFilters((f) => ({ ...f, discount: e.target.value }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>0%</span>
                      <span>{filters.discount}%</span>
                      <span>80%</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setShowFilterModal(false)}>Apply Filters</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="hidden lg:block space-y-6">
              <div>
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.priceRange === range}
                        onCheckedChange={() => setFilters((f) => ({ ...f, priceRange: range }))}
                      />
                      <span className="text-sm">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Gender</h3>
                <div className="space-y-2">
                  {["Men", "Women", "Unisex"].map((gender) => (
                    <label key={gender} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.gender === gender}
                        onCheckedChange={() => setFilters((f) => ({ ...f, gender: gender }))}
                      />
                      <span className="text-sm">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Discount</h3>
                <div className="space-y-2">
                  {["10", "25", "35", "50", "60"].map((discount) => (
                    <label key={discount} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.discount === discount}
                        onCheckedChange={() => setFilters((f) => ({ ...f, discount: discount }))}
                      />
                      <span className="text-sm">{discount}% or more</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} className="group border rounded-lg p-4 block">
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                    {product.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm group-hover:text-gray-600 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {product.rating % 1 !== 0 && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">₹{product.price}</span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

