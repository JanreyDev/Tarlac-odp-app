"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Download,
  ArrowRight,
  FileText,
  Tag,
  Building2,
  Calendar,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { fetchApprovedContributions, type ApprovedContribution } from "@/lib/api"

const ITEMS_PER_PAGE = 10

export function DatasetsListing() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  
  // API Data State
  const [datasets, setDatasets] = useState<ApprovedContribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch approved contributions from API
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchApprovedContributions(1)
        setDatasets(response.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load datasets")
        console.error("Error loading datasets:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDatasets()
  }, [])

  // Extract unique categories and request types from loaded data
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>()
    datasets.forEach((dataset) => {
      dataset.categories.forEach((cat) => categorySet.add(cat.name))
    })
    return Array.from(categorySet).sort()
  }, [datasets])

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>()
    datasets.forEach((dataset) => {
      if (dataset.request_type) {
        typeSet.add(dataset.request_type)
      }
    })
    return Array.from(typeSet).sort()
  }, [datasets])

  const filteredDatasets = useMemo(() => {
    let results = [...datasets]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.message.toLowerCase().includes(query) ||
          d.organization.toLowerCase().includes(query) ||
          d.tags.some((t) => t.name.toLowerCase().includes(query)) ||
          d.categories.some((c) => c.name.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((d) =>
        d.categories.some((cat) => selectedCategories.includes(cat.name))
      )
    }

    // Type filter
    if (selectedTypes.length > 0) {
      results = results.filter((d) => selectedTypes.includes(d.request_type))
    }

    // Sorting
    if (sortBy === "recent") {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "name") {
      results.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "organization") {
      results.sort((a, b) => a.organization.localeCompare(b.organization))
    }

    return results
  }, [datasets, searchQuery, selectedCategories, selectedTypes, sortBy])

  const totalPages = Math.ceil(filteredDatasets.length / ITEMS_PER_PAGE)
  const paginatedDatasets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDatasets.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredDatasets, currentPage])

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName]
    )
    setCurrentPage(1)
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedTypes([])
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedTypes.length > 0

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading datasets...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Error Loading Datasets</h3>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-1 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search datasets..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Categories */}
                {availableCategories.length > 0 && (
                  <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                      Categories
                      <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center gap-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label htmlFor={`cat-${category}`} className="cursor-pointer text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                {/* Request Types */}
                {availableTypes.length > 0 && (
                  <div>
                    <Label className="mb-3 block text-sm font-medium">Request Type</Label>
                    <div className="space-y-2">
                      {availableTypes.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <Label htmlFor={`type-${type}`} className="cursor-pointer text-sm font-normal">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredDatasets.length)}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredDatasets.length)}
                </span>{" "}
                of <span className="font-medium text-foreground">{filteredDatasets.length}</span> datasets
              </p>
              <div className="flex items-center gap-3">
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex rounded-lg border">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-r-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    {cat}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                  </Badge>
                ))}
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {type}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleType(type)} />
                  </Badge>
                ))}
              </div>
            )}

            {/* Dataset Cards */}
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2" : "space-y-4"}>
              {paginatedDatasets.map((dataset) => (
                <DatasetListItem key={dataset.id} dataset={dataset} viewMode={viewMode} formatDate={formatDate} />
              ))}
            </div>

            {filteredDatasets.length === 0 && (
              <div className="py-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No datasets found</h3>
                <p className="mt-2 text-muted-foreground">
                  {datasets.length === 0
                    ? "No approved datasets available yet."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <Button
                        key={index}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={index} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

interface DatasetListItemProps {
  dataset: ApprovedContribution
  viewMode: "list" | "grid"
  formatDate: (date: string) => string
}

function DatasetListItem({ dataset, viewMode, formatDate }: DatasetListItemProps) {
  if (viewMode === "grid") {
    return (
      <Link href={`/datasets/${dataset.id}`}>
        <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                {dataset.title}
              </h3>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{dataset.message}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                <Building2 className="h-3 w-3" />
                {dataset.organization}
              </Badge>
              {dataset.categories.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {dataset.categories[0].name}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {dataset.request_type}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(dataset.created_at)}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/datasets/${dataset.id}`}>
      <Card className="group transition-all hover:border-primary/30 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{dataset.title}</h3>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{dataset.message}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                  <Building2 className="h-3 w-3" />
                  {dataset.organization}
                </Badge>
                {dataset.categories.slice(0, 2).map((cat) => (
                  <Badge key={cat.id} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {cat.name}
                  </Badge>
                ))}
                {dataset.categories.length > 2 && (
                  <Badge variant="outline">+{dataset.categories.length - 2} more</Badge>
                )}
              </div>
              {dataset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {dataset.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                  {dataset.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{dataset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-row gap-6 text-sm text-muted-foreground sm:flex-col sm:items-end sm:gap-2">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {dataset.request_type}
              </span>
              {dataset.file_path && (
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  File available
                </span>
              )}
              <span className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {formatDate(dataset.created_at)}
              </span>
              <span className="text-xs text-muted-foreground">By {dataset.user.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}