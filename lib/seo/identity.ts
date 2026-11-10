import type { Lang } from '@/lib/i18n/locale'

/**
 * Thông tin định danh Click Star: MỘT nguồn dùng chung cho trang Giới thiệu, Hỏi đáp, chân trang, llms.txt và dữ liệu
 * có cấu trúc. Trợ lý AI (ChatGPT, Gemini...) so khớp các nơi này với nhau: câu chữ lệch nhau hoặc số đứng một mình
 * (ví dụ "10+ năm kinh nghiệm" cạnh "thành lập 2025") khiến AI kết luận "cần thẩm định thêm".
 *
 * Chỉ ghi điều đã xác nhận. Trường để null thì không hiển thị ở đâu cả (không đoán, không để chữ giữ chỗ).
 */
export const LEGAL = {
  legalName: 'CÔNG TY TNHH CLICK STAR DIGITAL',
  legalNameEn: 'CLICK STAR DIGITAL CO., LTD',
  /** Năm thành lập công ty. */
  founded: 2025,
  /** Năm bắt đầu hoạt động dưới dạng agency (tiền thân của công ty). */
  agencySince: 2018,
  /** Năm mở rộng sang CRM và hệ thống vận hành. */
  systemsSince: 2021,
  /** Mã số doanh nghiệp (cũng là mã số thuế). Nguồn: Giấy xác nhận thay đổi nội dung đăng ký doanh nghiệp số 479814/26,
   *  Sở Tài chính Hà Nội, 01/10/2026. */
  taxId: '0111151741' as string | null,
  /** Ngày cấp giấy chứng nhận đăng ký doanh nghiệp, dạng dd/mm/yyyy. */
  registeredOn: null as string | null,
  /** Người đại diện theo pháp luật. */
  representative: null as string | null,
}

/**
 * Ngành nghề đã đăng ký (Hệ thống thông tin quốc gia về đăng ký doanh nghiệp, cập nhật 01/10/2026): ngành chính và các
 * ngành khớp với dịch vụ Click Star đang cung cấp. Danh sách đầy đủ có 30 ngành; ở đây chỉ nêu ngành liên quan.
 */
export const REGISTERED_INDUSTRIES: { code: string; vi: string; en: string; main?: boolean }[] = [
  { code: '7310', vi: 'Quảng cáo', en: 'Advertising', main: true },
  { code: '6219', vi: 'Lập trình máy tính khác', en: 'Other computer programming' },
  { code: '6220', vi: 'Tư vấn máy tính và quản lý cơ sở hạ tầng máy tính', en: 'Computer consultancy and facilities management' },
  { code: '6290', vi: 'Hoạt động dịch vụ máy tính và công nghệ thông tin khác', en: 'Other IT and computer service activities' },
  { code: '6310', vi: 'Cơ sở hạ tầng công nghệ thông tin, xử lý dữ liệu, lưu trữ', en: 'IT infrastructure, data processing and hosting' },
  { code: '7020', vi: 'Tư vấn quản lý kinh doanh', en: 'Management consultancy' },
  { code: '7320', vi: 'Nghiên cứu thị trường', en: 'Market research' },
  { code: '7410', vi: 'Thiết kế chuyên dụng', en: 'Specialised design' },
  { code: '8559', vi: 'Đào tạo kỹ năng marketing, digital marketing, truyền thông, xây dựng thương hiệu, bán hàng', en: 'Training in marketing, digital marketing, communications, branding and sales' },
]

/** Ngày cập nhật trang Hỏi đáp (app/faq), dùng làm lastmod trong sitemap. */
export const FAQ_UPDATED = '2026-11-10'

/** Tra cứu công khai trên Cổng thông tin quốc gia về đăng ký doanh nghiệp. */
export const BUSINESS_REGISTRY_URL = 'https://dangkykinhdoanh.gov.vn'

/** Câu định danh: dùng nguyên văn ở mọi nơi giới thiệu Click Star. */
export function identitySentence(lang: Lang): string {
  return lang === 'en'
    ? `Click Star (${LEGAL.legalNameEn}) was founded in ${LEGAL.founded} in Hanoi. It grew out of an agency that has operated since ${LEGAL.agencySince}; the founding team has more than 10 years of experience in digital marketing, websites, data and AI.`
    : `Click Star (${LEGAL.legalName}) thành lập năm ${LEGAL.founded} tại Hà Nội, tiền thân là agency hoạt động từ năm ${LEGAL.agencySince}; đội ngũ sáng lập có hơn 10 năm kinh nghiệm về Digital Marketing, website, dữ liệu và AI.`
}

/** Các dòng thông tin pháp lý đã có dữ liệu (nhãn, giá trị), theo ngôn ngữ. */
export function legalRows(lang: Lang, address?: string | null): { label: string; value: string }[] {
  const en = lang === 'en'
  const rows: [string, string | null | undefined][] = [
    [en ? 'Legal name' : 'Tên doanh nghiệp', en ? LEGAL.legalNameEn : LEGAL.legalName],
    [en ? 'Tax / enterprise code' : 'Mã số thuế', LEGAL.taxId],
    [en ? 'Registered on' : 'Ngày cấp đăng ký', LEGAL.registeredOn],
    [en ? 'Legal representative' : 'Người đại diện', LEGAL.representative],
    [en ? 'Main business line' : 'Ngành kinh doanh chính', REGISTERED_INDUSTRIES.filter((i) => i.main).map((i) => `${en ? i.en : i.vi} (${i.code})`).join(', ')],
    [en ? 'Founded' : 'Năm thành lập', String(LEGAL.founded)],
    [en ? 'Operating since' : 'Hoạt động từ', en ? `${LEGAL.agencySince} (as an agency)` : `${LEGAL.agencySince} (dưới dạng agency)`],
    [en ? 'Address' : 'Địa chỉ', address],
  ]
  return rows.filter((r): r is [string, string] => !!r[1]).map(([label, value]) => ({ label, value }))
}
