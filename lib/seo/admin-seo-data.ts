import { createClient } from '@/lib/supabase/server'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { DEFAULT_HOTLINE, SITE_URL } from './site'
import { fitTitle } from './metadata'
import { duplicateGroups, measureTitle, type SeoItem, type SiteCheck } from './admin-seo'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { caseStudyHasEnglish } from '@/lib/cms/case-studies-types'

type I18nRow = { vi?: string | null; en?: string | null } | null

const s = (v: unknown) => (typeof v === 'string' ? v : '')
const i18n = (row: I18nRow) => ({ vi: s(row?.vi), en: s(row?.en) })

/** Gom toàn bộ trang, dịch vụ, bài viết, dự án thành một danh sách chung cho màn SEO. */
export async function loadSeoItems(): Promise<SeoItem[]> {
  const supabase = await createClient()
  const [pagesRes, postsRes, projectsRes] = await Promise.all([
    supabase
      .from('pages')
      .select('id, slug, title, seo_title, seo_description, og_image, is_published')
      .order('slug'),
    supabase
      .from('posts')
      .select('id, slug, title, excerpt, content, cover_image, status, seo_title, seo_description, og_image, published_at')
      .order('published_at', { ascending: false, nullsFirst: true }),
    supabase
      .from('case_studies')
      .select('id, slug, title_vi, title_en, summary_vi, summary_en, body_en, cover_image, status, sort_order')
      .order('sort_order', { ascending: false }),
  ])

  const items: SeoItem[] = []

  for (const p of (pagesRes.data ?? []) as any[]) {
    const isService = String(p.slug).startsWith('services/')
    const t = i18n(p.seo_title)
    const d = i18n(p.seo_description)
    items.push({
      key: `page:${p.id}`,
      kind: isService ? 'service' : 'page',
      id: p.id,
      label: s(p.title) || p.slug,
      path: p.slug === 'home' ? '/' : `/${p.slug}`,
      published: !!p.is_published,
      editable: true,
      // Trang CMS có tiêu đề SEO tiếng Anh thì bản /en được lập chỉ mục (khớp lib/cms/page-metadata.ts)
      hasEn: !!t.en.trim(),
      editHref: `/admin-cls/pages/${String(p.slug).replace(/\//g, '__')}/edit`,
      saved: {
        vi: { title: t.vi, desc: d.vi },
        en: { title: t.en, desc: d.en },
        og: s(p.og_image),
      },
      fallback: {
        vi: { title: s(p.title), desc: '' },
        en: { title: s(p.title), desc: '' },
      },
      ogFallback: '',
      descFallbackNote: '',
    })
  }

  for (const p of (postsRes.data ?? []) as any[]) {
    const t = i18n(p.seo_title)
    const d = i18n(p.seo_description)
    items.push({
      key: `post:${p.id}`,
      kind: 'post',
      id: p.id,
      label: s(p.title?.vi) || p.slug,
      path: `/blog/${p.slug}`,
      published: p.status === 'published',
      editable: true,
      hasEn: postHasEnglish({ title: p.title, content: p.content }),
      editHref: `/admin-cls/posts/${p.id}/edit`,
      saved: {
        vi: { title: t.vi, desc: d.vi },
        en: { title: t.en, desc: d.en },
        og: s(p.og_image),
      },
      fallback: {
        vi: { title: s(p.title?.vi), desc: s(p.excerpt?.vi) },
        en: { title: s(p.title?.en), desc: s(p.excerpt?.en) },
      },
      ogFallback: s(p.cover_image),
      descFallbackNote: 'Đang lấy từ phần tóm tắt của bài viết.',
    })
  }

  for (const p of (projectsRes.data ?? []) as any[]) {
    items.push({
      key: `project:${p.id}`,
      kind: 'project',
      id: p.id,
      label: s(p.title_vi) || p.slug,
      path: `/projects/${p.slug}`,
      published: p.status === 'published',
      editable: false,
      hasEn: caseStudyHasEnglish({ title_en: p.title_en, summary_en: p.summary_en, body_en: p.body_en }),
      editHref: `/admin-cls/projects/${p.id}/edit`,
      saved: { vi: { title: '', desc: '' }, en: { title: '', desc: '' }, og: '' },
      // Trang dự án tự rút tên dự án còn khoảng 46 ký tự để vừa khung Google (xem app/projects/[slug]/page.tsx).
      fallback: {
        vi: { title: fitTitle(s(p.title_vi), 46), desc: s(p.summary_vi) },
        // Bản /en dùng tên và tóm tắt tiếng Anh của dự án (xem projectMetadata)
        en: { title: fitTitle(s(p.title_en) || s(p.title_vi), 46), desc: s(p.summary_en) || s(p.summary_vi) },
      },
      ogFallback: s(p.cover_image),
      descFallbackNote: 'Lấy từ phần tóm tắt của dự án.',
    })
  }

  return items
}

const GA4_BLOCK = /<!-- cs-seo:ga4:start -->[\s\S]*?<!-- cs-seo:ga4:end -->\s*/
const GA4_ID = /\bG-[A-Z0-9]{6,14}\b/

/** Chỉ giữ chữ số và đưa đầu số quốc gia 84 về 0 để "+84 383 406 735" và "0383 406 735" được coi là một số. */
const digits = (v: string) => {
  const d = (v || '').replace(/\D/g, '')
  return d.startsWith('84') && d.length >= 11 ? `0${d.slice(2)}` : d
}

const DNS_TTL_MS = 10 * 60 * 1000
const dnsCache = new Map<string, { at: number; value: boolean }>()

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'clickstar.vn'
  }
}

/**
 * Tra bản ghi TXT của tên miền qua DNS công khai của Google; trả null nếu không tra được.
 * Kết quả tra được nhớ 10 phút để mỗi lần lưu trong màn SEO không phải chờ lại một cuộc gọi mạng.
 */
async function lookupDnsVerification(hostname: string): Promise<boolean | null> {
  const hit = dnsCache.get(hostname)
  if (hit && Date.now() - hit.at < DNS_TTL_MS) return hit.value
  try {
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}&type=TXT`, {
      headers: { accept: 'application/dns-json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(2000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { Answer?: { data?: string }[] }
    const value = (json.Answer ?? []).some((a) => /google-site-verification=/i.test(a.data ?? ''))
    dnsCache.set(hostname, { at: Date.now(), value })
    return value
  } catch {
    return null
  }
}

/** Kiểm tra cấu hình toàn site từ dữ liệu thật (không phải danh sách cố định). */
export async function loadSiteChecks(items: SeoItem[]): Promise<{ checks: SiteCheck[]; siteUrl: string }> {
  const supabase = await createClient()
  // Bắt đầu tra DNS ngay, chạy song song với các truy vấn DB (địa chỉ site gần như luôn là SITE_URL).
  const dnsEarly = lookupDnsVerification(hostOf(SITE_URL))
  const [settingsRes, chatbotRes, sitemapList, snippetsRes] = await Promise.all([
    supabase
      .from('site_settings')
      .select(
        'site_url, default_language, contact_phone, default_seo_title, default_seo_description, default_og_image, head_code, body_start_code, body_end_code'
      )
      .eq('id', 1)
      .maybeSingle(),
    supabase.from('chatbot_settings').select('hotline').limit(1).maybeSingle(),
    sitemap().catch(() => null),
    supabase.from('site_code_snippets').select('code').eq('enabled', true),
  ])
  const st = (settingsRes.data ?? {}) as Record<string, string | null>
  const siteUrl = st.site_url || SITE_URL
  const hostname = hostOf(siteUrl)

  // Mã tuỳ chỉnh: bảng mới (đang bật) cộng ô Header cũ do mục SEO ghi. body_start_code, body_end_code cũ đã chuyển sang bảng mới.
  const snippetCode = ((snippetsRes.data ?? []) as { code: string }[]).map((x) => x.code)
  const tracking = [st.head_code, ...snippetCode].filter(Boolean).join('\n')
  const dns = hostname === hostOf(SITE_URL) ? await dnsEarly : await lookupDnsVerification(hostname)

  const checks: SiteCheck[] = []

  // robots.txt
  const r = robots()
  const rules = Array.isArray(r.rules) ? r.rules : r.rules ? [r.rules] : []
  const disallow = rules.flatMap((x) => (Array.isArray(x.disallow) ? x.disallow : x.disallow ? [x.disallow] : []))
  const blocksAdmin = disallow.includes('/admin-cls') && disallow.includes('/api/')
  const hasSitemap = !!r.sitemap
  checks.push({
    id: 'robots',
    level: hasSitemap && blocksAdmin ? 'ok' : 'bad',
    title: 'robots.txt khai báo sitemap và chặn khu quản trị',
    detail: hasSitemap && blocksAdmin ? undefined : 'Thiếu dòng khai báo sitemap hoặc chưa chặn /admin-cls và /api/.',
  })

  // sitemap
  const published = items.filter((i) => i.published).length
  if (sitemapList) {
    const n = sitemapList.length
    checks.push({
      id: 'sitemap',
      level: n >= published ? 'ok' : 'warn',
      title: `Sitemap có ${n} địa chỉ`,
      detail: `Gồm ${published} mục đã đăng trong danh sách này và các trang cố định. Cập nhật mỗi giờ.`,
    })
  } else {
    checks.push({ id: 'sitemap', level: 'bad', title: 'Không tạo được sitemap', detail: 'Hệ thống không đọc được dữ liệu để tạo sitemap.' })
  }

  // bản tiếng Anh (/en): chỉ lập chỉ mục những mục đã có bản dịch đủ nội dung
  const live = items.filter((i) => i.published)
  const noEn = live.filter((i) => !i.hasEn)
  checks.push({
    id: 'english',
    level: noEn.length === 0 ? 'ok' : 'warn',
    title:
      noEn.length === 0
        ? `Bản tiếng Anh (/en) đầy đủ: ${live.length} trang, bài viết, dự án`
        : `Bản tiếng Anh (/en): ${live.length - noEn.length} trên ${live.length} mục đã đủ nội dung`,
    detail:
      noEn.length === 0
        ? 'Mỗi mục có địa chỉ riêng ở /en và khai báo hreflang hai chiều với bản tiếng Việt.'
        : 'Mục chưa có bản tiếng Anh vẫn mở được ở /en nhưng không được lập chỉ mục (noindex) và không khai báo hreflang.',
    lines: noEn.length ? noEn.map((i) => `${i.label} (${i.path})`) : undefined,
  })

  // hotline thống nhất
  const places: [string, string][] = [
    ['Cài đặt (footer, trang liên hệ)', st.contact_phone ?? ''],
    ['Chatbot', (chatbotRes.data as { hotline?: string | null } | null)?.hotline ?? ''],
    ['Số dự phòng trong code', DEFAULT_HOTLINE],
  ]
  const distinct = new Set(places.map(([, v]) => digits(v)).filter(Boolean))
  checks.push({
    id: 'hotline',
    level: distinct.size <= 1 ? 'ok' : 'warn',
    title: distinct.size <= 1 ? `Số hotline thống nhất: ${places[0][1] || DEFAULT_HOTLINE}` : 'Số hotline đang khác nhau giữa các nơi',
    lines: distinct.size <= 1 ? undefined : places.map(([name, v]) => `${name}: ${v || '(trống)'}`),
  })

  // ảnh chia sẻ mặc định (tiêu đề/mô tả mặc định trong Cài đặt đã có giá trị dự phòng trong code nên không tính là lỗi)
  checks.push({
    id: 'defaults',
    level: st.default_og_image ? 'ok' : 'warn',
    title: st.default_og_image ? 'Đã có ảnh chia sẻ mặc định của site' : 'Chưa có ảnh chia sẻ mặc định của site',
    detail: st.default_og_image
      ? 'Dùng khi một trang chưa có ảnh riêng.'
      : 'Khi gửi link trang chưa có ảnh riêng lên Facebook, Zalo sẽ không có ảnh. Thiết lập ở Cài đặt, mục SEO mặc định.',
  })

  // trùng tiêu đề
  const groups = duplicateGroups(items)
  const dupLines = groups.map((g) => `“${measureTitle(g[0], g[0].saved).shown}”: ${g.map((x) => x.label).join(', ')}`)
  checks.push({
    id: 'duplicates',
    level: groups.length === 0 ? 'ok' : 'warn',
    title: groups.length === 0 ? 'Không có hai trang trùng tiêu đề' : `Có ${groups.length} nhóm trang trùng tiêu đề`,
    lines: groups.length ? dupLines : undefined,
  })

  // GA4
  const managedId = (st.head_code ?? '').match(GA4_BLOCK)?.[0]?.match(GA4_ID)?.[0]
  const anyId = tracking.match(GA4_ID)?.[0]
  const hasGtm = /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i.test(tracking)
  checks.push({
    id: 'ga4',
    level: managedId || anyId || hasGtm ? 'ok' : 'warn',
    title: managedId || anyId ? `Google Analytics 4 đã gắn (${managedId || anyId})` : hasGtm ? 'Đã có Google Tag Manager' : 'Google Analytics 4 chưa gắn',
    detail: managedId || anyId || hasGtm ? undefined : 'Nhập mã G-XXXXXXXXXX để đo lượt truy cập và liên hệ đến từ tìm kiếm.',
    ga4Id: managedId || anyId || undefined,
    ga4Managed: !!managedId,
  })

  // Search Console: tra bản ghi TXT của tên miền (Search Console và Google Workspace dùng chung kiểu bản ghi này)
  const metaInBody = /google-site-verification/i.test(tracking)
  const verified = dns === true || metaInBody
  checks.push({
    id: 'gsc',
    level: verified ? 'ok' : dns === null ? 'unknown' : 'warn',
    title: verified
      ? dns === true
        ? 'Tên miền có bản ghi xác minh của Google'
        : 'Có thẻ xác minh của Google trong mã chèn'
      : dns === null
        ? 'Google Search Console: chưa kiểm tra được'
        : 'Google Search Console: chưa thấy xác minh',
    detail: verified
      ? 'Bản ghi này dùng cho Search Console hoặc Google Workspace nên chưa chắc là Search Console. Mở Search Console để chắc đã có thuộc tính tên miền và đã gửi sitemap.'
      : dns === null
        ? 'Không tra được bản ghi DNS lúc này, thử tải lại trang.'
        : 'Xác minh để biết trang nào đã được Google lập chỉ mục và từ khóa nào dẫn khách đến.',
  })

  return { checks, siteUrl }
}
