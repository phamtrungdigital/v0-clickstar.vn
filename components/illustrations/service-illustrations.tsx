/**
 * Ảnh minh họa SVG cho các trang dịch vụ, vẽ lại theo hướng Apple (18/10/2026):
 * nền trắng, viền mảnh, một màu xanh, chữ hệ thống, MỘT bóng đổ duy nhất dưới thẻ chính.
 * Thay các hình "clipart" cũ (vòng tròn, chip nổi, robot hoạt hình). Số liệu trong hình là minh họa.
 * Không dùng gradient; id của filter có hậu tố riêng để nhiều hình cùng trang không trùng nhau.
 */

const INK = '#1d1d1f'
const MUTED = '#6e6e73'
const LINE = '#e0e0e0'
const SOFT = '#f5f5f7'
const BLUE = '#1e6dda'
const BLUE_SOFT = '#eaf2fd'

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="3" dy="5" stdDeviation="15" floodColor="#000000" floodOpacity="0.16" />
    </filter>
  )
}

type Props = { className?: string; label?: string }

/** Digital marketing: thẻ ROAS có biểu đồ tăng trưởng + thẻ chi phí mỗi khách */
export function MarketingGrowthIllustration({ className = 'w-full h-auto', label = 'Marketing performance' }: Props) {
  const values = [30, 34, 33, 40, 46, 50, 49, 58, 66, 72, 80, 92]
  const x0 = 56
  const x1 = 444
  const yBase = 255
  const yTop = 135
  const px = (i: number) => x0 + ((x1 - x0) * i) / (values.length - 1)
  const py = (v: number) => yBase - ((yBase - yTop) * v) / 100
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')
  const area = `${line} L${x1} ${yBase} L${x0} ${yBase} Z`
  return (
    <svg viewBox="0 0 500 400" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-mk" />
      </defs>
      <rect x="30" y="30" width="440" height="260" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-mk)" />
      <text x="56" y="68" fontSize="14" fill={MUTED}>Return on ad spend</text>
      <text x="444" y="68" fontSize="13" fill={MUTED} textAnchor="end">Last 12 weeks</text>
      <text x="56" y="110" fontSize="42" fontWeight="600" fill={INK} letterSpacing="-1">4.7x</text>
      <rect x="150" y="88" width="62" height="24" rx="12" fill={BLUE_SOFT} />
      <text x="181" y="104.5" fontSize="13" fontWeight="600" fill={BLUE} textAnchor="middle">+0.9x</text>
      {[0, 1, 2, 3].map((g) => (
        <line key={g} x1={x0} x2={x1} y1={yTop + ((yBase - yTop) * g) / 3} y2={yTop + ((yBase - yTop) * g) / 3} stroke="#ececef" strokeWidth="1" />
      ))}
      <path d={area} fill={BLUE} fillOpacity="0.08" />
      <path d={line} fill="none" stroke={BLUE} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={px(values.length - 1)} cy={py(values[values.length - 1])} r="6" fill={BLUE} stroke="#ffffff" strokeWidth="3" />
      <rect x="40" y="262" width="196" height="78" rx="16" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-mk)" />
      <text x="60" y="290" fontSize="12" fill={MUTED}>Cost per lead</text>
      <text x="60" y="324" fontSize="30" fontWeight="600" fill={INK} letterSpacing="-0.8">-21%</text>
      <path d="M178 298 L194 314 M194 301 L194 314 L181 314" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Website: cửa sổ trình duyệt dạng khung dây + thẻ điểm tốc độ */
export function WebsiteBrowserIllustration({ className = 'w-full h-auto', label = 'Website design' }: Props) {
  return (
    <svg viewBox="0 0 500 400" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-web" />
      </defs>
      <rect x="40" y="30" width="420" height="320" rx="14" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-web)" />
      <line x1="40" x2="460" y1="68" y2="68" stroke={LINE} />
      {[62, 80, 98].map((cx) => (
        <circle key={cx} cx={cx} cy="49" r="5" fill="#d2d2d7" />
      ))}
      <rect x="150" y="39" width="200" height="20" rx="10" fill={SOFT} />
      <text x="250" y="53" fontSize="11" fill={MUTED} textAnchor="middle">clickstar.vn</text>
      {/* Hero khung dây */}
      <rect x="66" y="96" width="210" height="14" rx="7" fill={INK} />
      <rect x="66" y="118" width="150" height="14" rx="7" fill={INK} />
      <rect x="66" y="146" width="236" height="8" rx="4" fill={LINE} />
      <rect x="66" y="162" width="190" height="8" rx="4" fill={LINE} />
      <rect x="66" y="188" width="100" height="30" rx="15" fill={BLUE} />
      <text x="116" y="207" fontSize="12" fill="#ffffff" textAnchor="middle">Get started</text>
      <rect x="334" y="92" width="102" height="126" rx="12" fill={BLUE_SOFT} />
      {[
        { x: 352, y: 168, h: 36 },
        { x: 374, y: 150, h: 54 },
        { x: 396, y: 126, h: 78 },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width="14" height={b.h} rx="4" fill={BLUE} fillOpacity={0.35 + b.h / 140} />
      ))}
      {/* Hàng thẻ */}
      {[66, 198].map((x) => (
        <g key={x}>
          <rect x={x} y="244" width="120" height="84" rx="11" fill="#ffffff" stroke={LINE} />
          <circle cx={x + 24} cy="270" r="9" fill={BLUE_SOFT} />
          <rect x={x + 16} y="292" width="72" height="8" rx="4" fill={INK} />
          <rect x={x + 16} y="308" width="54" height="7" rx="3.5" fill={LINE} />
        </g>
      ))}
      <rect x="330" y="244" width="106" height="84" rx="11" fill={SOFT} />
      <circle cx="383" cy="278" r="22" fill="none" stroke={LINE} strokeWidth="6" />
      <circle cx="383" cy="278" r="22" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" strokeDasharray="135.4 138.2" transform="rotate(-90 383 278)" />
      <text x="383" y="284" fontSize="18" fontWeight="600" fill={INK} textAnchor="middle">98</text>
      <text x="383" y="318" fontSize="11" fill={MUTED} textAnchor="middle">PageSpeed</text>
    </svg>
  )
}

/** CRM và CDP: nhiều nguồn dữ liệu hợp nhất thành một hồ sơ khách hàng */
export function CustomerProfileIllustration({ className = 'w-full h-auto', label = 'Unified customer profile' }: Props) {
  const sources = ['Website', 'Facebook', 'Zalo', 'Call center']
  const events = [
    ['Viewed pricing page', '2 min ago'],
    ['Messaged on Zalo', '1 h ago'],
    ['Called sales', 'Yesterday'],
    ['Sent contact form', '2 days ago'],
  ]
  return (
    <svg viewBox="0 0 500 400" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-crm" />
      </defs>
      {sources.map((name, i) => {
        const cy = 90 + i * 60
        return (
          <g key={name}>
            <path d={`M140 ${cy} C 185 ${cy}, 185 190, 228 190`} fill="none" stroke={BLUE} strokeOpacity="0.45" strokeWidth="1.5" />
            <rect x="20" y={cy - 20} width="120" height="40" rx="20" fill="#ffffff" stroke={LINE} />
            <circle cx="42" cy={cy} r="5" fill={BLUE} />
            <text x="56" y={cy + 4.5} fontSize="13" fill={INK}>{name}</text>
          </g>
        )
      })}
      <rect x="228" y="40" width="252" height="310" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-crm)" />
      <circle cx="268" cy="90" r="22" fill={BLUE_SOFT} />
      <text x="268" y="95" fontSize="14" fontWeight="600" fill={BLUE} textAnchor="middle">NA</text>
      <text x="304" y="86" fontSize="16" fontWeight="600" fill={INK}>Nguyen An</text>
      <text x="304" y="106" fontSize="12" fill={MUTED}>Unified profile</text>
      <rect x="250" y="126" width="68" height="22" rx="11" fill={BLUE} />
      <text x="284" y="141" fontSize="11" fill="#ffffff" textAnchor="middle">Hot lead</text>
      <rect x="326" y="126" width="48" height="22" rx="11" fill={SOFT} />
      <text x="350" y="141" fontSize="11" fill={INK} textAnchor="middle">Zalo</text>
      <rect x="382" y="126" width="64" height="22" rx="11" fill={SOFT} />
      <text x="414" y="141" fontSize="11" fill={INK} textAnchor="middle">Hanoi</text>
      <line x1="250" x2="458" y1="166" y2="166" stroke={LINE} />
      <text x="250" y="190" fontSize="12" fill={MUTED}>Activity</text>
      <line x1="258" x2="258" y1="214" y2="308" stroke={LINE} />
      {events.map(([ev, when], i) => {
        const cy = 214 + i * 31.5
        return (
          <g key={ev}>
            <circle cx="258" cy={cy} r="4.5" fill={i === 0 ? BLUE : '#ffffff'} stroke={BLUE} strokeWidth="1.5" />
            <text x="274" y={cy + 4.5} fontSize="12.5" fill={INK}>{ev}</text>
            <text x="458" y={cy + 4.5} fontSize="11" fill={MUTED} textAnchor="end">{when}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** Automation: luồng 4 cột Kích hoạt, nền tảng Click Star, mô hình AI, Hành động */
export function AutomationWorkflowIllustration({
  className = 'w-full h-auto',
  label = 'Automation workflow',
  headers = ['TRIGGERS', 'ORCHESTRATION', 'AI MODELS', 'ACTIONS'],
  caption = 'Runs 24/7 with no manual steps',
}: Props & { headers?: string[]; caption?: string }) {
  const cols = [
    { x: 14, w: 112, items: ['New lead form', 'Incoming email', 'Chat message'] },
    { x: 334, w: 112, items: ['Claude', 'GPT-4o', 'Gemini'] },
    { x: 478, w: 108, items: ['Update CRM', 'Send reply', 'Alert team'] },
  ]
  const rows = [96, 160, 224]
  const arrows: [number, number][] = [
    [126, 166],
    [294, 334],
    [446, 478],
  ]
  return (
    <svg viewBox="0 0 600 350" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ap-arrow-au" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M1 1 L7 4 L1 7" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      {[70, 230, 390, 532].map((cx, i) => (
        <text key={cx} x={cx} y="62" fontSize="11" fill={MUTED} textAnchor="middle" letterSpacing="1">{headers[i]}</text>
      ))}
      {arrows.map(([a, b]) =>
        rows.map((y) => (
          <line key={`${a}-${y}`} x1={a} x2={b - 1} y1={y + 22} y2={y + 22} stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ap-arrow-au)" />
        )),
      )}
      {cols.map((c) =>
        c.items.map((label2, r) => (
          <g key={`${c.x}-${label2}`}>
            <rect x={c.x} y={rows[r]} width={c.w} height="44" rx="11" fill="#ffffff" stroke={LINE} />
            <text x={c.x + c.w / 2} y={rows[r] + 26.5} fontSize="13" fill={INK} textAnchor="middle">{label2}</text>
          </g>
        )),
      )}
      <rect x="166" y="96" width="128" height="172" rx="18" fill={BLUE} />
      <text x="230" y="174" fontSize="22" fontWeight="600" fill="#ffffff" textAnchor="middle" letterSpacing="-0.4">Click Star</text>
      <text x="230" y="198" fontSize="12" fill="#ffffff" fillOpacity="0.85" textAnchor="middle">Automation engine</text>
      <text x="300" y="312" fontSize="12" fill={MUTED} textAnchor="middle">{caption}</text>
    </svg>
  )
}

/** Automation (hero): thẻ danh sách việc tự động hoàn tất, thay robot hoạt hình */
export function AutomationChecklistIllustration({ className = 'w-full h-full', label = 'Automation running' }: Props) {
  const rows = [
    { y: 94, w: 92 },
    { y: 120, w: 76 },
    { y: 146, w: 86 },
  ]
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-au" />
      </defs>
      <rect x="22" y="26" width="156" height="148" rx="16" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-au)" />
      <rect x="38" y="42" width="28" height="28" rx="8" fill={BLUE} />
      <path d="M52 49 L54 55 L60 56 L54 58 L52 64 L50 58 L44 56 L50 55 Z" fill="#ffffff" />
      <text x="76" y="54" fontSize="12.5" fontWeight="600" fill={INK}>Automation</text>
      <circle cx="80" cy="64" r="3" fill="#1e6dda" />
      <text x="87" y="67.5" fontSize="10" fill={MUTED}>Running</text>
      {rows.map((r, i) => (
        <g key={r.y}>
          <circle cx="46" cy={r.y + 6} r="8" fill={BLUE} />
          <path d={`M42 ${r.y + 6} L45 ${r.y + 9} L50.5 ${r.y + 3}`} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="62" y={r.y + 2} width={r.w} height="8" rx="4" fill={i === 2 ? INK : LINE} fillOpacity={i === 2 ? 0.85 : 1} />
        </g>
      ))}
    </svg>
  )
}
