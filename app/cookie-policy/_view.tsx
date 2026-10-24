import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from '@/components/app-link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { OpenConsentButton } from '@/components/consent/open-consent-button'
import { getSiteSettings } from '@/lib/cms/settings'
import { makeT } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { DEFAULT_EMAIL, DEFAULT_HOTLINE } from '@/lib/seo/site'

/**
 * Chính sách cookie (24/10/2026), viết trong mã nguồn. Đi cùng banner đồng ý cookie (components/consent/consent-manager.tsx):
 * bảng cookie ở đây phải khớp các nhóm trong banner và lib/consent/shared.ts. Quy định bảo vệ dữ liệu cá nhân đầy đủ
 * là bài /blog/quy-dinh-bao-ve-du-lieu-ca-nhan.
 */
const DATA_POLICY_URL = '/blog/quy-dinh-bao-ve-du-lieu-ca-nhan'

export async function cookiePolicyMetadata(lang: Lang): Promise<Metadata> {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Chính sách cookie', 'Cookie policy'),
    description: t(
      'Click Star dùng cookie nào trên clickstar.vn, cho mục đích gì, lưu bao lâu, và cách anh chị đồng ý, từ chối hoặc đổi lựa chọn bất cứ lúc nào.',
      'Which cookies Click Star uses on clickstar.vn, why, for how long, and how you can accept, reject or change your choice at any time.'
    ),
    path: '/cookie-policy',
    lang,
    images: await ogImageOr(),
  })
}

type Row = { name: string; group: string; owner: string; purpose: string; keep: string }

export async function CookiePolicyView({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const settings = await getSiteSettings()
  const phone = settings?.contact_phone || DEFAULT_HOTLINE
  const email = settings?.contact_email || DEFAULT_EMAIL

  const necessary = t('Cần thiết', 'Essential')
  const analytics = t('Đo lường truy cập', 'Analytics')
  const marketing = t('Cá nhân hóa và quảng cáo', 'Personalization and advertising')

  const rows: Row[] = [
    {
      name: 'cs-lang',
      group: necessary,
      owner: 'Click Star',
      purpose: t('Ghi nhớ ngôn ngữ anh chị đã chọn.', 'Remembers your chosen language.'),
      keep: t('1 năm', '1 year'),
    },
    {
      name: 'cs_consent',
      group: necessary,
      owner: 'Click Star',
      purpose: t(
        'Ghi lựa chọn cookie của anh chị và một mã ngẫu nhiên để lưu bằng chứng đồng ý.',
        'Stores your cookie choice and a random ID used as the consent record.'
      ),
      keep: t('6 tháng', '6 months'),
    },
    {
      name: t('Bộ nhớ phiên', 'Session storage'),
      group: necessary,
      owner: 'Click Star',
      purpose: t('Không hiện lại thông báo anh chị đã đóng trong lần truy cập này.', 'Avoids showing a notice you already closed in this visit.'),
      keep: t('Đến khi đóng trình duyệt', 'Until the browser closes'),
    },
    {
      name: 'Vercel Analytics',
      group: necessary,
      owner: 'Vercel',
      purpose: t(
        'Đếm lượt xem trang dạng gộp, không dùng cookie, không nhận diện từng người.',
        'Aggregate page view counts, no cookies, no identification of individuals.'
      ),
      keep: t('Không lưu trên máy', 'Nothing stored on your device'),
    },
    {
      name: '_ga, _ga_<mã>',
      group: analytics,
      owner: 'Google Analytics 4',
      purpose: t(
        'Đếm lượt truy cập, nguồn truy cập và trang được đọc để cải thiện website.',
        'Counts visits, traffic sources and pages read to improve the website.'
      ),
      keep: t('2 năm', '2 years'),
    },
    {
      name: 'cdp_aid',
      group: analytics,
      owner: 'CDP Click Star',
      purpose: t(
        'Mã ngẫu nhiên gom các lượt xem của cùng một trình duyệt; gắn với yêu cầu tư vấn khi anh chị gửi form liên hệ.',
        'Random ID that groups visits from the same browser; linked to your request when you send the contact form.'
      ),
      keep: t('1 năm', '1 year'),
    },
    {
      name: 'cs_personalize_v1',
      group: marketing,
      owner: 'Click Star',
      purpose: t(
        'Lưu ngay trên trình duyệt tối đa 30 trang anh chị xem gần nhất để gợi ý dịch vụ phù hợp.',
        'Keeps up to 30 recently viewed pages in your browser to suggest relevant services.'
      ),
      keep: t('Đến khi anh chị rút lại đồng ý hoặc xoá dữ liệu trình duyệt', 'Until you withdraw consent or clear browser data'),
    },
    {
      name: 'Google Signals',
      group: marketing,
      owner: 'Google',
      purpose: t(
        'Cho phép Google dùng dữ liệu đo lường để hiển thị quảng cáo Click Star phù hợp.',
        'Lets Google use analytics data to show relevant Click Star ads.'
      ),
      keep: t('Theo chính sách của Google', 'Per Google policy'),
    },
  ]

  return (
    <div className="min-h-screen">
      <MainNav />

      <section className="bg-[#f5f5f7] pt-16 pb-10 lg:pt-24 lg:pb-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#1859b8]">{t('Quyền riêng tư', 'Privacy')}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            {t('Chính sách cookie', 'Cookie policy')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t(
              'Cookie nào được dùng trên clickstar.vn, để làm gì, lưu bao lâu, và cách anh chị đổi lựa chọn.',
              'Which cookies clickstar.vn uses, why, for how long, and how to change your choice.'
            )}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{t('Áp dụng từ ngày 24/10/2026.', 'Effective 24 October 2026.')}</p>
          <OpenConsentButton
            label={t('Mở Cài đặt cookie', 'Open cookie settings')}
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[#1e6dda] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#1859b8]"
          />
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 text-[16px] leading-relaxed text-[#424245]">
          <Section title={t('1. Cookie là gì', '1. What cookies are')}>
            <p>
              {t(
                'Cookie là tệp nhỏ website lưu trên trình duyệt của anh chị. Trang này dùng chữ "cookie" cho cả cookie và các cách lưu tương tự trên trình duyệt (bộ nhớ cục bộ, bộ nhớ phiên).',
                'Cookies are small files a website stores in your browser. This page uses "cookie" for cookies and similar browser storage (local storage, session storage).'
              )}
            </p>
            <p>
              {t('Chính sách này bổ sung cho ', 'This policy supplements the ')}
              <Link href={DATA_POLICY_URL} className="font-medium text-[#1859b8] underline underline-offset-2">
                {t('Quy định bảo vệ dữ liệu cá nhân của Click Star', 'Click Star Personal Data Protection Policy')}
              </Link>
              {t(
                ', nơi nêu đầy đủ quyền của anh chị theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 356/2025/NĐ-CP.',
                ', which sets out your full rights under the 2025 Personal Data Protection Law and Decree 356/2025/ND-CP.'
              )}
            </p>
          </Section>

          <Section title={t('2. Click Star xin đồng ý như thế nào', '2. How Click Star asks for consent')}>
            <ul className="grid list-disc gap-2 pl-5">
              <li>
                {t(
                  'Lần đầu truy cập, thanh thông báo ở cuối trang có ba nút ngang nhau: Từ chối, Tùy chỉnh, Đồng ý tất cả.',
                  'On your first visit, a bar at the bottom of the page offers three equal buttons: Reject, Customize, Accept all.'
                )}
              </li>
              <li>
                {t(
                  'Trước khi anh chị chọn, website chỉ chạy nhóm Cần thiết. Google Analytics và CDP Click Star không được tải.',
                  'Until you choose, only Essential cookies run. Google Analytics and the Click Star CDP are not loaded.'
                )}
              </li>
              <li>
                {t(
                  'Trong phần Tùy chỉnh, các nhóm không bắt buộc mặc định tắt. Anh chị bật nhóm nào thì nhóm đó mới chạy.',
                  'In Customize, optional groups are off by default. A group runs only if you switch it on.'
                )}
              </li>
              <li>
                {t(
                  'Lựa chọn được lưu 6 tháng. Hết hạn hoặc khi chính sách này thay đổi đáng kể, website hỏi lại.',
                  'Your choice is kept for 6 months. When it expires or this policy changes materially, we ask again.'
                )}
              </li>
              <li>
                {t(
                  'Mỗi lần anh chị lưu lựa chọn, Click Star ghi lại thời điểm, các nhóm được đồng ý và mã ngẫu nhiên trong cookie cs_consent làm bằng chứng. Bản ghi này không chứa địa chỉ IP, tên, email hay số điện thoại.',
                  'Each time you save a choice, Click Star records the time, the groups allowed and the random ID in the cs_consent cookie as evidence. The record contains no IP address, name, email or phone number.'
                )}
              </li>
            </ul>
          </Section>

          <Section title={t('3. Các nhóm cookie', '3. Cookie groups')}>
            <ul className="grid gap-3">
              <li>
                <strong className="text-foreground">{necessary}.</strong>{' '}
                {t(
                  'Giúp website hoạt động: ghi nhớ ngôn ngữ và lựa chọn cookie, gửi form liên hệ, khung trò chuyện. Luôn bật, không dùng để theo dõi.',
                  'Keep the website working: language and cookie choice, the contact form, the chat. Always on, not used for tracking.'
                )}
              </li>
              <li>
                <strong className="text-foreground">{analytics}.</strong>{' '}
                {t(
                  'Google Analytics 4 và CDP Click Star đếm lượt xem, nguồn truy cập và trang được đọc. Chỉ chạy khi anh chị đồng ý.',
                  'Google Analytics 4 and the Click Star CDP count visits, traffic sources and pages read. Run only with your consent.'
                )}
              </li>
              <li>
                <strong className="text-foreground">{marketing}.</strong>{' '}
                {t(
                  'Gợi ý dịch vụ theo các trang anh chị đã xem, và cho phép Google hiển thị quảng cáo Click Star phù hợp. Chỉ chạy khi anh chị đồng ý.',
                  'Suggests services based on pages you viewed, and lets Google show relevant Click Star ads. Run only with your consent.'
                )}
              </li>
            </ul>
          </Section>

          <section id="cookie" className="grid scroll-mt-24 gap-4">
            <h2 className="text-2xl font-bold text-foreground">{t('4. Danh sách cookie', '4. Cookie list')}</h2>
            <div className="overflow-x-auto rounded-2xl border border-[#e0e0e0]">
              <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
                <thead className="bg-[#f5f5f7] text-[13px] text-[#6e6e73]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{t('Tên', 'Name')}</th>
                    <th className="px-4 py-3 font-semibold">{t('Nhóm', 'Group')}</th>
                    <th className="px-4 py-3 font-semibold">{t('Nhà cung cấp', 'Provider')}</th>
                    <th className="px-4 py-3 font-semibold">{t('Mục đích', 'Purpose')}</th>
                    <th className="px-4 py-3 font-semibold">{t('Thời hạn', 'Duration')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.name} className="border-t border-[#e0e0e0] align-top">
                      {/* Phông mono không có dấu tiếng Việt: chỉ dùng cho tên kỹ thuật */}
                      <td className={`whitespace-nowrap px-4 py-3 text-foreground ${/^[ -~]+$/.test(r.name) ? 'font-mono text-[13px]' : 'font-medium'}`}>{r.name}</td>
                      <td className="px-4 py-3">{r.group}</td>
                      <td className="whitespace-nowrap px-4 py-3">{r.owner}</td>
                      <td className="px-4 py-3">{r.purpose}</td>
                      <td className="px-4 py-3">{r.keep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Section title={t('5. Khi anh chị từ chối', '5. If you reject')}>
            <p>
              {t(
                'Website vẫn dùng được đầy đủ: đọc nội dung, gửi form liên hệ, trò chuyện với trợ lý. Google Analytics và CDP Click Star không tải, website không ghi lịch sử trang anh chị xem và không hiện gợi ý theo lịch sử.',
                'The website stays fully usable: reading, the contact form, the chat assistant. Google Analytics and the Click Star CDP do not load, and no browsing history is kept or used for suggestions.'
              )}
            </p>
          </Section>

          <Section title={t('6. Đổi ý hoặc rút lại đồng ý', '6. Changing or withdrawing consent')}>
            <p>
              {t(
                'Anh chị mở "Cài đặt cookie" ở cuối mọi trang để đổi lựa chọn bất cứ lúc nào. Khi rút lại một nhóm đã đồng ý, website xoá các cookie của nhóm đó trên trình duyệt rồi tải lại trang để áp dụng ngay.',
                'Open "Cookie settings" at the bottom of any page to change your choice at any time. When you withdraw a group, the website deletes that group’s cookies from your browser and reloads the page to apply it right away.'
              )}
            </p>
            <p>
              {t(
                'Việc rút lại không ảnh hưởng đến dữ liệu đã được xử lý hợp pháp trước đó. Anh chị cũng có thể xoá hoặc chặn cookie trong phần cài đặt của trình duyệt.',
                'Withdrawal does not affect data lawfully processed before it. You can also delete or block cookies in your browser settings.'
              )}
            </p>
          </Section>

          <Section title={t('7. Liên hệ', '7. Contact')}>
            <p>
              {t(
                'Câu hỏi về cookie hoặc dữ liệu cá nhân, anh chị gửi về Công ty TNHH Click Star Digital:',
                'For questions about cookies or personal data, contact Click Star Digital Co., Ltd:'
              )}
            </p>
            <p>
              Email: <span className="font-medium text-foreground">{email}</span>
              <br />
              Hotline: <span className="font-medium text-foreground">{phone}</span>
            </p>
          </Section>
        </div>
      </article>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  )
}
