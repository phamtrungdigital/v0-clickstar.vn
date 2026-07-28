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

import Link from 'next/link'
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
  MessageSquare,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { SpeechReportSample } from '@/components/services/speech-report-sample'
import { ClaudeEngine } from '@/components/services/claude-engine'
import { AnalysisDemo } from '@/components/services/analysis-demo'
import { TechPayload } from '@/components/services/tech-payload'
import { InsightAnalytics } from '@/components/services/insight-analytics'
import { FaqAccordion } from '@/components/services/faq-accordion'
import { useLanguage } from '@/contexts/language-context'
import { useServiceCta } from '@/contexts/web-content-context'
import { DEFAULT_SERVICE_CTAS } from '@/lib/cms/web-content-shared'
import { FAQ_ITEMS } from './_data/faq'

/** Nhãn dịch vụ dùng ở /contact — phải khớp option trong contact-form.tsx */
const SERVICE_LABEL = 'Phân tích cuộc gọi AI'
const CONTACT_HREF = `/contact?service=${encodeURIComponent(SERVICE_LABEL)}`

export default function SpeechInsightAiPage() {
  const { t, language } = useLanguage()
  const cta = useServiceCta('speech-insight-ai') ?? DEFAULT_SERVICE_CTAS['speech-insight-ai']

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
    <>
      <MainNav />
      <main>
        {/* ═══════════ ① HERO ═══════════ */}
        <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-background-soft via-white to-secondary overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 to-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary-dark/15 to-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full mb-6 shadow-lg shadow-cyan-500/25">
                  <AudioLines className="w-4 h-4" />
                  {t('PHÂN TÍCH CUỘC GỌI BẰNG AI', 'AI CALL ANALYTICS')}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6">
                  {t('Biến mọi cuộc gọi thành ', 'Turn every call into ')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                    {t('dữ liệu bán hàng', 'sales data')}
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-4 max-w-xl">
                  {t(
                    'AI nghe thay bạn, chấm điểm và điền thẳng vào CRM.',
                    'AI listens for you, scores the call and writes straight into your CRM.'
                  )}
                </p>

                <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {t(
                    'Speech Insight AI kết nối tổng đài sẵn có, tự bóc băng tiếng Việt và trích xuất nhu cầu – ngân sách – lý do từ chối sau mỗi cuộc gọi.',
                    'Speech Insight AI connects to your existing phone system, transcribes Vietnamese automatically and extracts needs, budget and objections after every call.'
                  )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Link
                    href={CONTACT_HREF}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                  >
                    {t('Nhận phân tích thử 50 cuộc gọi', 'Get a free 50-call analysis')}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#bao-cao-mau"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-foreground font-semibold px-8 py-4 rounded-full border border-border transition-all duration-300"
                  >
                    {t('Xem báo cáo mẫu', 'See a sample report')}
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground mb-10">
                  {t(
                    'Giữ nguyên tổng đài · Không cài phần mềm trên máy nhân viên · Kết quả tự động ngay sau khi cúp máy',
                    'Keep your phone system · No software on staff devices · Results generated right after the call ends'
                  )}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">
                      {t('cuộc gọi được phân tích, không lấy mẫu', 'of calls analysed, no sampling')}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">9</div>
                    <div className="text-sm text-muted-foreground">
                      {t('lớp phân tích mỗi cuộc gọi', 'analysis layers per call')}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">6</div>
                    <div className="text-sm text-muted-foreground">
                      {t('bước chạy tự động, không ai phải bấm', 'automated steps, zero manual work')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mockup thẻ kết quả cuộc gọi */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-2 border border-border">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-t-xl">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-muted-foreground border truncate">
                        crm.clickstar.vn/calls
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-4 bg-gradient-to-br from-slate-50 to-white rounded-b-xl">
                    <div className="space-y-2">
                      <div className="text-[11px] sm:text-xs font-mono text-muted-foreground break-words">
                        <span className="text-cyan-600 font-semibold">NV</span>
                        {' : '}
                        {t('Dạ em chào anh, em gọi về căn 2 phòng ngủ ạ.', 'Hello, I’m calling about the 2-bedroom unit.')}
                      </div>
                      <div className="text-[11px] sm:text-xs font-mono text-muted-foreground break-words">
                        <span className="text-teal-600 font-semibold">KH</span>
                        {' : '}
                        {t('Anh cần trong tầm 2 tỷ, có hỗ trợ vay không em?', 'I need something around 2 billion. Any loan support?')}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('Điểm chất lượng', 'Quality score')}
                        </span>
                        <span className="text-xl font-extrabold text-cyan-600">82/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {t('Cảm xúc: Tích cực', 'Sentiment: Positive')}
                    </span>

                    <div className="space-y-1.5">
                      {[
                        { l: t('Ngân sách', 'Budget'), v: t('~2 tỷ', '~2 billion') },
                        { l: t('Khu vực', 'Area'), v: t('Thủ Đức', 'Thu Duc') },
                        { l: t('Bước tiếp theo', 'Next step'), v: t('Hẹn xem nhà — Thứ 7', 'Site visit — Saturday') },
                      ].map((f) => (
                        <div key={f.l} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-border">
                          <span className="text-xs text-muted-foreground flex-shrink-0">{f.l}</span>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground min-w-0">
                            <span className="truncate">{f.v}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badges — right-2 trên mobile để không tràn viewport */}
                <div className="absolute right-2 sm:-right-4 top-1/4 bg-white rounded-xl shadow-lg p-2.5 border border-rose-200 max-w-[190px]">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="text-[11px] font-medium text-rose-700 leading-tight">
                      {t('Đã gắn cờ: cam kết vượt quyền', 'Flagged: over-promise')}
                    </span>
                  </div>
                </div>

                <div className="absolute left-2 sm:-left-4 bottom-1/4 bg-white rounded-xl shadow-lg p-2.5 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="text-[11px] font-medium text-emerald-700">
                      {t('Đã đẩy vào CRM', 'Synced to CRM')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════ ② VẤN ĐỀ & GIẢI PHÁP ═══════════ */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <PhoneCall className="w-4 h-4" />
                {t('VẤN ĐỀ & GIẢI PHÁP', 'PROBLEMS & SOLUTIONS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-4">
                {t('Bạn đo được từng đồng quảng cáo. Nhưng đúng lúc khách quyết định mua thì ', 'You measure every ad dollar. Yet at the exact moment customers decide, ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('bạn không nghe thấy gì', 'you hear nothing')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Cuộc gọi là nơi đơn hàng thực sự được chốt hoặc mất — và cũng là nơi duy nhất trong phễu không ai đo được.',
                  'Calls are where deals are actually won or lost — and the only stage of the funnel nobody measures.'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-5">
              {problems.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-5 border border-border hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-3">
                        <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <p className="text-foreground font-semibold text-sm">{item.problem}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground text-sm">{item.solution}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="#bao-cao-mau" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all">
                {t('Xem AI đọc một cuộc gọi thật như thế nào', 'See how AI reads a real call')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ ③ BÁO CÁO MẪU ═══════════ */}
        <section id="bao-cao-mau" className="py-12 lg:py-16 bg-background scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <FileText className="w-4 h-4" />
                {t('BÁO CÁO MẪU', 'SAMPLE REPORT')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Một cuộc gọi 8 phút 14 giây, ', 'One 8-minute 14-second call, ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('sau khi AI xử lý', 'after AI processing')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Cùng một cuộc gọi, bên trái là thứ bạn đang có, bên phải là thứ Speech Insight AI trả về.',
                  'The same call: what you have today on the left, what Speech Insight AI returns on the right.'
                )}
              </p>
            </div>

            <SpeechReportSample />

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t(
                'Nhân viên không gõ thêm một chữ nào. Toàn bộ phần kết quả do AI tạo ra.',
                'The agent typed nothing. Every result above was produced by AI.'
              )}
            </p>
          </div>
        </section>

        {/* ═══════════ ④ 9 LỚP PHÂN TÍCH ═══════════ */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                {t('TÍNH NĂNG', 'CAPABILITIES')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Mỗi cuộc gọi đi qua ', 'Every call passes through ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('9 lớp phân tích', '9 layers of analysis')}
                </span>
                {t(' — tự động, không ai phải bấm gì', ' — automatically, with zero clicks')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`group bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                    f.highlight
                      ? 'border-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'border-border hover:border-cyan-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                      {f.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                      {f.stage}
                    </span>
                  </div>

                  {f.highlight && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-cyan-600 mb-2">
                      {t('Trái tim của dịch vụ', 'The heart of the service')}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{f.description}</p>

                  <ul className="space-y-2">
                    {f.items.map((it, k) => (
                      <li key={k} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ ⑤ BỘ NÃO PHÂN TÍCH — CLAUDE ═══════════ */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Bot className="w-4 h-4" />
                {t('MÔ HÌNH AI', 'AI MODEL')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Bộ não đọc cuộc gọi là ', 'The brain reading your calls is ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  Claude
                </span>
                {t(' của Anthropic', ' by Anthropic')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Chúng tôi nói thẳng mình dùng gì. Bên dưới là bốn lý do kỹ thuật cho lựa chọn đó — và ranh giới rõ ràng giữa việc AI làm và việc con người quyết định.',
                  'We are upfront about what we run on. Below are the four technical reasons for that choice — and a clear line between what the AI does and what people decide.'
                )}
              </p>
            </div>

            <ClaudeEngine />
          </div>
        </section>

        {/* ═══════════ ⑥ DEMO PHÂN TÍCH CỤ THỂ ═══════════ */}
        <section id="demo-phan-tich" className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <MessageSquare className="w-4 h-4" />
                {t('DEMO PHÂN TÍCH', 'ANALYSIS DEMO')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Cùng một cuộc gọi, ', 'The same call — ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('AI nhìn ra những gì', 'here is what the AI sees')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Chọn ngành gần với bạn nhất, rồi đi theo ba bước: nghe đoạn hội thoại, xem AI đọc ra tín hiệu gì, và nhận dữ liệu trả về.',
                  'Pick the industry closest to yours, then follow three steps: read the conversation, see the signals the AI picks up, and get the data back.'
                )}
              </p>
            </div>

            <AnalysisDemo />
          </div>
        </section>

        {/* ═══════════ ⑦ DỮ LIỆU AI TRẢ VỀ (kỹ thuật) ═══════════ */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Braces className="w-4 h-4" />
                {t('DỮ LIỆU TRẢ VỀ', 'DATA OUTPUT')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Không phải hộp đen — ', 'Not a black box — ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('dữ liệu có cấu trúc', 'structured data')}
                </span>
                {t(' đội kỹ thuật dùng được ngay', ' your engineers can use right away')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Mỗi cuộc gọi phân tích xong trả về một bản ghi JSON đầy đủ, bắn webhook về hệ thống của bạn hoặc lấy theo lô qua API.',
                  'Every analysed call returns a complete JSON record, delivered by webhook to your system or pulled in batches via API.'
                )}
              </p>
            </div>

            <TechPayload />

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t(
                'Tên trường và ánh xạ sang CRM được cấu hình theo đúng hệ thống của bạn.',
                'Field names and CRM mapping are configured to match your own system.'
              )}
            </p>
          </div>
        </section>

        {/* ═══════════ ⑧ AI PHÂN TÍCH DỮ LIỆU (tổng hợp) ═══════════ */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <BarChart3 className="w-4 h-4" />
                {t('AI PHÂN TÍCH DỮ LIỆU', 'AI DATA ANALYSIS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                {t('Từ từng cuộc gọi lên ', 'From single calls to ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('bức tranh toàn đội', 'the whole team picture')}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Khi đã có hàng nghìn cuộc gọi ở dạng dữ liệu, AI trả lời được những câu mà trước đây chỉ có thể phỏng đoán.',
                  'Once thousands of calls exist as data, AI answers questions that used to be pure guesswork.'
                )}
              </p>
            </div>

            <InsightAnalytics />
          </div>
        </section>

        {/* ═══════════ ⑨ QUY TRÌNH 6 BƯỚC (nền tối) ═══════════ */}
        <section className="py-12 lg:py-16 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-5 py-2.5 rounded-full mb-4 backdrop-blur">
                <AudioLines className="w-4 h-4" />
                {t('CÁCH VẬN HÀNH', 'HOW IT RUNS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                {t('Từ lúc cúp máy đến khi CRM có dữ liệu — ', 'From hang-up to CRM record — ')}
                <span className="text-cyan-400">{t('không ai phải làm gì', 'nobody lifts a finger')}</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="group relative bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {s.step}
                  </div>
                  <div className="pt-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    </div>
                    <span className="inline-block text-xs text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full mb-3">
                      {s.duration}
                    </span>
                    <p className="text-gray-400 text-sm">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 space-y-2">
              <p className="text-lg text-white font-semibold">
                {t(
                  'Toàn bộ 6 bước chạy tự động. Việc duy nhất con người cần làm là xem những gì AI đã gắn cờ.',
                  'All six steps run automatically. The only human job is reviewing what AI flagged.'
                )}
              </p>
              <p className="text-sm text-gray-400">
                {t(
                  'Các mốc thời gian xử lý sẽ được chốt bằng số đo thực tế trên hạ tầng của bạn trong giai đoạn chạy thử.',
                  'Exact processing times are confirmed with real measurements on your infrastructure during the pilot.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ ⑩ BẢO MẬT & TUÂN THỦ ═══════════ */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-foreground rounded-2xl p-6 sm:p-8 space-y-4">
                  {securityPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                        {p.icon}
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed pt-2">{p.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  {t('BẢO MẬT & TUÂN THỦ', 'SECURITY & COMPLIANCE')}
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6">
                  {t('Ghi âm là dữ liệu cá nhân của khách hàng bạn. ', 'Recordings are your customers’ personal data. ')}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                    {t('Chúng tôi coi đó là mặc định, không phải tuỳ chọn', 'We treat that as the default, not an option')}
                  </span>
                </h2>

                <div className="rounded-2xl border border-cyan-200 bg-cyan-50/60 p-5 mb-6">
                  <p className="text-sm text-foreground leading-relaxed">
                    {t(
                      'Việc ghi âm và phân tích cuộc gọi tại Việt Nam thuộc phạm vi Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Chúng tôi bàn giao kèm mẫu thông báo ghi âm và điều khoản đồng ý để doanh nghiệp triển khai đúng ngay từ đầu.',
                      'Call recording and analysis in Vietnam falls under Decree 13/2023/ND-CP on personal data protection. We hand over recording notice and consent templates so you deploy compliantly from day one.'
                    )}
                  </p>
                </div>

                <p className="text-muted-foreground">
                  {t(
                    'Mô hình AI sử dụng đã được nêu rõ ở phần trên. Các thông số triển khai còn lại — nơi lưu trữ dữ liệu, khả năng cài đặt riêng tại hạ tầng của bạn và thời gian lưu trữ — sẽ được xác nhận bằng văn bản trong buổi trao đổi kỹ thuật, trước khi bạn gửi bất kỳ file ghi âm nào.',
                    'The AI model we run on is stated openly above. The remaining deployment parameters — where data is stored, private/on-premise deployment options and retention periods — are confirmed in writing during the technical session, before you send us a single recording.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ ⑪ TÍCH HỢP ═══════════ */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-cyan-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <Plug className="w-4 h-4" />
                {t('TÍCH HỢP', 'INTEGRATIONS')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight max-w-4xl mx-auto">
                {t('Công cụ bóc băng chỉ trả cho bạn một file văn bản. ', 'A transcription tool hands you a text file. ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('Chúng tôi trả kết quả về đúng nơi bạn ra quyết định.', 'We deliver the result where you actually make decisions.')}
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Nguồn vào */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-1">{t('Nguồn ghi âm đi vào', 'Recording sources in')}</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {t('Chúng tôi đọc file ghi âm bạn đã có sẵn.', 'We read the recordings you already have.')}
                </p>
                <ul className="space-y-3">
                  {sources.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-foreground mt-5 pt-4 border-t border-border">
                  {t(
                    'Nếu tổng đài của bạn xuất được file ghi âm kèm thông tin cuộc gọi, chúng tôi kết nối được.',
                    'If your phone system can export recordings with call metadata, we can connect to it.'
                  )}
                </p>
              </div>

              {/* Điểm đến */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-1">{t('Kết quả đi về đâu', 'Where results land')}</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {t('Lợi thế riêng của hệ sinh thái Clickstar.', 'The advantage of the Clickstar ecosystem.')}
                </p>
                <div className="space-y-2.5">
                  {destinations.map((d, i) => {
                    const inner = (
                      <>
                        <span className="text-sm font-semibold text-foreground">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.desc}</span>
                      </>
                    )
                    return d.href ? (
                      <Link
                        key={i}
                        href={d.href}
                        className="flex flex-col gap-0.5 rounded-xl border border-border hover:border-cyan-300 hover:bg-cyan-50/50 px-4 py-3 transition-colors"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div key={i} className="flex flex-col gap-0.5 rounded-xl border border-border px-4 py-3">
                        {inner}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {t(
                    'CRM bên thứ ba kết nối qua API hoặc webhook. Xuất Google Sheets, CSV hoặc API mở cho đội phân tích dữ liệu.',
                    'Third-party CRMs connect via API or webhook. Export to Google Sheets, CSV or an open API for your data team.'
                  )}
                </p>
              </div>
            </div>

            {/* Box trấn an */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 p-6 sm:p-8 text-center">
              <p className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                {t('Bạn KHÔNG phải đổi tổng đài.', 'You do NOT need to replace your phone system.')}
              </p>
              <p className="text-white/85 max-w-2xl mx-auto">
                {t(
                  'Giữ nguyên số hotline, giữ nguyên cách đội sale đang gọi. Speech Insight AI nằm ở lớp sau cuộc gọi, chỉ đọc file ghi âm đã có. Nhân viên không cài thêm phần mềm nào.',
                  'Keep your hotline numbers and the way your team already calls. Speech Insight AI sits in the layer after the call, reading only the recordings you already have. Your staff install nothing.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ ⑫ FAQ ═══════════ */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 font-semibold text-sm px-5 py-2.5 rounded-full mb-4">
                <ListChecks className="w-4 h-4" />
                {t('CÂU HỎI THƯỜNG GẶP', 'FREQUENTLY ASKED')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
                {t('Bảy câu quản lý sale hay hỏi nhất — ', 'The seven questions sales leaders ask most — ')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
                  {t('trả lời thẳng', 'answered directly')}
                </span>
              </h2>
            </div>

            <FaqAccordion items={FAQ_ITEMS} defaultOpen={1} />

            <div className="text-center mt-8">
              <Link href="/pricing" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all">
                {t('Xem bảng giá dịch vụ', 'See service pricing')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ ⑬ CTA CUỐI ═══════════ */}
        <section id="contact" className="py-12 lg:py-16 bg-gradient-to-br from-cyan-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Hộp trung thực — giữ lại từ khối "Kết quả đo được" */}
            <div className="rounded-2xl border-2 border-dashed border-white/30 bg-white/10 p-5 mb-10 text-left">
              <p className="text-sm text-white/90 leading-relaxed">
                {t(
                  'Chúng tôi chỉ công bố con số khi đã đo được trên dữ liệu thật: độ chính xác bóc băng, kết quả chạy thử, số cuộc gọi đã xử lý. Thay vì đưa bạn một con số tự nghĩ ra, chúng tôi chạy thử trên chính cuộc gọi của bạn rồi đưa số đo — trước khi bạn ký bất cứ thứ gì.',
                  'We only publish numbers we have actually measured on real data: transcription accuracy, pilot results, calls processed. Instead of handing you a number we invented, we run a trial on your own calls and give you measured results — before you sign anything.'
                )}
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {cta.heading[language]}
            </h2>
            <p className="text-lg text-white/85 mb-10 max-w-2xl mx-auto">{cta.description[language]}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta.primary.href}
                className="inline-flex items-center justify-center gap-2 bg-white text-cyan-700 font-semibold px-8 py-4 rounded-full hover:bg-secondary transition-all shadow-lg"
              >
                {cta.primary.label[language]}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={cta.secondary.href}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all border border-white/30"
              >
                <PhoneCall className="w-5 h-5" />
                {cta.secondary.label[language]}
              </Link>
            </div>

            <p className="text-sm text-white/75 mt-6">
              {t(
                'Ký thoả thuận bảo mật trước khi bạn gửi bất kỳ file ghi âm nào. Dữ liệu gửi thử được xoá sau khi kết thúc đánh giá nếu bạn không tiếp tục.',
                'We sign an NDA before you send any recording. Trial data is deleted after the review if you decide not to proceed.'
              )}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
