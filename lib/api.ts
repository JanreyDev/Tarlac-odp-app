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
    credentials: "include",
  })
}

export async function fetchContributes(token?: string) {
  return apiFetch<unknown>({
    path: "/contributes",
    method: "GET",
    credentials: "include",
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
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

export type RankingItem = {
  name: string
  department: string
  contributions: number
  recent: string
}

export async function fetchContributorRanking(): Promise<RankingItem[]> {
  const data = await apiFetch<{ data?: unknown; contributors?: RankingItem[]; ranking?: RankingItem[]; [key: string]: unknown}>(
    {
      path: "/contributes/ranking",
      method: "GET",
      credentials: "include",
    },
  )

  const entries = (Array.isArray((data as { data?: unknown }).data) && (data as { data: RankingItem[] }).data)
    || (Array.isArray((data as { contributors?: unknown }).contributors) && (data as { contributors: RankingItem[] }).contributors)
    || (Array.isArray((data as { ranking?: unknown }).ranking) && (data as { ranking: RankingItem[] }).ranking)
    || (Array.isArray(data) ? (data as RankingItem[]) : [])

  return entries.map((item, idx) => ({
    name: item?.name || `Contributor ${idx + 1}`,
    department: item?.department || "-",
    contributions: Number(item?.contributions ?? 0),
    recent: item?.recent || "Recent activity",
  }))
}
