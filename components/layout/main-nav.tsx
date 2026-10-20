'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/app-link'
import Image from 'next/image'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useSiteBranding } from '@/contexts/site-branding-context'
import { LanguageSwitchLink } from '@/components/layout/language-switch-link'
import { tagLabel } from '@/lib/cms/tags'

type NavPost = {
  id: string
  slug: string
  title: { vi?: string; en?: string } | null
  excerpt: { vi?: string; en?: string } | null
  cover_image: string | null
  tags: string[] | null
  published_at: string | null
}
type NavNewsData = { count: number; items: NavPost[] }

// Tải một lần cho cả phiên: mọi trang dùng chung kết quả, không gọi lại khi chuyển trang.
let navNewsPromise: Promise<NavNewsData> | null = null
function loadNavNews(): Promise<NavNewsData> {
  if (!navNewsPromise) {
    navNewsPromise = fetch('/api/nav-news')
      .then((r) => (r.ok ? (r.json() as Promise<NavNewsData>) : { count: 0, items: [] }))
      .catch(() => {
        navNewsPromise = null
        return { count: 0, items: [] }
      })
  }
  return navNewsPromise
}

const newsText = {
  vi: { label: 'Tin tức', fresh: 'Mới nhất', recent: 'Bài gần đây', all: 'Xem tất cả tin tức', countSuffix: 'mới', mobileCount: (n: number | string) => `${n} bài mới` },
  en: { label: 'Blog', fresh: 'Latest', recent: 'Recent posts', all: 'View all posts', countSuffix: 'new', mobileCount: (n: number | string) => `${n} new` },
}

// Navbar: Dịch vụ, ADS hub, Bảng giá, Tin tức (nổi bật, có bảng xem nhanh), Giới thiệu, Dự án. Logo đã trỏ /.
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
    { label: 'Tin tức', href: '/blog', isNews: true },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Dự án', href: '/projects' },
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
    { label: 'Blog', href: '/blog', isNews: true },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
  ],
}

const ctaText = {
  vi: 'Liên hệ ngay',
  en: 'Contact Us'
}

export function MainNav() {
  const { language } = useLanguage()
  const branding = useSiteBranding()
  const navItems = navItemsData[language]
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [news, setNews] = useState<NavNewsData>({ count: 0, items: [] })
  const nt = newsText[language]
  const lang = language === 'vi' ? 'vi' : 'en'
  const postTitle = (post: NavPost) => post.title?.[lang] || post.title?.vi || ''
  const postDate = (post: NavPost) =>
    post.published_at
      ? new Date(post.published_at).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
      : ''

  useEffect(() => {
    let alive = true
    loadNavNews().then((data) => {
      if (alive) setNews(data)
    })
    return () => {
      alive = false
    }
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
              width={151}
              height={22}
              quality={95}
              sizes="151px"
              className="h-[22px] w-auto"
              priority
              fetchPriority="high"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) =>
              'isNews' in item && item.isNews ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown('news')}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 rounded-full bg-[#e8f1fc] py-1.5 pl-3 pr-3 text-[13px] font-bold tracking-[-0.01em] text-[#1559b8] transition-colors hover:bg-[#dbe9fb]"
                  >
                    {news.count > 0 && (
                      <span className="relative flex h-[7px] w-[7px]" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#e5484d] opacity-60 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#e5484d]" />
                      </span>
                    )}
                    <span>{item.label}</span>
                    {news.count > 0 && (
                      <span className="rounded-full bg-[#1e6dda] px-1.5 py-px text-[10.5px] font-bold text-white">
                        {news.count > 9 ? '9+' : news.count} {nt.countSuffix}
                      </span>
                    )}
                  </Link>
                  {news.items.length > 0 && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-full -translate-x-1/2 pt-2 transition-all duration-200',
                        openDropdown === 'news' ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                      )}
                    >
                      <div className="grid w-[620px] grid-cols-[1.15fr_1fr] gap-x-5 gap-y-3 rounded-2xl border border-[#e0e0e0] bg-white p-4 shadow-[0_18px_40px_-14px_rgba(20,33,58,0.28)]">
                        <Link href={`/blog/${news.items[0].slug}`} className="group block">
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] text-[#6b7280]">
                            <span className="h-[7px] w-[7px] rounded-full bg-[#e5484d]" />
                            {nt.fresh}
                          </div>
                          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f5f5f7]">
                            {news.items[0].cover_image && (
                              <Image
                                src={news.items[0].cover_image}
                                alt={postTitle(news.items[0])}
                                fill
                                sizes="320px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            {(news.items[0].tags ?? []).length > 0 && (
                              <div className="absolute left-2.5 top-2.5 flex gap-1.5">
                                {(news.items[0].tags ?? []).slice(0, 2).map((tag) => (
                                  <span key={tag} className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10.5px] font-bold text-[#1d1d1f]">
                                    {tagLabel(lang, tag)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <h4 className="mt-2.5 line-clamp-3 text-[15px] font-bold leading-snug text-[#1d1d1f] group-hover:text-[#1859b8]">
                            {postTitle(news.items[0])}
                          </h4>
                        </Link>
                        <div>
                          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.07em] text-[#6b7280]">{nt.recent}</div>
                          <div className="flex flex-col gap-3">
                            {news.items.slice(1).map((post) => (
                              <Link key={post.id} href={`/blog/${post.slug}`} className="group flex items-center gap-3">
                                <div className="relative h-14 w-[84px] flex-none overflow-hidden rounded-lg bg-[#f5f5f7]">
                                  {post.cover_image && <Image src={post.cover_image} alt="" fill sizes="84px" className="object-cover" />}
                                </div>
                                <div className="min-w-0">
                                  <span className="line-clamp-3 text-[13px] font-bold leading-snug text-[#1d1d1f] group-hover:text-[#1859b8]">
                                    {postTitle(post)}
                                  </span>
                                  <span className="text-[11px] text-[#6b7280]">{postDate(post)}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end border-t border-[#eceff3] pt-3">
                          <Link href="/blog" className="text-[12.5px] font-bold text-[#1559b8] hover:underline">
                            {nt.all} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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
              )
            )}
          </div>

          {/* Desktop CTA + Language Switcher */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher: chữ thường, không cờ */}
            <div className="flex items-center gap-0.5">
              {(['vi', 'en'] as const).map((lng) => (
                <LanguageSwitchLink
                  key={lng}
                  lang={lng}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs transition-colors",
                    language === lng
                      ? "bg-black/[0.07] text-[#1d1d1f] font-semibold"
                      : "text-[#424245] hover:text-[#1d1d1f]"
                  )}
                >
                  {lng.toUpperCase()}
                </LanguageSwitchLink>
              ))}
            </div>

            <Link
              href="/contact"
              className="bg-[#1e6dda] text-white text-[13px] px-3.5 py-1.5 rounded-full transition-transform active:scale-95"
            >
              {ctaText[language]}
            </Link>
          </div>

          {/* Mobile: nút Tin tức luôn hiện cạnh nút menu */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 rounded-full bg-[#e8f1fc] px-3 py-1.5 text-[13px] font-bold text-[#1559b8]"
            >
              {news.count > 0 && <span className="h-[7px] w-[7px] rounded-full bg-[#e5484d]" aria-hidden="true" />}
              {nt.label}
            </Link>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-[calc(100vh-56px)] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 border-t border-border">
            <Link
              href="/blog"
              className="mb-1.5 flex items-center justify-between rounded-xl bg-[#1e6dda] px-4 py-3 font-semibold text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>{nt.label}</span>
              {news.count > 0 && (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-extrabold text-[#1559b8]">
                  {nt.mobileCount(news.count > 9 ? '9+' : news.count)}
                </span>
              )}
            </Link>
            {news.items[0] && (
              <Link
                href={`/blog/${news.items[0].slug}`}
                className="mb-2 flex items-center gap-3 rounded-2xl border-[1.5px] border-[#b9d4f8] bg-[#eaf2fd] p-2.5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative h-[68px] w-[92px] flex-none overflow-hidden rounded-[10px] bg-[#f5f5f7]">
                  {news.items[0].cover_image && (
                    <Image src={news.items[0].cover_image} alt="" fill sizes="92px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-[#1559b8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" />
                    {nt.fresh}
                  </div>
                  <span className="line-clamp-2 text-[13.5px] font-bold leading-snug text-[#1d1d1f]">{postTitle(news.items[0])}</span>
                </div>
              </Link>
            )}
            {navItems.map((item) =>
              'isNews' in item && item.isNews ? null : (
              <div key={item.label} className="py-1">
                {'hasDropdown' in item && item.hasDropdown ? (
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
              )
            )}
            
            {/* Mobile Language Switcher + CTA */}
            <div className="mt-4 pt-4 border-t border-border space-y-4 px-4">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                  <LanguageSwitchLink
                    lang="vi"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      language === 'vi' 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    VI
                  </LanguageSwitchLink>
                  <LanguageSwitchLink
                    lang="en"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      language === 'en' 
                        ? "bg-primary text-primary-foreground shadow-sm" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    EN
                  </LanguageSwitchLink>
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
