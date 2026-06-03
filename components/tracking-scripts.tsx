/**
 * TrackingScripts — inject mã tracking tuỳ chỉnh do admin paste trong Settings.
 *
 * Server component: HTML render thẳng vào SSR output nên browser execute đúng
 * (GTM, GA4, gtag, FB Pixel, TikTok Pixel, verification meta, chat widget...).
 *
 * 3 vị trí:
 *  - head_code       → đầu <body>, sát </head> nhất (chỗ chuẩn cho GTM/GA/Pixel)
 *  - body_start_code → sau header, đầu trang (GTM <noscript>, chat widget)
 *  - body_end_code   → cuối <body> (script defer, remarketing)
 *
 * Lưu ý kỹ thuật: Next App Router không cho chèn raw <script> vào <head> thật
 * mà không phá metadata SEO, nên "head_code" thực tế nằm đầu <body>. Mọi tag
 * tracking phổ biến vẫn hoạt động chính xác ở vị trí này.
 *
 * Bảo mật: chỉ admin (role-gated trong /admin-cls) mới sửa được các field này,
 * giống như tự dán code vào source. dangerouslySetInnerHTML là cố ý.
 */
export function TrackingCode({ code }: { code: string | null | undefined }) {
  if (!code || !code.trim()) return null
  return <div dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />
}
