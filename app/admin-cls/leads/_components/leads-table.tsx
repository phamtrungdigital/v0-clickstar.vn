'use client'

import { useState, useTransition } from 'react'
import { Mail, Phone, Trash2, ChevronDown, Search, Users } from 'lucide-react'
import type { Lead, LeadStatus } from '@/lib/cms/leads-shared'
import { LEAD_STATUS_LABEL } from '@/lib/cms/leads-shared'
import { Card, EmptyState, PageHeader, Toolbar, btn, fieldInputClass, searchInputClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import { updateLeadStatus, deleteLead, updateLeadNotes } from '../actions'

const ALL_STATUS: LeadStatus[] = ['new', 'contacted', 'qualified', 'quoted', 'won', 'lost']

/** Màu nhãn trạng thái: mỗi trạng thái một sắc riêng nhưng cùng độ nhạt, chữ đủ tương phản. */
const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'bg-[var(--ad-accent-soft)] text-[var(--ad-accent)]',
  contacted: 'bg-[rgba(255,159,10,.16)] text-[#b25e00]',
  qualified: 'bg-[rgba(175,82,222,.14)] text-[#8944ab]',
  quoted: 'bg-[rgba(50,173,230,.16)] text-[#0a6e9e]',
  won: 'bg-[rgba(52,199,89,.14)] text-[#248a3d]',
  lost: 'bg-[var(--ad-fill)] text-[var(--ad-fg-3)]',
}

const ICON_BTN =
  'grid h-8 w-8 place-items-center rounded-full text-[var(--ad-fg-3)] transition-colors hover:bg-[var(--ad-fill)] hover:text-[var(--ad-fg)] disabled:opacity-50'

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
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Leads" description={`Khách hàng tiềm năng đã để lại thông tin, hiện có ${leads.length} lead.`} />

      <Toolbar>
        <Segmented
          ariaLabel="Lọc theo trạng thái"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { id: 'all', label: 'Tất cả', count: counts.all },
            ...ALL_STATUS.map((s) => ({ id: s, label: LEAD_STATUS_LABEL[s], count: counts[s] })),
          ]}
        />
        <label className="relative ml-auto block w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ad-fg-3)]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại, công ty"
            aria-label="Tìm lead"
            className={searchInputClass + ' w-full pl-9'}
          />
        </label>
      </Toolbar>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Users className="h-5 w-5" />} title="Không có lead nào khớp bộ lọc" />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-[var(--ad-line)] text-left">
                  <th className="px-5 py-3">Khách hàng</th>
                  <th className="px-3 py-3">Công ty</th>
                  <th className="px-3 py-3">Nguồn</th>
                  <th className="px-3 py-3">Giá trị dự kiến</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3">Ngày tạo</th>
                  <th className="px-5 py-3 text-right">
                    <span className="sr-only">Thao tác</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
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
      <tr className="border-t border-[var(--ad-line)] first:border-t-0">
        <td className="px-5 py-3">
          <div className="text-[14.5px] font-medium text-[var(--ad-fg)]">{lead.name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-[var(--ad-fg-3)]">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 hover:text-[var(--ad-accent)]">
                <Mail className="h-3.5 w-3.5" />
                {lead.email}
              </a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 hover:text-[var(--ad-accent)]">
                <Phone className="h-3.5 w-3.5" />
                {lead.phone}
              </a>
            )}
          </div>
        </td>
        <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{lead.company || '—'}</td>
        <td className="px-3 py-3 text-[13.5px] text-[var(--ad-fg-2)]">{lead.source}</td>
        <td className="whitespace-nowrap px-3 py-3 text-[13.5px] tabular-nums text-[var(--ad-fg-2)]">
          {lead.value_estimate
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(lead.value_estimate)
            : '—'}
        </td>
        <td className="px-3 py-3">
          <select
            value={lead.status}
            disabled={isPending}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
            aria-label={`Trạng thái của ${lead.name}`}
            className={`cursor-pointer !rounded-full !border-transparent px-3 py-1 text-[12.5px] font-medium ${STATUS_STYLE[lead.status]}`}
          >
            {ALL_STATUS.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[var(--ad-fg-3)]">
          {new Date(lead.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </td>
        <td className="px-5 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => setNotesOpen((v) => !v)} aria-expanded={notesOpen} className={btn('ghost', 'sm')}>
              Ghi chú
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${notesOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={onDelete}
              disabled={isPending}
              className={ICON_BTN + ' hover:!text-[#d70015]'}
              title="Xoá lead"
              aria-label={`Xoá lead ${lead.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {notesOpen && (
        <tr className="bg-[var(--ad-fill-soft)]">
          <td colSpan={7} className="space-y-2.5 px-5 py-4">
            {lead.message && (
              <div className="text-[13.5px]">
                <span className="font-medium text-[var(--ad-fg)]">Lời nhắn:</span>{' '}
                <span className="text-[var(--ad-fg-2)]">{lead.message}</span>
              </div>
            )}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ghi chú nội bộ về lead này"
              className={fieldInputClass}
            />
            <button onClick={onSaveNotes} disabled={isPending} className={btn('primary', 'sm')}>
              {isPending ? 'Đang lưu' : 'Lưu ghi chú'}
            </button>
          </td>
        </tr>
      )}
    </>
  )
}
