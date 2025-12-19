const defaultBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "")

export type LoginPayload = {
  email: string
  password: string
  remember?: boolean
}

export type LoginResponse = {
  token?: string
  access_token?: string
  user?: unknown
  message?: string
  [key: string]: unknown
}

type ApiFetchOptions = RequestInit & { path: string }

type ApiError = Error & { status?: number }

async function apiFetch<T>(options: ApiFetchOptions): Promise<T> {
  const { path, headers, ...rest } = options
  const response = await fetch(`${defaultBase}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  })

  const contentType = response.headers.get("content-type") || ""
  const data = contentType.includes("application/json") ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || "Unable to reach the API"
    const error = new Error(message) as ApiError
    error.status = response.status
    throw error
  }

  return data as T
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>({
    path: "/login",
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchContributes(token?: string) {
  return apiFetch<unknown>({
    path: "/contributes",
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

export type ContributePayload = {
  organization: string
  request_type: string
  message: string
  name?: string
  email?: string
}

export async function submitContribution(payload: ContributePayload, token?: string) {
  return apiFetch<unknown>({
    path: "/contributes",
    method: "POST",
    body: JSON.stringify(payload),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

export type RankingItem = {
  name: string
  department: string
  contributions: number
  recent: string
}

type LaravelRankingItem = {
  user: {
    name: string
    email: string
  }
  total: number
  request_types: Record<string, number>
}

export async function fetchContributorRanking(): Promise<RankingItem[]> {
  const data = await apiFetch<any[]>({
    path: "/contributes/ranking",
    method: "GET",
  })

  return data.map((item, idx) => {
    const types = item.request_types ?? {}

    // get the request type with the highest count
    const topEntry = Object.entries(types).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    )[0]

    const formattedType = topEntry
      ? topEntry[0]
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase())
      : null

    return {
      name: item.user?.name ?? `Contributor ${idx + 1}`,
      department: item.organization ?? "—",
      contributions: Number(item.total ?? 0),
      recent: formattedType ?? "Recent activity",
    }
  })
}


