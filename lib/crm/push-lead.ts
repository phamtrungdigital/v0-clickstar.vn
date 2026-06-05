/**
 * Đẩy lead từ website sang CRM (crm.clickstar.vn — Supabase riêng).
 *
 * Gọi RPC `ingest_web_lead` (SECURITY DEFINER, secret-gated) qua REST API.
 * RPC tự xử lý dedup theo SĐT: trùng → update + ghi activity, mới → tạo customer.
 *
 * Fire-and-forget: gọi từ contact action nhưng KHÔNG block response cho user.
 * Thiếu env → skip im lặng (graceful, không làm vỡ luồng lưu lead).
 */

export type CrmPushInput = {
  name: string
  phone: string
  email?: string | null
  company?: string | null
  message?: string | null
  service?: string | null
}

export type CrmPushResult =
  | { ok: true; customerId: string; isNew: boolean }
  | { ok: false; reason: string }

export async function pushLeadToCrm(input: CrmPushInput): Promise<CrmPushResult> {
  const url = process.env.CRM_SUPABASE_URL
  const anon = process.env.CRM_SUPABASE_ANON_KEY
  const secret = process.env.CRM_INGEST_SECRET

  if (!url || !anon || !secret) {
    return { ok: false, reason: 'crm_not_configured' }
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/ingest_web_lead`, {
      method: 'POST',
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_secret: secret,
        p_name: input.name,
        p_phone: input.phone,
        p_email: input.email || null,
        p_company: input.company || null,
        p_message: input.message || null,
        p_service: input.service || null,
      }),
      // CRM nội bộ, không cần cache
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, reason: `crm_http_${res.status}: ${text.slice(0, 200)}` }
    }

    const data = (await res.json()) as { customer_id?: string; is_new?: boolean }
    if (!data?.customer_id) {
      return { ok: false, reason: 'crm_no_customer_id' }
    }
    return { ok: true, customerId: data.customer_id, isNew: !!data.is_new }
  } catch (e) {
    return { ok: false, reason: `crm_exception: ${(e as Error).message}` }
  }
}
