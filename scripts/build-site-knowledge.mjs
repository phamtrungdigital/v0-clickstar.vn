// Trích nội dung CHỮ viết cứng trong code các trang công khai → kiến thức cho bot AI.
//
// Chạy tự động trước mỗi `next dev` / `next build` (xem package.json), nên bot luôn
// đọc đúng bản code đang deploy — không ai phải "dạy lại" bot khi sửa trang.
// Phần nội dung quản lý trong admin (DB) KHÔNG trích ở đây mà đọc lúc chạy:
// lib/ai/site-knowledge.ts.
//
// Đọc cú pháp bằng TypeScript compiler (không regex) để lấy đúng chữ khách nhìn thấy:
//   - tham số ĐẦU (tiếng Việt) của t('vi', 'en')
//   - object { vi: '...', en: '...' }
//   - chữ nằm giữa thẻ JSX
//   - chuỗi trong các field mang nghĩa (name, title, features...) — bỏ className, href, icon...
// Có cả nội dung trong tab ẩn / accordion đóng, vì đọc từ mã nguồn chứ không từ HTML.
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'lib/ai/site-knowledge.static.json')

// Chỉ đi theo import vào các thư mục chứa nội dung trang; bỏ layout/ui/context/lib.
const FOLLOW = [/^app\//, /^components\/services\//, /^components\/sections\//]
const SKIP_DIRS = ['admin-cls', 'api', 'login']
// Khối DEMO dữ liệu dựng sẵn (hội thoại mẫu, JSON mẫu, dashboard giả) — đưa cho bot
// thì nó dễ kể như chuyện khách thật, nên bỏ. Mô tả dịch vụ thật nằm ở page.tsx.
const SKIP_FILES = new Set([
  'components/services/speech-report-sample.tsx',
  'components/services/analysis-demo.tsx',
  'components/services/tech-payload.tsx',
  'components/services/insight-analytics.tsx',
])

const INFO_KEYS = new Set([
  'name', 'title', 'label', 'category', 'value', 'stat', 'statsLabel', 'metric', 'duration',
  'tool', 'tools', 'badge', 'unit', 'price', 'tag', 'tags', 'features', 'highlight', 'subtitle',
  'desc', 'description', 'quote', 'author', 'role', 'company', 'question', 'answer', 'q', 'a',
  'step', 'result', 'results', 'benefit', 'benefits', 'text', 'content', 'excerpt', 'readTime',
])

function isClassLike(s) {
  const tokens = s.trim().split(/\s+/)
  return tokens.length > 0 && tokens.every((tk) => /^[a-z0-9:!\[\]\/.%#-]+$/.test(tk) && /-|:/.test(tk))
}
function meaningful(s) {
  const v = s.replace(/\s+/g, ' ').trim()
  if (!v || !/\p{L}|\d/u.test(v)) return null
  if (/^(https?:|\/|#|mailto:|tel:)/.test(v)) return null
  if (isClassLike(v)) return null
  return v
}

function routeOf(file) {
  const rel = path.relative(path.join(ROOT, 'app'), path.dirname(file))
  return rel === '' ? '/' : '/' + rel.split(path.sep).join('/')
}

function listPages(dir) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (SKIP_DIRS.includes(ent.name) || ent.name.startsWith('[') || ent.name.startsWith('_')) continue
      out.push(...listPages(p))
    } else if (ent.name === 'page.tsx') out.push(p)
  }
  return out
}

function resolveImport(fromFile, spec) {
  let base
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec)
  else return null
  for (const ext of ['', '.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const p = base + ext
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
  }
  return null
}

function propName(node) {
  if (!node) return null
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text
  return null
}

function templateText(node) {
  if (ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) {
    return node.head.text + node.templateSpans.map((s) => '…' + s.literal.text).join('')
  }
  return null
}

/** Trả về danh sách chữ theo đúng thứ tự xuất hiện trong file + các import cần đi tiếp. */
function extractFile(file) {
  const src = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const lines = []
  const imports = []
  const push = (s) => {
    const v = s == null ? null : meaningful(s)
    if (v) lines.push(v)
  }

  function visit(node, ctxKey) {
    if (ts.isImportDeclaration(node)) {
      if (ts.isStringLiteral(node.moduleSpecifier)) imports.push(node.moduleSpecifier.text)
      return
    }
    // Bỏ className, style, key, href… và các lời gọi không mang nội dung hiển thị
    if (ts.isJsxAttribute(node)) {
      const n = node.name.getText(src)
      if (['alt', 'title', 'placeholder', 'aria-label', 'label'].includes(n) && node.initializer && ts.isStringLiteral(node.initializer)) {
        push(node.initializer.text)
      } else if (node.initializer) {
        ts.forEachChild(node.initializer, (c) => visit(c, null))
      }
      return
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(src)
      if (/^(console\.|cn$|clsx$|fetch$|require$|JSON\.)/.test(callee)) return
      if ((callee === 't' || callee.endsWith('.t')) && node.arguments.length >= 1) {
        const txt = templateText(node.arguments[0])
        if (txt != null) {
          push(txt)
          return
        }
      }
    }
    if (ts.isObjectLiteralExpression(node)) {
      const vi = node.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === 'vi')
      const en = node.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === 'en')
      if (vi && en && ts.isPropertyAssignment(vi)) {
        const txt = templateText(vi.initializer)
        if (txt != null) {
          push(txt)
          return
        }
        // Dữ liệu song song { vi: [...], en: [...] } → chỉ đọc nhánh tiếng Việt
        visit(vi.initializer, null)
        return
      }
    }
    // language === 'vi' ? A : B → chỉ đọc nhánh tiếng Việt
    if (ts.isConditionalExpression(node)) {
      const cond = node.condition.getText(src)
      if (/(language|lang)\s*===?\s*['"]vi['"]/.test(cond)) return visit(node.whenTrue, ctxKey)
      if (/(language|lang)\s*===?\s*['"]en['"]/.test(cond)) return visit(node.whenFalse, ctxKey)
    }
    if (ts.isPropertyAssignment(node)) {
      const key = propName(node.name)
      visit(node.initializer, key)
      return
    }
    if (ts.isJsxText(node)) {
      push(node.text)
      return
    }
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && ctxKey && INFO_KEYS.has(ctxKey)) {
      push(node.text)
      return
    }
    if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((el) => visit(el, ctxKey))
      return
    }
    ts.forEachChild(node, (c) => visit(c, null))
  }
  visit(src, null)
  return { lines, imports }
}

function collectRoute(pageFile) {
  const seen = new Set()
  const out = []
  const walk = (file, depth) => {
    if (seen.has(file) || depth > 3) return
    seen.add(file)
    const { lines, imports } = extractFile(file)
    out.push(...lines)
    for (const spec of imports) {
      const target = resolveImport(file, spec)
      if (!target) continue
      const rel = path.relative(ROOT, target).split(path.sep).join('/')
      if (!FOLLOW.some((re) => re.test(rel))) continue
      if (rel.includes('/admin-cls/') || SKIP_FILES.has(rel)) continue
      walk(target, depth + 1)
    }
  }
  walk(pageFile, 0)
  // Bỏ câu DÀI lặp lại (component dùng lại nhiều chỗ, JSON-LD lặp FAQ…). KHÔNG bỏ dòng
  // ngắn: "1 tuần" của bước 2 trùng chữ với "1 tuần" của bước 4 nhưng là 2 thông tin
  // khác nhau — bỏ đi thì bước 4 mất thời gian và AI gán nhầm.
  const uniq = []
  const dup = new Set()
  for (const l of out) {
    if (l.length >= 40) {
      if (dup.has(l)) continue
      dup.add(l)
    }
    uniq.push(l)
  }
  return uniq
}

const pages = listPages(path.join(ROOT, 'app')).sort()
const result = {}
let total = 0
for (const file of pages) {
  const route = routeOf(file)
  const lines = collectRoute(file)
  if (lines.length === 0) continue
  const text = lines.join('\n')
  result[route] = text
  total += text.length
}

// version = băm nội dung → lib/ai/site-knowledge.ts dùng làm khoá cache, nên deploy
// có chữ mới là bot đọc bản mới ngay (Data Cache của Vercel sống qua các lần deploy).
const version = createHash('sha1').update(JSON.stringify(result)).digest('hex').slice(0, 12)
fs.writeFileSync(OUT, JSON.stringify({ version, routes: result }, null, 1) + '\n')
console.log(
  `[site-knowledge] ${Object.keys(result).length} trang · ${total.toLocaleString('vi-VN')} ký tự → ${path.relative(ROOT, OUT)}`
)
