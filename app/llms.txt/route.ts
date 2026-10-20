import { createPublicClient } from '@/lib/supabase/public'
import { localizePath } from '@/lib/i18n/locale'

// Tệp /llms.txt: trang chữ thuần giới thiệu site cho các công cụ AI (theo đề xuất llmstxt.org).
// Tự dựng từ dữ liệu đang đăng trên site nên không bị cũ; làm mới mỗi giờ.
export const revalidate = 3600

const BASE = 'https://clickstar.vn'
const BRAND = /\s*\|\s*Click\s?Star\s*$/i

type I18n = { vi?: string; en?: string } | null

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim()
const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s)
const line = (title: string, path: string, desc?: string | null) => {
  const d = cut(clean(desc), 160)
  return `- [${clean(title)}](${BASE}${localizePath(path, 'vi')})${d ? `: ${d}` : ''}`
}

export async function GET() {
  const supabase = createPublicClient()
  const [settingsRes, pagesRes, postsRes, projectsRes] = await Promise.all([
    supabase.from('site_settings').select('contact_email, contact_phone, address').limit(1).maybeSingle(),
    supabase.from('pages').select('slug, seo_title, seo_description').eq('is_published', true).order('slug'),
    supabase
      .from('posts')
      .select('slug, title, excerpt, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(30),
    supabase
      .from('case_studies')
      .select('slug, title_vi, summary_vi')
      .eq('status', 'published')
      .order('sort_order', { ascending: false }),
  ])

  const pages = (pagesRes.data ?? []) as { slug: string; seo_title: I18n; seo_description: I18n }[]
  const pageLine = (p: { slug: string; seo_title: I18n; seo_description: I18n }) =>
    line(clean(p.seo_title?.vi).replace(BRAND, '') || p.slug, p.slug === 'home' ? '/' : `/${p.slug}`, p.seo_description?.vi)
  const bySlug = (re: RegExp) => pages.filter((p) => re.test(p.slug))

  const out: string[] = []
  out.push('# Click Star')
  out.push('')
  out.push(
    '> Click Star là công ty tại Hà Nội cung cấp giải pháp chuyển đổi số cho doanh nghiệp: Digital Marketing, thiết kế website, dashboard dữ liệu, tích hợp AI, tự động hóa, CRM và CDP, phần mềm theo yêu cầu. Đội ngũ có hơn 10 năm kinh nghiệm; bắt đầu từ agency năm 2018, mở rộng sang CRM và hệ thống vận hành từ năm 2021 và thành lập công ty năm 2025. Website có 2 ngôn ngữ: tiếng Việt (địa chỉ gốc) và tiếng Anh (thêm /en vào đầu đường dẫn).'
  )
  out.push('')

  const intro = [...bySlug(/^home$/), ...bySlug(/^about$/)]
  if (intro.length) out.push('## Giới thiệu', '', ...intro.map(pageLine), '')

  const services = [...bySlug(/^services\//), ...bySlug(/^ads-hub$/), ...bySlug(/^pricing$/)]
  if (services.length) out.push('## Dịch vụ và bảng giá', '', ...services.map(pageLine), '')

  const projects = (projectsRes.data ?? []) as { slug: string; title_vi: string; summary_vi: string }[]
  if (projects.length) {
    out.push('## Dự án đã làm', '', ...projects.map((p) => line(p.title_vi, `/projects/${p.slug}`, p.summary_vi)), '')
  }

  const posts = (postsRes.data ?? []) as { slug: string; title: I18n; excerpt: I18n }[]
  if (posts.length) {
    out.push(
      '## Bài viết mới nhất',
      '',
      ...posts.map((p) => line(p.title?.vi || p.slug, `/blog/${p.slug}`, p.excerpt?.vi)),
      '',
    )
  }

  const s = settingsRes.data as { contact_email: string | null; contact_phone: string | null; address: I18n } | null
  const contact = [
    s?.contact_email ? `- Email: ${s.contact_email}` : '',
    s?.contact_phone ? `- Điện thoại: ${s.contact_phone}` : '',
    s?.address?.vi ? `- Địa chỉ: ${clean(s.address.vi)}` : '',
    `- Trang liên hệ: ${BASE}/contact`,
    `- Sơ đồ trang web: ${BASE}/sitemap.xml`,
  ].filter(Boolean)
  out.push('## Liên hệ', '', ...contact, '')

  return new Response(out.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
