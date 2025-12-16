import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Tarlac Open Data Portal",
  description: "Access the Tarlac Open Data Portal with your issued credentials to manage and explore provincial datasets.",
}

const highlights = [
  {
    title: "Role-based access",
    copy: "Stay aligned with your department's permissions while keeping data safe.",
  },
  {
    title: "Always on",
    copy: "Optimized for quick access across desktop and mobile, even on slower links.",
  },
  {
    title: "GIS ready",
    copy: "Connect to maps and spatial layers without leaving the portal.",
  },
  {
    title: "Contribution-ready profiles",
    copy: "Add a contact number after login to unlock dataset submissions and requests.",
  },
]

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-linear-to-br from-background via-secondary/30 to-background">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-10 lg:py-14">
        <section className="relative hidden overflow-hidden rounded-2xl bg-card shadow-xl lg:block lg:w-5/12">
          <Image
            src="/tarlac_capitol.jpg"
            alt="Tarlac Provincial Capitol"
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-primary/40 to-black/70" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between p-8 text-primary-foreground">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <ShieldCheck className="h-4 w-4" />
                Province of Tarlac
              </div>
              <h2 className="text-3xl font-semibold leading-tight">Open data that works with you.</h2>
              <p className="max-w-xl text-sm text-primary-foreground/90">
                Sign in to manage data requests, contribute datasets, and access GIS-ready layers with secure, role-based
                permissions.
              </p>
            </div>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-lg bg-black/20 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">{item.title}</p>
                    <p className="text-xs text-primary-foreground/80">{item.copy}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2 text-xs text-primary-foreground/80">
                <Sparkles className="h-4 w-4" />
                Purpose-built for provincial teams and partners.
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-1 items-center justify-center lg:w-7/12">
          <div className="w-full max-w-xl rounded-2xl bg-card/70 p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <LoginForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
