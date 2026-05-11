// Browser-safe types & constants for leads.
// (Server-only queries live in `lib/cms/leads.ts` and import next/headers.)

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost'

export type Lead = {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  message: string | null
  source: string
  status: LeadStatus
  value_estimate: number | null
  notes: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  qualified: 'Đủ điều kiện',
  quoted: 'Đã báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

export const LEAD_STATUS_COLOR: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-purple-100 text-purple-700',
  quoted: 'bg-cyan-100 text-cyan-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-slate-200 text-slate-600',
}
