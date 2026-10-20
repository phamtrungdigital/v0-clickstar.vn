import type { SupabaseClient } from '@supabase/supabase-js'
import { viDateTime, type HistoryItem, type Snippet } from './code-snippets'
import type { Placement } from './code-templates'

export type CodeState = { snippets: Snippet[]; history: HistoryItem[] }

export const HISTORY_KEEP = 10
export const SNIPPET_COLUMNS = 'id, placement, name, kind, config, code, enabled, sort_order, updated_at'

export type SnippetRow = {
  id: string
  placement: Placement
  name: string
  kind: string
  config: Record<string, string> | null
  code: string
  enabled: boolean
  sort_order: number
  updated_at: string
}

export const toSnippet = (r: SnippetRow): Snippet => ({
  id: r.id,
  placement: r.placement,
  name: r.name,
  kind: r.kind,
  config: r.config ?? {},
  code: r.code,
  enabled: r.enabled,
  sort_order: r.sort_order,
  updatedLabel: viDateTime(r.updated_at),
})

/**
 * Danh sách mã và lịch sử hiện tại cho màn quản trị. Phải gọi bằng client của người đã đăng nhập: chỉ admin cấp cao đọc được
 * mã đang tắt và lịch sử (RLS ở cơ sở dữ liệu). Không nằm trong file 'use server' vì không phải hành động gọi từ trình duyệt.
 */
export async function loadCodeState(supabase: SupabaseClient): Promise<CodeState> {
  const [snips, hist] = await Promise.all([
    supabase.from('site_code_snippets').select(SNIPPET_COLUMNS).order('placement').order('sort_order').order('created_at'),
    supabase.from('site_code_history').select('id, note, created_at, snapshot').order('id', { ascending: false }).limit(HISTORY_KEEP),
  ])
  return {
    snippets: ((snips.data ?? []) as SnippetRow[]).map(toSnippet),
    history: ((hist.data ?? []) as { id: number; note: string | null; created_at: string; snapshot: unknown }[]).map((h) => ({
      id: h.id,
      note: h.note,
      atLabel: viDateTime(h.created_at),
      count: Array.isArray(h.snapshot) ? h.snapshot.length : 0,
    })),
  }
}
