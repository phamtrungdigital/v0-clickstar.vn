'use client'

import { type ReactNode } from 'react'

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
  tag: string
  iconBgColor?: string
  tagColor?: string
}

export function ServiceCard({ 
  icon, 
  title, 
  description, 
  tag, 
  iconBgColor = 'bg-blue-50',
  tagColor = 'bg-blue-50 text-blue-600'
}: ServiceCardProps) {
  return (
    <div className="group bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Icon */}
      <div className={`w-14 h-14 ${iconBgColor} rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-5">
        {description}
      </p>
      
      {/* Tag Badge */}
      <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${tagColor}`}>
        {tag}
      </span>
    </div>
  )
}
