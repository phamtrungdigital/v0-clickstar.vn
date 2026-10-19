'use client'

import Link from '@/components/app-link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

type Both = { vi: string; en: string }

/**
 * Đoạn trả lời trực tiếp ngay dưới phần đầu mỗi trang dịch vụ: câu hỏi khách hay hỏi và câu trả lời gọn có số liệu,
 * để công cụ tìm kiếm và AI trích đúng đoạn này. Chỉ ghi số liệu đã được chủ site xác nhận (20/10/2026);
 * muốn đổi số thì sửa ở đây rồi cập nhật cả bản tiếng Anh.
 */
const ANSWERS: Record<string, { q: Both; a: Both }> = {
  website: {
    q: { vi: 'Thiết kế website tại Click Star mất bao lâu?', en: 'How long does website design at Click Star take?' },
    a: {
      vi: 'Một website doanh nghiệp tại Click Star thường hoàn thành trong khoảng 5 đến 7 ngày, tùy yêu cầu cụ thể. Website nhiều chức năng hơn được báo thời gian riêng khi tư vấn. Website thiết kế responsive, tối ưu tốc độ tải và chuẩn SEO kỹ thuật ngay từ đầu. Chi phí được báo sau buổi tư vấn miễn phí.',
      en: 'A business website at Click Star is usually finished in about 5 to 7 days, depending on the requirements. Websites with more features get their own timeline during the consultation. Every site is built responsive, fast-loading and technically SEO-ready from the start. Cost is quoted after a free consultation.',
    },
  },
  'digital-marketing': {
    q: { vi: 'Dịch vụ Digital Marketing giá bao nhiêu, bao lâu thấy kết quả?', en: 'How much does digital marketing cost and when do results show?' },
    a: {
      vi: 'Gói Starter từ 8 triệu đồng mỗi tháng, gói Professional từ 25 triệu đồng mỗi tháng, gói Enterprise báo giá theo nhu cầu. Phí quảng cáo trả cho Facebook, Google, TikTok tính riêng theo ngân sách của doanh nghiệp. Thông thường sau 3 đến 4 tuần doanh nghiệp bắt đầu thấy kết quả.',
      en: 'The Starter plan is from 8 million VND a month, Professional from 25 million VND a month, and Enterprise is quoted to your needs. Ad spend paid to Facebook, Google and TikTok is billed separately according to your own budget. Businesses usually start to see results after 3 to 4 weeks.',
    },
  },
  'crm-cdp': {
    q: { vi: 'Triển khai CRM và CDP mất bao lâu, chi phí bao nhiêu?', en: 'How long does a CRM and CDP rollout take and what does it cost?' },
    a: {
      vi: 'Tích hợp CRM và CDP với hệ thống hiện có (website, nền tảng quảng cáo, email, chăm sóc khách hàng) mất khoảng 2 đến 4 tuần, chi phí một lần từ 20 đến 50 triệu đồng. Sau đó vận hành theo gói từ 15 triệu hoặc từ 35 triệu đồng mỗi tháng.',
      en: 'Connecting a CRM and CDP to your existing systems (website, ad platforms, email, customer care) takes about 2 to 4 weeks, with a one-time cost of 20 to 50 million VND. After that it runs on a plan from 15 million or from 35 million VND a month.',
    },
  },
  'ai-integration': {
    q: { vi: 'Tích hợp AI vào quy trình doanh nghiệp mất bao lâu, chi phí bao nhiêu?', en: 'How long does AI integration take and what does it cost?' },
    a: {
      vi: 'Một quy trình AI riêng, ví dụ chấm điểm khách hàng tiềm năng, tự phân loại email hoặc tạo nội dung, thường mất 2 đến 3 tuần với chi phí từ 15 đến 40 triệu đồng. Click Star tư vấn miễn phí một đối một trước khi báo giá theo nhu cầu cụ thể.',
      en: 'A custom AI workflow, such as lead scoring, automatic email sorting or content generation, usually takes 2 to 3 weeks and costs 15 to 40 million VND. Click Star gives a free one-to-one consultation before quoting for your specific needs.',
    },
  },
  automation: {
    q: { vi: 'Tự động hóa quy trình bằng AI mất bao lâu?', en: 'How long does AI process automation take?' },
    a: {
      vi: 'Một quy trình tự động hóa mất từ 1 đến 3 tuần tùy độ phức tạp. Click Star tự phát triển nền tảng tự động hóa và thiết kế quy trình riêng cho nghiệp vụ của từng doanh nghiệp, thay vì dùng một mẫu chung cho mọi khách hàng.',
      en: 'An automation workflow takes 1 to 3 weeks depending on complexity. Click Star builds its own automation platform and designs each workflow around the specific operations of the business, rather than using one template for every client.',
    },
  },
  dashboard: {
    q: { vi: 'Dashboard dữ liệu của Click Star dùng để làm gì?', en: 'What is a Click Star data dashboard for?' },
    a: {
      vi: 'Dashboard của Click Star gom số liệu bán hàng, quảng cáo và vận hành từ nhiều nguồn vào một màn hình, tự cập nhật và có báo cáo tự động, để lãnh đạo xem tình hình kinh doanh trong vài giây thay vì tổng hợp thủ công. Thời gian và chi phí được báo sau buổi tư vấn miễn phí.',
      en: 'A Click Star dashboard brings sales, advertising and operations figures from many sources onto one screen, updates itself and sends automatic reports, so leaders see the state of the business in seconds instead of compiling it by hand. Time and cost are quoted after a free consultation.',
    },
  },
  'custom-software': {
    q: { vi: 'Làm phần mềm theo yêu cầu mất bao lâu?', en: 'How long does custom software take to build?' },
    a: {
      vi: 'Thời gian tùy theo yêu cầu của doanh nghiệp, trung bình khoảng 15 ngày. Mỗi thay đổi được đưa lên môi trường thử để doanh nghiệp duyệt trước khi lên hệ thống chính, có sao lưu hằng ngày và có thể quay về phiên bản trước trong vài phút.',
      en: 'It depends on the business requirements and averages about 15 days. Every change goes to a test environment for the business to approve before it reaches the live system, with daily backups and the ability to roll back to the previous version within minutes.',
    },
  },
  'speech-insight-ai': {
    q: { vi: 'Triển khai Speech Insight AI mất bao lâu?', en: 'How long does Speech Insight AI take to set up?' },
    a: {
      vi: 'Khoảng 15 ngày, tùy vào việc viết kết nối với tổng đài hiện có. Khi chạy, 100% cuộc gọi được chuyển thành văn bản, chấm điểm theo bộ tiêu chí của doanh nghiệp và gắn cờ những cuộc gọi vi phạm.',
      en: 'About 15 days, depending on the work of writing the connection to your existing call system. Once running, 100% of calls are turned into text, scored against your own criteria and flagged when they break the rules.',
    },
  },
}

export function ServiceAnswer({ slug }: { slug: string }) {
  const { t } = useLanguage()
  const item = ANSWERS[slug]
  if (!item) return null
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-12" aria-labelledby={`sa-${slug}`}>
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#cfe0f7] bg-[#f3f8ff] px-6 py-6 sm:px-8 sm:py-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1559b8]">{t('Trả lời nhanh', 'Quick answer')}</p>
        <h2 id={`sa-${slug}`} className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
          {t(item.q.vi, item.q.en)}
        </h2>
        <p className="mt-3 text-base sm:text-[17px] leading-relaxed text-[#3a3a3c]">{t(item.a.vi, item.a.en)}</p>
      </div>
    </section>
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
        <h2 id={`srm-${slug}`} className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f]">
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
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1559b8]">{t('Dịch vụ liên quan', 'Related services')}</p>
      <ul className="mt-3 flex flex-col gap-2">
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
