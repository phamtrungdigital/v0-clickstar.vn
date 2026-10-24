/**
 * Đồng ý cookie (consent) — dùng chung cho banner, bộ nạp mã tuỳ chỉnh và các tính năng cần đồng ý.
 * Thuần, không import server; chạy được ở trình duyệt.
 *
 * Nhóm:
 * - necessary: luôn bật (ngôn ngữ, lựa chọn cookie, form liên hệ, khung chat, Vercel Analytics không cookie).
 * - analytics: Đo lường truy cập (Google Analytics 4, CDP Click Star).
 * - marketing: Cá nhân hóa và quảng cáo (banner gợi ý theo lịch sử xem, Google Signals / quảng cáo).
 *
 * Cookie cs_consent = JSON {v, id, a, m, ts, pv}: id mã ngẫu nhiên (ghi sổ đồng ý), a/m 0|1, ts ms, pv phiên bản chính sách.
 * Hết hạn 6 tháng hoặc đổi POLICY_VERSION thì coi như chưa chọn, banner hiện lại.
 * Bộ nạp mã tuỳ chỉnh (components/site-code.tsx) đọc cùng cookie bằng mã nội tuyến: đổi định dạng phải sửa cả hai nơi.
 */

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

export type ConsentState = { id: string; analytics: boolean; marketing: boolean; ts: number; policyVersion: string }

export const CONSENT_COOKIE = 'cs_consent'
/** Đổi khi chính sách thay đổi đáng kể: mọi khách được hỏi lại. */
export const POLICY_VERSION = '2026-10-24'
export const CONSENT_MAX_AGE_DAYS = 182
/** Sự kiện phát trên window khi khách lưu lựa chọn (detail: ConsentState). */
export const CONSENT_EVENT = 'cs-consent'
/** Sự kiện để mở bảng Cài đặt cookie (liên kết chân trang). */
export const CONSENT_OPEN_EVENT = 'cs-consent-open'

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null
  try {
    const m = document.cookie.match(/(?:^|;\s*)cs_consent=([^;]*)/)
    if (!m) return null
    const c = JSON.parse(decodeURIComponent(m[1]))
    if (c.pv !== POLICY_VERSION || typeof c.ts !== 'number') return null
    if (Date.now() - c.ts > CONSENT_MAX_AGE_DAYS * 864e5) return null
    return { id: String(c.id || ''), analytics: c.a === 1, marketing: c.m === 1, ts: c.ts, policyVersion: c.pv }
  } catch {
    return null
  }
}

export function hasConsent(cat: ConsentCategory): boolean {
  if (cat === 'necessary') return true
  const c = readConsent()
  return !!c && (cat === 'analytics' ? c.analytics : c.marketing)
}

function randomId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16))
  }
}

export function writeConsent(analytics: boolean, marketing: boolean): ConsentState {
  const prev = readConsent()
  const state: ConsentState = {
    id: prev?.id || randomId(),
    analytics,
    marketing,
    ts: Date.now(),
    policyVersion: POLICY_VERSION,
  }
  const value = encodeURIComponent(
    JSON.stringify({ v: 1, id: state.id, a: analytics ? 1 : 0, m: marketing ? 1 : 0, ts: state.ts, pv: POLICY_VERSION })
  )
  const secure = location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${CONSENT_MAX_AGE_DAYS * 86400}; samesite=lax${secure}`
  return state
}

/**
 * Xoá dấu vết của các nhóm không được đồng ý (cookie GA4 / CDP, lịch sử cá nhân hóa) trên máy khách: cả khi rút lại,
 * lẫn cookie còn sót từ trước khi website có banner đồng ý (khách cũ bấm Từ chối).
 */
export function clearRevoked(next: ConsentState) {
  const kill = (name: string) => {
    const host = location.hostname
    const parts = host.split('.')
    const domains = ['', host, '.' + host]
    if (parts.length >= 2) domains.push('.' + parts.slice(-2).join('.'))
    for (const d of domains) document.cookie = `${name}=; path=/; max-age=0${d ? `; domain=${d}` : ''}`
  }
  if (!next.analytics) {
    document.cookie
      .split(';')
      .map((c) => c.trim().split('=')[0])
      .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid' || n === 'cdp_aid')
      .forEach(kill)
  }
  if (!next.marketing) {
    try {
      localStorage.removeItem('cs_personalize_v1')
    } catch {}
  }
}
