'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useSiteBranding } from '@/contexts/site-branding-context'
import { useFooterContent } from '@/contexts/web-content-context'
import { SOCIAL_KEYS, type FooterSocial } from '@/lib/cms/web-content-shared'

const SOCIAL_ICONS: Record<keyof FooterSocial, typeof Facebook> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
}
const SOCIAL_HOVER: Record<keyof FooterSocial, string> = {
  facebook: 'hover:bg-blue-600',
  twitter: 'hover:bg-sky-500',
  instagram: 'hover:bg-pink-600',
  linkedin: 'hover:bg-blue-700',
  youtube: 'hover:bg-red-600',
}

export function Footer() {
  const [email, setEmail] = useState('')
  const { language } = useLanguage()
  const branding = useSiteBranding()
  const footer = useFooterContent()

  const telHref = `tel:${(footer.contact_phone || '').replace(/\s+/g, '')}`

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
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{footer.description[language]}</p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_KEYS.map((key) => {
                const href = footer.social?.[key]
                if (!href) return null
                const Icon = SOCIAL_ICONS[key]
                return (
                  <Link
                    key={key}
                    href={href}
                    className={`w-9 h-9 bg-white/10 rounded-full flex items-center justify-center transition-all duration-300 ${SOCIAL_HOVER[key]} hover:text-white`}
                    aria-label={key}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {footer.services_title[language]}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-3">
              {footer.services_links.map((service) => (
                <li key={service.href + service.label[language]}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {service.label[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {footer.quick_title[language]}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-3">
              {footer.quick_links.map((link) => (
                <li key={link.href + link.label[language]}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                    {link.label[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {footer.contact_title[language]}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" />
                </span>
                <span className="text-gray-400 text-sm leading-relaxed">{footer.contact_address[language]}</span>
              </li>
              {footer.contact_phone && (
                <li className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </span>
                  <Link href={telHref} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {footer.contact_phone}
                  </Link>
                </li>
              )}
              {footer.contact_email && (
                <li className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </span>
                  <Link
                    href={`mailto:${footer.contact_email}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {footer.contact_email}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative">
              {footer.newsletter_title[language]}
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-primary" />
            </h4>
            <p className="text-gray-400 text-sm mb-4">{footer.newsletter_desc[language]}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'vi' ? 'Nhập email của bạn' : 'Enter your email'}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-3 rounded-lg text-sm transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {language === 'vi' ? 'Đăng ký ngay' : 'Subscribe now'}
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
              © {new Date().getFullYear()} {footer.copyright[language]}
            </p>
            <div className="flex items-center gap-6">
              {footer.policy_links.map((link) => (
                <Link
                  key={link.href + link.label[language]}
                  href={link.href}
                  className="text-gray-400 hover:text-primary text-sm transition-colors"
                >
                  {link.label[language]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
