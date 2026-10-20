import { createClient } from '@/lib/supabase/server'
import { postHasEnglish } from '@/lib/cms/post-i18n'
import { loadSeoItems } from '@/lib/seo/admin-seo-data'
import { analyze, findDuplicateTitles } from '@/lib/seo/admin-seo'
import { analyzeContent, type ContentAnalysis, type ContentPostInput } from './content-plan'

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const words = (v: string) => v.trim().split(/\s+/).filter(Boolean).length

/** Điểm SEO của từng bài (id bài → điểm), chấm bằng đúng bộ chấm ở màn SEO. Chỉ bài đã đăng mới có điểm thật. */
async function loadSeoScores(): Promise<Map<string, number>> {
  const items = await loadSeoItems()
  const dup = findDuplicateTitles(items)
  const scores = new Map<string, number>()
  for (const it of items) {
    if (it.kind !== 'post' || !it.published) continue
    scores.set(String(it.id), analyze(it, it.saved, dup.get(it.key)).score)
  }
  return scores
}

/** Đọc toàn bộ bài viết (kể cả nháp) rồi rút gọn còn số liệu cần cho màn "Quản trị bài viết". Không gửi nội dung bài xuống trình duyệt. */
export async function loadContentAnalysis(): Promise<ContentAnalysis> {
  const supabase = await createClient()
  const [{ data }, scores] = await Promise.all([
    supabase
      .from('posts')
      .select('id, slug, title, tags, status, published_at, cover_image, content')
      .order('published_at', { ascending: false, nullsFirst: true }),
    loadSeoScores(),
  ])

  const posts: ContentPostInput[] = ((data ?? []) as any[]).map((p) => {
    const vi = str(p.content?.vi)
    const en = str(p.content?.en)
    return {
      id: p.id,
      slug: p.slug,
      title: str(p.title?.vi) || p.slug,
      tags: Array.isArray(p.tags) ? p.tags.filter((t: unknown): t is string => typeof t === 'string') : [],
      status: p.status,
      publishedAt: p.published_at ?? null,
      hasCover: !!p.cover_image,
      viChars: vi.length,
      viWords: words(vi),
      enChars: en.length,
      hasEn: postHasEnglish({ title: p.title, content: p.content }),
      seoScore: scores.get(String(p.id)) ?? null,
    }
  })
  return analyzeContent(posts)
}
