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

export interface FileData {
  success: boolean
  data: {
    headers: string[]
    rows: Record<string, any>[]
  }
  file_type: string
  headers: string[]
  rows: Record<string, any>[]
}

type ApiFetchOptions = RequestInit & { path: string }

type ApiError = Error & { status?: number }

async function apiFetch<T>(options: ApiFetchOptions): Promise<T> {
  const { path, headers, body, ...rest } = options

  // Detect if body is FormData
  const isFormData = body instanceof FormData

  const response = await fetch(`${defaultBase}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body,
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

// 🔐 Auth
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>({
    path: "/login",
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// 📥 Fetch contributions
export async function fetchContributes(token?: string) {
  return apiFetch<unknown>({
    path: "/contributes",
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

// 📤 Submit contribution (JSON or FormData)
export type ContributePayload = {
  organization: string
  request_type: string
  message: string
  name?: string
  email?: string
  file?: File
}

export async function submitContribution(payload: ContributePayload | FormData, token?: string) {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload)

  return apiFetch<unknown>({
    path: "/contributes",
    method: "POST",
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

// 📄 Update contribution status (Admin only)
export type UpdateContributionPayload = {
  status?: 'pending' | 'approved' | 'rejected'
  categories?: number[]
  tags?: number[]
}

export async function updateContribution(id: string | number, payload: UpdateContributionPayload, token?: string) {
  return apiFetch<unknown>({
    path: `/contributes/${id}`,
    method: "PUT",
    body: JSON.stringify(payload),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

// 📊 Get single contribution
export async function getContribution(id: string | number, token?: string) {
  return apiFetch<unknown>({
    path: `/contributes/${id}`,
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

// 🏆 Ranking
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
  organization?: string
}

// Categories
export type Category = {
  id: number
  name: string
  slug: string
  datasets_count: number
  description: string
  icon: string
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>({
    path: "/categories",
    method: "GET",
  })
}

export async function fetchCategoriesWithCounts(): Promise<Category[]> {
  return apiFetch<Category[]>({
    path: "/categories",
    method: "GET",
  })
}

// Create new category (Admin only)
export type CreateCategoryPayload = {
  name: string
  icon: string
  description?: string
}

export type CreateCategoryResponse = {
  message: string
  category: Category
}

export async function createCategory(payload: CreateCategoryPayload, token: string): Promise<CreateCategoryResponse> {
  return apiFetch<CreateCategoryResponse>({
    path: "/categories",
    method: "POST",
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  })
}

// Fetch all tags
export async function fetchTags() {
  return apiFetch<Array<{ id: number; name: string }>>({
    path: "/tags",
    method: "GET",
  })
}

// Contributions
export type ApprovedContribution = {
  id: number
  title: string
  organization: string
  request_type: string
  message: string
  file_path: string | null
  status: string
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
  categories: Array<{
    id: number
    name: string
  }>
  tags: Array<{
    id: number
    name: string
  }>
}

export type PaginatedResponse<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export async function fetchApprovedContributions(page: number = 1): Promise<PaginatedResponse<ApprovedContribution>> {
  return apiFetch<PaginatedResponse<ApprovedContribution>>({
    path: `/contributes/approved?page=${page}`,
    method: "GET",
  })
}

export async function fetchSingleApprovedContribution(id: string | number): Promise<ApprovedContribution> {
  return apiFetch<ApprovedContribution>({
    path: `/contributes/approved/${id}`,
    method: "GET",
  })
}

export async function fetchSingleContribution(id: string | number): Promise<ApprovedContribution> {
  return apiFetch<ApprovedContribution>({
    path: `/contributes/${id}`,
    method: "GET",
  })
}



export async function fetchFileData(id: string): Promise<FileData> {
  return apiFetch<FileData>({
    path: `/contributes/approved/${id}/data`,
    method: "GET",
  })
}



export async function fetchContributorRanking(): Promise<RankingItem[]> {
  const data = await apiFetch<LaravelRankingItem[]>({
    path: "/contributes/leaderboard",
    method: "GET",
  })

  return data.map((item, idx) => {
    const types = item.request_types ?? {}
    const topEntry = Object.entries(types).sort((a, b) => Number(b[1]) - Number(a[1]))[0]

    const formattedType = topEntry
      ? topEntry[0].replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      : null

    return {
      name: item.user?.name ?? `Contributor ${idx + 1}`,
      department: item.organization ?? "—",
      contributions: Number(item.total ?? 0),
      recent: formattedType ?? "Recent activity",
    }
  })
}