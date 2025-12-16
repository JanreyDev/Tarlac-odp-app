import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/data"
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
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Database
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group h-full transition-all hover:shadow-lg hover:border-primary/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg group-hover:text-primary">{category.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary">
                          {category.datasets} datasets
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
