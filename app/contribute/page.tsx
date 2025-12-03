import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, MessageSquare, Bug, Lightbulb, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contribute | Tarlac Open Data Portal",
  description: "Help improve the Tarlac Open Data Portal. Submit datasets, report issues, or suggest improvements.",
}

export default function ContributePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl">Contribute to Open Data</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Help us build a comprehensive open data resource for Tarlac Province
            </p>
          </div>
        </section>

        {/* Contribution Options */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Upload,
                  title: "Submit Data",
                  desc: "Share your organization's datasets for public access",
                },
                {
                  icon: Bug,
                  title: "Report Issues",
                  desc: "Found an error in a dataset? Let us know",
                },
                {
                  icon: Lightbulb,
                  title: "Suggest Datasets",
                  desc: "Request data that you'd like to see published",
                },
                {
                  icon: MessageSquare,
                  title: "Give Feedback",
                  desc: "Help us improve the portal experience",
                },
              ].map((item) => (
                <Card key={item.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Submission Guidelines</h2>
              <p className="mt-3 text-muted-foreground">
                To maintain data quality, please ensure your submissions meet these criteria
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                "Data must be from a legitimate government or institutional source",
                "No personal identifying information (PII) or sensitive data",
                "Data should be in machine-readable format (CSV, JSON, etc.)",
                "Include metadata describing the dataset contents",
                "Specify the license and usage terms",
                "Provide contact information for data inquiries",
              ].map((guideline, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-muted-foreground">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" placeholder="Your organization or agency" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Request Type</Label>
                    <select
                      id="type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a type</option>
                      <option value="submit">Submit Dataset</option>
                      <option value="request">Request Dataset</option>
                      <option value="report">Report Issue</option>
                      <option value="feedback">General Feedback</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your request or submission in detail..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
