'use client'

import { useState } from 'react'
import {
  FileAudio,
  Sparkles,
  Database,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  Play,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/**
 * Khối "Báo cáo mẫu": cho khách THẤY đầu ra của Speech Insight AI.
 * Hoàn toàn TĨNH — không timer, không hiệu ứng gõ dần (tránh treo khi tab ẩn
 * và tôn trọng prefers-reduced-motion).
 *
 * Mobile: hiện KẾT QUẢ trước (thứ tự đảo), transcript gốc thu gọn trong <details>
 * để user không phải cuộn qua khối chữ dài mới thấy phần giá trị.
 */

const TRANSCRIPT: { t: string; who: 'NV' | 'KH'; text: string; flag?: boolean }[] = [
  { t: '00:12', who: 'NV', text: 'Dạ em chào anh Hùng, em gọi về căn 2 phòng ngủ anh hỏi hôm qua ạ.' },
  { t: '00:41', who: 'KH', text: 'Ừ, mà tầm giá lúc trước là bao nhiêu nhỉ, anh thấy hơi cao so với bên kia.' },
  { t: '02:07', who: 'KH', text: 'Anh cần trong tầm 2 tỷ đổ lại, có hỗ trợ vay không em?' },
  { t: '05:33', who: 'NV', text: 'Anh yên tâm, chỗ em chắc chắn ra sổ trong quý này ạ.', flag: true },
  { t: '07:58', who: 'KH', text: 'Thôi để cuối tuần anh qua xem thử.' },
]

const CRM_FIELDS: { label: string; value: string }[] = [
  { label: 'Nhu cầu', value: 'Căn hộ 2 phòng ngủ' },
  { label: 'Ngân sách', value: '~2 tỷ' },
  { label: 'Cần vay', value: 'Có' },
  { label: 'Lý do phản đối', value: 'Giá cao hơn đối thủ' },
  { label: 'Mức sẵn sàng', value: 'Cao' },
  { label: 'Bước tiếp theo', value: 'Hẹn xem nhà — Thứ 7' },
]

const SCORE_CRITERIA = ['Chào hỏi & xác nhận nhu cầu', 'Khai thác ngân sách', 'Xử lý phản đối', 'Chốt bước tiếp theo']

function TranscriptPanel({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 flex-shrink-0">
        <FileAudio className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-xs font-medium text-slate-300">{label}</span>
      </div>
      {/* flex-1 để panel giãn đầy chiều cao cột → 2 cột desktop đều nhau */}
      <div className="p-4 space-y-3 flex-1">
        {TRANSCRIPT.map((line, i) => (
          <div key={i} className={`text-[11px] sm:text-xs font-mono leading-relaxed ${line.flag ? 'rounded-md bg-rose-500/10 border border-rose-500/30 p-2 -mx-1' : ''}`}>
            <span className="text-slate-500">[{line.t}]</span>{' '}
            <span className={line.who === 'NV' ? 'text-cyan-400 font-semibold' : 'text-teal-300 font-semibold'}>
              {line.who}
            </span>
            <span className="text-slate-500"> : </span>
            <span className={`${line.flag ? 'text-rose-200' : 'text-slate-300'} break-words`}>{line.text}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-4 flex-shrink-0">
        {['Sale nói 62%', 'Khách nói 38%', '2 lần ngắt lời'].map((chip) => (
          <span key={chip} className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            {chip}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SpeechReportSample() {
  const { t, language } = useLanguage()
  const [showTranscript, setShowTranscript] = useState(false)

  const beforeLabel = t('Bạn đang có: file ghi âm 8:14', 'What you have: an 8:14 recording')
  const afterLabel = t('Bạn nhận được: 30 giây để đọc', 'What you get: a 30-second read')

  return (
    <>
      {/* ── Desktop: 2 cột trước/sau — cùng cấu trúc header, cùng chiều cao ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <ColumnHeader eyebrow={t('TRƯỚC', 'BEFORE')} note={beforeLabel} />
          <TranscriptPanel label={t('Bản ghi cuộc gọi', 'Call transcript')} className="flex-1" />
        </div>
        <div className="flex flex-col">
          <ColumnHeader eyebrow={t('SAU KHI AI XỬ LÝ', 'AFTER AI PROCESSING')} note={afterLabel} accent />
          <ResultCards language={language} t={t} className="flex-1" />
        </div>
      </div>

      {/* ── Mobile: kết quả TRƯỚC, transcript gốc thu gọn ── */}
      <div className="lg:hidden space-y-4">
        <div>
          <ColumnHeader eyebrow={t('SAU KHI AI XỬ LÝ', 'AFTER AI PROCESSING')} note={afterLabel} accent />
          <ResultCards language={language} t={t} />
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          aria-expanded={showTranscript}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-white text-sm font-medium text-foreground"
        >
          <span className="flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-muted-foreground" />
            {t('Xem bản ghi gốc (8:14)', 'View original transcript (8:14)')}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showTranscript ? 'rotate-180' : ''}`} />
        </button>
        {showTranscript && <TranscriptPanel label={beforeLabel} />}
      </div>
    </>
  )
}

/**
 * Header 2 cột — CÙNG cấu trúc và CÙNG chiều cao (min-h) để nội dung 2 bên
 * bắt đầu trên cùng một đường ngang.
 */
function ColumnHeader({ eyebrow, note, accent = false }: { eyebrow: string; note: string; accent?: boolean }) {
  return (
    <div className="mb-3 min-h-[44px]">
      <p
        className={`text-xs font-semibold uppercase tracking-wider ${
          accent ? 'text-cyan-600' : 'text-muted-foreground'
        }`}
      >
        {eyebrow}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{note}</p>
    </div>
  )
}

function ResultCards({
  language,
  t,
  className = '',
}: {
  language: string
  t: (vi: string, en: string) => string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Card A — AI phân tích */}
      <div className="rounded-2xl bg-white border border-border shadow-lg shadow-cyan-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-cyan-600" />
          </span>
          <h3 className="font-bold text-foreground">{t('AI phân tích', 'AI analysis')}</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {t(
            'Khách quan tâm căn 2 phòng ngủ, ngân sách khoảng 2 tỷ, cần hỗ trợ vay. Phản đối chính: giá cao hơn đối thủ. Đã hẹn đi xem nhà cuối tuần.',
            'Customer wants a 2-bedroom unit, budget around 2 billion VND, needs a loan. Main objection: priced higher than a competitor. Agreed to a weekend site visit.'
          )}
        </p>

        {/* Điểm chất lượng */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {t('Điểm chất lượng cuộc gọi', 'Call quality score')}
            </span>
            <span className="text-lg font-extrabold text-cyan-600">82/100</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
          </div>
        </div>

        <ul className="space-y-1.5 mb-4">
          {SCORE_CRITERIA.map((c) => (
            <li key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="break-words">{c}</span>
            </li>
          ))}
        </ul>

        {/* Cảnh báo tuân thủ */}
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-rose-700">
                {t('Cảnh báo tuân thủ — phút 05:33', 'Compliance alert — 05:33')}
              </p>
              <p className="text-xs text-rose-600/90 mt-0.5 break-words">
                {t(
                  'Phát hiện cam kết rủi ro: “chắc chắn ra sổ trong quý này”',
                  'Risky promise detected: “the title deed will definitely be issued this quarter”'
                )}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-rose-700">
                <Play className="w-3 h-3" />
                {t('Nghe lại từ 05:33', 'Replay from 05:33')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card B — CRM tự điền */}
      <div className="rounded-2xl bg-white border border-border shadow-lg shadow-cyan-500/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-cyan-600" />
          </span>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground">{t('Hồ sơ CRM tự điền', 'CRM record auto-filled')}</h3>
            <p className="text-[11px] text-muted-foreground font-mono truncate">crm.clickstar.vn</p>
          </div>
        </div>

        <div className="space-y-2">
          {CRM_FIELDS.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground flex-shrink-0">{f.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground text-right min-w-0">
                <span className="truncate">{f.value}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border space-y-1.5">
          <p className="text-xs text-muted-foreground">
            {t('Giai đoạn deal:', 'Deal stage:')}{' '}
            <span className="font-semibold text-foreground">
              {t('Tư vấn → Hẹn gặp', 'Consulting → Meeting scheduled')}
            </span>
          </p>
          <p className="text-xs text-emerald-600 font-medium">
            {t('✓ Đã tạo task nhắc sale trước 1 ngày', '✓ Reminder task created 1 day ahead')}
          </p>
        </div>
      </div>
    </div>
  )
}
