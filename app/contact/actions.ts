'use server'

import { after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { sendLeadNotification } from '@/lib/email/send-lead-notification'
import { pushLeadToCrm } from '@/lib/crm/push-lead'

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Vui lòng nhập họ tên (tối thiểu 2 ký tự)').max(120),
  phone: z
    .string()
    .trim()
    .min(8, 'Số điện thoại không hợp lệ')
    .max(20)
    .regex(/^[\d\s+().-]+$/, 'Số điện thoại chỉ chứa số và các ký tự + - ( )'),
  email: z
    .string()
    .trim()
    .max(180)
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')),
  company: z.string().trim().max(180).optional().or(z.literal('')),
  service: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  // honeypot — bots fill this hidden field, real users leave empty
  website: z.string().max(0).optional().or(z.literal('')),
})

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'success'; leadId: string }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    company: String(formData.get('company') ?? ''),
    service: String(formData.get('service') ?? ''),
    message: String(formData.get('message') ?? ''),
    website: String(formData.get('website') ?? ''),
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return {
      status: 'error',
      message: 'Vui lòng kiểm tra lại thông tin đã nhập',
      fieldErrors,
    }
  }

  // Honeypot tripped → silently succeed without writing DB
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: 'success', leadId: 'spam-rejected' }
  }

  const supabase = await createClient()

  const messageWithMeta = [
    parsed.data.service ? `Dịch vụ quan tâm: ${parsed.data.service}` : null,
    parsed.data.message || null,
  ]
    .filter(Boolean)
    .join('\n\n')

  // Insert qua RPC SECURITY DEFINER: anon submit được + trả id mà KHÔNG cần quyền
  // SELECT trên bảng leads (policy đọc chỉ cho admin). Tránh lỗi 42501
  // "new row violates row-level security policy" khi .insert().select() vì phần
  // RETURNING bị áp policy SELECT.
  const { data: leadId, error } = await supabase.rpc('submit_lead', {
    p_name: parsed.data.name,
    p_phone: parsed.data.phone,
    p_email: parsed.data.email || null,
    p_company: parsed.data.company || null,
    p_message: messageWithMeta || null,
    p_source: 'contact_form',
  })

  if (error || !leadId) {
    console.error('[contact] insert failed:', error?.message)
    return {
      status: 'error',
      message: 'Không gửi được. Vui lòng thử lại sau hoặc liên hệ qua điện thoại.',
    }
  }

  // Fire-and-forget email notification — không block user response
  // Resend API key missing → silently skip (graceful)
  sendLeadNotification({
    id: leadId,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    company: parsed.data.company || null,
    message: parsed.data.message || null,
    service: parsed.data.service || null,
  }).catch((e) => console.error('[contact] notification failed:', e))

  // Đẩy lead sang CRM (crm.clickstar.vn) tạo hồ sơ khách hàng — chạy SAU khi
  // response gửi cho user (after() đảm bảo execute trên Vercel serverless, không
  // bị kill giữa chừng như fire-and-forget thường). Dedup theo SĐT bên CRM.
  // Tôn trọng cờ crm_sync_enabled (admin tắt ở Settings → skip).
  // Thiếu env CRM → skip graceful. Ghi crm_customer_id ngược lại bảng leads.
  after(async () => {
    // Đọc cờ bật/tắt từ site_settings — admin có thể tắt đồng bộ ở Settings
    const { data: cfg } = await supabase
      .from('site_settings')
      .select('crm_sync_enabled')
      .eq('id', 1)
      .maybeSingle()
    if (cfg && cfg.crm_sync_enabled === false) {
      return // admin đã tắt đồng bộ CRM
    }

    const res = await pushLeadToCrm({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      message: parsed.data.message || null,
      service: parsed.data.service || null,
    })
    if (res.ok) {
      // Ghi ngược qua RPC SECURITY DEFINER (anon không có quyền UPDATE bảng leads)
      await supabase.rpc('mark_lead_crm_synced', {
        p_lead_id: leadId,
        p_crm_customer_id: res.customerId,
      })
    } else {
      console.error('[contact] CRM push skipped/failed:', res.reason)
    }
  })

  return { status: 'success', leadId }
}
