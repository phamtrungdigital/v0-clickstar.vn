// Pure types — client + server safe

export type TeamMember = {
  id: string
  name: string
  role_vi: string | null
  role_en: string | null
  image: string | null
  bio_vi: string | null
  bio_en: string | null
  linkedin: string | null
  facebook: string | null
  twitter: string | null
  instagram: string | null
  sort_order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

export type TeamMemberFormData = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
