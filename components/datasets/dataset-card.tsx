import Link from "next/link"
import { ArrowRight, FileText, Tag, Building2, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DatasetCardProps {
  id: string
  title: string
  description: string
  publisher: string
  category: string
  resources: number
  size: string
  publishedDate: string
}

export function DatasetCard({
  id,
  title,
  description,
  publisher,
  category,
  resources,
  size,
  publishedDate,
}: DatasetCardProps) {
  return (
    <Link href={`/datasets/${id}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">{title}</h3>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
              <Building2 className="h-3 w-3" />
              {publisher}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Tag className="h-3 w-3" />
              {category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {resources} {resources === 1 ? "resource" : "resources"}
              </span>
              <span>{size}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {publishedDate}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
