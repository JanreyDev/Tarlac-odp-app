"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  Heart,
  Building2,
  Wheat,
  TreePine,
  TrendingUp,
  Landmark,
  Shield,
  AlertTriangle,
  HeartHandshake,
  Map,
  Briefcase,
  Wifi,
  Droplets,
  Banknote,
  Home,
  Eye,
  Cloud,
  BookOpen,
  MapPin,
  Code,
  Database,
  ArrowLeft,
  Download,
  Filter,
  Loader2,
  Tag,
  Calendar,
  ArrowRight,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { fetchCategories, fetchApprovedContributions, type Category, type ApprovedContribution } from "@/lib/api"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  Heart,
  Building2,
  Wheat,
  TreePine,
  TrendingUp,
  Landmark,
  Shield,
  AlertTriangle,
  HeartHandshake,
  Map,
  Briefcase,
  Wifi,
  Droplets,
  Banknote,
  Home,
  Eye,
  Cloud,
  BookOpen,
  MapPin,
  Code,
  Database,
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [datasets, setDatasets] = useState<ApprovedContribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch categories to find the current one
        const categories = await fetchCategories()
        const currentCategory = categories.find((c) => c.slug === params.slug)

        if (!currentCategory) {
          setError("Category not found")
          setLoading(false)
          return
        }

        setCategory(currentCategory)

        // Fetch all approved contributions
        const response = await fetchApprovedContributions(1)
        
        // Filter datasets by category
        const categoryDatasets = response.data.filter((dataset) =>
          dataset.categories.some((cat) => cat.id === currentCategory.id)
        )

        setDatasets(categoryDatasets)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load category data")
        console.error("Error loading category:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading category...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl text-center">
              <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">Category Not Found</h3>
              <p className="mt-2 text-muted-foreground">{error || "The category you're looking for doesn't exist."}</p>
              <Link href="/categories">
                <Button className="mt-4">Back to Categories</Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  const Icon = iconMap[category.icon] || Database

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Link href="/categories">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-1 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </Link>

            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/20">
                <Icon className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl">{category.name}</h1>
                <p className="mt-2 text-lg text-primary-foreground/90">{category.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                    {category.datasets_count} {category.datasets_count === 1 ? 'Dataset' : 'Datasets'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Datasets Grid */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-foreground">Datasets in {category.name}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            {datasets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {datasets.map((dataset) => (
                  <Link key={dataset.id} href={`/datasets/${dataset.id}`}>
                    <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                            {dataset.title}
                          </h3>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{dataset.message}</p>
                        
                        <div className="mb-4 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                            {dataset.organization}
                          </Badge>
                          {dataset.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="outline" className="gap-1 text-xs">
                              <Tag className="h-3 w-3" />
                              {tag.name}
                            </Badge>
                          ))}
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
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No datasets yet</h3>
                <p className="mt-2 text-muted-foreground">Datasets for this category are coming soon.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}