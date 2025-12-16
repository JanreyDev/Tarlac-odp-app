import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/hero/hero-section"
import { StatisticsSection } from "@/components/home/statistics-section"
import { RecentDatasetsSection } from "@/components/home/recent-datasets-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { FeaturedMapsSection } from "@/components/home/featured-maps-section"
import { ApiCtaSection } from "@/components/home/api-cta-section"
import { DataGlanceSection } from "@/components/home/data-glance-section"

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
