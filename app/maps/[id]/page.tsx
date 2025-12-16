import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mapLayers, gisDatasets } from "@/lib/maps-data"
import { ArrowLeft, Download, Layers, Share2, ZoomIn, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return mapLayers.map((map) => ({
    id: map.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const map = mapLayers.find((m) => m.id === id)

  if (!map) {
    return {
      title: "Map Not Found | Tarlac Open Data Portal",
    }
  }

  return {
    title: `${map.name} | Tarlac Open Data Portal`,
    description: map.description,
  }
}

export default async function MapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const map = mapLayers.find((m) => m.id === id)

  if (!map) {
    notFound()
  }

  // Get related GIS datasets
  const relatedDatasets = gisDatasets.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Map Header */}
        <section className="bg-primary px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/maps">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Maps
              </Button>
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge className="mb-2 bg-primary-foreground/20 text-primary-foreground">{map.category}</Badge>
                <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl">{map.name}</h1>
                <p className="mt-2 text-primary-foreground/90">{map.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="secondary" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Viewer */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Map Display */}
              <div className="lg:col-span-3">
                <Card className="overflow-hidden">
                  <div className="relative aspect-16/10 bg-muted">
                    <Image src={map.thumbnail || "/placeholder.svg"} alt={map.name} fill className="object-cover" />
                    {/* Map Controls Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button size="icon" variant="secondary" className="h-10 w-10 shadow-lg">
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <Card className="bg-card/95 backdrop-blur">
                        <CardContent className="flex items-center gap-3 p-3">
                          <Info className="h-5 w-5 text-primary shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            This is a preview. Interactive map features are coming soon. Download the GeoJSON data below
                            to use in your own GIS applications.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Layers */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Layers className="h-4 w-4" />
                      Map Layers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {map.datasets.map((dataset, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="capitalize">{dataset.replace(/-/g, " ")}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Downloads */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Download className="h-4 w-4" />
                      Download Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {relatedDatasets.map((dataset) => (
                      <Button
                        key={dataset.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-between text-left bg-transparent"
                      >
                        <span className="truncate">{dataset.name}</span>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          {dataset.format}
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{map.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{map.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Layers</span>
                      <span className="font-medium">{map.datasets.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
