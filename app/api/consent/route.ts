// POST /api/consent
// Ghi một dòng vào sổ đồng ý cookie (bảng consent_log, chỉ thêm dòng). Gọi từ components/consent/consent-manager.tsx
// bằng sendBeacon khi khách bấm Đồng ý / Từ chối / Lưu lựa chọn. Không lưu IP hay thông tin nhận dạng người.
// Lỗi ghi (thiếu khoá service_role, bảng chưa tạo) chỉ trả 204: lựa chọn của khách đã nằm trong cookie, không chặn trang.

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'
export const maxDuration = 10

const InputSchema = z.object({
  visitor_id: z.string().uuid(),
  action: z.enum(['accept_all', 'reject_all', 'custom', 'withdraw']),
  analytics: z.boolean(),
  marketing: z.boolean(),
  policy_version: z.string().min(1).max(20),
  lang: z.enum(['vi', 'en']).optional(),
  page_path: z.string().max(300).optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    // sendBeacon gửi Blob application/json; đọc text rồi parse để không phụ thuộc content-type.
    body = JSON.parse(await req.text())
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (supabase) {
    const d = parsed.data
    const { error } = await supabase.from('consent_log').insert({
      visitor_id: d.visitor_id,
      action: d.action,
      analytics: d.analytics,
      marketing: d.marketing,
      policy_version: d.policy_version,
      lang: d.lang ?? null,
      page_path: d.page_path ? d.page_path.split('?')[0].slice(0, 300) : null,
    })
    if (error) console.error('[consent] insert failed:', error.message)
  }

  return new Response(null, { status: 204 })
}
