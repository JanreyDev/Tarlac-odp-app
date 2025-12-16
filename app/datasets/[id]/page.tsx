import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { allDatasets } from "@/lib/data"
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  Building2,
  Tag,
  ExternalLink,
  Copy,
  Share2,
  FileSpreadsheet,
  FileCode,
  File,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return allDatasets.map((dataset) => ({
    id: dataset.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dataset = allDatasets.find((d) => d.id === id)

  if (!dataset) {
    return {
      title: "Dataset Not Found | Tarlac Open Data Portal",
    }
  }

  return {
    title: `${dataset.title} | Tarlac Open Data Portal`,
    description: dataset.description,
  }
}

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CSV: FileSpreadsheet,
  XLSX: FileSpreadsheet,
  GeoJSON: FileCode,
  JSON: FileCode,
  PDF: File,
}

export default async function DatasetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dataset = allDatasets.find((d) => d.id === id)

  if (!dataset) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Dataset Header */}
        <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/datasets">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Datasets
              </Button>
            </Link>

            <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">{dataset.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-primary-foreground/90">{dataset.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Building2 className="h-3 w-3" />
                {dataset.publisher}
              </Badge>
              <Badge className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Tag className="h-3 w-3" />
                {dataset.category}
              </Badge>
              <Badge className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Calendar className="h-3 w-3" />
                Published {dataset.publishedDate}
              </Badge>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Resources */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resources ({dataset.resources.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dataset.resources.map((resource, index) => {
                        const Icon = formatIcons[resource.format] || FileText
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{resource.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {resource.format} • {resource.size}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" className="gap-1">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download All
                      </Button>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Share2 className="h-4 w-4" />
                        Share Dataset
                      </Button>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Copy className="h-4 w-4" />
                        Copy API Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dataset Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Publisher</p>
                      <p className="font-medium">{dataset.publisher}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{dataset.category}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="font-medium">{dataset.publishedDate}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{dataset.updatedDate}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                      <p className="font-medium">{dataset.size}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="font-medium">{dataset.downloads.toLocaleString()}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">License</p>
                      <p className="font-medium">{dataset.license}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* API Access */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground">API Access</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Access this dataset programmatically via our REST API.
                    </p>
                    <code className="mt-3 block rounded bg-muted p-2 text-xs break-all">
                      /api/v1/datasets/{dataset.id}
                    </code>
                    <Link href="/api-docs">
                      <Button variant="link" className="mt-2 h-auto p-0 gap-1">
                        View API Documentation
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
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
