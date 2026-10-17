// Client Supabase quyền service_role — CHỈ dùng ở server (server action / route handler).
// Bỏ qua RLS, nên tuyệt đối không import vào component client hay đặt tên biến NEXT_PUBLIC_*.
// Thiếu SUPABASE_SERVICE_ROLE_KEY → trả null để nơi gọi bỏ qua êm, không sập request.
import { createClient } from '@supabase/supabase-js'

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
