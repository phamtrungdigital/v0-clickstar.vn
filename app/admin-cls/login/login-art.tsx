/**
 * Ngôi sao pha lê của trang đăng nhập: năm cánh, mỗi cánh hai mặt sáng và tối, quầng sáng xanh thở chậm (nền sáng),
 * vòng quỹ đạo mảnh với chấm xanh, vài dấu lấp lánh thưa. Thuần SVG và CSS (không ảnh, không thư viện),
 * tự tắt chuyển động khi người dùng bật chế độ giảm chuyển động.
 */
const CX = 150
const CY = 150
const R_OUT = 92
const R_IN = 40
const N = 5

const tips: [number, number][] = []
const dips: [number, number][] = []
for (let k = 0; k < N; k++) {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / N
  const b = a + Math.PI / N
  tips.push([CX + R_OUT * Math.cos(a), CY + R_OUT * Math.sin(a)])
  dips.push([CX + R_IN * Math.cos(b), CY + R_IN * Math.sin(b)])
}
const pt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`
const centre = pt([CX, CY])
const outline = tips.map((p, k) => `${pt(p)} ${pt(dips[k])}`).join(' ')

const CSS = `
.cs-fa{animation:cs-float 7s ease-in-out infinite}
.cs-gl{animation:cs-glow 5s ease-in-out infinite;transform-origin:150px 150px}
.cs-sp{animation:cs-sp 5.5s ease-in-out infinite}
.cs-rg{transform-origin:150px 150px;animation:cs-rot 26s linear infinite}
@keyframes cs-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes cs-glow{0%,100%{opacity:.7;transform:scale(.97)}50%{opacity:1;transform:scale(1.04)}}
@keyframes cs-sp{0%,100%{opacity:.1}45%{opacity:.85}}
@keyframes cs-rot{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.cs-fa,.cs-gl,.cs-sp,.cs-rg{animation:none}}
`

export function LoginArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <style>{CSS}</style>
      <defs>
        <radialGradient id="cs-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3b82f6" stopOpacity=".28" />
          <stop offset=".5" stopColor="#3b82f6" stopOpacity=".12" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cs-lt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfdcff" />
          <stop offset="1" stopColor="#4f93f5" />
        </linearGradient>
        <linearGradient id="cs-dk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f6fe0" />
          <stop offset="1" stopColor="#143c9c" />
        </linearGradient>
        <filter id="cs-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <g className="cs-gl">
        <circle cx="150" cy="150" r="148" fill="url(#cs-bg)" />
      </g>
      <g className="cs-rg">
        <ellipse cx="150" cy="150" rx="128" ry="46" fill="none" stroke="#1e6dda" strokeOpacity=".22" strokeWidth="1" transform="rotate(-24 150 150)" />
        <circle cx="278" cy="150" r="3.5" fill="#1e6dda" transform="rotate(-24 150 150)" />
      </g>

      <g className="cs-fa">
        <polygon points={outline} fill="#3b82f6" opacity=".55" filter="url(#cs-blur)" />
        {tips.map((t, k) => (
          <g key={k}>
            <polygon points={`${centre} ${pt(t)} ${pt(dips[(k + N - 1) % N])}`} fill="url(#cs-lt)" />
            <polygon points={`${centre} ${pt(t)} ${pt(dips[k])}`} fill="url(#cs-dk)" />
          </g>
        ))}
        <polygon points={outline} fill="none" stroke="#e8f2ff" strokeOpacity=".5" strokeWidth="1" strokeLinejoin="round" />
        {tips.map((t, k) => (
          <line key={k} x1={CX} y1={CY} x2={t[0].toFixed(1)} y2={t[1].toFixed(1)} stroke="#fff" strokeOpacity=".28" strokeWidth=".8" />
        ))}
        <polygon className="cs-sp" points={`${centre} ${pt(tips[0])} ${pt(dips[N - 1])}`} fill="#fff" />
        <circle cx={CX} cy={CY} r="3" fill="#fff" opacity=".9" />
      </g>

      <g className="cs-sp" style={{ animationDelay: '1.2s' }}>
        <path d="M255 58v16M247 66h16" stroke="#8db8f5" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <g className="cs-sp" style={{ animationDelay: '2.6s' }}>
        <path d="M52 232v12M46 238h12" stroke="#8db8f5" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  )
}
