import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="w-full bg-[#4A5B4B] text-white text-center text-sm py-1">Free shipping on all US orders $50+</div>

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-sm hover:text-gray-600">
              HOME
            </Link>
            <Link href="#" className="text-sm hover:text-gray-600">
              ELEMENTS
            </Link>
            <Link href="#" className="text-sm hover:text-gray-600">
              SHOP
            </Link>
            <Link href="#" className="text-sm hover:text-gray-600">
              BLOG
            </Link>
            <Link href="#" className="text-sm hover:text-gray-600">
              PAGES
            </Link>
          </nav>

          <Link href="/" className="text-2xl font-medium">
            GLOWING
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="text-sm tracking-wide text-gray-600">ESSENTIAL ITEMS</div>
            <h1 className="text-4xl md:text-5xl font-light leading-tight">
              Beauty Inspired
              <br />
              by Real Life
            </h1>
            <p className="text-gray-600">
              Simple, clean design, non-toxic ingredients, our products
              <br />
              are designed for everyone.
            </p>
            <Button className="rounded-none bg-black hover:bg-gray-800">Shop Now</Button>
          </div>
          <div className="relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Z6c3BNnOcU5xgiL91KQRFWpJyFRRis.png"
              alt="Glowing facial oil product"
              width={600}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-2xl font-light">Our Featured Products</h2>
          <p className="text-gray-600">Just the skin you want to feel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="relative aspect-square mb-4">
                <Image src="/placeholder.svg" alt="Product image" fill className="object-cover" />
                {item === 1 && (
                  <span className="absolute top-4 right-4 bg-[#4A5B4B] text-white text-xs px-2 py-1">NEW</span>
                )}
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-sm font-medium group-hover:text-gray-600">Natural Cream Cleansing Gel</h3>
                <div className="text-sm">$24.00 - $48.00</div>
                <div className="flex justify-center">
                  {"★★★★☆".split("").map((star, i) => (
                    <span key={i} className="text-yellow-400">
                      {star}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div className="bg-[#F8F8F8] p-8 flex items-center">
          <div className="space-y-4">
            <div className="text-sm tracking-wide">NEW EDUCATION</div>
            <h3 className="text-2xl font-light">
              Intensive Glow C+
              <br />
              Serum
            </h3>
            <Button variant="link" className="p-0 text-black hover:text-gray-600">
              Explore More →
            </Button>
          </div>
        </div>
        <div className="bg-[#E8EFEA] p-8 flex items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-light">25% Off Everything</h3>
            <p className="text-gray-600">Limited time offer ending soon!</p>
            <Button variant="link" className="p-0 text-black hover:text-gray-600">
              Shop Now →
            </Button>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { title: "Free Shipping", desc: "Free Shipping on orders over $50" },
            { title: "Returns", desc: "Within 30 days for an exchange" },
            { title: "Online Support", desc: "24 hours a day, 7 days a week" },
            { title: "Flexible Payment", desc: "Pay with Multiple Credit Cards" },
          ].map((feature, i) => (
            <div key={i} className="space-y-4">
              <div className="w-12 h-12 mx-auto border rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-300" />
              </div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-12">As seen in</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { brand: "Parker & Co", text: "Best the customer service is phenomenal. I would purchase again." },
              { brand: "HAYDEN", text: "Great product line. Very effective staff to deal with." },
              {
                brand: "GOOD MOOD",
                text: "Looking to affordably upgrade your everyday skincare? Look no further than Glowing.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="space-y-4">
                <div className="text-xl font-serif">{testimonial.brand}</div>
                <p className="text-sm text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

