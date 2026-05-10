import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PricingSection } from '@/components/sections/pricing-section'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bảng giá - ClickStar',
  description: 'Các gói dịch vụ chuyển đổi số phù hợp với mọi quy mô doanh nghiệp',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MainNav />
      
      {/* Hero Section */}
      <section className="bg-background-soft pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            BẢNG GIÁ DỊCH VỤ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance">
            Giải pháp phù hợp cho{' '}
            <span className="text-primary">mọi doanh nghiệp</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chọn gói dịch vụ phù hợp với nhu cầu và quy mô của doanh nghiệp bạn. 
            Liên hệ để được tư vấn chi tiết và báo giá tốt nhất.
          </p>
        </div>
      </section>

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
