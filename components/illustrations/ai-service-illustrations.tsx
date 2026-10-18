/**
 * Ảnh minh họa SVG cho 4 trang dịch vụ AI (18/10/2026): AI Integration, Automation, Dashboard,
 * Speech Insight AI. Cùng ngôn ngữ thị giác với service-illustrations: nền trắng, viền mảnh, MỘT màu
 * xanh, MỘT bóng đổ dưới thẻ chính, không gradient. Mọi chữ đi qua t(vi, en); số liệu là minh họa.
 */

const INK = '#1d1d1f'
const MUTED = '#6e6e73'
const LINE = '#e0e0e0'
const SOFT = '#f5f5f7'
const BLUE = '#1e6dda'
const BLUE_DEEP = '#1859b8'
const BLUE_SOFT = '#eaf2fd'

type T = (vi: string, en: string) => string
type Props = { className?: string; label?: string; t: T }

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="3" dy="5" stdDeviation="15" floodColor="#000000" floodOpacity="0.16" />
    </filter>
  )
}

/* -------------------------------------------------------------------------- */
/* AI Integration: cửa sổ làm việc với AI, 8 ứng dụng, một yêu cầu, ba mô hình    */
/* -------------------------------------------------------------------------- */
export function AiWorkspaceIllustration({ className = 'w-full h-auto', label, t }: Props) {
  const apps = [
    t('Nội dung', 'Content'), t('Hình ảnh', 'Images'), 'Video', t('Dữ liệu', 'Data'),
    'Chatbot', t('Quảng cáo', 'Ads'), 'Email', 'CRM',
  ]
  return (
    <svg viewBox="0 0 520 420" className={className} role="img" aria-label={label ?? t('Không gian làm việc AI: 8 ứng dụng, 3 mô hình, người duyệt', 'AI workspace: 8 applications, 3 models, human review')} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-aiw" />
      </defs>
      <rect x="24" y="20" width="472" height="318" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-aiw)" />
      {[46, 62, 78].map((cx) => (
        <circle key={cx} cx={cx} cy="44" r="5" fill="#d2d2d7" />
      ))}
      <text x="260" y="48" fontSize="12.5" fill={MUTED} textAnchor="middle">AI Workspace</text>
      <line x1="24" x2="496" y1="64" y2="64" stroke={LINE} />

      {/* Cột ứng dụng */}
      <text x="48" y="94" fontSize="11" fontWeight="600" fill={MUTED} letterSpacing="0.6">{t('ỨNG DỤNG', 'APPLICATIONS')}</text>
      {apps.map((name, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const x = 48 + col * 94
        const y = 106 + row * 44
        const on = i === 0
        return (
          <g key={name}>
            <rect x={x} y={y} width="86" height="34" rx="10" fill={on ? BLUE : SOFT} />
            <text x={x + 43} y={y + 21.5} fontSize="12.5" fontWeight={on ? 600 : 400} fill={on ? '#ffffff' : INK} textAnchor="middle">{name}</text>
          </g>
        )
      })}
      <line x1="248" x2="248" y1="84" y2="318" stroke={LINE} />

      {/* Yêu cầu */}
      <text x="270" y="94" fontSize="11" fontWeight="600" fill={MUTED} letterSpacing="0.6">{t('YÊU CẦU', 'REQUEST')}</text>
      <rect x="270" y="106" width="206" height="46" rx="12" fill={SOFT} />
      <text x="284" y="126" fontSize="12.5" fill={INK}>{t('Viết 3 tiêu đề quảng cáo', 'Write 3 ad headlines')}</text>
      <text x="284" y="142" fontSize="12.5" fill={MUTED}>{t('cho gói Website', 'for the Website package')}</text>

      {/* Chọn mô hình */}
      <text x="270" y="178" fontSize="11" fontWeight="600" fill={MUTED} letterSpacing="0.6">{t('MÔ HÌNH ĐƯỢC CHỌN', 'MODEL ROUTED')}</text>
      {['Claude', 'GPT', 'Gemini'].map((m, i) => (
        <g key={m}>
          <rect x={270 + i * 70} y="188" width="62" height="28" rx="14" fill={i === 0 ? BLUE_SOFT : '#ffffff'} stroke={i === 0 ? BLUE : LINE} />
          <text x={270 + i * 70 + 31} y="206.5" fontSize="12" fontWeight={i === 0 ? 600 : 400} fill={i === 0 ? BLUE_DEEP : INK} textAnchor="middle">{m}</text>
        </g>
      ))}

      {/* Kết quả */}
      <text x="270" y="244" fontSize="11" fontWeight="600" fill={MUTED} letterSpacing="0.6">{t('KẾT QUẢ', 'OUTPUT')}</text>
      {[[196, 1], [150, 0.55], [172, 0.35]].map(([w, o], i) => (
        <g key={i}>
          <circle cx="278" cy={262 + i * 20} r="4" fill={BLUE} fillOpacity={o as number} />
          <rect x="292" y={258 + i * 20} width={w as number} height="8" rx="4" fill={INK} fillOpacity={0.14 + (o as number) * 0.12} />
        </g>
      ))}

      {/* Thẻ người duyệt */}
      <rect x="40" y="318" width="204" height="66" rx="16" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-aiw)" />
      <circle cx="72" cy="351" r="16" fill={BLUE_SOFT} />
      <path d="M64.5 351.5 L69.5 356.5 L79.5 345.5" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="98" y="346" fontSize="13.5" fontWeight="600" fill={INK}>{t('Có người duyệt', 'Human review')}</text>
      <text x="98" y="365" fontSize="12" fill={MUTED}>{t('trước khi đăng', 'before anything goes live')}</text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Dashboard: cửa sổ bảng điều khiển sáng, 4 chỉ số, biểu đồ theo kênh, gợi ý AI   */
/* -------------------------------------------------------------------------- */
export function DashboardPreviewIllustration({ className = 'w-full h-auto', label, t }: Props) {
  const metrics = [
    { l: t('Doanh thu', 'Revenue'), v: '₫2.4B', d: '+18%' },
    { l: t('Chi phí ADS', 'Ad spend'), v: '₫180M', d: '-12%' },
    { l: 'ROAS', v: '4.2x', d: '+25%' },
    { l: 'Leads', v: '1,247', d: '+32%' },
  ]
  const bars = [40, 65, 45, 80, 60, 90, 75]
  const days = [t('T2', 'Mon'), t('T3', 'Tue'), t('T4', 'Wed'), t('T5', 'Thu'), t('T6', 'Fri'), t('T7', 'Sat'), t('CN', 'Sun')]
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label={label ?? t('Bảng điều khiển: doanh thu, chi phí quảng cáo, ROAS, leads, hiệu quả theo kênh và gợi ý của AI', 'Dashboard: revenue, ad spend, ROAS, leads, channel performance and an AI suggestion')} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-dbp" />
      </defs>
      <rect x="24" y="16" width="512" height="352" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-dbp)" />
      {[46, 62, 78].map((cx) => (
        <circle key={cx} cx={cx} cy="40" r="5" fill="#d2d2d7" />
      ))}
      <rect x="150" y="30" width="260" height="20" rx="10" fill={SOFT} />
      <text x="280" y="44" fontSize="11" fill={MUTED} textAnchor="middle">dashboard.clickstar.vn</text>
      <line x1="24" x2="536" y1="62" y2="62" stroke={LINE} />

      {/* 4 chỉ số */}
      {metrics.map((m, i) => (
        <g key={m.l}>
          <rect x={44 + i * 123} y="76" width="113" height="68" rx="12" fill={SOFT} />
          <text x={56 + i * 123} y="97" fontSize="11" fill={MUTED}>{m.l}</text>
          <text x={56 + i * 123} y="121" fontSize="20" fontWeight="600" fill={INK} letterSpacing="-0.5">{m.v}</text>
          <text x={56 + i * 123} y="136" fontSize="11" fontWeight="600" fill={BLUE_DEEP}>{m.d}</text>
        </g>
      ))}

      {/* Biểu đồ theo kênh */}
      <rect x="44" y="158" width="300" height="190" rx="12" fill="#ffffff" stroke={LINE} />
      <text x="58" y="180" fontSize="12.5" fontWeight="600" fill={INK}>{t('Hiệu quả theo kênh', 'Channel performance')}</text>
      <text x="330" y="180" fontSize="11" fill={MUTED} textAnchor="end">{t('7 ngày qua', 'Last 7 days')}</text>
      {[0, 1, 2].map((g) => (
        <line key={g} x1="58" x2="330" y1={206 + g * 36} y2={206 + g * 36} stroke="#ececef" />
      ))}
      {bars.map((h, i) => {
        const bh = (h / 100) * 100
        return (
          <g key={i}>
            <rect x={64 + i * 38} y={314 - bh} width="24" height={bh} rx="5" fill={i === 5 ? BLUE : BLUE} fillOpacity={i === 5 ? 1 : 0.28} />
            <text x={76 + i * 38} y="334" fontSize="10.5" fill={MUTED} textAnchor="middle">{days[i]}</text>
          </g>
        )
      })}

      {/* Gợi ý của AI */}
      <rect x="358" y="158" width="158" height="122" rx="12" fill={BLUE_SOFT} />
      <text x="372" y="180" fontSize="11" fontWeight="600" fill={BLUE_DEEP} letterSpacing="0.6">{t('GỢI Ý CỦA AI', 'AI SUGGESTION')}</text>
      <text x="372" y="202" fontSize="12.5" fill={INK}>{t('Tăng ngân sách', 'Raise the Google')}</text>
      <text x="372" y="219" fontSize="12.5" fill={INK}>{t('Google Ads 20%', 'Ads budget 20%')}</text>
      <text x="372" y="236" fontSize="12.5" fill={INK}>{t('để tối ưu ROAS', 'to improve ROAS')}</text>
      <rect x="372" y="254" width="62" height="16" rx="8" fill={BLUE} />
      <text x="403" y="265.5" fontSize="10.5" fontWeight="600" fill="#ffffff" textAnchor="middle">Claude</text>

      {/* Đang trực tuyến */}
      <rect x="358" y="292" width="158" height="56" rx="12" fill="#ffffff" stroke={LINE} />
      <circle cx="376" cy="311" r="4" fill={BLUE} />
      <text x="388" y="315" fontSize="12.5" fontWeight="600" fill={INK}>Live</text>
      <text x="372" y="334" fontSize="12" fill={MUTED}>{t('23 người đang truy cập', '23 users online now')}</text>

      <rect x="40" y="352" width="196" height="52" rx="14" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-dbp)" />
      <text x="56" y="374" fontSize="12.5" fontWeight="600" fill={INK}>{t('Cập nhật mỗi 30 giây', 'Updates every 30 seconds')}</text>
      <text x="56" y="391" fontSize="11.5" fill={MUTED}>{t('không cần tải lại trang', 'no page reload needed')}</text>
    </svg>
  )
}
