import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DatasetsListing } from "@/components/datasets/datasets-listing"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datasets | Tarlac Open Data Portal",
  description:
    "Browse and download public datasets from Tarlac Province. Access education, health, infrastructure, agriculture, and governance data.",
}

export default function DatasetsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl">Browse Datasets</h1>
            <p className="mt-3 text-lg text-primary-foreground/90">
              Discover and download public datasets from Tarlac Province
            </p>
          </div>
        </section>

        <Suspense fallback={<DatasetsSkeleton />}>
          <DatasetsListing />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

function DatasetsSkeleton() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[180px] animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
