// Pure utility: parse h2/h3 headings từ markdown content, slugify thành id.
// Tách khỏi component 'use client' để page server có thể import an toàn.

export type Heading = { id: string; text: string; level: 2 | 3 }

export function parseHeadings(markdown: string): Heading[] {
  const lines = markdown.split('\n')
  const headings: Heading[] = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const m2 = /^## +(.+)$/.exec(line)
    const m3 = /^### +(.+)$/.exec(line)
    if (m2) {
      const text = m2[1].trim().replace(/[*_`]/g, '')
      headings.push({ id: slugifyId(text), text, level: 2 })
    } else if (m3) {
      const text = m3[1].trim().replace(/[*_`]/g, '')
      headings.push({ id: slugifyId(text), text, level: 3 })
    }
  }
  return headings
}

export function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
