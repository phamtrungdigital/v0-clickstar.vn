// One-shot script gen 1 bài blog AI để demo chất lượng.
// Đọc OPENAI_API_KEY + cấu hình từ env, call GPT-4o, output markdown.

import fs from 'node:fs/promises'

const OPENAI_KEY = process.env.OPENAI_API_KEY
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o'
const SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT ||
  'You are an expert blog writer for ClickStar — a Vietnamese digital marketing & technology agency. Write engaging, SEO-optimized blog posts with clear structure: intro paragraph, 3-5 H2 sections with examples/data, conclusion. Mix factual depth with practical takeaways. Use a professional but conversational tone.'

if (!OPENAI_KEY) {
  console.error('Missing OPENAI_API_KEY env')
  process.exit(1)
}

const SLUG = process.argv[2] || 'data-dashboard-guide'
const TITLE = process.argv[3] || 'Xây dựng Dashboard dữ liệu hiệu quả cho doanh nghiệp'
const TAGS = (process.argv[4] || 'Data,Dashboard').split(',')
const TARGET_WORDS = 1800

const userPrompt = `Viết lại hoàn toàn bài blog tiếng Việt với chủ đề:
"${TITLE}"

Tags: ${TAGS.join(', ')}
Độ dài mục tiêu: ${TARGET_WORDS} từ
Audience: chủ doanh nghiệp Việt Nam (SME) đang tìm hiểu chủ đề này để áp dụng vào công ty.

Yêu cầu cấu trúc Markdown:
- 1 đoạn intro hấp dẫn 100-150 từ, có hook (số liệu thống kê hoặc câu hỏi mở)
- 5-7 sections cấp H2 với tiêu đề rõ ràng (có thể có H3 con khi cần)
- Mỗi section 200-300 từ với:
  + Ví dụ cụ thể (tên công ty Việt Nam giả định OK)
  + Số liệu hoặc bullet list khi phù hợp
  + Hành động cụ thể người đọc có thể áp dụng
- 1 section "Kết luận" 100-150 từ với 3 takeaways chính
- Có thể chèn 1-2 callout dạng "> Lưu ý:" để nhấn mạnh điểm quan trọng

Chỉ trả về NỘI DUNG MARKDOWN, không có preamble, không có metadata (title, tags), bắt đầu thẳng từ đoạn intro.
KHÔNG dùng emoji. Văn phong chuyên nghiệp, súc tích, có ví dụ thực tế cho doanh nghiệp Việt Nam.`

console.log(`[1/2] Calling OpenAI ${MODEL}...`)

const t0 = Date.now()
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  }),
})

if (!res.ok) {
  console.error('OpenAI error:', res.status, await res.text())
  process.exit(1)
}

const json = await res.json()
const content = json.choices[0].message.content

console.log(`[2/2] Done in ${((Date.now() - t0) / 1000).toFixed(1)}s, ${content.length} chars`)

await fs.writeFile(`/tmp/blog-draft-${SLUG}.md`, content)
await fs.writeFile(
  `/tmp/blog-draft-${SLUG}.json`,
  JSON.stringify(
    {
      slug: SLUG,
      title: TITLE,
      content_vi: content,
      content_len: content.length,
      generated_at: new Date().toISOString(),
      model: MODEL,
    },
    null,
    2,
  ),
)

console.log(`Output:`)
console.log(`  /tmp/blog-draft-${SLUG}.md   (preview markdown)`)
console.log(`  /tmp/blog-draft-${SLUG}.json (for DB import later)`)
