'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useLanguage, type Language } from '@/contexts/language-context'
import { useSiteBranding } from '@/contexts/site-branding-context'

const servicesData: Record<Language, { name: string; href: string }[]> = {
  vi: [
    { name: 'Digital Marketing', href: '#' },
    { name: 'Thiết kế Website', href: '#' },
    { name: 'Dashboard dữ liệu', href: '#' },
    { name: 'Tích hợp AI', href: '#' },
    { name: 'AI Automation', href: '#' },
    { name: 'CRM & CDP', href: '#' },
  ],
  en: [
    { name: 'Digital Marketing', href: '#' },
    { name: 'Website Design', href: '#' },
    { name: 'Data Dashboard', href: '#' },
    { name: 'AI Integration', href: '#' },
    { name: 'AI Automation', href: '#' },
    { name: 'CRM & CDP', href: '#' },
  ]
}

const usefulLinksData: Record<Language, { name: string; href: string }[]> = {
  vi: [
    { name: 'Về chúng tôi', href: '#about' },
    { name: 'Đội ngũ', href: '#team' },
    { name: 'Dự án', href: '#cases' },
    { name: 'Bảng giá', href: '/pricing' },
    { name: 'Tin tức', href: '#blog' },
    { name: 'Liên hệ', href: '#contact' },
  ],
  en: [
    { name: 'About Us', href: '#about' },
    { name: 'Our Team', href: '#team' },
    { name: 'Projects', href: '#cases' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ]
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-red-600' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const { language, t } = useLanguage()
  const branding = useSiteBranding()
  const services = servicesData[language]
  const usefulLinks = usefulLinksData[language]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="bg-[#0f172a] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Logo + About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src={branding.logoUrl || '/images/logo-clickstar.png'}
                alt={branding.siteName}
                width={140}
                height={35}
                className="h-9 w-auto brightness-0 invert"
                unoptimized
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t(
                'Chúng tôi là đơn vị cung cấp giải pháp chuyển đổi số toàn diện, giúp doanh nghiệp tối ưu vận hành và tăng trưởng bền vững.',
                'We provide comprehensive digital transformation solutions to help businesses optimize operations and achieve sustainable growth.'
              )}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`w-9 h-9 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white`}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {t('Dịch vụ', 'Services')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {t('Liên kết', 'Quick Links')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {t('Liên hệ', 'Contact')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <span className="text-gray-400 text-sm leading-relaxed">
                  {t(
                    'Tầng 6, Tòa MD Complex (Tòa VP), Số 68 Nguyễn Cơ Thạch, Phường Từ Liêm, Thành phố Hà Nội, Việt Nam',
                    'Floor 6, MD Complex Tower (Office Building), 68 Nguyen Co Thach, Tu Liem Ward, Hanoi, Vietnam'
                  )}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </span>
                <Link href="tel:0977713428" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  0977 713 428
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </span>
                <Link href="mailto:clickstar.vn@gmail.com" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  clickstar.vn@gmail.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {t('Đăng ký nhận tin', 'Newsletter')}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              {t('Đăng ký để nhận thông tin mới nhất về xu hướng công nghệ và chuyển đổi số.', 'Subscribe to get the latest updates on technology trends and digital transformation.')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Nhập email của bạn', 'Enter your email')}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {t('Đăng ký ngay', 'Subscribe now')}
                <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {t('CÔNG TY TNHH CLICK STAR DIGITAL', 'CLICK STAR DIGITAL CO., LTD')}. {t('Bảo lưu mọi quyền.', 'All rights reserved.')}
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
                {t('Chính sách bảo mật', 'Privacy Policy')}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
                {t('Điều khoản sử dụng', 'Terms of Service')}
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
                {t('Chính sách Cookie', 'Cookie Policy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
