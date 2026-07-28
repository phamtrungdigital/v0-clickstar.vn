'use client'

import { TrendingUp, TrendingDown, MessageSquareWarning, Trophy, Layers, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/**
 * Khối "AI phân tích dữ liệu": từ TỪNG cuộc gọi lên bức tranh TOÀN ĐỘI.
 * Tất cả số trong khối này là VÍ DỤ MINH HOẠ (có caption ghi rõ), không phải
 * số liệu khách hàng thật — xem luật #2 ở đầu page.tsx.
 */

export function InsightAnalytics() {
  const { t } = useLanguage()

  const objections = [
    { label: t('Giá cao hơn đối thủ', 'Priced above competitor'), share: 34, trend: 'up' as const },
    { label: t('Cần bàn với gia đình', 'Need to discuss with family'), share: 21, trend: 'flat' as const },
    { label: t('Chưa thu xếp được tài chính', 'Financing not ready'), share: 18, trend: 'down' as const },
    { label: t('Lo ngại tiến độ bàn giao', 'Worried about delivery timeline'), share: 15, trend: 'up' as const },
    { label: t('Vị trí chưa phù hợp', 'Location not suitable'), share: 12, trend: 'flat' as const },
  ]

  const cards = [
    {
      icon: <MessageSquareWarning className="w-6 h-6" />,
      title: t('Lý do mất đơn được xếp hạng', 'Ranked reasons for lost deals'),
      desc: t(
        'AI chuẩn hoá hàng nghìn cách nói khác nhau về cùng một phản đối, rồi đối chiếu với tỷ lệ chốt để biết phản đối nào thực sự làm mất đơn.',
        'AI normalises thousands of phrasings of the same objection, then cross-references close rates to reveal which ones actually kill deals.'
      ),
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t('Chủ đề khách hay hỏi', 'Topics customers keep raising'),
      desc: t(
        'Gom nhóm câu hỏi lặp lại theo tuần — dữ liệu này dùng thẳng cho nội dung quảng cáo, kịch bản sale và trang câu hỏi thường gặp.',
        'Clusters recurring questions week by week — feeding straight into ad copy, sales scripts and FAQ pages.'
      ),
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: t('Xếp hạng và kèm cặp đội sale', 'Team ranking and coaching'),
      desc: t(
        'So sánh từng nhân viên trên cùng một bộ tiêu chí, chỉ ra chính xác tiêu chí nào đang kéo điểm xuống kèm đoạn ghi âm minh hoạ.',
        'Compares each agent on the same scorecard and pinpoints which criterion drags the score down, with the exact audio excerpt.'
      ),
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: t('Cảnh báo sớm rủi ro', 'Early risk alerts'),
      desc: t(
        'Phát hiện cụm cuộc gọi có cảm xúc tiêu cực tăng bất thường hoặc cam kết vượt quyền lặp lại — trước khi thành khiếu nại.',
        'Detects abnormal spikes in negative sentiment or repeated over-promising — before they become complaints.'
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Bảng xếp hạng phản đối — minh hoạ trực quan */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t('Vì sao khách không chốt — xếp theo tần suất', 'Why customers don’t close — ranked by frequency')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Tổng hợp tự động từ toàn bộ cuộc gọi trong kỳ', 'Aggregated automatically across every call in the period')}
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex-shrink-0">
            <Layers className="w-3.5 h-3.5" />
            {t('Ví dụ minh hoạ', 'Illustrative example')}
          </span>
        </div>

        <div className="space-y-3">
          {objections.map((o) => (
            <div key={o.label} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-44 sm:w-56 flex-shrink-0 truncate">{o.label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden min-w-0">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500"
                  style={{ width: `${o.share}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground w-10 text-right flex-shrink-0">{o.share}%</span>
              <span className="w-4 flex-shrink-0">
                {o.trend === 'up' && <TrendingUp className="w-4 h-4 text-rose-500" />}
                {o.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground mt-5 pt-4 border-t border-border">
          {t(
            'Số liệu trong biểu đồ là ví dụ minh hoạ để mô tả cách hệ thống trình bày kết quả, không phải dữ liệu khách hàng thật.',
            'The figures shown are an illustrative example of how results are presented — not real customer data.'
          )}
        </p>
      </div>

      {/* 4 năng lực phân tích */}
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="group bg-white rounded-2xl p-5 border border-border hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
              {c.icon}
            </div>
            <h4 className="font-bold text-foreground mb-2">{c.title}</h4>
            <p className="text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
