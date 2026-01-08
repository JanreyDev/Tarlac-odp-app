"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { fetchSingleApprovedContribution, type ApprovedContribution } from "@/lib/api"
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
  File,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function DatasetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [dataset, setDataset] = useState<ApprovedContribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadDataset = async () => {
      try {
        setLoading(true)
        setError(null)
        // Use the public approved endpoint
        const data = await fetchSingleApprovedContribution(id)
        setDataset(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dataset")
        console.error("Error loading dataset:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDataset()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const handleDownload = () => {
    if (dataset?.file_path) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const fileUrl = `${baseUrl}/storage/${dataset.file_path}`
      window.open(fileUrl, "_blank")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: dataset?.title,
          text: dataset?.message,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyAPI = () => {
    const apiLink = `/api/v1/datasets/${id}`
    navigator.clipboard.writeText(apiLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading dataset...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !dataset) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Dataset Not Found</h3>
            <p className="mt-2 text-muted-foreground">{error || "This dataset does not exist or has been removed."}</p>
            <Link href="/datasets">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Datasets
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                className="mb-4 gap-1 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Datasets
              </Button>
            </Link>

            <div className="mb-4 flex items-center gap-2">
              <Badge className="gap-1 bg-green-500/20 text-green-100 hover:bg-green-500/30">
                <CheckCircle className="h-3 w-3" />
                Approved
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">{dataset.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-primary-foreground/90">{dataset.message}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Building2 className="h-3 w-3" />
                {dataset.organization}
              </Badge>
              {dataset.categories.map((category) => (
                <Badge
                  key={category.id}
                  className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
                >
                  <Tag className="h-3 w-3" />
                  {category.name}
                </Badge>
              ))}
              <Badge className="gap-1 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                <Calendar className="h-3 w-3" />
                Published {formatDate(dataset.created_at)}
              </Badge>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{dataset.message}</p>
                  </CardContent>
                </Card>

                {/* File Resource */}
                {dataset.file_path && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Resource File
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <File className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {dataset.file_path.split("/").pop() || "Download File"}
                            </p>
                            <p className="text-sm text-muted-foreground">{dataset.request_type}</p>
                          </div>
                        </div>
                        <Button size="sm" className="gap-1" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Categories & Tags */}
                {(dataset.categories.length > 0 || dataset.tags.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Categories & Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Categories */}
                      {dataset.categories.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">Categories</p>
                          <div className="flex flex-wrap gap-2">
                            {dataset.categories.map((category) => (
                              <Badge key={category.id} variant="outline" className="gap-1">
                                <Tag className="h-3 w-3" />
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Separator if both exist */}
                      {dataset.categories.length > 0 && dataset.tags.length > 0 && <Separator />}

                      {/* Tags */}
                      {dataset.tags.length > 0 && (
                        <div>
                          <p className="mb-2 text-sm font-medium text-muted-foreground">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {dataset.tags.map((tag) => (
                              <Badge key={tag.id} variant="secondary">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Actions */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {dataset.file_path && (
                        <Button className="w-full gap-2" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                          Download File
                        </Button>
                      )}
                      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                        Share Dataset
                      </Button>
                      <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleCopyAPI}>
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied!" : "Copy API Link"}
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
                      <p className="text-sm text-muted-foreground">Submitted By</p>
                      <div className="mt-1 flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{dataset.user.name}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-medium">{dataset.organization}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Request Type</p>
                      <p className="font-medium">{dataset.request_type}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className="mt-1 bg-green-500/10 text-green-700 hover:bg-green-500/20">
                        {dataset.status.charAt(0).toUpperCase() + dataset.status.slice(1)}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="font-medium">{formatDate(dataset.created_at)}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{formatDate(dataset.updated_at)}</p>
                    </div>
                    {dataset.categories.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Categories</p>
                          <p className="font-medium">{dataset.categories.length}</p>
                        </div>
                      </>
                    )}
                    {dataset.tags.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Tags</p>
                          <p className="font-medium">{dataset.tags.length}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* API Access */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground">API Access</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Access this dataset programmatically via our REST API.
                    </p>
                    <code className="mt-3 block break-all rounded bg-muted p-2 text-xs">
                      /api/v1/datasets/{dataset.id}
                    </code>
                    <Link href="/api-docs">
                      <Button variant="link" className="mt-2 h-auto gap-1 p-0">
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