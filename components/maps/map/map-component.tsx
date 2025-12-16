"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, GeoJSON } from "react-leaflet"
import L from "leaflet"

export type DataPoint = {
  id: string | number
  lat: number
  lng: number
  title: string
  type: "school" | "hospital" | "infrastructure" | "police" | "fire" | "government" | "hotel" | "restaurant" | "tourist_spot"
}

export type MapComponentProps = {
  data: DataPoint[]
  showSchools: boolean
  showHospitals: boolean
  showInfrastructure: boolean
  showFloodProne: boolean
  showLandslide: boolean
  floodGeoJson?: any
  landslideGeoJson?: any
  // Essential layers
  showProvincialBoundary?: boolean
  showMunicipalBoundaries?: boolean
  showBarangayBoundaries?: boolean
  showRoadNetwork?: boolean
  showRivers?: boolean
  // Optional layers
  showLandUse?: boolean
  showElevation?: boolean
  showHazardMaps?: boolean
  showPopulationDensity?: boolean
  showPublicFacilities?: boolean
  // Advanced layers
  showInfrastructureProjects?: boolean
  showAgriculture?: boolean
  showBusiness?: boolean
  showEnvironment?: boolean
  // Tourism & Transport
  showTourism?: boolean
  showTransportation?: boolean
  // GeoJSON data
  provincialBoundaryGeoJson?: any
  municipalBoundariesGeoJson?: any
  barangayBoundariesGeoJson?: any
  roadNetworkGeoJson?: any
  riversWaterBodiesGeoJson?: any
  landUseGeoJson?: any
  elevationGeoJson?: any
  hazardMapsGeoJson?: any
  populationDensityGeoJson?: any
  publicFacilitiesGeoJson?: any
  infrastructureProjectsGeoJson?: any
  agricultureDataGeoJson?: any
  businessEconomicGeoJson?: any
  environmentProtectedGeoJson?: any
  tourismGeoJson?: any
  transportationGeoJson?: any
}

// Fix default marker icon paths (404 in Next.js without static copy)
function ensureLeafletIcons() {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  })
}

// Custom colored icons for types
const schoolIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDA0OWZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIzOSIgdmlld0JveD0iMCAwIDI1IDM5Ij48cGF0aCBkPSJNMTEuNSAwYy0zLjkgMCA3LjUgMTggNy41IDE4czExLjQtMTguMCA3LjUtMThDMTguOSAwIDE1LjQgMCAxMS41IDB6Ii8+PC9zdmc+",
  iconSize: [25, 39],
  iconAnchor: [12, 39],
  popupAnchor: [0, -32],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

const hospitalIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZWY0NDQ0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIzOSIgdmlld0JveD0iMCAwIDI1IDM5Ij48cGF0aCBkPSJNMTEuNSAwYy0zLjkgMCA3LjUgMTggNy41IDE4czExLjQtMTguMCA3LjUtMThDMTguOSAwIDE1LjQgMCAxMS41IDB6Ii8+PC9zdmc+",
  iconSize: [25, 39],
  iconAnchor: [12, 39],
  popupAnchor: [0, -32],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

const infrastructureIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZjU5ZTBiIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIzOSIgdmlld0JveD0iMCAwIDI1IDM5Ij48cGF0aCBkPSJNMTEuNSAwYy0zLjkgMCA3LjUgMTggNy41IDE4czExLjQtMTguMCA3LjUtMThDMTguOSAwIDE1LjQgMCAxMS41IDB6Ii8+PC9zdmc+",
  iconSize: [25, 39],
  iconAnchor: [12, 39],
  popupAnchor: [0, -32],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

const otherIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjODI0YzMxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSIzOSIgdmlld0JveD0iMCAwIDI1IDM5Ij48cGF0aCBkPSJNMTEuNSAwYy0zLjkgMCA3LjUgMTggNy41IDE4czExLjQtMTguMCA3LjUtMThDMTguOSAwIDE1LjQgMCAxMS41IDB6Ii8+PC9zdmc+",
  iconSize: [25, 39],
  iconAnchor: [12, 39],
  popupAnchor: [0, -32],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
})

function getIconForType(type: string): L.Icon {
  switch (type) {
    case "school":
      return schoolIcon
    case "hospital":
      return hospitalIcon
    case "infrastructure":
      return infrastructureIcon
    default:
      return otherIcon
  }
}

export default function MapComponent(props: MapComponentProps) {
  useEffect(() => {
    ensureLeafletIcons()
  }, [])

  const center = useMemo(() => ({ lat: 15.4801, lng: 120.5979 }), []) // Tarlac approx

  const { BaseLayer, Overlay } = LayersControl

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={10} className="absolute inset-0 h-full w-full z-0">
        <LayersControl position="topright">
          <BaseLayer checked name="Clean Map">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          <BaseLayer name="Satellite Hybrid">
            <LayerGroup>
              {/* Esri World Imagery */}
              <TileLayer
                attribution='Tiles &copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              {/* Stamen Toner Lines for labels/roads */}
              <TileLayer
                attribution='Map tiles by Stamen Design'
                url="https://stamen-tiles.a.ssl.fastly.net/toner-lines/{z}/{x}/{y}.png"
                opacity={0.7}
              />
            </LayerGroup>
          </BaseLayer>

          {/* ESSENTIAL LAYERS */}
          {props.showProvincialBoundary && props.provincialBoundaryGeoJson && (
            <Overlay name="Provincial Boundary">
              <GeoJSON data={props.provincialBoundaryGeoJson} style={{ color: "#1f2937", weight: 3, fill: false }} />
            </Overlay>
          )}

          {props.showMunicipalBoundaries && props.municipalBoundariesGeoJson && (
            <Overlay name="Municipal Boundaries">
              <GeoJSON data={props.municipalBoundariesGeoJson} style={{ color: "#7c3aed", weight: 2, fill: false }} />
            </Overlay>
          )}

          {props.showBarangayBoundaries && props.barangayBoundariesGeoJson && (
            <Overlay name="Barangay Boundaries">
              <GeoJSON data={props.barangayBoundariesGeoJson} style={{ color: "#0ea5e9", weight: 1.5, fill: false, dashArray: "5,5" }} />
            </Overlay>
          )}

          {props.showRoadNetwork && props.roadNetworkGeoJson && (
            <Overlay name="Road Network">
              <GeoJSON 
                data={props.roadNetworkGeoJson} 
                style={(feature) => {
                  const type = feature?.properties?.type
                  return {
                    color: type === "national-highway" ? "#dc2626" : type === "provincial-road" ? "#f59e0b" : "#64748b",
                    weight: type === "national-highway" ? 3 : type === "provincial-road" ? 2 : 1.5,
                  }
                }}
              />
            </Overlay>
          )}

          {props.showRivers && props.riversWaterBodiesGeoJson && (
            <Overlay name="Rivers & Water Bodies">
              <GeoJSON data={props.riversWaterBodiesGeoJson} style={{ color: "#06b6d4", weight: 2 }} />
            </Overlay>
          )}

          {/* OPTIONAL LAYERS */}
          {props.showLandUse && props.landUseGeoJson && (
            <Overlay name="Land Use Classification">
              <GeoJSON 
                data={props.landUseGeoJson} 
                style={(feature) => {
                  const type = feature?.properties?.type
                  return {
                    color: type === "agricultural" ? "#84cc16" : type === "built-up" ? "#ef4444" : "#059669",
                    fillOpacity: 0.4,
                  }
                }}
              />
            </Overlay>
          )}

          {props.showElevation && props.elevationGeoJson && (
            <Overlay name="Elevation / Terrain">
              <GeoJSON data={props.elevationGeoJson as any} />
            </Overlay>
          )}

          {props.showHazardMaps && props.hazardMapsGeoJson && (
            <Overlay name="Hazard Maps">
              <GeoJSON 
                data={props.hazardMapsGeoJson} 
                style={(feature) => {
                  const type = feature?.properties?.type
                  return {
                    color: type === "flood" ? "#3b82f6" : type === "landslide" ? "#f97316" : "#000",
                    weight: 2,
                    fillOpacity: 0.3,
                  }
                }}
              />
            </Overlay>
          )}

          {props.showPopulationDensity && props.populationDensityGeoJson && (
            <Overlay name="Population Density">
              <GeoJSON data={props.populationDensityGeoJson as any} />
            </Overlay>
          )}

          {props.showPublicFacilities && props.publicFacilitiesGeoJson && (
            <Overlay name="Public Facilities">
              <GeoJSON data={props.publicFacilitiesGeoJson as any} />
            </Overlay>
          )}

          {/* ADVANCED LAYERS */}
          {props.showInfrastructureProjects && props.infrastructureProjectsGeoJson && (
            <Overlay name="Infrastructure Projects">
              <GeoJSON data={props.infrastructureProjectsGeoJson as any} style={{ color: "#8b5cf6", weight: 2 }} />
            </Overlay>
          )}

          {props.showAgriculture && props.agricultureDataGeoJson && (
            <Overlay name="Agriculture Data">
              <GeoJSON data={props.agricultureDataGeoJson as any} style={{ color: "#84cc16", weight: 2, fillOpacity: 0.3 }} />
            </Overlay>
          )}

          {props.showBusiness && props.businessEconomicGeoJson && (
            <Overlay name="Business & Economy">
              <GeoJSON data={props.businessEconomicGeoJson as any} style={{ color: "#f59e0b", weight: 2, fillOpacity: 0.3 }} />
            </Overlay>
          )}

          {props.showEnvironment && props.environmentProtectedGeoJson && (
            <Overlay name="Protected Areas">
              <GeoJSON data={props.environmentProtectedGeoJson as any} style={{ color: "#10b981", weight: 2, fillOpacity: 0.25 }} />
            </Overlay>
          )}

          {/* TOURISM & TRANSPORT */}
          {props.showTourism && props.tourismGeoJson && (
            <Overlay name="Tourism Attractions">
              <GeoJSON data={props.tourismGeoJson as any} style={{ color: "#ec4899", weight: 2 }} />
            </Overlay>
          )}

          {props.showTransportation && props.transportationGeoJson && (
            <Overlay name="Transportation Network">
              <GeoJSON data={props.transportationGeoJson as any} style={{ color: "#0891b2", weight: 2.5 }} />
            </Overlay>
          )}

          {/* HAZARD OVERLAYS */}
          {props.showFloodProne && props.floodGeoJson && (
            <Overlay checked name="Flood Prone Areas">
              <GeoJSON data={props.floodGeoJson as any} style={{ color: "#3b82f6", weight: 1.5, fillColor: "#3b82f6", fillOpacity: 0.25 }} />
            </Overlay>
          )}

          {props.showLandslide && props.landslideGeoJson && (
            <Overlay checked name="Landslide Risk">
              <GeoJSON data={props.landslideGeoJson as any} style={{ color: "#ef4444", weight: 1.5, fillColor: "#ef4444", fillOpacity: 0.25 }} />
            </Overlay>
          )}
        </LayersControl>

        {/* POINT MARKERS */}
        {props.data &&
          props.data.map((d) => {
            const icon = getIconForType(d.type)
            return (
              <Marker key={d.id} position={{ lat: d.lat, lng: d.lng }} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-medium">{d.title}</div>
                    <div className="text-muted-foreground capitalize">{d.type.replace(/_/g, " ")}</div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>
    </div>
  )
}
