/**
 * Ảnh minh họa SVG cho trang CRM & CDP (18/10/2026), cùng ngôn ngữ thị giác với service-illustrations:
 * nền trắng, viền mảnh, một màu xanh, MỘT bóng đổ dưới thẻ chính, không gradient.
 * Quy ước: nét đứt xám = khách CHƯA định danh; nét liền xanh = khách ĐÃ định danh.
 * Mọi chữ trong hình đi qua hàm t(vi, en) để đổi theo ngôn ngữ trang. Số liệu trong hình là minh họa.
 */

const INK = '#1d1d1f'
const MUTED = '#6e6e73'
const LINE = '#e0e0e0'
const SOFT = '#f5f5f7'
const BLUE = '#1e6dda'
const BLUE_DEEP = '#1859b8'
const BLUE_SOFT = '#eaf2fd'
const GREY = '#86868b'

type T = (vi: string, en: string) => string
type Props = { className?: string; label?: string; t: T }

function Shadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="3" dy="5" stdDeviation="15" floodColor="#000000" floodOpacity="0.16" />
    </filter>
  )
}

function Arrow({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </marker>
  )
}

/** Biểu tượng nhỏ vẽ tay bằng nét (tâm tại cx, cy) */
function Glyph({ kind, cx, cy, color = INK }: { kind: 'phone' | 'laptop' | 'chat' | 'globe' | 'ads' | 'handset' | 'mail' | 'crm'; cx: number; cy: number; color?: string }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'phone':
      return <rect x={cx - 5} y={cy - 8} width="10" height="16" rx="2.4" {...p} />
    case 'laptop':
      return (
        <g {...p}>
          <rect x={cx - 8} y={cy - 6} width="16" height="10" rx="1.6" />
          <path d={`M${cx - 11} ${cy + 7} H${cx + 11}`} />
        </g>
      )
    case 'chat':
      return (
        <path
          d={`M${cx - 9} ${cy - 7} h18 a2 2 0 0 1 2 2 v8 a2 2 0 0 1 -2 2 h-9 l-5 4 v-4 h-4 a2 2 0 0 1 -2 -2 v-8 a2 2 0 0 1 2 -2 z`}
          {...p}
        />
      )
    case 'globe':
      return (
        <g {...p}>
          <circle cx={cx} cy={cy} r="8" />
          <ellipse cx={cx} cy={cy} rx="3.6" ry="8" />
          <path d={`M${cx - 8} ${cy} H${cx + 8}`} />
        </g>
      )
    case 'ads':
      return (
        <g {...p}>
          <path d={`M${cx - 7} ${cy + 7} V${cy + 1} M${cx} ${cy + 7} V${cy - 6} M${cx + 7} ${cy + 7} V${cy - 2}`} />
        </g>
      )
    case 'handset':
      return (
        <path
          d={`M${cx - 7} ${cy - 5} c0 7 5 12 12 12 l2 -4 l-4 -2 l-2 2 c-2 -1 -4 -3 -5 -5 l2 -2 l-2 -4 z`}
          {...p}
        />
      )
    case 'mail':
      return (
        <g {...p}>
          <rect x={cx - 9} y={cy - 6} width="18" height="12" rx="2" />
          <path d={`M${cx - 9} ${cy - 4} L${cx} ${cy + 2} L${cx + 9} ${cy - 4}`} />
        </g>
      )
    case 'crm':
      return (
        <g {...p}>
          <circle cx={cx - 3} cy={cy - 3} r="3.4" />
          <path d={`M${cx - 9} ${cy + 7} c0 -4 3 -6 6 -6 s6 2 6 6`} />
          <path d={`M${cx + 5} ${cy - 5} a3 3 0 0 1 0 6 M${cx + 8} ${cy + 3} c2 .6 3 2 3 4`} />
        </g>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* 1. Từ nhiều ID ẩn danh → một hồ sơ đã định danh                              */
/* -------------------------------------------------------------------------- */
export function IdentityResolutionIllustration({
  className = 'w-full h-auto',
  label,
  t,
}: Props) {
  const chips = [
    { x: 20, kind: 'phone' as const, a: t('Facebook Ads', 'Facebook Ads'), b: t('Xem 3 trang', 'Viewed 3 pages'), id: 'a7f3' },
    { x: 185, kind: 'laptop' as const, a: t('Máy tính', 'Laptop'), b: t('Xem bảng giá', 'Viewed pricing'), id: 'c91d' },
    { x: 350, kind: 'chat' as const, a: t('Zalo', 'Zalo'), b: t('Nhắn 2 tin', '2 messages'), id: '5be0' },
  ]
  const history = [
    { a: t('Bấm quảng cáo Facebook', 'Clicked Facebook ad'), w: t('3 ngày trước', '3 days ago'), known: false },
    { a: t('Xem trang Bảng giá ×2', 'Viewed Pricing ×2'), w: t('2 ngày trước', '2 days ago'), known: false },
    { a: t('Nhắn tin Zalo', 'Messaged on Zalo'), w: t('Hôm qua', 'Yesterday'), known: false },
    { a: t('Để lại số điện thoại', 'Shared phone number'), w: t('Hôm nay', 'Today'), known: true },
  ]
  return (
    <svg viewBox="0 0 520 600" className={className} role="img" aria-label={label ?? t('Nhiều ID ẩn danh được gộp thành một hồ sơ khách đã định danh', 'Anonymous visitors become one identified profile')} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-idr" />
        <Arrow id="ap-ar-idr" />
      </defs>

      <text x="20" y="22" fontSize="11.5" fontWeight="600" fill={MUTED} letterSpacing="0.6">
        {t('CHƯA BIẾT LÀ AI · 3 ID ẨN DANH', 'UNKNOWN VISITORS · 3 ANONYMOUS IDS')}
      </text>

      {chips.map((c) => (
        <g key={c.id}>
          <rect x={c.x} y="36" width="150" height="70" rx="14" fill="#ffffff" stroke={GREY} strokeDasharray="5 4" />
          <circle cx={c.x + 28} cy="71" r="16" fill={SOFT} />
          <Glyph kind={c.kind} cx={c.x + 28} cy={71} />
          <text x={c.x + 52} y="67" fontSize="12.5" fontWeight="600" fill={INK}>{c.a}</text>
          <text x={c.x + 52} y="85" fontSize="11.5" fill={MUTED}>{c.b}</text>
          <text x={c.x + 75} y="124" fontSize="11" fill={MUTED} textAnchor="middle">{t('ID ẩn danh', 'Anon ID')} · {c.id}</text>
          <path
            d={`M${c.x + 75} 132 C ${c.x + 75} 162, 260 154, 260 186`}
            fill="none"
            stroke={GREY}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </g>
      ))}

      {/* Điểm định danh */}
      <rect x="100" y="186" width="320" height="96" rx="16" fill="#ffffff" stroke={BLUE} strokeWidth="1.6" />
      <circle cx="138" cy="222" r="18" fill={BLUE} />
      <Glyph kind="phone" cx={138} cy={222} color="#ffffff" />
      <text x="166" y="217" fontSize="14" fontWeight="600" fill={INK}>{t('Để lại số điện thoại', 'Leaves a phone number')}</text>
      <text x="166" y="237" fontSize="13" fill={MUTED}>090•• ••• 321</text>
      <rect x="120" y="248" width="224" height="22" rx="11" fill={BLUE_SOFT} />
      <text x="232" y="263" fontSize="11.5" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">
        {t('Khớp 3 ID ẩn danh theo số điện thoại', 'Matches 3 anonymous IDs by phone')}
      </text>

      <path d="M260 284 V318" stroke={BLUE} strokeWidth="2" fill="none" markerEnd="url(#ap-ar-idr)" />

      {/* Hồ sơ hợp nhất */}
      <rect x="20" y="322" width="480" height="262" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-idr)" />
      <circle cx="62" cy="366" r="22" fill={BLUE_SOFT} />
      <text x="62" y="371" fontSize="14" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">NA</text>
      <text x="98" y="362" fontSize="16" fontWeight="600" fill={INK}>{t('Nguyễn An', 'Nguyen An')}</text>
      <text x="98" y="382" fontSize="12" fill={MUTED}>{t('Hồ sơ hợp nhất · Đã định danh', 'Unified profile · Identified')}</text>
      <rect x="362" y="352" width="118" height="28" rx="14" fill={BLUE} />
      <text x="421" y="371" fontSize="12.5" fontWeight="600" fill="#ffffff" textAnchor="middle">Hot lead · 82</text>
      <line x1="42" x2="478" y1="406" y2="406" stroke={LINE} />
      <text x="42" y="428" fontSize="12" fill={MUTED}>{t('Lịch sử đã được gộp vào hồ sơ', 'History merged into the profile')}</text>

      <line x1="48" x2="48" y1="452" y2="542" stroke={LINE} />
      {history.map((h, i) => {
        const cy = 452 + i * 30
        return (
          <g key={h.a}>
            {h.known ? (
              <circle cx="48" cy={cy} r="5" fill={BLUE} />
            ) : (
              <circle cx="48" cy={cy} r="4.5" fill="#ffffff" stroke={GREY} strokeWidth="1.5" strokeDasharray="2.4 2" />
            )}
            <text x="66" y={cy + 4.5} fontSize="12.5" fontWeight={h.known ? 600 : 400} fill={INK}>{h.a}</text>
            <text x="478" y={cy + 4.5} fontSize="11.5" fill={MUTED} textAnchor="end">{h.w}</text>
          </g>
        )
      })}

      <circle cx="48" cy="568" r="4.5" fill="#ffffff" stroke={GREY} strokeWidth="1.5" strokeDasharray="2.4 2" />
      <text x="60" y="572" fontSize="11" fill={MUTED}>{t('Khi còn ẩn danh', 'While anonymous')}</text>
      <circle cx="206" cy="568" r="5" fill={BLUE} />
      <text x="218" y="572" fontSize="11" fill={MUTED}>{t('Sau khi định danh', 'After identification')}</text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Nhiều nguồn → nền tảng dữ liệu → một hồ sơ → kích hoạt                    */
/* -------------------------------------------------------------------------- */
export function UnifiedDataIllustration({
  className = 'w-full h-auto',
  label,
  t,
}: Props) {
  const sources = [
    { kind: 'globe' as const, name: t('Website', 'Website') },
    { kind: 'ads' as const, name: t('Quảng cáo', 'Ads') },
    { kind: 'chat' as const, name: t('Zalo · Chatbot', 'Zalo · Chatbot') },
    { kind: 'handset' as const, name: t('Tổng đài · POS', 'Call · POS') },
  ]
  const steps = [
    { n: '1', a: t('Thu thập', 'Collect'), b: t('Sự kiện từ mọi kênh', 'Events from all channels') },
    { n: '2', a: t('Định danh', 'Identify'), b: t('Khớp theo SĐT, email', 'Match by phone, email') },
    { n: '3', a: t('Hợp nhất', 'Unify'), b: t('Một hồ sơ duy nhất', 'One single record') },
  ]
  const outs = [
    { kind: 'crm' as const, a: 'CRM', b: t('Giao cho sales', 'Assign to sales') },
    { kind: 'ads' as const, a: t('Quảng cáo', 'Ads'), b: t('Tệp remarketing', 'Retargeting lists') },
    { kind: 'mail' as const, a: 'Email · ZNS', b: t('Chăm sóc tự động', 'Automated care') },
  ]
  const sx = (i: number) => 20 + i * 122 + 56
  return (
    <svg viewBox="0 0 520 520" className={className} role="img" aria-label={label ?? t('Nhiều nguồn dữ liệu hợp nhất thành một hồ sơ khách hàng', 'Many sources become one customer record')} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-udi" />
        <Arrow id="ap-ar-udi" />
      </defs>

      <text x="20" y="20" fontSize="11.5" fontWeight="600" fill={MUTED} letterSpacing="0.6">{t('NGUỒN DỮ LIỆU', 'DATA SOURCES')}</text>
      {sources.map((s, i) => {
        const x = 20 + i * 122
        return (
          <g key={s.name}>
            <rect x={x} y="32" width="112" height="68" rx="14" fill="#ffffff" stroke={LINE} />
            <circle cx={x + 56} cy="55" r="15" fill={BLUE_SOFT} />
            <Glyph kind={s.kind} cx={x + 56} cy={55} color={BLUE_DEEP} />
            <text x={x + 56} y="89" fontSize="12" fill={INK} textAnchor="middle">{s.name}</text>
            <path d={`M${sx(i)} 100 V124`} stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
          </g>
        )
      })}
      <path d={`M${sx(0)} 124 H${sx(3)}`} stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M260 124 V146" stroke={BLUE} strokeWidth="2" fill="none" markerEnd="url(#ap-ar-udi)" />

      {/* Nền tảng */}
      <rect x="20" y="150" width="480" height="230" rx="18" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-udi)" />
      <text x="44" y="182" fontSize="14" fontWeight="600" fill={INK}>{t('Nền tảng dữ liệu khách hàng (CDP)', 'Customer Data Platform (CDP)')}</text>
      {steps.map((s, i) => {
        const x = 44 + i * 148
        return (
          <g key={s.n}>
            <rect x={x} y="198" width="136" height="38" rx="12" fill={i === 2 ? BLUE : SOFT} />
            <circle cx={x + 20} cy="217" r="9" fill={i === 2 ? '#ffffff' : BLUE} />
            <text x={x + 20} y="221" fontSize="11" fontWeight="600" fill={i === 2 ? BLUE_DEEP : '#ffffff'} textAnchor="middle">{s.n}</text>
            <text x={x + 38} y="221.5" fontSize="13" fontWeight="600" fill={i === 2 ? '#ffffff' : INK}>{s.a}</text>
            <text x={x + 68} y="256" fontSize="11" fill={MUTED} textAnchor="middle">{s.b}</text>
            {i < 2 && <path d={`M${x + 139} 217 h6`} stroke={GREY} strokeWidth="1.6" strokeLinecap="round" />}
          </g>
        )
      })}
      <rect x="44" y="274" width="432" height="80" rx="14" fill={BLUE_SOFT} />
      <circle cx="84" cy="314" r="21" fill="#ffffff" />
      <text x="84" y="319" fontSize="13.5" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">NA</text>
      <text x="118" y="308" fontSize="15" fontWeight="600" fill={INK}>{t('Nguyễn An', 'Nguyen An')}</text>
      <text x="118" y="329" fontSize="12" fill={MUTED}>{t('Gộp từ 4 nguồn · 28 sự kiện', 'Merged from 4 sources · 28 events')}</text>
      <rect x="388" y="300" width="72" height="28" rx="14" fill={BLUE} />
      <text x="424" y="318.5" fontSize="12.5" fontWeight="600" fill="#ffffff" textAnchor="middle">{t('1 hồ sơ', '1 record')}</text>

      {/* Kích hoạt */}
      <path d="M260 380 V404" stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M95 404 H425" stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      {outs.map((o, i) => {
        const x = 20 + i * 165
        const cx = x + 75
        return (
          <g key={o.a}>
            <path d={`M${cx} 404 V422`} stroke={BLUE} strokeWidth="2" fill="none" markerEnd="url(#ap-ar-udi)" />
            <rect x={x} y="428" width="150" height="72" rx="14" fill="#ffffff" stroke={LINE} />
            <circle cx={x + 26} cy="464" r="15" fill={BLUE} />
            <Glyph kind={o.kind} cx={x + 26} cy={464} color="#ffffff" />
            <text x={x + 50} y="460" fontSize="13" fontWeight="600" fill={INK}>{o.a}</text>
            <text x={x + 50} y="479" fontSize="11" fill={MUTED}>{o.b}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Luồng chăm sóc theo điểm: Nóng, Ấm, Lạnh + vòng quay lại                  */
/* -------------------------------------------------------------------------- */
export function FollowUpFlowIllustration({
  className = 'w-full h-auto',
  label,
  t,
}: Props) {
  const tiers = [
    {
      x: 20,
      head: t('Nóng', 'Hot'),
      range: t('từ 70 điểm', '70+ points'),
      fill: BLUE,
      ink: '#ffffff',
      acts: [t('Báo sales ngay', 'Alert sales now'), t('Gọi trong 15 phút', 'Call within 15 min'), t('Nhắn Zalo xác nhận', 'Confirm via Zalo'), t('Tạo việc trong CRM', 'Create CRM task')],
    },
    {
      x: 185,
      head: t('Ấm', 'Warm'),
      range: t('40 đến 69 điểm', '40 to 69 points'),
      fill: BLUE_SOFT,
      ink: BLUE_DEEP,
      acts: [t('Gửi ZNS hữu ích', 'Send helpful ZNS'), t('Email 3 bước', '3-step email'), t('Mời xem demo', 'Invite to a demo'), t('Chấm lại sau 7 ngày', 'Re-score in 7 days')],
    },
    {
      x: 350,
      head: t('Lạnh', 'Cold'),
      range: t('dưới 40 điểm', 'under 40 points'),
      fill: SOFT,
      ink: INK,
      acts: [t('Chạy lại quảng cáo', 'Retarget with ads'), t('Bản tin hàng tháng', 'Monthly newsletter'), t('Không làm phiền', 'No pressure'), t('Theo dõi quay lại', 'Watch for return')],
    },
  ]
  return (
    <svg viewBox="0 0 520 580" className={className} role="img" aria-label={label ?? t('Chấm điểm khách và luồng chăm sóc theo nhóm Nóng, Ấm, Lạnh', 'Lead scoring and follow-up flow')} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <Shadow id="ap-sh-fuf" />
        <Arrow id="ap-ar-fuf" />
      </defs>

      <rect x="90" y="20" width="340" height="58" rx="14" fill="#ffffff" stroke={LINE} filter="url(#ap-sh-fuf)" />
      <text x="260" y="45" fontSize="13.5" fontWeight="600" fill={INK} textAnchor="middle">{t('Khách để lại thông tin hoặc nhắn tin', 'A customer shares details or sends a message')}</text>
      <text x="260" y="64" fontSize="11.5" fill={MUTED} textAnchor="middle">{t('Form · Zalo · Chatbot · Cuộc gọi', 'Form · Zalo · Chatbot · Call')}</text>

      <path d="M260 78 V104" stroke={BLUE} strokeWidth="2" fill="none" markerEnd="url(#ap-ar-fuf)" />

      <rect x="140" y="108" width="240" height="64" rx="14" fill={BLUE} />
      <text x="260" y="136" fontSize="14.5" fontWeight="600" fill="#ffffff" textAnchor="middle">{t('Chấm điểm tự động', 'Automatic scoring')}</text>
      <text x="260" y="155" fontSize="12" fill="#ffffff" textAnchor="middle">{t('Hành vi + thông tin để lại', 'Behavior + details shared')}</text>

      <path d="M260 172 V194" stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      <path d="M95 194 H425" stroke={BLUE} strokeOpacity="0.55" strokeWidth="1.5" fill="none" />
      {tiers.map((tr) => {
        const cx = tr.x + 75
        return (
          <g key={tr.head}>
            <path d={`M${cx} 194 V214`} stroke={BLUE} strokeWidth="2" fill="none" markerEnd="url(#ap-ar-fuf)" />
            <rect x={tr.x} y="220" width="150" height="248" rx="16" fill="#ffffff" stroke={LINE} />
            <rect x={tr.x + 14} y="236" width="64" height="26" rx="13" fill={tr.fill} stroke={tr.fill === SOFT ? LINE : 'none'} />
            <text x={tr.x + 46} y="254" fontSize="13" fontWeight="600" fill={tr.ink} textAnchor="middle">{tr.head}</text>
            <text x={tr.x + 14} y="286" fontSize="11.5" fill={MUTED}>{tr.range}</text>
            <line x1={tr.x + 14} x2={tr.x + 136} y1="300" y2="300" stroke={LINE} />
            {tr.acts.map((a, i) => (
              <g key={a}>
                <circle cx={tr.x + 20} cy={326 + i * 34} r="3.5" fill={BLUE} />
                <text x={tr.x + 32} y={330 + i * 34} fontSize="11.5" fill={INK}>{a}</text>
              </g>
            ))}
          </g>
        )
      })}

      {/* Vòng quay lại */}
      {[95, 260, 425].map((cx) => (
        <path key={cx} d={`M${cx} 494 V474`} stroke={BLUE} strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#ap-ar-fuf)" />
      ))}
      <rect x="20" y="494" width="480" height="64" rx="14" fill={BLUE_SOFT} />
      <text x="260" y="522" fontSize="13" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">{t('Khách quay lại xem bảng giá, điểm tăng,', 'The customer revisits pricing, the score rises,')}</text>
      <text x="260" y="542" fontSize="13" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">{t('hệ thống tự chuyển sang nhóm cao hơn', 'and the system moves them up automatically')}</text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. Thanh hành trình 5 chặng: ẩn danh (nét đứt) sang định danh (nét liền)     */
/* -------------------------------------------------------------------------- */
export function JourneyRailIllustration({
  className = 'w-full h-auto',
  label,
  t,
}: Props) {
  const stages = [
    { a: t('Biết đến', 'Aware'), b: t('Thấy quảng cáo, bài viết', 'Sees an ad or post') },
    { a: t('Quan tâm', 'Interested'), b: t('Xem bảng giá, quay lại', 'Views pricing, returns') },
    { a: t('Để lại thông tin', 'Shares details'), b: t('Form, Zalo, cuộc gọi', 'Form, Zalo or call') },
    { a: t('Mua hàng', 'Buys'), b: t('Chốt đơn trong CRM', 'Closes in the CRM') },
    { a: t('Quay lại', 'Returns'), b: t('Chăm sóc sau bán', 'After-sales care') },
  ]
  const nx = (i: number) => 96 + i * 192
  return (
    <svg viewBox="0 0 960 240" className={className} role="img" aria-label={label ?? t('Hành trình khách hàng từ ẩn danh đến đã định danh', 'Customer journey from anonymous to identified')} xmlns="http://www.w3.org/2000/svg">
      <text x="210" y="26" fontSize="13" fontWeight="600" fill={MUTED} textAnchor="middle">{t('Khách ẩn danh · chưa biết là ai', 'Anonymous · identity unknown')}</text>
      <path d="M40 52 v-8 h340 v8" fill="none" stroke={GREY} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="654" y="26" fontSize="13" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">{t('Khách đã định danh · có hồ sơ trong CRM', 'Identified · has a CRM profile')}</text>
      <path d="M388 52 v-8 h532 v8" fill="none" stroke={BLUE} strokeWidth="1.5" />

      <path d={`M${nx(0)} 118 H384`} stroke={GREY} strokeWidth="2" strokeDasharray="6 5" />
      <path d={`M384 118 H${nx(4)}`} stroke={BLUE} strokeWidth="3" />

      {stages.map((s, i) => {
        const known = i >= 2
        return (
          <g key={s.a}>
            <circle
              cx={nx(i)}
              cy="118"
              r="26"
              fill={known ? BLUE : '#ffffff'}
              stroke={known ? BLUE : GREY}
              strokeWidth="2"
              strokeDasharray={known ? undefined : '5 4'}
            />
            <text x={nx(i)} y="125" fontSize="19" fontWeight="600" fill={known ? '#ffffff' : INK} textAnchor="middle">{i + 1}</text>
            <text x={nx(i)} y="180" fontSize="15" fontWeight="600" fill={INK} textAnchor="middle">{s.a}</text>
            <text x={nx(i)} y="202" fontSize="12.5" fill={MUTED} textAnchor="middle">{s.b}</text>
          </g>
        )
      })}

      <rect x="340" y="105" width="88" height="26" rx="13" fill="#ffffff" stroke={BLUE} strokeWidth="1.5" />
      <text x="384" y="122.5" fontSize="12" fontWeight="600" fill={BLUE_DEEP} textAnchor="middle">{t('SĐT / Email', 'Phone / Email')}</text>
    </svg>
  )
}
