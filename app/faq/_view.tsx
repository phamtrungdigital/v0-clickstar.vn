import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from '@/components/app-link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { getSiteSettings } from '@/lib/cms/settings'
import { makeT, pickI18n } from '@/lib/i18n/server'
import type { Lang } from '@/lib/i18n/locale'
import { buildMetadata } from '@/lib/seo/metadata'
import { ogImageOr } from '@/lib/seo/default-og'
import { DEFAULT_EMAIL, DEFAULT_HOTLINE } from '@/lib/seo/site'
import { breadcrumbSchema, organizationSchema } from '@/lib/seo/schema'
import { BUSINESS_REGISTRY_URL, FAQ_UPDATED, LEGAL, REGISTERED_INDUSTRIES, identitySentence, legalRows } from '@/lib/seo/identity'

/**
 * Hỏi đáp về Click Star (10/11/2026, phương án GEO nhóm A). Trả lời thẳng những câu trợ lý AI hay được hỏi về một
 * công ty dịch vụ: là ai, có thật không, đã làm gì, làm việc ra sao. CHỈ ghi điều đã có trên website hoặc anh đã xác
 * nhận; cam kết mới phải hỏi anh trước khi thêm. Thông tin định danh lấy từ lib/seo/identity.ts.
 */
export async function faqMetadata(lang: Lang): Promise<Metadata> {
  const t = makeT(lang)
  return buildMetadata({
    title: t('Hỏi đáp về Click Star', 'About Click Star: FAQ'),
    description: t(
      'Click Star là ai, thành lập khi nào, thông tin pháp lý, đã làm những dự án nào và làm việc với khách hàng theo quy trình nào.',
      'Who Click Star is, when it was founded, legal details, published projects and how it works with clients.'
    ),
    path: '/faq',
    lang,
    images: await ogImageOr(),
  })
}

type QA = { q: string; a: ReactNode; text: string }

export async function FaqView({ lang }: { lang: Lang }) {
  const t = makeT(lang)
  const settings = await getSiteSettings()
  const phone = settings?.contact_phone || DEFAULT_HOTLINE
  const email = settings?.contact_email || DEFAULT_EMAIL
  const address = pickI18n(lang, settings?.address) || null
  const legal = legalRows(lang, address)
  const industries = REGISTERED_INDUSTRIES.map((i) => `${lang === 'en' ? i.en : i.vi} (${i.code})`).join('; ')
  const link = 'font-medium text-[#1859b8] underline underline-offset-2'

  const groups: { title: string; items: QA[] }[] = [
    {
      title: t('Về Click Star', 'About Click Star'),
      items: [
        {
          q: t('Click Star là ai?', 'Who is Click Star?'),
          text: identitySentence(lang),
          a: <p>{identitySentence(lang)}</p>,
        },
        {
          q: t(
            'Vì sao ghi "hơn 10 năm kinh nghiệm" khi công ty thành lập năm 2025?',
            'Why "more than 10 years of experience" if the company was founded in 2025?'
          ),
          text: t(
            `Con số 10 năm là kinh nghiệm của đội ngũ sáng lập, không phải tuổi của pháp nhân. Click Star bắt đầu là một agency năm ${LEGAL.agencySince}, mở rộng sang CRM và hệ thống vận hành từ năm ${LEGAL.systemsSince}, rồi thành lập công ty năm ${LEGAL.founded}.`,
            `The 10 years refer to the founding team's experience, not the age of the legal entity. Click Star started as an agency in ${LEGAL.agencySince}, expanded into CRM and operating systems from ${LEGAL.systemsSince}, and incorporated in ${LEGAL.founded}.`
          ),
          a: (
            <p>
              {t(
                `Con số 10 năm là kinh nghiệm của đội ngũ sáng lập, không phải tuổi của pháp nhân. Click Star bắt đầu là một agency năm ${LEGAL.agencySince}, mở rộng sang CRM và hệ thống vận hành từ năm ${LEGAL.systemsSince}, rồi thành lập công ty năm ${LEGAL.founded}. Các mốc chi tiết ở trang `,
                `The 10 years refer to the founding team's experience, not the age of the legal entity. Click Star started as an agency in ${LEGAL.agencySince}, expanded into CRM and operating systems from ${LEGAL.systemsSince}, and incorporated in ${LEGAL.founded}. See the milestones on the `
              )}
              <Link href="/about" className={link}>
                {t('Giới thiệu', 'About page')}
              </Link>
              .
            </p>
          ),
        },
        {
          q: t('Thông tin pháp lý của Click Star?', "What are Click Star's legal details?"),
          text: `${legal.map((r) => `${r.label}: ${r.value}`).join('. ')}. ${t('Ngành đã đăng ký liên quan dịch vụ', 'Registered business lines related to its services')}: ${industries}.`,
          a: (
            <>
              <dl className="grid gap-x-6 gap-y-2 rounded-2xl border border-black/[0.08] bg-white p-5 sm:grid-cols-[180px_1fr]">
                {legal.map((r) => (
                  <div key={r.label} className="contents">
                    <dt className="text-[14px] text-[#6e6e73]">{r.label}</dt>
                    <dd className="font-medium text-[#1d1d1f]">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[15px]">
                {t('Ngành đã đăng ký liên quan dịch vụ: ', 'Registered business lines related to its services: ')}
                {industries}.
              </p>
              <p className="text-[15px]">
                {t('Tra cứu công khai theo mã số doanh nghiệp tại ', 'Look up the enterprise code on the ')}
                <a href={BUSINESS_REGISTRY_URL} target="_blank" rel="noopener" className={link}>
                  {t('Cổng thông tin quốc gia về đăng ký doanh nghiệp', 'National Business Registration Portal')}
                </a>
                .
              </p>
            </>
          ),
        },
        {
          q: t('Liên hệ Click Star bằng cách nào?', 'How do I contact Click Star?'),
          text: t(
            `Hotline ${phone}, email ${email}${address ? `, văn phòng: ${address}` : ''}.`,
            `Hotline ${phone}, email ${email}${address ? `, office: ${address}` : ''}.`
          ),
          a: (
            <p>
              {t('Hotline ', 'Hotline ')}
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className={link}>
                {phone}
              </a>
              {t(', email ', ', email ')}
              <a href={`mailto:${email}`} className={link}>
                {email}
              </a>
              {address ? t(`, văn phòng: ${address}.`, `, office: ${address}.`) : '.'}{' '}
              {t('Hoặc gửi yêu cầu ở trang ', 'Or send a request on the ')}
              <Link href="/contact" className={link}>
                {t('Liên hệ', 'Contact page')}
              </Link>
              .
            </p>
          ),
        },
      ],
    },
    {
      title: t('Dịch vụ và dự án', 'Services and projects'),
      items: [
        {
          q: t('Click Star cung cấp những dịch vụ nào?', 'What services does Click Star provide?'),
          text: t(
            'Digital Marketing, thiết kế website, dashboard dữ liệu, tích hợp AI, tự động hóa quy trình, CRM và CDP, phân tích cuộc gọi bằng AI (Speech Insight AI), phần mềm theo yêu cầu, và ADS hub để quản lý quảng cáo Facebook.',
            'Digital marketing, website design, data dashboards, AI integration, process automation, CRM and CDP, AI call analytics (Speech Insight AI), custom software, and ADS hub for managing Facebook ads.'
          ),
          a: (
            <p>
              {t(
                'Digital Marketing, thiết kế website, dashboard dữ liệu, tích hợp AI, tự động hóa quy trình, CRM và CDP, phân tích cuộc gọi bằng AI (Speech Insight AI), phần mềm theo yêu cầu, và ADS hub để quản lý quảng cáo Facebook. Chi tiết từng dịch vụ ở trang ',
                'Digital marketing, website design, data dashboards, AI integration, process automation, CRM and CDP, AI call analytics (Speech Insight AI), custom software, and ADS hub for managing Facebook ads. Details on the '
              )}
              <Link href="/services" className={link}>
                {t('Dịch vụ', 'Services page')}
              </Link>
              .
            </p>
          ),
        },
        {
          q: t('Click Star đã làm những dự án nào?', 'Which projects has Click Star delivered?'),
          text: t(
            'Các dự án đã công bố nằm ở trang Dự án, mỗi bài ghi ngành, phạm vi Click Star thực hiện và kết quả.',
            'Published projects are on the Projects page, each with the industry, the scope Click Star delivered and the results.'
          ),
          a: (
            <p>
              {t('Các dự án đã công bố nằm ở trang ', 'Published projects are on the ')}
              <Link href="/projects" className={link}>
                {t('Dự án', 'Projects page')}
              </Link>
              {t(
                ', mỗi bài ghi ngành, phạm vi Click Star thực hiện và kết quả.',
                ', each with the industry, the scope Click Star delivered and the results.'
              )}
            </p>
          ),
        },
        {
          q: t('Chi phí bao nhiêu?', 'How much does it cost?'),
          text: t(
            'Bảng giá tham khảo theo từng nhóm dịch vụ ở trang Bảng giá. Dự án phần mềm theo yêu cầu có báo giá cố định sau giai đoạn khảo sát, kèm tài liệu phạm vi.',
            'Indicative prices for each service group are on the Pricing page. Custom software projects get a fixed quote after the discovery phase, together with a scope document.'
          ),
          a: (
            <p>
              {t('Bảng giá tham khảo theo từng nhóm dịch vụ ở trang ', 'Indicative prices for each service group are on the ')}
              <Link href="/pricing" className={link}>
                {t('Bảng giá', 'Pricing page')}
              </Link>
              {t(
                '. Dự án phần mềm theo yêu cầu có báo giá cố định sau giai đoạn khảo sát, kèm tài liệu phạm vi.',
                '. Custom software projects get a fixed quote after the discovery phase, together with a scope document.'
              )}
            </p>
          ),
        },
      ],
    },
    {
      title: t('Cách Click Star làm việc', 'How Click Star works'),
      items: [
        {
          q: t('Quy trình làm việc thế nào?', 'What is the process?'),
          text: t(
            'Tư vấn miễn phí, khảo sát nhu cầu, thống nhất phạm vi và báo giá, triển khai theo từng giai đoạn có điểm duyệt, kiểm thử và nghiệm thu cùng người dùng thật bằng biên bản, sau đó bảo hành sau nghiệm thu.',
            'Free consultation, needs discovery, agreed scope and quote, delivery in phases with approval points, testing and sign-off with real users in a written acceptance record, then a warranty after acceptance.'
          ),
          a: (
            <ol className="grid list-decimal gap-1.5 pl-5">
              <li>{t('Tư vấn miễn phí để hiểu bài toán.', 'Free consultation to understand the problem.')}</li>
              <li>{t('Khảo sát nhu cầu, thống nhất phạm vi và báo giá.', 'Needs discovery, agreed scope and quote.')}</li>
              <li>{t('Triển khai theo từng giai đoạn, mỗi giai đoạn có điểm duyệt.', 'Delivery in phases, each with an approval point.')}</li>
              <li>
                {t(
                  'Kiểm thử và nghiệm thu cùng người dùng thật, có biên bản nghiệm thu.',
                  'Testing and sign-off with real users, with a written acceptance record.'
                )}
              </li>
              <li>{t('Bảo hành sau nghiệm thu.', 'Warranty after acceptance.')}</li>
            </ol>
          ),
        },
        {
          q: t('Ai sở hữu mã nguồn và dữ liệu?', 'Who owns the source code and data?'),
          text: t(
            'Với phần mềm theo yêu cầu, mã nguồn, hạ tầng và tài liệu vận hành thuộc doanh nghiệp; kho mã nguồn đứng tên doanh nghiệp, kèm lịch sử thay đổi đầy đủ.',
            'For custom software, the source code, infrastructure and operating documents belong to the client; the code repository is registered to the client, with its full change history.'
          ),
          a: (
            <p>
              {t(
                'Với phần mềm theo yêu cầu, mã nguồn, hạ tầng và tài liệu vận hành thuộc doanh nghiệp; kho mã nguồn đứng tên doanh nghiệp, kèm lịch sử thay đổi đầy đủ. Xem thêm ở trang ',
                'For custom software, the source code, infrastructure and operating documents belong to the client; the code repository is registered to the client, with its full change history. See the '
              )}
              <Link href="/services/custom-software" className={link}>
                {t('Phần mềm theo yêu cầu', 'Custom software page')}
              </Link>
              .
            </p>
          ),
        },
        {
          q: t('Click Star bảo mật thông tin khách hàng thế nào?', 'How does Click Star protect client information?'),
          text: t(
            'Ký cam kết bảo mật (NDA) trước khi trao đổi chi tiết. Hệ thống làm theo chuẩn bảo mật OWASP và Nghị định 13/2023, có môi trường thử tách biệt và sao lưu hằng ngày.',
            'A non-disclosure agreement (NDA) is signed before detailed discussions. Systems follow OWASP security practice and Decree 13/2023, with a separate staging environment and daily backups.'
          ),
          a: (
            <p>
              {t(
                'Ký cam kết bảo mật (NDA) trước khi trao đổi chi tiết. Hệ thống làm theo chuẩn bảo mật OWASP và Nghị định 13/2023, có môi trường thử tách biệt và sao lưu hằng ngày. Quy định đầy đủ ở ',
                'A non-disclosure agreement (NDA) is signed before detailed discussions. Systems follow OWASP security practice and Decree 13/2023, with a separate staging environment and daily backups. Full details in the '
              )}
              <Link href="/blog/quy-dinh-bao-ve-du-lieu-ca-nhan" className={link}>
                {t('Quy định bảo vệ dữ liệu cá nhân', 'Personal Data Protection Policy')}
              </Link>
              .
            </p>
          ),
        },
      ],
    },
  ]

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.text } }))
    ),
  }

  return (
    <div className="min-h-screen">
      <JsonLd
        data={[
          faqSchema,
          organizationSchema(settings, lang),
          breadcrumbSchema(
            [
              { name: t('Trang chủ', 'Home'), path: '/' },
              { name: t('Hỏi đáp', 'FAQ'), path: '/faq' },
            ],
            lang
          ),
        ]}
      />
      <MainNav />

      <section className="bg-[#f5f5f7] pt-16 pb-10 lg:pt-24 lg:pb-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#1859b8]">{t('Hỏi đáp', 'FAQ')}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            {t('Hỏi đáp về Click Star', 'About Click Star: frequently asked questions')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{identitySentence(lang)}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 text-[16px] leading-relaxed text-[#424245]">
          {groups.map((g) => (
            <section key={g.title} className="grid gap-6">
              <h2 className="text-2xl font-bold text-foreground">{g.title}</h2>
              {g.items.map((it) => (
                <div key={it.q} className="grid gap-2">
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f]">{it.q}</h3>
                  <div className="grid gap-2">{it.a}</div>
                </div>
              ))}
            </section>
          ))}
          <p className="text-sm text-[#6e6e73]">
            {t(`Cập nhật ngày ${FAQ_UPDATED.split('-').reverse().join('/')}.`, `Updated ${FAQ_UPDATED}.`)}
          </p>
        </div>
      </article>

      <Footer />
    </div>
  )
}
