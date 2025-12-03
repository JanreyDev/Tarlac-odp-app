"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
} from "recharts"

// Top Populations data - municipalities
const populationData = [
  { name: "Tarlac City", value: 388675 },
  { name: "Concepcion", value: 162543 },
  { name: "Paniqui", value: 145231 },
  { name: "Camiling", value: 112876 },
  { name: "Capas", value: 98432 },
  { name: "Gerona", value: 87654 },
  { name: "Victoria", value: 76543 },
]

// Agricultural Mix data
const agricultureData = [
  { name: "Rice", value: 45, color: "#22c55e" },
  { name: "Corn", value: 20, color: "#f59e0b" },
  { name: "Sugarcane", value: 18, color: "#3b82f6" },
  { name: "Vegetables", value: 10, color: "#ef4444" },
  { name: "Root Crops", value: 7, color: "#a855f7" },
]

// Tourism Growth data
const tourismData = [
  { year: "2019", visitors: 120000 },
  { year: "2020", visitors: 45000 },
  { year: "2021", visitors: 68000 },
  { year: "2022", visitors: 145000 },
  { year: "2023", visitors: 210000 },
]

export function DataGlanceSection() {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Data at a Glance</h2>
          <p className="mt-2 text-muted-foreground">Key indicators and statistics for Tarlac Province</p>
          <Link href="/datasets" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            View all data →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Top Populations Bar Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Top Populations</h3>
                <div className="rounded-md bg-primary/10 p-1.5">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={populationData} layout="horizontal">
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), "Population"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Agricultural Mix Donut Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Agricultural Mix</h3>
                <div className="rounded-md bg-primary/10 p-1.5">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agricultureData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {agricultureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, ""]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                {agricultureData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tourism Growth Line Chart */}
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Tourism Growth</h3>
                <div className="rounded-md bg-primary/10 p-1.5">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tourismData}>
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), "Visitors"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ fill: "#f59e0b", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
