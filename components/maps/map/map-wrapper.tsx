"use client"

import dynamic from "next/dynamic"
import type { MapComponentProps } from "./map-component"

const DynamicMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
})

export default function MapWrapper(props: MapComponentProps) {
  return <DynamicMap {...props} />
}
