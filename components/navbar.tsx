"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserIcon, LogOutIcon, PackageIcon, FileTextIcon } from "lucide-react"

export function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const router = useRouter()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-xl font-medium">
                The Fragarence Chapter
              </Link>
              <Link href="/shop" className="text-sm hover:text-gray-600">
                Shop
              </Link>
              <Link href="/blog" className="text-sm hover:text-gray-600">
                Blog
              </Link>
              <Link href="/elements" className="text-sm hover:text-gray-600">
                Elements
              </Link>
              <Link href="/admin-login" className="text-sm text-blue-600 hover:text-blue-800">
                Admin Login
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/shop" className="text-sm hover:text-gray-600">
            Shop
          </Link>
          <Link href="/blog" className="text-sm hover:text-gray-600">
            Blog
          </Link>
          <Link href="/elements" className="text-sm hover:text-gray-600">
            Elements
          </Link>
          <Link href="/admin-login" className="text-sm text-blue-600 hover:text-blue-800">
            Admin Login
          </Link>
        </nav>

        <Link href="/" className="text-2xl font-medium">
          The Fragarence Chapter
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === "admin" ? "/admin/simple-dashboard" : "/account"}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{user.role === "admin" ? "Admin Dashboard" : "My Account"}</span>
                  </Link>
                </DropdownMenuItem>
                {user.role !== "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">
                        <PackageIcon className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/bills">
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        <span>Download Bills</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

