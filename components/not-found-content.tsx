'use client'

import Link from '@/components/app-link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/** Nội dung trang 404: thông báo rõ ràng và lối đi tới các trang chính. */
export function NotFoundContent() {
  const { t } = useLanguage()
  const links = [
    { href: '/', label: t('Trang chủ', 'Home'), note: t('Tổng quan về Click Star', 'An overview of Click Star') },
    { href: '/services', label: t('Dịch vụ', 'Services'), note: t('Marketing, website, dashboard, AI, CRM/CDP', 'Marketing, websites, dashboards, AI, CRM/CDP') },
    { href: '/projects', label: t('Dự án', 'Projects'), note: t('Các dự án đã triển khai', 'Projects we have delivered') },
    { href: '/blog', label: t('Bài viết', 'Blog'), note: t('Tin tức và kiến thức chuyển đổi số', 'News and digital transformation insights') },
    { href: '/contact', label: t('Liên hệ', 'Contact'), note: t('Nhận tư vấn miễn phí', 'Get a free consultation') },
  ]
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1859b8]">404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl text-balance">
          {t('Không tìm thấy trang bạn cần', 'We could not find that page')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
          {t('Đường dẫn có thể đã đổi hoặc không còn tồn tại. Bạn có thể đi tiếp từ các trang dưới đây.', 'The link may have changed or no longer exists. You can continue from one of the pages below.')}
        </p>
        <ul className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-white px-5 py-4 transition-colors hover:border-primary">
                <span>
                  <span className="block font-bold text-foreground">{l.label}</span>
                  <span className="block text-sm text-muted-foreground">{l.note}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
