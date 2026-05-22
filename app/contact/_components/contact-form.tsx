'use client'

import { useActionState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { submitContactForm, type ContactFormState } from '../actions'

const SERVICES = [
  'Digital Marketing',
  'Thiết kế Website',
  'Dashboard dữ liệu',
  'Tích hợp AI',
  'AI Automation',
  'CRM & CDP',
  'Tư vấn tổng thể',
] as const

const INITIAL_STATE: ContactFormState = { status: 'idle' }

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, INITIAL_STATE)

  if (state.status === 'success') {
    return (
      <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Đã gửi yêu cầu thành công!</h3>
        <p className="text-muted-foreground mb-6">
          Cảm ơn anh/chị đã liên hệ. Đội ngũ Click Star sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-colors"
        >
          Gửi yêu cầu khác
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
        <Field label="Họ và tên *" name="name" placeholder="Nguyễn Văn A" error={fieldErrors.name} required />
        <Field label="Số điện thoại *" name="phone" type="tel" placeholder="0977 713 428" error={fieldErrors.phone} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email" name="email" type="email" placeholder="ban@congty.vn" error={fieldErrors.email} />
        <Field label="Công ty / Thương hiệu" name="company" placeholder="Tên doanh nghiệp" error={fieldErrors.company} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Dịch vụ quan tâm</label>
        <select
          name="service"
          defaultValue={defaultService ?? ''}
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          <option value="">— Chọn dịch vụ —</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Nội dung yêu cầu</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Mô tả ngắn về dự án hoặc nhu cầu của bạn (ngân sách, thời gian, mục tiêu...)"
          className="w-full px-4 py-3 bg-white border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
        {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang gửi…
          </>
        ) : (
          <>
            Gửi yêu cầu tư vấn
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground">
        Bằng việc gửi yêu cầu, anh/chị đồng ý cho Click Star liên hệ tư vấn về dịch vụ. Thông tin được bảo mật theo
        chính sách của chúng tôi.
      </p>
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
