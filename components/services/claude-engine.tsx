'use client'

import {
  Languages,
  FileText,
  Braces,
  SlidersHorizontal,
  ShieldCheck,
  Bot,
  UserCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/**
 * Khối "Bộ não phân tích: Claude (Anthropic)".
 *
 * 3 LUẬT KHI SỬA FILE NÀY:
 * 1. KHÔNG ghi số phiên bản model (anh Trung chốt 28/7/2026). Model đổi liên tục,
 *    ghi version lên trang bán hàng = tự tạo nợ bảo trì và rủi ro thông tin sai.
 *    Chỉ nêu "Claude của Anthropic".
 * 2. KHÔNG đặt logo/nhãn hiệu Anthropic — chưa xác minh quyền sử dụng nhãn hiệu.
 *    Dùng chữ + badge màu cyan/teal của trang.
 * 3. KHÔNG viết benchmark hay % độ chính xác. Chỉ nêu NĂNG LỰC có thật
 *    (ngữ cảnh dài, output có cấu trúc, đa ngôn ngữ, cấu hình được theo prompt).
 */

export function ClaudeEngine() {
  const { t } = useLanguage()

  const reasons = [
    {
      icon: <Languages className="w-6 h-6" />,
      title: t('Hiểu tiếng Việt như người Việt nói', 'Understands Vietnamese as people actually speak it'),
      desc: t(
        'Không phải tiếng Việt sách vở: khách nói lẫn tiếng Anh ("book lịch", "deal"), nói tắt, ngắt quãng, giọng ba miền. Cùng một ý "đắt quá" khách nói mười kiểu khác nhau — hệ thống vẫn gom về đúng một nhóm phản đối.',
        'Not textbook Vietnamese: customers mix in English, abbreviate, trail off, and speak in three regional accents. The same objection — "too expensive" — comes in ten phrasings; the system still groups them under one label.'
      ),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('Đọc trọn cuộc gọi trong một lượt', 'Reads the whole call in one pass'),
      desc: t(
        'Một cuộc 45 phút không bị cắt thành nhiều mẩu rồi ghép lại. Nhờ vậy hệ thống hiểu được câu ở phút 38 đang trả lời cho câu hỏi khách đặt ở phút 4 — đúng chỗ mà cách cắt khúc luôn làm mất mạch.',
        'A 45-minute call is not chopped into fragments and stitched back together. That is how the system knows a sentence at minute 38 answers a question asked at minute 4 — exactly what chunking always loses.'
      ),
    },
    {
      icon: <Braces className="w-6 h-6" />,
      title: t('Trả về dữ liệu có cấu trúc, không phải văn xuôi', 'Returns structured data, not prose'),
      desc: t(
        'Kết quả bị ràng buộc đúng khuôn dữ liệu đã định sẵn — không phải một đoạn văn để rồi hệ thống của bạn phải viết code đoán chữ. Nhận về là ghi thẳng vào CRM được.',
        'Output is constrained to a predefined data shape — not a paragraph your system then has to guess its way through. What arrives goes straight into the CRM.'
      ),
    },
    {
      icon: <SlidersHorizontal className="w-6 h-6" />,
      title: t('Chấm theo kịch bản của bạn', 'Scores against your own playbook'),
      desc: t(
        'Bộ tiêu chí đánh giá, từ điển sản phẩm và quy định riêng của doanh nghiệp bạn được nạp vào — không phải một bộ tiêu chí đóng hộp bán chung cho mọi công ty. Đổi kịch bản là đổi cách chấm, không phải làm lại hệ thống.',
        'Your scorecard, product dictionary and internal rules are loaded in — not a boxed checklist sold to everyone. Change the playbook and the scoring changes; the system does not need rebuilding.'
      ),
    },
  ]

  const aiDoes = [
    t('Nghe và bóc băng 100% cuộc gọi, không bỏ sót cuộc nào', 'Listens to and transcribes 100% of calls, missing none'),
    t(
      'Chấm điểm theo đúng bộ tiêu chí bạn đưa vào, áp dụng như nhau cho mọi nhân viên',
      'Scores against the criteria you provide, applied identically to every agent'
    ),
    t(
      'Trích xuất nhu cầu, ngân sách, lý do từ chối, bước tiếp theo',
      'Extracts needs, budget, objections and the agreed next step'
    ),
    t('Đánh dấu cuộc gọi cần người xem lại', 'Flags the calls a human needs to review'),
  ]

  const humanDoes = [
    t('Bộ tiêu chí chấm điểm gồm những gì, trọng số ra sao', 'What goes into the scorecard and how it is weighted'),
    t('Điểm bao nhiêu là đạt, cuộc nào cần phúc tra', 'What score counts as passing and which calls get re-reviewed'),
    t('Đánh giá nhân sự, thưởng phạt, kèm cặp', 'Performance reviews, rewards, penalties and coaching'),
    t('Nội dung nào được lưu, lưu bao lâu, ai được xem', 'What is stored, for how long, and who may see it'),
  ]

  const commitments = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: t(
        'Dữ liệu cuộc gọi của bạn không được dùng để huấn luyện mô hình AI.',
        'Your call data is not used to train AI models.'
      ),
    },
    {
      icon: <Lock className="w-5 h-5" />,
      text: t(
        'Thông tin nhạy cảm trong bản bóc băng được tự động che trước khi đưa vào phân tích.',
        'Sensitive details in transcripts are masked automatically before analysis.'
      ),
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: t(
        'Có nhật ký đầy đủ: cuộc gọi nào được xử lý, lúc nào, ai đã mở kết quả.',
        'Full audit log: which call was processed, when, and who opened the result.'
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Thẻ định danh engine */}
      <div className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white flex-shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-1">
              {t('Mô hình phân tích', 'Analysis model')}
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
              Claude <span className="text-muted-foreground font-semibold text-xl sm:text-2xl">— Anthropic</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                'Chúng tôi chọn phiên bản phù hợp với khối lượng và độ khó của từng doanh nghiệp, thay vì bắt mọi khách dùng chung một cấu hình.',
                'We match the model tier to each company’s call volume and complexity, rather than forcing one configuration on everyone.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 4 lý do */}
      <div className="grid sm:grid-cols-2 gap-4">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="group bg-white rounded-2xl p-5 border border-border hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
              {r.icon}
            </div>
            <h4 className="font-bold text-foreground mb-2">{r.title}</h4>
            <p className="text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Ranh giới AI / người */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <h3 className="text-lg font-bold text-foreground mb-1">
          {t('AI làm gì, người quyết định gì', 'What the AI does, what people decide')}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {t(
            'Ranh giới này được đặt rõ ngay từ đầu để đội ngũ của bạn biết mình đang làm việc với công cụ gì.',
            'This boundary is set explicitly up front so your team knows exactly what they are working with.'
          )}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-cyan-600" />
              <span className="text-sm font-bold text-cyan-700">{t('AI làm', 'The AI does')}</span>
            </div>
            <ul className="space-y-2.5">
              {aiDoes.map((x, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-700">
                {t('Người quyết định', 'People decide')}
              </span>
            </div>
            <ul className="space-y-2.5">
              {humanDoes.map((x, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-5 pt-4 border-t border-border">
          {t(
            'AI không tự đánh giá nhân sự thay quản lý. Mọi điểm số đều mở ra xem được: hệ thống dựa vào đoạn nào của cuộc gọi để chấm, và nghe lại được đúng đoạn đó.',
            'The AI does not replace managers in judging people. Every score can be opened up: which part of the call it was based on, and you can replay that exact moment.'
          )}
        </p>
      </div>

      {/* Cam kết dữ liệu */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-foreground">
            {t('Dữ liệu của bạn đi tới đâu', 'Where your data goes')}
          </h3>
        </div>
        <ul className="space-y-3">
          {commitments.map((c, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="text-emerald-600 flex-shrink-0 mt-0.5">{c.icon}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
