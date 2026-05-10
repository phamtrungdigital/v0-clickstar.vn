'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

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
    { 
      label: 'Dự án', 
      href: '#cases',
      hasDropdown: true,
      dropdownItems: [
        { label: 'E-commerce', href: '#cases/ecommerce' },
        { label: 'Doanh nghiệp', href: '#cases/enterprise' },
        { label: 'Startup', href: '#cases/startup' },
      ]
    },
    { label: 'Giới thiệu', href: '/about' },
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
    { 
      label: 'Projects', 
      href: '#cases',
      hasDropdown: true,
      dropdownItems: [
        { label: 'E-commerce', href: '#cases/ecommerce' },
        { label: 'Enterprise', href: '#cases/enterprise' },
        { label: 'Startup', href: '#cases/startup' },
      ]
    },
    { label: 'About', href: '/about' },
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
              src="/images/logo-clickstar.png"
              alt="ClickStar"
              width={120}
              height={30}
              className="h-7 w-auto"
              priority
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
                  className="flex items-center gap-1 text-foreground/80 hover:text-foreground font-medium text-[15px] transition-colors py-2"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
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
                    <div className="bg-background rounded-xl shadow-lg border border-border py-2 min-w-[200px]">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {dropdownItem.label}
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
              href="#contact"
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-7 py-3 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
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
                      className="flex items-center justify-between w-full px-4 py-3 text-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openDropdown === item.label && "rotate-180"
                      )} />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        openDropdown === item.label ? "max-h-96" : "max-h-0"
                      )}
                    >
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block pl-8 pr-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-foreground font-medium hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
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
                href="#contact"
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
