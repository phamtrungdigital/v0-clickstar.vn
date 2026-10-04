// Render 1 file mockup HTML ra PNG @2x + quét chữ cấm + kiểm tràn khung.
//   node render.cjs <file.html> <out.png> [--w=1440] [--h=900] [--selector=#id] [--transparent]
// Desktop: chụp đúng khung w×h (mặc định 1440×900) → PNG 2880×1800.
// Điện thoại: --selector=#registration --transparent → chụp riêng phần tử, nền trong suốt.
const path = require('path')
const { chromium } = require('/Users/stdigital/Documents/Trung ST/Github.Code/admin-clickstar/node_modules/playwright')

const args = process.argv.slice(2)
const pos = args.filter((a) => !a.startsWith('--'))
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
  const [k, v] = a.slice(2).split('=')
  return [k, v === undefined ? true : v]
}))
if (pos.length < 2) {
  console.error('dùng: node render.cjs <file.html> <out.png> [--w=1440] [--h=900] [--selector=#id] [--transparent]')
  process.exit(1)
}
const [file, out] = pos
const W = Number(opt.w || 1440)
const H = Number(opt.h || 900)

// Chữ cấm chung: địa danh thật, dấu hiệu AI, chữ giả. Tên khách / từ vựng riêng của khách KHÔNG ghi
// ở đây (repo public): mỗi dòng trong forbidden.local.txt (cùng thư mục, đã gitignore) là 1 regex
// phân biệt hoa/thường (viết sẵn cả hai dạng nếu cần).
const fs = require('fs')
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
    if (t && !t.startsWith('#')) FORBIDDEN.push([new RegExp(t), 'từ cấm cục bộ']) // phân biệt hoa/thường
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
  await page.waitForTimeout(500)

  const info = await page.evaluate(({ sel, W, H }) => {
    const root = sel ? document.querySelector(sel) : document.body
    const text = root ? root.innerText : ''
    // Phần tử có chữ bị cắt (scrollWidth > clientWidth khi overflow hidden / ellipsis)
    const clipped = []
    for (const el of (root || document.body).querySelectorAll('*')) {
      const cs = getComputedStyle(el)
      if (el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 && (cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis' || cs.overflowX === 'hidden')) {
        clipped.push(el.textContent.trim().slice(0, 50))
      }
    }
    const fontsOk = document.fonts.check('16px "Be Vietnam Pro"')
    return {
      text,
      clipped: clipped.slice(0, 12),
      fontsOk,
      docW: document.documentElement.scrollWidth,
      found: !!root,
      box: root && sel ? root.getBoundingClientRect().toJSON() : null,
      W,
      H,
    }
  }, { sel: opt.selector || null, W, H })

  if (!info.found) {
    console.error('KHÔNG tìm thấy selector', opt.selector)
    process.exit(2)
  }
  const hits = FORBIDDEN.filter(([re]) => re.test(info.text)).map(([re, why]) => `${why}: "${(info.text.match(re) || [''])[0]}"`)
  console.log('chữ cấm:', hits.length ? hits.join(' | ') : 'KHÔNG CÓ')
  console.log('font Be Vietnam Pro:', info.fontsOk ? 'đã nạp' : 'CHƯA NẠP (kiểm thẻ <link> Google Fonts)')
  if (!opt.selector && info.docW > W) console.log(`CẢNH BÁO tràn ngang: trang rộng ${info.docW}px > ${W}px`)
  if (info.clipped.length) console.log('CẢNH BÁO chữ bị cắt:', info.clipped.join(' | '))
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
