'use client'

/**
 * Trang dịch vụ Speech Insight AI — Phân tích cuộc gọi bằng AI.
 *
 * 3 LUẬT KHI SỬA FILE NÀY:
 * 1. i18n: MỌI chuỗi hiển thị PHẢI đi qua t(vi, en). Không hardcode 1 ngôn ngữ
 *    (bug đang tồn tại ở ai-integration/page.tsx và automation/page.tsx:
 *     khai const { t } nhưng không dùng → bản EN vẫn ra tiếng Việt).
 * 2. KHÔNG viết số liệu kiểu "73% theo báo cáo X" khi chưa có nguồn thật.
 *    Số trên trang này chỉ được là: sự thật cấu trúc (100% cuộc gọi, 9 lớp,
 *    6 bước) hoặc phép tính ghi rõ "giả định".
 * 3. Số trong mockup/demo là dữ liệu dựng sẵn để minh hoạ giao diện — KHÔNG được
 *    gắn tên khách hàng thật hoặc trình bày như kết quả đã đo của một khách cụ thể.
 *    (Anh Trung yêu cầu bỏ các caption "ví dụ minh hoạ" khỏi giao diện.)
 */

import Link from '@/components/app-link'
import {
  AudioLines,
  PhoneCall,
  FileText,
  Users,
  ListChecks,
  Gauge,
  Database,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tags,
  BarChart3,
  Plug,
  Lock,
  EyeOff,
  Trash2,
  ScrollText,
  Braces,
  Bot,
  Wallet,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { ServiceAnswer, ServiceReadMore } from '@/components/seo/service-answer'
import { Footer } from '@/components/layout/footer'
import { SpeechReportSample } from '@/components/services/speech-report-sample'
import { ClaudeEngine } from '@/components/services/claude-engine'
import { AnalysisDemo } from '@/components/services/analysis-demo'
import { TechPayload } from '@/components/services/tech-payload'
import { InsightAnalytics } from '@/components/services/insight-analytics'
import { FaqAccordion } from '@/components/services/faq-accordion'
import { PricingGroupTiers } from '@/components/sections/pricing-grouped-tiers'
import { useLanguage } from '@/contexts/language-context'
import { useServicePricingGroup } from '@/lib/cms/service-pricing'
import { useServiceCta } from '@/contexts/web-content-context'
import { DEFAULT_SERVICE_CTAS } from '@/lib/cms/web-content-shared'
import { FAQ_ITEMS } from './_data/faq'

/** Nhãn dịch vụ dùng ở /contact — phải khớp option trong contact-form.tsx */
const SERVICE_LABEL = 'Phân tích cuộc gọi AI'
const CONTACT_HREF = `/contact?service=${encodeURIComponent(SERVICE_LABEL)}`

export default function SpeechInsightAiPage() {
  const { t, language } = useLanguage()
  const cta = useServiceCta('speech-insight-ai') ?? DEFAULT_SERVICE_CTAS['speech-insight-ai']
  // Giá lấy từ trang /pricing — KHÔNG hardcode ở đây, xem lib/cms/service-pricing.tsx
  const pricingGroup = useServicePricingGroup()

  const problems = [
    {
      problem: t(
        'Quản lý nghe được vài cuộc mỗi tuần, phần còn lại tin vào báo cáo sale tự khai',
        'Managers listen to a handful of calls a week and trust self-reported summaries for the rest'
      ),
      solution: t(
        'Bóc băng 100% cuộc gọi thành văn bản tìm kiếm được — đọc tóm tắt 30 giây thay vì nghe 8 phút, tìm được mọi từ khoá: "giảm giá", "đối thủ", "để em suy nghĩ"',
        'Transcribe 100% of calls into searchable text — read a 30-second summary instead of listening for 8 minutes, and search any keyword: "discount", "competitor", "let me think about it"'
      ),
    },
    {
      problem: t(
        'Bộ phận kiểm soát nghe mẫu rồi chấm tay vào Excel, mỗi người một thước đo',
        'QA listens to samples and scores by hand in Excel — every reviewer uses a different yardstick'
      ),
      solution: t(
        'Chấm 100% cuộc gọi theo đúng bộ tiêu chí của bạn — cùng một thước đo, mỗi tiêu chí kèm câu trích dẫn nguyên văn làm bằng chứng',
        'Score 100% of calls against your own scorecard — one consistent yardstick, every criterion backed by a verbatim quote'
      ),
    },
    {
      problem: t(
        'Nghe lại ghi âm là bất khả thi về mặt thời gian: 20 nhân viên × 30 cuộc/ngày × 5 phút ≈ 1.100 giờ mỗi tháng (phép tính giả định)',
        'Reviewing recordings is mathematically impossible: 20 agents × 30 calls/day × 5 minutes ≈ 1,100 hours per month (illustrative estimate)'
      ),
      solution: t(
        'AI xử lý song song toàn bộ. Con người chỉ mở lại những cuộc bị gắn cờ: điểm thấp, khách bức xúc, cam kết rủi ro, deal lớn',
        'AI processes everything in parallel. People only open the flagged ones: low scores, upset customers, risky promises, big deals'
      ),
    },
    {
      problem: t(
        'Cuối ngày nhân viên mệt, ghi CRM đúng một dòng "khách quan tâm, sẽ gọi lại" — nhu cầu, ngân sách, lý do từ chối không bao giờ vào hệ thống',
        'At the end of the day, staff log a single line — "customer interested, will call back". Needs, budget and objections never make it into the system'
      ),
      solution: t(
        'AI trích nhu cầu, ngân sách, khu vực, lý do từ chối, lịch hẹn rồi ghi thẳng vào trường CRM. Nhân viên chỉ bấm xác nhận',
        'AI extracts needs, budget, location, objections and appointments, then writes them straight into CRM fields. Staff just confirm'
      ),
    },
    {
      problem: t(
        'Marketing chọn thông điệp quảng cáo dựa trên phỏng đoán, trong khi câu trả lời nằm sẵn trong hàng nghìn cuộc gọi không ai đọc',
        'Marketing picks ad messaging by guesswork, while the answers sit inside thousands of calls nobody reads'
      ),
      solution: t(
        'Gom nhóm chủ đề và phản đối theo tần suất — biết chính xác khách hỏi gì, chê gì, so sánh với đối thủ nào',
        'Cluster topics and objections by frequency — know exactly what customers ask, complain about and compare you against'
      ),
    },
    {
      problem: t(
        'Nhân viên hứa vượt quyền để chốt đơn, doanh nghiệp chỉ biết khi khách khiếu nại hoặc đòi hoàn tiền',
        'Staff over-promise to close deals; the company only finds out when a customer complains or demands a refund'
      ),
      solution: t(
        'Danh sách từ khoá cấm do bạn định nghĩa. Cuộc gọi vi phạm được gắn cờ ngay, cảnh báo qua Zalo/Email kèm link nhảy đúng phút có vấn đề',
        'You define the prohibited-phrase list. Violations are flagged instantly with a Zalo/Email alert linking to the exact moment'
      ),
    },
  ]

  const features = [
    {
      stage: 'TEXT',
      icon: <FileText className="w-6 h-6" />,
      title: t('Bóc băng tiếng Việt cho hội thoại bán hàng', 'Vietnamese transcription built for sales calls'),
      description: t(
        'Xử lý giọng vùng miền, nói nhanh, nói chồng tiếng và tạp âm văn phòng. Nạp được từ điển riêng của doanh nghiệp: tên sản phẩm, dự án, khoá học.',
        'Handles regional accents, fast speech, overlapping talk and office noise. Loads your own dictionary: product names, projects, courses.'
      ),
      items: [
        t('Dấu thời gian từng câu', 'Per-sentence timestamps'),
        t('Từ điển riêng theo ngành', 'Industry-specific dictionary'),
        t('Nhận diện số điện thoại, số tiền', 'Phone number & amount detection'),
        t('Tìm kiếm toàn văn', 'Full-text search'),
      ],
    },
    {
      stage: 'TEXT',
      icon: <Users className="w-6 h-6" />,
      title: t('Tách người nói', 'Speaker separation'),
      description: t(
        'Phân biệt rõ nhân viên và khách hàng, mở ra các chỉ số mà tai người không đo nổi.',
        'Clearly separates agent from customer, unlocking metrics the human ear cannot measure.'
      ),
      items: [
        t('Tỷ lệ thời lượng nói', 'Talk-time ratio'),
        t('Số lần ngắt lời', 'Interruption count'),
        t('Khoảng lặng bất thường', 'Unusual silence gaps'),
        t('Tốc độ nói', 'Speaking pace'),
      ],
    },
    {
      stage: 'AI',
      icon: <ListChecks className="w-6 h-6" />,
      title: t('Tóm tắt cuộc gọi và việc cần làm', 'Call summary and action items'),
      description: t(
        'Đọc trong 30 giây: khách là ai, cần gì, phản đối gì, nhân viên đã hứa gì và bước tiếp theo là gì.',
        'A 30-second read: who the customer is, what they need, what they objected to, what was promised and what happens next.'
      ),
      items: [
        t('Tóm tắt 5 dòng', '5-line summary'),
        t('Cam kết nhân viên đã đưa ra', 'Promises made by the agent'),
        t('Bước tiếp theo kèm hạn', 'Next step with deadline'),
        t('Liên kết bản ghi gốc', 'Link to original transcript'),
      ],
    },
    {
      stage: 'AI',
      icon: <Gauge className="w-6 h-6" />,
      title: t('Chấm điểm theo kịch bản riêng của bạn', 'Scoring against your own playbook'),
      description: t(
        'Không áp bộ tiêu chí đóng gói sẵn của nước ngoài — dùng đúng checklist mà đội bạn đang huấn luyện.',
        'No imported one-size-fits-all rubric — we use the exact checklist your team already trains on.'
      ),
      items: [
        t('Trọng số từng tiêu chí', 'Weighted criteria'),
        t('Bằng chứng trích dẫn nguyên văn', 'Verbatim evidence quotes'),
        t('Chấm 100% cuộc gọi', 'Scores 100% of calls'),
        t('So sánh theo nhân viên và nhóm', 'Compare by agent and team'),
      ],
    },
    {
      stage: 'AI',
      icon: <Sparkles className="w-6 h-6" />,
      title: t('Nhận diện cảm xúc và khách bức xúc', 'Sentiment and escalation detection'),
      description: t(
        'Đo cảm xúc theo từng đoạn trong cuộc gọi, không gán một nhãn duy nhất cho cả cuộc.',
        'Measures sentiment segment by segment instead of stamping one label on the whole call.'
      ),
      items: [
        t('Cảm xúc theo dòng thời gian', 'Sentiment over time'),
        t('Cảnh báo nguy cơ mất khách', 'Churn-risk alerts'),
        t('Dấu hiệu khiếu nại', 'Complaint signals'),
        t('Điểm hài lòng ước tính', 'Estimated satisfaction score'),
      ],
    },
    {
      stage: 'CRM',
      icon: <Database className="w-6 h-6" />,
      title: t('Trích xuất dữ liệu và tự động điền CRM', 'Data extraction and CRM auto-fill'),
      description: t(
        'Trái tim của dịch vụ: biến cuộc trò chuyện thành các trường dữ liệu có cấu trúc nằm đúng chỗ trong CRM.',
        'The heart of the service: turns a conversation into structured fields sitting in the right place in your CRM.'
      ),
      items: [
        t('Ánh xạ sang trường CRM có sẵn', 'Maps to your existing CRM fields'),
        t('Cập nhật giai đoạn deal', 'Updates deal stage'),
        t('Tạo task và nhắc lịch', 'Creates tasks and reminders'),
        t('Nhân viên xác nhận một chạm', 'One-tap confirmation by staff'),
      ],
      highlight: true,
    },
    {
      stage: 'AI',
      icon: <Tags className="w-6 h-6" />,
      title: t('Phát hiện chủ đề và lý do phản đối', 'Topic and objection detection'),
      description: t(
        'Trả lời câu hỏi đắt nhất: phản đối nào thực sự làm mất đơn, phản đối nào khách chỉ nói cho có.',
        'Answers the most expensive question: which objections actually kill deals and which are just noise.'
      ),
      items: [
        t('Gom nhóm chủ đề', 'Topic clustering'),
        t('Xếp hạng lý do phản đối', 'Objection ranking'),
        t('Đối chiếu với tỷ lệ chốt', 'Cross-referenced with close rate'),
        t('Xu hướng theo tuần', 'Weekly trends'),
      ],
    },
    {
      stage: 'AI',
      icon: <ShieldAlert className="w-6 h-6" />,
      title: t('Cảnh báo từ khoá cấm và tuân thủ', 'Prohibited-phrase and compliance alerts'),
      description: t(
        'Bạn tự khai báo danh sách từ cấm và các mẫu cam kết rủi ro theo quy định của ngành mình.',
        'You define the prohibited phrases and risky-promise patterns that matter in your industry.'
      ),
      items: [
        t('Từ cấm tuỳ chỉnh', 'Custom prohibited phrases'),
        t('Phát hiện cam kết vượt quyền', 'Over-promise detection'),
        t('Cảnh báo Zalo, Email, Telegram', 'Zalo, Email, Telegram alerts'),
        t('Nhật ký tuân thủ', 'Compliance log'),
      ],
    },
    {
      stage: 'CRM',
      icon: <BarChart3 className="w-6 h-6" />,
      title: t('Báo cáo xu hướng và xếp hạng đội', 'Trend reports and team ranking'),
      description: t(
        'Nối thẳng vào Dashboard dữ liệu của Clickstar để ghép chất lượng cuộc gọi với chi phí quảng cáo và doanh thu.',
        'Feeds directly into Clickstar Data Dashboard so call quality sits next to ad spend and revenue.'
      ),
      items: [
        t('Xếp hạng theo bộ tiêu chí', 'Ranking by scorecard'),
        t('So sánh với kỳ trước', 'Period-over-period comparison'),
        t('Lọc theo chiến dịch, nguồn', 'Filter by campaign and source'),
        t('Xuất báo cáo tự động', 'Automated report delivery'),
      ],
    },
  ]

  const steps = [
    {
      step: '01',
      title: t('Kết nối nguồn ghi âm', 'Connect the recording source'),
      duration: t('Một lần, 1–3 ngày làm việc', 'One-time, 1–3 business days'),
      description: t(
        'Lấy file ghi âm kèm thông tin cuộc gọi qua API, webhook, SFTP hoặc đồng bộ thư mục cloud. Không đụng vào hệ thống gọi đang chạy.',
        'Pull recordings plus call metadata via API, webhook, SFTP or cloud folder sync. Your live calling system is untouched.'
      ),
    },
    {
      step: '02',
      title: t('Hiệu chỉnh bộ tiêu chí và từ điển', 'Tune the scorecard and dictionary'),
      duration: t('Trong giai đoạn chạy thử', 'During the pilot'),
      description: t(
        'Nạp kịch bản, checklist đánh giá, danh sách từ cấm và từ vựng riêng của doanh nghiệp.',
        'Load your call script, QA checklist, prohibited-phrase list and company-specific vocabulary.'
      ),
    },
    {
      step: '03',
      title: t('Chuẩn hoá và bóc băng', 'Normalise and transcribe'),
      duration: t('Ngay sau khi cúp máy', 'Right after the call ends'),
      description: t(
        'Tách kênh, khử ồn, nhận dạng tiếng Việt, tách người nói và gắn dấu thời gian từng câu.',
        'Channel separation, noise reduction, Vietnamese recognition, speaker separation and per-sentence timestamps.'
      ),
    },
    {
      step: '04',
      title: t('AI phân tích nội dung', 'AI analyses the content'),
      duration: t('Chạy nối tiếp bước 3', 'Immediately after step 3'),
      description: t(
        'Tóm tắt, chấm điểm, đo cảm xúc, gắn nhãn chủ đề và phản đối, trích xuất trường dữ liệu, quét từ cấm.',
        'Summarise, score, measure sentiment, tag topics and objections, extract fields, scan for prohibited phrases.'
      ),
    },
    {
      step: '05',
      title: t('Đẩy về CRM và cảnh báo ngoại lệ', 'Push to CRM and alert on exceptions'),
      duration: t('Gần như tức thì', 'Near-instant'),
      description: t(
        'Cập nhật hồ sơ, deal, dòng thời gian và task. Cuộc bị gắn cờ sẽ gửi cảnh báo kèm link nhảy đúng phút có vấn đề.',
        'Updates records, deals, timeline and tasks. Flagged calls trigger an alert linking to the exact problematic moment.'
      ),
    },
    {
      step: '06',
      title: t('Báo cáo và tối ưu', 'Report and optimise'),
      duration: t('Hàng ngày / hàng tuần', 'Daily / weekly'),
      description: t(
        'Dashboard xu hướng, xếp hạng đội, insight chủ đề gửi tới lãnh đạo, marketing và bộ phận đào tạo.',
        'Trend dashboards, team ranking and topic insights delivered to leadership, marketing and training.'
      ),
    },
  ]

  const securityPoints = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: t(
        'Dữ liệu cuộc gọi của bạn không được dùng để huấn luyện mô hình AI',
        'Your call data is not used to train AI models'
      ),
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: t('Mã hoá khi truyền và khi lưu trữ', 'Encrypted in transit and at rest'),
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: t(
        'Phân quyền theo vai trò: nhân viên chỉ thấy cuộc gọi của mình, quản lý thấy đội mình',
        'Role-based access: staff see only their own calls, managers see their team'
      ),
    },
    {
      icon: <EyeOff className="w-5 h-5" />,
      title: t(
        'Tự động che thông tin nhạy cảm trong bản bóc băng (số thẻ, căn cước, mã OTP)',
        'Automatic masking of sensitive data in transcripts (card numbers, ID numbers, OTP codes)'
      ),
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      title: t(
        'Thời gian lưu trữ cấu hình được, kèm quy trình xoá theo yêu cầu',
        'Configurable retention with a documented deletion process'
      ),
    },
    {
      icon: <ScrollText className="w-5 h-5" />,
      title: t(
        'Nhật ký truy cập đầy đủ: ai đã mở cuộc gọi nào, vào lúc nào',
        'Complete access log: who opened which call, and when'
      ),
    },
  ]

  const sources = [
    t('Tổng đài IP / Cloud Contact Center có API hoặc webhook', 'IP / Cloud contact centers with API or webhook'),
    t('Tổng đài mã nguồn mở tự dựng: Asterisk, FreePBX, Issabel, 3CX', 'Self-hosted open-source PBX: Asterisk, FreePBX, Issabel, 3CX'),
    t('Ghi âm cuộc họp online: Google Meet, Zoom, Microsoft Teams', 'Online meeting recordings: Google Meet, Zoom, Microsoft Teams'),
    t('Ứng dụng ghi âm trên máy di động của nhân viên', 'Call-recording apps on staff mobile devices'),
    t('Đồng bộ thư mục, SFTP, Google Drive, OneDrive, S3', 'Folder sync, SFTP, Google Drive, OneDrive, S3'),
  ]

  const destinations = [
    { name: 'CRM Clickstar', desc: t('Hồ sơ, deal, dòng thời gian, task', 'Records, deals, timeline, tasks'), href: '/services/crm-cdp' },
    { name: 'CDP Clickstar', desc: t('Làm giàu hồ sơ, phân khúc theo phản đối', 'Profile enrichment, objection-based segments'), href: '/services/crm-cdp' },
    { name: 'ADS hub', desc: t('Loại tệp đã mua khỏi quảng cáo, dựng tệp nhắm mục tiêu', 'Exclude buyers from ads, build lookalike audiences'), href: '/ads-hub' },
    { name: t('Dashboard dữ liệu', 'Data Dashboard'), desc: t('Ghép chất lượng cuộc gọi với chi phí quảng cáo và doanh thu', 'Join call quality with ad spend and revenue'), href: '/services/dashboard' },
    { name: 'Automation', desc: t('Hỏi giá thì gửi báo giá, bức xúc thì chuyển quản lý', 'Price question → send quote; upset → escalate to manager'), href: '/services/automation' },
    { name: t('Kênh cảnh báo', 'Alert channels'), desc: t('Zalo OA, Email, Telegram, Slack', 'Zalo OA, Email, Telegram, Slack'), href: null },
  ]

  return (
    <div className="theme-apple">
      <MainNav />
      <main>
        {/* ① Hero: khối trắng, căn giữa, thẻ kết quả cuộc gọi làm ảnh sản phẩm */}
        <section className="ap-tile ap-light">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              <p className="text-sm uppercase tracking-[-0.016em] text-[#515154]">
                {t('CALL TO TEXT · PHÂN TÍCH CUỘC GỌI BẰNG AI', 'CALL TO TEXT · AI CALL ANALYTICS')}
              </p>
              <h1 className="ap-hero-title">{t('Dữ liệu từ mọi cuộc gọi', 'Data from every call')}</h1>
              <p className="ap-lead max-w-[760px]">
                {t(
                  'AI nghe thay bạn, chấm điểm và điền thẳng vào CRM.',
                  'AI listens for you, scores the call and writes straight into your CRM.'
                )}
              </p>
              <p className="max-w-[640px] text-base leading-relaxed text-[#515154]">
                {t(
                  'Call to Text: kết nối tổng đài sẵn có, 100% cuộc gọi thành văn bản.',
                  'Call to Text: connects to your phone system, 100% of calls become text.'
                )}
              </p>
              <div className="ap-cta-row mt-2">
                <Link href={CONTACT_HREF} className="ap-btn ap-btn-primary">
                  {t('Nhận phân tích thử 50 cuộc gọi', 'Get a free 50-call analysis')}
                </Link>
                <Link href="#bao-cao-mau" className="ap-btn ap-btn-ghost">
                  {t('Xem báo cáo mẫu', 'See a sample report')}
                </Link>
              </div>
              <p className="max-w-[680px] text-sm leading-relaxed text-[#515154]">
                {t(
                  'Giữ nguyên tổng đài · Không cài phần mềm trên máy nhân viên · Kết quả tự động ngay sau khi cúp máy',
                  'Keep your phone system · No software on staff devices · Results generated right after the call ends'
                )}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { v: '100%', l: t('cuộc gọi được phân tích, không lấy mẫu', 'of calls analysed, no sampling') },
                { v: '9', l: t('lớp phân tích mỗi cuộc gọi', 'analysis layers per call') },
                { v: '6', l: t('bước chạy tự động, không ai phải bấm', 'automated steps, zero manual work') },
              ].map((x) => (
                <div key={x.v}>
                  <div className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-[#1d1d1f]">{x.v}</div>
                  <div className="mx-auto mt-1 max-w-[22ch] text-[14px] leading-snug text-[#515154] sm:text-[15px]">{x.l}</div>
                </div>
              ))}
            </div>

            {/* Mockup thẻ kết quả cuộc gọi */}
            <div className="mx-auto mt-14 max-w-[600px] overflow-hidden rounded-[18px] border border-[#d2d2d7] bg-white text-left shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0]">
              <div className="flex items-center gap-2 border-b border-[#e0e0e0] bg-[#f5f5f7] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                  <div className="h-3 w-3 rounded-full bg-[#d2d2d7]" />
                </div>
                <div className="flex flex-1 justify-center">
                  <span className="truncate rounded-md bg-white px-4 py-1 text-xs text-[#515154]">crm.clickstar.vn/calls</span>
                </div>
              </div>

              <div className="space-y-4 bg-[#f5f5f7] p-4 sm:p-6">
                <div className="space-y-2">
                  <div className="break-words font-mono text-[12px] text-[#515154] sm:text-[13px]">
                    <span className="font-semibold text-[#1859b8]">{t('NV', 'AG')}</span>
                    {' : '}
                    {t('Dạ em chào anh, em gọi về căn 2 phòng ngủ ạ.', 'Hello, I’m calling about the 2-bedroom unit.')}
                  </div>
                  <div className="break-words font-mono text-[12px] text-[#515154] sm:text-[13px]">
                    <span className="font-semibold text-[#1859b8]">{t('KH', 'CU')}</span>
                    {' : '}
                    {t('Anh cần trong tầm 2 tỷ, có hỗ trợ vay không em?', 'I need something around 2 billion. Any loan support?')}
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="text-[13px] font-medium text-[#515154]">{t('Điểm chất lượng', 'Quality score')}</span>
                    <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#1859b8]">82/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#e0e0e0]">
                    <div className="h-full w-[82%] rounded-full bg-[#1e6dda]" />
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d2d2d7] bg-white px-3 py-1 text-[13px] font-medium text-[#1859b8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1e6dda]" />
                  {t('Cảm xúc: Tích cực', 'Sentiment: Positive')}
                </span>

                <div className="space-y-2">
                  {[
                    { l: t('Ngân sách', 'Budget'), v: t('~2 tỷ', '~2 billion') },
                    { l: t('Khu vực', 'Area'), v: t('Thủ Đức', 'Thu Duc') },
                    { l: t('Bước tiếp theo', 'Next step'), v: t('Hẹn xem nhà — Thứ 7', 'Site visit — Saturday') },
                  ].map((f) => (
                    <div key={f.l} className="flex items-center justify-between gap-3 rounded-[10px] border border-[#e0e0e0] bg-white px-3.5 py-2.5">
                      <span className="flex-shrink-0 text-[13px] text-[#515154]">{f.l}</span>
                      <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                        <span className="truncate">{f.v}</span>
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#1859b8]" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-4 py-2 text-[13px] font-medium text-[#1859b8]">
                <ShieldAlert className="h-4 w-4" />
                {t('Đã gắn cờ: cam kết vượt quyền', 'Flagged: over-promise')}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d2d2d7] bg-white px-4 py-2 text-[13px] font-medium text-[#1859b8]">
                <span className="h-2 w-2 rounded-full bg-[#1e6dda]" />
                {t('Đã đẩy vào CRM', 'Synced to CRM')}
              </span>
            </div>
          </div>
        </section>

        {/* ② Vấn đề và giải pháp: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<PhoneCall className="h-4 w-4" />}
              eyebrow={t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
              title={
                <>
                  {t('Bạn đo được từng đồng quảng cáo. Nhưng đúng lúc khách quyết định mua thì ', 'You measure every ad dollar. Yet at the exact moment customers decide, ')}
                  <span className="text-[#1859b8]">{t('bạn không nghe thấy gì', 'you hear nothing')}</span>
                </>
              }
              lead={t(
                'Cuộc gọi là nơi đơn hàng thực sự được chốt hoặc mất — và cũng là nơi duy nhất trong phễu không ai đo được.',
                'Calls are where deals are actually won or lost — and the only stage of the funnel nobody measures.'
              )}
            />

            <div className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:gap-5">
              {problems.map((item, index) => (
                <div key={index} className="flex h-full flex-col gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                  <div>
                    <span className="inline-flex rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-xs font-medium text-[#515154]">{t('Vấn đề', 'Problem')}</span>
                    <p className="mt-2 text-[15px] leading-snug text-[#515154]">{item.problem}</p>
                  </div>
                  <div>
                    <span className="inline-flex rounded-full bg-[#1e6dda] px-2.5 py-0.5 text-xs font-medium text-white">{t('Giải pháp', 'Solution')}</span>
                    <p className="mt-2 text-base font-semibold leading-snug text-[#1d1d1f]">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="#bao-cao-mau" className="ap-link inline-flex items-center gap-2 font-semibold">
                {t('Xem AI đọc một cuộc gọi thật như thế nào', 'See how AI reads a real call')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ③ Báo cáo mẫu: khối trắng */}
        <section id="bao-cao-mau" className="py-16 lg:py-24 bg-white scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<FileText className="h-4 w-4" />}
              eyebrow={t('BÁO CÁO MẪU', 'SAMPLE REPORT')}
              title={
                <>
                  {t('Một cuộc gọi 8 phút 14 giây, ', 'One 8-minute 14-second call, ')}
                  <span className="text-[#1859b8]">{t('sau khi AI xử lý', 'after AI processing')}</span>
                </>
              }
              lead={t(
                'Cùng một cuộc gọi, bên trái là thứ bạn đang có, bên phải là thứ Speech Insight AI trả về.',
                'The same call: what you have today on the left, what Speech Insight AI returns on the right.'
              )}
            />

            <SpeechReportSample />

            <p className="mt-8 text-center text-[15px] text-[#515154]">
              {t('Nhân viên không gõ thêm một chữ nào. Toàn bộ phần kết quả do AI tạo ra.', 'The agent typed nothing. Every result above was produced by AI.')}
            </p>
          </div>
        </section>

        {/* ④ 9 lớp phân tích: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<Sparkles className="h-4 w-4" />}
              eyebrow={t('TÍNH NĂNG', 'CAPABILITIES')}
              title={
                <>
                  {t('Mỗi cuộc gọi đi qua ', 'Every call passes through ')}
                  <span className="text-[#1859b8]">{t('9 lớp phân tích', '9 layers of analysis')}</span>
                  {t(' — tự động, không ai phải bấm gì', ' — automatically, with zero clicks')}
                </>
              }
            />

            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`flex h-full flex-col rounded-[18px] bg-white p-7 ${f.highlight ? 'border-2 border-[#1e6dda]' : 'border border-[#d2d2d7]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#1e6dda] text-white">{f.icon}</div>
                    <span className="rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#515154]">{f.stage}</span>
                  </div>

                  {f.highlight && (
                    <span className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1859b8]">
                      {t('Trái tim của dịch vụ', 'The heart of the service')}
                    </span>
                  )}

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#1d1d1f]">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#515154]">{f.description}</p>

                  <ul className="mt-auto space-y-2.5 pt-5">
                    {f.items.map((it, k) => (
                      <li key={k} className="flex items-center gap-2.5 text-[14px] text-[#1d1d1f]">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⑤ Mô hình AI: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<Bot className="h-4 w-4" />}
              eyebrow={t('MÔ HÌNH AI', 'AI MODEL')}
              title={
                <>
                  {t('Bộ não đọc cuộc gọi là ', 'The brain reading your calls is ')}
                  <span className="text-[#1859b8]">Claude</span>
                  {t(' của Anthropic', ' by Anthropic')}
                </>
              }
              lead={t(
                'Chúng tôi nói thẳng mình dùng gì. Bên dưới là bốn lý do kỹ thuật cho lựa chọn đó — và ranh giới rõ ràng giữa việc AI làm và việc con người quyết định.',
                'We are upfront about what we run on. Below are the four technical reasons for that choice — and a clear line between what the AI does and what people decide.'
              )}
            />
            <ClaudeEngine />
          </div>
        </section>

        {/* ⑥ Demo phân tích: khối xám nhạt */}
        <section id="demo-phan-tich" className="py-16 lg:py-24 bg-[#f5f5f7] scroll-mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<MessageSquare className="h-4 w-4" />}
              eyebrow={t('DEMO PHÂN TÍCH', 'ANALYSIS DEMO')}
              title={
                <>
                  {t('Cùng một cuộc gọi, ', 'The same call — ')}
                  <span className="text-[#1859b8]">{t('AI nhìn ra những gì', 'here is what the AI sees')}</span>
                </>
              }
              lead={t(
                'Chọn ngành gần với bạn nhất, rồi đi theo ba bước: nghe đoạn hội thoại, xem AI đọc ra tín hiệu gì, và nhận dữ liệu trả về.',
                'Pick the industry closest to yours, then follow three steps: read the conversation, see the signals the AI picks up, and get the data back.'
              )}
            />
            <AnalysisDemo />
          </div>
        </section>

        {/* ⑦ Dữ liệu trả về: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<Braces className="h-4 w-4" />}
              eyebrow={t('DỮ LIỆU TRẢ VỀ', 'DATA OUTPUT')}
              title={
                <>
                  {t('Không phải hộp đen — ', 'Not a black box — ')}
                  <span className="text-[#1859b8]">{t('dữ liệu có cấu trúc', 'structured data')}</span>
                  {t(' đội kỹ thuật dùng được ngay', ' your engineers can use right away')}
                </>
              }
              lead={t(
                'Mỗi cuộc gọi phân tích xong trả về một bản ghi JSON đầy đủ, bắn webhook về hệ thống của bạn hoặc lấy theo lô qua API.',
                'Every analysed call returns a complete JSON record, delivered by webhook to your system or pulled in batches via API.'
              )}
            />
            <TechPayload />
            <p className="mt-6 text-center text-[15px] text-[#515154]">
              {t('Tên trường và ánh xạ sang CRM được cấu hình theo đúng hệ thống của bạn.', 'Field names and CRM mapping are configured to match your own system.')}
            </p>
          </div>
        </section>

        {/* ⑧ AI phân tích dữ liệu tổng hợp: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<BarChart3 className="h-4 w-4" />}
              eyebrow={t('AI PHÂN TÍCH DỮ LIỆU', 'AI DATA ANALYSIS')}
              title={
                <>
                  {t('Từ từng cuộc gọi lên ', 'From single calls to ')}
                  <span className="text-[#1859b8]">{t('bức tranh toàn đội', 'the whole team picture')}</span>
                </>
              }
              lead={t(
                'Khi đã có hàng nghìn cuộc gọi ở dạng dữ liệu, AI trả lời được những câu mà trước đây chỉ có thể phỏng đoán.',
                'Once thousands of calls exist as data, AI answers questions that used to be pure guesswork.'
              )}
            />
            <InsightAnalytics />
          </div>
        </section>

        {/* ⑨ Quy trình 6 bước: khối tối */}
        <section className="py-16 lg:py-24 bg-[#272729] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              dark
              icon={<AudioLines className="h-4 w-4" />}
              eyebrow={t('CÁCH VẬN HÀNH', 'HOW IT RUNS')}
              title={
                <>
                  {t('Từ lúc cúp máy đến khi CRM có dữ liệu — ', 'From hang-up to CRM record — ')}
                  <span className="text-[#7db8ff]">{t('không ai phải làm gì', 'nobody lifts a finger')}</span>
                </>
              }
            />

            <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((s, i) => (
                <div key={i} className="flex h-full flex-col rounded-[18px] border border-white/20 bg-[#1d1d1f] p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6dda] text-[15px] font-semibold text-white">{s.step}</span>
                  <h3 className="mt-5 text-xl font-semibold leading-snug text-white">{s.title}</h3>
                  <span className="mt-3 inline-flex w-fit rounded-full border border-white/30 px-2.5 py-0.5 text-xs text-white">{s.duration}</span>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#d2d2d7]">{s.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-2 text-center">
              <p className="text-lg font-semibold text-white">
                {t(
                  'Toàn bộ 6 bước chạy tự động. Việc duy nhất con người cần làm là xem những gì AI đã gắn cờ.',
                  'All six steps run automatically. The only human job is reviewing what AI flagged.'
                )}
              </p>
              <p className="text-sm text-[#d2d2d7]">
                {t(
                  'Các mốc thời gian xử lý sẽ được chốt bằng số đo thực tế trên hạ tầng của bạn trong giai đoạn chạy thử.',
                  'Exact processing times are confirmed with real measurements on your infrastructure during the pilot.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ⑩ Bảo mật và tuân thủ: khối trắng */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <div className="space-y-4 rounded-[18px] bg-[#1d1d1f] p-6 sm:p-8">
                  {securityPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#1e6dda] text-white">{p.icon}</span>
                      <p className="pt-2 text-[15px] leading-relaxed text-white">{p.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] text-[#515154]">
                  <ShieldCheck className="h-4 w-4" />
                  {t('BẢO MẬT & TUÂN THỦ', 'SECURITY & COMPLIANCE')}
                </span>
                <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl">
                  {t('Ghi âm là dữ liệu cá nhân của khách hàng bạn. ', 'Recordings are your customers’ personal data. ')}
                  <span className="text-[#1859b8]">{t('Chúng tôi coi đó là mặc định, không phải tuỳ chọn', 'We treat that as the default, not an option')}</span>
                </h2>

                <div className="mt-6 rounded-[18px] border border-[#d2d2d7] bg-[#f5f5f7] p-5">
                  <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
                    {t(
                      'Việc ghi âm và phân tích cuộc gọi tại Việt Nam thuộc phạm vi Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Chúng tôi bàn giao kèm mẫu thông báo ghi âm và điều khoản đồng ý để doanh nghiệp triển khai đúng ngay từ đầu.',
                      'Call recording and analysis in Vietnam falls under Decree 13/2023/ND-CP on personal data protection. We hand over recording notice and consent templates so you deploy compliantly from day one.'
                    )}
                  </p>
                </div>

                <p className="mt-6 text-[17px] leading-relaxed text-[#515154]">
                  {t(
                    'Mô hình AI sử dụng đã được nêu rõ ở phần trên. Các thông số triển khai còn lại — nơi lưu trữ dữ liệu, khả năng cài đặt riêng tại hạ tầng của bạn và thời gian lưu trữ — sẽ được xác nhận bằng văn bản trong buổi trao đổi kỹ thuật, trước khi bạn gửi bất kỳ file ghi âm nào.',
                    'The AI model we run on is stated openly above. The remaining deployment parameters — where data is stored, private/on-premise deployment options and retention periods — are confirmed in writing during the technical session, before you send us a single recording.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ⑪ Tích hợp: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Head
              icon={<Plug className="h-4 w-4" />}
              eyebrow={t('TÍCH HỢP', 'INTEGRATIONS')}
              title={
                <>
                  {t('Công cụ bóc băng chỉ trả cho bạn một file văn bản. ', 'A transcription tool hands you a text file. ')}
                  <span className="text-[#1859b8]">{t('Chúng tôi trả kết quả về đúng nơi bạn ra quyết định.', 'We deliver the result where you actually make decisions.')}</span>
                </>
              }
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
              <div className="rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('Nguồn ghi âm đi vào', 'Recording sources in')}</h3>
                <p className="mt-1 text-[15px] text-[#515154]">{t('Chúng tôi đọc file ghi âm bạn đã có sẵn.', 'We read the recordings you already have.')}</p>
                <ul className="mt-5 space-y-3">
                  {sources.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-[#1d1d1f]">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf2fd]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#1859b8]" />
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-[#e0e0e0] pt-4 text-[15px] font-semibold text-[#1d1d1f]">
                  {t(
                    'Nếu tổng đài của bạn xuất được file ghi âm kèm thông tin cuộc gọi, chúng tôi kết nối được.',
                    'If your phone system can export recordings with call metadata, we can connect to it.'
                  )}
                </p>
              </div>

              <div className="rounded-[18px] border border-[#d2d2d7] bg-white p-7">
                <h3 className="text-xl font-semibold text-[#1d1d1f]">{t('Kết quả đi về đâu', 'Where results land')}</h3>
                <p className="mt-1 text-[15px] text-[#515154]">{t('Lợi thế riêng của hệ sinh thái Clickstar.', 'The advantage of the Clickstar ecosystem.')}</p>
                <div className="mt-5 space-y-3">
                  {destinations.map((d, i) => {
                    const inner = (
                      <>
                        <span className="text-[15px] font-semibold text-[#1d1d1f]">{d.name}</span>
                        <span className="text-[13.5px] text-[#515154]">{d.desc}</span>
                      </>
                    )
                    return d.href ? (
                      <Link key={i} href={d.href} className="flex flex-col gap-0.5 rounded-[12px] border border-[#d2d2d7] px-4 py-3 transition-colors hover:border-[#1e6dda] hover:bg-[#f5f5f7]">
                        {inner}
                      </Link>
                    ) : (
                      <div key={i} className="flex flex-col gap-0.5 rounded-[12px] border border-[#d2d2d7] px-4 py-3">
                        {inner}
                      </div>
                    )
                  })}
                </div>
                <p className="mt-4 text-[13.5px] text-[#515154]">
                  {t(
                    'CRM bên thứ ba kết nối qua API hoặc webhook. Xuất Google Sheets, CSV hoặc API mở cho đội phân tích dữ liệu.',
                    'Third-party CRMs connect via API or webhook. Export to Google Sheets, CSV or an open API for your data team.'
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[18px] bg-[#1e6dda] p-7 text-center sm:p-9">
              <p className="text-[22px] font-semibold leading-snug tracking-[-0.01em] text-white sm:text-[26px]">
                {t('Bạn KHÔNG phải đổi tổng đài.', 'You do NOT need to replace your phone system.')}
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-[16px] leading-relaxed text-white">
                {t(
                  'Giữ nguyên số hotline, giữ nguyên cách đội sale đang gọi. Speech Insight AI nằm ở lớp sau cuộc gọi, chỉ đọc file ghi âm đã có. Nhân viên không cài thêm phần mềm nào.',
                  'Keep your hotline numbers and the way your team already calls. Speech Insight AI sits in the layer after the call, reading only the recordings you already have. Your staff install nothing.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ⑫ Bảng giá (đồng bộ từ trang /pricing): khối trắng */}
        {pricingGroup && (
          <section id="bang-gia" className="py-16 lg:py-24 bg-white scroll-mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Head
                icon={<Wallet className="h-4 w-4" />}
                eyebrow={t('BẢNG GIÁ', 'PRICING')}
                title={
                  <>
                    {t('Ba gói theo ', 'Three plans by ')}
                    <span className="text-[#1859b8]">{t('hạn mức phút', 'minute quota')}</span>
                  </>
                }
                lead={t(
                  'Trả theo lượng phút ghi âm thực xử lý — gọi ít không phải trả như gọi nhiều.',
                  'You pay for the recorded minutes actually processed — calling less does not cost the same as calling a lot.'
                )}
              />

              <PricingGroupTiers group={pricingGroup} />

              <div className="mt-8 text-center">
                <Link href="/pricing" className="ap-link inline-flex items-center gap-2 font-semibold">
                  {t('Xem bảng giá đầy đủ của Clickstar', 'See Clickstar’s full pricing')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <ServiceAnswer slug="speech-insight-ai" />

        {/* ⑬ FAQ: khối xám nhạt */}
        <section className="py-16 lg:py-24 bg-[#f5f5f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Số câu lấy thẳng từ FAQ_ITEMS.length: thêm/bớt câu thì tiêu đề tự đúng. */}
            <Head
              icon={<ListChecks className="h-4 w-4" />}
              eyebrow={t('CÂU HỎI THƯỜNG GẶP', 'FREQUENTLY ASKED')}
              title={
                <>
                  {t(`${FAQ_ITEMS.length} câu quản lý sale hay hỏi nhất — `, `The ${FAQ_ITEMS.length} questions sales leaders ask most — `)}
                  <span className="text-[#1859b8]">{t('trả lời thẳng', 'answered directly')}</span>
                </>
              }
            />

            <FaqAccordion items={FAQ_ITEMS} defaultOpen={1} />

            <div className="mt-8 text-center">
              <Link href="/pricing" className="ap-link inline-flex items-center gap-2 font-semibold">
                {t('Xem bảng giá dịch vụ', 'See service pricing')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <ServiceReadMore slug="speech-insight-ai" />

        {/* ⑭ Kêu gọi hành động cuối: khối tối */}
        <section id="contact" className="ap-tile ap-dark scroll-mt-16">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="ap-stack">
              {/* Hộp trung thực: giữ từ khối "Kết quả đo được" */}
              <div className="max-w-[760px] rounded-[18px] border border-dashed border-white/40 p-5 text-left">
                <p className="text-[15px] leading-relaxed text-white">
                  {t(
                    'Chúng tôi chỉ công bố con số khi đã đo được trên dữ liệu thật: độ chính xác bóc băng, kết quả chạy thử, số cuộc gọi đã xử lý. Thay vì đưa bạn một con số tự nghĩ ra, chúng tôi chạy thử trên chính cuộc gọi của bạn rồi đưa số đo — trước khi bạn ký bất cứ thứ gì.',
                    'We only publish numbers we have actually measured on real data: transcription accuracy, pilot results, calls processed. Instead of handing you a number we invented, we run a trial on your own calls and give you measured results — before you sign anything.'
                  )}
                </p>
              </div>

              <h2 className="ap-display max-w-[820px]">{cta.heading[language]}</h2>
              <p className="ap-lead max-w-[680px]">{cta.description[language]}</p>
              <div className="ap-cta-row mt-2">
                <Link href={cta.primary.href} className="ap-btn ap-btn-primary">{cta.primary.label[language]}</Link>
                <Link href={cta.secondary.href} className="ap-btn ap-btn-ghost">{cta.secondary.label[language]}</Link>
              </div>
              <p className="max-w-[640px] text-sm text-[#d2d2d7]">
                {t(
                  'Ký thoả thuận bảo mật trước khi bạn gửi bất kỳ file ghi âm nào. Dữ liệu gửi thử được xoá sau khi kết thúc đánh giá nếu bạn không tiếp tục.',
                  'We sign an NDA before you send any recording. Trial data is deleted after the review if you decide not to proceed.'
                )}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

/** Tiêu đề khối: nhãn nhỏ, h2 (có thể có đoạn nhấn màu), đoạn dẫn. `dark` cho khối nền tối. */
function Head({ icon, eyebrow, title, lead, dark = false }: { icon: React.ReactNode; eyebrow: string; title: React.ReactNode; lead?: string; dark?: boolean }) {
  return (
    <div className="mb-12 text-center lg:mb-14">
      <span className={`mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] ${dark ? 'text-[#d2d2d7]' : 'text-[#515154]'}`}>
        {icon}
        {eyebrow}
      </span>
      <h2 className={`mx-auto max-w-5xl text-3xl font-semibold leading-[1.15] tracking-[-0.005em] text-balance sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-[#1d1d1f]'}`}>
        {title}
      </h2>
      {lead && <p className={`mx-auto mt-5 max-w-3xl text-lg ${dark ? 'text-[#d2d2d7]' : 'text-[#515154]'}`}>{lead}</p>}
    </div>
  )
}
