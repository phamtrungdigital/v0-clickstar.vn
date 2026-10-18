'use client'

import { useActionState, useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { submitContactForm, type ContactFormState } from '../actions'

// value gửi đi (s.vi) giữ nguyên tiếng Việt để không lệch dữ liệu lead/CRM giữa 2 ngôn ngữ —
// chỉ label hiển thị được dịch qua t(s.vi, s.en).
const SERVICES: { vi: string; en: string }[] = [
  { vi: 'Digital Marketing', en: 'Digital Marketing' },
  { vi: 'Thiết kế Website', en: 'Website Design' },
  { vi: 'Dashboard dữ liệu', en: 'Data Dashboards' },
  { vi: 'Tích hợp AI', en: 'AI Integration' },
  { vi: 'AI Automation', en: 'AI Automation' },
  { vi: 'CRM & CDP', en: 'CRM & CDP' },
  { vi: 'Phân tích cuộc gọi AI', en: 'AI Call Analytics' },
  { vi: 'Phần mềm theo yêu cầu', en: 'Custom Software' },
  { vi: 'Tư vấn tổng thể', en: 'End-to-end Consulting' },
]

const INITIAL_STATE: ContactFormState = { status: 'idle' }

// Link tới văn bản Quy định bảo vệ dữ liệu cá nhân của Click Star. Để trống thì
// cụm chữ hiển thị không có liên kết (điền URL khi có văn bản chính thức).
const PRIVACY_POLICY_URL = '/blog/quy-dinh-bao-ve-du-lieu-ca-nhan'

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const { t } = useLanguage()
  const [state, formAction, isPending] = useActionState(submitContactForm, INITIAL_STATE)
  // controlled để không mất dấu tích khi form báo lỗi và React reset các ô nhập
  const [consent, setConsent] = useState(false)

  if (state.status === 'success') {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#1859b8]" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {t('Đã gửi yêu cầu thành công!', 'Your request has been sent!')}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t(
            'Cảm ơn anh/chị đã liên hệ. Đội ngũ Click Star sẽ phản hồi trong vòng 24 giờ làm việc.',
            'Thank you for reaching out. The Click Star team will get back to you within 24 business hours.',
          )}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors"
        >
          {t('Gửi yêu cầu khác', 'Send another request')}
        </button>
      </div>
    )
  }

  const fieldErrors = state.status === 'error' ? state.fieldErrors ?? {} : {}

  return (
    <form action={formAction} className="space-y-5">
      {state.status === 'error' && !state.fieldErrors && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{state.message}</p>
        </div>
      )}

      {/* Honeypot — hidden from real users, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] w-px h-px opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t('Họ và tên *', 'Full name *')} name="name" placeholder={t('Nguyễn Văn A', 'Jane Smith')} error={fieldErrors.name} required />
        <Field label={t('Số điện thoại *', 'Phone number *')} name="phone" type="tel" placeholder="0977 713 428" error={fieldErrors.phone} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" name="email" type="email" placeholder={t('ban@congty.vn', 'you@company.com')} error={fieldErrors.email} />
        <Field label={t('Công ty / Thương hiệu', 'Company / Brand')} name="company" placeholder={t('Tên doanh nghiệp', 'Your business name')} error={fieldErrors.company} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">{t('Dịch vụ quan tâm', 'Service of interest')}</label>
        <select
          name="service"
          defaultValue={defaultService ?? ''}
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          <option value="">{t('— Chọn dịch vụ —', '— Select a service —')}</option>
          {SERVICES.map((s) => (
            <option key={s.vi} value={s.vi}>
              {t(s.vi, s.en)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">{t('Nội dung yêu cầu', 'Tell us about your project')}</label>
        <textarea
          name="message"
          rows={5}
          placeholder={t(
            'Mô tả ngắn về dự án hoặc nhu cầu của bạn (ngân sách, thời gian, mục tiêu...)',
            'Briefly describe your project or needs (budget, timeline, goals...)',
          )}
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
        {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-1 h-5 w-5 flex-shrink-0 rounded border-border accent-[var(--primary)] cursor-pointer"
          />
          <span className="text-sm leading-relaxed text-muted-foreground">
            {t(
              'Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập trên trang này, được xử lý và lưu trữ bởi Công ty TNHH Click Star Digital (gọi tắt là Click Star) cho mục đích tư vấn và theo điều kiện đã được công bố tại ',
              'I agree that my personal data collected on this page may be processed and stored by Click Star Digital Co., Ltd (Click Star) for consultation purposes and under the conditions published in the ',
            )}
            {PRIVACY_POLICY_URL ? (
              <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" className="underline text-[#1859b8] hover:text-primary-dark">
                {t('Quy định bảo vệ dữ liệu cá nhân của Click Star', 'Click Star Personal Data Protection Policy')}
              </a>
            ) : (
              <span className="font-medium text-foreground">
                {t('Quy định bảo vệ dữ liệu cá nhân của Click Star', 'Click Star Personal Data Protection Policy')}
              </span>
            )}
            .
          </span>
        </label>
        {fieldErrors.consent && <p className="mt-1 text-xs text-red-600">{fieldErrors.consent}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('Đang gửi…', 'Sending…')}
          </>
        ) : (
          <>
            {t('Gửi yêu cầu tư vấn', 'Request a consultation')}
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-white border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-border focus:ring-primary/30 focus:border-primary'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
