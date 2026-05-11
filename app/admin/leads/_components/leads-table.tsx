'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Trash2, ChevronDown } from 'lucide-react'
import type { Lead, LeadStatus } from '@/lib/cms/leads'
import { LEAD_STATUS_LABEL, LEAD_STATUS_COLOR } from '@/lib/cms/leads'
import { updateLeadStatus, deleteLead, updateLeadNotes } from '../actions'

const ALL_STATUS: LeadStatus[] = ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost']

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = leads.filter((lead) => {
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.phone?.includes(q) ||
        lead.company?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const counts: Record<LeadStatus | 'all', number> = {
    all: leads.length,
    new: 0,
    contacted: 0,
    qualified: 0,
    quoted: 0,
    won: 0,
    lost: 0,
  }
  for (const l of leads) counts[l.status]++

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Leads</h1>
          <p className="text-xs text-slate-500">Quản lý khách hàng tiềm năng ({leads.length})</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm tên / email / phone / công ty…"
          className="flex-1 max-w-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1.5">
        <FilterTab
          active={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
          label={`Tất cả (${counts.all})`}
        />
        {ALL_STATUS.map((s) => (
          <FilterTab
            key={s}
            active={filterStatus === s}
            onClick={() => setFilterStatus(s)}
            label={`${LEAD_STATUS_LABEL[s]} (${counts[s]})`}
            badgeColor={LEAD_STATUS_COLOR[s]}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-sm text-slate-500">Không có lead nào khớp filter</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr className="text-left text-[11px] uppercase font-semibold text-slate-500">
                <th className="px-4 py-2.5">Khách hàng</th>
                <th className="px-4 py-2.5">Công ty</th>
                <th className="px-4 py-2.5">Nguồn</th>
                <th className="px-4 py-2.5">Giá trị</th>
                <th className="px-4 py-2.5">Trạng thái</th>
                <th className="px-4 py-2.5">Ngày tạo</th>
                <th className="px-4 py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  label,
  badgeColor,
}: {
  active: boolean
  onClick: () => void
  label: string
  badgeColor?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
        active
          ? 'bg-primary text-white'
          : badgeColor ?? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  )
}

function LeadRow({ lead }: { lead: Lead }) {
  const [isPending, startTransition] = useTransition()
  const [notesOpen, setNotesOpen] = useState(false)
  const [notes, setNotes] = useState(lead.notes ?? '')

  const onStatusChange = (next: LeadStatus) => {
    startTransition(async () => {
      await updateLeadStatus(lead.id, next)
    })
  }

  const onDelete = () => {
    if (!confirm(`Xoá lead "${lead.name}"?`)) return
    startTransition(async () => {
      await deleteLead(lead.id)
    })
  }

  const onSaveNotes = () => {
    startTransition(async () => {
      await updateLeadNotes(lead.id, notes)
      setNotesOpen(false)
    })
  }

  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
        <td className="px-4 py-3">
          <div className="font-medium text-slate-900 dark:text-white">{lead.name}</div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                <Mail className="w-3 h-3" />
                {lead.email}
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                <Phone className="w-3 h-3" />
                {lead.phone}
              </a>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{lead.company || '—'}</td>
        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">{lead.source}</td>
        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
          {lead.value_estimate
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(lead.value_estimate)
            : '—'}
        </td>
        <td className="px-4 py-3">
          <select
            value={lead.status}
            disabled={isPending}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            className={`text-[11px] font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${LEAD_STATUS_COLOR[lead.status]}`}
          >
            {ALL_STATUS.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-xs text-slate-500">
          {new Date(lead.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
            >
              <ChevronDown className={`w-3 h-3 transition-transform inline mr-0.5 ${notesOpen ? 'rotate-180' : ''}`} />
              Ghi chú
            </button>
            <button
              onClick={onDelete}
              disabled={isPending}
              className="p-1.5 hover:bg-red-50 rounded text-red-500"
              title="Xoá lead"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {notesOpen && (
        <tr className="bg-slate-50 dark:bg-slate-900/30">
          <td colSpan={7} className="px-4 py-3 space-y-2">
            {lead.message && (
              <div className="text-xs">
                <span className="font-semibold">Lời nhắn:</span>{' '}
                <span className="text-slate-600 dark:text-slate-300">{lead.message}</span>
              </div>
            )}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ghi chú nội bộ về lead này…"
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
            />
            <button
              onClick={onSaveNotes}
              disabled={isPending}
              className="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
            >
              {isPending ? 'Đang lưu…' : 'Lưu ghi chú'}
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
