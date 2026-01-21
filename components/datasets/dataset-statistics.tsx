import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Database, TrendingUp, Layers, TrendingDown } from "lucide-react"

interface Category {
  id: number
  name: string
}

interface Dataset {
  id: number
  title: string
  categories: Category[]
  created_at: string
}

interface DatasetStatisticsProps {
  datasets: Dataset[]
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function DatasetStatistics({ datasets }: DatasetStatisticsProps) {
  // Calculate total datasets
  const totalDatasets = datasets.length

  // Calculate datasets by category
  const categoryStats = datasets.reduce((acc, dataset) => {
    dataset.categories.forEach((category) => {
      if (!acc[category.name]) {
        acc[category.name] = 0
      }
      acc[category.name]++
    })
    return acc
  }, {} as Record<string, number>)

  // Convert to array for charts
  const categoryData = Object.entries(categoryStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8) // Top 8 categories

  // Calculate datasets per year
  const yearlyStats = datasets.reduce((acc, dataset) => {
    const date = new Date(dataset.created_at)
    const year = date.getFullYear().toString()
    if (!acc[year]) {
      acc[year] = 0
    }
    acc[year]++
    return acc
  }, {} as Record<string, number>)

  // Sort years and get all years data
  const yearlyData = Object.entries(yearlyStats)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year))

  // Calculate growth rate
  const calculateGrowth = () => {
    if (yearlyData.length < 2) return null
    const lastYear = yearlyData[yearlyData.length - 1]
    const previousYear = yearlyData[yearlyData.length - 2]
    const growth = ((lastYear.count - previousYear.count) / previousYear.count) * 100
    return {
      percentage: growth.toFixed(1),
      isPositive: growth > 0
    }
  }

  const growth = calculateGrowth()

  // Total categories
  const totalCategories = Object.keys(categoryStats).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDatasets}</div>
            <p className="text-xs text-muted-foreground">Approved contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Unique categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year-over-Year Growth</CardTitle>
            {growth?.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            {growth ? (
              <>
                <div className={`text-2xl font-bold ${growth.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {growth.isPositive ? '+' : ''}{growth.percentage}%
                </div>
                <p className="text-xs text-muted-foreground">
                  vs. previous year
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-muted-foreground">N/A</div>
                <p className="text-xs text-muted-foreground">Insufficient data</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart - Datasets by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Datasets by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Yearly Growth */}
        {yearlyData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dataset Growth (Yearly)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="year" 
                    className="text-muted-foreground"
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis 
                    className="text-muted-foreground"
                    tick={{ fontSize: 14 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                    labelFormatter={(value) => `Year: ${value}`}
                    formatter={(value) => [`${value} datasets`, 'Total']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}