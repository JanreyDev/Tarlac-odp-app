import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoriesGrid } from "@/components/categories-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories | Tarlac Open Data Portal",
  description: "Browse all 22 data categories including education, health, agriculture, infrastructure, and more.",
}

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl">Data Categories</h1>
            <p className="mt-3 text-lg text-primary-foreground/90">
              Explore all 22 categories of public datasets from Tarlac Province
            </p>
          </div>
        </section>

        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  )
}
