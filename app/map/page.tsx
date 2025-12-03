"use client"

import { useMemo, useState } from "react"
import MapWrapper from "@/components/map/map-wrapper"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"

// Mock data
export type ItemType = "school" | "hospital" | "infrastructure"

type Item = {
  id: number
  lat: number
  lng: number
  title: string
  type: ItemType
}

const ALL_DATA: Item[] = [
  { id: 1, lat: 15.482, lng: 120.598, title: "Tarlac National High School", type: "school" },
  { id: 2, lat: 15.489, lng: 120.603, title: "Central Luzon State Hospital", type: "hospital" },
  { id: 3, lat: 15.464, lng: 120.587, title: "Camiling Elementary School", type: "school" },
  { id: 4, lat: 15.459, lng: 120.612, title: "Tarlac Provincial Hospital", type: "hospital" },
  { id: 5, lat: 15.505, lng: 120.595, title: "Concepcion High School", type: "school" },
  { id: 6, lat: 15.475, lng: 120.605, title: "Tarlac City Hall", type: "infrastructure" },
  { id: 7, lat: 15.490, lng: 120.590, title: "Provincial Capitol", type: "infrastructure" },
  { id: 8, lat: 15.470, lng: 120.600, title: "Central Bus Terminal", type: "infrastructure" },
]

export default function MapPage() {
  const [showSchools, setShowSchools] = useState(true)
  const [showHospitals, setShowHospitals] = useState(true)
  const [showInfrastructure, setShowInfrastructure] = useState(true)
  const [showFloodProne, setShowFloodProne] = useState(false)
  const [showLandslide, setShowLandslide] = useState(false)

  const allLayersChecked = showSchools && showHospitals && showInfrastructure
  const handleAllLayersToggle = (checked: boolean) => {
    setShowSchools(checked)
    setShowHospitals(checked)
    setShowInfrastructure(checked)
  }

  // Mock GeoJSON overlays (simplified squares near center)
  const floodGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Flood (100yr)" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [120.59, 15.49],
              [120.60, 15.49],
              [120.60, 15.50],
              [120.59, 15.50],
              [120.59, 15.49],
            ],
          ],
        },
      },
    ],
  }

  const landslideGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Landslide Susceptibility" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [120.605, 15.48],
              [120.615, 15.48],
              [120.615, 15.485],
              [120.605, 15.485],
              [120.605, 15.48],
            ],
          ],
        },
      },
    ],
  }

  const filtered = useMemo(() => {
    return ALL_DATA.filter((d) =>
      (d.type === "school" && showSchools) || 
      (d.type === "hospital" && showHospitals) ||
      (d.type === "infrastructure" && showInfrastructure),
    )
  }, [showSchools, showHospitals, showInfrastructure])

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 min-h-0">
      <PanelGroup direction="horizontal" className="flex h-full w-full">
        <Panel defaultSize={25} minSize={15} collapsible>
          <div className="h-full w-full overflow-auto bg-muted/30 p-4">
            <Card className="h-full shadow-sm">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-4">
                  <div className="mb-3 text-sm font-semibold text-foreground">Layers</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="all-layers" 
                        checked={allLayersChecked}
                        onCheckedChange={(v) => handleAllLayersToggle(Boolean(v))} 
                      />
                      <label htmlFor="all-layers" className="text-sm font-semibold cursor-pointer">All Layers</label>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center gap-3 pl-4">
                      <Checkbox 
                        id="schools" 
                        checked={showSchools} 
                        onCheckedChange={(v) => setShowSchools(Boolean(v))} 
                      />
                      <label htmlFor="schools" className="text-sm font-medium cursor-pointer">Schools</label>
                    </div>
                    <div className="flex items-center gap-3 pl-4">
                      <Checkbox 
                        id="hospitals" 
                        checked={showHospitals} 
                        onCheckedChange={(v) => setShowHospitals(Boolean(v))} 
                      />
                      <label htmlFor="hospitals" className="text-sm font-medium cursor-pointer">Hospitals</label>
                    </div>
                    <div className="flex items-center gap-3 pl-4">
                      <Checkbox 
                        id="infrastructure" 
                        checked={showInfrastructure} 
                        onCheckedChange={(v) => setShowInfrastructure(Boolean(v))} 
                      />
                      <label htmlFor="infrastructure" className="text-sm font-medium cursor-pointer">Infrastructure</label>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                <div className="mb-4">
                  <div className="mb-3 text-sm font-semibold text-foreground">Hazard (Overlay)</div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="flood-prone" 
                        checked={showFloodProne} 
                        onCheckedChange={(v) => setShowFloodProne(Boolean(v))} 
                      />
                      <label htmlFor="flood-prone" className="text-sm font-medium cursor-pointer">Flood Prone Areas (100yr)</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="landslide" 
                        checked={showLandslide} 
                        onCheckedChange={(v) => setShowLandslide(Boolean(v))} 
                      />
                      <label htmlFor="landslide" className="text-sm font-medium cursor-pointer">Landslide Susceptibility</label>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />
                <div>
                  <div className="mb-3 text-sm font-semibold text-foreground">Downloads</div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">GeoJSON</Button>
                    <Button variant="outline" size="sm" className="text-xs">Shapefile</Button>
                    <Button variant="outline" size="sm" className="text-xs">KML</Button>
                  </div>
                </div>
                <div className="mt-auto text-xs text-muted-foreground">Tip: Toggle overlays to visualize hazards.</div>
              </CardContent>
            </Card>
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors" />
        <Panel minSize={30} className="h-full">
          <div className="h-full w-full">
            <MapWrapper
              data={filtered}
              showSchools={showSchools}
              showHospitals={showHospitals}
              showInfrastructure={showInfrastructure}
              showFloodProne={showFloodProne}
              showLandslide={showLandslide}
              floodGeoJson={floodGeoJson}
              landslideGeoJson={landslideGeoJson}
            />
          </div>
        </Panel>
      </PanelGroup>
      </div>
    </div>
  )
}
