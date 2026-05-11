import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PricingSection } from '@/components/sections/pricing-section'
import { PageHero } from '@/components/sections/page-hero'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MainNav />

      <PageHero />

      {/* Pricing Cards */}
      <PricingSection />

      {/* FAQ Mini Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Bạn cần tư vấn thêm?
          </h2>
          <p className="text-muted-foreground mb-8">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm ra giải pháp tối ưu nhất.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+84123456789"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg"
            >
              Gọi ngay: +84 123 456 789
            </a>
            <a
              href="mailto:info@clickstar.com"
              className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-4 rounded-full transition-all duration-200"
            >
              Gửi email tư vấn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
