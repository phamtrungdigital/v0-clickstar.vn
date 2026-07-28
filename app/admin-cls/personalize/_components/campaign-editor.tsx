'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, CheckCircle2, AlertCircle, ArrowLeft, Plus, Trash2, Eye } from 'lucide-react'
import type { PersonalizeCampaign } from '@/lib/personalize/campaign-types'
import { createCampaign, updateCampaign, type CampaignFormData } from '../actions'

const POSITIONS = ['bottom-right', 'bottom-left', 'bottom-center', 'top-banner'] as const
const SIZES = ['compact', 'default', 'expanded'] as const
const COLOR_THEMES = ['primary', 'orange', 'dark', 'custom'] as const
const DEVICES = ['all', 'desktop', 'mobile'] as const
const ICONS = ['Sparkles', 'Bot', 'Gift', 'Bell', 'Megaphone', 'Star', 'Heart', 'Rocket', 'Zap']

const THEME_PRESETS: Record<string, { from: string; to: string; button: string }> = {
  primary: { from: '#1B7BFF', to: '#0055d4', button: '#FF6B35' },
  orange: { from: '#FF6B35', to: '#E63946', button: '#1B7BFF' },
  dark: { from: '#1e293b', to: '#6366f1', button: '#FF6B35' },
}

const SERVICE_OPTIONS = [
  'Digital Marketing',
  'Thiết kế Website',
  'Dashboard dữ liệu',
  'Tích hợp AI',
  'AI Automation',
  'CRM & CDP',
  'Phân tích cuộc gọi AI',
  'Tư vấn tổng thể',
]

export function CampaignEditor({
  campaign,
  mode,
}: {
  campaign: PersonalizeCampaign | null
  mode: 'new' | 'edit'
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [draft, setDraft] = useState<CampaignFormData>(() => ({
    name: campaign?.name ?? '',
    enabled: campaign?.enabled ?? true,
    priority: campaign?.priority ?? 50,
    conditions: campaign?.conditions ?? { exclude_current_pages: ['/contact'] },
    content: campaign?.content ?? {
      use_ai: true,
      ai_prompt_hint: '',
      fallback_message: '',
      cta_label: 'Đặt lịch tư vấn miễn phí',
      cta_href: '/contact',
      service_param: 'Tư vấn tổng thể',
      icon: 'Sparkles',
      header_label: 'Gợi ý cho bạn',
    },
    styles: campaign?.styles ?? {
      position: 'bottom-right',
      color_theme: 'primary',
      gradient_from: '#1B7BFF',
      gradient_to: '#0055d4',
      button_color: '#FF6B35',
      size: 'default',
    },
    delay_ms: campaign?.delay_ms ?? 1200,
    auto_dismiss_ms: campaign?.auto_dismiss_ms ?? 0,
    dismiss_days: campaign?.dismiss_days ?? 7,
  }))

  const update = <K extends keyof CampaignFormData>(key: K, value: CampaignFormData[K]) => {
    setDraft((p) => ({ ...p, [key]: value }))
    setStatus('dirty')
  }
  const updateCondition = <K extends keyof CampaignFormData['conditions']>(
    key: K,
    value: CampaignFormData['conditions'][K],
  ) => update('conditions', { ...draft.conditions, [key]: value })
  const updateContent = <K extends keyof CampaignFormData['content']>(
    key: K,
    value: CampaignFormData['content'][K],
  ) => update('content', { ...draft.content, [key]: value })
  const updateStyle = <K extends keyof CampaignFormData['styles']>(
    key: K,
    value: CampaignFormData['styles'][K],
  ) => update('styles', { ...draft.styles, [key]: value })

  const applyThemePreset = (theme: 'primary' | 'orange' | 'dark') => {
    const preset = THEME_PRESETS[theme]
    update('styles', {
      ...draft.styles,
      color_theme: theme,
      gradient_from: preset.from,
      gradient_to: preset.to,
      button_color: preset.button,
    })
  }

  const handleSave = () => {
    startTransition(async () => {
      const result =
        mode === 'new' ? await createCampaign(draft) : await updateCampaign(campaign!.id, draft)

      if ('error' in result && result.error) {
        setStatus('error')
        setErrorMsg(result.error)
        return
      }
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
      if (mode === 'new' && 'id' in result && result.id) {
        router.push(`/admin-cls/personalize/${result.id}/edit`)
      }
    })
  }

  const visitedPagesStr = (draft.conditions.visited_pages ?? []).join('\n')
  const excludePagesStr = (draft.conditions.exclude_current_pages ?? []).join('\n')

  return (
    <div className="space-y-3 max-w-4xl">
      {/* Sticky toolbar */}
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin-cls/personalize" className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {mode === 'new' ? 'Campaign mới' : draft.name || '(không tên)'}
            </h1>
            <p className="text-[11px] text-slate-500">
              Hiển thị banner cá nhân hóa cho khách dựa trên lịch sử truy cập
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'saved' && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã lưu
            </span>
          )}
          {status === 'dirty' && <span className="text-xs text-amber-600">● Chưa lưu</span>}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-red-600" title={errorMsg}>
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg.slice(0, 40)}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>

      {/* Section: Basic */}
      <Section title="Thông tin chung">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_120px] gap-3">
          <div>
            <Label required>Tên campaign (nội bộ)</Label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputCls}
              placeholder="VD: Pricing Visitor"
            />
          </div>
          <div>
            <Label>Priority</Label>
            <input
              type="number"
              value={draft.priority}
              onChange={(e) => update('priority', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Cao trước</p>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <label className="flex items-center gap-2 h-9 mt-0.5">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => update('enabled', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">{draft.enabled ? 'Bật' : 'Tắt'}</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Section: Conditions */}
      <Section title="🎯 Điều kiện hiển thị">
        <div>
          <Label>Đã ghé thăm trang nào (mỗi dòng 1 path)</Label>
          <textarea
            value={visitedPagesStr}
            onChange={(e) =>
              updateCondition(
                'visited_pages',
                e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
              )
            }
            rows={3}
            className={inputCls + ' font-mono text-xs'}
            placeholder="/pricing&#10;/services/ai-integration"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Banner show khi user đã visit ≥ 1 trong các paths này (bỏ trống = không check)
          </p>
        </div>

        <div>
          <Label>KHÔNG hiển thị trên trang (mỗi dòng 1 path)</Label>
          <textarea
            value={excludePagesStr}
            onChange={(e) =>
              updateCondition(
                'exclude_current_pages',
                e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
              )
            }
            rows={2}
            className={inputCls + ' font-mono text-xs'}
            placeholder="/contact&#10;/admin-cls"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label>Tối thiểu N trang đã xem</Label>
            <input
              type="number"
              value={draft.conditions.min_pages_visited ?? 0}
              onChange={(e) => updateCondition('min_pages_visited', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Thiết bị</Label>
            <select
              value={draft.conditions.device ?? 'all'}
              onChange={(e) => updateCondition('device', e.target.value as 'all' | 'desktop' | 'mobile')}
              className={inputCls}
            >
              {DEVICES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Returning visitor</Label>
            <label className="flex items-center gap-2 h-9 mt-0.5">
              <input
                type="checkbox"
                checked={!!draft.conditions.returning_visitor}
                onChange={(e) => updateCondition('returning_visitor', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Chỉ khi quay lại lần 2+</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Section: Content */}
      <Section title="💬 Nội dung banner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label>Header label</Label>
            <input
              type="text"
              value={draft.content.header_label}
              onChange={(e) => updateContent('header_label', e.target.value)}
              className={inputCls}
              placeholder="Gợi ý cho bạn"
            />
          </div>
          <div>
            <Label>Icon (Lucide name)</Label>
            <select
              value={draft.content.icon}
              onChange={(e) => updateContent('icon', e.target.value)}
              className={inputCls}
            >
              {ICONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label>Dùng AI gen message?</Label>
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={draft.content.use_ai}
              onChange={(e) => updateContent('use_ai', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">
              {draft.content.use_ai ? '✓ Claude gen message dựa trên lịch sử' : 'Dùng message tĩnh bên dưới'}
            </span>
          </label>
        </div>

        {draft.content.use_ai && (
          <div>
            <Label>Gợi ý prompt cho AI (tùy chọn)</Label>
            <textarea
              value={draft.content.ai_prompt_hint ?? ''}
              onChange={(e) => updateContent('ai_prompt_hint', e.target.value)}
              rows={2}
              className={inputCls}
              placeholder="VD: Khách vừa xem bảng giá - gợi ý đặt lịch tư vấn để custom gói phù hợp ngân sách"
            />
          </div>
        )}

        <div>
          <Label required={!draft.content.use_ai}>
            Message tĩnh (fallback khi AI fail hoặc use_ai=false)
          </Label>
          <textarea
            value={draft.content.fallback_message}
            onChange={(e) => updateContent('fallback_message', e.target.value)}
            rows={3}
            className={inputCls}
            placeholder="Click Star có thể custom gói báo giá phù hợp ngân sách..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <Label>CTA label</Label>
            <input
              type="text"
              value={draft.content.cta_label}
              onChange={(e) => updateContent('cta_label', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>CTA href</Label>
            <input
              type="text"
              value={draft.content.cta_href}
              onChange={(e) => updateContent('cta_href', e.target.value)}
              className={inputCls + ' font-mono text-xs'}
              placeholder="/contact hoặc https://zalo.me/..."
            />
          </div>
          <div>
            <Label>Service param (?service=)</Label>
            <select
              value={draft.content.service_param ?? ''}
              onChange={(e) => updateContent('service_param', e.target.value)}
              className={inputCls}
            >
              <option value="">— Không append —</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Section: Styles */}
      <Section title="🎨 Giao diện">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <Label>Vị trí</Label>
            <select
              value={draft.styles.position ?? 'bottom-right'}
              onChange={(e) => updateStyle('position', e.target.value as any)}
              className={inputCls}
            >
              {POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Kích thước</Label>
            <select
              value={draft.styles.size ?? 'default'}
              onChange={(e) => updateStyle('size', e.target.value as any)}
              className={inputCls}
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Color theme preset</Label>
            <select
              value={draft.styles.color_theme ?? 'primary'}
              onChange={(e) => {
                const v = e.target.value as 'primary' | 'orange' | 'dark' | 'custom'
                if (v !== 'custom') applyThemePreset(v)
                else updateStyle('color_theme', v)
              }}
              className={inputCls}
            >
              {COLOR_THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
          <div>
            <Label>Gradient from (hex)</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.gradient_from ?? '#1B7BFF'}
                onChange={(e) => updateStyle('gradient_from', e.target.value)}
                className="w-10 h-9 border border-slate-200 rounded"
              />
              <input
                type="text"
                value={draft.styles.gradient_from ?? '#1B7BFF'}
                onChange={(e) => updateStyle('gradient_from', e.target.value)}
                className={inputCls + ' font-mono text-xs'}
              />
            </div>
          </div>
          <div>
            <Label>Gradient to (hex)</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.gradient_to ?? '#0055d4'}
                onChange={(e) => updateStyle('gradient_to', e.target.value)}
                className="w-10 h-9 border border-slate-200 rounded"
              />
              <input
                type="text"
                value={draft.styles.gradient_to ?? '#0055d4'}
                onChange={(e) => updateStyle('gradient_to', e.target.value)}
                className={inputCls + ' font-mono text-xs'}
              />
            </div>
          </div>
          <div>
            <Label>Button color (hex)</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.button_color ?? '#FF6B35'}
                onChange={(e) => updateStyle('button_color', e.target.value)}
                className="w-10 h-9 border border-slate-200 rounded"
              />
              <input
                type="text"
                value={draft.styles.button_color ?? '#FF6B35'}
                onChange={(e) => updateStyle('button_color', e.target.value)}
                className={inputCls + ' font-mono text-xs'}
              />
            </div>
          </div>
        </div>

        {/* Visual preview */}
        <div className="mt-3 p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-semibold">
            🔍 Live Preview
          </div>
          <div
            className="max-w-[360px] mx-auto bg-white rounded-2xl shadow-2xl border-2 overflow-hidden"
            style={{ borderColor: draft.styles.gradient_from }}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${draft.styles.gradient_from} 0%, ${draft.styles.gradient_to} 100%)`,
              }}
            >
              <div className="text-white">
                <div className="text-sm font-bold">Click Star</div>
                <div className="text-[10px] uppercase tracking-widest opacity-85 font-semibold">
                  {draft.content.header_label}
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-foreground mb-4">
                {draft.content.fallback_message || '(message ở đây)'}
              </p>
              <button
                className="w-full text-white text-sm font-bold py-3 rounded-full"
                style={{ backgroundColor: draft.styles.button_color }}
              >
                {draft.content.cta_label}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Frequency + Display timing */}
      <Section title="⏱ Tần suất + thời gian hiển thị">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label>Delay xuất hiện (ms)</Label>
            <input
              type="number"
              min={0}
              step={100}
              value={draft.delay_ms}
              onChange={(e) => update('delay_ms', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Mặc định 1200ms (1.2s sau khi vào trang)</p>
          </div>
          <div>
            <Label>Tự đóng sau (ms)</Label>
            <input
              type="number"
              min={0}
              step={1000}
              value={draft.auto_dismiss_ms}
              onChange={(e) => update('auto_dismiss_ms', parseInt(e.target.value) || 0)}
              className={inputCls}
              placeholder="0 = không tự đóng"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              {draft.auto_dismiss_ms === 0
                ? '0 = giữ mãi tới khi user dismiss'
                : `Tự đóng sau ${(draft.auto_dismiss_ms / 1000).toFixed(1)}s`}
            </p>
          </div>
          <div>
            <Label>Ẩn lại sau dismiss (ngày)</Label>
            <input
              type="number"
              min={1}
              value={draft.dismiss_days}
              onChange={(e) => update('dismiss_days', parseInt(e.target.value) || 7)}
              className={inputCls}
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Mặc định 7 ngày</p>
          </div>
        </div>

        {/* Quick presets cho auto_dismiss */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500">Presets nhanh tự đóng:</span>
          {[
            { label: 'Không tự đóng', ms: 0 },
            { label: '8s', ms: 8000 },
            { label: '15s', ms: 15000 },
            { label: '30s', ms: 30000 },
            { label: '1 phút', ms: 60000 },
          ].map((p) => (
            <button
              key={p.ms}
              type="button"
              onClick={() => update('auto_dismiss_ms', p.ms)}
              className={`px-2 py-0.5 rounded ${
                draft.auto_dismiss_ms === p.ms
                  ? 'bg-primary text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary'

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h2>
      {children}
    </div>
  )
}
