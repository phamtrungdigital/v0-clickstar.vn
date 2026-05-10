'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram, ArrowRight } from 'lucide-react'
import { useLanguage, type Language } from '@/contexts/language-context'

interface TeamMember {
  name: string
  role: string
  image: string
  social: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
}

const teamMembersData: Record<Language, TeamMember[]> = {
  vi: [
    { name: 'Nguyễn Văn Minh', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Trần Thị Hương', role: 'Giám đốc Marketing', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Lê Hoàng Nam', role: 'Trưởng phòng Kỹ thuật', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Phạm Thị Lan', role: 'Quản lý giải pháp AI', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } }
  ],
  en: [
    { name: 'Nguyen Van Minh', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Tran Thi Huong', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Le Hoang Nam', role: 'Technical Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } },
    { name: 'Pham Thi Lan', role: 'AI Solutions Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' } }
  ]
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group text-center">
      {/* Avatar */}
      <div className="relative mx-auto w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        <div className="relative w-32 h-32 rounded-full border-4 border-background shadow-lg overflow-hidden group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Name & Role */}
      <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
        {member.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{member.role}</p>

      {/* Social Icons */}
      <div className="flex items-center justify-center gap-2">
        {member.social.facebook && (
          <Link
            href={member.social.facebook}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label={`${member.name} on Facebook`}
          >
            <Facebook className="w-4 h-4" />
          </Link>
        )}
        {member.social.twitter && (
          <Link
            href={member.social.twitter}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label={`${member.name} on Twitter`}
          >
            <Twitter className="w-4 h-4" />
          </Link>
        )}
        {member.social.linkedin && (
          <Link
            href={member.social.linkedin}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label={`${member.name} on LinkedIn`}
          >
            <Linkedin className="w-4 h-4" />
          </Link>
        )}
        {member.social.instagram && (
          <Link
            href={member.social.instagram}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            aria-label={`${member.name} on Instagram`}
          >
            <Instagram className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

export function TeamSection() {
  const { language, t } = useLanguage()
  const teamMembers = teamMembersData[language]

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {t('Đội ngũ của chúng tôi', 'Our Team')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-4 text-balance">
            {t('Gặp gỡ', 'Meet')}{' '}
            <span className="text-primary">{t('các chuyên gia', 'our experts')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t(
              'Đội ngũ chuyên gia giàu kinh nghiệm luôn sẵn sàng đồng hành cùng doanh nghiệp của bạn trong hành trình chuyển đổi số.',
              'Our experienced team of experts is always ready to accompany your business on the digital transformation journey.'
            )}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-16">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="#careers"
            className="inline-flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:gap-3 group"
          >
            {t('Gia nhập đội ngũ chúng tôi', 'Join our team')}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
