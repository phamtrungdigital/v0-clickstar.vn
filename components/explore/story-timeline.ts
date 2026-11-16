/**
 * Dòng thời gian của câu chuyện /kham-pha, tính theo tiến độ cuộn p từ 0 đến 1. Thuần số, dùng chung cho cảnh 3D
 * (story-scene.tsx) và lớp chữ (story-experience.tsx) để chữ và cảnh luôn khớp.
 *
 *   0.000 - 0.335  Chương 1: chủ doanh nghiệp ngồi trong văn phòng, 3 rắc rối lần lượt hiện ra
 *   0.335          cắt cảnh (màn tối thoáng qua)
 *   0.335 - 0.700  Chương 2: ra phố, đi dọc vỉa hè tới trụ sở Click Star
 *   0.700 - 0.880  Chương 3: đẩy cửa, cửa mở, bước vào sảnh sáng
 *   0.880 - 1.000  mờ dần sang màu của "thế giới" ở phần kế tiếp
 */
export const CUT = 0.335
export const STREET_START = 0.37
export const DOOR_START = 0.7
export const DOOR_END = 0.88

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 0 tại a, 1 tại b, mượt ở hai đầu. */
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export type Chapter = 1 | 2 | 3

export const chapterAt = (p: number): Chapter => (p < CUT ? 1 : p < DOOR_START ? 2 : 3)

/** Độ đục của màn tối khi cắt cảnh (đỉnh ở CUT). */
export const cutFade = (p: number) => clamp01(1 - Math.abs(p - CUT) / 0.03)
/** Độ đục của màn xanh đậm ở cuối, dẫn sang phần "thế giới". */
export const endFade = (p: number) => smooth(0.88, 0.99, p)

/** Chữ từng chương. */
export const CHAPTERS: { n: Chapter; label: { vi: string; en: string }; title: { vi: string; en: string }; body: { vi: string; en: string } }[] = [
  {
    n: 1,
    label: { vi: 'Chương 1 · Vấn đề', en: 'Chapter 1 · The problem' },
    title: { vi: 'Một chủ doanh nghiệp đang rối', en: 'A business owner in a tangle' },
    body: {
      vi: 'Khách đến từ đâu thì không rõ. Số liệu nằm ở nhiều nơi. Cuộc gọi tư vấn xong là hết, không ai nghe lại. Càng làm càng không biết mình đang thiếu gì.',
      en: 'They are not sure where customers come from. Numbers live in many places. Once a consultation call ends, nobody listens to it again. The harder they work, the less they know what is missing.',
    },
  },
  {
    n: 2,
    label: { vi: 'Chương 2 · Tìm đến Click Star', en: 'Chapter 2 · Finding Click Star' },
    title: { vi: 'Rồi họ tìm đến Click Star', en: 'Then they find Click Star' },
    body: {
      vi: 'Một đội ngũ làm cả kỹ thuật lẫn tư vấn, cùng ngồi lại với doanh nghiệp để tìm đúng việc cần làm.',
      en: 'A team that covers both engineering and consulting, sitting down with the business to find the right thing to do.',
    },
  },
  {
    n: 3,
    label: { vi: 'Chương 3 · Mở cửa bước vào', en: 'Chapter 3 · Stepping inside' },
    title: { vi: 'Cánh cửa mở ra', en: 'The door opens' },
    body: {
      vi: 'Bên trong, đội ngũ đã sẵn sàng lắng nghe.',
      en: 'Inside, the team is ready to listen.',
    },
  },
]
