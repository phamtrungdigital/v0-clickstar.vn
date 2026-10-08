import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireContentEditor } from '@/lib/ai/admin-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export type DuplicateMatch = {
  id: string
  slug: string
  title_vi: string
  matched_in: 'title' | 'tags' | 'seo_title'
  excerpt_vi?: string | null
}

export async function POST(req: Request) {
  try {
    const { keyword, excludePostId } = (await req.json()) as {
      keyword?: string
      excludePostId?: string
    }
    const kw = keyword?.trim().toLowerCase()
    if (!kw || kw.length < 3) {
      return NextResponse.json({ matches: [] })
    }

    const supabase = await createClient()
    const guard = await requireContentEditor(supabase)
    if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status })

    // Fetch posts (admin can see all incl. drafts)
    let query = supabase
      .from('posts')
      .select('id, slug, title, excerpt, tags, seo_title')
      .order('created_at', { ascending: false })
      .limit(200)
    if (excludePostId) query = query.neq('id', excludePostId)

    const { data: posts, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const matches: DuplicateMatch[] = []
    for (const p of posts || []) {
      const titleVi = String(p.title?.vi || '').toLowerCase()
      const titleEn = String(p.title?.en || '').toLowerCase()
      const seoVi = String(p.seo_title?.vi || '').toLowerCase()
      const seoEn = String(p.seo_title?.en || '').toLowerCase()
      const tagsLower = (p.tags || []).map((t: string) => t.toLowerCase())

      let where: DuplicateMatch['matched_in'] | null = null
      if (titleVi.includes(kw) || titleEn.includes(kw)) where = 'title'
      else if (seoVi.includes(kw) || seoEn.includes(kw)) where = 'seo_title'
      else if (tagsLower.some((t: string) => t.includes(kw))) where = 'tags'

      if (where) {
        matches.push({
          id: p.id,
          slug: p.slug,
          title_vi: p.title?.vi || p.title?.en || '(không tiêu đề)',
          matched_in: where,
          excerpt_vi: p.excerpt?.vi || null,
        })
      }
      if (matches.length >= 5) break
    }

    return NextResponse.json({ matches })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Kiểm tra trùng thất bại' },
      { status: 500 }
    )
  }
}
