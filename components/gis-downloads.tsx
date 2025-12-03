import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileCode, Database } from "lucide-react"
import { gisDatasets } from "@/lib/maps-data"

export function GisDownloads() {
  return (
    <section className="bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">GIS Data Downloads</h2>
          <p className="mt-2 text-muted-foreground">
            Download geographic datasets in GeoJSON format for use in your applications
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gisDatasets.map((dataset) => (
            <Card key={dataset.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileCode className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{dataset.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{dataset.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {dataset.format}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{dataset.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full gap-1 bg-transparent">
                  <Download className="h-3 w-3" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Access Banner */}
        <Card className="mt-8 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">GeoJSON API Endpoints</h4>
                <p className="text-sm text-muted-foreground">Access geographic data programmatically via REST API</p>
              </div>
            </div>
            <Button className="gap-2">View API Docs</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
