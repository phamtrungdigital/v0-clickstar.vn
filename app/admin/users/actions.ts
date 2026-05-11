'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createAdminUser(input: {
  email: string
  name: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
}) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_create_user', {
    p_email: input.email,
    p_name: input.name,
    p_password: input.password,
    p_role: input.role,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  redirect(`/admin/users/${data}/edit?created=1`)
}

export async function updateAdminUser(input: {
  user_id: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
}) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_update_user', {
    p_user_id: input.user_id,
    p_name: input.name,
    p_role: input.role,
    p_is_active: input.is_active,
  })
  if (error) return { error: error.message }
  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${input.user_id}/edit`)
  return { ok: true }
}

export async function resetAdminPassword(userId: string, newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('admin_reset_password', {
    p_user_id: userId,
    p_new_password: newPassword,
  })
  if (error) return { error: error.message }
  return { ok: true }
}
