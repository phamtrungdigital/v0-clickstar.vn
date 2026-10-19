'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const wanted = (formData.get('redirect') as string) || ''
  // Chỉ chuyển hướng trong khu quản trị: chặn địa chỉ ngoài site gửi kèm trong biểu mẫu.
  const redirectTo = wanted.startsWith('/admin-cls') && !wanted.startsWith('//') ? wanted : '/admin-cls'

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    redirect(`/admin-cls/login?error=${error?.status === 429 ? 'rate_limited' : 'invalid'}`)
  }

  // Verify is admin
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!adminRow) {
    await supabase.auth.signOut()
    redirect('/admin-cls/login?error=not_admin')
  }

  revalidatePath('/admin-cls', 'layout')
  redirect(redirectTo)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin-cls', 'layout')
  redirect('/admin-cls/login')
}
