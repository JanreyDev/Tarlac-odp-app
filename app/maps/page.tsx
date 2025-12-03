import { InteractiveMap } from "@/components/interactive-map"
import { Header } from "@/components/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maps & GIS Data | Tarlac Open Data Portal",
  description:
    "Explore interactive maps and download GIS datasets including boundaries, road networks, hazard maps, and more.",
}

export default function MapsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-hidden">
        <InteractiveMap />
      </div>
    </div>
  )
}
