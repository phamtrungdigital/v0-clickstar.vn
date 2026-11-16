import type { Metadata } from 'next'
import Link from '@/components/app-link'
import { ArrowRight } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { ExploreExperience } from '@/components/explore/explore-experience'
import { StoryExperience } from '@/components/explore/story-experience'
import { ZONES } from '@/components/explore/zones'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'

/**
 * Trang "Thế giới Click Star" (16/11/2026 theo ý anh): khách vào một thế giới 3D, chạm vào các khu để xem sản phẩm.
 * Cảnh 3D chỉ là lớp trải nghiệm (components/explore/*, nạp sau khi trang tải xong); chữ và liên kết thật nằm ở
 * danh sách bên dưới, nên công cụ tìm kiếm, người dùng đọc màn hình và máy không có WebGL đều dùng được.
 */
export async function khamPhaMetadata(lang: Lang): Promise<Metadata> {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Khám phá thế giới công nghệ Click Star', 'Explore the Click Star technology world'),
    description: t(
      'Bước vào thế giới 3D của Click Star: chạm vào từng khu để xem Website, CRM & CDP, Phân tích cuộc gọi AI, Dashboard dữ liệu và ADS hub làm được gì cho doanh nghiệp.',
      'Step into the Click Star 3D world: tap each area to see what Website, CRM & CDP, AI Call Analytics, Data Dashboards and ADS hub can do for your business.'
    ),
    path: '/kham-pha',
    lang,
    images: await ogImageOr(),
  })
}

export function KhamPhaView({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const L = (x: { vi: string; en: string }) => (lang === 'vi' ? x.vi : x.en)
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <StoryExperience />
      <div id="the-gioi" className="scroll-mt-14">
        <ExploreExperience />
      </div>

      <section id="san-pham" className="scroll-mt-20 bg-[#f5f5f7] py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-balance text-3xl font-extrabold text-foreground sm:text-4xl">{t('Các khu trong thế giới Click Star', 'The areas of the Click Star world')}</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {t('Mỗi khu là một sản phẩm. Dữ liệu từ các khu cùng chảy về một nơi, để doanh nghiệp nhìn thấy toàn bộ hành trình của khách hàng.', 'Each area is a product. Data from every area flows into one place, so you can see the whole customer journey.')}
          </p>
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ZONES.map((z, i) => (
              <li key={z.id}>
                <Link
                  href={z.href}
                  className="group flex h-full flex-col rounded-2xl border border-[#e0e0e0] bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_-14px_rgba(0,0,0,.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6dda]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full text-[15px] font-bold text-[#06122b]" style={{ background: z.color }}>
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-foreground">{L(z.name)}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#515154]">{L(z.desc)}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[#1859b8]">
                    {t('Xem chi tiết', 'Learn more')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="inline-flex h-12 items-center rounded-full bg-[#1e6dda] px-7 text-[15.5px] font-semibold text-white transition-colors hover:bg-[#1859b8]">
              {t('Nhận tư vấn miễn phí', 'Get a free consultation')}
            </Link>
            <Link href="/services" className="inline-flex h-12 items-center rounded-full border border-[#d2d2d7] bg-white px-7 text-[15.5px] font-semibold text-foreground transition-colors hover:border-[#1e6dda]">
              {t('Xem tất cả dịch vụ', 'See all services')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
