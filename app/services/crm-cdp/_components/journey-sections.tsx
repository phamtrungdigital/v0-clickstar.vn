'use client'

import { useLanguage } from '@/contexts/language-context'
import {
  ArrowRight,
  BrainCircuit,
  Users,
  Route,
  Fingerprint,
  GitMerge,
  ShieldCheck,
  Link2,
  FileClock,
  Flame,
  Sun,
  Snowflake,
  BookOpen,
  Info,
} from 'lucide-react'
import {
  IdentityResolutionIllustration,
  UnifiedDataIllustration,
  FollowUpFlowIllustration,
  JourneyRailIllustration,
} from '@/components/illustrations/crm-cdp-illustrations'

/* Khung dùng chung: tiêu đề khối (nhãn nhỏ + h2 + đoạn dẫn) */
function SectionHead({
  icon,
  eyebrow,
  title,
  accent,
  lead,
  dark = false,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  accent: string
  lead: string
  dark?: boolean
}) {
  return (
    <div className="mb-12 text-center lg:mb-14">
      <span className={`mb-3 inline-flex items-center gap-2 text-sm uppercase tracking-[-0.016em] ${dark ? 'text-[#d2d2d7]' : 'text-[#515154]'}`}>
        {icon}
        {eyebrow}
      </span>
      <h2 className={`text-3xl font-semibold leading-[1.22] tracking-[-0.005em] sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-[#1d1d1f]'}`}>
        {title} <span className={dark ? 'text-[#7db8ff]' : 'text-[#1859b8]'}>{accent}</span>
      </h2>
      <p className={`mx-auto mt-5 max-w-3xl text-lg leading-relaxed ${dark ? 'text-[#d2d2d7]' : 'text-[#515154]'}`}>{lead}</p>
    </div>
  )
}

/* Hình sơ đồ: trên màn hình hẹp cho vuốt ngang để chữ trong hình vẫn đủ lớn để đọc */
function DiagramScroll({ children, hint }: { children: React.ReactNode; hint: string }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-[560px]">
      <div className="overflow-x-auto rounded-[18px] [-webkit-overflow-scrolling:touch]">
        <div className="min-w-[460px]">{children}</div>
      </div>
      <p className="mt-2 text-center text-xs text-[#515154] sm:hidden">{hint}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* A. CRM và CDP khác nhau thế nào                                             */
/* -------------------------------------------------------------------------- */
export function CrmVsCdpSection() {
  const { language } = useLanguage()
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  const cards = [
    {
      icon: <BrainCircuit />,
      name: 'CDP',
      full: 'Customer Data Platform',
      tag: t('Radar nhận diện khách', 'Customer radar'),
      question: t('“Ai đang ghé website, và họ quan tâm điều gì?”', '“Who is visiting, and what are they interested in?”'),
      rows: [
        [t('Dữ liệu', 'Data'), t('Hành vi trên website, nguồn quảng cáo, thiết bị, tin nhắn', 'Website behavior, ad source, device, messages')],
        [t('Khách hàng', 'Customers'), t('Cả người chưa biết tên (ẩn danh) lẫn người đã biết', 'Anonymous visitors as well as known people')],
        [t('Dùng để', 'Used for'), t('Nhận diện, chấm điểm, phân nhóm, cá nhân hoá', 'Recognizing, scoring, segmenting, personalizing')],
        [t('Ai dùng', 'Used by'), t('Đội Marketing', 'Marketing team')],
      ],
    },
    {
      icon: <Users />,
      name: 'CRM',
      full: 'Customer Relationship Management',
      tag: t('Sổ khách hàng của đội bán hàng', 'The sales team’s customer book'),
      question: t('“Ta đang chăm sóc ai, và đã đến bước nào?”', '“Who are we serving, and which step are they at?”'),
      rows: [
        [t('Dữ liệu', 'Data'), t('Liên hệ, cuộc gọi, báo giá, đơn hàng, công việc cần làm', 'Contacts, calls, quotes, orders, tasks')],
        [t('Khách hàng', 'Customers'), t('Người đã biết (có số điện thoại hoặc email)', 'Known people (with a phone number or email)')],
        [t('Dùng để', 'Used for'), t('Theo dõi pipeline, giao việc, chăm sóc, chốt đơn', 'Tracking the pipeline, assigning tasks, care, closing deals')],
        [t('Ai dùng', 'Used by'), t('Đội Sales và Chăm sóc khách hàng', 'Sales and Customer Care teams')],
      ],
    },
  ]

  const renderCard = (c: (typeof cards)[number]) => (
            <div key={c.name} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[14px] bg-[#1e6dda] [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-white">
                  {c.icon}
                </div>
                <div>
                  <div className="text-2xl font-semibold leading-tight text-[#1d1d1f]">{c.name}</div>
                  <div className="text-sm text-[#515154]">{c.full}</div>
                </div>
              </div>
              <span className="mt-5 inline-flex w-fit rounded-full bg-[#eaf2fd] px-3 py-1 text-sm font-semibold text-[#1859b8]">{c.tag}</span>
              <p className="mt-4 text-xl font-semibold leading-normal text-[#1d1d1f]">{c.question}</p>
              <dl className="mt-5 divide-y divide-[#e0e0e0] border-t border-[#e0e0e0]">
                {c.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[96px_1fr] gap-3 py-3.5 sm:grid-cols-[110px_1fr]">
                    <dt className="text-sm font-semibold text-[#515154]">{k}</dt>
                    <dd className="text-[15px] leading-normal text-[#1d1d1f]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
  )

  return (
    <section id="difference" className="py-16 lg:py-24 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          icon={<GitMerge className="h-4 w-4" />}
          eyebrow={t('CRM và CDP', 'CRM and CDP')}
          title={t('CDP nhận ra khách,', 'CDP recognizes customers,')}
          accent={t('CRM chăm sóc khách', 'CRM serves them')}
          lead={t(
            'Hiểu đơn giản: CDP là “radar” theo dõi mọi người ghé website, kể cả khi chưa biết tên. CRM là “sổ khách hàng” để đội sales và chăm sóc làm việc với người đã để lại thông tin. 2 hệ thống nối với nhau đúng lúc khách để lại số điện thoại.',
            'In short: the CDP is a “radar” that follows everyone who visits your website, even before you know their name. The CRM is the “customer book” your sales and care teams use once someone has shared their details. The two connect the moment a customer leaves a phone number.'
          )}
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          {renderCard(cards[0])}
          <div className="flex flex-col items-center justify-center gap-3 text-center lg:w-[168px]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e6dda]">
              <ArrowRight className="h-6 w-6 rotate-90 text-white lg:rotate-0" />
            </div>
            <p className="max-w-[220px] text-[15px] font-semibold leading-normal text-[#1d1d1f]">
              {t('Khách để lại số điện thoại: hồ sơ và toàn bộ lịch sử chuyển sang CRM', 'A customer leaves a phone number: the profile and full history move to the CRM')}
            </p>
          </div>
          {renderCard(cards[1])}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-[17px] leading-relaxed text-[#515154]">
          {t(
            'Doanh nghiệp mới bắt đầu có thể chọn CRM trước để quản lý khách và đội sales. Khi chạy quảng cáo nhiều và muốn biết khách nào đáng chăm nhất, bổ sung CDP để mọi dữ liệu hành vi chảy thẳng vào CRM.',
            'Businesses just starting out can begin with the CRM to manage customers and the sales team. Once you run a lot of ads and want to know which customers deserve attention first, add the CDP so behavior data flows straight into the CRM.'
          )}
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* B. Hành trình khách hàng: ẩn danh → định danh                                */
/* -------------------------------------------------------------------------- */
export function JourneySection() {
  const { language } = useLanguage()
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  const stages = [
    {
      n: 1,
      title: t('Biết đến', 'Aware'),
      known: false,
      does: t('Thấy quảng cáo, bài viết hoặc kết quả tìm kiếm và bấm vào website.', 'Sees an ad, article or search result and clicks through to the website.'),
      system: t('Gán một mã ẩn danh cho trình duyệt. Ghi nguồn truy cập, thiết bị, khu vực.', 'Assigns an anonymous ID to the browser. Records source, device and region.'),
      team: t('Biết kênh nào đưa khách về, kênh nào chỉ tốn tiền mà không có khách thật.', 'Sees which channels bring real visitors and which only burn budget.'),
    },
    {
      n: 2,
      title: t('Quan tâm', 'Interested'),
      known: false,
      does: t('Xem bảng giá, đọc dịch vụ, cuộn sâu, quay lại website nhiều lần.', 'Views pricing, reads services, scrolls deep, returns several times.'),
      system: t('Ghi từng hành vi vào cùng một mã ẩn danh và tính điểm quan tâm tăng dần.', 'Logs each action against the same anonymous ID and raises the interest score.'),
      team: t('Hiện ưu đãi hoặc mời để lại thông tin đúng lúc khách đang quan tâm nhất.', 'Shows an offer or invites them to share details right when interest peaks.'),
    },
    {
      n: 3,
      title: t('Để lại thông tin', 'Shares details'),
      known: true,
      does: t('Điền form, nhắn Zalo hoặc chatbot, gọi điện: có số điện thoại hoặc email.', 'Fills in a form, messages on Zalo or the chatbot, or calls: a phone number or email appears.'),
      system: t('Khớp mã ẩn danh với hồ sơ, gộp toàn bộ lịch sử trước đó, rồi đẩy sang CRM.', 'Matches the anonymous ID to a profile, merges all earlier history, then pushes it to the CRM.'),
      team: t('Sales nhận hồ sơ kèm đủ ngữ cảnh: khách từ đâu đến, đã xem gì, quan tâm gì.', 'Sales receives the profile with full context: where they came from, what they viewed.'),
    },
    {
      n: 4,
      title: t('Mua hàng', 'Buys'),
      known: true,
      does: t('Trao đổi với sales, nhận báo giá, quyết định và ký hợp đồng.', 'Talks with sales, receives a quote, decides and signs.'),
      system: t('Ghi cuộc gọi, báo giá, giá trị đơn hàng và chuyển trạng thái trong pipeline.', 'Records calls, quotes, order value and moves the stage in the pipeline.'),
      team: t('Biết khách đang ở bước nào, việc nào quá hạn, khách nào sắp chốt.', 'Knows each customer’s stage, which tasks are overdue and who is about to close.'),
    },
    {
      n: 5,
      title: t('Quay lại', 'Returns'),
      known: true,
      does: t('Dùng dịch vụ, cần hỗ trợ, mua thêm hoặc giới thiệu bạn bè.', 'Uses the service, asks for support, buys more or refers friends.'),
      system: t('Tiếp tục ghi tương tác. Nhắc lịch, chúc mừng, gợi ý mua thêm theo kịch bản.', 'Keeps logging interactions. Sends reminders, greetings and upsell suggestions on schedule.'),
      team: t('Giữ khách lâu dài, tăng giá trị mỗi khách thay vì liên tục đi tìm khách mới.', 'Retains customers longer and grows value per customer instead of constantly chasing new ones.'),
    },
  ]

  const cols = [t('Khách làm gì', 'The customer'), t('Hệ thống ghi nhận', 'The system'), t('Doanh nghiệp làm được gì', 'Your team')]

  const steps = [
    { icon: <Fingerprint />, title: t('Gắn mã ẩn danh', 'Assign an anonymous ID'), desc: t('Mỗi trình duyệt nhận một mã ngẫu nhiên. Mã này không chứa tên hay số điện thoại.', 'Each browser gets a random ID. It contains no name or phone number.') },
    { icon: <Route />, title: t('Ghi nhận hành vi', 'Record behavior'), desc: t('Trang đã xem, mức cuộn, nút đã bấm, nguồn quảng cáo đều gắn vào mã đó.', 'Pages viewed, scroll depth, buttons clicked and ad source are all attached to it.') },
    { icon: <Link2 />, title: t('Chờ điểm chạm định danh', 'Wait for an identifying moment'), desc: t('Khách điền form, nhắn Zalo hoặc chatbot, gọi điện, hoặc mở liên kết trong email, ZNS.', 'The customer fills a form, messages on Zalo or the chatbot, calls, or opens a link in an email or ZNS.') },
    { icon: <GitMerge />, title: t('Khớp và gộp hồ sơ', 'Match and merge'), desc: t('Chuẩn hoá số điện thoại, email; tìm hồ sơ có sẵn hoặc tạo mới; gộp toàn bộ lịch sử ẩn danh vào.', 'Normalizes phone and email, finds an existing profile or creates one, and merges all anonymous history in.') },
  ]

  return (
    <section id="journey" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          icon={<Route className="h-4 w-4" />}
          eyebrow={t('Hành trình khách hàng', 'Customer journey')}
          title={t('Từ người lạ ẩn danh', 'From an anonymous stranger')}
          accent={t('đến khách hàng có tên', 'to a named customer')}
          lead={t(
            'Phần lớn người ghé website không để lại thông tin ngay. CDP vẫn ghi nhận họ ở dạng ẩn danh, và khi họ để lại số điện thoại hay email, toàn bộ hành trình trước đó được nối vào hồ sơ, nên đội sales không bắt đầu từ con số 0.',
            'Most visitors do not share their details right away. The CDP still records them anonymously, and when they leave a phone number or email, their whole earlier journey is attached to the profile, so sales never starts from zero.'
          )}
        />

        <div className="mx-auto mb-12 hidden max-w-[960px] md:block">
          <JourneyRailIllustration t={t} />
        </div>

        <div className="space-y-4">
          {stages.map((s) => (
            <div key={s.n} className="grid gap-5 rounded-[18px] border border-[#d2d2d7] bg-white p-6 lg:grid-cols-[210px_1fr_1fr_1fr] lg:gap-7 lg:p-7">
              <div className="flex items-start gap-4 lg:flex-col lg:gap-3">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold ${s.known ? 'bg-[#1e6dda] text-white' : 'border-2 border-dashed border-[#86868b] bg-white text-[#1d1d1f]'}`}>
                  {s.n}
                </div>
                <div>
                  <h3 className="text-xl font-semibold leading-snug text-[#1d1d1f]">{s.title}</h3>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.known ? 'bg-[#1e6dda] text-white' : 'bg-[#f5f5f7] text-[#515154]'}`}>
                    {s.known ? t('Đã định danh', 'Identified') : t('Ẩn danh', 'Anonymous')}
                  </span>
                </div>
              </div>
              {[s.does, s.system, s.team].map((txt, i) => (
                <div key={i}>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[#515154]">{cols[i]}</div>
                  <p className="text-[15px] leading-relaxed text-[#1d1d1f]">{txt}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <DiagramScroll hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
            <IdentityResolutionIllustration t={t} />
          </DiagramScroll>
          <div>
            <h3 className="text-3xl font-semibold leading-[1.22] tracking-[-0.005em] text-[#1d1d1f] sm:text-4xl">
              {t('Định danh hoạt động', 'How identification')}{' '}
              <span className="text-[#1859b8]">{t('như thế nào?', 'works')}</span>
            </h3>
            <ol className="mt-7 space-y-5">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#1e6dda] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">{s.icon}</div>
                  <div>
                    <div className="text-lg font-semibold leading-snug text-[#1d1d1f]">
                      {i + 1}. {s.title}
                    </div>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#515154]">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-7 flex gap-3 rounded-[14px] border border-[#d2d2d7] bg-[#f5f5f7] p-4">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1859b8]" />
              <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
                {t(
                  'Khách dùng nhiều thiết bị? Nếu cùng để lại một số điện thoại, điện thoại, máy tính và Zalo sẽ được gộp về cùng một hồ sơ.',
                  'Customers on several devices? If they leave the same phone number, their phone, laptop and Zalo are merged into one profile.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* C. Ví dụ thực tế: chị An, 14 ngày (khối tối)                                  */
/* -------------------------------------------------------------------------- */
export function StorySection() {
  const { language } = useLanguage()
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  const before = [
    { day: t('Ngày 1 · 20:14', 'Day 1 · 20:14'), title: t('Thấy quảng cáo Facebook, bấm vào website', 'Sees a Facebook ad and clicks through'), desc: t('Hệ thống tạo mã ẩn danh. Ghi nguồn: Facebook Ads, thiết bị: iPhone.', 'The system creates an anonymous ID. Source: Facebook Ads, device: iPhone.') },
    { day: t('Ngày 1 · 20:16', 'Day 1 · 20:16'), title: t('Đọc trang dịch vụ CRM, cuộn 80% rồi thoát', 'Reads the CRM service page, scrolls 80% and leaves'), desc: t('Điểm quan tâm bắt đầu tăng. Chưa biết khách là ai.', 'The interest score starts to rise. Still unknown who the visitor is.') },
    { day: t('Ngày 3 · 09:30', 'Day 3 · 09:30'), title: t('Quay lại bằng máy tính, xem Bảng giá 2 lần', 'Returns on a laptop and views Pricing twice'), desc: t('Nhận ra khách quay lại. Điểm quan tâm: 45.', 'Recognizes the return visit. Interest score: 45.') },
    { day: t('Ngày 5 · 21:05', 'Day 5 · 21:05'), title: t('Thấy ô “Nhận tư vấn miễn phí”, để lại số điện thoại', 'Sees “Get a free consultation” and leaves a phone number'), desc: t('Điểm chạm định danh: ẩn danh kết thúc ở đây.', 'The identifying moment: the anonymous phase ends here.') },
  ]
  const after = [
    { day: t('Ngay lập tức', 'Instantly'), title: t('Hồ sơ “Nguyễn An” được tạo, 4 ngày lịch sử được gộp vào', 'The “Nguyen An” profile is created, 4 days of history are merged'), desc: t('Điểm 82, xếp nhóm Nóng. Hồ sơ tự chuyển sang CRM, giao cho một sales.', 'Score 82, placed in the Hot group. The profile moves to the CRM and is assigned to a salesperson.') },
    { day: t('+15 phút', '+15 min'), title: t('Sales nhận thông báo và gọi điện', 'Sales is notified and calls'), desc: t('ZNS xác nhận lịch hẹn được gửi tự động.', 'A ZNS appointment confirmation is sent automatically.') },
    { day: t('Ngày 6', 'Day 6'), title: t('Gửi báo giá, nhắc nhẹ qua Zalo nếu sau 24 giờ chưa trả lời', 'Sends the quote, with a gentle Zalo reminder if there is no reply after 24 hours'), desc: t('Mọi cuộc gọi, báo giá đều ghi vào cùng một hồ sơ.', 'Every call and quote is logged to the same profile.') },
    { day: t('Ngày 14', 'Day 14'), title: t('Ký hợp đồng, chuyển sang nhóm Khách hàng', 'Signs the contract and becomes a Customer'), desc: t('Kịch bản chăm sóc sau bán bắt đầu chạy.', 'The after-sales care flow starts.') },
  ]

  const col = (items: typeof before, known: boolean) => (
    <div className="rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-white">{known ? t('Sau khi định danh', 'After identification') : t('Trước khi để lại số điện thoại', 'Before sharing a phone number')}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${known ? 'bg-[#1e6dda] text-white' : 'border border-white/40 text-white'}`}>
          {known ? t('Đã định danh', 'Identified') : t('Ẩn danh', 'Anonymous')}
        </span>
      </div>
      <ol className={`ml-3 space-y-6 border-l-2 pl-6 ${known ? 'border-[#1e6dda]' : 'border-dashed border-white/40'}`}>
        {items.map((it) => (
          <li key={it.title} className="relative">
            <span className={`absolute -left-[33px] top-1.5 h-3 w-3 rounded-full ${known ? 'bg-[#1e6dda]' : 'border-2 border-[#d2d2d7] bg-[#1d1d1f]'}`} />
            <span className="inline-flex rounded-full border border-white/30 px-2.5 py-0.5 text-xs font-semibold text-white">{it.day}</span>
            <div className="mt-2 text-[17px] font-semibold leading-snug text-white">{it.title}</div>
            <p className="mt-1 text-[15px] leading-relaxed text-[#d2d2d7]">{it.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <section id="story" className="py-16 lg:py-24 bg-[#272729] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          dark
          icon={<BookOpen className="h-4 w-4" />}
          eyebrow={t('Ví dụ thực tế', 'A worked example')}
          title={t('Chị An, 14 ngày,', 'Ms. An, 14 days,')}
          accent={t('từ lần ghé đầu tiên đến hợp đồng', 'from first visit to signed contract')}
          lead={t(
            'Một kịch bản minh hoạ để thấy CDP và CRM phối hợp ra sao. Tên và số liệu chỉ là ví dụ.',
            'An illustrative scenario showing how the CDP and CRM work together. The name and figures are examples only.'
          )}
        />
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {col(before, false)}
          {col(after, true)}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { v: t('4 ngày', '4 days'), l: t('lịch sử ẩn danh được gộp vào hồ sơ', 'of anonymous history merged into the profile') },
            { v: t('15 phút', '15 min'), l: t('từ lúc để lại số điện thoại đến cuộc gọi đầu tiên', 'from leaving a number to the first call') },
            { v: t('1 hồ sơ', '1 profile'), l: t('xuyên suốt từ quảng cáo đến hợp đồng', 'from ad click all the way to contract') },
          ].map((x) => (
            <div key={x.v} className="rounded-[18px] border border-white/20 bg-[#1d1d1f] p-6 text-center">
              <div className="text-3xl font-semibold tracking-tight text-white">{x.v}</div>
              <div className="mt-1 text-[15px] text-[#d2d2d7]">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* D. Dữ liệu đồng nhất: một khách, một hồ sơ + giải thích nhanh                 */
/* -------------------------------------------------------------------------- */
export function UnifiedSection() {
  const { language } = useLanguage()
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  const principles = [
    { icon: <Users />, title: t('Cùng một hồ sơ cho mọi kênh', 'One profile across every channel'), desc: t('Website, quảng cáo, Zalo, chatbot, tổng đài, cửa hàng đều ghi vào cùng một hồ sơ khách.', 'Website, ads, Zalo, chatbot, call center and stores all write to the same customer record.') },
    { icon: <Fingerprint />, title: t('Nhận diện bằng số điện thoại và email', 'Identified by phone and email'), desc: t('Số điện thoại, email được chuẩn hoá về một định dạng, nên “0901 234 321” và “+84 901 234 321” là cùng một người.', 'Phone and email are normalized, so “0901 234 321” and “+84 901 234 321” are recognized as one person.') },
    { icon: <FileClock />, title: t('Gộp có kiểm soát, có nhật ký', 'Controlled merging with a log'), desc: t('Mỗi lần gộp hồ sơ đều được ghi lại để kiểm tra, tránh nhập nhằng 2 người thành một.', 'Every merge is logged for review, so 2 different people are not mixed into one.') },
    { icon: <ShieldCheck />, title: t('Tôn trọng sự đồng ý của khách', 'Respects customer consent'), desc: t('Chỉ ghi nhận hành vi sau khi khách đồng ý, và dữ liệu thuộc về doanh nghiệp của bạn.', 'Behavior is only recorded after the customer agrees, and the data belongs to your business.') },
  ]

  const glossary = [
    { term: t('Mã ẩn danh', 'Anonymous ID'), desc: t('Mã ngẫu nhiên gắn với một trình duyệt, dùng để nhận ra khách quay lại khi chưa biết họ là ai.', 'A random code tied to a browser, used to recognize a returning visitor before you know who they are.') },
    { term: t('Sự kiện (event)', 'Event'), desc: t('Một hành động của khách: xem trang, cuộn, bấm nút, gửi form, mua hàng.', 'One customer action: viewing a page, scrolling, clicking, submitting a form, purchasing.') },
    { term: t('Định danh', 'Identification'), desc: t('Lúc hệ thống biết khách là ai nhờ số điện thoại hoặc email họ để lại.', 'The moment the system learns who a visitor is from the phone number or email they share.') },
    { term: t('Hồ sơ 360°', '360° profile'), desc: t('Một trang gom đủ thông tin, lịch sử và hành vi của một khách.', 'One page that gathers a customer’s details, history and behavior.') },
    { term: t('Phân nhóm (segment)', 'Segment'), desc: t('Nhóm khách có điểm chung, ví dụ “đã xem bảng giá nhưng chưa để lại số”.', 'A group of customers with something in common, e.g. “viewed pricing but has not shared a number”.') },
    { term: t('Điểm khách tiềm năng', 'Lead score'), desc: t('Con số cho biết khách đang nóng hay lạnh, để sales biết nên gọi ai trước.', 'A number showing how warm or cold a lead is, so sales knows whom to call first.') },
  ]

  return (
    <section id="unified" className="py-16 lg:py-24 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          icon={<GitMerge className="h-4 w-4" />}
          eyebrow={t('Dữ liệu đồng nhất', 'Unified data')}
          title={t('Một khách hàng,', 'One customer,')}
          accent={t('một hồ sơ duy nhất', 'one single record')}
          lead={t(
            'Khi dữ liệu nằm rải rác ở nhiều công cụ, cùng một người bị đếm thành nhiều khách và mỗi bộ phận thấy một phần khác nhau. Hợp nhất giúp cả công ty nhìn cùng một sự thật về khách hàng.',
            'When data is scattered across tools, one person is counted as several customers and every team sees a different slice. Unifying it gives the whole company one version of the truth.'
          )}
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <DiagramScroll hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
            <UnifiedDataIllustration t={t} />
          </DiagramScroll>
          <div className="space-y-4">
            {principles.map((p) => (
              <div key={p.title} className="flex items-start gap-4 rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-[#1e6dda] [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">{p.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-[#1d1d1f]">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#515154]">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="mb-6 text-center text-2xl font-semibold text-[#1d1d1f] sm:text-3xl">{t('Giải thích nhanh các thuật ngữ', 'Key terms in plain words')}</h3>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map((g) => (
              <div key={g.term} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                <div className="text-lg font-semibold text-[#1859b8]">{g.term}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-[#1d1d1f]">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* E. Luồng chăm sóc tự động theo điểm                                           */
/* -------------------------------------------------------------------------- */
export function FollowFlowSection() {
  const { language } = useLanguage()
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en)

  const tiers = [
    {
      icon: <Flame />,
      name: t('Nóng', 'Hot'),
      range: t('Từ 70 điểm', '70+ points'),
      when: t('Đã để lại số điện thoại, xem bảng giá nhiều lần, hỏi giá qua chatbot.', 'Shared a phone number, viewed pricing repeatedly, asked about price in the chatbot.'),
      action: t('Báo sales ngay, gọi trong 15 phút, nhắn Zalo xác nhận, tạo việc trong CRM.', 'Alert sales at once, call within 15 minutes, confirm on Zalo, create a CRM task.'),
      solid: true,
    },
    {
      icon: <Sun />,
      name: t('Ấm', 'Warm'),
      range: t('40 đến 69 điểm', '40 to 69 points'),
      when: t('Đọc nhiều nội dung, để lại thông tin nhưng chưa phản hồi cuộc gọi.', 'Reads a lot of content, shared details but has not answered a call.'),
      action: t('Chuỗi ZNS và email 3 bước có nội dung hữu ích, mời xem demo, chấm lại điểm sau 7 ngày.', 'A 3-step ZNS and email series with useful content, a demo invitation, re-score after 7 days.'),
      solid: false,
    },
    {
      icon: <Snowflake />,
      name: t('Lạnh', 'Cold'),
      range: t('Dưới 40 điểm', 'Under 40 points'),
      when: t('Mới ghé một lần, xem nhanh rồi thoát.', 'Visited once and left quickly.'),
      action: t('Đưa vào nhóm chạy lại quảng cáo, gửi bản tin hàng tháng, không làm phiền.', 'Add to a retargeting audience, send a monthly newsletter, no pressure.'),
      solid: false,
    },
  ]

  const cadence = [
    { when: t('Phút 0', 'Minute 0'), what: t('Hồ sơ vào CRM, báo sales', 'Profile lands in the CRM, sales alerted') },
    { when: t('+15 phút', '+15 min'), what: t('Sales gọi điện, ZNS xác nhận lịch', 'Sales calls, ZNS confirms the slot') },
    { when: t('+1 ngày', '+1 day'), what: t('Gửi báo giá kèm tin nhắn Zalo', 'Quote sent with a Zalo message') },
    { when: t('+3 ngày', '+3 days'), what: t('Nhắc nhẹ nếu chưa phản hồi', 'Gentle reminder if no reply') },
    { when: t('+7 ngày', '+7 days'), what: t('Chấm lại điểm, chuyển nhóm', 'Re-score and regroup') },
  ]

  return (
    <section id="follow" className="py-16 lg:py-24 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          icon={<Route className="h-4 w-4" />}
          eyebrow={t('Luồng chăm sóc tự động', 'Automated follow-up flow')}
          title={t('Chăm đúng khách,', 'The right customer,')}
          accent={t('đúng lúc, không bỏ sót', 'at the right time, nothing missed')}
          lead={t(
            'Mỗi khách được chấm điểm tự động theo hành vi và thông tin họ để lại. Điểm quyết định ai được sales gọi ngay, ai được nuôi dưỡng bằng nội dung, ai chỉ cần nhắc nhẹ. Khi hành vi thay đổi, khách tự chuyển nhóm.',
            'Every customer is scored automatically from their behavior and the details they share. The score decides who sales calls straight away, who is nurtured with content and who only needs a light touch. When behavior changes, customers move groups on their own.'
          )}
        />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 lg:order-1">
            {tiers.map((tr) => (
              <div key={tr.name} className="rounded-[18px] border border-[#d2d2d7] bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[12px] [&>svg]:h-6 [&>svg]:w-6 ${tr.solid ? 'bg-[#1e6dda] [&>svg]:text-white' : 'bg-[#eaf2fd] [&>svg]:text-[#1859b8]'}`}>{tr.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold leading-tight text-[#1d1d1f]">{tr.name}</h3>
                    <div className="text-sm text-[#515154]">{tr.range}</div>
                  </div>
                </div>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[#515154]">{t('Khách thường là', 'Typically')}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-[#1d1d1f]">{tr.when}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-[#515154]">{t('Hệ thống làm', 'The system')}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-[#1d1d1f]">{tr.action}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <div className="lg:order-2 lg:sticky lg:top-24">
            <DiagramScroll hint={t('Vuốt ngang để xem đủ sơ đồ', 'Swipe sideways to see the full diagram')}>
              <FollowUpFlowIllustration t={t} />
            </DiagramScroll>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-2xl font-semibold text-[#1d1d1f] sm:text-3xl">{t('Một chuỗi follow-up mẫu cho khách nóng', 'A sample follow-up sequence for a hot lead')}</h3>
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cadence.map((c, i) => (
              <div key={c.when} className="flex h-full flex-col rounded-[18px] border border-[#d2d2d7] bg-white p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e6dda] text-sm font-semibold text-white">{i + 1}</span>
                  <span className="text-base font-semibold text-[#1859b8]">{c.when}</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-[#1d1d1f]">{c.what}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-[15px] leading-relaxed text-[#515154]">
            {t(
              'Ngưỡng điểm và kịch bản ở trên chỉ là ví dụ. Chúng được cấu hình lại theo quy trình bán hàng và đặc thù của từng doanh nghiệp.',
              'The score thresholds and scenarios above are examples. They are configured to fit each business’s sales process and specifics.'
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
