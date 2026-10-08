// Kiểm quyền cho API/action AI. Proxy chỉ chặn /admin-cls/*, còn /api/admin/ai/*
// trước đây chỉ kiểm "đã đăng nhập" → mọi tài khoản đăng nhập được đều gọi được AI
// (tốn tiền API). Giờ bắt buộc là người trong bảng admin_users đang hoạt động.
//
// KHÔNG dùng getAdminProfile() (lib/admin-cls/auth.ts) ở đây: hàm đó tin header
// x-admin-* do proxy gắn, mà proxy KHÔNG chạy cho /api/* → client tự gửi header giả là
// qua. Luôn hỏi DB theo phiên thật (auth.uid()) qua RPC get_my_admin_profile().
import { createClient } from '@/lib/supabase/server'

type ServerClient = Awaited<ReturnType<typeof createClient>>

export type GuardProfile = { user_id: string; email: string; full_name: string | null; role: string }
export type GuardResult = { ok: true; profile: GuardProfile } | { ok: false; status: number; error: string }

/** Người soạn nội dung: admin hoặc editor. */
export async function requireContentEditor(supabase?: ServerClient): Promise<GuardResult> {
  return requireRoles(['admin', 'editor'], supabase)
}

/** Chỉ admin (cài đặt AI, khoá API). */
export async function requireAdmin(supabase?: ServerClient): Promise<GuardResult> {
  return requireRoles(['admin'], supabase, 'Chỉ tài khoản admin được đổi cài đặt AI và API key')
}

async function requireRoles(
  roles: string[],
  client?: ServerClient,
  forbiddenMessage = 'Tài khoản không có quyền dùng chức năng AI'
): Promise<GuardResult> {
  const supabase = client ?? (await createClient())
  const { data, error } = await supabase.rpc('get_my_admin_profile')
  const profile = (error ? null : data) as (GuardProfile & { is_active?: boolean }) | null
  if (!profile?.user_id || profile.is_active === false) {
    return { ok: false, status: 401, error: 'Chưa đăng nhập tài khoản quản trị' }
  }
  if (!roles.includes(profile.role)) {
    return { ok: false, status: 403, error: forbiddenMessage }
  }
  return { ok: true, profile }
}
