"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Layers, Plus, Minus, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Tarlac province boundary polygon (simplified)
const tarlacBoundary = [
  { x: 45, y: 15 },
  { x: 75, y: 10 },
  { x: 85, y: 25 },
  { x: 80, y: 55 },
  { x: 60, y: 70 },
  { x: 40, y: 60 },
  { x: 35, y: 35 },
]

// Sample data points for different layers
const schoolPoints = [
  { id: 1, x: 55, y: 25, name: "Tarlac State University", type: "school" },
  { id: 2, x: 70, y: 45, name: "Paniqui National High School", type: "school" },
  { id: 3, x: 48, y: 50, name: "Gerona Elementary School", type: "school" },
  { id: 4, x: 62, y: 35, name: "Camiling Central School", type: "school" },
  { id: 5, x: 75, y: 30, name: "Concepcion National HS", type: "school" },
]

const hospitalPoints = [
  { id: 1, x: 52, y: 40, name: "Tarlac Provincial Hospital", type: "hospital" },
  { id: 2, x: 68, y: 20, name: "Ramos General Hospital", type: "hospital" },
  { id: 3, x: 78, y: 50, name: "Central Luzon Doctors Hospital", type: "hospital" },
  { id: 4, x: 45, y: 55, name: "Gerona District Hospital", type: "hospital" },
]

const infrastructurePoints = [
  { id: 1, x: 38, y: 45, name: "Provincial Capitol", type: "infrastructure" },
  { id: 2, x: 58, y: 60, name: "Public Market", type: "infrastructure" },
  { id: 3, x: 50, y: 28, name: "Municipal Hall", type: "infrastructure" },
  { id: 4, x: 72, y: 38, name: "Fire Station", type: "infrastructure" },
  { id: 5, x: 65, y: 55, name: "Water Treatment Plant", type: "infrastructure" },
]

// Flood prone area polygon
const floodProneArea = [
  { x: 50, y: 35 },
  { x: 65, y: 30 },
  { x: 70, y: 45 },
  { x: 60, y: 55 },
  { x: 48, y: 50 },
]

// Landslide susceptibility area
const landslideArea = [
  { x: 70, y: 15 },
  { x: 82, y: 20 },
  { x: 80, y: 35 },
  { x: 68, y: 30 },
]

type BaseLayer = "all" | "schools" | "hospitals" | "infrastructure"

export function InteractiveMap() {
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("all")
  const [showFloodAreas, setShowFloodAreas] = useState(false)
  const [showLandslideAreas, setShowLandslideAreas] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [mouseCoords, setMouseCoords] = useState({ lat: 15.48, lng: 120.59 })
  const [selectedPoint, setSelectedPoint] = useState<{ name: string; type: string } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Convert to approximate Tarlac coordinates
    const lat = 15.8 - (y / 100) * 0.8
    const lng = 120.2 + (x / 100) * 0.8

    setMouseCoords({ lat: Number(lat.toFixed(2)), lng: Number(lng.toFixed(2)) })
  }, [])

  const getVisiblePoints = () => {
    switch (baseLayer) {
      case "schools":
        return { schools: schoolPoints, hospitals: [], infrastructure: [] }
      case "hospitals":
        return { schools: [], hospitals: hospitalPoints, infrastructure: [] }
      case "infrastructure":
        return { schools: [], hospitals: [], infrastructure: infrastructurePoints }
      default:
        return { schools: schoolPoints, hospitals: hospitalPoints, infrastructure: infrastructurePoints }
    }
  }

  const visiblePoints = getVisiblePoints()

  const polygonToPath = (points: { x: number; y: number }[]) => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-background overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Map Layers</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Select visible datasets</p>

          {/* Base Data Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Base Data</h3>
            <RadioGroup value={baseLayer} onValueChange={(v) => setBaseLayer(v as BaseLayer)}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="text-sm font-normal cursor-pointer">
                    All Layers
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schools" id="schools" />
                  <Label htmlFor="schools" className="text-sm font-normal cursor-pointer">
                    Schools
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hospitals" id="hospitals" />
                  <Label htmlFor="hospitals" className="text-sm font-normal cursor-pointer">
                    Hospitals
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="infrastructure" id="infrastructure" />
                  <Label htmlFor="infrastructure" className="text-sm font-normal cursor-pointer">
                    Infrastructure
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Hazards Overlay Section */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Hazards (Overlay)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flood"
                  checked={showFloodAreas}
                  onCheckedChange={(checked) => setShowFloodAreas(checked as boolean)}
                />
                <Label htmlFor="flood" className="text-sm font-normal cursor-pointer">
                  Flood Prone Areas (100yr)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="landslide"
                  checked={showLandslideAreas}
                  onCheckedChange={(checked) => setShowLandslideAreas(checked as boolean)}
                />
                <Label htmlFor="landslide" className="text-sm font-normal cursor-pointer">
                  Landslide Susceptibility
                </Label>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="border-t border-border pt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Downloads</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                GeoJSON
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Shapefile
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                KML
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Map Area */}
      <main className="relative flex-1 bg-muted/30">
        {/* Map SVG */}
        <svg
          viewBox="0 0 100 80"
          className="h-full w-full"
          onMouseMove={handleMouseMove}
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 9.9%, oklch(0.9 0 0) 10%), repeating-linear-gradient(90deg, transparent, transparent 9.9%, oklch(0.9 0 0) 10%)",
          }}
        >
          {/* Province Boundary */}
          <path
            d={polygonToPath(tarlacBoundary)}
            fill="oklch(0.85 0.15 145 / 0.3)"
            stroke="oklch(0.6 0.2 145)"
            strokeWidth="0.5"
          />

          {/* Flood Prone Area Overlay */}
          {showFloodAreas && (
            <path
              d={polygonToPath(floodProneArea)}
              fill="oklch(0.7 0.15 250 / 0.3)"
              stroke="oklch(0.5 0.2 250)"
              strokeWidth="0.3"
              strokeDasharray="1,0.5"
            />
          )}

          {/* Landslide Area Overlay */}
          {showLandslideAreas && (
            <path
              d={polygonToPath(landslideArea)}
              fill="oklch(0.7 0.15 30 / 0.3)"
              stroke="oklch(0.5 0.2 30)"
              strokeWidth="0.3"
              strokeDasharray="1,0.5"
            />
          )}

          {/* School Points */}
          {visiblePoints.schools.map((point) => (
            <circle
              key={`school-${point.id}`}
              cx={point.x}
              cy={point.y}
              r={zoom > 1 ? 1.2 : 1.5}
              fill="oklch(0.6 0.2 250)"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedPoint({ name: point.name, type: "School" })}
            />
          ))}

          {/* Hospital Points */}
          {visiblePoints.hospitals.map((point) => (
            <circle
              key={`hospital-${point.id}`}
              cx={point.x}
              cy={point.y}
              r={zoom > 1 ? 1.2 : 1.5}
              fill="oklch(0.6 0.2 25)"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedPoint({ name: point.name, type: "Hospital" })}
            />
          ))}

          {/* Infrastructure Points */}
          {visiblePoints.infrastructure.map((point) => (
            <circle
              key={`infra-${point.id}`}
              cx={point.x}
              cy={point.y}
              r={zoom > 1 ? 1.2 : 1.5}
              fill="oklch(0.3 0 0)"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedPoint({ name: point.name, type: "Infrastructure" })}
            />
          ))}
        </svg>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-0.5 rounded-lg border border-border bg-background shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-b-none"
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="h-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-t-none"
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-background px-4 py-2 shadow-sm">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.6 0.2 250)" }} />
              <span>School</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.6 0.2 25)" }} />
              <span>Hospital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "oklch(0.3 0 0)" }} />
              <span>Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          <div>
            Coordinates: {mouseCoords.lat}° N, {mouseCoords.lng}° E
          </div>
          <div>Datum: WGS84</div>
        </div>

        {/* Selected Point Popup */}
        {selectedPoint && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-lg border border-border bg-background p-3 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{selectedPoint.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPoint.type}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-1 -mt-1"
                onClick={() => setSelectedPoint(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
