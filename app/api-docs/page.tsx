import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, Download, FileJson, Database, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer API | Tarlac Open Data Portal",
  description:
    "Access Tarlac Open Data programmatically through our REST API. Documentation for developers, researchers, and data scientists.",
}

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground">REST API v1</Badge>
            <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">Developer API</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Access Tarlac Open Data programmatically. Build apps, conduct research, and integrate datasets into your
              projects.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="secondary" className="gap-2">
                <Code className="h-4 w-4" />
                View on GitHub
              </Button>
              <Button
                variant="outline"
                className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download SDK
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Quick Start</h2>
            <p className="mt-3 text-muted-foreground">
              Get started with the Tarlac Open Data API in minutes. No authentication required for public datasets.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Choose a Dataset",
                  desc: "Browse our catalog and find the data you need",
                },
                {
                  step: "2",
                  title: "Make a Request",
                  desc: "Use the REST API endpoint with your parameters",
                },
                {
                  step: "3",
                  title: "Use the Data",
                  desc: "Parse the JSON response in your application",
                },
              ].map((item) => (
                <Card key={item.step}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Code Example */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Example Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="curl" className="w-full">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                  </TabsList>
                  <TabsContent value="curl">
                    <div className="relative rounded-lg bg-slate-900 p-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="overflow-x-auto text-sm text-slate-100">
                        <code>{`curl -X GET "https://api.data.tarlac.gov.ph/v1/datasets" \\
  -H "Accept: application/json"`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript">
                    <div className="relative rounded-lg bg-slate-900 p-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="overflow-x-auto text-sm text-slate-100">
                        <code>{`const response = await fetch(
  'https://api.data.tarlac.gov.ph/v1/datasets',
  { headers: { 'Accept': 'application/json' } }
);
const data = await response.json();
console.log(data);`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="python">
                    <div className="relative rounded-lg bg-slate-900 p-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-2 h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <pre className="overflow-x-auto text-sm text-slate-100">
                        <code>{`import requests

response = requests.get(
    'https://api.data.tarlac.gov.ph/v1/datasets',
    headers={'Accept': 'application/json'}
)
data = response.json()
print(data)`}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Endpoints */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">API Endpoints</h2>
            <p className="mt-3 text-muted-foreground">
              All endpoints return JSON by default. Use the Accept header for other formats.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/v1/datasets",
                  desc: "List all datasets with pagination",
                  params: "page, per_page, category, search",
                },
                {
                  method: "GET",
                  endpoint: "/v1/datasets/{id}",
                  desc: "Get a specific dataset by ID",
                  params: "id",
                },
                {
                  method: "GET",
                  endpoint: "/v1/datasets/{id}/resources",
                  desc: "List all resources for a dataset",
                  params: "id, format",
                },
                {
                  method: "GET",
                  endpoint: "/v1/categories",
                  desc: "List all data categories",
                  params: "-",
                },
                {
                  method: "GET",
                  endpoint: "/v1/publishers",
                  desc: "List all data publishers",
                  params: "-",
                },
                {
                  method: "GET",
                  endpoint: "/v1/geojson/{layer}",
                  desc: "Get GeoJSON data for a map layer",
                  params: "layer, bbox, limit",
                },
              ].map((api) => (
                <Card key={api.endpoint}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Badge className="shrink-0 bg-emerald-100 text-emerald-700">{api.method}</Badge>
                      <div>
                        <code className="text-sm font-medium text-foreground">{api.endpoint}</code>
                        <p className="mt-1 text-sm text-muted-foreground">{api.desc}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Params:</span> {api.params}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Data Formats */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Supported Formats</h2>
            <p className="mt-3 text-muted-foreground">Download data in multiple formats to suit your needs.</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { format: "JSON", icon: FileJson, desc: "Default API response format" },
                { format: "CSV", icon: Database, desc: "Tabular data for spreadsheets" },
                { format: "GeoJSON", icon: FileJson, desc: "Geographic data for mapping" },
                { format: "XLSX", icon: Database, desc: "Excel workbook format" },
              ].map((item) => (
                <Card key={item.format}>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.format}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Rate Limits & Terms */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Rate Limits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-primary-foreground/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>1,000 requests per hour (unauthenticated)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>10,000 requests per hour (with API key)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>No limits on bulk downloads</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Terms of Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-primary-foreground/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Free for commercial and non-commercial use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Attribution appreciated but not required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span>Open Data Commons license</span>
                  </div>
                  <Link href="/terms">
                    <Button
                      variant="link"
                      className="mt-2 h-auto p-0 text-primary-foreground/90 hover:text-primary-foreground"
                    >
                      View Full Terms <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
