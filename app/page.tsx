import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { StatisticsSection } from "@/components/statistics-section"
import { RecentDatasetsSection } from "@/components/recent-datasets-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedMapsSection } from "@/components/featured-maps-section"
import { ApiCtaSection } from "@/components/api-cta-section"
import { DataGlanceSection } from "@/components/data-glance-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatisticsSection />
        <DataGlanceSection />
        <RecentDatasetsSection />
        <CategoriesSection />
        <FeaturedMapsSection />
        <ApiCtaSection />
      </main>
      <Footer />
    </div>
  )
}
