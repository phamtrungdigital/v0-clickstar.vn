import { createPublicClient } from '@/lib/supabase/public'
import { maskMediaUrl } from '@/lib/media-url'
import { localizePath, type Lang } from '@/lib/i18n/locale'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { caseStudyHasEnglish } from '@/lib/cms/case-studies-types'
import type { I18n } from '@/lib/cms/types'

/**
 * Sitemap chia nhóm (21/10/2026): /sitemap.xml là mục lục, trỏ tới 3 tệp con xếp theo thứ tự cố định:
 *   /sitemap-trang.xml  trang chủ, dịch vụ (theo thứ tự menu), sản phẩm, bảng giá, dự án, giới thiệu, blog, liên hệ
 *   /sitemap-blog.xml   bài viết, mới nhất trước, kèm ảnh bìa
 *   /sitemap-du-an.xml  dự án, theo thứ tự hiển thị trên website, kèm ảnh
 * Bản /en đứng ngay sau bản tiếng Việt của cùng trang, hai bản khai hreflang qua lại.
 * lastmod lấy theo lần sửa thật (không dùng "bây giờ"); không dùng changefreq/priority vì Google bỏ qua.
 * Không gắn XSLT (xml-stylesheet): Chrome sắp gỡ XSLT và hiện cảnh báo đỏ khi mở sitemap bằng trình duyệt (22/10/2026).
 */

export const BASE_URL = 'https://clickstar.vn'
export const CHILD_SITEMAPS = ['sitemap-trang.xml', 'sitemap-blog.xml', 'sitemap-du-an.xml'] as const

/** Thứ tự trang chính: khớp menu (components/layout/main-nav.tsx). Trang CMS khác (nếu có) xếp sau, theo đường dẫn. */
const PAGE_ORDER = [
  '/',
  '/services',
  '/services/digital-marketing',
  '/services/website',
  '/services/dashboard',
  '/services/ai-integration',
  '/services/automation',
  '/services/crm-cdp',
  '/services/speech-insight-ai',
  '/services/custom-software',
  '/ads-hub',
  '/pricing',
  '/projects',
  '/about',
  '/blog',
  '/contact',
]

type Entry = { path: string; lastmod: string | null; hasEn: boolean; images?: string[] }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const abs = (path: string, lang: Lang) => `${BASE_URL}${localizePath(path, lang)}`
const absImage = (raw: string) => {
  const src = maskMediaUrl(raw)
  return /^https?:\/\//i.test(src) ? src : `${BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}
const iso = (d: string | null | undefined) => (d ? new Date(d).toISOString() : null)
const latest = (dates: (string | null | undefined)[]) =>
  dates.reduce<string | null>((m, d) => (d && (!m || Date.parse(d) > Date.parse(m)) ? d : m), null)

const HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n'

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  })
}

function urlset(entries: Entry[]): string {
  const rows = entries.flatMap((e) => {
    const vi = abs(e.path, 'vi')
    const en = abs(e.path, 'en')
    const alt = e.hasEn
      ? `\n    <xhtml:link rel="alternate" hreflang="vi" href="${esc(vi)}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(en)}"/>`
      : ''
    const lm = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''
    const img = (e.images ?? []).map((src) => `\n    <image:image><image:loc>${esc(absImage(src))}</image:loc></image:image>`).join('')
    const one = (loc: string) => `  <url>\n    <loc>${esc(loc)}</loc>${lm}${alt}${img}\n  </url>`
    return e.hasEn ? [one(vi), one(en)] : [one(vi)]
  })
  return (
    HEAD +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    rows.join('\n') +
    '\n</urlset>\n'
  )
}

async function loadAll() {
  const supabase = createPublicClient()
  const [pagesRes, postsRes, projectsRes] = await Promise.all([
    supabase.from('pages').select('slug, updated_at, seo_title').eq('is_published', true),
    supabase
      .from('posts')
      .select('slug, updated_at, published_at, title, content, cover_image')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('case_studies')
      .select('slug, updated_at, title_en, summary_en, body_en, cover_image, sort_order')
      .eq('status', 'published')
      .order('sort_order', { ascending: false }),
  ])
  if (pagesRes.error || postsRes.error || projectsRes.error) {
    throw new Error(`sitemap: ${pagesRes.error?.message ?? postsRes.error?.message ?? projectsRes.error?.message}`)
  }
  return {
    pages: (pagesRes.data ?? []) as { slug: string; updated_at: string | null; seo_title: { en?: string } | null }[],
    posts: (postsRes.data ?? []) as {
      slug: string
      updated_at: string | null
      published_at: string | null
      title: I18n | null
      content: I18n | null
      cover_image: string | null
    }[],
    projects: (projectsRes.data ?? []) as {
      slug: string
      updated_at: string | null
      title_en: string | null
      summary_en: string | null
      body_en: string | null
      cover_image: string | null
    }[],
  }
}

export async function sitemapIndexXml(): Promise<string> {
  const { pages, posts, projects } = await loadAll()
  const lastByChild: Record<(typeof CHILD_SITEMAPS)[number], string | null> = {
    'sitemap-trang.xml': iso(latest([...pages.map((p) => p.updated_at), ...posts.map((p) => p.updated_at), ...projects.map((p) => p.updated_at)])),
    'sitemap-blog.xml': iso(latest(posts.map((p) => p.updated_at))),
    'sitemap-du-an.xml': iso(latest(projects.map((p) => p.updated_at))),
  }
  const rows = CHILD_SITEMAPS.map((name) => {
    const lm = lastByChild[name] ? `\n    <lastmod>${lastByChild[name]}</lastmod>` : ''
    return `  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>${lm}\n  </sitemap>`
  })
  return HEAD + '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows.join('\n') + '\n</sitemapindex>\n'
}

type Data = Awaited<ReturnType<typeof loadAll>>

function pageEntries({ pages, posts, projects }: Data): Entry[] {
  const byPath = new Map<string, Entry>()
  for (const p of pages) {
    const path = p.slug === 'home' ? '/' : `/${p.slug}`
    // Trang CMS có tiêu đề SEO tiếng Anh thì bản /en được lập chỉ mục (khớp pageMetadata)
    byPath.set(path, { path, lastmod: iso(p.updated_at), hasEn: !!p.seo_title?.en?.trim() })
  }
  // Trang tĩnh (không nằm trong bảng pages): lastmod theo nội dung mà trang đó liệt kê.
  const servicePages = pages.filter((p) => p.slug.startsWith('services/'))
  if (!byPath.has('/services')) byPath.set('/services', { path: '/services', lastmod: iso(latest(servicePages.map((p) => p.updated_at))), hasEn: true })
  if (!byPath.has('/blog')) byPath.set('/blog', { path: '/blog', lastmod: iso(latest(posts.map((p) => p.updated_at))), hasEn: true })
  if (!byPath.has('/projects')) byPath.set('/projects', { path: '/projects', lastmod: iso(latest(projects.map((p) => p.updated_at))), hasEn: true })
  // Liên hệ: nội dung viết trong mã nguồn, không có ngày sửa đáng tin nên không khai lastmod.
  if (!byPath.has('/contact')) byPath.set('/contact', { path: '/contact', lastmod: null, hasEn: true })

  const rank = (path: string) => {
    const i = PAGE_ORDER.indexOf(path)
    return i === -1 ? PAGE_ORDER.length : i
  }
  return [...byPath.values()].sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path))
}

function blogEntries({ posts }: Data): Entry[] {
  return posts.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: iso(p.updated_at ?? p.published_at),
    hasEn: postHasEnglish({ title: p.title, content: p.content }),
    images: p.cover_image ? [p.cover_image] : [],
  }))
}

function projectEntries({ projects }: Data): Entry[] {
  return projects.map((p) => ({
    path: `/projects/${p.slug}`,
    lastmod: iso(p.updated_at),
    hasEn: caseStudyHasEnglish({ title_en: p.title_en, summary_en: p.summary_en, body_en: p.body_en }),
    images: p.cover_image ? [p.cover_image] : [],
  }))
}

export const pagesSitemapXml = async () => urlset(pageEntries(await loadAll()))
export const blogSitemapXml = async () => urlset(blogEntries(await loadAll()))
export const projectsSitemapXml = async () => urlset(projectEntries(await loadAll()))

/** Tổng số địa chỉ trong 3 sitemap con (bản /en tính riêng), dùng cho màn kiểm tra SEO. */
export async function sitemapUrlCount(): Promise<number> {
  const data = await loadAll()
  return [...pageEntries(data), ...blogEntries(data), ...projectEntries(data)].reduce((n, e) => n + (e.hasEn ? 2 : 1), 0)
}

/*
 * Bản xem bằng trình duyệt (23/10/2026): người mở /sitemap*.xml thấy bảng, trình thu thập vẫn nhận XML thuần ở cùng địa chỉ.
 * next.config.mjs chuyển hướng ngầm (rewrite) sang /sitemap-xem/<nhóm> chỉ khi có tiêu đề Sec-Fetch-Dest: document,
 * tiêu đề mà trình duyệt gắn khi mở trang và Googlebot/Bingbot không gửi. Không dùng XSLT (Chrome sắp gỡ).
 */
export type SitemapView = 'muc-luc' | 'trang' | 'blog' | 'du-an'

const fmtDate = (d: string | null) => {
  if (!d) return '<span class="m">không khai</span>'
  const t = new Date(new Date(d).getTime() + 7 * 3600_000).toISOString()
  return `${t.slice(8, 10)}/${t.slice(5, 7)}/${t.slice(0, 4)}`
}

const VIEW_CSS = `:root{color-scheme:light dark;--bg:#f5f5f7;--card:#fff;--fg:#1d1d1f;--mut:#6e6e73;--line:rgba(0,0,0,.08);--acc:#1e6dda;--chip:rgba(0,0,0,.06)}
@media (prefers-color-scheme:dark){:root{--bg:#000;--card:#1c1c1e;--fg:#f5f5f7;--mut:#98989d;--line:rgba(255,255,255,.12);--acc:#4c9aff;--chip:rgba(255,255,255,.1)}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,"SF Pro Text",Inter,system-ui,sans-serif}
main{max-width:1080px;margin:0 auto;padding:32px max(16px,env(safe-area-inset-left)) 56px}
h1{margin:0;font-size:28px;font-weight:600;letter-spacing:-.02em}
.sub{margin:6px 0 20px;color:var(--mut)}
.nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 20px}
.nav a{padding:6px 14px;border-radius:999px;background:var(--chip);color:var(--fg);text-decoration:none;font-size:14px}
.nav a[aria-current]{background:var(--acc);color:#fff}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:640px}
th{text-align:left;font-weight:500;font-size:12.5px;color:var(--mut);padding:12px 16px;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:10px 16px;border-top:1px solid var(--line);vertical-align:middle}
tr:first-child td{border-top:0}
td.n,td.d{color:var(--mut);white-space:nowrap;font-variant-numeric:tabular-nums}
a{color:var(--acc);text-decoration:none;word-break:break-all}a:hover{text-decoration:underline}
img{display:block;width:56px;height:36px;object-fit:cover;border-radius:6px;background:var(--chip)}
.chip{display:inline-block;padding:1px 9px;border-radius:999px;font-size:12px;background:var(--chip);color:var(--mut)}
.m{color:var(--mut)}.f{margin-top:16px;color:var(--mut);font-size:13px}`

const VIEW_TITLES: Record<SitemapView, [string, string]> = {
  'muc-luc': ['Mục lục', 'Ba nhóm sitemap gửi cho công cụ tìm kiếm.'],
  trang: ['Trang chính', 'Trang chủ, dịch vụ, bảng giá, giới thiệu, liên hệ, theo thứ tự menu.'],
  blog: ['Bài viết', 'Bài blog, mới đăng nhất ở trên cùng.'],
  'du-an': ['Dự án', 'Dự án tiêu biểu, theo thứ tự hiển thị trên website.'],
}
const VIEW_FILE: Record<Exclude<SitemapView, 'muc-luc'>, string> = { trang: 'sitemap-trang.xml', blog: 'sitemap-blog.xml', 'du-an': 'sitemap-du-an.xml' }

export function isSitemapView(v: string): v is SitemapView {
  return v === 'muc-luc' || v === 'trang' || v === 'blog' || v === 'du-an'
}

export async function sitemapViewHtml(view: SitemapView): Promise<string> {
  const data = await loadAll()
  const [title, sub] = VIEW_TITLES[view]
  const nav = (['muc-luc', 'trang', 'blog', 'du-an'] as SitemapView[])
    .map((v) => `<a href="${v === 'muc-luc' ? '/sitemap.xml' : `/${VIEW_FILE[v]}`}"${v === view ? ' aria-current="page"' : ''}>${VIEW_TITLES[v][0]}</a>`)
    .join('')

  let head = ''
  let rows = ''
  let note = ''
  if (view === 'muc-luc') {
    const last = {
      trang: latest([...data.pages.map((p) => p.updated_at), ...data.posts.map((p) => p.updated_at), ...data.projects.map((p) => p.updated_at)]),
      blog: latest(data.posts.map((p) => p.updated_at)),
      'du-an': latest(data.projects.map((p) => p.updated_at)),
    }
    const count = { trang: pageEntries(data), blog: blogEntries(data), 'du-an': projectEntries(data) }
    head = '<tr><th>#</th><th>Nhóm</th><th>Số địa chỉ</th><th>Cập nhật gần nhất</th></tr>'
    rows = (['trang', 'blog', 'du-an'] as const)
      .map((k, i) => {
        const n = count[k].reduce((s, e) => s + (e.hasEn ? 2 : 1), 0)
        return `<tr><td class="n">${i + 1}</td><td><a href="/${VIEW_FILE[k]}">${BASE_URL}/${VIEW_FILE[k]}</a><div class="m">${esc(VIEW_TITLES[k][0])}</div></td><td class="d">${n}</td><td class="d">${fmtDate(iso(last[k]))}</td></tr>`
      })
      .join('')
  } else {
    const entries = view === 'trang' ? pageEntries(data) : view === 'blog' ? blogEntries(data) : projectEntries(data)
    const total = entries.reduce((s, e) => s + (e.hasEn ? 2 : 1), 0)
    note = `<p class="f">${total} địa chỉ (${entries.filter((e) => e.hasEn).length} có bản tiếng Anh). Đây là bản xem; công cụ tìm kiếm nhận tệp XML ở cùng địa chỉ.</p>`
    const showImg = view !== 'trang'
    head = `<tr><th>#</th>${showImg ? '<th>Ảnh</th>' : ''}<th>Tiếng Việt</th><th>Tiếng Anh</th><th>Cập nhật</th></tr>`
    rows = entries
      .map((e, i) => {
        const vi = abs(e.path, 'vi')
        const en = abs(e.path, 'en')
        const img = showImg ? `<td>${e.images?.[0] ? `<img src="${esc(absImage(e.images[0]))}" alt="" loading="lazy">` : ''}</td>` : ''
        return `<tr><td class="n">${i + 1}</td>${img}<td><a href="${esc(vi)}">${esc(localizePath(e.path, 'vi'))}</a></td><td>${
          e.hasEn ? `<a href="${esc(en)}">${esc(localizePath(e.path, 'en'))}</a>` : '<span class="chip">chưa dịch</span>'
        }</td><td class="d">${fmtDate(e.lastmod)}</td></tr>`
      })
      .join('')
  }
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Sitemap ${esc(title)} · Click Star</title><style>${VIEW_CSS}</style></head><body><main><h1>Sitemap: ${esc(title)}</h1><p class="sub">${esc(sub)}</p><nav class="nav">${nav}</nav><div class="card"><table>${head}${rows}</table></div>${note}</main></body></html>`
}
