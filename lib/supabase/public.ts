// Client Supabase read-only KHÔNG dùng cookie/headers — an toàn để bọc trong
// unstable_cache (cache không được phép gọi cookies()). Chỉ dùng cho các query
// đọc dữ liệu CÔNG KHAI (site_settings, team_members, chatbot_settings, web_content,
// published pages) — đều có RLS cho anon đọc.
import { createServerClient } from '@supabase/ssr'

export function createPublicClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
