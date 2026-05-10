'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirect') as string) || '/admin'

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) {
    redirect(`/admin/login?error=${encodeURIComponent(error?.message || 'Sai email hoặc mật khẩu')}`)
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
    redirect('/admin/login?error=' + encodeURIComponent('Tài khoản chưa được cấp quyền admin'))
  }

  revalidatePath('/admin', 'layout')
  redirect(redirectTo)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/admin', 'layout')
  redirect('/admin/login')
}
