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
  /** Mã số thuế (cũng là mã số doanh nghiệp). */
  taxId: null as string | null,
  /** Ngày cấp giấy chứng nhận đăng ký doanh nghiệp, dạng dd/mm/yyyy. */
  registeredOn: null as string | null,
  /** Người đại diện theo pháp luật. */
  representative: null as string | null,
}

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
    [en ? 'Founded' : 'Năm thành lập', String(LEGAL.founded)],
    [en ? 'Operating since' : 'Hoạt động từ', en ? `${LEGAL.agencySince} (as an agency)` : `${LEGAL.agencySince} (dưới dạng agency)`],
    [en ? 'Address' : 'Địa chỉ', address],
  ]
  return rows.filter((r): r is [string, string] => !!r[1]).map(([label, value]) => ({ label, value }))
}
