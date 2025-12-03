import { Database, FileText, Building2, HardDrive } from "lucide-react"
import { Card } from "@/components/ui/card"
import { statistics } from "@/lib/data"

const stats = [
  {
    label: "DATASETS",
    value: statistics.datasets.toString(),
    icon: Database,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "RESOURCES",
    value: statistics.resources.toLocaleString(),
    icon: FileText,
    color: "bg-amber-100 text-amber-600",
  },
  {
    label: "PUBLISHERS",
    value: statistics.publishers.toString(),
    icon: Building2,
    color: "bg-sky-100 text-sky-600",
  },
  {
    label: "TOTAL SIZE",
    value: statistics.totalSize,
    icon: HardDrive,
    color: "bg-slate-100 text-slate-600",
  },
]

export function StatisticsSection() {
  return (
    <section className="bg-primary/5 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex items-center justify-between gap-4 bg-card p-4 shadow-sm sm:p-6">
              <div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
                <p className="text-xs font-medium tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
