import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/crm-status — kiểm tra cấu hình + kết nối CRM cho trang Settings.
 *
 * - Xác thực admin (phải đăng nhập admin-cls).
 * - Báo env nào có/thiếu (KHÔNG trả giá trị secret — chỉ true/false).
 * - "Test kết nối": ping RPC ingest_web_lead với secret SAI cố ý → CRM phải trả
 *   'unauthorized'. Nhận đúng phản hồi đó = chứng minh URL+key+RPC sống mà KHÔNG
 *   tạo lead rác. Nếu secret env đúng thì 'unauthorized' chứng minh secret khớp
 *   định dạng đang chạy (ta không gửi secret thật để tránh tạo customer test).
 */
export async function GET() {
  // Auth gate: chỉ admin đã đăng nhập
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()
  if (!adminRow) {
    return NextResponse.json({ error: 'not_admin' }, { status: 403 })
  }

  const url = process.env.CRM_SUPABASE_URL
  const anon = process.env.CRM_SUPABASE_ANON_KEY
  const secret = process.env.CRM_INGEST_SECRET

  const env = {
    url: !!url,
    anonKey: !!anon,
    secret: !!secret,
  }
  const configured = env.url && env.anonKey && env.secret

  // Hostname hiển thị (che phần nhạy cảm)
  let crmHost: string | null = null
  if (url) {
    try {
      crmHost = new URL(url).host
    } catch {
      crmHost = null
    }
  }

  if (!configured) {
    return NextResponse.json({
      configured: false,
      env,
      crmHost,
      reachable: false,
      message: 'Thiếu cấu hình CRM (env). Liên hệ kỹ thuật để bổ sung.',
    })
  }

  // Test kết nối: gọi RPC với secret CỐ TÌNH SAI → CRM trả 'unauthorized' nếu sống.
  // Không tạo lead rác. Phân biệt: reachable (URL+key+RPC OK) vs lỗi mạng/cấu hình.
  let reachable = false
  let detail = ''
  try {
    const res = await fetch(`${url}/rest/v1/rpc/ingest_web_lead`, {
      method: 'POST',
      headers: {
        apikey: anon!,
        Authorization: `Bearer ${anon}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_secret: '__connection_test_invalid__',
        p_name: 'ping',
        p_phone: '0000000000',
      }),
      cache: 'no-store',
    })
    const text = await res.text()
    // CRM sống + RPC tồn tại → trả 'unauthorized' (vì secret sai). Đó là tín hiệu TỐT.
    if (text.includes('unauthorized')) {
      reachable = true
      detail = 'RPC phản hồi đúng (đã từ chối secret sai như mong đợi).'
    } else if (res.status === 404 || text.includes('Could not find')) {
      detail = 'Không tìm thấy RPC ingest_web_lead bên CRM.'
    } else {
      detail = `Phản hồi bất thường (HTTP ${res.status}).`
    }
  } catch (e) {
    detail = `Không kết nối được CRM: ${(e as Error).message}`
  }

  return NextResponse.json({
    configured: true,
    env,
    crmHost,
    reachable,
    message: reachable
      ? 'Kết nối CRM hoạt động tốt.'
      : detail || 'Không kết nối được CRM.',
  })
}
