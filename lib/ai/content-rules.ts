// Luật văn phong cho bài AI viết + bộ kiểm bằng code (không tốn tiền gọi AI).
// Client-safe: không import gì phía server, dùng được cả trong editor để chặn xuất bản.

/** Chỗ AI để lại cho chuyên gia Click Star điền kinh nghiệm thật trước khi xuất bản.
 * Nội dung trong ô có thể chứa "[2]" hay "[Google Ads]" → dùng [\s\S]*? thay vì [^\]]*.
 * Bắt cả "[[EXPERT: ...]]" phòng khi bản dịch lỡ dịch nhãn. */
export const EXPERT_PLACEHOLDER_RE = /\[\[\s*(?:CHUYÊN GIA|EXPERT)\s*:[\s\S]*?\]\]/giu

export function hasExpertPlaceholder(text: string | null | undefined): boolean {
  if (!text) return false
  EXPERT_PLACEHOLDER_RE.lastIndex = 0
  return EXPERT_PLACEHOLDER_RE.test(text)
}

export function countExpertPlaceholders(text: string | null | undefined): number {
  if (!text) return 0
  return text.match(EXPERT_PLACEHOLDER_RE)?.length ?? 0
}

/** Đưa vào system prompt của mọi bước viết/sửa bài (tiếng Việt). */
export const STYLE_RULES_VI = `LUẬT VĂN PHONG (bắt buộc):
1. Không dùng emoji, không dùng ký tự trang trí.
2. Không dùng dấu gạch ngang dài (— hoặc –) trong câu. Thay bằng dấu phẩy, dấu hai chấm, ngoặc đơn hoặc tách thành 2 câu. Dấu gạch nối trong từ ghép (vd "B2B", "e-commerce") vẫn được.
3. Tránh sáo ngữ: "trong thời đại số", "trong kỷ nguyên", "không thể phủ nhận", "đóng vai trò quan trọng", "hãy cùng tìm hiểu", "chìa khoá vàng", "cuộc cách mạng", "bước ngoặt", "ngày càng phát triển mạnh mẽ", "nói tóm lại", "tóm lại thì". Mở bài bằng một nhận định hoặc một tình huống cụ thể, không mở bằng câu hỏi tu từ chung chung.
4. Không tự khen Click Star (không "hàng đầu", "số 1", "uy tín nhất", "tốt nhất"). Không bịa khách hàng, dự án, con số hay kết quả của Click Star.
5. Không bịa tên công ty, tên người, nghiên cứu, khảo sát hay số liệu. Mọi con số phải lấy từ NGUỒN được cung cấp và gắn số nguồn [n]. Không có nguồn thì viết định tính, không đưa số.
6. Chỗ cần kinh nghiệm thực tế mà nguồn không có (ví dụ: chi phí thực tế ở Việt Nam, bài học từ dự án, lỗi hay gặp), chèn đúng 1 dòng riêng: [[CHUYÊN GIA: câu hỏi cụ thể cho chuyên gia]]. Tối đa 3 chỗ. Người duyệt sẽ thay bằng nội dung thật.
7. Câu ngắn, chủ động, rõ ý. Dùng từ Việt phổ thông; giữ thuật ngữ ngành quen thuộc (SEO, CRM, GA4, Meta Ads). Không dịch máy móc.
8. Viết cho chủ doanh nghiệp và trưởng phòng marketing ở Việt Nam: đi vào việc nên làm, chi phí, rủi ro, cách đo hiệu quả.`

export const STYLE_RULES_EN = `STYLE RULES (mandatory):
1. No emoji or decorative symbols.
2. No em dashes or en dashes (— or –) inside sentences. Use commas, colons, parentheses or split the sentence.
3. Avoid clichés ("in today's digital age", "game-changer", "it's no secret", "in conclusion", "let's dive in", "unlock the power").
4. Never self-promote Click Star ("leading", "#1", "best"). Never invent Click Star clients, projects, figures or results.
5. Never invent companies, people, studies, surveys or statistics. Every number must come from the provided SOURCES with its [n] reference.
6. Keep every [[CHUYÊN GIA: ...]] marker and every [n] reference exactly as in the source text.
7. Short, active, plain sentences for Vietnamese business owners reading in English.`

export type ContentIssue = {
  code: 'emoji' | 'dash' | 'cliche' | 'self_claim' | 'expert_placeholder' | 'unsourced_number' | 'bad_ref' | 'link'
  severity: 'error' | 'warn'
  label: string
  samples: string[]
}

// Emoji hiển thị dạng hình (🚀) hoặc ký tự có bộ chọn emoji (❤️). Không bắt ©, ®, ™, ↔.
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/gu
const DASH_RE = /[—–]/g
const CLICHES_VI = [
  'trong thời đại số',
  'trong kỷ nguyên',
  'không thể phủ nhận',
  'đóng vai trò quan trọng',
  'hãy cùng tìm hiểu',
  'chìa khoá vàng',
  'chìa khóa vàng',
  'cuộc cách mạng',
  'phát triển mạnh mẽ',
  'nói tóm lại',
  'tóm lại thì',
]
const CLICHES_EN = [
  "in today's digital age",
  'game-changer',
  'game changer',
  "it's no secret",
  'in conclusion',
  "let's dive in",
  'unlock the power',
]
// Câu nhận Click Star là "hàng đầu/số 1..." (không bắt câu kiểu "Click Star khuyên chọn gói tốt nhất").
const SELF_CLAIM_RE =
  /click\s?star\s*(?:là|luôn là|được đánh giá là|tự hào là|trở thành|:|is|has been)[^.\n]{0,50}?(hàng đầu|số 1|số một|uy tín nhất|tốt nhất|leading|#1|number one|the best)/giu
// Số kèm đơn vị hay bị bịa: %, tiền, quy mô.
const NUMBER_RE =
  /\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\s?(?:%|phần trăm|triệu|tỷ|nghìn|ngàn|USD|đồng|VNĐ|VND|lần|percent|million|billion|thousand)/giu

function contextOf(text: string, index: number, len: number): string {
  const start = Math.max(0, index - 30)
  const end = Math.min(text.length, index + Math.min(len, 200) + 30)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${end < text.length ? '…' : ''}`
}

function collect(text: string, re: RegExp, max = 3): string[] {
  const out: string[] = []
  re.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) && out.length < max) {
    out.push(contextOf(text, m.index, m[0].length))
    if (m[0].length === 0) re.lastIndex++
  }
  return out
}

function digitsOf(s: string): string {
  return s.replace(/[^\d]/g, '')
}

/**
 * Kiểm bài bằng code. `sourceText` = toàn bộ trích dẫn nguồn (nếu có) để soát số liệu
 * không có trong nguồn; `sourceCount` = số nguồn để soát ref [n] vượt số nguồn.
 */
export function checkContent(
  markdown: string,
  opts: { lang?: 'vi' | 'en'; sourceText?: string; sourceCount?: number } = {}
): ContentIssue[] {
  const text = markdown || ''
  const lower = text.toLowerCase()
  const issues: ContentIssue[] = []

  const emoji = collect(text, EMOJI_RE)
  if (emoji.length) issues.push({ code: 'emoji', severity: 'error', label: 'Có emoji', samples: emoji })

  const dashes = collect(text, DASH_RE)
  if (dashes.length) {
    issues.push({ code: 'dash', severity: 'error', label: 'Có dấu gạch ngang dài (— –)', samples: dashes })
  }

  const cliches = (opts.lang === 'en' ? CLICHES_EN : CLICHES_VI).filter((c) => lower.includes(c))
  if (cliches.length) {
    issues.push({ code: 'cliche', severity: 'warn', label: 'Có câu sáo rỗng', samples: cliches.slice(0, 5) })
  }

  const claims = collect(text, SELF_CLAIM_RE)
  if (claims.length) {
    issues.push({ code: 'self_claim', severity: 'error', label: 'Tự khen Click Star', samples: claims })
  }

  // Thân bài không được có link: link nguồn do hệ thống tự thêm cuối bài. Link lọt vào thân
  // bài thường là do nội dung trang web "cài" vào kết quả tìm kiếm.
  // Bỏ qua code (vd JSON-LD "https://schema.org" trong khối ``` là hợp lệ).
  const prose = text.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`/g, ' ')
  const links = collect(prose, /https?:\/\/\S+|www\.\S+|\]\(\s*<?\s*\/\/\S+/giu)
  if (links.length) issues.push({ code: 'link', severity: 'error', label: 'Có link trong thân bài', samples: links })

  const placeholders = text.match(EXPERT_PLACEHOLDER_RE) ?? []
  if (placeholders.length) {
    issues.push({
      code: 'expert_placeholder',
      severity: 'warn',
      label: `Còn ${placeholders.length} chỗ chờ chuyên gia điền`,
      samples: placeholders.slice(0, 3).map((p) => p.slice(0, 300)),
    })
  }

  if (opts.sourceText !== undefined) {
    const srcDigits = digitsOf(opts.sourceText)
    const unsourced: string[] = []
    NUMBER_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = NUMBER_RE.exec(text)) && unsourced.length < 5) {
      const d = digitsOf(m[0])
      if (d && !srcDigits.includes(d)) unsourced.push(contextOf(text, m.index, m[0].length))
    }
    if (unsourced.length) {
      issues.push({
        code: 'unsourced_number',
        severity: 'warn',
        label: 'Số liệu không thấy trong nguồn',
        samples: unsourced,
      })
    }
  }

  if (opts.sourceCount !== undefined) {
    const bad = new Set<string>()
    for (const m of text.matchAll(/\[(\d{1,3})\](?!\()/g)) {
      const n = Number(m[1])
      if (n < 1 || n > opts.sourceCount) bad.add(m[0])
    }
    if (bad.size) {
      issues.push({
        code: 'bad_ref',
        severity: 'error',
        label: 'Trích nguồn không tồn tại',
        samples: Array.from(bad).slice(0, 5),
      })
    }
  }

  return issues
}
