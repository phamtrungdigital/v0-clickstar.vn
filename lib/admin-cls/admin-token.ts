import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Token hồ sơ admin có chữ ký HMAC-SHA256 — dùng chung cho:
 *  - cookie cache `cs-admin-cache` (proxy bỏ qua lượt hỏi admin_users trong 5 phút)
 *  - header `x-admin-token` proxy chuyển cho RSC (getAdminProfile đọc lại)
 *
 * Trước 10/10/2026 cookie chỉ là base64 JSON → người đăng nhập tự sửa được
 * {uid, role: 'admin'}. Giờ: `<payload base64url>.<HMAC base64url>`, khoá bí mật
 * ADMIN_CACHE_SECRET (chỉ server). Thiếu khoá → không ký, không tin token nào
 * (proxy luôn hỏi DB, getAdminProfile luôn gọi RPC) — chậm hơn nhưng không mở cửa.
 */
export const ADMIN_CACHE_COOKIE = 'cs-admin-cache'
export const ADMIN_TOKEN_HEADER = 'x-admin-token'
export const ADMIN_CACHE_TTL_MS = 5 * 60 * 1000 // 5 phút

// Tách miền chữ ký: HMAC chỉ hợp lệ cho đúng mục đích + phiên bản định dạng này.
const SIG_CONTEXT = 'cs-admin-cache.v1.'
const MIN_SECRET_LENGTH = 32
// Dung sai lệch đồng hồ giữa các instance khi chặn exp quá xa tương lai.
const CLOCK_SKEW_MS = 60 * 1000

export type AdminCacheValue = {
  uid: string
  email: string
  name: string | null
  role: string
  exp: number
}

let warnedMissingSecret = false

function getSecret(): string | null {
  const secret = process.env.ADMIN_CACHE_SECRET
  if (secret && secret.length >= MIN_SECRET_LENGTH) return secret
  if (!warnedMissingSecret) {
    warnedMissingSecret = true
    console.warn(
      `[admin-token] ADMIN_CACHE_SECRET chưa cấu hình (hoặc ngắn hơn ${MIN_SECRET_LENGTH} ký tự) → tắt cache admin, mọi lượt đều hỏi DB.`
    )
  }
  return null
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(SIG_CONTEXT + payload).digest('base64url')
}

/** Ký hồ sơ admin. Trả null khi chưa có khoá bí mật (khi đó không phát cookie). */
export function signAdminToken(value: AdminCacheValue): string | null {
  const secret = getSecret()
  if (!secret) return null
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url')
  return `${payload}.${sign(payload, secret)}`
}

/**
 * Kiểm chữ ký (so sánh thời gian hằng) + hạn dùng. Sai/thiếu/hết hạn → null,
 * người gọi phải tự hỏi DB.
 */
export function verifyAdminToken(raw: string | null | undefined): AdminCacheValue | null {
  if (!raw) return null
  const secret = getSecret()
  if (!secret) return null

  const parts = raw.split('.')
  if (parts.length !== 2) return null
  const [payload, sig] = parts
  if (!payload || !sig) return null

  // So chuỗi chữ ký dạng chuẩn (không decode) → chặn cả biến thể base64 "lỏng".
  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null

  let decoded: unknown
  try {
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!decoded || typeof decoded !== 'object') return null
  const v = decoded as Record<string, unknown>
  if (
    typeof v.uid !== 'string' ||
    !v.uid ||
    typeof v.email !== 'string' ||
    (v.name !== null && typeof v.name !== 'string') ||
    typeof v.role !== 'string' ||
    !v.role ||
    typeof v.exp !== 'number'
  ) {
    return null
  }

  const now = Date.now()
  if (v.exp <= now || v.exp > now + ADMIN_CACHE_TTL_MS + CLOCK_SKEW_MS) return null

  return { uid: v.uid, email: v.email, name: v.name, role: v.role, exp: v.exp }
}
