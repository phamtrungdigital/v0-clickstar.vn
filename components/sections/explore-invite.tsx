import Link from '@/components/app-link'
import { Compass } from 'lucide-react'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'

/**
 * Dải mời vào trang /kham-pha (thế giới công nghệ 3D) ở trang chủ. Chỉ là chữ + một nút, không nạp three.js:
 * cảnh 3D nằm ở trang riêng nên điểm tốc độ của trang chủ không đổi.
 */
export function ExploreInvite({ lang = 'vi' }: { lang?: Lang }) {
  const t = makeT(lang)
  return (
    <section
      aria-label={t('Khám phá thế giới công nghệ Click Star', 'Explore the Click Star technology world')}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div
        className="mx-auto flex max-w-7xl flex-col items-start gap-5 rounded-[28px] px-7 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10"
        style={{ background: 'radial-gradient(120% 140% at 15% 0%, #1b4ea8 0%, #0a1a3d 55%, #050d22 100%)' }}
      >
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#9cc4ff]">
            <Compass className="h-4 w-4" aria-hidden="true" />
            {t('Thế giới Click Star', 'The Click Star world')}
          </p>
          <h2 className="mt-2 text-balance text-[24px] font-extrabold leading-tight sm:text-[30px]">
            {t('Bước vào thế giới công nghệ của Click Star', 'Step into the Click Star technology world')}
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-[#b8cdf0]">
            {t('Chạm vào từng khu để xem Website, CRM & CDP, Phân tích cuộc gọi AI, Dashboard và ADS hub làm được gì cho doanh nghiệp.', 'Tap each area to see what Website, CRM & CDP, AI Call Analytics, Dashboards and ADS hub can do for your business.')}
          </p>
        </div>
        <Link
          href="/kham-pha"
          className="inline-flex h-12 flex-none items-center rounded-full bg-white px-7 text-[15.5px] font-semibold text-[#0a1a3d] transition-colors hover:bg-[#dbe7ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a3d]"
        >
          {t('Khám phá 3D', 'Explore in 3D')}
        </Link>
      </div>
    </section>
  )
}
