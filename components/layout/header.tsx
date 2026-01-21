"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, Database, Code, MapPin } from "lucide-react"
import { AuthButton } from "../auth/auth-button"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg">
            <img src="/logo/tarlac-seal.png" alt="Tarlac Seal" />
          </div>  
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground">Tarlac Open Data Portal</p>
            <p className="text-xs text-muted-foreground">Provincial Government of Tarlac</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/datasets">
            <Button 
              variant="ghost" 
              className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/datasets") ? "bg-[#0B7A3E] text-white" : ""}`}
            >
              Datasets
            </Button>
          </Link>
          <Link href="/categories">
            <Button 
              variant="ghost" 
              className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/categories") ? "bg-[#0B7A3E] text-white" : ""}`}
            >
              Categories
            </Button>
          </Link>
          <Link href="/map">
            <Button 
              variant="ghost" 
              className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/map") ? "bg-[#0B7A3E] text-white" : ""}`}
            >
              Maps
            </Button>
          </Link>
          <Link href="/about">
            <Button 
              variant="ghost" 
              className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/about") ? "bg-[#0B7A3E] text-white" : ""}`}
            >
              About
            </Button>
          </Link>
          <Link href="/contribute">
            <Button 
              variant="ghost" 
              className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/contribute") ? "bg-[#0B7A3E] text-white" : ""}`}
            >
              Contribute
            </Button>
          </Link>
          <AuthButton></AuthButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`text-sm hover:bg-[#0B7A3E] hover:text-white ${isActive("/api-docs") || isActive("/gis") ? "bg-[#0B7A3E] text-white" : ""}`}
              >
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/api-docs" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Developer API
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/gis" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  GIS Data
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="flex flex-col px-4 py-4">
            <Link 
              href="/datasets" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/datasets") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Datasets
            </Link>
            <Link 
              href="/categories" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/categories") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/map" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/map") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Maps
            </Link>
            <Link 
              href="/about" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/about") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contribute" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/contribute") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contribute
            </Link>
            <Link 
              href="/login" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/login") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/api-docs" 
              className={`py-2 text-sm font-medium hover:text-[#0B7A3E] ${isActive("/api-docs") ? "text-[#0B7A3E]" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Developer API
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}