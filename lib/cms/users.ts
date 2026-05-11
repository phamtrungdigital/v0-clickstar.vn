import { createClient } from '@/lib/supabase/server'

export type AdminUser = {
  user_id: string
  email: string
  full_name: string | null
  role: 'admin' | 'editor' | 'viewer'
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true })
  return (data as unknown as AdminUser[]) || []
}

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return (data as unknown as AdminUser) || null
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}
