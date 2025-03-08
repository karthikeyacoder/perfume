"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const featuredProducts = [
  {
    id: 1,
    name: "Maison Louis Marie No.04",
    price: "150.00",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0006.jpg-YRkV2XJ9JiUv1BHMFknuTQBzDunS4j.jpeg",
    description: "Bois de Balincourt Perfume Oil",
    slug: "maison-louis-marie-no04",
  },
  {
    id: 2,
    name: "WOMAN",
    price: "120.00",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0004.jpg-iIpe3jjYQuKV6sqlygbieHb1I8afzI.jpeg",
    description: "Signature Feminine Fragrance",
    slug: "woman-signature",
  },
  {
    id: 3,
    name: "Maison Louis Marie Collection",
    price: "180.00",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0007.jpg-bIeSD0JHQBvbqkaHj3iz9EiAlTGr5m.jpeg",
    description: "Premium Perfume Oil",
    slug: "maison-louis-marie-collection",
  },
  {
    id: 4,
    name: "Luxury Collection Set",
    price: "450.00",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20250226-WA0005.jpg-RNXoMjnsimSASxFJmhzSRPNnXOb76H.jpeg",
    description: "Complete Fragrance Collection",
    slug: "luxury-collection-set",
  },
]

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <Image
          src="https://t4.ftcdn.net/jpg/08/37/03/19/360_F_837031924_hUAuxdmvXIDDbx6ttIQp8oBiNc1dyLvX.jpg"
          alt="Luxury perfume"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 h-full flex items-center" data-aos="fade-up">
          <div className="text-white space-y-6 max-w-2xl">
            <div className="text-sm tracking-wide">SIGNATURE COLLECTION</div>
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              Luxury Fragrances
              <br />
              For Every Occasion
            </h1>
            <p className="text-lg opacity-90">
              Discover our collection of handcrafted perfumes,
              <br />
              made with the finest ingredients from around the world.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Explore Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12" data-aos="fade-up">
          <h2 className="text-2xl font-light">Signature Fragrances</h2>
          <p className="text-gray-600">Handcrafted with passion and precision</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, i) => (
            <div key={i} className="group cursor-pointer" data-aos="fade-up" data-aos-delay={i * 100}>
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square mb-4 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-sm font-medium group-hover:text-gray-600">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.description}</p>
                  <div className="text-sm">₹{product.price}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div className="bg-[#F8F8F8] p-8 flex items-center" data-aos="fade-right">
          <div className="space-y-4">
            <div className="text-sm tracking-wide">NEW ARRIVAL</div>
            <h3 className="text-2xl font-light">
              Limited Edition
              <br />
              Summer Collection
            </h3>
            <Button variant="link" className="p-0 text-black hover:text-gray-600">
              Discover Now →
            </Button>
          </div>
        </div>
        <div className="bg-[#E8EFEA] p-8 flex items-center" data-aos="fade-left">
          <div className="space-y-4">
            <h3 className="text-2xl font-light">25% Off Selected Fragrances</h3>
            <p className="text-gray-600">Experience luxury for less</p>
            <Button variant="link" className="p-0 text-black hover:text-gray-600">
              Shop Now →
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

