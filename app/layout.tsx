import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
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
import { BodyCode, HeadCode } from '@/components/site-code'
import { getEnabledSnippets } from '@/lib/cms/code-snippets'
import { SITE_URL, BRAND } from '@/lib/seo/site'
import './site.css'

// Plus Jakarta chủ yếu dùng ở các khối dưới màn hình đầu: không tải trước, để băng thông lúc mở trang dành cho
// HTML, phông Inter của khối mở đầu và JavaScript. Chữ hiện bằng phông dự phòng đã chỉnh cỡ rồi đổi sang, không xô lệch.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  preload: false,
})

// Inter: phông thay thế SF Pro trên thiết bị không phải Apple (theme-apple của trang chủ).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '600'],
})

// Ký tự tiếng Việt (ă đ ơ ư và các chữ có dấu thanh) lấy từ tệp con "vietnamese" của chính Google Fonts, đặt TRƯỚC
// Inter / Plus Jakarta trong danh sách phông. Lý do: CSS của Google khai báo tệp latin-ext SAU tệp vietnamese, nên
// trình duyệt lấy ă đ ơ ư từ latin-ext và phải tải thêm tệp đó (Inter latin-ext 84 KB) sau khi đọc xong CSS, kéo dài
// đường tải của trang. Khai báo cùng các cỡ đậm như phông gốc để chữ Latin và chữ có dấu trong một từ đậm như nhau.
// adjustFontFallback tắt: phông dự phòng của nhóm này phải là phông kế tiếp trong danh sách (Inter / Plus Jakarta).
// Trình nạp phông của Next chỉ nhận giá trị viết thẳng (không dùng biến hay .map), nên dải ký tự viết lặp lại ở hai chỗ.
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
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB' }],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const favicon = settings?.favicon_url
  const ogImage = settings?.default_og_image

  const icons = favicon
    ? { icon: favicon, apple: favicon }
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
  const codeAt = (p: 'head' | 'body_start' | 'body_end') => snippets.filter((s) => s.placement === p)
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
      head={<HeadCode items={codeAt('head')} legacy={settings?.head_code} />}
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
