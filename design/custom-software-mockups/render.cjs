// Render mockup HTML ra PNG @2x + quét chữ cấm + quét "dấu hiệu AI" + kiểm tràn/cắt chữ.
//   node render.cjs <file.html> <out.png> [--w=1280] [--h=800] [--selector=#id] [--transparent]
// Desktop: chụp đúng khung w×h (mặc định 1280×800) → PNG 2560×1600.
// Điện thoại: --selector=#registration --transparent → chụp riêng phần tử, nền trong suốt.
const path = require('path')
const fs = require('fs')
const { chromium } = require('/Users/stdigital/Documents/Trung ST/Github.Code/admin-clickstar/node_modules/playwright')

const args = process.argv.slice(2)
const pos = args.filter((a) => !a.startsWith('--'))
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('=')
  return [k, v === undefined ? true : v]
}))
if (pos.length < 2) {
  console.error('dùng: node render.cjs <file.html> <out.png> [--w=1280] [--h=800] [--selector=#id] [--transparent]')
  process.exit(1)
}
const [file, out] = pos
const W = Number(opt.w || 1280)
const H = Number(opt.h || 800)

// Chữ cấm chung (địa danh thật, dấu hiệu AI trong chữ, chữ giả) + từ cấm cục bộ (tên khách cũ…)
const FORBIDDEN = [
  [/Hà Nội|Hồ Chí Minh|TP\.? ?HCM|Sài Gòn|Đà Nẵng|Cần Thơ|Hải Phòng|Bắc Ninh|Bắc Giang|Nam Định|Thanh Hóa|Nghệ An|Huế|Quy Nhơn|Nha Trang|Đồng Nai|Bình Dương|Hải Dương|Phú Yên/i, 'địa danh thật'],
  [/—/, 'dấu gạch dài (dấu hiệu AI)'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'emoji'],
  [/lorem|ipsum|placeholder text/i, 'chữ giả'],
]
const LOCAL = path.join(__dirname, 'forbidden.local.txt')
if (fs.existsSync(LOCAL)) {
  for (const line of fs.readFileSync(LOCAL, 'utf8').split('\n')) {
    const t = line.trim()
    if (t && !t.startsWith('#')) FORBIDDEN.push([new RegExp(t), 'từ cấm cục bộ'])
  }
}

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await page.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)

  const info = await page.evaluate(({ sel }) => {
    const root = sel ? document.querySelector(sel) : document.body
    if (!root) return { found: false }
    const text = root.innerText
    const clipped = []
    const ai = { gradient: [], bigRadius: [], heavyShadow: [], blur: [], saturated: new Map(), textShadow: [] }
    const label = (el) => (el.className && typeof el.className === 'string' ? el.tagName.toLowerCase() + '.' + el.className.split(' ')[0] : el.tagName.toLowerCase())
    const sat = (rgb) => {
      const m = rgb.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/)
      if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return 0
      const [r, g, b] = [m[1], m[2], m[3]].map((x) => Number(x) / 255)
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const l = (max + min) / 2
      return max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1))
    }
    for (const el of root.querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      if (el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 &&
          (cs.overflow === 'hidden' || cs.overflowX === 'hidden') && cs.textOverflow !== 'ellipsis') {
        clipped.push(el.textContent.trim().slice(0, 40))
      }
      if (/gradient/.test(cs.backgroundImage) && r.width * r.height > 2500) ai.gradient.push(label(el))
      const rad = parseFloat(cs.borderTopLeftRadius)
      const isCircle = Math.abs(r.width - r.height) < 2 && rad >= r.width / 2 - 1
      if (rad > 12 && !isCircle && r.height > 30 && !el.closest('[data-device]')) ai.bigRadius.push(`${label(el)}(${rad}px)`)
      const sh = cs.boxShadow
      if (sh && sh !== 'none') {
        const blurs = [...sh.matchAll(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/g)].map((x) => Number(x[3]))
        if (blurs.some((b) => b > 24) && !el.closest('[data-device]')) ai.heavyShadow.push(label(el))
      }
      if ((cs.filter && cs.filter.includes('blur')) || (cs.backdropFilter && cs.backdropFilter !== 'none')) ai.blur.push(label(el))
      if (cs.textShadow && cs.textShadow !== 'none') ai.textShadow.push(label(el))
      // Màu nền bão hoà cao trên diện tích lớn (> 1600 px²) — màu nhấn rực kiểu AI
      if (r.width * r.height > 1600) {
        const s = sat(cs.backgroundColor)
        if (s > 0.62) {
          const k = cs.backgroundColor
          ai.saturated.set(k, (ai.saturated.get(k) || 0) + Math.round(r.width * r.height))
        }
      }
    }
    const fontFamily = getComputedStyle(document.body).fontFamily
    return {
      found: true,
      text,
      clipped: clipped.slice(0, 10),
      docW: document.documentElement.scrollWidth,
      fontFamily,
      ai: {
        gradient: [...new Set(ai.gradient)].slice(0, 8),
        bigRadius: [...new Set(ai.bigRadius)].slice(0, 8),
        heavyShadow: [...new Set(ai.heavyShadow)].slice(0, 8),
        blur: [...new Set(ai.blur)].slice(0, 6),
        textShadow: [...new Set(ai.textShadow)].slice(0, 6),
        saturated: [...ai.saturated.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
      },
      box: sel ? root.getBoundingClientRect().toJSON() : null,
    }
  }, { sel: opt.selector || null })

  if (!info.found) {
    console.error('KHÔNG tìm thấy selector', opt.selector)
    process.exit(2)
  }
  const hits = FORBIDDEN.filter(([re]) => re.test(info.text)).map(([re, why]) => `${why}: "${(info.text.match(re) || [''])[0]}"`)
  console.log('chữ cấm:', hits.length ? hits.join(' | ') : 'KHÔNG CÓ')
  console.log('font body:', info.fontFamily.slice(0, 80), /apple-system|system-ui|SF Pro|BlinkMacSystemFont/i.test(info.fontFamily.split(',')[0]) ? '(font hệ thống, OK)' : '(CẢNH BÁO: font đầu tiên không phải font hệ thống)')
  const a = info.ai
  const aiWarn = []
  if (a.gradient.length) aiWarn.push('gradient: ' + a.gradient.join(', '))
  if (a.bigRadius.length) aiWarn.push('bo góc > 12px: ' + a.bigRadius.join(', '))
  if (a.heavyShadow.length) aiWarn.push('bóng đổ nặng (blur > 24px): ' + a.heavyShadow.join(', '))
  if (a.blur.length) aiWarn.push('blur/backdrop-filter: ' + a.blur.join(', '))
  if (a.textShadow.length) aiWarn.push('text-shadow: ' + a.textShadow.join(', '))
  if (a.saturated.length) aiWarn.push('nền màu bão hoà cao (màu: px²): ' + a.saturated.map(([c, n]) => `${c}: ${n}`).join(' · '))
  console.log('dấu hiệu AI:', aiWarn.length ? '\n  - ' + aiWarn.join('\n  - ') : 'KHÔNG CÓ')
  if (!opt.selector && info.docW > W) console.log(`CẢNH BÁO tràn ngang: trang rộng ${info.docW}px > ${W}px`)
  if (info.clipped.length) console.log('CẢNH BÁO chữ bị cắt cứng (không có …):', info.clipped.join(' | '))
  if (errors.length) console.log('LỖI JS/console:', errors.slice(0, 5).join(' | '))

  if (opt.selector) {
    await page.locator(opt.selector).first().screenshot({ path: out, omitBackground: !!opt.transparent })
  } else {
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H }, omitBackground: !!opt.transparent })
  }
  console.log('đã ghi', out, info.box ? `(${Math.round(info.box.width)}×${Math.round(info.box.height)} css px)` : `(${W}×${H} css px @2x)`)
  await browser.close()
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
