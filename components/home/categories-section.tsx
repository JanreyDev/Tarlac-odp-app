import type React from "react"
import Link from "next/link"
import {
  ArrowRight,
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/data"

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
}

export function CategoriesSection() {
  // Show first 12 categories on homepage
  const displayedCategories = categories.slice(0, 12)

  return (
    <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">Explore datasets organized by topic area</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {displayedCategories.map((category) => {
            const Icon = iconMap[category.icon] || Database
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group h-full transition-all hover:shadow-md hover:border-primary/30">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{category.datasets} datasets</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/categories">
            <Button variant="outline" className="gap-2 bg-transparent">
              View All 22 Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Database({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}
