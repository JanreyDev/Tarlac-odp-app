"use client"

import { useState, useMemo } from "react"
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { allDatasets, categories } from "@/lib/data"

const ITEMS_PER_PAGE = 10

export function DatasetsListing() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const formats = ["CSV", "XLSX", "GeoJSON", "PDF", "JSON"]

  const filteredDatasets = useMemo(() => {
    let results = allDatasets

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.tags.some((t) => t.toLowerCase().includes(query)),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter((d) =>
        selectedCategories.some(
          (c) =>
            d.category.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(d.category.toLowerCase()),
        ),
      )
    }

    // Format filter
    if (selectedFormats.length > 0) {
      results = results.filter((d) => d.resources.some((r) => selectedFormats.includes(r.format)))
    }

    // Sorting
    if (sortBy === "recent") {
      results = [...results].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    } else if (sortBy === "downloads") {
      results = [...results].sort((a, b) => b.downloads - a.downloads)
    } else if (sortBy === "name") {
      results = [...results].sort((a, b) => a.title.localeCompare(b.title))
    }

    return results
  }, [searchQuery, selectedCategories, selectedFormats, sortBy])

  const totalPages = Math.ceil(filteredDatasets.length / ITEMS_PER_PAGE)
  const paginatedDatasets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDatasets.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredDatasets, currentPage])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
    setCurrentPage(1)
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) => (prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedFormats([])
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedFormats.length > 0

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
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                    Categories
                    <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-2">
                    {categories.slice(0, 10).map((category) => (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Formats */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">File Format</Label>
                  <div className="space-y-2">
                    {formats.map((format) => (
                      <div key={format} className="flex items-center gap-2">
                        <Checkbox
                          id={format}
                          checked={selectedFormats.includes(format)}
                          onCheckedChange={() => toggleFormat(format)}
                        />
                        <Label htmlFor={format} className="text-sm font-normal cursor-pointer">
                          {format}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
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
                    <SelectItem value="downloads">Most Downloads</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
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
                    {categories.find((c) => c.id === cat)?.name || cat}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                  </Badge>
                ))}
                {selectedFormats.map((format) => (
                  <Badge key={format} variant="secondary" className="gap-1">
                    {format}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFormat(format)} />
                  </Badge>
                ))}
              </div>
            )}

            {/* Dataset Cards */}
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2" : "space-y-4"}>
              {paginatedDatasets.map((dataset) => (
                <DatasetListItem key={dataset.id} dataset={dataset} viewMode={viewMode} />
              ))}
            </div>

            {filteredDatasets.length === 0 && (
              <div className="py-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No datasets found</h3>
                <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria.</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                  Clear Filters
                </Button>
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
                    ),
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
  dataset: (typeof allDatasets)[0]
  viewMode: "list" | "grid"
}

function DatasetListItem({ dataset, viewMode }: DatasetListItemProps) {
  if (viewMode === "grid") {
    return (
      <Link href={`/datasets/${dataset.id}`}>
        <Card className="group h-full transition-all hover:shadow-md hover:border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                {dataset.title}
              </h3>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{dataset.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                <Building2 className="h-3 w-3" />
                {dataset.publisher}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {dataset.resources.length} resources
              </span>
              <span>{dataset.size}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/datasets/${dataset.id}`}>
      <Card className="group transition-all hover:shadow-md hover:border-primary/30">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{dataset.title}</h3>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{dataset.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                  <Building2 className="h-3 w-3" />
                  {dataset.publisher}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {dataset.category}
                </Badge>
              </div>
            </div>
            <div className="flex flex-row gap-6 text-sm text-muted-foreground sm:flex-col sm:items-end sm:gap-2">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {dataset.resources.length} resources
              </span>
              <span>{dataset.size}</span>
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {dataset.downloads.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {dataset.publishedDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
