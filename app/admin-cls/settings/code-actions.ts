'use server'

import { revalidatePath, updateTag } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/seo/site'
import { viDateTime } from '@/lib/cms/code-snippets'
import { HISTORY_KEEP, SNIPPET_COLUMNS, loadCodeState, type CodeState, type SnippetRow } from '@/lib/cms/code-admin'
import {
  PLACEMENTS,
  getTemplate,
  templatePartCode,
  validateTemplateId,
  type Placement,
  type TemplateId,
} from '@/lib/cms/code-templates'

/**
 * Quản lý Mã tuỳ chỉnh (Cài đặt → Mã tuỳ chỉnh). Mọi hành động đều tự kiểm quyền "admin cấp cao" (hàm is_site_admin ở cơ sở
 * dữ liệu) chứ không dựa vào việc trang đã chặn: hành động máy chủ gọi được từ ngoài trang. Quyền ghi còn được khoá ở RLS.
 *
 * Mã chạy trực tiếp trên trình duyệt của khách. Mẫu có sẵn (GA4, GTM...) luôn được SINH LẠI ở máy chủ từ ID đã kiểm,
 * không nhận mã từ trình duyệt; chỉ "Mã tuỳ chỉnh" nhận mã dán vào.
 */

export type CodeResult = ({ ok: true } & CodeState) | { ok: false; error: string }

const MAX_CODE = 50_000

const isPlacement = (v: unknown): v is Placement => PLACEMENTS.some((p) => p.id === v)

type Ctx = { error?: undefined; supabase: SupabaseClient; userId: string }

async function admin(): Promise<Ctx | { error: string; supabase?: undefined; userId?: undefined }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập.' }
  const { data: ok } = await supabase.rpc('is_site_admin')
  if (ok !== true) return { error: 'Chỉ tài khoản admin mới được thêm hoặc sửa mã.' }
  return { supabase, userId: user.id }
}

/** Sau mỗi thay đổi: chụp lại danh sách vào lịch sử, giữ 10 bản gần nhất, làm mới website, trả trạng thái mới. */
async function commit(ctx: Ctx, note: string): Promise<CodeResult> {
  const { supabase, userId } = ctx
  const { data: rows } = await supabase
    .from('site_code_snippets')
    .select('id, placement, name, kind, config, code, enabled, sort_order')
    .order('placement')
    .order('sort_order')
  await supabase.from('site_code_history').insert({ snapshot: rows ?? [], note, created_by: userId })

  const { data: old } = await supabase
    .from('site_code_history')
    .select('id')
    .order('id', { ascending: false })
    .range(HISTORY_KEEP, HISTORY_KEEP + 200)
  if (old?.length) {
    await supabase
      .from('site_code_history')
      .delete()
      .in(
        'id',
        old.map((o: { id: number }) => o.id)
      )
  }

  updateTag('site_code')
  revalidatePath('/', 'layout')
  revalidatePath('/admin-cls/settings')
  return { ok: true, ...(await loadCodeState(supabase)) }
}

const cleanName = (v: unknown) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : '')
const fail = (error: string): CodeResult => ({ ok: false, error })

async function nextOrder(ctx: Ctx, placement: Placement): Promise<number> {
  const { data } = await ctx.supabase
    .from('site_code_snippets')
    .select('sort_order')
    .eq('placement', placement)
    .order('sort_order', { ascending: false })
    .limit(1)
  return ((data?.[0] as { sort_order: number } | undefined)?.sort_order ?? -1) + 1
}

/** Thêm từ mẫu có sẵn: nhập ID, mã (có thể 2 phần như Tag Manager) được sinh ở máy chủ. */
export async function addFromTemplate(templateId: TemplateId, rawId: string): Promise<CodeResult> {
  const ctx = await admin()
  if (ctx.error !== undefined) return fail(ctx.error)
  const t = getTemplate(templateId)
  if (!t) return fail('Mẫu không tồn tại.')
  const id = String(rawId ?? '').trim()
  const bad = validateTemplateId(t, id)
  if (bad) return fail(bad)

  for (const part of t.parts) {
    const { error } = await ctx.supabase.from('site_code_snippets').insert({
      placement: part.placement,
      name: part.name,
      kind: t.id,
      config: { id, part: part.key },
      code: part.code(id),
      enabled: true,
      sort_order: await nextOrder(ctx, part.placement),
      updated_by: ctx.userId,
    })
    if (error) return fail(error.message)
  }
  return commit(ctx, `Thêm "${t.name}"`)
}

/** Thêm mã tuỳ chỉnh (dán code). Mã mới để TẮT cho tới khi anh bật, để không chạy khi mới thêm tên. */
export async function addCustom(placement: Placement, name: string, code: string): Promise<CodeResult> {
  const ctx = await admin()
  if (ctx.error !== undefined) return fail(ctx.error)
  if (!isPlacement(placement)) return fail('Vị trí không hợp lệ.')
  const nm = cleanName(name)
  if (!nm || nm.length > 120) return fail('Tên mã cần từ 1 đến 120 ký tự.')
  if (typeof code !== 'string' || code.length > MAX_CODE) return fail(`Mã quá dài (tối đa ${MAX_CODE} ký tự).`)

  const { error } = await ctx.supabase.from('site_code_snippets').insert({
    placement,
    name: nm,
    kind: 'custom',
    config: {},
    code,
    enabled: false,
    sort_order: await nextOrder(ctx, placement),
    updated_by: ctx.userId,
  })
  if (error) return fail(error.message)
  return commit(ctx, `Thêm "${nm}"`)
}

export type SnippetPatch = {
  name?: string
  enabled?: boolean
  /** Mã tuỳ chỉnh: code mới. Mẫu có sẵn: bỏ qua, mã được sinh lại từ config.id. */
  code?: string
  /** Mẫu có sẵn: ID mới. */
  templateId?: string
  /** true: chuyển mẫu có sẵn thành mã tuỳ chỉnh (giữ nguyên code hiện tại để sửa tay). */
  convertToCustom?: boolean
}

export async function updateSnippet(id: string, patch: SnippetPatch): Promise<CodeResult> {
  const ctx = await admin()
  if (ctx.error !== undefined) return fail(ctx.error)
  const { data: cur, error: readErr } = await ctx.supabase.from('site_code_snippets').select(SNIPPET_COLUMNS).eq('id', id).maybeSingle()
  if (readErr) return fail(readErr.message)
  if (!cur) return fail('Không tìm thấy mã này (có thể đã bị xoá).')
  const row = cur as SnippetRow

  const update: Record<string, unknown> = { updated_by: ctx.userId }
  const notes: string[] = []

  if (patch.name !== undefined) {
    const nm = cleanName(patch.name)
    if (!nm || nm.length > 120) return fail('Tên mã cần từ 1 đến 120 ký tự.')
    if (nm !== row.name) {
      update.name = nm
      notes.push(`Đổi tên "${row.name}"`)
    }
  }
  if (patch.enabled !== undefined && patch.enabled !== row.enabled) {
    update.enabled = !!patch.enabled
    notes.push(`${patch.enabled ? 'Bật' : 'Tắt'} "${row.name}"`)
  }

  const template = getTemplate(row.kind)
  if (patch.convertToCustom && template) {
    update.kind = 'custom'
    update.config = {}
    notes.push(`Chuyển "${row.name}" sang mã tuỳ chỉnh`)
  } else if (template) {
    if (patch.templateId !== undefined && patch.templateId.trim() !== (row.config?.id ?? '')) {
      const newId = patch.templateId.trim()
      const bad = validateTemplateId(template, newId)
      if (bad) return fail(bad)
      const partKey = row.config?.part ?? template.parts[0].key
      const code = templatePartCode(template, partKey, newId)
      if (code === null) return fail('Không sinh lại được mã từ mẫu.')
      update.config = { id: newId, part: partKey }
      update.code = code
      notes.push(`Sửa ID "${row.name}"`)
    }
  } else if (patch.code !== undefined && patch.code !== row.code) {
    if (typeof patch.code !== 'string' || patch.code.length > MAX_CODE) return fail(`Mã quá dài (tối đa ${MAX_CODE} ký tự).`)
    update.code = patch.code
    notes.push(`Sửa mã "${row.name}"`)
  }

  if (notes.length === 0) return { ok: true, ...(await loadCodeState(ctx.supabase)) }
  const { error } = await ctx.supabase.from('site_code_snippets').update(update).eq('id', id)
  if (error) return fail(error.message)
  return commit(ctx, notes.join(', '))
}

export async function deleteSnippet(id: string): Promise<CodeResult> {
  const ctx = await admin()
  if (ctx.error !== undefined) return fail(ctx.error)
  const { data: cur } = await ctx.supabase.from('site_code_snippets').select('name').eq('id', id).maybeSingle()
  const { error } = await ctx.supabase.from('site_code_snippets').delete().eq('id', id)
  if (error) return fail(error.message)
  return commit(ctx, `Xoá "${(cur as { name: string } | null)?.name ?? 'mã'}"`)
}

/** Khôi phục danh sách mã về một bản trong lịch sử. Trước khi khôi phục, danh sách hiện tại được chụp lại để quay về được. */
export async function restoreHistory(historyId: number): Promise<CodeResult> {
  const ctx = await admin()
  if (ctx.error !== undefined) return fail(ctx.error)
  const { data: h, error } = await ctx.supabase.from('site_code_history').select('snapshot, note, created_at').eq('id', historyId).maybeSingle()
  if (error) return fail(error.message)
  if (!h || !Array.isArray(h.snapshot)) return fail('Không tìm thấy bản lịch sử này.')

  const rows = (h.snapshot as Partial<SnippetRow>[]).filter(
    (r): r is SnippetRow => !!r && isPlacement(r.placement) && typeof r.name === 'string' && typeof r.code === 'string'
  )
  // Chụp danh sách hiện tại trước khi ghi đè
  const before = await commit(ctx, 'Trước khi khôi phục')
  if (!before.ok) return before

  const del = await ctx.supabase.from('site_code_snippets').delete().not('id', 'is', null)
  if (del.error) return fail(del.error.message)
  if (rows.length) {
    const ins = await ctx.supabase.from('site_code_snippets').insert(
      rows.map((r) => ({
        placement: r.placement,
        name: r.name,
        kind: r.kind || 'custom',
        config: r.config ?? {},
        code: r.code,
        enabled: !!r.enabled,
        sort_order: r.sort_order ?? 0,
        updated_by: ctx.userId,
      }))
    )
    if (ins.error) return fail(`${ins.error.message}. Danh sách trước khi khôi phục vẫn lưu ở lịch sử.`)
  }
  return commit(ctx, `Khôi phục bản ${viDateTime(h.created_at)}`)
}

export type LiveCheck = { ok: true; found: Record<string, boolean>; checkedAt: string } | { ok: false; error: string }

/**
 * Kiểm tra mã đã chạy trên website thật chưa: đọc trang chủ và tìm dấu data-cs-code của từng mã đang bật.
 * Website làm mới tối đa sau 1 giờ nên mã vừa lưu có thể chưa thấy ngay.
 */
export async function checkLive(): Promise<LiveCheck> {
  const ctx = await admin()
  if (ctx.error !== undefined) return { ok: false, error: ctx.error }
  const { data } = await ctx.supabase.from('site_code_snippets').select('id').eq('enabled', true)
  try {
    const res = await fetch(`${SITE_URL}/?cs_check=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'User-Agent': 'ClickStar-CodeCheck/1.0' },
      signal: AbortSignal.timeout(12_000),
    })
    if (!res.ok) return { ok: false, error: `Website trả mã ${res.status}, chưa kiểm tra được.` }
    const html = await res.text()
    const found: Record<string, boolean> = {}
    for (const r of (data ?? []) as { id: string }[]) found[r.id] = html.includes(`data-cs-code="${r.id}"`)
    return { ok: true, found, checkedAt: viDateTime(new Date().toISOString()) }
  } catch {
    return { ok: false, error: 'Không đọc được website, hãy thử lại sau.' }
  }
}
