/**
 * Đọc và kiểm tra đoạn mã HTML do admin dán (Cài đặt → Mã tuỳ chỉnh). Thuần, không phụ thuộc thư viện.
 *
 * parseHeadCode: tách mã thành các thẻ được phép nằm trong <head> (script, style, noscript, meta, link) để layout dựng
 * thật sự vào <head>. Thẻ khác (iframe, div, img...) không đặt được trong head nên bị bỏ qua và báo ở `skipped`.
 * analyzeCode: dùng ở màn quản trị để báo trước khi lưu (tên miền mã tải về, thẻ mở chưa đóng, thẻ sai vị trí).
 */

export type HeadTagName = 'script' | 'style' | 'noscript' | 'meta' | 'link'

export type HeadTag = {
  tag: HeadTagName
  attrs: Record<string, string | true>
  /** Nội dung bên trong (script, style, noscript). meta và link không có. */
  inner: string | null
}

const RAW = new Set<string>(['script', 'style', 'noscript'])
const VOID = new Set<string>(['meta', 'link'])

const OPEN_TAG = /<([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/y
const ATTR = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

export function parseAttrs(src: string): Record<string, string | true> {
  const out: Record<string, string | true> = {}
  ATTR.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = ATTR.exec(src))) {
    const name = m[1].toLowerCase()
    const value = m[2] ?? m[3] ?? m[4]
    out[name] = value === undefined ? true : value
  }
  return out
}

export function parseHeadCode(code: string): { tags: HeadTag[]; skipped: string[] } {
  const tags: HeadTag[] = []
  const skipped: string[] = []
  const lower = code.toLowerCase()
  let i = 0

  while (i < code.length) {
    const lt = code.indexOf('<', i)
    if (lt === -1) break

    if (code.startsWith('<!--', lt)) {
      const end = code.indexOf('-->', lt + 4)
      i = end === -1 ? code.length : end + 3
      continue
    }

    OPEN_TAG.lastIndex = lt
    const m = OPEN_TAG.exec(code)
    if (!m) {
      i = lt + 1
      continue
    }

    const name = m[1].toLowerCase()
    const selfClosing = m[2].trimEnd().endsWith('/')
    const attrs = parseAttrs(selfClosing ? m[2].trimEnd().slice(0, -1) : m[2])
    const afterOpen = lt + m[0].length

    if (VOID.has(name)) {
      tags.push({ tag: name as HeadTagName, attrs, inner: null })
      i = afterOpen
    } else if (RAW.has(name)) {
      const close = selfClosing ? -1 : lower.indexOf(`</${name}`, afterOpen)
      if (close === -1) {
        // Không có thẻ đóng: coi là thẻ rỗng, không nuốt phần mã phía sau.
        tags.push({ tag: name as HeadTagName, attrs, inner: '' })
        i = afterOpen
      } else {
        tags.push({ tag: name as HeadTagName, attrs, inner: code.slice(afterOpen, close) })
        const closeEnd = code.indexOf('>', close)
        i = closeEnd === -1 ? code.length : closeEnd + 1
      }
    } else {
      skipped.push(name)
      i = afterOpen
    }
  }

  return { tags, skipped: [...new Set(skipped)] }
}

export type CodeAnalysis = {
  chars: number
  /** Tên miền mã tải về hoặc gọi tới. */
  domains: string[]
  /** Thẻ mở mà chưa đóng (hoặc đóng thừa): dễ làm vỡ giao diện. */
  unbalanced: string[]
  /** Thẻ không đặt được trong head (chỉ có ý nghĩa với vị trí head). */
  notForHead: string[]
  /** Có thuộc tính onclick, onload... (ở vị trí head sẽ bị bỏ). */
  hasEventHandlers: boolean
}

const HOST = /(?:https?:)?\/\/([a-z0-9][a-z0-9.-]*\.[a-z]{2,})(?::\d+)?(?=[\/"'\s)?#]|$)/gi
const IGNORED_HOSTS = new Set(['www.w3.org'])
const BALANCE_TAGS = ['script', 'noscript', 'style', 'iframe', 'div']

export function analyzeCode(code: string): CodeAnalysis {
  const domains = new Set<string>()
  HOST.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = HOST.exec(code))) {
    const host = m[1].toLowerCase()
    if (!IGNORED_HOSTS.has(host)) domains.add(host)
  }

  // Bỏ nội dung bên trong script và style trước khi đếm thẻ, để chuỗi như "<div>" trong code JavaScript không bị tính nhầm.
  const noComments = code.replace(/<!--[\s\S]*?-->/g, '')
  const stripped = noComments.replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1\s*>/gi, '<$1$2></$1>')
  const unbalanced: string[] = []
  for (const tag of BALANCE_TAGS) {
    const opens = (stripped.match(new RegExp(`<${tag}\\b(?![^>]*\\/>)`, 'gi')) ?? []).length
    const closes = (stripped.match(new RegExp(`</${tag}\\s*>`, 'gi')) ?? []).length
    if (opens !== closes) unbalanced.push(tag)
  }

  const hasEventHandlers = /<[a-z][^>]*\son[a-z]+\s*=/i.test(stripped)

  return {
    chars: code.length,
    domains: [...domains].sort(),
    unbalanced,
    notForHead: parseHeadCode(code).skipped,
    hasEventHandlers,
  }
}
