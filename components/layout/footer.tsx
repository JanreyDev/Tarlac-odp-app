import Link from "next/link"
import { Database, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Content Notice */}
      <div className="bg-primary/5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <span className="text-xs text-primary">i</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Content Notice</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                This portal and all its content are maintained by the Provincial Government of Tarlac. All information,
                data, documents, and materials provided on this website are in the public domain unless otherwise noted.
                Public domain content may be freely used, copied, distributed, and modified without permission or
                attribution, though attribution is appreciated.
              </p>
              <Link href="/terms" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Database className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tarlac Open Data</p>
                  <p className="text-xs text-muted-foreground">data.tarlac.gov.ph</p>
                </div>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                The official open data portal of Tarlac Province, providing transparent access to government datasets.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/datasets" className="text-sm text-muted-foreground hover:text-primary">
                    Browse Datasets
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/maps" className="text-sm text-muted-foreground hover:text-primary">
                    Interactive Maps
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-primary">
                    Developer API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Popular Categories</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/categories/education" className="text-sm text-muted-foreground hover:text-primary">
                    Education
                  </Link>
                </li>
                <li>
                  <Link href="/categories/health" className="text-sm text-muted-foreground hover:text-primary">
                    Health
                  </Link>
                </li>
                <li>
                  <Link href="/categories/infrastructure" className="text-sm text-muted-foreground hover:text-primary">
                    Infrastructure
                  </Link>
                </li>
                <li>
                  <Link href="/categories/agriculture" className="text-sm text-muted-foreground hover:text-primary">
                    Agriculture
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Contact Us</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>Provincial Capitol, Tarlac City</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>(045) 982-0000</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>opendata@tarlac.gov.ph</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Provincial Government of Tarlac. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-primary">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
