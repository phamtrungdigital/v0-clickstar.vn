// Gen 5 bài blog draft mới (slug -v2) bằng GPT-4o.
// Đọc title/tags từ posts hiện tại, gen content 1500+ từ với tên công ty Việt cụ thể,
// INSERT vào DB với status='draft' để admin duyệt rồi publish thủ công.
//
// Chạy: OPENAI_API_KEY=... SUPABASE_SERVICE_KEY=... node scripts/gen-all-blog-drafts.mjs [--dry-run]

import fs from 'node:fs/promises'

const OPENAI_KEY = process.env.OPENAI_API_KEY
const SB_URL = 'https://ffcqkrlzgofptspukrmo.supabase.co'
const SB_KEY = process.env.SUPABASE_SERVICE_KEY
const DRY_RUN = process.argv.includes('--dry-run')

if (!OPENAI_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1) }
if (!DRY_RUN && !SB_KEY) { console.error('Missing SUPABASE_SERVICE_KEY (or pass --dry-run)'); process.exit(1) }

// 5 chủ đề từ posts hiện tại (em verify từ DB trước)
const TOPICS = [
  { slug: 'data-dashboard-guide', title: 'Xây dựng Dashboard dữ liệu hiệu quả cho doanh nghiệp', tags: ['Data','Dashboard'], excerpt: 'Hướng dẫn xây dựng dashboard data từ KPI đến công cụ và quy trình cập nhật.' },
  { slug: 'crm-vs-cdp-comparison', title: 'CRM vs CDP: Lựa chọn nào phù hợp cho doanh nghiệp của bạn?', tags: ['CRM','CDP'], excerpt: 'So sánh chi tiết CRM và CDP để chọn nền tảng đúng cho từng giai đoạn phát triển.' },
  { slug: 'ai-marketing-trends-2024', title: '5 xu hướng AI trong Marketing không thể bỏ qua năm 2026', tags: ['AI','Marketing'], excerpt: '5 xu hướng AI đang định hình Marketing 2026: generative content, predictive analytics, conversational AI...' },
  { slug: 'cach-su-dung-claude-co-ban-huong-dan-cho-nguoi-moi-bat-dau', title: 'Cách Sử Dụng Claude Cơ Bản — Hướng Dẫn Cho Người Mới Bắt Đầu', tags: ['AI','Claude'], excerpt: 'Hướng dẫn dùng Claude AI từ đăng ký đến viết content, phân tích dữ liệu, automation cho doanh nghiệp Việt.' },
  { slug: 'digital-marketing-2026', title: 'Digital Marketing 2026: Xu Hướng và Công Nghệ Tương Lai', tags: ['Marketing','AI'], excerpt: 'Tổng quan xu hướng Digital Marketing 2026: AI agents, zero-party data, CTV ads, social commerce.' },
]

const SYSTEM_PROMPT = `You are an expert blog writer for ClickStar — a Vietnamese digital marketing & technology agency.

Write engaging, SEO-optimized blog posts in Vietnamese with:
- Clear structure: 1 intro paragraph (hook + stats), 5-7 H2 sections with H3 subsections when needed, conclusion with 3 takeaways
- Real Vietnamese brand examples in case studies — use real companies like: Thế Giới Di Động, FPT Shop, Tiki, Shopee, Lazada Vietnam, MoMo, ZaloPay, Viettel, Vingroup, Vinhomes, Saigon Co.op, Bach Hoa Xanh, Highlands Coffee, The Coffee House, Pizza 4P's, Goldsun Food. AVOID generic placeholders like "Công ty ABC/XYZ/DEF".
- Each section 250-350 words with specific numbers, examples, and actionable steps
- Use Markdown blockquotes (> Lưu ý: ...) for important callouts (1-2 per post)
- Professional but conversational tone, no emojis
- Target audience: Vietnamese SME owners and marketing managers

Return ONLY Markdown content. No preamble, no title metadata. Start directly with the intro paragraph.`

async function genPost(topic, attempt = 1) {
  const userPrompt = `Viết blog tiếng Việt 1500-2000 từ về chủ đề:
"${topic.title}"

Tags: ${topic.tags.join(', ')}
Excerpt gợi ý: ${topic.excerpt}

Yêu cầu:
- 1 đoạn intro 120-160 từ với hook (số liệu hoặc câu hỏi mở)
- 5-7 sections H2, mỗi section 250-350 từ
- Mỗi section có ít nhất 1 ví dụ doanh nghiệp Việt cụ thể (tên thật như Thế Giới Di Động, FPT Shop, Tiki, MoMo, Viettel, Highlands Coffee, Pizza 4P's...)
- 1-2 callout dạng "> Lưu ý: ..." để nhấn mạnh
- Bullet list hoặc số liệu trong ít nhất 3 sections
- Kết luận 120-150 từ với 3 takeaways đánh số
- KHÔNG dùng emoji, KHÔNG dùng tên "Công ty ABC/XYZ"

Bắt đầu thẳng từ đoạn intro markdown.`

  console.log(`  → ${topic.slug} (attempt ${attempt})`)
  const t0 = Date.now()

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  })

  if (!res.ok) {
    console.error(`    ERROR ${res.status}:`, await res.text())
    return null
  }

  const json = await res.json()
  const content = json.choices[0].message.content
  const finish = json.choices[0].finish_reason
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1)

  console.log(`    ${elapsed}s, ${content.length} chars, finish=${finish}`)

  // Retry once if too short
  const wordCount = content.split(/\s+/).length
  if (wordCount < 1000 && attempt === 1) {
    console.log(`    too short (${wordCount} words), retrying with stronger prompt...`)
    return genPost({ ...topic, title: topic.title + ' (chi tiết, dài 1800+ từ)' }, 2)
  }

  return { content, wordCount, finishReason: finish }
}

async function main() {
  const drafts = []
  for (const topic of TOPICS) {
    const result = await genPost(topic)
    if (!result) continue
    drafts.push({
      ...topic,
      new_slug: `${topic.slug}-v2`,
      content_vi: result.content,
      content_len: result.content.length,
      word_count: result.wordCount,
      finish_reason: result.finishReason,
    })
  }

  // Save all to file for review
  await fs.writeFile('/tmp/blog-drafts-all.json', JSON.stringify(drafts, null, 2))
  for (const d of drafts) {
    await fs.writeFile(`/tmp/blog-draft-${d.new_slug}.md`, d.content_vi)
  }
  console.log(`\nSaved ${drafts.length} drafts to /tmp/blog-drafts-all.json + /tmp/blog-draft-*.md\n`)

  if (DRY_RUN) {
    console.log('--dry-run: skipping DB INSERT')
    return
  }

  // INSERT into DB via Supabase service-role REST
  console.log('Inserting into DB (status=draft)...')
  for (const d of drafts) {
    const payload = {
      slug: d.new_slug,
      title: { vi: d.title, en: d.title },
      excerpt: { vi: d.excerpt, en: d.excerpt },
      content: { vi: d.content_vi, en: '' },
      tags: d.tags,
      status: 'draft',
      seo_title: { vi: d.title, en: d.title },
      seo_description: { vi: d.excerpt, en: d.excerpt },
    }

    const res = await fetch(`${SB_URL}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(`  ✓ inserted ${d.new_slug} (id=${data[0]?.id})`)
    } else {
      console.error(`  ✗ failed ${d.new_slug}:`, res.status, await res.text())
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
