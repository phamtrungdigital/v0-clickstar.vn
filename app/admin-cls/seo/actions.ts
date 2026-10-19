'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getAdminProfile } from '@/lib/admin-cls/auth'
import { cleanSeoText as clean, ogUrlError } from '@/lib/seo/admin-seo'

export type SaveSeoInput = {
  kind: 'page' | 'service' | 'post'
  id: string
  vi: { title: string; desc: string }
  /** Bản tiếng Anh (dùng cho /en/...). Thiếu thì giữ nguyên giá trị cũ. */
  en?: { title: string; desc: string }
  og: string
}

export type SaveSeoResult = { ok: true } | { error: string }

const MAX_TITLE = 200
const MAX_DESC = 400

/** Chỉ admin và editor được sửa SEO (viewer chỉ xem). RLS ở DB vẫn là lớp chặn cuối. Trả về thông báo lỗi hoặc null. */
async function editorError(): Promise<string | null> {
  const profile = await getAdminProfile()
  if (!profile) return 'not_authenticated'
  if (profile.role !== 'admin' && profile.role !== 'editor') return 'Tài khoản này chỉ có quyền xem.'
  return null
}

/**
 * Lưu tiêu đề, mô tả, ảnh chia sẻ của một trang hoặc bài viết.
 * Chỉ ghi đúng các cột SEO, KHÔNG đụng nội dung, trạng thái hay ngày đăng.
 */
export async function saveSeoItem(input: SaveSeoInput): Promise<SaveSeoResult> {
  const denied = await editorError()
  if (denied) return { error: denied }

  if (!input || !['page', 'service', 'post'].includes(input.kind) || typeof input.id !== 'string' || !input.id) {
    return { error: 'Dữ liệu không hợp lệ.' }
  }

  const viTitle = clean(input.vi?.title, MAX_TITLE)
  const viDesc = clean(input.vi?.desc, MAX_DESC)
  const og = typeof input.og === 'string' ? input.og.trim() : ''
  const ogError = ogUrlError(og)
  if (ogError) return { error: ogError }

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { error: 'not_authenticated' }

  if (input.kind === 'post') {
    const { data: cur, error: readErr } = await supabase
      .from('posts')
      .select('slug, seo_title, seo_description')
      .eq('id', input.id)
      .maybeSingle()
    if (readErr || !cur) return { error: readErr?.message || 'Không tìm thấy bài viết.' }

    // Không gửi bản tiếng Anh thì giữ nguyên giá trị đang lưu (không xóa).
    const { data: done, error } = await supabase
      .from('posts')
      .update({
        seo_title: { ...(cur.seo_title ?? {}), vi: viTitle, ...(input.en ? { en: clean(input.en.title, MAX_TITLE) } : {}) },
        seo_description: { ...(cur.seo_description ?? {}), vi: viDesc, ...(input.en ? { en: clean(input.en.desc, MAX_DESC) } : {}) },
        og_image: og || null,
      })
      .eq('id', input.id)
      .select('id')
    if (error) return { error: error.message }
    if (!done?.length) return { error: 'Không lưu được: tài khoản không có quyền ghi bài viết này.' }

    updateTag('posts')
    revalidatePath(`/blog/${cur.slug}`)
    revalidatePath('/admin-cls/seo')
    return { ok: true }
  }

  const { data: cur, error: readErr } = await supabase
    .from('pages')
    .select('slug, seo_title, seo_description')
    .eq('id', input.id)
    .maybeSingle()
  if (readErr || !cur) return { error: readErr?.message || 'Không tìm thấy trang.' }

  const { data: done, error } = await supabase
    .from('pages')
    .update({
      // Chỉ ghi bản tiếng Anh khi form gửi lên; không gửi thì giữ nguyên giá trị cũ.
      seo_title: { ...(cur.seo_title ?? {}), vi: viTitle, ...(input.en ? { en: clean(input.en.title, MAX_TITLE) } : {}) },
      seo_description: { ...(cur.seo_description ?? {}), vi: viDesc, ...(input.en ? { en: clean(input.en.desc, MAX_DESC) } : {}) },
      og_image: og || null,
      updated_by: userData.user.id,
    })
    .eq('id', input.id)
    .select('id')
  if (error) return { error: error.message }
  if (!done?.length) return { error: 'Không lưu được: tài khoản không có quyền ghi trang này.' }

  updateTag('pages')
  updateTag(`page:${cur.slug}`)
  revalidatePath(cur.slug === 'home' ? '/' : `/${cur.slug}`)
  revalidatePath(cur.slug === 'home' ? '/en' : `/en/${cur.slug}`) // bản tiếng Anh của trang
  revalidatePath('/admin-cls/seo')
  return { ok: true }
}

const GA4_BLOCK = /<!-- cs-seo:ga4:start -->[\s\S]*?<!-- cs-seo:ga4:end -->\s*/
const GA4_ID = /^G-[A-Z0-9]{6,14}$/

/**
 * Gắn hoặc gỡ mã Google Analytics 4. Mã nằm trong một khối có đánh dấu trong `head_code` nên đổi/gỡ được
 * mà không đụng các đoạn mã khác. Chỉ admin được ghi vì đây là mã chạy trên mọi trang.
 */
export async function saveGa4(measurementId: string): Promise<SaveSeoResult> {
  const profile = await getAdminProfile()
  if (!profile) return { error: 'not_authenticated' }
  if (profile.role !== 'admin') return { error: 'Chỉ tài khoản Admin được gắn mã đo lường.' }

  const id = (measurementId || '').trim().toUpperCase()
  if (id && !GA4_ID.test(id)) return { error: 'Mã không đúng dạng. Mã Google Analytics 4 bắt đầu bằng G- (ví dụ G-AB12CD34EF).' }

  const supabase = await createClient()
  const { data: row, error: readErr } = await supabase.from('site_settings').select('head_code').eq('id', 1).maybeSingle()
  if (readErr || !row) return { error: readErr?.message || 'Không đọc được cài đặt.' }

  const current = row.head_code ?? ''
  const block = id
    ? [
        '<!-- cs-seo:ga4:start -->',
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
        `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`,
        '<!-- cs-seo:ga4:end -->',
      ].join('\n')
    : ''
  // Có khối cũ thì thay đúng vị trí cũ (để các đoạn mã khác phụ thuộc gtag vẫn chạy sau nó), chưa có thì thêm vào cuối.
  const next = !id
    ? current.replace(GA4_BLOCK, '').trim()
    : GA4_BLOCK.test(current)
      ? current.replace(GA4_BLOCK, () => `${block}\n`).trim()
      : [current.trim(), block].filter(Boolean).join('\n')

  const { data: userData } = await supabase.auth.getUser()
  const { data: done, error } = await supabase
    .from('site_settings')
    .update({ head_code: next || null, updated_by: userData.user?.id })
    .eq('id', 1)
    .select('id')
  if (error) return { error: error.message }
  if (!done?.length) return { error: 'Không lưu được: tài khoản không có quyền ghi cài đặt.' }

  updateTag('site_settings')
  revalidatePath('/admin-cls/seo')
  revalidatePath('/')
  return { ok: true }
}
