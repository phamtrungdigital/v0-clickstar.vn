'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useSiteBranding } from '@/contexts/site-branding-context'

// Navbar tối ưu: 4 items chính + lang + CTA. Loại 'Trang chủ' (logo đã trỏ /).
// 'Tài nguyên' gom Giới thiệu + Dự án + Tin tức.
const navItemsData = {
  vi: [
    {
      label: 'Dịch vụ',
      href: '#services',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'Thiết kế Website', href: '/services/website' },
        { label: 'Dashboard dữ liệu', href: '/services/dashboard' },
        { label: 'Tích hợp AI', href: '/services/ai-integration' },
        { label: 'AI Automation', href: '/services/automation' },
        { label: 'CRM & CDP', href: '/services/crm-cdp' },
        { label: 'Phân tích cuộc gọi AI', href: '/services/speech-insight-ai', badge: 'MỚI' },
        { label: 'Phần mềm theo yêu cầu', href: '/services/custom-software', badge: 'MỚI' },
      ],
    },
    { label: 'ADS hub', href: '/ads-hub', badge: 'MỚI' },
    { label: 'Bảng giá', href: '/pricing' },
    {
      label: 'Tài nguyên',
      href: '#resources',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Giới thiệu', href: '/about' },
        { label: 'Dự án đã làm', href: '/projects' },
        { label: 'Tin tức', href: '/blog' },
        { label: 'Liên hệ tư vấn', href: '/contact' },
      ],
    },
  ],
  en: [
    {
      label: 'Services',
      href: '#services',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Digital Marketing', href: '/services/digital-marketing' },
        { label: 'Website Design', href: '/services/website' },
        { label: 'Data Dashboard', href: '/services/dashboard' },
        { label: 'AI Integration', href: '/services/ai-integration' },
        { label: 'AI Automation', href: '/services/automation' },
        { label: 'CRM & CDP', href: '/services/crm-cdp' },
        { label: 'AI Call Analytics', href: '/services/speech-insight-ai', badge: 'NEW' },
        { label: 'Custom Software', href: '/services/custom-software', badge: 'NEW' },
      ],
    },
    { label: 'ADS hub', href: '/ads-hub', badge: 'NEW' },
    { label: 'Pricing', href: '/pricing' },
    {
      label: 'Resources',
      href: '#resources',
      hasDropdown: true,
      dropdownItems: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Projects', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
}

const ctaText = {
  vi: 'Liên hệ ngay',
  en: 'Contact Us'
}

export function MainNav() {
  const { language, setLanguage } = useLanguage()
  const branding = useSiteBranding()
  const navItems = navItemsData[language]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-black/[0.08]'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={branding.logoUrl || '/images/logo-clickstar.png'}
              alt={branding.siteName}
              width={120}
              height={30}
              className="h-[22px] w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-[#424245] hover:text-[#1d1d1f] text-[13px] tracking-[-0.01em] transition-colors py-2 px-1"
                >
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#1e6dda] text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && (
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openDropdown === item.label && "rotate-180"
                    )} />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.hasDropdown && item.dropdownItems && (
                  <div
                    className={cn(
                      "absolute top-full left-0 pt-2 transition-all duration-200",
                      openDropdown === item.label 
                        ? "opacity-100 visible translate-y-0" 
                        : "opacity-0 invisible -translate-y-2"
                    )}
                  >
                    <div className="bg-white rounded-[14px] border border-[#e0e0e0] py-2 min-w-[220px]">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-[14px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                        >
                          <span>{dropdownItem.label}</span>
                          {'badge' in dropdownItem && dropdownItem.badge && (
                            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#1e6dda] text-white">
                              {dropdownItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA + Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher: chữ thường, không cờ */}
            <div className="flex items-center gap-0.5">
              {(['vi', 'en'] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  aria-pressed={language === lng}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs transition-colors",
                    language === lng
                      ? "bg-black/[0.07] text-[#1d1d1f] font-semibold"
                      : "text-[#424245] hover:text-[#1d1d1f]"
                  )}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/contact"
              className="bg-[#1e6dda] text-white text-[13px] px-3.5 py-1.5 rounded-full transition-transform active:scale-95"
            >
              {ctaText[language]}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[calc(100vh-56px)] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 border-t border-border">
            {navItems.map((item) => (
              <div key={item.label} className="py-1">
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="group flex items-center justify-between w-full px-4 py-3 text-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                    >
                      <span className="transform group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        openDropdown === item.label && "rotate-180"
                      )} />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        openDropdown === item.label ? "max-h-96" : "max-h-0"
                      )}
                    >
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="group/sub relative block pl-8 pr-4 py-2.5 text-sm text-foreground/70 hover:text-primary transition-all duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary/30 rounded-full group-hover/sub:bg-primary transition-colors duration-200" />
                          <span className="transform group-hover/sub:translate-x-1 inline-block transition-transform duration-200">{dropdownItem.label}</span>
                          {'badge' in dropdownItem && dropdownItem.badge && (
                            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#1e6dda] text-white align-middle">
                              {dropdownItem.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="group block px-4 py-3 text-foreground font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="transform group-hover:translate-x-1 inline-block transition-transform duration-200">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Language Switcher + CTA */}
            <div className="mt-4 pt-4 border-t border-border space-y-4 px-4">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      language === 'vi' 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      language === 'en' 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    EN
                  </button>
                </div>
              </div>
              
              <Link
                href="/contact"
                className="block text-center bg-[#1e6dda] text-white py-3 rounded-full transition-transform active:scale-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {ctaText[language]}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
