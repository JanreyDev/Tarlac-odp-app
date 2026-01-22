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
  File,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Files,
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ContributionFile = {
  id: number
  original_name: string
  file_type: string
  file_size: number
  formatted_size: string
  file_path: string
}

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
  const [showChart, setShowChart] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)

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

  const loadChartData = async (fileId?: number) => {
    try {
      setLoadingChart(true)
      setChartError(null)
      setFileData(null)
      
      console.log('Fetching chart data for contribution ID:', id, 'File ID:', fileId)
      
      // If fileId is provided, fetch that specific file's data
      const data = fileId 
        ? await fetchFileData(id, fileId.toString())
        : await fetchFileData(id)
      
      console.log('Chart data received:', data)
      setFileData(data)
      setShowChart(true)
      if (fileId) {
        setSelectedFileId(fileId)
      }
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

  const handleDownload = (filePath: string, fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    const fileUrl = `${baseUrl}/storage/${filePath}`
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (type === 'csv') return '📊'
    if (type === 'xlsx' || type === 'xls') return '📈'
    return '📄'
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

    const xAxisKey = categoricalColumns[0] || headers[0]
    const yAxisKeys = numericColumns.length > 0 ? numericColumns : headers.slice(1)

    // Prepare data - filter out empty rows and limit to 50 points
    const chartData = rows
      .filter((row) => {
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

  const colors = [
    "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#a855f7",
  ]

  // Check if dataset has multiple files
  const hasMultipleFiles = dataset?.files && Array.isArray(dataset.files) && dataset.files.length > 0
  const filesCount = hasMultipleFiles ? dataset.files.length : (dataset?.file_path ? 1 : 0)

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
              {filesCount > 0 && (
                <Badge className="gap-1 bg-blue-500/20 text-blue-100 hover:bg-blue-500/30">
                  <Files className="h-3 w-3" />
                  {filesCount} {filesCount === 1 ? 'File' : 'Files'}
                </Badge>
              )}
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
                {filesCount > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Data Visualization
                          {selectedFileId && fileData && (
                            <Badge variant="outline" className="ml-2">
                              {fileData.file_info?.name || 'File'}
                            </Badge>
                          )}
                        </CardTitle>
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
                            Select a file below to visualize the dataset
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Multiple Files Section */}
                {hasMultipleFiles ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Files className="h-5 w-5" />
                        Resource Files ({dataset.files.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dataset.files.map((file: ContributionFile, index: number) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                <span className="text-xl">{getFileIcon(file.file_type)}</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground truncate">
                                  {file.original_name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="uppercase">{file.file_type}</span>
                                  <span>•</span>
                                  <span>{file.formatted_size || formatFileSize(file.file_size)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {(file.file_type === 'csv' || file.file_type === 'xlsx' || file.file_type === 'xls') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => loadChartData(file.id)}
                                  disabled={loadingChart}
                                >
                                  <BarChart3 className="h-4 w-4" />
                                  View Chart
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleDownload(file.file_path, file.original_name)}
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : dataset.file_path ? (
                  /* Single File (Backward Compatibility) */
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
                                return filename.replace(/^[\d_]+/, '')
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
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => loadChartData()}
                            disabled={loadingChart}
                          >
                            <BarChart3 className="h-4 w-4" />
                            View Chart
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() => handleDownload(dataset.file_path, dataset.file_path.split("/").pop() || "file")}
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

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
                      <p className="text-sm text-muted-foreground">Files Included</p>
                      <p className="font-medium">{filesCount} {filesCount === 1 ? 'file' : 'files'}</p>
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