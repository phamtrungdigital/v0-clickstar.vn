'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { LeadStatus } from '@/lib/cms/leads-shared'

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { ok: true }
}

export async function updateLeadNotes(id: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').update({ notes }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { ok: true }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/leads')
  return { ok: true }
}

// For the public contact form (open access via RLS insert policy).
export async function submitContactForm(formData: FormData) {
  const supabase = await createClient()
  const input = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim() || null,
    company: String(formData.get('company') || '').trim() || null,
    message: String(formData.get('message') || '').trim(),
    source: String(formData.get('source') || 'website'),
  }
  if (!input.name || (!input.email && !input.phone)) {
    return { error: 'Vui lòng nhập họ tên + ít nhất 1 cách liên hệ' }
  }
  const { error } = await supabase.from('leads').insert(input)
  if (error) return { error: error.message }
  return { ok: true }
}
