/**
 * Phân tích nội dung blog cho Admin → Quản trị bài viết: bài đã phủ nhóm chủ đề, dịch vụ và
 * giai đoạn mua nào, còn thiếu gì, nên viết bài nào tiếp. Hàm `analyzeContent` thuần (không đọc DB), nhận danh sách
 * bài đã rút gọn từ `lib/cms/content-data.ts`.
 *
 * Phân nhóm là dữ liệu viết tay trong file này (POST_META, BACKLOG), không suy từ chữ trong bài, vì suy đoán
 * bằng từ khóa tiếng Việt rất dễ sai. Bài mới đăng thì thêm một dòng vào POST_META (và BY_POST ở
 * `lib/seo/post-services.ts`); bài chưa có dòng sẽ hiện ở mục "Bài chưa xếp nhóm" để không bị bỏ sót.
 */
import { SERVICE_LABELS, relatedServiceSlugs } from '@/lib/seo/post-services'

/* ------------------------------ Danh mục cố định ------------------------------ */

export type ServiceSlug =
  | 'ai-integration'
  | 'automation'
  | 'speech-insight-ai'
  | 'crm-cdp'
  | 'dashboard'
  | 'digital-marketing'
  | 'website'
  | 'custom-software'

export const SERVICE_ORDER: ServiceSlug[] = [
  'ai-integration',
  'automation',
  'speech-insight-ai',
  'crm-cdp',
  'dashboard',
  'digital-marketing',
  'website',
  'custom-software',
]

export const SERVICE_SHORT: Record<ServiceSlug, string> = {
  'ai-integration': 'Tích hợp AI',
  automation: 'AI Automation',
  'speech-insight-ai': 'Phân tích cuộc gọi AI',
  'crm-cdp': 'CRM và CDP',
  dashboard: 'Dashboard dữ liệu',
  'digital-marketing': 'Digital Marketing',
  website: 'Thiết kế website',
  'custom-software': 'Phần mềm theo yêu cầu',
}

const isService = (s: string): s is ServiceSlug => (SERVICE_ORDER as string[]).includes(s)

export type PillarId = 'ai' | 'data' | 'marketing' | 'build' | 'news' | 'legal'

/** Nhóm chủ đề (danh mục) của blog. `target` là tỷ trọng gợi ý (% số bài), chỉnh tại đây. */
export const PILLARS: { id: PillarId; label: string; hint: string; target: number; color: string }[] = [
  { id: 'ai', label: 'AI và tự động hóa', hint: 'Dùng AI vào công việc và quy trình', target: 25, color: '#3687FC' },
  { id: 'data', label: 'Dữ liệu và khách hàng', hint: 'CRM, CDP, dashboard, dữ liệu khách hàng', target: 25, color: '#F59E0B' },
  { id: 'marketing', label: 'Marketing số và SEO', hint: 'SEO, quảng cáo, nội dung, xu hướng', target: 20, color: '#14B8A6' },
  { id: 'build', label: 'Website và phần mềm', hint: 'Thiết kế web, phần mềm, công cụ lập trình', target: 15, color: '#8B5CF6' },
  { id: 'news', label: 'Tin tức công nghệ', hint: 'Tổng hợp tin, cập nhật sản phẩm', target: 10, color: '#94A3B8' },
  { id: 'legal', label: 'Quy định và bảo mật', hint: 'Chính sách, pháp lý, an toàn dữ liệu', target: 5, color: '#F43F5E' },
]

export type StageId = 'learn' | 'guide' | 'decide'

export const STAGES: { id: StageId; label: string; hint: string; color: string }[] = [
  { id: 'learn', label: 'Tìm hiểu', hint: 'Là gì, xu hướng, vì sao quan trọng', color: '#A9C9FB' },
  { id: 'guide', label: 'Hướng dẫn, so sánh', hint: 'Cách làm, so sánh các lựa chọn', color: '#3687FC' },
  { id: 'decide', label: 'Chọn và triển khai', hint: 'Chi phí, checklist chọn nhà cung cấp, quy trình', color: '#FB923C' },
]

export type KindId = 'guide' | 'opinion' | 'news' | 'policy'

export const KIND_LIST: { id: KindId; label: string; color: string }[] = [
  { id: 'guide', label: 'Hướng dẫn', color: '#3687FC' },
  { id: 'opinion', label: 'Xu hướng, quan điểm', color: '#8B5CF6' },
  { id: 'news', label: 'Tin, cập nhật', color: '#94A3B8' },
  { id: 'policy', label: 'Chính sách', color: '#FB923C' },
]
export const KINDS = Object.fromEntries(KIND_LIST.map((k) => [k.id, k.label])) as Record<KindId, string>

/* ------------------------------ Phân nhóm từng bài ------------------------------ */

type Meta = { pillar: PillarId; stage: StageId; kind: KindId; offTopic?: boolean }

export const POST_META: Record<string, Meta> = {
  'dich-chuyen-seo-thoi-ky-ai': { pillar: 'marketing', stage: 'learn', kind: 'guide' },
  'xu-huong-tim-kiem-nguoi-dung-thoi-ky-ai': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'tu-duy-seo-thoi-dai-ai': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'digital-marketing-2026': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'xu-huong-ai': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'xu-huong-ai-nam-2030': { pillar: 'ai', stage: 'learn', kind: 'opinion' },
  '7-ky-nang-su-dung-ai-ai-cung-can-biet': { pillar: 'ai', stage: 'learn', kind: 'guide' },
  'cach-su-dung-gpt-toi-uu-nhat': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'cach-su-dung-claude-co-ban-huong-dan-cho-nguoi-moi-bat-dau': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'model-ai-tao-video-tot-nhat-thang-10-2026': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'claude-cap-nhat-thang-10-2026': { pillar: 'ai', stage: 'learn', kind: 'news' },
  'crm-vs-cdp-comparison': { pillar: 'data', stage: 'guide', kind: 'guide' },
  'xay-dung-dashboard': { pillar: 'data', stage: 'guide', kind: 'guide' },
  'api-la-gi-cach-su-dung-api-toi-uu': { pillar: 'build', stage: 'guide', kind: 'guide' },
  'huong-dan-vibe-coding-hieu-qua': { pillar: 'build', stage: 'guide', kind: 'guide' },
  'vercel-tinh-nang-moi-thang-10-2026': { pillar: 'build', stage: 'learn', kind: 'news' },
  'supabase-select-2026-cap-nhat-moi': { pillar: 'build', stage: 'learn', kind: 'news' },
  'tin-cong-nghe-tuan-12-18-10-2026': { pillar: 'news', stage: 'learn', kind: 'news' },
  'tesla-roadster-bay-thu-nghiem-thang-10-2026': { pillar: 'news', stage: 'learn', kind: 'news', offTopic: true },
  'quy-dinh-bao-ve-du-lieu-ca-nhan': { pillar: 'legal', stage: 'decide', kind: 'policy' },
  'luat-bao-ve-du-lieu-ca-nhan-cap-nhat-2027': { pillar: 'legal', stage: 'learn', kind: 'policy' },
  'tai-sao-doanh-nghiep-nen-dung-co-so-du-lieu-van-hanh-online': { pillar: 'data', stage: 'learn', kind: 'opinion' },
  'ui-ux-quan-trong-nhu-the-nao-voi-san-pham-cong-nghe': { pillar: 'build', stage: 'learn', kind: 'opinion' },
  'tong-hop-10-cong-cu-ai-manh-nhat-hien-nay': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'cach-lam-viec-voi-gpt-hieu-qua': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'crm-co-thuc-su-quan-trong-voi-doanh-nghiep-khong': { pillar: 'data', stage: 'learn', kind: 'opinion' },
  'website-chuyen-doi-nhu-the-nao': { pillar: 'build', stage: 'guide', kind: 'guide' },
  'thach-thuc-marketing-trong-ky-nguyen-ai': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'cach-prompt-thong-minh-hieu-qua-trong-marketing': { pillar: 'marketing', stage: 'guide', kind: 'guide' },
  'xu-huong-digital-marketing-5-nam-toi': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
  'xu-huong-phat-trien-ai-5-10-nam-toi': { pillar: 'ai', stage: 'learn', kind: 'opinion' },
  'phan-tich-cac-model-claude-cap-nhat-20-10-2026': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'cach-su-dung-ai-toi-uu-token': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'thong-ke-su-dung-ai-cac-nuoc-tren-the-gioi': { pillar: 'ai', stage: 'learn', kind: 'opinion' },
  'google-update-20-10-2026': { pillar: 'marketing', stage: 'learn', kind: 'news' },
  'xu-huong-su-dung-ai-va-model-thinh-hanh-2026': { pillar: 'ai', stage: 'learn', kind: 'opinion' },
  'cach-su-dung-claude-cowork-hieu-qua': { pillar: 'ai', stage: 'guide', kind: 'guide' },
  'cach-lam-seo-thoi-dai-ai': { pillar: 'marketing', stage: 'guide', kind: 'guide' },
  'thay-doi-hanh-vi-nguoi-dung-thoi-ai': { pillar: 'marketing', stage: 'learn', kind: 'opinion' },
}

/** Nhãn (tag) nhập trong admin quy về nhóm chủ đề: dùng làm gợi ý cho bài chưa có dòng trong POST_META. */
const TAG_PILLAR: Record<string, PillarId> = {
  ai: 'ai',
  claude: 'ai',
  'kỹ năng': 'ai',
  video: 'ai',
  crm: 'data',
  cdp: 'data',
  dashboard: 'data',
  data: 'data',
  'dashboard dữ liệu': 'data',
  seo: 'marketing',
  marketing: 'marketing',
  'digital marketing 2026': 'marketing',
  'công nghệ': 'build',
  supabase: 'build',
  database: 'build',
  'thiết kế website': 'build',
  'tin tức': 'news',
  tesla: 'news',
  'pháp lý': 'legal',
  'bảo mật': 'legal',
}

/* ------------------------------ Gợi ý bài nên viết ------------------------------ */

export type BacklogItem = {
  id: string
  title: string
  /** Đường dẫn gợi ý. Có bài đã đăng trùng slug này thì gợi ý tự chuyển sang "Đã viết". */
  slug: string
  pillar: PillarId
  service: ServiceSlug
  stage: StageId
  kind: KindId
  why: string
}

export const BACKLOG: BacklogItem[] = [
  {
    id: 'crm-la-gi', slug: 'crm-la-gi-khi-nao-doanh-nghiep-nen-dung', pillar: 'data', service: 'crm-cdp', stage: 'learn', kind: 'guide',
    title: 'CRM là gì? Khi nào doanh nghiệp vừa và nhỏ nên bắt đầu dùng CRM',
    why: 'Câu hỏi gốc của người mới tìm hiểu CRM, dẫn thẳng về trang dịch vụ CRM và CDP.',
  },
  {
    id: 'chon-phan-mem-crm', slug: 'checklist-chon-phan-mem-crm', pillar: 'data', service: 'crm-cdp', stage: 'decide', kind: 'guide',
    title: 'Checklist 12 câu hỏi cần hỏi trước khi chọn phần mềm CRM',
    why: 'Người đọc đã gần quyết định mua: bài giúp họ chọn đúng và đưa Click Star vào danh sách cân nhắc.',
  },
  {
    id: 'hop-nhat-du-lieu', slug: 'hop-nhat-du-lieu-khach-hang-form-zalo-facebook-cuoc-goi', pillar: 'data', service: 'crm-cdp', stage: 'guide', kind: 'guide',
    title: 'Hợp nhất dữ liệu khách hàng từ biểu mẫu, Zalo, Facebook và cuộc gọi: cách làm và sai lầm thường gặp',
    why: 'Đúng thế mạnh của CDP, chưa có bài hướng dẫn thực hành nào.',
  },
  {
    id: 'cuoc-goi-ai-la-gi', slug: 'phan-tich-cuoc-goi-bang-ai-la-gi', pillar: 'ai', service: 'speech-insight-ai', stage: 'learn', kind: 'guide',
    title: 'Phân tích cuộc gọi bằng AI là gì và đội kinh doanh dùng để làm gì',
    why: 'Dịch vụ này chưa có bài blog nào dẫn về trang của nó.',
  },
  {
    id: 'cham-diem-cuoc-goi', slug: 'cham-chat-luong-cuoc-goi-tu-van-bo-tieu-chi', pillar: 'ai', service: 'speech-insight-ai', stage: 'guide', kind: 'guide',
    title: 'Cách chấm chất lượng cuộc gọi tư vấn: bộ tiêu chí và bảng điểm mẫu',
    why: 'Bài thực hành có thể tải về dùng ngay, tự nhiên dẫn đến nhu cầu chấm điểm tự động.',
  },
  {
    id: 'ghi-am-phap-ly', slug: 'ghi-am-phan-tich-cuoc-goi-dieu-kien-phap-ly', pillar: 'ai', service: 'speech-insight-ai', stage: 'decide', kind: 'guide',
    title: 'Ghi âm và phân tích cuộc gọi khách hàng: điều kiện pháp lý và cách xin đồng ý',
    why: 'Nỗi lo lớn nhất khi mua dịch vụ này. Có thể dẫn về bài Quy định bảo vệ dữ liệu cá nhân đã đăng.',
  },
  {
    id: 'chi-phi-website', slug: 'chi-phi-thiet-ke-website-2026', pillar: 'build', service: 'website', stage: 'decide', kind: 'guide',
    title: 'Chi phí thiết kế website năm 2026 gồm những khoản nào và cách dự toán',
    why: 'Từ khóa chi phí có ý định mua rõ, hiện chưa có bài nào giải thích cách tính.',
  },
  {
    id: 'website-chuan-seo', slug: 'website-chuan-seo-checklist-truoc-khi-ra-mat', pillar: 'build', service: 'website', stage: 'guide', kind: 'guide',
    title: 'Website chuẩn SEO: checklist kỹ thuật trước khi ra mắt',
    why: 'Nối hai mảng mạnh của Click Star (website và SEO), có thể dùng chính các việc đã làm trên site này làm ví dụ.',
  },
  {
    id: 'toc-do-website', slug: 'toc-do-website-anh-huong-doanh-thu-core-web-vitals', pillar: 'build', service: 'website', stage: 'learn', kind: 'guide',
    title: 'Tốc độ website ảnh hưởng thế nào đến doanh thu: cách đo và cải thiện Core Web Vitals',
    why: 'Có số liệu thật từ chính website Click Star làm bằng chứng (chữ hiện lần đầu giảm từ 3,0 xuống 0,8 giây).',
  },
  {
    id: 'bao-cao-meta', slug: 'doc-bao-cao-quang-cao-meta-chi-so-can-theo-doi', pillar: 'marketing', service: 'digital-marketing', stage: 'guide', kind: 'guide',
    title: 'Đọc báo cáo quảng cáo Meta: các chỉ số cần theo dõi và dấu hiệu chiến dịch có vấn đề',
    why: 'Bài thực hành cho người đang chạy quảng cáo, gắn với sản phẩm quản lý quảng cáo của Click Star.',
  },
  {
    id: 'bao-gia-seo-ads', slug: 'cach-doc-bao-gia-seo-va-quang-cao-chon-don-vi-lam', pillar: 'marketing', service: 'digital-marketing', stage: 'decide', kind: 'guide',
    title: 'Cách đọc báo giá dịch vụ SEO và quảng cáo để chọn đúng đơn vị làm',
    why: 'Người đọc đang so sánh nhà cung cấp, bài thể hiện cách làm minh bạch của Click Star.',
  },
  {
    id: 'bao-cao-hang-tuan', slug: 'bao-cao-marketing-hang-tuan-cho-lanh-dao-mau-dashboard', pillar: 'data', service: 'dashboard', stage: 'decide', kind: 'guide',
    title: 'Báo cáo marketing hằng tuần cho lãnh đạo: mẫu dashboard và cách trình bày',
    why: 'Nhu cầu cụ thể của quản lý, dẫn đến dịch vụ dashboard dữ liệu.',
  },
  {
    id: 'kpi-dieu-hanh', slug: 'chi-so-nen-dua-len-dashboard-dieu-hanh', pillar: 'data', service: 'dashboard', stage: 'guide', kind: 'guide',
    title: 'Nên đưa chỉ số nào lên dashboard điều hành: ví dụ cho kinh doanh, marketing, chăm sóc khách hàng',
    why: 'Bổ sung cho bài Xây dựng dashboard: đi từ chọn chỉ số thay vì chọn công cụ.',
  },
  {
    id: 'tu-dong-hoa-ban-hang', slug: '6-quy-trinh-ban-hang-cham-soc-khach-nen-tu-dong-hoa-truoc', pillar: 'ai', service: 'automation', stage: 'guide', kind: 'guide',
    title: '6 quy trình bán hàng và chăm sóc khách nên tự động hóa trước',
    why: 'Danh sách dễ đọc, dễ được trích dẫn, dẫn về dịch vụ AI Automation.',
  },
  {
    id: 'chatbot-website', slug: 'chatbot-ai-cho-website-chi-phi-rui-ro-cach-do', pillar: 'ai', service: 'ai-integration', stage: 'decide', kind: 'guide',
    title: 'Đưa chatbot AI lên website: chi phí, rủi ro và cách đo kết quả',
    why: 'Click Star đã tự chạy chatbot trên chính website nên có kinh nghiệm thật để chia sẻ.',
  },
  {
    id: 'ai-an-toan', slug: 'dua-ai-vao-doanh-nghiep-an-toan-du-lieu-phan-quyen', pillar: 'ai', service: 'ai-integration', stage: 'guide', kind: 'guide',
    title: 'Đưa AI vào doanh nghiệp an toàn: dữ liệu, phân quyền và kiểm soát đầu ra',
    why: 'Lo ngại hàng đầu của lãnh đạo khi dùng AI, kết nối với nhóm Quy định và bảo mật.',
  },
  {
    id: 'phan-mem-theo-yeu-cau', slug: 'lam-phan-mem-theo-yeu-cau-quy-trinh-kiem-soat-chi-phi', pillar: 'build', service: 'custom-software', stage: 'decide', kind: 'guide',
    title: 'Làm phần mềm theo yêu cầu: quy trình từ ý tưởng đến vận hành và cách kiểm soát chi phí',
    why: 'Giúp khách hiểu cách làm việc trước khi liên hệ, giảm thời gian tư vấn ban đầu.',
  },
]

/* ------------------------------ Kiểu dữ liệu vào và ra ------------------------------ */

export type ContentPostInput = {
  id: string
  slug: string
  title: string
  tags: string[]
  status: string
  publishedAt: string | null
  hasCover: boolean
  viChars: number
  viWords: number
  enChars: number
  hasEn: boolean
  /** Điểm SEO 0 đến 100 của bài (chấm bằng bộ chấm ở màn SEO). null = chưa chấm được. */
  seoScore: number | null
}

export type EnState = 'ok' | 'short' | 'none'

export type PostRow = {
  id: string
  slug: string
  title: string
  status: string
  tags: string[]
  pillar: PillarId | null
  stage: StageId | null
  kind: KindId | null
  services: ServiceSlug[]
  classified: boolean
  offTopic: boolean
  publishedAt: string | null
  /** Ngày đăng đã định dạng dd/mm/yyyy theo giờ Việt Nam (tính ở máy chủ để khỏi lệch giữa máy chủ và trình duyệt). */
  publishedLabel: string
  ageDays: number | null
  viWords: number
  enState: EnState
  hasCover: boolean
  seoScore: number | null
}

export type PillarStat = {
  id: PillarId
  label: string
  hint: string
  color: string
  count: number
  pct: number
  targetPct: number
  /** Số bài đang dư (+) hoặc thiếu (-) so với tỷ trọng gợi ý. */
  delta: number
  words: number
  avgWords: number
  /** % bài có bản tiếng Anh đủ nội dung. */
  enPct: number
  seoAvg: number | null
  newestDays: number | null
  avgAgeDays: number | null
  byStage: Record<StageId, { count: number; words: number }>
  byKind: Record<KindId, { count: number; words: number }>
}

export type CadenceWeek = { label: string; total: number; byPillar: Record<PillarId, number> }

export type Suggestion = BacklogItem & {
  pillarLabel: string
  serviceLabel: string
  cellCount: number
  score: number
  done: boolean
  top: boolean
}

export type Issue = {
  id: string
  level: 'warn' | 'info'
  title: string
  detail: string
  items: { id: string; label: string; note?: string }[]
}

export type ContentAnalysis = {
  asOf: string
  totals: {
    published: number
    drafts: number
    enOk: number
    evergreenPct: number
    avgWords: number
    totalWords: number
    seoAvg: number | null
    shortPillars: string[]
    newestDays: number | null
    newestTitle: string
    last30: number
  }
  pillars: PillarStat[]
  matrix: { service: ServiceSlug; label: string; cells: Record<StageId, number>; total: number }[]
  stageTotals: Record<StageId, number>
  /** Câu tóm tắt khoảng trống lớn nhất: giai đoạn mua mỏng và dịch vụ chưa có bài nào. */
  gapSummary: string
  cadence: {
    weeks: CadenceWeek[]
    /** Chuỗi tuần liền nhau không có bài (chỉ báo khi từ 4 tuần trở lên): bắt đầu ở tuần thứ start, dài len tuần. */
    hole: { start: number; len: number; label: string } | null
    insight: string
  }
  suggestions: Suggestion[]
  issues: Issue[]
  tags: { tag: string; count: number; pillar: PillarId | null }[]
  rows: PostRow[]
}

/* ------------------------------ Tính toán ------------------------------ */

// Mọi ngày tính theo giờ Việt Nam cố định (UTC+7), không phụ thuộc múi giờ máy chủ hay trình duyệt.
const DAY = 86_400_000
const VN_OFFSET = 7 * 3_600_000
const dayIndex = (ms: number) => Math.floor((ms + VN_OFFSET) / DAY)
const pad = (n: number) => String(n).padStart(2, '0')
const fmtDay = (d: number) => {
  const x = new Date(d * DAY)
  return `${pad(x.getUTCDate())}/${pad(x.getUTCMonth() + 1)}`
}
const fmtDayFull = (d: number) => `${fmtDay(d)}/${new Date(d * DAY).getUTCFullYear()}`
/** Ngày đầu tuần (thứ Hai) của một ngày. 01/01/1970 là thứ Năm. */
const weekStart = (d: number) => d - ((d + 3) % 7)

const normTitle = (v: string) =>
  v
    .normalize('NFC')
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

function classify(p: ContentPostInput): { meta: Meta | null; pillar: PillarId | null } {
  const meta = POST_META[p.slug] ?? null
  if (meta) return { meta, pillar: meta.pillar }
  for (const t of p.tags) {
    const pillar = TAG_PILLAR[t.trim().toLowerCase()]
    if (pillar) return { meta: null, pillar }
  }
  return { meta: null, pillar: null }
}

export function analyzeContent(posts: ContentPostInput[], now: number = Date.now()): ContentAnalysis {
  const today = dayIndex(now)
  const published = posts.filter((p) => p.status === 'published')
  const drafts = posts.filter((p) => p.status !== 'published')

  const rows: PostRow[] = posts.map((p) => {
    const { meta, pillar } = classify(p)
    const pubDay = p.publishedAt ? dayIndex(Date.parse(p.publishedAt)) : null
    const ratio = p.viChars > 0 ? p.enChars / p.viChars : 0
    const enState: EnState = !p.hasEn ? 'none' : ratio < 0.6 ? 'short' : 'ok'
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      status: p.status,
      tags: p.tags,
      pillar,
      stage: meta?.stage ?? null,
      kind: meta?.kind ?? null,
      services: relatedServiceSlugs(p.slug, p.tags).filter(isService),
      classified: !!meta,
      offTopic: !!meta?.offTopic,
      publishedAt: p.publishedAt,
      publishedLabel: pubDay === null ? '' : fmtDayFull(pubDay),
      ageDays: pubDay === null ? null : Math.max(0, today - pubDay),
      viWords: p.viWords,
      enState,
      hasCover: p.hasCover,
      seoScore: p.seoScore,
    }
  })
  const pubRows = rows.filter((r) => r.status === 'published')

  // Ô dịch vụ × giai đoạn
  const cellOf = (svc: ServiceSlug, stage: StageId) =>
    pubRows.filter((r) => r.stage === stage && r.services.includes(svc)).length
  const matrix = SERVICE_ORDER.map((service) => {
    const cells = {
      learn: cellOf(service, 'learn'),
      guide: cellOf(service, 'guide'),
      decide: cellOf(service, 'decide'),
    }
    return { service, label: SERVICE_SHORT[service], cells, total: cells.learn + cells.guide + cells.decide }
  })
  const stageTotals = {
    learn: pubRows.filter((r) => r.stage === 'learn').length,
    guide: pubRows.filter((r) => r.stage === 'guide').length,
    decide: pubRows.filter((r) => r.stage === 'decide').length,
  }

  const emptyServices = matrix.filter((m) => m.total === 0).map((m) => m.label)
  const decideShare = pubRows.length ? stageTotals.decide / pubRows.length : 0
  const gapParts: string[] = []
  if (pubRows.length) {
    gapParts.push(
      `Giai đoạn chọn và triển khai chỉ có ${stageTotals.decide} bài trên ${pubRows.length} (${Math.round(decideShare * 100)}%), trong khi tìm hiểu có ${stageTotals.learn} bài.`
    )
    if (decideShare < 0.15) gapParts.push('Đây là lúc khách gần quyết định liên hệ nhất nên nên ưu tiên viết thêm.')
  }
  if (emptyServices.length) gapParts.push(`Dịch vụ chưa có bài nào: ${emptyServices.join(', ')}.`)
  const gapSummary = gapParts.join(' ')

  // Nhóm chủ đề so với tỷ trọng gợi ý
  const nPub = pubRows.length
  const sum = (a: number[]) => a.reduce((n, x) => n + x, 0)
  const pillars: PillarStat[] = PILLARS.map((pl) => {
    const rs = pubRows.filter((r) => r.pillar === pl.id)
    const count = rs.length
    const words = sum(rs.map((r) => r.viWords))
    const scores = rs.map((r) => r.seoScore).filter((x): x is number => x !== null)
    const ages = rs.map((r) => r.ageDays).filter((x): x is number => x !== null)
    const bucket = <K extends string>(ids: K[], pick: (r: PostRow) => K | null) =>
      Object.fromEntries(
        ids.map((id) => {
          const m = rs.filter((r) => pick(r) === id)
          return [id, { count: m.length, words: sum(m.map((r) => r.viWords)) }]
        })
      ) as Record<K, { count: number; words: number }>
    return {
      id: pl.id,
      label: pl.label,
      hint: pl.hint,
      color: pl.color,
      count,
      pct: nPub ? Math.round((count / nPub) * 100) : 0,
      targetPct: pl.target,
      delta: Math.round((count - (pl.target / 100) * nPub) * 10) / 10,
      words,
      avgWords: count ? Math.round(words / count) : 0,
      enPct: count ? Math.round((rs.filter((r) => r.enState === 'ok').length / count) * 100) : 0,
      seoAvg: scores.length ? Math.round(sum(scores) / scores.length) : null,
      newestDays: ages.length ? Math.min(...ages) : null,
      avgAgeDays: ages.length ? Math.round(sum(ages) / ages.length) : null,
      byStage: bucket(['learn', 'guide', 'decide'] as StageId[], (r) => r.stage),
      byKind: bucket(['guide', 'opinion', 'news', 'policy'] as KindId[], (r) => r.kind),
    }
  })
  const deficit = new Set(pillars.filter((p) => p.delta <= -1).map((p) => p.id))

  // Gợi ý bài nên viết: ô trống nhiều điểm hơn, giai đoạn chọn/triển khai nhiều điểm hơn, nhóm đang thiếu cộng thêm
  const publishedSlugs = new Set(published.map((p) => p.slug))
  const svcTotal = new Map(matrix.map((m) => [m.service, m.total]))
  const scored = BACKLOG.map((b, i) => {
    const cellCount = matrix.find((m) => m.service === b.service)?.cells[b.stage] ?? 0
    const done = publishedSlugs.has(b.slug)
    const score =
      (cellCount === 0 ? 5 : cellCount === 1 ? 2 : 0) +
      (b.stage === 'decide' ? 2 : b.stage === 'guide' ? 1 : 0) +
      (deficit.has(b.pillar) ? 2 : 0) +
      ((svcTotal.get(b.service) ?? 0) === 0 ? 2 : 0)
    return { b, i, cellCount, done, score }
  }).sort((x, y) => Number(x.done) - Number(y.done) || y.score - x.score || x.i - y.i)
  const perService = new Map<ServiceSlug, number>()
  const suggestions: Suggestion[] = scored.map(({ b, cellCount, done, score }) => {
    let top = false
    if (!done && score > 0 && (perService.get(b.service) ?? 0) < 2) {
      perService.set(b.service, (perService.get(b.service) ?? 0) + 1)
      top = true
    }
    return {
      ...b,
      pillarLabel: PILLARS.find((p) => p.id === b.pillar)?.label ?? '',
      serviceLabel: SERVICE_SHORT[b.service],
      cellCount,
      score,
      done,
      top,
    }
  })
  // Chỉ giữ 8 gợi ý đầu là "ưu tiên"
  let topLeft = 8
  for (const s of suggestions) {
    if (s.top) {
      if (topLeft > 0) topLeft--
      else s.top = false
    }
  }

  // Nhịp đăng bài
  const pubDays = pubRows
    .filter((r) => r.publishedAt)
    .map((r) => dayIndex(Date.parse(r.publishedAt as string)))
    .sort((a, b) => a - b)
  const thisWeek = weekStart(today)
  const WEEKS = 18
  const pubByDay = pubRows
    .filter((r) => r.publishedAt && r.pillar)
    .map((r) => ({ d: dayIndex(Date.parse(r.publishedAt as string)), pillar: r.pillar as PillarId }))
  const weeks: CadenceWeek[] = Array.from({ length: WEEKS }, (_, k) => {
    const start = thisWeek - (WEEKS - 1 - k) * 7
    const inWeek = pubByDay.filter((x) => x.d >= start && x.d < start + 7)
    const byPillar = Object.fromEntries(PILLARS.map((pl) => [pl.id, inWeek.filter((x) => x.pillar === pl.id).length])) as Record<PillarId, number>
    return { label: fmtDay(start), total: inWeek.length, byPillar }
  })
  const newestDay = pubDays.length ? pubDays[pubDays.length - 1] : null
  let gap = 0
  let gapStart = 0
  let gapEnd = 0
  for (let i = 1; i < pubDays.length; i++) {
    const g = pubDays[i] - pubDays[i - 1]
    if (g > gap) {
      gap = g
      gapStart = pubDays[i - 1]
      gapEnd = pubDays[i]
    }
  }
  const afterGap = pubDays.filter((d) => d >= gapEnd).length
  // Chuỗi tuần trống dài nhất nằm giữa hai tuần có bài
  let hole: { start: number; len: number; label: string } | null = null
  for (let i = 0; i < weeks.length; ) {
    if (weeks[i].total === 0 && i > 0 && weeks.slice(0, i).some((w) => w.total > 0)) {
      let j = i
      while (j < weeks.length && weeks[j].total === 0) j++
      if (j < weeks.length && j - i >= 4 && (!hole || j - i > hole.len)) {
        const inWindow = gap > 0 && gapStart >= thisWeek - (WEEKS - 1) * 7
        hole = { start: i, len: j - i, label: `${inWindow ? gap : (j - i) * 7} ngày không có bài` }
      }
      i = j
    } else i++
  }
  let insight: string
  if (!pubDays.length) insight = 'Chưa có bài nào được đăng.'
  else if (gap >= 30 && newestDay !== null && today - gapEnd <= 45) {
    insight = `${afterGap} bài đăng dồn từ ${fmtDayFull(gapEnd)}, sau ${gap} ngày không có bài (${fmtDay(gapStart)} đến ${fmtDay(gapEnd)}). Chia đều khoảng 1 đến 2 bài mỗi tuần sẽ tốt hơn đăng dồn một đợt: Google đánh giá site còn được chăm sóc, và mỗi bài có thời gian được lập chỉ mục.`
  } else if (newestDay !== null && today - newestDay > 14) {
    insight = `Đã ${today - newestDay} ngày chưa có bài mới. Nên giữ nhịp 1 đến 2 bài mỗi tuần.`
  } else {
    insight = `Nhịp đăng đang đều: ${pubDays.filter((d) => d > today - 30).length} bài trong 30 ngày gần nhất.`
  }

  // Việc cần xử lý
  const issues: Issue[] = []
  const shortEn = pubRows.filter((r) => r.enState === 'short')
  if (shortEn.length)
    issues.push({
      id: 'en-short',
      level: 'warn',
      title: 'Bản tiếng Anh ngắn hơn nhiều so với bản tiếng Việt',
      detail: 'Bản /en vẫn được lập chỉ mục nhưng nội dung chưa đủ. Nên dịch đủ hoặc rút gọn cho cân.',
      items: shortEn.map((r) => ({ id: r.id, label: r.title })),
    })
  const old = pubRows.filter((r) => (r.ageDays ?? 0) >= 90).sort((a, b) => (b.ageDays ?? 0) - (a.ageDays ?? 0))
  if (old.length)
    issues.push({
      id: 'old',
      level: 'info',
      title: 'Bài đăng trên 90 ngày',
      detail: 'Rà lại số liệu, tên sản phẩm và ngày. Bài còn đúng thì cập nhật ngày để Google thấy là bài còn sống.',
      items: old.map((r) => ({ id: r.id, label: r.title, note: `${r.ageDays} ngày` })),
    })
  const pubTitles = new Set(published.map((p) => normTitle(p.title)))
  const dupDrafts = drafts.filter((p) => pubTitles.has(normTitle(p.title)))
  if (dupDrafts.length)
    issues.push({
      id: 'draft-dup',
      level: 'info',
      title: 'Bản nháp trùng tiêu đề với bài đã đăng',
      detail: 'Dễ chọn nhầm khi sửa bài. Có thể xóa hoặc hợp nhất vào bài đã đăng.',
      items: dupDrafts.map((p) => ({ id: p.id, label: p.title, note: p.slug })),
    })
  const unclassified = rows.filter((r) => r.status === 'published' && !r.classified)
  if (unclassified.length)
    issues.push({
      id: 'unclassified',
      level: 'warn',
      title: 'Bài chưa xếp nhóm',
      detail: 'Bài mới đăng cần một dòng trong POST_META (lib/cms/content-plan.ts) thì mới được tính vào các biểu đồ trên.',
      items: unclassified.map((r) => ({ id: r.id, label: r.title, note: r.slug })),
    })
  const off = pubRows.filter((r) => r.offTopic)
  if (off.length)
    issues.push({
      id: 'off-topic',
      level: 'info',
      title: 'Bài ít liên quan đến dịch vụ',
      detail: 'Bài tin tức đời sống công nghệ khó dẫn khách về dịch vụ. Chỉ nên viết khi có góc liên hệ rõ với khách hàng.',
      items: off.map((r) => ({ id: r.id, label: r.title })),
    })
  const noCover = pubRows.filter((r) => !r.hasCover)
  if (noCover.length)
    issues.push({
      id: 'no-cover',
      level: 'info',
      title: 'Bài chưa có ảnh bìa',
      detail: 'Thẻ bài trên trang Blog và khi chia sẻ sẽ không có ảnh.',
      items: noCover.map((r) => ({ id: r.id, label: r.title })),
    })

  // Nhãn đang dùng
  const tagCount = new Map<string, number>()
  for (const r of pubRows) for (const t of r.tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1)
  const tags = [...tagCount.entries()]
    .map(([tag, count]) => ({ tag, count, pillar: TAG_PILLAR[tag.trim().toLowerCase()] ?? null }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'vi'))

  const words = pubRows.map((r) => r.viWords).filter((w) => w > 0)
  const newest = pubRows
    .filter((r) => r.ageDays !== null)
    .sort((a, b) => (a.ageDays ?? 0) - (b.ageDays ?? 0))[0]
  const nonNews = pubRows.filter((r) => r.kind && r.kind !== 'news').length
  const classified = pubRows.filter((r) => r.kind).length

  return {
    asOf: fmtDayFull(today),
    totals: {
      published: nPub,
      drafts: drafts.length,
      enOk: pubRows.filter((r) => r.enState === 'ok').length,
      evergreenPct: classified ? Math.round((nonNews / classified) * 100) : 0,
      avgWords: words.length ? Math.round(words.reduce((n, w) => n + w, 0) / words.length) : 0,
      totalWords: words.reduce((n, w) => n + w, 0),
      seoAvg: (() => {
        const sc = pubRows.map((r) => r.seoScore).filter((x): x is number => x !== null)
        return sc.length ? Math.round(sc.reduce((n, x) => n + x, 0) / sc.length) : null
      })(),
      shortPillars: pillars.filter((p) => p.delta <= -1).map((p) => p.label),
      newestDays: newest?.ageDays ?? null,
      newestTitle: newest?.title ?? '',
      last30: pubRows.filter((r) => r.ageDays !== null && r.ageDays <= 30).length,
    },
    pillars,
    matrix,
    stageTotals,
    gapSummary,
    cadence: { weeks, hole, insight },
    suggestions,
    issues,
    tags,
    rows,
  }
}

export { SERVICE_LABELS }
