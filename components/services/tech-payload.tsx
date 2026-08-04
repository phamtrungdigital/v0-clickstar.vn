'use client'

import { useState } from 'react'
import { Braces, Webhook, Table2, Copy, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/**
 * Khối minh hoạ KỸ THUẬT: cho khách (và team IT của khách) thấy hệ thống trả về
 * dữ liệu có cấu trúc thật, không phải "hộp đen marketing".
 *
 * Tất cả TĨNH. Mọi code block phải bọc overflow-x-auto vì globals.css không có
 * guard overflow-x → khối tràn sẽ làm cả trang cuộn ngang trên mobile.
 */

const JSON_PAYLOAD = {
  vi: `{
  "call_id": "cl_9f2a17",
  "duration_sec": 494,
  "agent": { "id": "sale_08", "name": "Nguyễn Thu Hà" },
  "transcript_url": "https://.../cl_9f2a17.txt",

  "summary": "Khách hỏi căn 2PN, ngân sách ~2 tỷ, cần
              hỗ trợ vay. Chê giá cao hơn đối thủ.
              Đã hẹn xem nhà thứ 7.",

  "quality": {
    "score": 82,
    "criteria": {
      "chao_hoi": true,
      "khai_thac_nhu_cau": true,
      "xu_ly_tu_choi": true,
      "chot_buoc_tiep_theo": true
    }
  },

  "sentiment": { "overall": "positive", "risk": false },

  "talk_ratio": { "agent": 0.62, "customer": 0.38 },

  "extracted": {
    "nhu_cau": "Căn hộ 2 phòng ngủ",
    "ngan_sach": 2000000000,
    "khu_vuc": "Thủ Đức",
    "can_vay": true,
    "objection": "gia_cao_hon_doi_thu",
    "next_step": { "type": "site_visit", "date": "2026-07-04" }
  },

  "compliance": [
    {
      "type": "over_promise",
      "at_sec": 333,
      "quote": "chắc chắn ra sổ trong quý này",
      "severity": "high"
    }
  ],

  "crm": { "record_id": "kh_41022", "stage": "hen_gap", "task_created": true }
}`,
  en: `{
  "call_id": "cl_9f2a17",
  "duration_sec": 494,
  "agent": { "id": "sale_08", "name": "Nguyễn Thu Hà" },
  "transcript_url": "https://.../cl_9f2a17.txt",

  "summary": "Asked about a 2BR unit, budget ~2B VND,
              needs financing. Felt the price was above
              a competitor's. Site visit booked for
              Saturday.",

  "quality": {
    "score": 82,
    "criteria": {
      "chao_hoi": true,
      "khai_thac_nhu_cau": true,
      "xu_ly_tu_choi": true,
      "chot_buoc_tiep_theo": true
    }
  },

  "sentiment": { "overall": "positive", "risk": false },

  "talk_ratio": { "agent": 0.62, "customer": 0.38 },

  "extracted": {
    "nhu_cau": "2-bedroom apartment",
    "ngan_sach": 2000000000,
    "khu_vuc": "Thủ Đức",
    "can_vay": true,
    "objection": "gia_cao_hon_doi_thu",
    "next_step": { "type": "site_visit", "date": "2026-07-04" }
  },

  "compliance": [
    {
      "type": "over_promise",
      "at_sec": 333,
      "quote": "the title deed will definitely be issued this quarter",
      "severity": "high"
    }
  ],

  "crm": { "record_id": "kh_41022", "stage": "hen_gap", "task_created": true }
}`,
}

const WEBHOOK_SNIPPET = {
  vi: `POST /your-endpoint  HTTP/1.1
Content-Type: application/json
X-Signature: sha256=<hmac_chu_ky>

{ "event": "call.analyzed", "data": { ...payload... } }

# Hoặc chủ động lấy theo lô:
GET /v1/calls?from=2026-07-01&to=2026-07-31&min_score=0&flagged=true`,
  en: `POST /your-endpoint  HTTP/1.1
Content-Type: application/json
X-Signature: sha256=<hmac_signature>

{ "event": "call.analyzed", "data": { ...payload... } }

# Or pull results in batches:
GET /v1/calls?from=2026-07-01&to=2026-07-31&min_score=0&flagged=true`,
}

export function TechPayload() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<'json' | 'api' | 'fields'>('json')
  const [copied, setCopied] = useState(false)

  const jsonPayload = t(JSON_PAYLOAD.vi, JSON_PAYLOAD.en)
  const webhookSnippet = t(WEBHOOK_SNIPPET.vi, WEBHOOK_SNIPPET.en)

  const copy = async () => {
    const text = tab === 'json' ? jsonPayload : webhookSnippet
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* trình duyệt chặn clipboard — bỏ qua, không phá UI */
    }
  }

  const fields: { field: string; type: string; desc: string; crm: string }[] = [
    {
      field: 'extracted.nhu_cau',
      type: 'text',
      desc: t('Sản phẩm / dịch vụ khách hỏi', 'Product or service the customer asked about'),
      crm: t('Nhu cầu', 'Need'),
    },
    {
      field: 'extracted.ngan_sach',
      type: 'number',
      desc: t('Ngân sách khách nêu trong cuộc gọi', 'Budget mentioned during the call'),
      crm: t('Ngân sách', 'Budget'),
    },
    {
      field: 'extracted.objection',
      type: 'enum',
      desc: t('Lý do phản đối chính, đã chuẩn hoá', 'Primary objection, normalised'),
      crm: t('Lý do phản đối', 'Objection'),
    },
    {
      field: 'extracted.next_step',
      type: 'object',
      desc: t('Bước tiếp theo + ngày hẹn', 'Next step and appointment date'),
      crm: t('Task + Giai đoạn deal', 'Task + Deal stage'),
    },
    {
      field: 'quality.score',
      type: 'number',
      desc: t('Điểm chất lượng theo bộ tiêu chí của bạn', 'Quality score against your scorecard'),
      crm: t('Điểm cuộc gọi', 'Call score'),
    },
    {
      field: 'compliance[]',
      type: 'array',
      desc: t('Vi phạm phát hiện được kèm phút và trích dẫn', 'Detected violations with timestamp and quote'),
      crm: t('Cảnh báo + ghi chú', 'Alert + note'),
    },
  ]

  const tabs = [
    { key: 'json' as const, label: t('Kết quả JSON', 'JSON result'), icon: <Braces className="w-4 h-4" /> },
    { key: 'api' as const, label: t('Webhook / API', 'Webhook / API'), icon: <Webhook className="w-4 h-4" /> },
    { key: 'fields' as const, label: t('Bảng trường dữ liệu', 'Field mapping'), icon: <Table2 className="w-4 h-4" /> },
  ]

  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-slate-50 px-3 sm:px-4">
        <div className="flex overflow-x-auto">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === tb.key
                  ? 'border-cyan-500 text-cyan-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tb.icon}
              {tb.label}
            </button>
          ))}
        </div>

        {tab !== 'fields' && (
          <button
            type="button"
            onClick={copy}
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('Đã chép', 'Copied') : t('Chép', 'Copy')}
          </button>
        )}
      </div>

      {/* Nội dung */}
      {tab === 'json' && (
        <div className="bg-slate-900">
          <pre className="overflow-x-auto p-4 sm:p-5 text-[11px] sm:text-xs leading-relaxed font-mono text-slate-300">
            <code>{jsonPayload}</code>
          </pre>
        </div>
      )}

      {tab === 'api' && (
        <div className="bg-slate-900">
          <pre className="overflow-x-auto p-4 sm:p-5 text-[11px] sm:text-xs leading-relaxed font-mono text-slate-300">
            <code>{webhookSnippet}</code>
          </pre>
          <div className="px-4 sm:px-5 pb-5 -mt-1">
            <p className="text-[11px] text-slate-400">
              {t(
                'Mỗi cuộc gọi phân tích xong sẽ bắn webhook có chữ ký HMAC về hệ thống của bạn. Nếu không dùng webhook, đội kỹ thuật có thể chủ động lấy theo lô qua API.',
                'Each analysed call fires an HMAC-signed webhook to your system. If you prefer, your team can pull results in batches via the API.'
              )}
            </p>
          </div>
        </div>
      )}

      {tab === 'fields' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="text-left font-semibold text-foreground px-4 py-3">{t('Trường dữ liệu', 'Field')}</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">{t('Kiểu', 'Type')}</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">{t('Ý nghĩa', 'Meaning')}</th>
                <th className="text-left font-semibold text-foreground px-4 py-3">{t('Ghi vào CRM', 'Writes to CRM')}</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.field} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-cyan-700 whitespace-nowrap">{f.field}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{f.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.desc}</td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{f.crm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
