'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { PersonalizeCampaign } from '@/lib/personalize/campaign-types'
import { EditorBar, SaveStatus, SectionCard, btn, fieldInputClass, fieldLabelClass } from '@/components/admin/ui'
import { Segmented } from '@/components/admin/segmented'
import { Switch } from '@/components/admin/switch'
import { createCampaign, updateCampaign, type CampaignFormData } from '../actions'

const POSITIONS = ['bottom-right', 'bottom-left', 'bottom-center', 'top-banner'] as const
const SIZES = ['compact', 'default', 'expanded'] as const
const COLOR_THEMES = ['primary', 'orange', 'dark', 'custom'] as const
const DEVICES = ['all', 'desktop', 'mobile'] as const
const POSITION_LABEL: Record<string, string> = {
  'bottom-right': 'Góc dưới phải',
  'bottom-left': 'Góc dưới trái',
  'bottom-center': 'Giữa phía dưới',
  'top-banner': 'Dải đầu trang',
}
const SIZE_LABEL: Record<string, string> = { compact: 'Gọn', default: 'Mặc định', expanded: 'Rộng' }
const THEME_LABEL: Record<string, string> = { primary: 'Xanh thương hiệu', orange: 'Cam', dark: 'Tối', custom: 'Tự chọn màu' }
const DEVICE_LABEL: Record<string, string> = { all: 'Mọi thiết bị', desktop: 'Máy tính', mobile: 'Điện thoại' }
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
    <div>
      <EditorBar
        backHref="/admin-cls/personalize"
        title={mode === 'new' ? 'Chiến dịch mới' : draft.name || '(không tên)'}
        subtitle="Banner cá nhân hóa hiện cho khách dựa trên các trang họ đã xem"
      >
        <SaveStatus status={status} errorMsg={errorMsg} />
        <button onClick={handleSave} disabled={isPending} className={btn('primary')}>
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isPending ? 'Đang lưu' : 'Lưu'}
        </button>
      </EditorBar>

      <div className="mx-auto max-w-4xl space-y-4">
      {/* Section: Basic */}
      <Section title="Thông tin chung">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_120px] gap-3">
          <div>
            <Label required>Tên chiến dịch (chỉ dùng nội bộ)</Label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputCls}
              placeholder="VD: Pricing Visitor"
            />
          </div>
          <div>
            <Label>Độ ưu tiên</Label>
            <input
              type="number"
              value={draft.priority}
              onChange={(e) => update('priority', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">Số cao hiện trước</p>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <div className="mt-0.5 flex h-9 items-center gap-2.5">
              <Switch checked={draft.enabled} onChange={(v) => update('enabled', v)} label="Bật chiến dịch" />
              <span className="text-[14px] text-[var(--ad-fg)]">{draft.enabled ? 'Bật' : 'Tắt'}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Conditions */}
      <Section title="Điều kiện hiển thị">
        <div>
          <Label>Khách đã xem trang nào (mỗi dòng một đường dẫn)</Label>
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
          <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
            Banner hiện khi khách đã xem ít nhất một trong các trang này. Để trống thì không kiểm tra.
          </p>
        </div>

        <div>
          <Label>Không hiện ở trang nào (mỗi dòng một đường dẫn)</Label>
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
            <Label>Số trang đã xem tối thiểu</Label>
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
                  {DEVICE_LABEL[d]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Khách quay lại</Label>
            <div className="mt-0.5 flex h-9 items-center gap-2.5">
              <Switch
                checked={!!draft.conditions.returning_visitor}
                onChange={(v) => updateCondition('returning_visitor', v)}
                label="Chỉ hiện khi khách quay lại từ lần thứ hai"
              />
              <span className="text-[14px] text-[var(--ad-fg)]">Chỉ từ lần thứ hai trở đi</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Section: Content */}
      <Section title="Nội dung banner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <Label>Dòng nhỏ trên đầu banner</Label>
            <input
              type="text"
              value={draft.content.header_label}
              onChange={(e) => updateContent('header_label', e.target.value)}
              className={inputCls}
              placeholder="Gợi ý cho bạn"
            />
          </div>
          <div>
            <Label>Biểu tượng</Label>
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
          <Label>Nhờ AI viết lời nhắn</Label>
          <div className="mt-1 flex items-center gap-2.5">
            <Switch checked={draft.content.use_ai} onChange={(v) => updateContent('use_ai', v)} label="Nhờ AI viết lời nhắn" />
            <span className="text-[14px] text-[var(--ad-fg)]">
              {draft.content.use_ai ? 'Claude viết lời nhắn dựa trên các trang khách đã xem' : 'Dùng lời nhắn cố định bên dưới'}
            </span>
          </div>
        </div>

        {draft.content.use_ai && (
          <div>
            <Label>Gợi ý thêm cho AI (không bắt buộc)</Label>
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
          <Label required={!draft.content.use_ai}>Lời nhắn cố định (dùng khi AI lỗi hoặc khi tắt AI)</Label>
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
            <Label>Chữ trên nút</Label>
            <input
              type="text"
              value={draft.content.cta_label}
              onChange={(e) => updateContent('cta_label', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <Label>Đường dẫn của nút</Label>
            <input
              type="text"
              value={draft.content.cta_href}
              onChange={(e) => updateContent('cta_href', e.target.value)}
              className={inputCls + ' font-mono text-xs'}
              placeholder="/contact hoặc https://zalo.me/..."
            />
          </div>
          <div>
            <Label>Dịch vụ gắn kèm (?service=)</Label>
            <select
              value={draft.content.service_param ?? ''}
              onChange={(e) => updateContent('service_param', e.target.value)}
              className={inputCls}
            >
              <option value="">Không gắn kèm</option>
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
      <Section title="Giao diện">
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
                  {POSITION_LABEL[p]}
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
                  {SIZE_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Bộ màu có sẵn</Label>
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
                  {THEME_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 rounded-xl border border-[var(--ad-line)] bg-[var(--ad-fill-soft)] p-4 sm:grid-cols-3">
          <div>
            <Label>Màu đầu của dải chuyển sắc</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.gradient_from ?? '#1B7BFF'}
                onChange={(e) => updateStyle('gradient_from', e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-lg border border-[var(--ad-line-2)] bg-transparent p-0.5"
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
            <Label>Màu cuối của dải chuyển sắc</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.gradient_to ?? '#0055d4'}
                onChange={(e) => updateStyle('gradient_to', e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-lg border border-[var(--ad-line-2)] bg-transparent p-0.5"
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
            <Label>Màu nút</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={draft.styles.button_color ?? '#FF6B35'}
                onChange={(e) => updateStyle('button_color', e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-lg border border-[var(--ad-line-2)] bg-transparent p-0.5"
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
        <div className="mt-3 rounded-2xl bg-[var(--ad-fill)] p-5">
          <div className="mb-3 text-[13px] font-medium text-[var(--ad-fg-3)]">Xem trước</div>
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
      <Section title="Tần suất và thời gian hiển thị">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label>Hiện sau (ms)</Label>
            <input
              type="number"
              min={0}
              step={100}
              value={draft.delay_ms}
              onChange={(e) => update('delay_ms', parseInt(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">Mặc định 1200ms, tức 1,2 giây sau khi khách vào trang</p>
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
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">
              {draft.auto_dismiss_ms === 0
                ? '0 nghĩa là giữ đến khi khách tự đóng'
                : `Tự đóng sau ${(draft.auto_dismiss_ms / 1000).toFixed(1)} giây`}
            </p>
          </div>
          <div>
            <Label>Ẩn lại sau khi khách đóng (ngày)</Label>
            <input
              type="number"
              min={1}
              value={draft.dismiss_days}
              onChange={(e) => update('dismiss_days', parseInt(e.target.value) || 7)}
              className={inputCls}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">Mặc định 7 ngày</p>
          </div>
        </div>

        {/* Chọn nhanh thời gian tự đóng */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[13px] text-[var(--ad-fg-3)]">Chọn nhanh thời gian tự đóng:</span>
          <Segmented
            ariaLabel="Chọn nhanh thời gian tự đóng"
            value={String(draft.auto_dismiss_ms)}
            onChange={(v) => update('auto_dismiss_ms', Number(v))}
            options={[
              { id: '0', label: 'Không tự đóng' },
              { id: '8000', label: '8 giây' },
              { id: '15000', label: '15 giây' },
              { id: '30000', label: '30 giây' },
              { id: '60000', label: '1 phút' },
            ]}
          />
        </div>
      </Section>
      </div>
    </div>
  )
}

const inputCls = fieldInputClass

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={fieldLabelClass}>
      {children}
      {required && <span className="ml-0.5 text-[#d70015]">*</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SectionCard title={title} bodyClassName="space-y-3.5 px-5 pb-5 pt-3">
      {children}
    </SectionCard>
  )
}
