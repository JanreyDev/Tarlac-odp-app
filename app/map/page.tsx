"use client"

import { useMemo, useState } from "react"
import MapWrapper from "@/components/maps/map/map-wrapper"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"

// Import mock GeoJSON data
import {
  provincialBoundaryGeoJson,
  municipalBoundariesGeoJson,
  barangayBoundariesGeoJson,
  roadNetworkGeoJson,
  riversWaterBodiesGeoJson,
  landUseGeoJson,
  elevationGeoJson,
  hazardMapsGeoJson,
  populationDensityGeoJson,
  publicFacilitiesGeoJson,
  infrastructureProjectsGeoJson,
  agricultureDataGeoJson,
  businessEconomicGeoJson,
  environmentProtectedGeoJson,
  tourismGeoJson,
  transportationGeoJson,
} from "@/lib/maps-data"

// Mock data
export type ItemType = "school" | "hospital" | "infrastructure" | "police" | "fire" | "government" | "hotel" | "restaurant" | "tourist_spot"

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
  { id: 6, lat: 15.475, lng: 120.605, title: "Tarlac City Hall", type: "government" },
  { id: 7, lat: 15.490, lng: 120.590, title: "Provincial Capitol", type: "infrastructure" },
  { id: 8, lat: 15.470, lng: 120.600, title: "Central Bus Terminal", type: "infrastructure" },
  { id: 9, lat: 15.600, lng: 120.485, title: "Police Station 1", type: "police" },
  { id: 10, lat: 15.592, lng: 120.478, title: "Fire Station Main", type: "fire" },
  { id: 11, lat: 15.587, lng: 120.512, title: "Monasterio de Tarlac", type: "tourist_spot" },
  { id: 12, lat: 15.600, lng: 120.488, title: "Tarlac Hotel & Resort", type: "hotel" },
]

export default function MapPage() {
  // ESSENTIAL LAYERS (Base)
  const [showProvincialBoundary, setShowProvincialBoundary] = useState(true)
  const [showMunicipalBoundaries, setShowMunicipalBoundaries] = useState(true)
  const [showBarangayBoundaries, setShowBarangayBoundaries] = useState(false)
  const [showRoadNetwork, setShowRoadNetwork] = useState(true)
  const [showRivers, setShowRivers] = useState(true)

  // OPTIONAL LAYERS (Development/Planning)
  const [showLandUse, setShowLandUse] = useState(false)
  const [showElevation, setShowElevation] = useState(false)
  const [showHazardMaps, setShowHazardMaps] = useState(false)
  const [showPopulationDensity, setShowPopulationDensity] = useState(false)
  const [showPublicFacilities, setShowPublicFacilities] = useState(true)

  // ADVANCED LAYERS (Smart Province)
  const [showInfrastructureProjects, setShowInfrastructureProjects] = useState(false)
  const [showAgriculture, setShowAgriculture] = useState(false)
  const [showBusiness, setShowBusiness] = useState(false)
  const [showEnvironment, setShowEnvironment] = useState(false)

  // TOURISM & PUBLIC
  const [showTourism, setShowTourism] = useState(false)
  const [showTransportation, setShowTransportation] = useState(false)

  // Point data filters
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

  // Mock GeoJSON overlays
  const floodGeoJson = hazardMapsGeoJson.features.find(f => f.properties.type === "flood") ? {
    type: "FeatureCollection",
    features: hazardMapsGeoJson.features.filter(f => f.properties.type === "flood"),
  } : null

  const landslideGeoJson = hazardMapsGeoJson.features.find(f => f.properties.type === "landslide") ? {
    type: "FeatureCollection",
    features: hazardMapsGeoJson.features.filter(f => f.properties.type === "landslide"),
  } : null

  const filtered = useMemo(() => {
    return ALL_DATA.filter((d) =>
      (d.type === "school" && showSchools) || 
      (d.type === "hospital" && showHospitals) ||
      (d.type === "infrastructure" && showInfrastructure) ||
      (d.type === "police" && showPublicFacilities) ||
      (d.type === "fire" && showPublicFacilities) ||
      (d.type === "government" && showPublicFacilities) ||
      (d.type === "hotel" && showTourism) ||
      (d.type === "restaurant" && showTourism) ||
      (d.type === "tourist_spot" && showTourism),
    )
  }, [showSchools, showHospitals, showInfrastructure, showPublicFacilities, showTourism])

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 min-h-0">
      <PanelGroup direction="horizontal" className="flex h-full w-full">
        <Panel defaultSize={25} minSize={15} collapsible>
          <div className="h-full w-full overflow-auto bg-muted/30 p-4">
            <Card className="h-full shadow-sm">
              <CardContent className="flex h-full flex-col p-5 gap-4">
                {/* Essential Base Layers */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">📍 Essential Layers</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="prov-boundary" 
                        checked={showProvincialBoundary} 
                        onCheckedChange={(v) => setShowProvincialBoundary(Boolean(v))} 
                      />
                      <label htmlFor="prov-boundary" className="text-sm cursor-pointer">Provincial Boundary</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="mun-boundaries" 
                        checked={showMunicipalBoundaries} 
                        onCheckedChange={(v) => setShowMunicipalBoundaries(Boolean(v))} 
                      />
                      <label htmlFor="mun-boundaries" className="text-sm cursor-pointer">Municipal Boundaries</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="bgy-boundaries" 
                        checked={showBarangayBoundaries} 
                        onCheckedChange={(v) => setShowBarangayBoundaries(Boolean(v))} 
                      />
                      <label htmlFor="bgy-boundaries" className="text-sm cursor-pointer">Barangay Boundaries</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="roads" 
                        checked={showRoadNetwork} 
                        onCheckedChange={(v) => setShowRoadNetwork(Boolean(v))} 
                      />
                      <label htmlFor="roads" className="text-sm cursor-pointer">Road Network</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="rivers" 
                        checked={showRivers} 
                        onCheckedChange={(v) => setShowRivers(Boolean(v))} 
                      />
                      <label htmlFor="rivers" className="text-sm cursor-pointer">Rivers & Water Bodies</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Public Facilities & Services */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">🏛️ Services & Facilities</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="schools" 
                        checked={showSchools} 
                        onCheckedChange={(v) => setShowSchools(Boolean(v))} 
                      />
                      <label htmlFor="schools" className="text-sm cursor-pointer">Schools</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="hospitals" 
                        checked={showHospitals} 
                        onCheckedChange={(v) => setShowHospitals(Boolean(v))} 
                      />
                      <label htmlFor="hospitals" className="text-sm cursor-pointer">Hospitals & Health</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="public-fac" 
                        checked={showPublicFacilities} 
                        onCheckedChange={(v) => setShowPublicFacilities(Boolean(v))} 
                      />
                      <label htmlFor="public-fac" className="text-sm cursor-pointer">Public Facilities</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="infrastructure" 
                        checked={showInfrastructure} 
                        onCheckedChange={(v) => setShowInfrastructure(Boolean(v))} 
                      />
                      <label htmlFor="infrastructure" className="text-sm cursor-pointer">Infrastructure</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Optional Layers */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">🌱 Optional Development</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="land-use" 
                        checked={showLandUse} 
                        onCheckedChange={(v) => setShowLandUse(Boolean(v))} 
                      />
                      <label htmlFor="land-use" className="text-sm cursor-pointer">Land Use Classification</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="elevation" 
                        checked={showElevation} 
                        onCheckedChange={(v) => setShowElevation(Boolean(v))} 
                      />
                      <label htmlFor="elevation" className="text-sm cursor-pointer">Elevation / Terrain</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="hazards" 
                        checked={showHazardMaps} 
                        onCheckedChange={(v) => setShowHazardMaps(Boolean(v))} 
                      />
                      <label htmlFor="hazards" className="text-sm cursor-pointer">Hazard Maps</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="population" 
                        checked={showPopulationDensity} 
                        onCheckedChange={(v) => setShowPopulationDensity(Boolean(v))} 
                      />
                      <label htmlFor="population" className="text-sm cursor-pointer">Population Density</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Advanced Layers */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">🛰️ Advanced Data</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="infrastructure-proj" 
                        checked={showInfrastructureProjects} 
                        onCheckedChange={(v) => setShowInfrastructureProjects(Boolean(v))} 
                      />
                      <label htmlFor="infrastructure-proj" className="text-sm cursor-pointer">Infrastructure Projects</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="agriculture" 
                        checked={showAgriculture} 
                        onCheckedChange={(v) => setShowAgriculture(Boolean(v))} 
                      />
                      <label htmlFor="agriculture" className="text-sm cursor-pointer">Agriculture Data</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="business" 
                        checked={showBusiness} 
                        onCheckedChange={(v) => setShowBusiness(Boolean(v))} 
                      />
                      <label htmlFor="business" className="text-sm cursor-pointer">Business & Economy</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="environment" 
                        checked={showEnvironment} 
                        onCheckedChange={(v) => setShowEnvironment(Boolean(v))} 
                      />
                      <label htmlFor="environment" className="text-sm cursor-pointer">Protected Areas</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Tourism & Transport */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">🌍 Tourism & Transport</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="tourism" 
                        checked={showTourism} 
                        onCheckedChange={(v) => setShowTourism(Boolean(v))} 
                      />
                      <label htmlFor="tourism" className="text-sm cursor-pointer">Tourism Attractions</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="transport" 
                        checked={showTransportation} 
                        onCheckedChange={(v) => setShowTransportation(Boolean(v))} 
                      />
                      <label htmlFor="transport" className="text-sm cursor-pointer">Transportation Network</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Hazard Overlays */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">⚠️ Hazard Overlays</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="flood-prone" 
                        checked={showFloodProne} 
                        onCheckedChange={(v) => setShowFloodProne(Boolean(v))} 
                      />
                      <label htmlFor="flood-prone" className="text-sm cursor-pointer">Flood Prone Areas</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id="landslide" 
                        checked={showLandslide} 
                        onCheckedChange={(v) => setShowLandslide(Boolean(v))} 
                      />
                      <label htmlFor="landslide" className="text-sm cursor-pointer">Landslide Risk</label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="mb-3 text-xs font-semibold text-foreground uppercase tracking-wide">📥 Downloads</div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">GeoJSON</Button>
                    <Button variant="outline" size="sm" className="text-xs">Shapefile</Button>
                    <Button variant="outline" size="sm" className="text-xs">KML</Button>
                  </div>
                </div>
                <div className="mt-auto text-xs text-muted-foreground">Tip: 17 comprehensive layers for smart province planning.</div>
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
              showProvincialBoundary={showProvincialBoundary}
              showMunicipalBoundaries={showMunicipalBoundaries}
              showBarangayBoundaries={showBarangayBoundaries}
              showRoadNetwork={showRoadNetwork}
              showRivers={showRivers}
              showLandUse={showLandUse}
              showElevation={showElevation}
              showHazardMaps={showHazardMaps}
              showPopulationDensity={showPopulationDensity}
              showPublicFacilities={showPublicFacilities}
              showInfrastructureProjects={showInfrastructureProjects}
              showAgriculture={showAgriculture}
              showBusiness={showBusiness}
              showEnvironment={showEnvironment}
              showTourism={showTourism}
              showTransportation={showTransportation}
              provincialBoundaryGeoJson={provincialBoundaryGeoJson}
              municipalBoundariesGeoJson={municipalBoundariesGeoJson}
              barangayBoundariesGeoJson={barangayBoundariesGeoJson}
              roadNetworkGeoJson={roadNetworkGeoJson}
              riversWaterBodiesGeoJson={riversWaterBodiesGeoJson}
              landUseGeoJson={landUseGeoJson}
              elevationGeoJson={elevationGeoJson}
              hazardMapsGeoJson={hazardMapsGeoJson}
              populationDensityGeoJson={populationDensityGeoJson}
              publicFacilitiesGeoJson={publicFacilitiesGeoJson}
              infrastructureProjectsGeoJson={infrastructureProjectsGeoJson}
              agricultureDataGeoJson={agricultureDataGeoJson}
              businessEconomicGeoJson={businessEconomicGeoJson}
              environmentProtectedGeoJson={environmentProtectedGeoJson}
              tourismGeoJson={tourismGeoJson}
              transportationGeoJson={transportationGeoJson}
            />
          </div>
        </Panel>
      </PanelGroup>
      </div>
    </div>
  )
}
