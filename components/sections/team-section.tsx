'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import type { TeamContent, TeamMemberItem } from '@/lib/cms/types'

function TeamCard({
  member,
  role,
  itemIndex,
}: {
  member: TeamMemberItem
  role: string
  itemIndex: number
}) {
  return (
    <div
      data-cms-field="member"
      data-cms-item-index={itemIndex}
      className="group text-center"
    >
      <div className="relative mx-auto w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        <div className="relative w-32 h-32 rounded-full border-4 border-background shadow-lg overflow-hidden group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
          <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
        {member.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{role}</p>

      <div className="flex items-center justify-center gap-2">
        {member.facebook && (
          <Link href={member.facebook} className={socialClass} aria-label={`${member.name} on Facebook`}>
            <Facebook className="w-4 h-4" />
          </Link>
        )}
        {member.twitter && (
          <Link href={member.twitter} className={socialClass} aria-label={`${member.name} on Twitter`}>
            <Twitter className="w-4 h-4" />
          </Link>
        )}
        {member.linkedin && (
          <Link href={member.linkedin} className={socialClass} aria-label={`${member.name} on LinkedIn`}>
            <Linkedin className="w-4 h-4" />
          </Link>
        )}
        {member.instagram && (
          <Link href={member.instagram} className={socialClass} aria-label={`${member.name} on Instagram`}>
            <Instagram className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

const socialClass =
  'w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300'

export function TeamSection({ content }: { content: TeamContent }) {
  const { t } = useLanguage()

  return (
    <section data-cms-section="team" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            data-cms-field="eyebrow"
            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {t(content.eyebrow.vi, content.eyebrow.en)}
          </span>
          <h2
            data-cms-field="heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance"
          >
            {t(content.heading_lead.vi, content.heading_lead.en)}{' '}
            <span className="text-primary">
              {t(content.heading_highlight.vi, content.heading_highlight.en)}
            </span>
          </h2>
          <p
            data-cms-field="description"
            className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            {t(content.description.vi, content.description.en)}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16">
          {content.members.map((member, index) => (
            <TeamCard
              key={index}
              member={member}
              role={t(member.role.vi, member.role.en)}
              itemIndex={index}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            data-cms-field="cta"
            href={content.cta_href}
            className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:gap-3 group"
          >
            {t(content.cta_label.vi, content.cta_label.en)}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
