import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DatasetCard } from "@/components/dataset-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories, recentDatasets } from "@/lib/data"
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
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

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

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = categories.find((c) => c.id === id)

  if (!category) {
    return {
      title: "Category Not Found | Tarlac Open Data Portal",
    }
  }

  return {
    title: `${category.name} | Tarlac Open Data Portal`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = categories.find((c) => c.id === id)

  if (!category) {
    notFound()
  }

  const Icon = iconMap[category.icon] || Database

  // Filter datasets for this category (simulated)
  const categoryDatasets = recentDatasets.filter(
    (d) =>
      d.category.toLowerCase() === category.name.split(" ")[0].toLowerCase() ||
      d.category.toLowerCase().includes(category.id),
  )

  // If no matching datasets, show all as example
  const displayDatasets = categoryDatasets.length > 0 ? categoryDatasets : recentDatasets.slice(0, 3)

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
                    {category.datasets} Datasets
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} {...dataset} />
              ))}
            </div>

            {displayDatasets.length === 0 && (
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
