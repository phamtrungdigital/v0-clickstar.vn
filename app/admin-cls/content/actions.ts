'use server'

import { createClient } from '@/lib/supabase/server'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { blogIndexUrls, postUrls, submitIndexNow, type IndexNowResult } from '@/lib/seo/indexnow'
import { allSitemapUrls } from '@/lib/seo/sitemap-xml'

const RECENT_DAYS = 7

/**
 * Gửi tay danh sách bài đã đăng tới IndexNow: dùng cho bài đăng không qua trình sửa (ví dụ chèn thẳng vào cơ sở dữ liệu)
 * hoặc khi muốn báo lại. "recent" = bài đăng hoặc sửa trong 7 ngày gần đây, "all" = toàn bộ website (mọi địa chỉ trong
 * sitemap: trang chính, bài viết, dự án; Bing là nguồn tìm kiếm của ChatGPT và Copilot nên đáng gửi cả trang dịch vụ).
 */
export async function sendIndexNow(scope: 'recent' | 'all'): Promise<IndexNowResult & { posts: number }> {
  const fail = (message: string) => ({ ok: false, status: 0, submitted: 0, posts: 0, message })

  const supabase = await createClient()
  // Hành động máy chủ gọi được từ mọi nơi, nên tự kiểm quyền quản trị (không dựa vào việc trang này đã chặn).
  const { data: profile } = await supabase.rpc('get_my_admin_profile')
  if (!profile) return fail('Chưa đăng nhập hoặc không có quyền quản trị.')

  const { data, error } = await supabase
    .from('posts')
    .select('slug, title, content, published_at, updated_at')
    .eq('status', 'published')
  if (error) return fail(error.message)

  const since = Date.now() - RECENT_DAYS * 86_400_000
  const posts = ((data ?? []) as any[]).filter((p) => {
    if (scope === 'all') return true
    return [p.published_at, p.updated_at].some((d) => d && Date.parse(d) >= since)
  })
  if (!posts.length) return fail(scope === 'recent' ? `Không có bài nào đăng hoặc sửa trong ${RECENT_DAYS} ngày gần đây.` : 'Chưa có bài nào đã đăng.')

  if (scope === 'all') {
    const urls = await allSitemapUrls().catch(() => null)
    if (!urls) return fail('Không đọc được danh sách địa chỉ của website, hãy thử lại sau.')
    return { ...(await submitIndexNow(urls)), posts: posts.length }
  }
  const result = await submitIndexNow([...posts.flatMap((p) => postUrls(p.slug, postHasEnglish(p))), ...blogIndexUrls()])
  return { ...result, posts: posts.length }
}
