'use client'

import { useState, useEffect, useTransition } from 'react'
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'
import type { SiteSettings } from '@/lib/cms/settings'
import { saveSettings, type SettingsUpdate } from '../actions'
import { I18nInput, TextInput } from '@/app/admin-cls/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'
import { PageHeader, SettingsGroup, btn } from '@/components/admin/ui'
import { SaveBar } from '@/components/admin/save-bar'

export function SettingsForm({ initial, codeSection }: { initial: SiteSettings; codeSection?: React.ReactNode }) {
  return (
    <EditLangProvider initial="vi">
      <SettingsFormInner initial={initial} codeSection={codeSection} />
    </EditLangProvider>
  )
}

function SettingsFormInner({ initial, codeSection }: { initial: SiteSettings; codeSection?: React.ReactNode }) {
  const [draft, setDraft] = useState<SettingsUpdate>(stripMeta(initial))
  // Bản đã lưu gần nhất: nút Huỷ đưa form về đây (không về props `initial`, vì props cũ sau khi đã lưu).
  const [baseline, setBaseline] = useState<SettingsUpdate>(stripMeta(initial))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [note, setNote] = useState('')

  const update = <K extends keyof SettingsUpdate>(key: K, value: SettingsUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleCancel = () => {
    setDraft(baseline)
    setStatus('idle')
    setErrorMsg('')
  }

  const handleSave = () => {
    const sent = draft
    startTransition(async () => {
      // Mã tuỳ chỉnh có chỗ lưu riêng (mục Mã tuỳ chỉnh) và mục SEO ghi vào head_code: không gửi lại 3 cột mã cũ ở đây,
      // kẻo ghi đè bản mới hơn bằng bản đã tải lúc mở trang.
      const { head_code: _h, body_start_code: _b, body_end_code: _e, ...rest } = sent
      const result = await saveSettings(rest as SettingsUpdate)
      if (result?.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setBaseline(sent)
        setStatus('saved')
        setErrorMsg('')
        const warn =
          result?.warning === 'tracking_columns_missing'
            ? 'Đã lưu các mục khác. Riêng Mã tracking chưa lưu được vì DB thiếu cột, cần chạy migration trước.'
            : ''
        setNote(warn)
        // Chỉ tắt thông báo "Đã lưu"; nếu trong lúc đó anh đã sửa tiếp (status 'dirty') thì giữ thanh Lưu.
        setTimeout(() => {
          setStatus((s) => (s === 'saved' ? 'idle' : s))
          setNote('')
        }, warn ? 8000 : 3000)
      }
    })
  }

  return (
    <div className="mx-auto max-w-[1080px] pb-28">
      <PageHeader
        title="Cài đặt"
        description="Thông tin chung của website: nhận diện, liên hệ, mạng xã hội, SEO mặc định và kết nối."
        actions={<LangSwitcher />}
      />

      <SettingsGroup title="Nhận diện thương hiệu" description="Logo, biểu tượng ở tab trình duyệt và ảnh hiện khi chia sẻ link website.">
        <div className="space-y-5 [&>div+div]:border-t [&>div+div]:border-[var(--ad-line)] [&>div+div]:pt-5">
          <div>
            <ImagePicker
              label="Logo chính (đầu trang và chân trang)"
              value={draft.logo_url ?? ''}
              onChange={(v) => update('logo_url', v.trim() === '' ? null : v)}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">PNG hoặc SVG ngang, khoảng 180×40px</p>
          </div>
          <div>
            <ImagePicker
              label="Favicon (biểu tượng tab trình duyệt)"
              value={draft.favicon_url ?? ''}
              onChange={(v) => update('favicon_url', v.trim() === '' ? null : v)}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">PNG vuông 32×32 hoặc SVG</p>
          </div>
          <div>
            <ImagePicker
              label="Ảnh chia sẻ mặc định (Facebook, Zalo)"
              value={draft.default_og_image ?? ''}
              onChange={(v) => update('default_og_image', v.trim() === '' ? null : v)}
            />
            <p className="mt-1 text-[12.5px] text-[var(--ad-fg-3)]">JPG hoặc PNG 1200×630</p>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Thông tin website" description="Tên và địa chỉ website, hiện ở tiêu đề tab và khi chia sẻ.">
        <div className="space-y-4">
          <I18nInput label="Tên website" value={draft.site_name} onChange={(v) => update('site_name', v)} />
          <I18nInput label="Tagline" value={draft.tagline} onChange={(v) => update('tagline', v)} />
          {/* Ngôn ngữ không còn chọn ở đây: tiếng Việt ở địa chỉ gốc, tiếng Anh ở /en (xem lib/i18n/locale.ts) */}
          <TextInput label="URL website" value={draft.site_url} onChange={(v) => update('site_url', v)} />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Thông tin liên hệ" description="Hiện ở chân trang và trang Liên hệ.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput label="Email liên hệ" value={draft.contact_email} onChange={(v) => update('contact_email', v)} />
            <TextInput label="Số điện thoại" value={draft.contact_phone} onChange={(v) => update('contact_phone', v)} />
          </div>
          <I18nInput label="Địa chỉ" value={draft.address} onChange={(v) => update('address', v)} />
          <TextInput label="Múi giờ" value={draft.timezone} onChange={(v) => update('timezone', v)} hint="Ví dụ: Asia/Ho_Chi_Minh" />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Mạng xã hội" description="Để trống mục nào thì website ẩn nút của mục đó.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput label="Facebook" value={draft.facebook_url ?? ''} onChange={(v) => update('facebook_url', v.trim() === '' ? null : v)} />
          <TextInput label="Twitter / X" value={draft.twitter_url ?? ''} onChange={(v) => update('twitter_url', v.trim() === '' ? null : v)} />
          <TextInput label="LinkedIn" value={draft.linkedin_url ?? ''} onChange={(v) => update('linkedin_url', v.trim() === '' ? null : v)} />
          <TextInput label="Instagram" value={draft.instagram_url ?? ''} onChange={(v) => update('instagram_url', v.trim() === '' ? null : v)} />
          <TextInput label="YouTube" value={draft.youtube_url ?? ''} onChange={(v) => update('youtube_url', v.trim() === '' ? null : v)} />
          <TextInput
            label="Zalo"
            value={draft.zalo_url ?? ''}
            onChange={(v) => update('zalo_url', v.trim() === '' ? null : v)}
            hint="Ví dụ: https://zalo.me/0383406735"
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title="SEO mặc định" description="Dùng cho các trang chưa có tiêu đề và mô tả SEO riêng. Ảnh chia sẻ mặc định đặt ở mục Nhận diện thương hiệu.">
        <div className="space-y-4">
          <I18nInput
            label="Tiêu đề SEO mặc định"
            value={draft.default_seo_title ?? { vi: '', en: '' }}
            onChange={(v) => update('default_seo_title', v)}
          />
          <I18nInput
            label="Mô tả SEO mặc định"
            multiline
            rows={2}
            value={draft.default_seo_description ?? { vi: '', en: '' }}
            onChange={(v) => update('default_seo_description', v)}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Kết nối CRM" description="Đẩy khách đăng ký ở website sang crm.clickstar.vn.">
        <CrmConnectionSection enabled={draft.crm_sync_enabled} onToggle={(v) => update('crm_sync_enabled', v)} />
      </SettingsGroup>

      {/* Mã tuỳ chỉnh (head, body, footer): quản lý và lưu riêng, xem code-snippets-manager.tsx */}
      <SettingsGroup title="Mã tuỳ chỉnh" description="Thêm mã vào đầu trang, đầu thân và cuối trang. Mục này lưu ngay khi bấm từng nút, không dùng nút Lưu thay đổi.">
        {codeSection}
      </SettingsGroup>

      <SaveBar
        show={status === 'dirty' || status === 'error' || isPending}
        saving={isPending}
        saved={status === 'saved'}
        savedNote={note || undefined}
        error={status === 'error' ? errorMsg : null}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}

type CrmStatus = {
  configured: boolean
  env: { url: boolean; anonKey: boolean; secret: boolean }
  crmHost: string | null
  reachable: boolean
  message: string
}

function CrmConnectionSection({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: (v: boolean) => void
}) {
  const [status, setStatus] = useState<CrmStatus | null>(null)
  const [testing, setTesting] = useState(false)

  const runTest = async () => {
    setTesting(true)
    try {
      const res = await fetch('/api/admin/crm-status', { cache: 'no-store' })
      const data = (await res.json()) as CrmStatus
      // API trả lỗi (hết phiên, lỗi máy chủ) thì không có `env`: coi như không gọi được, kẻo cả trang Cài đặt bị lỗi trắng.
      if (!data?.env) throw new Error('crm-status không hợp lệ')
      setStatus(data)
    } catch {
      setStatus({
        configured: false,
        env: { url: false, anonKey: false, secret: false },
        crmHost: null,
        reachable: false,
        message: 'Không gọi được API kiểm tra.',
      })
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-[13.5px] leading-relaxed text-[var(--ad-fg-3)]">
        Khi khách đăng ký ở form <code className="rounded bg-[var(--ad-fill)] px-1.5 py-0.5 text-[12.5px]">/contact</code>, hệ thống tự tạo hồ sơ khách hàng bên CRM
        (nguồn <strong>Website</strong>, trạng thái <strong>Mới</strong>). Tự động chống trùng theo số điện thoại.
      </p>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-[var(--ad-fill-soft)] px-4 py-3">
        <div className="min-w-0">
          <div className="text-[14.5px] font-medium text-[var(--ad-fg)]">Tự động đẩy lead sang CRM</div>
          <div className="text-[13px] text-[var(--ad-fg-3)]">Tắt thì chỉ lưu lead nội bộ, không tạo hồ sơ bên CRM</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Tự động đẩy lead sang CRM"
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-[28px] w-[48px] flex-none items-center rounded-full transition-colors ${
            enabled ? 'bg-[#34c759]' : 'bg-[rgba(120,120,128,.32)]'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,.25)] transition-transform ${
              enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      <div className="rounded-xl border border-[var(--ad-line)] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[14px] font-medium text-[var(--ad-fg)]">Trạng thái kết nối</span>
          <button type="button" onClick={runTest} disabled={testing} className={btn('secondary', 'sm')}>
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {testing ? 'Đang kiểm tra' : 'Kiểm tra kết nối'}
          </button>
        </div>

        {status === null ? (
          <p className="text-[13px] text-[var(--ad-fg-3)]">Đang kiểm tra…</p>
        ) : (
          <div className="space-y-2.5">
            <div
              className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-[13.5px] ${
                status.reachable ? 'bg-[rgba(52,199,89,.12)] text-[#248a3d]' : 'bg-[rgba(255,59,48,.10)] text-[#d70015]'
              }`}
            >
              {status.reachable ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{status.message}</span>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[13px] text-[var(--ad-fg-2)] sm:grid-cols-3">
              <EnvRow label="CRM URL" ok={status.env.url} extra={status.crmHost} />
              <EnvRow label="Anon key" ok={status.env.anonKey} />
              <EnvRow label="Secret" ok={status.env.secret} />
            </div>

            {!status.configured && (
              <p className="rounded-xl bg-[rgba(255,159,10,.14)] px-3.5 py-2.5 text-[13px] text-[#b25e00]">
                Một số cấu hình CRM còn thiếu. Báo kỹ thuật bổ sung biến môi trường để kích hoạt.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function EnvRow({ label, ok, extra }: { label: string; ok: boolean; extra?: string | null }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#34c759]" /> : <XCircle className="h-3.5 w-3.5 shrink-0 text-[#ff3b30]" />}
      <span className="font-medium">{label}:</span>
      <span className={ok ? 'text-[#248a3d]' : 'text-[#d70015]'}>{ok ? extra || 'OK' : 'thiếu'}</span>
    </div>
  )
}

function stripMeta(s: SiteSettings) {
  const { id: _id, updated_at: _u, ...rest } = s as any
  return rest as SettingsUpdate
}
