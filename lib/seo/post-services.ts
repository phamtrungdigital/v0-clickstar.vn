/**
 * Dịch vụ liên quan của từng bài blog: dùng ở khối "Dịch vụ liên quan" cuối bài và ở màn Admin → SEO → Nội dung
 * (ô phủ dịch vụ). Theo bài cụ thể nếu có, không thì theo nhãn chủ đề. Bài mới đăng nên thêm một dòng vào BY_POST.
 */
type Both = { vi: string; en: string }

export const SERVICE_LABELS: Record<string, Both> = {
  website: { vi: 'Thiết kế website chuẩn SEO, tải nhanh', en: 'SEO-ready, fast website design' },
  'digital-marketing': { vi: 'Dịch vụ Digital Marketing: SEO, quảng cáo, nội dung', en: 'Digital marketing: SEO, ads and content' },
  'ai-integration': { vi: 'Tích hợp AI vào quy trình doanh nghiệp', en: 'Integrating AI into business processes' },
  automation: { vi: 'AI Automation: tự động hóa quy trình', en: 'AI automation for business processes' },
  'crm-cdp': { vi: 'CRM và CDP: hợp nhất dữ liệu khách hàng', en: 'CRM and CDP: one view of your customers' },
  dashboard: { vi: 'Dashboard dữ liệu cho doanh nghiệp', en: 'Data dashboards for business' },
  'custom-software': { vi: 'Phần mềm theo yêu cầu: bảo mật, ổn định', en: 'Custom software: secure and dependable' },
  'speech-insight-ai': { vi: 'Call to Text và phân tích cuộc gọi bằng AI', en: 'Call to Text and AI call analytics' },
}

const BY_POST: Record<string, string[]> = {
  'vercel-tinh-nang-moi-thang-10-2026': ['website', 'custom-software'],
  'cach-su-dung-gpt-toi-uu-nhat': ['ai-integration', 'automation'],
  'api-la-gi-cach-su-dung-api-toi-uu': ['custom-software', 'ai-integration'],
  'huong-dan-vibe-coding-hieu-qua': ['custom-software', 'automation'],
  'xu-huong-ai-nam-2030': ['ai-integration', 'crm-cdp'],
  'tu-duy-seo-thoi-dai-ai': ['digital-marketing', 'website'],
  'dich-chuyen-seo-thoi-ky-ai': ['digital-marketing', 'website'],
  '7-ky-nang-su-dung-ai-ai-cung-can-biet': ['ai-integration', 'automation'],
  'tin-cong-nghe-tuan-12-18-10-2026': ['ai-integration', 'custom-software'],
  'model-ai-tao-video-tot-nhat-thang-10-2026': ['digital-marketing', 'ai-integration'],
  'claude-cap-nhat-thang-10-2026': ['ai-integration', 'automation'],
  'supabase-select-2026-cap-nhat-moi': ['custom-software', 'dashboard'],
  'quy-dinh-bao-ve-du-lieu-ca-nhan': ['crm-cdp', 'custom-software'],
  'digital-marketing-2026': ['digital-marketing', 'dashboard'],
  'crm-vs-cdp-comparison': ['crm-cdp', 'dashboard'],
  'xay-dung-dashboard': ['dashboard', 'crm-cdp'],
  'xu-huong-ai': ['ai-integration', 'automation'],
  'cach-su-dung-claude-co-ban-huong-dan-cho-nguoi-moi-bat-dau': ['ai-integration', 'automation'],
}
const BY_TAG: Record<string, string> = {
  ai: 'ai-integration',
  seo: 'digital-marketing',
  'công nghệ': 'custom-software',
  'kỹ năng': 'ai-integration',
  video: 'digital-marketing',
}

export function relatedServiceSlugs(postSlug: string, tags: string[]): string[] {
  if (BY_POST[postSlug]) return BY_POST[postSlug]
  const out: string[] = []
  for (const tag of tags) {
    const s = BY_TAG[tag.trim().toLowerCase()]
    if (s && !out.includes(s)) out.push(s)
  }
  return out.slice(0, 3)
}
