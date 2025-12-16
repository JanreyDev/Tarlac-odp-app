import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, MessageSquare, Bug, Lightbulb, CheckCircle, LogIn, Trophy, ShieldCheck, Phone } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { topContributors } from "@/lib/data"
import { ContributeRequestForm } from "@/components/contribute/contribute-request-form"
import { ContributorLeaderboard } from "@/components/contribute/contributor-leaderboard"

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
        <section className="relative overflow-hidden bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/0" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
              Provincial contributors
            </div>
            <h1 className="mt-4 text-3xl font-bold text-primary-foreground sm:text-4xl">Contribute to Open Data</h1>
            <p className="mt-3 max-w-3xl text-base text-primary-foreground/85 sm:text-lg">
              Help us build a comprehensive open data resource for Tarlac Province. Sign in and make sure your profile
              has a contact number so we can reach you for validation.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 bg-primary-foreground text-secondary-foreground hover:bg-primary-foreground/90">
                  <LogIn className="h-4 w-4" />
                  Sign in to contribute
                </Button>
              </Link>
              <div className="inline-flex items-center gap-2 rounded-full bg-black/15 px-3 py-2 text-xs font-medium text-primary-foreground/90 backdrop-blur">
                <Phone className="h-4 w-4" />
                Login + contact number required
              </div>
            </div>
          </div>
        </section>

        {/* Contribution Options */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <Card key={item.title} className="text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-7 w-7" />
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

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {["Data must be from a legitimate government or institutional source", "No personal identifying information (PII) or sensitive data", "Data should be in machine-readable format (CSV, JSON, etc.)", "Include metadata describing the dataset contents", "Specify the license and usage terms", "Provide contact information for data inquiries"].map((guideline, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-background/70 px-3 py-2 shadow-sm">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-muted-foreground">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="w-full">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Submit a Request
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                      Auth + contact required
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    You must be signed in and have a contact number saved in your profile before submitting. Please
                    update your profile after login.
                  </div>
                  <ContributeRequestForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Trophy className="h-5 w-5 text-primary" />
              Top contributor leaderboard
            </div>
            <ContributorLeaderboard fallback={topContributors} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
