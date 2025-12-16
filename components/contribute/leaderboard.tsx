import { Trophy, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export type Contributor = {
  name: string
  department: string
  contributions: number
  recent: string
}

type LeaderboardProps = {
  contributors: Contributor[]
}

export function Leaderboard({ contributors }: LeaderboardProps) {
  const topTotal = contributors[0]?.contributions ?? 1

  return (
    <Card className="border-border/70 shadow-lg">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Trophy className="h-4 w-4" />
            Top contributors
          </div>
          <CardTitle className="mt-3 text-2xl">Provincial data champions</CardTitle>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs text-foreground">
          Updated weekly
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {contributors.map((person, index) => {
          const progress = Math.max(6, Math.round((person.contributions / topTotal) * 100))
          const initials = person.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <div key={person.name} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.department}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:items-end">
                <div className="flex w-full items-center justify-between gap-2 text-xs text-muted-foreground sm:w-80">
                  <span>{person.contributions} contributions</span>
                  <span>Last: {person.recent}</span>
                </div>
                <Progress value={progress} className="h-2 w-full sm:w-80" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
