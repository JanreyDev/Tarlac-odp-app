import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Users, Target, Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Tarlac Open Data Portal",
  description:
    "Learn about the Tarlac Open Data Portal initiative and our commitment to government transparency and public access to data.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">About the Portal</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Empowering citizens, researchers, and developers with transparent access to government data
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our Mission</h2>
                <p className="mt-4 text-muted-foreground">
                  The Tarlac Open Data Portal is the official platform of the Provincial Government of Tarlac for
                  publishing and sharing government datasets with the public. Our mission is to promote transparency,
                  accountability, and citizen participation through open access to government information.
                </p>
                <p className="mt-4 text-muted-foreground">
                  By making data freely available, we aim to support evidence-based decision making, enable research and
                  innovation, and foster a more informed and engaged citizenry.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Transparency</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Promoting open government through accessible public data
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Participation</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enabling citizen engagement in governance and planning
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Innovation</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Supporting research, startups, and data-driven solutions
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Accountability</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Ensuring responsible use of public resources</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Use Section */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Who Can Use This Data?</h2>
              <p className="mt-3 text-muted-foreground">Our datasets are available to everyone - free of charge</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Students & Researchers", desc: "Academic research, theses, and school projects" },
                { title: "Developers", desc: "Build applications using our open APIs" },
                { title: "Journalists", desc: "Data-driven reporting and investigations" },
                { title: "NGOs & Civil Society", desc: "Advocacy and community development" },
                { title: "Businesses", desc: "Market research and investment planning" },
                { title: "Government Agencies", desc: "Inter-agency data sharing and coordination" },
                { title: "Local Communities", desc: "Barangay planning and local initiatives" },
                { title: "International Partners", desc: "Development programs and benchmarking" },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Data Categories */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">22 Data Categories</h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive coverage of provincial government data across all sectors
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Education",
                "Population",
                "Health",
                "Infrastructure",
                "Agriculture",
                "Environment",
                "Economy",
                "Governance",
                "Public Safety",
                "Disaster Risk",
                "Social Services",
                "Tourism",
                "Employment",
                "ICT",
                "Utilities",
                "Finance",
                "Land & Housing",
                "Open Government",
                "Climate",
                "Youth",
                "GIS/Mapping",
                "Developer APIs",
              ].map((cat) => (
                <span key={cat} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {cat}
                </span>
              ))}
            </div>
            <Link href="/categories">
              <Button className="mt-8">Browse All Categories</Button>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Contact Us</h2>
                <p className="mt-4 text-primary-foreground/90">
                  Have questions about the data? Want to suggest a dataset? We'd love to hear from you.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-primary-foreground/90">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>Provincial Capitol Building, Tarlac City, Tarlac 2300</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary-foreground/90">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span>(045) 982-0000</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary-foreground/90">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>opendata@tarlac.gov.ph</span>
                  </div>
                </div>
              </div>
              <Card className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-primary-foreground">Related Links</h3>
                  <div className="mt-4 space-y-3">
                    {[
                      { name: "Provincial Government of Tarlac", url: "#" },
                      { name: "Freedom of Information Portal", url: "#" },
                      { name: "Philippine Statistics Authority", url: "#" },
                      { name: "Open Data Philippines", url: "#" },
                    ].map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {link.name}
                      </a>
                    ))}
                  </div>
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
