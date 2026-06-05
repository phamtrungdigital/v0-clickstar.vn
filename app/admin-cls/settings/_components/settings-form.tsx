'use client'

import { useState, useEffect, useTransition } from 'react'
import { Save, CheckCircle2, AlertCircle, Globe, Phone, Share2, Image as ImageIcon, Code2, Database, Loader2, RefreshCw, XCircle } from 'lucide-react'
import type { SiteSettings } from '@/lib/cms/settings'
import { saveSettings, type SettingsUpdate } from '../actions'
import { I18nInput, TextInput } from '@/app/admin-cls/pages/[slug]/edit/_components/i18n-input'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import { EditLangProvider, LangSwitcher } from '@/lib/cms/edit-lang-context'

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  return (
    <EditLangProvider initial="vi">
      <SettingsFormInner initial={initial} />
    </EditLangProvider>
  )
}

function SettingsFormInner({ initial }: { initial: SiteSettings }) {
  const [draft, setDraft] = useState<SettingsUpdate>(stripMeta(initial))
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'saved' | 'error' | 'dirty'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = <K extends keyof SettingsUpdate>(key: K, value: SettingsUpdate[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setStatus('dirty')
  }

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSettings(draft)
      if (result?.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('saved')
        if (result?.warning === 'tracking_columns_missing') {
          setErrorMsg('Đã lưu các mục khác. Riêng Mã tracking chưa lưu được vì DB thiếu cột — cần chạy migration trước.')
        }
        setTimeout(() => {
          setStatus('idle')
          setErrorMsg('')
        }, 4000)
      }
    })
  }

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="sticky top-11 z-20 -mx-3 lg:-mx-4 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">Cài đặt</h1>
          <p className="text-[11px] text-slate-500">Thông tin chung của website</p>
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher />

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
              Lỗi
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Branding */}
      <Section icon={<ImageIcon className="w-4 h-4 text-slate-400" />} title="Branding (Logo / Favicon / OG)">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div>
            <ImagePicker
              label="Logo chính (header + footer)"
              value={draft.logo_url ?? ''}
              onChange={(v) => update('logo_url', v.trim() === '' ? null : v)}
            />
            <p className="text-[10px] text-slate-500 mt-1">PNG/SVG ngang, ~180×40px</p>
          </div>
          <div>
            <ImagePicker
              label="Favicon (tab browser)"
              value={draft.favicon_url ?? ''}
              onChange={(v) => update('favicon_url', v.trim() === '' ? null : v)}
            />
            <p className="text-[10px] text-slate-500 mt-1">PNG vuông 32×32 hoặc SVG</p>
          </div>
          <div>
            <ImagePicker
              label="Default OG image (social share)"
              value={draft.default_og_image ?? ''}
              onChange={(v) => update('default_og_image', v.trim() === '' ? null : v)}
            />
            <p className="text-[10px] text-slate-500 mt-1">JPG/PNG 1200×630</p>
          </div>
        </div>
      </Section>

      {/* General info */}
      <Section icon={<Globe className="w-4 h-4 text-slate-400" />} title="Thông tin website">
        <I18nInput label="Tên website" value={draft.site_name} onChange={(v) => update('site_name', v)} />
        <I18nInput label="Tagline" value={draft.tagline} onChange={(v) => update('tagline', v)} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="URL website" value={draft.site_url} onChange={(v) => update('site_url', v)} />
          <TextInput
            label="Ngôn ngữ mặc định"
            value={draft.default_language}
            onChange={(v) => update('default_language', (v === 'en' ? 'en' : 'vi') as 'vi' | 'en')}
            hint="vi hoặc en"
          />
        </div>
      </Section>

      {/* Contact */}
      <Section icon={<Phone className="w-4 h-4 text-slate-400" />} title="Thông tin liên hệ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="Email liên hệ" value={draft.contact_email} onChange={(v) => update('contact_email', v)} />
          <TextInput label="Số điện thoại" value={draft.contact_phone} onChange={(v) => update('contact_phone', v)} />
        </div>
        <I18nInput label="Địa chỉ" value={draft.address} onChange={(v) => update('address', v)} />
        <TextInput label="Múi giờ" value={draft.timezone} onChange={(v) => update('timezone', v)} hint="VD: Asia/Ho_Chi_Minh" />
      </Section>

      {/* Social */}
      <Section icon={<Share2 className="w-4 h-4 text-slate-400" />} title="Mạng xã hội">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <TextInput label="Facebook URL" value={draft.facebook_url ?? ''} onChange={(v) => update('facebook_url', v.trim() === '' ? null : v)} />
          <TextInput label="Twitter / X URL" value={draft.twitter_url ?? ''} onChange={(v) => update('twitter_url', v.trim() === '' ? null : v)} />
          <TextInput label="LinkedIn URL" value={draft.linkedin_url ?? ''} onChange={(v) => update('linkedin_url', v.trim() === '' ? null : v)} />
          <TextInput label="Instagram URL" value={draft.instagram_url ?? ''} onChange={(v) => update('instagram_url', v.trim() === '' ? null : v)} />
          <TextInput label="YouTube URL" value={draft.youtube_url ?? ''} onChange={(v) => update('youtube_url', v.trim() === '' ? null : v)} />
          <TextInput
            label="Zalo URL"
            value={draft.zalo_url ?? ''}
            onChange={(v) => update('zalo_url', v.trim() === '' ? null : v)}
            hint="VD: https://zalo.me/0977713428 — để trống sẽ ẩn nút Zalo trên website"
          />
        </div>
      </Section>

      {/* Default SEO */}
      <Section title="Default SEO (cho các trang không override)">
        <I18nInput
          label="Default Meta Title"
          value={draft.default_seo_title ?? { vi: '', en: '' }}
          onChange={(v) => update('default_seo_title', v)}
        />
        <I18nInput
          label="Default Meta Description"
          multiline
          rows={2}
          value={draft.default_seo_description ?? { vi: '', en: '' }}
          onChange={(v) => update('default_seo_description', v)}
        />
        <p className="text-[10px] text-slate-500">
          OG image mặc định: cấu hình ở section "Branding" phía trên.
        </p>
      </Section>

      {/* Tracking / custom code */}
      <Section icon={<Code2 className="w-4 h-4 text-slate-400" />} title="Mã tracking / Code tuỳ chỉnh">
        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-[11px] text-blue-800 leading-relaxed">
          <strong>Dán mã của bên thứ 3 vào đây</strong> (Google Tag Manager, GA4, Facebook
          Pixel, TikTok Pixel, thẻ xác minh website…). Mã chạy trên <strong>toàn bộ website</strong>{' '}
          ngay sau khi Lưu. Paste nguyên đoạn <code className="bg-blue-100 px-1 rounded">&lt;script&gt;…&lt;/script&gt;</code> hoặc <code className="bg-blue-100 px-1 rounded">&lt;meta&gt;</code> mà nhà cung cấp đưa.
          <br />
          <span className="text-amber-700">⚠ Lưu ý: chỉ dán mã từ nguồn anh tin tưởng — code chạy trực tiếp trên trình duyệt khách.</span>
        </div>

        <CodeArea
          label="① Mã Header"
          badge="GTM · GA4 · FB Pixel · Verification"
          hint="Đặt đầu trang (sát thẻ <head>). Dùng cho Google Tag Manager (đoạn head), GA4 gtag, Facebook Pixel, thẻ xác minh Google/Facebook."
          value={draft.head_code ?? ''}
          onChange={(v) => update('head_code', v.trim() === '' ? null : v)}
          placeholder={'<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){...})(window,document,...);</script>\n<!-- End Google Tag Manager -->'}
        />

        <CodeArea
          label="② Mã Body"
          badge="GTM noscript · Chat widget"
          hint="Đặt ngay đầu <body>, sau header. Dùng cho đoạn <noscript> của GTM, widget chat (Messenger, Zalo, Tawk…)."
          value={draft.body_start_code ?? ''}
          onChange={(v) => update('body_start_code', v.trim() === '' ? null : v)}
          placeholder={'<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX"...></iframe></noscript>'}
        />

        <CodeArea
          label="③ Mã Footer"
          badge="Script defer · Remarketing"
          hint="Đặt cuối <body>. Dùng cho script chạy sau cùng, mã remarketing, analytics phụ không cần load sớm."
          value={draft.body_end_code ?? ''}
          onChange={(v) => update('body_end_code', v.trim() === '' ? null : v)}
          placeholder={'<!-- Script chạy cuối trang -->\n<script defer src="..."></script>'}
        />
      </Section>

      {/* Kết nối CRM */}
      <Section icon={<Database className="w-4 h-4 text-slate-400" />} title="Kết nối CRM (crm.clickstar.vn)">
        <CrmConnectionSection
          enabled={draft.crm_sync_enabled}
          onToggle={(v) => update('crm_sync_enabled', v)}
        />
      </Section>
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
      <p className="text-xs text-slate-500 leading-relaxed">
        Khi khách đăng ký ở form <code className="bg-slate-100 px-1 rounded">/contact</code>, hệ thống
        tự tạo hồ sơ khách hàng bên CRM (nguồn <strong>"Website"</strong>, trạng thái{' '}
        <strong>"Mới"</strong>). Tự động chống trùng theo số điện thoại.
      </p>

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div>
          <div className="text-sm font-medium text-slate-900">Tự động đẩy lead sang CRM</div>
          <div className="text-[11px] text-slate-500">
            Tắt = chỉ lưu lead nội bộ, không tạo hồ sơ CRM
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
          aria-pressed={enabled}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="p-3 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Trạng thái kết nối
          </span>
          <button
            type="button"
            onClick={runTest}
            disabled={testing}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-primary border border-primary/30 rounded hover:bg-primary/5 disabled:opacity-50"
          >
            {testing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            {testing ? 'Đang test…' : 'Test kết nối'}
          </button>
        </div>

        {status === null ? (
          <p className="text-xs text-slate-400">Đang kiểm tra…</p>
        ) : (
          <div className="space-y-2">
            <div
              className={`flex items-start gap-2 px-3 py-2 rounded-md text-xs ${
                status.reachable
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {status.reachable ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-px" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0 mt-px" />
              )}
              <span>{status.message}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
              <EnvRow label="CRM URL" ok={status.env.url} extra={status.crmHost} />
              <EnvRow label="Anon key" ok={status.env.anonKey} />
              <EnvRow label="Secret" ok={status.env.secret} />
            </div>

            {!status.configured && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
                ⚠ Một số cấu hình CRM còn thiếu. Báo kỹ thuật bổ sung biến môi trường để kích hoạt.
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
      {ok ? (
        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
      )}
      <span className="font-medium">{label}:</span>
      <span className={ok ? 'text-emerald-600' : 'text-red-500'}>
        {ok ? extra || 'OK' : 'thiếu'}
      </span>
    </div>
  )
}

function CodeArea({
  label,
  badge,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string
  badge: string
  hint: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-medium text-slate-700">{label}</label>
        <span className="text-[9px] uppercase tracking-wide font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
          {badge}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        rows={5}
        className="w-full px-3 py-2 text-[12px] font-mono leading-relaxed border border-slate-300 rounded bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-y"
      />
      <p className="text-[10px] text-slate-500 mt-1">{hint}</p>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function stripMeta(s: SiteSettings) {
  const { id: _id, updated_at: _u, ...rest } = s as any
  return rest as SettingsUpdate
}
