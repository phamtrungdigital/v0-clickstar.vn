'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useTeamMembers } from '@/contexts/team-members-context'
import type { TeamContent, TeamMemberItem } from '@/lib/cms/types'
import type { TeamMember } from '@/lib/cms/team-members-types'

/** Vai trò kỹ thuật: gom vào khối "Công nghệ & kỹ thuật". Theo từ khoá trong chức danh nên thêm người mới ở admin là tự vào đúng khối. */
const TECH_ROLE_RE = /(software|web|app\b|develop|engineer|machine|\bai\b|technolog|data|devops|security|architect|analyst|kỹ sư|lập trình|công nghệ|phân tích)/i

/** Mô tả ngắn theo vai trò (nói về công việc của vị trí đó, không phải thành tích cá nhân). */
const ROLE_NOTES: { re: RegExp; vi: string; en: string }[] = [
  { re: /software|web|app\b|develop|lập trình/i, vi: 'Xây dựng website, ứng dụng và hệ thống theo yêu cầu.', en: 'Builds websites, apps and custom systems.' },
  { re: /machine|\bai\b/i, vi: 'Đưa mô hình AI vào quy trình làm việc của doanh nghiệp.', en: 'Brings AI models into business workflows.' },
  { re: /technolog|architect|công nghệ/i, vi: 'Tư vấn kiến trúc và lựa chọn công nghệ phù hợp.', en: 'Advises on architecture and the right technology choices.' },
  { re: /analyst|phân tích/i, vi: 'Chuyển nhu cầu nghiệp vụ thành đặc tả cho đội kỹ thuật.', en: 'Turns business needs into specs for the engineering team.' },
]

/** Công nghệ đội dùng hằng ngày (cùng danh sách ở trang Phần mềm theo yêu cầu). */
const STACK = ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Vercel', 'Claude API', 'Meta Marketing API', 'Zalo ZNS']

const socialClass =
  'w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#d2d2d7] hover:bg-[#1e6dda] hover:text-white transition-colors duration-200'

function Socials({ member, tone }: { member: TeamMemberItem; tone: 'dark' | 'light' }) {
  const cls = tone === 'dark' ? socialClass : 'w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200'
  const links = [
    { href: member.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: member.facebook, Icon: Facebook, label: 'Facebook' },
    { href: member.twitter, Icon: Twitter, label: 'Twitter' },
    { href: member.instagram, Icon: Instagram, label: 'Instagram' },
  ].filter((l) => l.href && l.href !== '#')
  if (links.length === 0) return null
  return (
    <div className="mt-4 flex items-center gap-2">
      {links.map(({ href, Icon, label }) => (
        <Link key={label} href={href!} className={cls} aria-label={`${member.name} on ${label}`}>
          <Icon className="w-4 h-4" />
        </Link>
      ))}
    </div>
  )
}

/** Thẻ kỹ sư: ảnh dọc, số thứ tự dạng mã, chức danh kiểu nhãn kỹ thuật. */
function EngineerCard({ member, role, note, index, itemIndex }: { member: TeamMemberItem; role: string; note: string; index: number; itemIndex: number }) {
  return (
    <div
      data-cms-field="member"
      data-cms-item-index={itemIndex}
      className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-white/15 bg-[#1d1d1f] transition-colors duration-300 hover:border-[#1e6dda]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#2c2c2e]">
        <Image
          quality={95}
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-[50%_28%] transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-transparent to-transparent opacity-80" />
        <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-1 font-mono text-[11px] tracking-wider text-[#7db8ff] backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-base font-semibold leading-tight text-white sm:text-lg">{member.name}</h3>
        <p className="mt-2 inline-flex w-fit max-w-full items-center rounded-md border border-[#7db8ff]/35 bg-[#7db8ff]/10 px-2 py-1 font-mono text-[11px] leading-snug text-[#7db8ff] sm:text-xs">
          {role}
        </p>
        {note && <p className="mt-3 text-[13px] leading-relaxed text-[#d2d2d7] sm:text-sm">{note}</p>}
        <div className="mt-auto">
          <Socials member={member} tone="dark" />
        </div>
      </div>
    </div>
  )
}

/** Thẻ nhỏ cho khối marketing và thiết kế. */
function CompactCard({ member, role, itemIndex }: { member: TeamMemberItem; role: string; itemIndex: number }) {
  return (
    <div
      data-cms-field="member"
      data-cms-item-index={itemIndex}
      className="flex items-center gap-3 rounded-full border border-white/15 bg-[#1d1d1f] py-2 pl-2 pr-5"
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#2c2c2e]">
        <Image quality={95} src={member.image} alt={member.name} fill className="object-cover object-[50%_25%]" sizes="48px" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold leading-tight text-white">{member.name}</span>
        <span className="block truncate text-xs text-[#d2d2d7]">{role}</span>
      </span>
    </div>
  )
}

/** Convert shared TeamMember (table) → TeamMemberItem (section content shape) */
function toMemberItem(m: TeamMember): TeamMemberItem {
  return {
    name: m.name,
    role: { vi: m.role_vi ?? '', en: m.role_en ?? m.role_vi ?? '' },
    image: m.image ?? '',
    facebook: m.facebook ?? undefined,
    twitter: m.twitter ?? undefined,
    linkedin: m.linkedin ?? undefined,
    instagram: m.instagram ?? undefined,
  }
}

export function TeamSection({ content }: { content: TeamContent }) {
  const { t, language } = useLanguage()
  const sharedMembers = useTeamMembers()

  // Nguồn chính: bảng team_members dùng chung (đồng bộ trang chủ và Giới thiệu). Trống thì dùng danh sách trong CMS.
  const members: TeamMemberItem[] = sharedMembers && sharedMembers.length > 0 ? sharedMembers.map(toMemberItem) : content.members

  const roleOf = (m: TeamMemberItem) => (language === 'vi' ? m.role.vi || m.role.en : m.role.en || m.role.vi)
  const entries = members.map((m, i) => ({ m, i, role: roleOf(m), tech: TECH_ROLE_RE.test(`${m.role.en} ${m.role.vi}`) }))
  const tech = entries.filter((e) => e.tech)
  const others = entries.filter((e) => !e.tech)
  const noteOf = (m: TeamMemberItem) => {
    const hit = ROLE_NOTES.find((n) => n.re.test(`${m.role.en} ${m.role.vi}`))
    return hit ? t(hit.vi, hit.en) : ''
  }

  return (
    <section data-cms-section="team" className="bg-[#272729] py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
          <span
            data-cms-field="eyebrow"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-[#d2d2d7]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#7db8ff]" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-balance sm:text-4xl lg:text-5xl">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#7db8ff]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
          </h2>
          <p data-cms-field="description" className="mx-auto mt-5 max-w-2xl text-lg text-[#d2d2d7] text-pretty">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {tech.length > 0 ? (
          <>
            {/* Khối kỹ sư và công nghệ */}
            <div className="mb-5 flex items-center gap-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[#7db8ff] sm:text-sm">
                {t('Công nghệ & kỹ thuật', 'Technology & engineering')}
              </h3>
              <span className="h-px flex-1 bg-white/15" />
              <span className="font-mono text-xs text-[#d2d2d7]">{String(tech.length).padStart(2, '0')}</span>
            </div>
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {tech.map((e, idx) => (
                <EngineerCard key={e.i} member={e.m} role={e.role} note={noteOf(e.m)} index={idx} itemIndex={e.i} />
              ))}
            </div>

            {/* Công nghệ sử dụng hằng ngày */}
            <div className="mt-8 rounded-[18px] border border-white/15 bg-[#1d1d1f] p-4 sm:p-5">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d2d2d7]">{t('Công nghệ dùng hằng ngày', 'Technology we use daily')}</p>
              <ul className="flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <li key={s} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs text-white">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Khối marketing và thiết kế */}
            {others.length > 0 && (
              <>
                <div className="mb-5 mt-12 flex items-center gap-3">
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[#7db8ff] sm:text-sm">{t('Marketing & thiết kế', 'Marketing & design')}</h3>
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="font-mono text-xs text-[#d2d2d7]">{String(others.length).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {others.map((e) => (
                    <CompactCard key={e.i} member={e.m} role={e.role} itemIndex={e.i} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Chưa có vai trò kỹ thuật nào: hiện chung một lưới thẻ nhỏ
          <div className="flex flex-wrap justify-center gap-3">
            {entries.map((e) => (
              <CompactCard key={e.i} member={e.m} role={e.role} itemIndex={e.i} />
            ))}
          </div>
        )}

        {/* CTA (chỉ hiện khi CMS có nhãn nút) */}
        {(content.cta_label?.vi || content.cta_label?.en) && (
        <div className="mt-14 text-center">
          <Link
            data-cms-field="cta"
            href={content.cta_href}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-[#1d1d1f] transition-all duration-300 hover:gap-3 hover:bg-[#f5f5f7]"
          >
            {t(content.cta_label.vi, content.cta_label.en)}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        )}
      </div>
    </section>
  )
}
