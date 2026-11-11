'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  PROJECT_SERVICES,
  caseStudyHasEnglish,
  slugify,
  type CaseStudyMetric,
  type CaseStudyStatus,
  type CaseStudyVerification,
} from '@/lib/cms/case-studies-types'
import { notifyIndexNow } from '@/lib/seo/indexnow'
import { SITE_URL } from '@/lib/seo/site'
import { localizePath } from '@/lib/i18n/locale'

export type ProjectFormData = {
  slug: string
  title_vi: string
  title_en?: string
  client_name?: string
  industry_vi?: string
  industry_en?: string
  summary_vi?: string
  summary_en?: string
  cover_image?: string
  body_vi?: string
  body_en?: string
  metrics: CaseStudyMetric[]
  tags: string[]
  project_url?: string
  /** Tháng bắt đầu / kết thúc dạng YYYY-MM (ô chọn tháng), lưu thành ngày đầu tháng. */
  delivered_from?: string
  delivered_to?: string
  services: string[]
  verifier_name?: string
  verifier_title?: string
  verifier_url?: string
  testimonial_vi?: string
  testimonial_en?: string
  client_credit_url?: string
  verification: CaseStudyVerification
  verified_on?: string
  status: CaseStudyStatus
  sort_order: number
}

const VERIFICATIONS: CaseStudyVerification[] = ['unverified', 'permission', 'confirmed']
/** "2025-03" thành "2025-03-01"; giá trị khác thì null. */
const monthToDate = (v?: string) => (/^\d{4}-\d{2}$/.test(v || '') ? `${v}-01` : null)
/** Chỉ nhận ngày dạng YYYY-MM-DD. */
const isoDate = (v?: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v! : null)
/** Chỉ nhận link http(s). */
const httpUrl = (v?: string) => {
  const u = (v || '').trim()
  return /^https?:\/\/\S+$/i.test(u) ? u : null
}

/** Dự án đã đăng thì báo IndexNow địa chỉ dự án (vi, và en nếu đủ bản dịch, khớp sitemap) cùng trang danh sách Dự án. */
function announce(p: ReturnType<typeof normalize>) {
  if (p.status !== 'published') return
  const path = `/projects/${p.slug}`
  const hasEn = caseStudyHasEnglish({ title_en: p.title_en, summary_en: p.summary_en, body_en: p.body_en })
  notifyIndexNow([
    `${SITE_URL}${localizePath(path, 'vi')}`,
    ...(hasEn ? [`${SITE_URL}${localizePath(path, 'en')}`] : []),
    `${SITE_URL}${localizePath('/projects', 'vi')}`,
    `${SITE_URL}${localizePath('/projects', 'en')}`,
  ])
}

function normalize(input: ProjectFormData) {
  const cleanMetrics = (input.metrics ?? [])
    .map((m) => ({
      label_vi: (m.label_vi || '').trim(),
      label_en: (m.label_en || '').trim() || undefined,
      value: (m.value || '').trim(),
    }))
    .filter((m) => m.label_vi && m.value)

  const cleanTags = (input.tags ?? [])
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase())

  return {
    slug: (input.slug || slugify(input.title_vi)).trim(),
    title_vi: input.title_vi.trim(),
    title_en: input.title_en?.trim() || null,
    client_name: input.client_name?.trim() || null,
    industry_vi: input.industry_vi?.trim() || null,
    industry_en: input.industry_en?.trim() || null,
    summary_vi: input.summary_vi?.trim() || null,
    summary_en: input.summary_en?.trim() || null,
    cover_image: input.cover_image?.trim() || null,
    body_vi: input.body_vi?.trim() || null,
    body_en: input.body_en?.trim() || null,
    metrics: cleanMetrics,
    tags: cleanTags,
    project_url: httpUrl(input.project_url),
    delivered_from: monthToDate(input.delivered_from),
    delivered_to: monthToDate(input.delivered_to),
    services: (input.services ?? []).filter((k) => PROJECT_SERVICES.some((s) => s.key === k)),
    verifier_name: input.verifier_name?.trim() || null,
    verifier_title: input.verifier_title?.trim() || null,
    verifier_url: httpUrl(input.verifier_url),
    testimonial_vi: input.testimonial_vi?.trim() || null,
    testimonial_en: input.testimonial_en?.trim() || null,
    client_credit_url: httpUrl(input.client_credit_url),
    verification: VERIFICATIONS.includes(input.verification) ? input.verification : 'unverified',
    verified_on: isoDate(input.verified_on),
    status: input.status,
    sort_order: Number.isFinite(input.sort_order) ? Math.floor(input.sort_order) : 0,
  }
}

export async function createProject(input: ProjectFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  if (!input.title_vi?.trim()) return { error: 'Tên dự án (VI) là bắt buộc' }

  const payload = { ...normalize(input), created_by: user.id, updated_by: user.id }

  const { data, error } = await supabase
    .from('case_studies')
    .insert(payload)
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin-cls/projects')
  revalidatePath('/projects')
  revalidatePath('/en/projects')
  // Trang dự án công khai là trang tĩnh (ISR): xoá cache dữ liệu dự án để trang danh sách và trang chi tiết dựng lại
  updateTag('case_studies')
  announce(payload)
  return { ok: true, id: data.id }
}

export async function updateProject(id: string, input: ProjectFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  if (!input.title_vi?.trim()) return { error: 'Tên dự án (VI) là bắt buộc' }

  const payload = { ...normalize(input), updated_by: user.id }

  const { error } = await supabase.from('case_studies').update(payload).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin-cls/projects')
  revalidatePath('/projects')
  revalidatePath('/en/projects')
  updateTag('case_studies')
  revalidatePath(`/projects/${payload.slug}`)
  announce(payload)
  return { ok: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_studies').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/projects')
  revalidatePath('/projects')
  revalidatePath('/en/projects')
  updateTag('case_studies')
  return { ok: true }
}

export async function setProjectStatus(id: string, status: CaseStudyStatus) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'not_authenticated' }

  const { error } = await supabase
    .from('case_studies')
    .update({ status, updated_by: user.id })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/projects')
  revalidatePath('/projects')
  revalidatePath('/en/projects')
  updateTag('case_studies')
  return { ok: true }
}

export async function createProjectAndRedirect(input: ProjectFormData) {
  const result = await createProject(input)
  if (result.error) return result
  redirect(`/admin-cls/projects/${result.id}/edit`)
}
