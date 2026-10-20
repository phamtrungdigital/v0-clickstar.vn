'use client'

import { useState } from 'react'
import Link from '@/components/app-link'
import { ArrowRight, BookOpen, Layers, MessageCircleQuestion, Minus, Plus } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { serviceFaqItems } from '@/lib/seo/service-faq'
import { Eyebrow } from '@/components/ui/eyebrow'
import { PageUpdated } from '@/components/seo/page-updated'
import { faqPageSchema } from '@/lib/seo/schema'

type Both = { vi: string; en: string }

/** Khối câu hỏi thường gặp của trang dịch vụ: câu trả lời luôn nằm trong HTML (ẩn bằng CSS khi đóng) và có dữ liệu FAQPage. */
export function ServiceFaq({ slug }: { slug: string }) {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)
  const items = serviceFaqItems(slug)
  if (!items.length) return null
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-labelledby={`faq-${slug}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(items, language === 'en' ? 'en' : 'vi')) }}
      />
      <div className="mx-auto max-w-4xl">
        <Eyebrow><MessageCircleQuestion />{t('Câu hỏi thường gặp', 'FAQ')}</Eyebrow>
        <h2 id={`faq-${slug}`} className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
          {t('Những điều doanh nghiệp hay hỏi trước khi bắt đầu', 'What businesses ask before they start')}
        </h2>
        <div className="mt-8 border-t border-[#e0e0e0]">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="border-b border-[#e0e0e0]">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left text-[17px] font-semibold text-[#1d1d1f]"
                >
                  <span>{t(item.q.vi, item.q.en)}</span>
                  {isOpen ? (
                    <Minus className="mt-0.5 h-5 w-5 shrink-0 text-[#515154]" strokeWidth={1.6} />
                  ) : (
                    <Plus className="mt-0.5 h-5 w-5 shrink-0 text-[#515154]" strokeWidth={1.6} />
                  )}
                </button>
                <p className={`pb-5 pr-0 sm:pr-10 leading-relaxed sm:text-justify hyphens-auto text-[#515154] ${isOpen ? '' : 'hidden'}`}>{t(item.a.vi, item.a.en)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Cụm cuối trang dịch vụ (đặt ngay trên khối liên hệ): câu hỏi thường gặp (câu đầu là trả lời nhanh) và bài nên đọc tiếp. */
export function ServiceBottom({ slug }: { slug: string }) {
  return (
    <>
      <ServiceFaq slug={slug} />
      <ServiceReadMore slug={slug} />
      <PageUpdated />
    </>
  )
}

/** Bài blog nên đọc tiếp theo từng dịch vụ (dẫn liên kết nội bộ từ trang dịch vụ sang bài hay nhất). */
const READ_MORE: Record<string, { slug: string; title: Both }[]> = {
  website: [
    { slug: 'vercel-tinh-nang-moi-thang-10-2026', title: { vi: 'Vercel tháng 10/2026: Next.js 16.4, Daemons, Services và Token Pass có gì mới', en: 'Vercel in October 2026: what is new in Next.js 16.4, Daemons, Services and Token Pass' } },
    { slug: 'tu-duy-seo-thoi-dai-ai', title: { vi: 'Tư duy SEO thời đại AI: từ giành thứ hạng sang trở thành nguồn được trích dẫn', en: 'SEO thinking in the AI era: from ranking to being cited' } },
  ],
  'digital-marketing': [
    { slug: 'tu-duy-seo-thoi-dai-ai', title: { vi: 'Tư duy SEO thời đại AI: từ giành thứ hạng sang trở thành nguồn được trích dẫn', en: 'SEO thinking in the AI era: from ranking to being cited' } },
    { slug: 'model-ai-tao-video-tot-nhat-thang-10-2026', title: { vi: 'Các model AI tạo video tốt nhất hiện nay (10/2026): bảng xếp hạng, giá và cách chọn', en: 'The best AI video models right now (October 2026): ranking, prices and how to choose' } },
  ],
  'ai-integration': [
    { slug: 'cach-su-dung-gpt-toi-uu-nhat', title: { vi: 'Cách sử dụng GPT tối ưu nhất: chọn model, viết prompt, kiểm chứng và dùng API đúng cách', en: 'How to use GPT well: choosing a model, writing prompts, verifying output and using the API properly' } },
    { slug: '7-ky-nang-su-dung-ai-ai-cung-can-biet', title: { vi: '7 kỹ năng sử dụng AI mà ai cũng cần biết', en: '7 AI skills everyone needs' } },
    { slug: 'xu-huong-ai-nam-2030', title: { vi: 'Xu hướng AI đến năm 2030: điều đã đo được và việc nên làm từ bây giờ', en: 'AI trends to 2030: what has been measured and what to do from now' } },
  ],
  automation: [
    { slug: 'huong-dan-vibe-coding-hieu-qua', title: { vi: 'Hướng dẫn vibe coding hiệu quả: từ ý tưởng đến sản phẩm chạy được', en: 'A guide to effective vibe coding: from idea to a working product' } },
    { slug: 'claude-cap-nhat-thang-10-2026', title: { vi: 'Claude cập nhật tháng 10/2026: model 5.5, Dashboards, Fast mode và việc nên làm', en: 'Claude in October 2026: 5.5 models, Dashboards, Fast mode and what to do' } },
  ],
  'crm-cdp': [
    { slug: 'api-la-gi-cach-su-dung-api-toi-uu', title: { vi: 'API là gì? Cách sử dụng API tối ưu, từ khái niệm đến kiểm soát chi phí', en: 'What is an API? How to use APIs well, from the concept to cost control' } },
    { slug: 'quy-dinh-bao-ve-du-lieu-ca-nhan', title: { vi: 'Quy định bảo vệ dữ liệu cá nhân của Click Star', en: "Click Star's personal data protection policy" } },
  ],
  dashboard: [
    { slug: 'supabase-select-2026-cap-nhat-moi', title: { vi: 'Supabase Select 2026: Turso, Multigres, OrioleDB và các mốc cần xử lý', en: 'Supabase Select 2026: Turso, Multigres, OrioleDB and deadlines' } },
    { slug: 'api-la-gi-cach-su-dung-api-toi-uu', title: { vi: 'API là gì? Cách sử dụng API tối ưu, từ khái niệm đến kiểm soát chi phí', en: 'What is an API? How to use APIs well, from the concept to cost control' } },
  ],
  'custom-software': [
    { slug: 'huong-dan-vibe-coding-hieu-qua', title: { vi: 'Hướng dẫn vibe coding hiệu quả: từ ý tưởng đến sản phẩm chạy được', en: 'A guide to effective vibe coding: from idea to a working product' } },
    { slug: 'api-la-gi-cach-su-dung-api-toi-uu', title: { vi: 'API là gì? Cách sử dụng API tối ưu, từ khái niệm đến kiểm soát chi phí', en: 'What is an API? How to use APIs well, from the concept to cost control' } },
    { slug: 'vercel-tinh-nang-moi-thang-10-2026', title: { vi: 'Vercel tháng 10/2026: Next.js 16.4, Daemons, Services và Token Pass có gì mới', en: 'Vercel in October 2026: what is new in Next.js 16.4, Daemons, Services and Token Pass' } },
  ],
  'speech-insight-ai': [
    { slug: 'cach-su-dung-gpt-toi-uu-nhat', title: { vi: 'Cách sử dụng GPT tối ưu nhất: chọn model, viết prompt, kiểm chứng và dùng API đúng cách', en: 'How to use GPT well: choosing a model, writing prompts, verifying output and using the API properly' } },
    { slug: 'xu-huong-ai-nam-2030', title: { vi: 'Xu hướng AI đến năm 2030: điều đã đo được và việc nên làm từ bây giờ', en: 'AI trends to 2030: what has been measured and what to do from now' } },
  ],
}

export function ServiceReadMore({ slug }: { slug: string }) {
  const { t } = useLanguage()
  const items = READ_MORE[slug]
  if (!items?.length) return null
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-14" aria-labelledby={`srm-${slug}`}>
      <div className="mx-auto max-w-4xl">
        <Eyebrow><BookOpen />{t('Đọc thêm', 'Read more')}</Eyebrow>
        <h2 id={`srm-${slug}`} className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
          {t('Bài viết nên đọc tiếp', 'Further reading')}
        </h2>
        <ul className="mt-4 divide-y divide-[#e5e7eb] rounded-2xl border border-[#e5e7eb] bg-white">
          {items.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-[#1d1d1f] hover:text-[#1559b8]"
              >
                <span>{t(p.title.vi, p.title.en)}</span>
                <ArrowRight className="h-4 w-4 flex-none transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Dịch vụ liên quan hiện cuối bài blog: theo bài cụ thể, nếu không có thì theo nhãn chủ đề. */
export const SERVICE_LABELS: Record<string, Both> = {
  website: { vi: 'Thiết kế website chuẩn SEO, tải nhanh', en: 'SEO-ready, fast website design' },
  'digital-marketing': { vi: 'Dịch vụ Digital Marketing: SEO, quảng cáo, nội dung', en: 'Digital marketing: SEO, ads and content' },
  'ai-integration': { vi: 'Tích hợp AI vào quy trình doanh nghiệp', en: 'Integrating AI into business processes' },
  automation: { vi: 'AI Automation: tự động hóa quy trình', en: 'AI automation for business processes' },
  'crm-cdp': { vi: 'CRM và CDP: hợp nhất dữ liệu khách hàng', en: 'CRM and CDP: one view of your customers' },
  dashboard: { vi: 'Dashboard dữ liệu cho doanh nghiệp', en: 'Data dashboards for business' },
  'custom-software': { vi: 'Phần mềm theo yêu cầu: bảo mật, ổn định', en: 'Custom software: secure and dependable' },
  'speech-insight-ai': { vi: 'Call to Text và phân tích cuộc gọi bằng AI', en: 'Call to Text and AI call analytics' },
}

const BY_POST: Record<string, string[]> = {
  'vercel-tinh-nang-moi-thang-10-2026': ['website', 'custom-software'],
  'cach-su-dung-gpt-toi-uu-nhat': ['ai-integration', 'automation'],
  'api-la-gi-cach-su-dung-api-toi-uu': ['custom-software', 'ai-integration'],
  'huong-dan-vibe-coding-hieu-qua': ['custom-software', 'automation'],
  'xu-huong-ai-nam-2030': ['ai-integration', 'crm-cdp'],
  'tu-duy-seo-thoi-dai-ai': ['digital-marketing', 'website'],
  '7-ky-nang-su-dung-ai-ai-cung-can-biet': ['ai-integration', 'automation'],
  'tin-cong-nghe-tuan-12-18-10-2026': ['ai-integration', 'custom-software'],
  'model-ai-tao-video-tot-nhat-thang-10-2026': ['digital-marketing', 'ai-integration'],
  'claude-cap-nhat-thang-10-2026': ['ai-integration', 'automation'],
  'supabase-select-2026-cap-nhat-moi': ['custom-software', 'dashboard'],
  'quy-dinh-bao-ve-du-lieu-ca-nhan': ['crm-cdp', 'custom-software'],
  'digital-marketing-2026': ['digital-marketing', 'dashboard'],
  'crm-vs-cdp-comparison': ['crm-cdp', 'dashboard'],
  'xay-dung-dashboard': ['dashboard', 'crm-cdp'],
  'xu-huong-ai': ['ai-integration', 'automation'],
  'cach-su-dung-claude-co-ban-huong-dan-cho-nguoi-moi-bat-dau': ['ai-integration', 'automation'],
}
const BY_TAG: Record<string, string> = {
  ai: 'ai-integration',
  seo: 'digital-marketing',
  'công nghệ': 'custom-software',
  'kỹ năng': 'ai-integration',
  video: 'digital-marketing',
}

export function relatedServiceSlugs(postSlug: string, tags: string[]): string[] {
  if (BY_POST[postSlug]) return BY_POST[postSlug]
  const out: string[] = []
  for (const tag of tags) {
    const s = BY_TAG[tag.trim().toLowerCase()]
    if (s && !out.includes(s)) out.push(s)
  }
  return out.slice(0, 3)
}

export function RelatedServices({ postSlug, tags }: { postSlug: string; tags: string[] }) {
  const { t } = useLanguage()
  const slugs = relatedServiceSlugs(postSlug, tags)
  if (!slugs.length) return null
  return (
    <aside className="mt-8 rounded-2xl border border-[#cfe0f7] bg-[#f3f8ff] p-5" aria-label={t('Dịch vụ liên quan', 'Related services')}>
      <Eyebrow numbered={false}><Layers />{t('Dịch vụ liên quan', 'Related services')}</Eyebrow>
      <ul className="mt-4 flex flex-col gap-2">
        {slugs.map((s) => (
          <li key={s}>
            <Link
              href={`/services/${s}`}
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#1d1d1f] hover:text-[#1559b8]"
            >
              {t(SERVICE_LABELS[s].vi, SERVICE_LABELS[s].en)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
