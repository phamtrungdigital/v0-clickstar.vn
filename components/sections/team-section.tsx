'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useTeamMembers } from '@/contexts/team-members-context'
import type { TeamContent, TeamMemberItem } from '@/lib/cms/types'
import type { TeamMember } from '@/lib/cms/team-members-types'

/**
 * Vị trí cắt ảnh: mặt luôn nằm ở nửa trên khung, vùng chữ chỉ che phần thân.
 * Ảnh chân dung dọc của đội đều chụp từ ngực trở lên nên 18% là đủ để lấy trọn đầu và tóc.
 */
const FACE_POS = '50% 18%'
/** Ảnh lead hiện là ảnh ngang, mặt lệch trái tâm một chút. */
const LEAD_POS = '45% 26%'

/** Chức danh nhận ra lead của đội (tìm theo từ khoá trong chức danh tiếng Anh hoặc tiếng Việt). */
const LEAD_ROLE_RE = /(\blead\b|\bhead\b|director|chief|founder|\bceo\b|consultant|trưởng|giám đốc|tư vấn công nghệ)/i

/** Dùng cho lưới 5 người xung quanh lead (bố cục bento). Khác 5 người thì chuyển sang lưới đều. */
const BENTO_PLACE = [
  'lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-7',
  'lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-7',
  'lg:col-span-1 lg:col-start-1 lg:row-start-8 lg:row-span-7',
  'lg:col-span-1 lg:col-start-3 lg:row-start-8 lg:row-span-7',
  'lg:col-span-1 lg:col-start-2 lg:row-start-9 lg:row-span-6',
]

const socialClass =
  'flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[#1e6dda]'

function Socials({ member }: { member: TeamMemberItem }) {
  const links = [
    { href: member.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: member.facebook, Icon: Facebook, label: 'Facebook' },
    { href: member.twitter, Icon: Twitter, label: 'Twitter' },
    { href: member.instagram, Icon: Instagram, label: 'Instagram' },
  ].filter((l) => l.href && l.href !== '#')
  if (links.length === 0) return null
  return (
    <div className="mt-3 flex items-center gap-2">
      {links.map(({ href, Icon, label }) => (
        <Link key={label} href={href!} className={socialClass} aria-label={`${member.name} on ${label}`}>
          <Icon className="h-4 w-4" />
        </Link>
      ))}
    </div>
  )
}

/** Ô ảnh: ảnh phủ kín, chữ nằm ở dải mờ phía dưới nên mặt không bị che. */
function Tile({
  member,
  role,
  itemIndex,
  className,
  lead = false,
  leadLabel,
  position = FACE_POS,
  sizes,
}: {
  member: TeamMemberItem
  role: string
  itemIndex: number
  className: string
  lead?: boolean
  leadLabel?: string
  position?: string
  sizes: string
}) {
  return (
    <div
      data-cms-field="member"
      data-cms-item-index={itemIndex}
      className={`group relative overflow-hidden rounded-[20px] bg-[#1d1d1f] sm:rounded-3xl ${
        lead ? 'shadow-[0_0_0_3px_#1e6dda,0_22px_50px_-20px_rgba(30,109,218,0.6)]' : ''
      } ${className}`}
    >
      <Image
        quality={95}
        src={member.image}
        alt={member.name}
        fill
        sizes={sizes}
        className="scale-[1.08] object-cover transition-transform duration-500 group-hover:scale-[1.13]"
        style={{ objectPosition: position, transformOrigin: '50% 22%' }}
      />
      {/* Dải mờ chỉ ở phần chân ô, đủ đọc chữ mà không làm tối khuôn mặt */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/80 via-black/35 to-transparent sm:h-[38%] lg:h-[34%] lg:from-black/75 lg:via-black/30" />
      {lead && leadLabel && (
        <span className="absolute left-4 top-4 rounded-full bg-[#1e6dda] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white sm:left-5 sm:top-5">
          {leadLabel}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:p-5">
        <h3 className={`font-extrabold leading-tight ${lead ? 'text-2xl sm:text-[28px]' : 'text-lg sm:text-xl'}`}>{member.name}</h3>
        <p className={`mt-1 leading-snug text-[#e5e5ea] ${lead ? 'text-sm sm:text-[15px]' : 'text-[13px]'}`}>{role}</p>
        <Socials member={member} />
      </div>
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
  const entries = members.filter((m) => m.image).map((m) => ({ m, i: members.indexOf(m), role: roleOf(m) }))
  // Lead đặt ở giữa: người đầu tiên có chức danh trưởng nhóm / tư vấn công nghệ; không ai khớp thì lấy người đầu danh sách.
  const leadAt = Math.max(0, entries.findIndex((e) => LEAD_ROLE_RE.test(`${e.m.role.en} ${e.m.role.vi}`)))
  const lead = entries[leadAt]
  const others = entries.filter((_, k) => k !== leadAt)
  const leadLabel = t('Trưởng nhóm', 'Team lead')
  const isBento = others.length === 5

  return (
    <section data-cms-section="team" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-14">
          <span
            data-cms-field="eyebrow"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-[#144c97]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2 data-cms-field="heading" className="text-3xl font-extrabold leading-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-[#1859b8]">{t(content.heading_highlight.vi, content.heading_highlight.en)}</span>
          </h2>
          <p data-cms-field="description" className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {lead && isBento && (
          // Bento: lead là ô cao ở giữa, 4 người hai bên, 1 người dưới lead. Dưới lg: lead trên cùng, 4 ô đôi, ô cuối trải hết hàng.
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:h-[860px] lg:grid-cols-[1fr_1.3fr_1fr] lg:grid-rows-[repeat(14,minmax(0,1fr))] xl:h-[940px]">
            <Tile
              member={lead.m}
              role={lead.role}
              itemIndex={lead.i}
              lead
              leadLabel={leadLabel}
              position={LEAD_POS}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="col-span-2 aspect-[4/5] sm:aspect-[4/3] lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-8 lg:aspect-auto"
            />
            {others.map((e, idx) => (
              <Tile
                key={e.i}
                member={e.m}
                role={e.role}
                itemIndex={e.i}
                position={idx === 4 ? '50% 10%' : FACE_POS}
                sizes="(max-width: 1024px) 50vw, 32vw"
                className={`${idx === 4 ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'} lg:aspect-auto ${BENTO_PLACE[idx]}`}
              />
            ))}
          </div>
        )}

        {lead && !isBento && (
          // Số người khác 5: lead ở giữa phía trên, những người còn lại xếp đều bên dưới.
          <div className="flex flex-col items-center gap-3 sm:gap-3.5">
            <Tile
              member={lead.m}
              role={lead.role}
              itemIndex={lead.i}
              lead
              leadLabel={leadLabel}
              position={LEAD_POS}
              sizes="(max-width: 640px) 100vw, 440px"
              className="aspect-[4/5] w-full max-w-[440px] sm:aspect-[4/3]"
            />
            {others.length > 0 && (
              <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-3.5">
                {others.map((e) => (
                  <Tile
                    key={e.i}
                    member={e.m}
                    role={e.role}
                    itemIndex={e.i}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="aspect-[3/4] w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] lg:w-[calc(25%-11px)]"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA (chỉ hiện khi CMS có nhãn nút) */}
        {(content.cta_label?.vi || content.cta_label?.en) && (
          <div className="mt-14 text-center">
            <Link
              data-cms-field="cta"
              href={content.cta_href}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-all duration-300 hover:gap-3 hover:bg-foreground/90 hover:shadow-lg"
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
