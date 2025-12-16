"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/datasets?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      style={{
        backgroundImage: `url('/tarlac_capitol.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          Tarlac Open Data Portal
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/90 sm:text-xl">
          Discover, explore, and experiment with publicly available datasets from Tarlac Province
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <div className="relative flex-1 sm:max-w-lg">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search datasets by name, description, or tags..."
              className="h-12 w-full rounded-lg border-0 bg-card pl-12 pr-4 text-foreground shadow-lg placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="h-12 gap-2 bg-card text-foreground shadow-lg hover:bg-card/90"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>

        {/* Quick stats hint */}
        <p className="mt-6 text-sm text-primary-foreground/80">
          Browse 287+ datasets across 22 categories including education, health, agriculture, and more
        </p>
      </div>
    </section>
  )
}
