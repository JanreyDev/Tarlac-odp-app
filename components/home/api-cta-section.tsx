import Link from "next/link"
import { Code, Download, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ApiCtaSection() {
  return (
    <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Build with Open Data</h2>
            <p className="mt-4 text-primary-foreground/90">
              Access our datasets programmatically through REST APIs, download bulk data in CSV/Excel formats, or
              integrate GeoJSON endpoints directly into your applications.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/api-docs">
                <Button variant="secondary" className="gap-2">
                  <Code className="h-4 w-4" />
                  API Documentation
                </Button>
              </Link>
              <Link href="/datasets">
                <Button
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Download className="h-4 w-4" />
                  Download Datasets
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <Code className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-medium text-primary-foreground">REST API</h4>
                <p className="mt-1 text-xs text-primary-foreground/80">JSON endpoints</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <FileJson className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-medium text-primary-foreground">GeoJSON</h4>
                <p className="mt-1 text-xs text-primary-foreground/80">Map data</p>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <Download className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="text-sm font-medium text-primary-foreground">Bulk Data</h4>
                <p className="mt-1 text-xs text-primary-foreground/80">CSV & Excel</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
