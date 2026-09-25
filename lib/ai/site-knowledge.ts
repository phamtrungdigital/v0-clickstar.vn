// Server-only: kiến thức cho bot AI = TOÀN BỘ nội dung công khai của website.
//
// Hai nguồn, ghép theo từng URL:
//  1. Chữ viết cứng trong code các trang → trích lúc build (scripts/build-site-knowledge.mjs)
//  2. Nội dung quản trị trong DB (trang CMS, bảng giá, dự án, blog, liên hệ) → đọc lúc chạy,
//     cache theo tag nên admin bấm Lưu là bot đọc bản mới (hoặc tối đa 1 giờ).
// Chỉ đọc qua anon client → RLS đã chặn bài nháp / dự án chưa xuất bản.
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import staticKnowledge from './site-knowledge.static.json'

export const SITE_KNOWLEDGE_TAG = 'site-knowledge'

export type SiteKnowledge = {
  text: string
  /** Mọi đường dẫn nội bộ có thật — bot chỉ được gợi ý link nằm trong tập này. */
  routes: string[]
  builtAt: string
}

// Khối không mang thông tin thật cho khách: terminal là kịch bản minh hoạ (số liệu dựng),
// dải logo chỉ là tên hãng (đã có trong trang dịch vụ).
const SKIP_SECTION_TYPES = new Set(['code_terminal', 'pricing_tabs_nav'])

const SECTION_NAME: Record<string, string> = {
  hero: 'Banner đầu trang',
  page_hero: 'Giới thiệu trang',
  services: 'Danh sách dịch vụ',
  about: 'Giới thiệu công ty',
  stats: 'Số liệu nổi bật',
  case_studies: 'Dự án tiêu biểu',
  team: 'Đội ngũ',
  testimonials: 'Khách hàng đánh giá',
  faq: 'Câu hỏi thường gặp',
  blog: 'Tin tức',
  cta: 'Kêu gọi liên hệ',
  pricing_tiers: 'Bảng giá',
  pricing_grouped_tiers: 'Bảng giá theo nhóm dịch vụ',
  pricing_setup_addons: 'Dịch vụ triển khai / phí setup',
  problems_grid: 'Vấn đề và giải pháp',
  feature_grid: 'Tính năng',
  process_steps: 'Quy trình',
  about_story: 'Câu chuyện công ty',
  about_values: 'Giá trị cốt lõi',
  about_timeline: 'Hành trình phát triển',
  about_why_choose_us: 'Vì sao chọn Click Star',
  client_logos: 'Logo công nghệ',
  logo_marquee: 'Logo công nghệ & AI đang tích hợp',
  ads_hub_screenshots: 'Ảnh màn hình sản phẩm',
}

const SKIP_KEY =
  /(^|_)(href|url|image|img|logo|icon|color|gradient|bg|avatar|photo|video|src|id|slug|type|variant|style|theme|size|enabled|order|layout|target|rel|cover|thumbnail|grayscale|popular|cta_label|button_label|placeholder)$|^(showNames|show_names|delay_ms)$/i

const KEY_ORDER = [
  'eyebrow', 'badge', 'label', 'name', 'title', 'heading', 'heading_lead', 'heading_number',
  'heading_middle', 'heading_highlight', 'subtitle', 'description', 'desc', 'price',
  'price_period', 'price_note', 'duration', 'features', 'question', 'answer',
]
const KEY_LABEL: Record<string, string> = {
  price: 'Giá',
  price_note: 'Ghi chú giá',
  duration: 'Thời gian',
  features: 'Gồm',
  question: 'Hỏi',
  answer: 'Đáp',
  phone: 'Điện thoại',
}

type Json = null | string | number | boolean | Json[] | { [k: string]: Json }

/** Chỉ khử trùng câu đủ dài để chắc là cùng một đoạn; số liệu ngắn luôn giữ nguyên. */
const MIN_DEDUP_CHARS = 40

const isI18n = (v: Json): v is { vi: string; en: string } =>
  !!v && typeof v === 'object' && !Array.isArray(v) && typeof (v as any).vi === 'string'

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()

function textOf(v: Json): string | null {
  if (typeof v === 'string') return clean(v) || null
  if (isI18n(v)) return clean(v.vi) || null
  return null
}

function orderKeys(keys: string[]) {
  return [...keys].sort((a, b) => {
    const ia = KEY_ORDER.indexOf(a)
    const ib = KEY_ORDER.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b)
  })
}

/** Tên hiển thị của 1 phần tử trong mảng (nhóm giá, gói, câu FAQ…) để làm "đường dẫn cha". */
function itemTitle(item: Json): string | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const o = item as Record<string, Json>
  return textOf(o.label ?? o.name ?? o.title ?? o.heading ?? null)
}

/**
 * Dàn JSON nội dung section thành các dòng tiếng Việt thụt lề theo cấp.
 * Phần tử lồng trong phần tử (gói trong nhóm giá) được ghi kèm tên cha:
 * "- Website & Dashboard › Landing Page". AI đọc văn bản dài dễ gán nhầm gói
 * của nhóm này sang nhóm khác nếu chỉ dựa vào thụt lề — đã xảy ra với bảng giá.
 */
function flatten(node: Json, key: string | null, depth: number, out: string[], crumb = '') {
  const pad = '  '.repeat(depth)
  const lab = (v: string) => {
    // Ô "giá" của gói Phân tích cuộc gọi chứa HẠN MỨC PHÚT ("10.000 phút"), không phải tiền.
    // Gắn nhãn "Giá:" thì AI đọc thành "giá 10.000 phút" dù prompt đã dặn — sửa ở dữ liệu.
    if (key === 'price' && /phút|cuộc gọi|lượt/i.test(v)) return `Hạn mức: ${v}`
    return key && KEY_LABEL[key] ? `${KEY_LABEL[key]}: ${v}` : v
  }
  if (node == null || typeof node === 'boolean') return
  if (typeof node === 'number') {
    if (key && !SKIP_KEY.test(key)) out.push(pad + `${key}: ${node}`)
    return
  }
  const t = textOf(node)
  if (t != null) {
    if (!/^(\/|https?:|#)/.test(t)) out.push(pad + lab(t))
    return
  }
  if (Array.isArray(node)) {
    if (node.length && node.every((x) => textOf(x) != null)) {
      out.push(pad + lab(node.map((x) => textOf(x)).join('; ')))
      return
    }
    const rendered = node.map((item) => {
      const title = itemTitle(item)
      const sub: string[] = []
      flatten(item, null, depth + 1, sub, title ? (crumb ? `${crumb} › ${title}` : title) : crumb)
      return { title, sub }
    })
    // Mảng toàn phần tử chỉ có 1 dòng ngắn (dải logo: tên hãng) → gộp 1 dòng. Để 18 dòng
    // rời không tiêu đề thì AI ghép sai nhóm ("OpenAI: Claude, Gemini…").
    const allShort = rendered.every((r) => r.sub.length === 1 && r.sub[0].trim().length <= 40)
    if (rendered.length > 2 && allShort) {
      out.push(pad + lab(rendered.map((r) => r.sub[0].trim()).join('; ')))
      return
    }
    for (const { title, sub } of rendered) {
      if (sub.length) {
        const first = sub[0].trimStart()
        sub[0] = pad + '- ' + (crumb && title && first === title ? `${crumb} › ${first}` : first)
        out.push(...sub)
      }
    }
    return
  }
  if (typeof node === 'object') {
    for (const k of orderKeys(Object.keys(node))) {
      if (SKIP_KEY.test(k)) continue
      flatten((node as any)[k], k, depth, out, crumb)
    }
  }
}

function slugToRoute(slug: string) {
  return slug === 'home' ? '/' : '/' + slug
}

async function build(): Promise<SiteKnowledge> {
  const supabase = createPublicClient()
  const [pagesRes, casesRes, postsRes, settingsRes, webRes, teamRes] = await Promise.all([
    supabase.from('pages').select('slug, sections').eq('is_published', true),
    supabase
      .from('case_studies')
      .select('slug, title_vi, client_name, industry_vi, summary_vi, metrics, tags')
      .eq('status', 'published')
      .order('sort_order'),
    supabase
      .from('posts')
      .select('slug, title, excerpt, tags, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase.from('site_settings').select('contact_email, contact_phone, address, zalo_url').eq('id', 1).maybeSingle(),
    supabase.from('web_content').select('footer').eq('id', 1).maybeSingle(),
    supabase.from('team_members').select('name, role_vi').eq('enabled', true).order('sort_order'),
  ])

  const staticRoutes = (staticKnowledge as { routes: Record<string, string> }).routes
  const dbByRoute: Record<string, string[]> = {}
  for (const p of pagesRes.data ?? []) {
    const lines: string[] = []
    for (const s of (p.sections as any[]) ?? []) {
      if (!s || s.enabled === false || SKIP_SECTION_TYPES.has(s.type)) continue
      // Tên khối mở đầu mỗi phần → AI biết dòng nào thuộc bảng giá, dòng nào là logo, FAQ…
      const block: string[] = []
      flatten(s.content as Json, null, 0, block)
      if (block.length) lines.push(`[${SECTION_NAME[s.type] ?? s.type}]`, ...block)
    }
    if (lines.length) dbByRoute[slugToRoute(p.slug)] = lines
  }

  const routes = new Set<string>([...Object.keys(staticRoutes), ...Object.keys(dbByRoute)])
  const blocks: string[] = []

  // Trang: nội dung admin (DB) trước, chữ trong code sau. Chỉ bỏ dòng code trùng
  // một đoạn DÀI của DB. KHÔNG khử trùng dòng ngắn: "Giá: Từ 8 triệu" của gói Website
  // trùng chữ với gói Marketing nhưng là 2 thông tin khác nhau — khử là mất giá.
  const order = [...routes].sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))
  for (const route of order) {
    const dbLines = dbByRoute[route] ?? []
    const longDb = new Set(dbLines.map((l) => l.trim()).filter((l) => l.length >= MIN_DEDUP_CHARS))
    const staticLines = (staticRoutes[route]?.split('\n') ?? []).filter((l) => !longDb.has(l.trim()))
    const lines = [...dbLines, ...staticLines]
    if (lines.length) blocks.push(`### TRANG ${route}\n${lines.join('\n')}`)
  }

  const cases = casesRes.data ?? []
  if (cases.length) {
    const lines = cases.map((c) => {
      routes.add(`/projects/${c.slug}`)
      const metrics = Array.isArray(c.metrics)
        ? (c.metrics as { value?: string; label_vi?: string }[])
            .map((m) => [m?.value, m?.label_vi].filter(Boolean).join(' '))
            .filter(Boolean)
            .join('; ')
        : ''
      // client_name "Bảo mật" = khách yêu cầu ẩn tên — giữ nguyên để bot không tự đoán tên
      return `- ${c.title_vi} (khách: ${c.client_name}${c.industry_vi ? ', ngành ' + c.industry_vi : ''}) → /projects/${c.slug}\n  ${clean(c.summary_vi ?? '')}${metrics ? `\n  Kết quả: ${metrics}` : ''}`
    })
    blocks.push(`### DỰ ÁN ĐÃ TRIỂN KHAI (trang /projects)\n${lines.join('\n')}`)
  }

  const posts = postsRes.data ?? []
  if (posts.length) {
    const lines = posts.map((p) => {
      routes.add(`/blog/${p.slug}`)
      return `- ${textOf(p.title as Json) ?? p.slug} → /blog/${p.slug}\n  ${textOf(p.excerpt as Json) ?? ''}`
    })
    blocks.push(`### BÀI VIẾT BLOG (trang /blog)\n${lines.join('\n')}`)
  }

  const team = teamRes.data ?? []
  if (team.length) {
    blocks.push(`### ĐỘI NGŨ (trang /about)\n${team.map((m) => `- ${m.name}${m.role_vi ? ' — ' + m.role_vi : ''}`).join('\n')}`)
  }

  const contact: string[] = []
  const st = settingsRes.data
  if (st?.contact_phone) contact.push(`Điện thoại (trang Liên hệ): ${st.contact_phone}`)
  if (st?.contact_email) contact.push(`Email: ${st.contact_email}`)
  const addr = textOf((st?.address ?? null) as Json)
  if (addr) contact.push(`Địa chỉ: ${addr}`)
  if (st?.zalo_url) contact.push(`Zalo: ${st.zalo_url}`)
  const footerLines: string[] = []
  flatten((webRes.data?.footer ?? null) as Json, null, 0, footerLines)
  if (footerLines.length) contact.push('Chân trang website:', ...footerLines)
  if (contact.length) blocks.push(`### THÔNG TIN LIÊN HỆ\n${contact.join('\n')}`)

  for (const r of ['/pricing', '/about', '/contact', '/projects', '/blog', '/services', '/ads-hub']) routes.add(r)

  return { text: blocks.join('\n\n'), routes: [...routes].sort(), builtAt: new Date().toISOString() }
}

/**
 * Khoá cache gồm: FORMAT_VERSION (tăng khi đổi cách trình bày ở file này) + mã băm
 * phần chữ trích từ code (đổi mỗi khi trang đổi chữ). Data Cache của Vercel sống qua
 * các lần deploy, nên thiếu 2 phần này thì bản deploy mới vẫn đọc kiến thức CŨ tới 1 giờ.
 */
const FORMAT_VERSION = '3'
const staticVersion = (staticKnowledge as { version?: string }).version ?? 'dev'

export const getSiteKnowledge = unstable_cache(build, ['site-knowledge', FORMAT_VERSION, staticVersion], {
  tags: [SITE_KNOWLEDGE_TAG, 'pages', 'site_settings', 'web_content', 'team_members'],
  revalidate: 3600,
})
