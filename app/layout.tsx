import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { SiteBrandingProvider, type SiteBranding } from '@/contexts/site-branding-context'
import { TeamMembersProvider } from '@/contexts/team-members-context'
import { getSiteSettings } from '@/lib/cms/settings'
import { getActiveTeamMembers } from '@/lib/cms/team-members'
import { getChatbotSettings, toPublicConfig } from '@/lib/cms/chatbot'
import { getWebContent, normalizeWebContent } from '@/lib/cms/web-content'
import { WebContentProvider } from '@/contexts/web-content-context'
import { DeferredWidgets } from '@/components/deferred-widgets'
import { FloatingContact } from '@/components/floating-contact'
import { HtmlRoot } from '@/components/html-root'
import { BodyCode, HeadCode, SITE_CODE_LIVE } from '@/components/site-code'
import { getEnabledSnippets } from '@/lib/cms/code-snippets'
import { SITE_URL, BRAND } from '@/lib/seo/site'
import './site.css'

// Phông chữ tự lưu trong app/fonts (tệp gốc của Google Fonts, giấy phép OFL), mỗi phông chỉ gồm hai tệp: latin và
// vietnamese. Không dùng next/font/google vì CSS của Google khai báo thêm latin-ext và đặt nó SAU vietnamese, nên
// trình duyệt lấy ă đ ơ ư từ latin-ext và tải thêm tệp đó (Inter latin-ext 84 KB, Plus Jakarta 22 KB) sau khi đọc xong
// CSS, kéo dài đường tải trang; tự lưu cũng tránh lỗi build khi máy chủ build không tải được phông từ Google.
// Mỗi phông tách thành hai họ: họ "vi" (chỉ ký tự tiếng Việt) đứng TRƯỚC họ latin trong danh sách phông (globals.css).
// Cùng các cỡ đậm như bản Google trước đây để chữ Latin và chữ có dấu trong một từ đậm như nhau. Ký tự ngoài hai dải
// (hiếm: chữ Nga, Ba Lan...) hiện bằng phông hệ thống.
// Trình nạp phông của Next chỉ nhận giá trị viết thẳng (không dùng biến hay .map), nên dải ký tự viết lặp lại.

// Inter: phông thay thế SF Pro trên thiết bị không phải Apple (theme-apple của trang chủ, khối mở đầu) nên tải trước.
const inter = localFont({
  src: [
    { path: './fonts/inter-latin.woff2', weight: '300', style: 'normal' },
    { path: './fonts/inter-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-latin.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }],
})
// adjustFontFallback tắt cho họ "vi": phông dự phòng của họ này phải là họ latin đứng sau trong danh sách.
const interVietnamese = localFont({
  src: [
    { path: './fonts/inter-vietnamese.woff2', weight: '300', style: 'normal' },
    { path: './fonts/inter-vietnamese.woff2', weight: '400', style: 'normal' },
    { path: './fonts/inter-vietnamese.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-inter-vi',
  display: 'swap',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB' }],
})

// Plus Jakarta: phông chính của các trang con (ADS hub, dịch vụ, blog...) nên PHẢI tải trước. Thử không tải trước thì
// phông về sau lần vẽ đầu, chữ đổi kích thước làm khối mở đầu cao lên và xô lệch bố cục (ADS hub CLS 0,22).
const plusJakarta = localFont({
  src: [
    { path: './fonts/plus-jakarta-sans-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-latin.woff2', weight: '700', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-latin.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-plus-jakarta',
  display: 'swap',
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }],
})
const plusJakartaVietnamese = localFont({
  src: [
    { path: './fonts/plus-jakarta-sans-vietnamese.woff2', weight: '400', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-vietnamese.woff2', weight: '500', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-vietnamese.woff2', weight: '600', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-vietnamese.woff2', weight: '700', style: 'normal' },
    { path: './fonts/plus-jakarta-sans-vietnamese.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-plus-jakarta-vi',
  display: 'swap',
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB' }],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = settings?.favicon_url
  const ogImage = settings?.default_og_image

  // Favicon tải lên CMS là ảnh gốc (hiện 1,5 MB PNG): mọi khách mới đều tải về. Đưa qua bộ tối ưu ảnh của Next
  // (64px cho tab, 256px cho biểu tượng iPhone; WebP/AVIF nếu trình duyệt nhận). Ảnh trong /public giữ nguyên.
  const sizedIcon = (url: string, w: 64 | 256) =>
    /^https?:\/\//.test(url) ? `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75` : url
  const icons = favicon
    ? { icon: sizedIcon(favicon, 64), apple: sizedIcon(favicon, 256) }
    : {
        icon: [
          { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
          { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
          { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: '/apple-icon.png',
      }

  return {
    // metadataBase: biến đường dẫn tương đối (canonical, og:url, ảnh) thành địa chỉ tuyệt đối.
    metadataBase: new URL(settings?.site_url || SITE_URL),
    title: `${BRAND} | Chuyển đổi số, Marketing và AI cho doanh nghiệp`,
    description:
      settings?.default_seo_description?.vi ||
      'Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, Automation, CRM/CDP, Phân tích cuộc gọi AI (Call to Text) và Phần mềm theo yêu cầu cho doanh nghiệp Việt Nam',
    // Mặc định canonical là chính đường dẫn của trang (bỏ tham số ?utm...). Từng trang có thể đặt canonical riêng.
    alternates: { canonical: './' },
    // Mã xác minh Google Search Console (thẻ meta google-site-verification trong <head> mọi trang).
    verification: { google: '3XLcxIwkMb0I8ERCa4pzHUBLYVEIXUl0dv15959zpx4' },
    icons,
    openGraph: { siteName: BRAND, locale: 'vi_VN', type: 'website', images: ogImage ? [ogImage] : undefined },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Static-friendly: KHÔNG đọc cookie/header ở layout (sẽ ép mọi trang render động).
  // Ngôn ngữ suy ra từ ĐỊA CHỈ (/en/... là tiếng Anh, còn lại tiếng Việt): HtmlRoot đặt <html lang> và LanguageProvider
  // chọn ngôn ngữ theo đường dẫn, nên cả HTML tĩnh lẫn client đều đúng ngôn ngữ ngay từ đầu.
  const [settings, teamMembers, chatbot, webContent, snippets] = await Promise.all([
    getSiteSettings(),
    getActiveTeamMembers(),
    getChatbotSettings(),
    getWebContent(),
    getEnabledSnippets(),
  ])
  // Bản preview và máy chạy thử không chạy mã tuỳ chỉnh (GA4, CDP...), xem SITE_CODE_LIVE.
  const codeAt = (p: 'head' | 'body_start' | 'body_end') => (SITE_CODE_LIVE ? snippets.filter((s) => s.placement === p) : [])
  const chatbotConfig = toPublicConfig(chatbot)
  const { footer: footerContent, service_ctas: serviceCtas } = normalizeWebContent(webContent)
  const branding: SiteBranding = {
    logoUrl: settings?.logo_url || '/images/logo-clickstar.png',
    faviconUrl: settings?.favicon_url || null,
    siteName: settings?.site_name?.vi || 'Click Star',
    zaloUrl: settings?.zalo_url || null,
    contactPhone: settings?.contact_phone || null,
    contactEmail: settings?.contact_email || null,
  }

  return (
    <HtmlRoot
      htmlClassName="bg-background"
      bodyClassName={`${plusJakarta.variable} ${plusJakartaVietnamese.variable} ${inter.variable} ${interVietnamese.variable} font-sans antialiased`}
      // Mã tuỳ chỉnh "Đầu trang" (Cài đặt → Mã tuỳ chỉnh) nằm thật sự trong <head>. head_code là ô Header cũ,
      // còn dùng cho khối Google Analytics 4 do mục SEO ghi vào.
      head={
        SITE_CODE_LIVE ? (
          <HeadCode items={codeAt('head')} legacy={settings?.head_code} allCodes={snippets.map((s) => s.code)} />
        ) : null
      }
    >
      {/* Mã tuỳ chỉnh "Đầu thân trang": thẻ noscript của GTM, widget chat. body_start_code cũ đã chuyển sang bảng mới. */}
      <BodyCode items={codeAt('body_start')} />

      <SiteBrandingProvider branding={branding}>
        <TeamMembersProvider members={teamMembers}>
          <LanguageProvider>
            <WebContentProvider value={{ footer: footerContent, serviceCtas }}>
              {children}
            </WebContentProvider>
            {/* Chatbot, popup hồ sơ, banner cá nhân hoá, lớp sửa trực quan: tải sau khi trang đã hiện. */}
            <DeferredWidgets chatbot={chatbotConfig} />
            <FloatingContact />
          </LanguageProvider>
        </TeamMembersProvider>
      </SiteBrandingProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}

      {/* Mã tuỳ chỉnh "Cuối trang": remarketing, công cụ phụ. body_end_code cũ đã chuyển sang bảng mới. */}
      <BodyCode items={codeAt('body_end')} />
    </HtmlRoot>
  )
}
