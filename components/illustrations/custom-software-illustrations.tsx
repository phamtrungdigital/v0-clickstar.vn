/**
 * Sơ đồ kỹ thuật cho trang "Phần mềm theo yêu cầu" (18/10/2026).
 * Vẽ theo quy ước bản vẽ kỹ thuật chứ không theo kiểu minh hoạ: nền trắng, nét 1px, góc gần vuông,
 * đường nối vuông góc có chấm nối, nhãn chữ đơn cách (monospace) viết đúng tên thành phần thật,
 * khung viền kèm khối tiêu đề. Một màu xanh duy nhất đánh dấu đường đi quan trọng.
 * Không gradient, không bóng, không biểu tượng hoạt hình. Mọi chữ đi qua t(vi, en).
 * Mỗi sơ đồ khớp với mã nguồn trích ngay trên trang (cùng thứ tự kiểm tra, cùng tên hàm).
 */

const INK = '#1d1d1f'
const MUTED = '#6e6e73'
const LINE = '#d2d2d7'
const HAIR = '#e0e0e0'
const PAPER = '#ffffff'
const SOFT = '#f5f5f7'
const BLUE = '#1e6dda'
const BLUE_DEEP = '#1859b8'
const BLUE_SOFT = '#eaf2fd'

const MONO = 'var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace'
const SANS = "system-ui, -apple-system, 'Inter', 'Segoe UI', sans-serif"

type T = (vi: string, en: string) => string
type Props = { className?: string; label?: string; t: T }

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker id={`${id}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0.5 1 L9 5 L0.5 9 Z" fill={BLUE} />
      </marker>
      <marker id={`${id}-g`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M0.5 1 L9 5 L0.5 9 Z" fill={MUTED} />
      </marker>
      <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="0.5" cy="0.5" r="0.7" fill="#d9d9de" />
      </pattern>
    </defs>
  )
}

/** Khung bản vẽ: viền, lưới chấm rất nhạt, khối tiêu đề góc phải dưới */
function Sheet({ w, h, id, title, sub }: { w: number; h: number; id: string; title: string; sub: string }) {
  const tw = 300
  return (
    <g>
      <rect x="0.5" y="0.5" width={w - 1} height={h - 1} fill={PAPER} stroke={LINE} />
      <rect x="1" y="1" width={w - 2} height={h - 2} fill={`url(#${id}-grid)`} />
      <g fontFamily={MONO} fontSize="10">
        <rect x={w - tw - 12} y={h - 40} width={tw} height="28" fill={PAPER} stroke={LINE} />
        <line x1={w - tw - 12 + 84} x2={w - tw - 12 + 84} y1={h - 40} y2={h - 12} stroke={LINE} />
        <text x={w - tw - 12 + 8} y={h - 22} fill={MUTED}>Click Star</text>
        <text x={w - tw - 12 + 92} y={h - 28} fill={INK} fontWeight="600">{title}</text>
        <text x={w - tw - 12 + 92} y={h - 17} fill={MUTED}>{sub}</text>
      </g>
    </g>
  )
}

function Node({
  x, y, w, h, title, sub, accent = false, dashed = false, fill = PAPER,
}: { x: number; y: number; w: number; h: number; title: string; sub?: string; accent?: boolean; dashed?: boolean; fill?: string }) {
  return (
    <g>
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={w}
        height={h}
        rx="3"
        fill={fill}
        stroke={accent ? BLUE : INK}
        strokeWidth={accent ? 1.5 : 1}
        strokeDasharray={dashed ? '4 3' : undefined}
      />
      <text x={x + 12} y={y + (sub ? 24 : h / 2 + 4.5)} fontFamily={SANS} fontSize="13" fontWeight="600" fill={INK}>{title}</text>
      {sub && <text x={x + 12} y={y + 42} fontFamily={MONO} fontSize="10.5" fill={MUTED}>{sub}</text>}
    </g>
  )
}

function Zone({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w} height={h} rx="4" fill="none" stroke={MUTED} strokeDasharray="5 4" />
      <rect x={x + 10} y={y - 6} width={label.length * 6.6 + 12} height="12" fill={PAPER} />
      <text x={x + 16} y={y + 4} fontFamily={MONO} fontSize="10" fill={MUTED} letterSpacing="0.6">{label}</text>
    </g>
  )
}

/** Ngắt dòng theo số ký tự tối đa (SVG không tự xuống dòng) */
function wrap(text: string, max: number): string[] {
  const out: string[] = []
  let cur = ''
  for (const w of text.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur)
      cur = w
    } else cur = cur ? cur + ' ' + w : w
  }
  if (cur) out.push(cur)
  return out.slice(0, 3)
}

function Dot({ x, y, c = BLUE }: { x: number; y: number; c?: string }) {
  return <circle cx={x} cy={y} r="3" fill={c} />
}

function Tag({ x, y, text, accent = false }: { x: number; y: number; text: string; accent?: boolean }) {
  const w = text.length * 6.4 + 12
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={w} height="18" rx="2" fill={accent ? BLUE_SOFT : SOFT} stroke={accent ? BLUE : LINE} />
      <text x={x + 6} y={y + 13} fontFamily={MONO} fontSize="10.5" fill={accent ? BLUE_DEEP : INK}>{text}</text>
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. Kiến trúc tham chiếu                                                     */
/* -------------------------------------------------------------------------- */
export function ArchitectureDiagram({ className = 'w-full h-auto', label, t }: Props) {
  const id = 'cs-arch'
  return (
    <svg viewBox="0 0 960 560" className={className} role="img" aria-label={label ?? t('Kiến trúc tham chiếu', 'Reference architecture')} xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: MONO }}>
      <Defs id={id} />
      <Sheet w={960} h={560} id={id} title={t('KIẾN TRÚC THAM CHIẾU', 'REFERENCE ARCHITECTURE')} sub={t('mô hình triển khai mặc định', 'default deployment model')} />

      <Zone x={24} y={48} w={160} h={312} label={t('NGƯỜI DÙNG', 'CLIENTS')} />
      <Zone x={216} y={48} w={168} h={312} label={t('BIÊN', 'EDGE')} />
      <Zone x={416} y={48} w={232} h={312} label={t('ỨNG DỤNG', 'APPLICATION')} />
      <Zone x={680} y={48} w={256} h={312} label={t('DỮ LIỆU', 'DATA')} />

      {/* Người dùng */}
      <Node x={40} y={84} w={128} h={60} title={t('Trình duyệt', 'Browser')} sub="web · PWA" />
      <Node x={40} y={168} w={128} h={60} title={t('Điện thoại', 'Phone')} sub={t('cài lên màn hình', 'home-screen app')} />
      <Node x={40} y={252} w={128} h={60} title={t('Hệ thống đối tác', 'Partner systems')} sub="REST · webhook" />

      {/* Biên */}
      <Node x={232} y={84} w={136} h={60} title="CDN + WAF" sub="TLS 1.2+" />
      <Node x={232} y={168} w={136} h={60} title={t('Giới hạn tần suất', 'Rate limiting')} sub={t('chặn dò mật khẩu', 'blocks brute force')} />
      <Node x={232} y={252} w={136} h={60} title={t('Xác thực phiên', 'Session auth')} sub={t('JWT · 2FA quản trị', 'JWT · admin 2FA')} />

      {/* Ứng dụng */}
      <Node x={432} y={84} w={200} h={92} title={t('Máy chủ ứng dụng', 'Application server')} sub="Next.js · Node.js" accent />
      <Tag x={444} y={146} text="RBAC" accent />
      <Tag x={496} y={146} text="zod" accent />
      <Tag x={538} y={146} text="audit" accent />
      <Node x={432} y={196} w={200} h={64} title={t('Tác vụ nền', 'Background jobs')} sub="cron · queue · workflow" />
      <Node x={432} y={280} w={200} h={64} title={t('Mô-đun AI', 'AI module')} sub={t('chỉ gọi từ máy chủ', 'server-side calls only')} />

      {/* Dữ liệu */}
      <Node x={696} y={84} w={224} h={92} title="PostgreSQL" sub="Row Level Security" accent />
      <Tag x={708} y={146} text={t('theo tổ chức', 'per tenant')} accent />
      <Tag x={804} y={146} text={t('theo chi nhánh', 'per branch')} accent />
      <Node x={696} y={196} w={224} h={64} title="audit_log" sub={t('chỉ ghi thêm · không sửa/xoá', 'append-only · no update/delete')} />
      <Node x={696} y={280} w={224} h={64} title={t('Tệp và sao lưu', 'Files and backups')} sub={t('sao lưu hằng ngày · khôi phục', 'daily backup · restore')} />

      {/* Đường nối chính */}
      {[114, 198, 282].map((y) => (
        <line key={y} x1="168" x2="231" y1={y} y2={y} stroke={INK} strokeWidth="1" markerEnd={`url(#${id}-g)`} />
      ))}
      <path d="M368 114 H400 V282 M368 198 H400 M368 282 H400" fill="none" stroke={INK} />
      <Dot x={400} y={198} c={INK} />
      <path d="M400 130 H431" stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />
      <Dot x={400} y={130} />
      <rect x="372" y="98" width="30" height="13" fill={PAPER} />
      <text x="374" y="108" fontFamily={MONO} fontSize="9.5" fill={MUTED}>TLS</text>

      <path d="M632 118 H695" stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />
      <rect x="634" y="99" width="58" height="13" fill={PAPER} />
      <text x="636" y="109" fontFamily={MONO} fontSize="9.5" fill={BLUE_DEEP}>SQL+RLS</text>
      <path d="M648 152 H664 V228 H695" stroke={INK} fill="none" markerEnd={`url(#${id}-g)`} />
      <path d="M632 152 H648" stroke={INK} fill="none" />
      <Dot x={648} y={152} c={INK} />

      {/* Nối nội bộ dọc */}
      <path d="M532 176 V196" stroke={MUTED} strokeDasharray="3 3" markerEnd={`url(#${id}-g)`} fill="none" />
      <path d="M532 260 V280" stroke={MUTED} strokeDasharray="3 3" markerEnd={`url(#${id}-g)`} fill="none" />

      {/* Tích hợp ngoài */}
      <Zone x={24} y={392} w={912} h={80} label={t('KẾT NỐI RA NGOÀI (QUA MÁY CHỦ)', 'OUTBOUND (VIA SERVER ONLY)')} />
      <Node x={232} y={410} w={200} h={46} title={t('CRM · kế toán · kho', 'CRM · accounting · inventory')} />
      <Node x={448} y={410} w={200} h={46} title="Zalo · Email · SMS" />
      <Node x={680} y={410} w={240} h={46} title="Claude · GPT · Gemini" accent />
      <path d="M432 260 V380 H332 V409" fill="none" stroke={INK} markerEnd={`url(#${id}-g)`} />
      <path d="M432 230 H416 V384 H548 V409" fill="none" stroke={INK} markerEnd={`url(#${id}-g)`} />
      <Dot x={416} y={230} c={INK} />
      <path d="M532 344 V366 H800 V409" fill="none" stroke={BLUE} strokeWidth="1.5" markerEnd={`url(#${id}-a)`} />
      <Dot x={532} y={344} />

      {/* Môi trường */}
      <g fontFamily={MONO} fontSize="10.5">
        <text x="40" y="502" fill={MUTED} letterSpacing="0.6">{t('MÔI TRƯỜNG', 'ENVIRONMENTS')}</text>
        {[['dev', 40], ['staging', 112], ['production', 204]].map(([n, x], i) => (
          <g key={n as string}>
            <rect x={(x as number) + 0.5} y="512.5" width={(n as string).length * 7 + 22} height="22" rx="2" fill={i === 2 ? BLUE_SOFT : SOFT} stroke={i === 2 ? BLUE : LINE} />
            <text x={(x as number) + 11} y="527.5" fill={i === 2 ? BLUE_DEEP : INK}>{n}</text>
            {i < 2 && <line x1={(x as number) + (n as string).length * 7 + 26} x2={(x as number) + (n as string).length * 7 + 44} y1="523.5" y2="523.5" stroke={MUTED} markerEnd={`url(#${id}-g)`} />}
          </g>
        ))}
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Một yêu cầu đi qua 6 chốt kiểm tra                                        */
/* -------------------------------------------------------------------------- */
export function RequestFlowDiagram({ className = 'w-full h-auto', label, t }: Props) {
  const id = 'cs-flow'
  const steps = [
    { n: '01', a: t('Lớp biên', 'Edge'), code: 'TLS · rate-limit', stop: t('dò mật khẩu, lưu lượng bất thường', 'brute force, abusive traffic') },
    { n: '02', a: t('Phiên', 'Session'), code: 'verifyToken()', stop: t('token giả, hết hạn', 'forged or expired tokens') },
    { n: '03', a: t('Vai trò', 'Role'), code: 'requireRole()', stop: t('vượt quyền, tin giao diện', 'privilege escalation') },
    { n: '04', a: t('Dữ liệu vào', 'Input'), code: 'schema.parse()', stop: t('sai kiểu, thiếu trường, chèn mã', 'bad types, injection') },
    { n: '05', a: t('Chính sách', 'Policy'), code: 'RLS policy', stop: t('đọc chéo chi nhánh, tổ chức', 'cross-branch reads') },
    { n: '06', a: t('Nhật ký', 'Audit'), code: 'audit.log()', stop: t('sửa dấu vết, chối bỏ thao tác', 'tampering, repudiation') },
  ]
  const x0 = 32
  const bw = 136
  const gap = 16
  return (
    <svg viewBox="0 0 960 300" className={className} role="img" aria-label={label ?? t('Một yêu cầu đi qua sáu chốt kiểm tra', 'Request path with six checkpoints')} xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: MONO }}>
      <Defs id={id} />
      <Sheet w={960} h={300} id={id} title={t('LUỒNG MỘT YÊU CẦU', 'REQUEST PATH')} sub={t('6 chốt, thứ tự cố định', '6 checkpoints, fixed order')} />

      <text x={x0} y="30" fontFamily={MONO} fontSize="10" fill={MUTED} letterSpacing="0.6">{t('YÊU CẦU TỪ TRÌNH DUYỆT', 'REQUEST FROM THE BROWSER')}</text>
      <path d={`M${x0} 44 H${960 - 32}`} stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />

      {steps.map((s, i) => {
        const x = x0 + i * (bw + gap)
        return (
          <g key={s.n}>
            <rect x={x + 0.5} y="64.5" width={bw} height="112" rx="3" fill={PAPER} stroke={i === 4 ? BLUE : INK} strokeWidth={i === 4 ? 1.5 : 1} />
            <rect x={x + 0.5} y="64.5" width={bw} height="22" rx="3" fill={i === 4 ? BLUE : INK} />
            <rect x={x + 0.5} y="78.5" width={bw} height="8" fill={i === 4 ? BLUE : INK} />
            <text x={x + 10} y="80" fontFamily={MONO} fontSize="11" fill="#ffffff" fontWeight="600">{s.n}</text>
            <text x={x + 34} y="80" fontFamily={SANS} fontSize="12" fill="#ffffff" fontWeight="600">{s.a}</text>
            <text x={x + 10} y="112" fontFamily={MONO} fontSize="10" fill={BLUE_DEEP}>{s.code}</text>
            <line x1={x + 10} x2={x + bw - 8} y1="124" y2="124" stroke={HAIR} />
            <text x={x + 10} y="139" fontFamily={MONO} fontSize="9.5" fill={MUTED}>{t('chặn:', 'blocks:')}</text>
            {wrap(s.stop, 19).map((line, k) => (
              <text key={k} x={x + 10} y={152 + k * 12} fontFamily={SANS} fontSize="11" fill={INK}>{line}</text>
            ))}
            {i < steps.length - 1 && <line x1={x + bw + 1} x2={x + bw + gap - 1} y1="112" y2="112" stroke={INK} markerEnd={`url(#${id}-g)`} />}
            <line x1={x + bw / 2} x2={x + bw / 2} y1="44" y2="64" stroke={LINE} strokeDasharray="2 3" />
            <Dot x={x + bw / 2} y={44} />
          </g>
        )
      })}

      <text x={x0} y="196" fontFamily={MONO} fontSize="10" fill={MUTED} letterSpacing="0.6">{t('PHẠM VI TIN CẬY', 'TRUST SCOPE')}</text>
      <path d={`M${x0} 206 v6 H${x0 + 3 * bw + 2 * gap} v-6`} fill="none" stroke={MUTED} />
      <text x={x0 + (3 * bw + 2 * gap) / 2} y="230" fontFamily={SANS} fontSize="12" fill={INK} textAnchor="middle">{t('Kiểm tra ở máy chủ, không tin dữ liệu từ giao diện', 'Checked on the server, nothing from the client is trusted')}</text>
      <path d={`M${x0 + 3 * (bw + gap)} 206 v6 H${x0 + 6 * bw + 5 * gap} v-6`} fill="none" stroke={BLUE} />
      <text x={x0 + 3 * (bw + gap) + (3 * bw + 2 * gap) / 2} y="230" fontFamily={SANS} fontSize="12" fill={INK} textAnchor="middle">{t('Ràng buộc ở cơ sở dữ liệu, kể cả khi mã ứng dụng sai', 'Enforced in the database, even if application code is wrong')}</text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Đường đi của AI: từ đầu vào đến hệ thống ghi nhận                          */
/* -------------------------------------------------------------------------- */
export function AiPipelineDiagram({ className = 'w-full h-auto', label, t }: Props) {
  const id = 'cs-ai'
  return (
    <svg viewBox="0 0 960 440" className={className} role="img" aria-label={label ?? t('Đường đi xử lý của AI', 'AI processing pipeline')} xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: MONO }}>
      <Defs id={id} />
      <Sheet w={960} h={440} id={id} title={t('ĐƯỜNG ĐI CỦA AI', 'AI PROCESSING PATH')} sub={t('mọi lượt gọi đi qua máy chủ', 'every call goes via the server')} />

      {/* Đầu vào */}
      <Node x={24} y={64} w={156} h={44} title={t('Tài liệu, hợp đồng', 'Documents, contracts')} />
      <Node x={24} y={124} w={156} h={44} title={t('Cuộc gọi, tin nhắn', 'Calls, messages')} />
      <Node x={24} y={184} w={156} h={44} title={t('Câu hỏi của nhân viên', 'Staff questions')} />
      <path d="M180 86 H204 M180 146 H204 M180 206 H204 M204 86 V206 M204 146 H224" fill="none" stroke={INK} />
      <Dot x={204} y={146} c={INK} />

      {/* Bước 1 */}
      <Node x={224} y={104} w={168} h={84} title={t('1. Làm sạch', '1. Sanitize')} sub={t('che thông tin nhạy cảm', 'mask sensitive fields')} />
      <path d="M392 146 H420" stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />

      {/* Bước 2 */}
      <Node x={424} y={104} w={168} h={84} title={t('2. Truy xuất', '2. Retrieve')} sub={t('kho tri thức đã duyệt', 'approved knowledge')} />
      <text x="436" y="176" fontFamily={MONO} fontSize="9.5" fill={MUTED}>{t('lọc theo quyền người hỏi', 'filtered by asker role')}</text>
      <path d="M592 146 H620" stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />

      {/* Bước 3: định tuyến mô hình */}
      <rect x="624.5" y="56.5" width="176" height="188" rx="3" fill={BLUE_SOFT} stroke={BLUE} strokeWidth="1.5" />
      <text x="636" y="80" fontFamily={SANS} fontSize="13" fontWeight="600" fill={INK}>{t('3. Chọn mô hình', '3. Route to model')}</text>
      <rect x="636.5" y="94.5" width="152" height="52" rx="2" fill={PAPER} stroke={BLUE} />
      <text x="646" y="114" fontFamily={MONO} fontSize="10" fill={BLUE_DEEP} fontWeight="600">{t('TÁC VỤ KHÓ', 'HARD TASKS')}</text>
      <text x="646" y="132" fontFamily={SANS} fontSize="12" fill={INK}>Claude · GPT · Gemini</text>
      <rect x="636.5" y="156.5" width="152" height="52" rx="2" fill={PAPER} stroke={LINE} />
      <text x="646" y="176" fontFamily={MONO} fontSize="10" fill={MUTED} fontWeight="600">{t('TÁC VỤ LẶP LẠI', 'ROUTINE TASKS')}</text>
      <text x="646" y="194" fontFamily={SANS} fontSize="12" fill={INK}>{t('mô hình nhanh, rẻ', 'fast, low-cost model')}</text>
      <text x="636" y="230" fontFamily={MONO} fontSize="9.5" fill={MUTED}>{t('dự phòng khi nhà cung cấp lỗi', 'fallback on provider outage')}</text>
      <path d="M800 146 H828" stroke={BLUE} strokeWidth="1.5" fill="none" markerEnd={`url(#${id}-a)`} />

      {/* Bước 4 */}
      <Node x={832} y={104} w={104} h={84} title={t('4. Kiểm', '4. Verify')} sub="schema" />
      <text x="844" y="168" fontFamily={MONO} fontSize="9.5" fill={MUTED}>{t('trích dẫn nguồn', 'cites sources')}</text>
      <text x="844" y="180" fontFamily={MONO} fontSize="9.5" fill={MUTED}>{t('ngưỡng tin cậy', 'confidence')}</text>

      {/* Rẽ nhánh sau kiểm */}
      <path d="M884 188 V354 H685" fill="none" stroke={INK} markerEnd={`url(#${id}-g)`} />
      <path d="M884 286 H685" fill="none" stroke={INK} markerEnd={`url(#${id}-g)`} />
      <Dot x={884} y={286} c={INK} />

      <Node x={444} y={260} w={240} h={52} title={t('Tự động ghi vào hệ thống', 'Auto-write to the system')} sub={t('khi vượt ngưỡng tin cậy', 'above confidence threshold')} />
      <Node x={444} y={328} w={240} h={52} title={t('Người duyệt xác nhận', 'Human review')} sub={t('khi dưới ngưỡng hoặc nhạy cảm', 'below threshold or sensitive')} accent />
      <path d="M444 286 H408 V386 H253" fill="none" stroke={BLUE} strokeWidth="1.5" markerEnd={`url(#${id}-a)`} />
      <path d="M444 354 H408" fill="none" stroke={BLUE} strokeWidth="1.5" />
      <Dot x={408} y={354} />

      <Node x={24} y={360} w={228} h={52} title={t('Hệ thống ghi nhận', 'System of record')} sub="PostgreSQL · audit_log" accent />

      {/* Nhật ký chạy */}
      <rect x="24.5" y="262.5" width="228" height="64" rx="2" fill={PAPER} stroke={LINE} strokeDasharray="4 3" />
      <text x="36" y="282" fontFamily={MONO} fontSize="10" fill={MUTED} fontWeight="600">{t('GHI LẠI MỖI LƯỢT', 'LOGGED PER CALL')}</text>
      <text x="36" y="300" fontFamily={MONO} fontSize="10" fill={INK}>prompt@ver · token · cost</text>
      <text x="36" y="314" fontFamily={MONO} fontSize="10" fill={INK}>model · reviewer · latency</text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. Đường phát hành: từ nhánh code đến vận hành, có đường quay lui              */
/* -------------------------------------------------------------------------- */
export function ReleasePipelineDiagram({ className = 'w-full h-auto', label, t }: Props) {
  const id = 'cs-rel'
  const stages = [
    { a: t('Nhánh tính năng', 'Feature branch'), b: 'git · commit' },
    { a: t('Xem xét mã', 'Code review'), b: t('người thứ hai', 'second engineer') },
    { a: t('Kiểm tự động', 'Automated checks'), b: 'typecheck · tests' },
    { a: t('Môi trường thử', 'Staging'), b: t('link để duyệt', 'link for sign-off') },
    { a: t('Hệ thống chính', 'Production'), b: t('có kiểm soát', 'controlled') },
  ]
  const x0 = 28
  const w = 160
  const gap = 30
  return (
    <svg viewBox="0 0 960 250" className={className} role="img" aria-label={label ?? t('Đường phát hành', 'Release pipeline')} xmlns="http://www.w3.org/2000/svg" style={{ fontFamily: MONO }}>
      <Defs id={id} />
      <Sheet w={960} h={250} id={id} title={t('ĐƯỜNG PHÁT HÀNH', 'RELEASE PIPELINE')} sub={t('mỗi thay đổi đi qua cả 5 bước', 'every change passes all 5 steps')} />
      {stages.map((s, i) => {
        const x = x0 + i * (w + gap)
        const last = i === stages.length - 1
        return (
          <g key={s.a}>
            <rect x={x + 0.5} y="52.5" width={w} height="84" rx="3" fill={last ? BLUE_SOFT : PAPER} stroke={last ? BLUE : INK} strokeWidth={last ? 1.5 : 1} />
            <text x={x + 10} y="72" fontFamily={MONO} fontSize="10" fill={last ? BLUE_DEEP : MUTED}>{String(i + 1).padStart(2, '0')}</text>
            <text x={x + 10} y="94" fontFamily={SANS} fontSize="13" fontWeight="600" fill={INK}>{s.a}</text>
            <text x={x + 10} y="116" fontFamily={MONO} fontSize="10" fill={MUTED}>{s.b}</text>
            {i < stages.length - 1 && <line x1={x + w + 1} x2={x + w + gap - 2} y1="94" y2="94" stroke={BLUE} strokeWidth="1.5" markerEnd={`url(#${id}-a)`} />}
          </g>
        )
      })}
      {/* Cổng duyệt giữa môi trường thử và hệ thống chính */}
      {(() => {
        const gx = x0 + 3 * (w + gap) + w + gap / 2
        return (
          <g>
            <rect x={gx - 5} y="89" width="10" height="10" transform={`rotate(45 ${gx} 94)`} fill={PAPER} stroke={BLUE} strokeWidth="1.5" />
            <text x={gx} y="40" fontFamily={MONO} fontSize="10" fill={BLUE_DEEP} textAnchor="middle">{t('doanh nghiệp duyệt', 'your sign-off')}</text>
            <line x1={gx} x2={gx} y1="44" y2="82" stroke={BLUE} strokeDasharray="2 3" />
          </g>
        )
      })()}
      {/* Đường quay lui */}
      {(() => {
        const xe = x0 + 4 * (w + gap) + w / 2
        const xs = x0 + 2 * (w + gap) + w / 2
        return (
          <g>
            <path d={`M${xe} 137 V172 H${xs} V138`} fill="none" stroke={MUTED} strokeDasharray="5 4" markerEnd={`url(#${id}-g)`} />
            <rect x={(xe + xs) / 2 - 112} y="162" width="224" height="20" fill={PAPER} />
            <text x={(xe + xs) / 2} y="176" fontFamily={MONO} fontSize="10.5" fill={INK} textAnchor="middle">{t('quay về bản trước trong vài phút', 'roll back in minutes')}</text>
          </g>
        )
      })()}
    </svg>
  )
}
