"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { fetchSingleApprovedContribution, fetchFileData, type ApprovedContribution, type FileData } from "@/lib/api"
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
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function DatasetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [dataset, setDataset] = useState<ApprovedContribution | null>(null)
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingChart, setLoadingChart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartError, setChartError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    const loadDataset = async () => {
      try {
        setLoading(true)
        setError(null)
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

  const loadChartData = async () => {
    try {
      setLoadingChart(true)
      setChartError(null)
      console.log('Fetching chart data for ID:', id)
      const data = await fetchFileData(id)
      console.log('Chart data received:', data)
      setFileData(data)
      setShowChart(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load chart data"
      console.error("Error loading chart data:", err)
      setChartError(errorMessage)
    } finally {
      setLoadingChart(false)
    }
  }

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

  // Auto-detect best chart type and prepare data
  const getChartConfig = () => {
    if (!fileData?.rows || fileData.rows.length === 0) return null

    const headers = fileData.headers
    const rows = fileData.rows

    // Find numeric columns
    const numericColumns = headers.filter((header) => {
      const firstValue = rows[0]?.[header]
      return typeof firstValue === "number"
    })

    // Find text/categorical columns (potential x-axis)
    const categoricalColumns = headers.filter((header) => {
      const firstValue = rows[0]?.[header]
      return typeof firstValue === "string" && firstValue !== null && firstValue !== ""
    })

    // Default: use first categorical column as X-axis, all numeric columns as Y-axis
    const xAxisKey = categoricalColumns[0] || headers[0]
    const yAxisKeys = numericColumns.length > 0 ? numericColumns : headers.slice(1) // Show all numeric columns

    console.log("Chart Config:", {
      xAxisKey,
      yAxisKeys,
      allNumericColumns: numericColumns,
      firstRow: rows[0],
      headers
    })

    // Prepare data - filter out empty rows and limit to 50 points for better performance
    const chartData = rows
      .filter((row) => {
        // Keep row if it has at least one non-null, non-empty value
        return Object.values(row).some(val => val !== null && val !== "" && val !== undefined)
      })
      .slice(0, 50)
      .map((row) => {
        const dataPoint: any = { name: row[xAxisKey] || "Unknown" }
        yAxisKeys.forEach((key) => {
          dataPoint[key] = row[key]
        })
        return dataPoint
      })

    return {
      data: chartData,
      xAxisKey: "name",
      yAxisKeys,
      originalXAxisKey: xAxisKey,
    }
  }

  const chartConfig = showChart && fileData ? getChartConfig() : null

  // Enhanced color palette for better visibility - more distinct colors
  const colors = [
    "#3b82f6", // Blue
    "#ef4444", // Red
    "#10b981", // Green
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
    "#f97316", // Deep Orange
    "#a855f7", // Violet
  ]

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
                {/* Data Visualization */}
                {dataset.file_path && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Data Visualization
                        </CardTitle>
                        {!showChart && (
                          <Button onClick={loadChartData} disabled={loadingChart} size="sm">
                            {loadingChart ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              "View Chart"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {chartError && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <div>
                              <p className="font-medium text-destructive">Failed to load chart</p>
                              <p className="mt-1 text-sm text-muted-foreground">{chartError}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {loadingChart && (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      )}

                      {showChart && chartConfig && (
                        <div>
                          <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={chartConfig.data} margin={{ top: 20, right: 20, left: 20, bottom: 100 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                              <XAxis 
                                dataKey={chartConfig.xAxisKey}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                                tick={{ fontSize: 10 }}
                              />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  maxWidth: '400px'
                                }}
                                wrapperStyle={{ zIndex: 1000 }}
                              />
                              {chartConfig.yAxisKeys.map((key, index) => (
                                <Line
                                  key={key}
                                  type="monotone"
                                  dataKey={key}
                                  name={key}
                                  stroke={colors[index % colors.length]}
                                  strokeWidth={2.5}
                                  dot={{ r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {!showChart && !loadingChart && !chartError && (
                        <div className="rounded-lg border-2 border-dashed py-12 text-center">
                          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <p className="mt-4 text-muted-foreground">
                            Click "View Chart" to visualize this dataset
                          </p>
                        </div>
                      )}
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

                      {dataset.categories.length > 0 && dataset.tags.length > 0 && <Separator />}

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
                              {(() => {
                                const filename = dataset.file_path.split("/").pop() || "Download File"
                                // Remove timestamp prefix (numbers and underscore at start)
                                return filename.replace(/^\d+_\d+_/, '')
                              })()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {dataset.request_type
                                .split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')
                              }
                            </p>
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
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
                      <p className="font-medium">
                        {dataset.request_type
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')
                        }
                      </p>
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