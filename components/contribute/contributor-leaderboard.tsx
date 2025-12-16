"use client"

import { useEffect, useState } from "react"
import { Leaderboard, type Contributor } from "@/components/contribute/leaderboard"
import { fetchContributorRanking } from "@/lib/api"

type Props = {
  fallback: Contributor[]
}

export function ContributorLeaderboard({ fallback }: Props) {
  const [entries, setEntries] = useState<Contributor[]>(fallback)
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setStatus("loading")
      try {
        const data = await fetchContributorRanking()
        if (!cancelled && Array.isArray(data) && data.length) {
          const normalized: Contributor[] = data.map((item) => ({
            name: item.name,
            department: item.department,
            contributions: item.contributions,
            recent: item.recent,
          }))
          setEntries(normalized)
          setStatus("idle")
        } else {
          setStatus("idle")
        }
      } catch (err) {
        setStatus("error")
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-3">
      {status === "loading" ? <p className="text-sm text-muted-foreground">Loading leaderboard...</p> : null}
      {status === "error" ? <p className="text-sm text-destructive">Unable to load latest rankings. Showing last known list.</p> : null}
      <Leaderboard contributors={entries} />
    </div>
  )
}
