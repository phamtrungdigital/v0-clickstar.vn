import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { LanguageProvider, type Language } from '@/contexts/language-context'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'ClickStar - Giải pháp chuyển đổi số toàn diện',
  description:
    'Digital Marketing, Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, Automation và CRM/CDP cho doanh nghiệp Việt Nam',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const langCookie = cookieStore.get('cs-lang')?.value
  const initialLang: Language = langCookie === 'en' ? 'en' : 'vi'

  return (
    <html lang={initialLang} className="bg-background">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
