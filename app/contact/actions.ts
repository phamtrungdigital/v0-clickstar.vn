'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      company: parsed.data.company || null,
      message: messageWithMeta || null,
      source: 'contact_form',
      status: 'new',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[contact] insert failed:', error.message)
    return {
      status: 'error',
      message: 'Không gửi được. Vui lòng thử lại sau hoặc liên hệ qua điện thoại.',
    }
  }

  return { status: 'success', leadId: data.id }
}
