'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useSiteBranding } from '@/contexts/site-branding-context'

const navItemsData = {
  vi: [
    { label: 'Trang chủ', href: '/' },
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
      ]
    },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Dự án', href: '/projects' },
    { label: 'Bảng giá', href: '/pricing' },
    { label: 'Tin tức', href: '/blog' },
  ],
  en: [
    { label: 'Home', href: '/' },
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
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
  ]
}

const ctaText = {
  vi: 'Liên hệ ngay',
  en: 'Contact Us'
}

export function MainNav() {
  const { language, setLanguage } = useLanguage()
  const branding = useSiteBranding()
  const navItems = navItemsData[language]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' 
          : 'bg-background'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src={branding.logoUrl || '/images/logo-clickstar.png'}
              alt={branding.siteName}
              width={120}
              height={30}
              className="h-7 w-auto"
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
                  className="group relative flex items-center gap-1 text-foreground/70 hover:text-primary font-medium text-[15px] transition-all duration-300 py-2 px-1"
                >
                  <span className="relative z-10">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-300 relative z-10",
                      openDropdown === item.label && "rotate-180"
                    )} />
                  )}
                  {/* Animated underline effect */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  {/* Subtle glow on hover */}
                  <span className="absolute inset-0 bg-primary/5 rounded-lg transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-10" />
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
                    <div className="bg-background rounded-xl shadow-xl shadow-primary/5 border border-border py-2 min-w-[220px] backdrop-blur-sm">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="group/item relative flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 hover:text-primary transition-all duration-200"
                        >
                          {/* Hover indicator bar */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-primary to-primary-dark rounded-r-full group-hover/item:h-6 transition-all duration-200" />
                          {/* Text with slide effect */}
                          <span className="relative transform group-hover/item:translate-x-2 transition-transform duration-200">
                            {dropdownItem.label}
                          </span>
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
            {/* Language Switcher */}
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
                <span className="text-base">🇻🇳</span>
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
                <span className="text-base">🇬🇧</span>
                EN
              </button>
            </div>
            
            <Link
              href="/contact"
              className="group relative bg-gradient-to-r from-primary to-primary-dark text-white font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 overflow-hidden"
            >
              <span className="relative z-10">{ctaText[language]}</span>
              {/* Shine effect on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
            isMobileMenuOpen ? "max-h-[calc(100vh-72px)] opacity-100" : "max-h-0 opacity-0"
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
                    <span className="text-base">🇻🇳</span>
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
                    <span className="text-base">🇬🇧</span>
                    EN
                  </button>
                </div>
              </div>
              
              <Link
                href="/contact"
                className="block text-center bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 rounded-full transition-all duration-200"
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
