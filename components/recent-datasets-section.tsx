import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatasetCard } from "@/components/dataset-card"
import { recentDatasets } from "@/lib/data"

export function RecentDatasetsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Recently Added Datasets</h2>
          <p className="mt-2 text-muted-foreground">Explore the latest datasets added to our portal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} {...dataset} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/datasets">
            <Button className="gap-2">
              Browse All Datasets
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
