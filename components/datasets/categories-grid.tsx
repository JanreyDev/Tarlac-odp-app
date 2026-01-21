"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchCategories, type Category } from "@/lib/api"
import { Loader2, Database } from "lucide-react"
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
} from "lucide-react"

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

export function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories")
        console.error("Error loading categories:", err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (loading) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading categories...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Database className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Error Loading Categories</h3>
            <p className="mt-2 text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <Database className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No categories yet</h3>
            <p className="mt-2 text-muted-foreground">Categories will appear here once they are added.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Database
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg group-hover:text-primary">{category.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary">
                          {category.datasets_count} {category.datasets_count === 1 ? 'dataset' : 'datasets'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}