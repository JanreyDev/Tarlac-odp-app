"use client"

import { useState } from "react"
import Link from "next/link"
import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"

type MarkerType = "school" | "hospital" | "infrastructure"
type BaseLayer = "all" | "schools" | "hospitals" | "infrastructure"

interface MapMarker {
  id: number
  x: number
  y: number
  type: MarkerType
  name: string
}

const markers: MapMarker[] = [
  { id: 1, x: 35, y: 25, type: "infrastructure", name: "Provincial Capitol" },
  { id: 2, x: 52, y: 35, type: "school", name: "Tarlac State University" },
  { id: 3, x: 48, y: 55, type: "hospital", name: "Tarlac Provincial Hospital" },
  { id: 4, x: 70, y: 40, type: "school", name: "Tarlac National High School" },
  { id: 5, x: 75, y: 55, type: "hospital", name: "Central Luzon Doctors Hospital" },
  { id: 6, x: 30, y: 70, type: "infrastructure", name: "Capas National Shrine" },
]

const markerColors: Record<MarkerType, string> = {
  school: "#3b82f6",
  hospital: "#ef4444",
  infrastructure: "#1e293b",
}

export function FeaturedMapsSection() {
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("all")
  const [showFloodAreas, setShowFloodAreas] = useState(false)
  const [showLandslide, setShowLandslide] = useState(false)

  const filteredMarkers = markers.filter((marker) => {
    if (baseLayer === "all") return true
    if (baseLayer === "schools") return marker.type === "school"
    if (baseLayer === "hospitals") return marker.type === "hospital"
    if (baseLayer === "infrastructure") return marker.type === "infrastructure"
    return true
  })

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#1a5d3a]">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0">
            <svg className="h-full w-full">
              <defs>
                <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center gap-8 px-8 py-12 md:flex-row md:justify-between md:px-16 md:py-16">
            {/* Left side - Text and CTA */}
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Geospatial Explorer</h2>
              <p className="mt-3 text-base text-white/80">
                Visualize infrastructure, hazard maps, and social services on our interactive provincial map.
              </p>
              <Link href="/maps" className="mt-6 inline-block">
                <Button variant="secondary" className="gap-2 bg-white text-[#1a5d3a] hover:bg-white/90">
                  <Map className="h-4 w-4" />
                  Launch Map Viewer
                </Button>
              </Link>
            </div>

            {/* Right side - Map preview placeholder */}
            <div className="flex h-48 w-full max-w-sm items-center justify-center rounded-lg border-2 border-slate-600 bg-slate-800 md:h-56 md:w-72">
              <span className="text-sm text-slate-400">Interactive Map Preview</span>
            </div>
          </div>
        </div>

        {/* Removed the interactive map and controls */}
      </div>
    </section>
  )
}
