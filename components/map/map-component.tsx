"use client"

import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, GeoJSON } from "react-leaflet"
import L from "leaflet"

export type DataPoint = {
  id: string | number
  lat: number
  lng: number
  title: string
  type: "school" | "hospital" | "infrastructure"
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

export default function MapComponent({ data, showSchools, showHospitals, showInfrastructure, showFloodProne, showLandslide, floodGeoJson, landslideGeoJson }: MapComponentProps) {
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

          {showFloodProne && floodGeoJson && (
            <Overlay checked name="Flood Prone Areas (100yr)">
              <GeoJSON data={floodGeoJson as any} style={{ color: "#3b82f6", weight: 1.5, fillColor: "#3b82f6", fillOpacity: 0.25 }} />
            </Overlay>
          )}

          {showLandslide && landslideGeoJson && (
            <Overlay checked name="Landslide Susceptibility">
              <GeoJSON data={landslideGeoJson as any} style={{ color: "#ef4444", weight: 1.5, fillColor: "#ef4444", fillOpacity: 0.25 }} />
            </Overlay>
          )}
        </LayersControl>

        {(showSchools || showHospitals || showInfrastructure) &&
          data.map((d) => {
            if (d.type === "school" && !showSchools) return null
            if (d.type === "hospital" && !showHospitals) return null
            if (d.type === "infrastructure" && !showInfrastructure) return null
            const icon = d.type === "school" ? schoolIcon : d.type === "hospital" ? hospitalIcon : infrastructureIcon
            return (
              <Marker key={d.id} position={{ lat: d.lat, lng: d.lng }} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <div className="font-medium">{d.title}</div>
                    <div className="text-muted-foreground capitalize">{d.type}</div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
      </MapContainer>
    </div>
  )
}
