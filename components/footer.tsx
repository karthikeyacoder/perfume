export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">The Fragrance Chapter</h3>
            <p className="text-gray-400 text-sm">Luxury fragrances crafted with passion and precision.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">SHOP</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>All Fragrances</li>
              <li>New Arrivals</li>
              <li>Best Sellers</li>
              <li>Gift Sets</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">ABOUT</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Our Story</li>
              <li>Sustainability</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">CONTACT</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Customer Service</li>
              <li>Email: info@aadre.com</li>
              <li>Tel: +1 234 567 890</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div>© 2025 TFC. All rights reserved.</div>
            <div className="md:text-right space-x-4">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

