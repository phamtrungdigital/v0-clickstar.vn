'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { slugify, type CaseStudyMetric, type CaseStudyStatus } from '@/lib/cms/case-studies'

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
  status: CaseStudyStatus
  sort_order: number
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
    project_url: input.project_url?.trim() || null,
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
  revalidatePath(`/projects/${payload.slug}`)
  return { ok: true }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('case_studies').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin-cls/projects')
  revalidatePath('/projects')
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
  return { ok: true }
}

export async function createProjectAndRedirect(input: ProjectFormData) {
  const result = await createProject(input)
  if (result.error) return result
  redirect(`/admin-cls/projects/${result.id}/edit`)
}
