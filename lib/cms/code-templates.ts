/**
 * Mẫu mã có sẵn cho Cài đặt → Mã tuỳ chỉnh: anh chỉ nhập ID, mã được sinh đúng chuẩn của nhà cung cấp.
 * Thuần (không import server) nên dùng được cả ở trình duyệt (xem trước) lẫn máy chủ (sinh lại mã khi lưu).
 *
 * ID luôn được kiểm bằng biểu thức chặt trước khi chèn vào mã, để một ID bậy không phá được đoạn script.
 * Mẫu TikTok Pixel chưa có vì mã thay đổi theo phiên bản: dán bằng "Mã tuỳ chỉnh".
 */

export type Placement = 'head' | 'body_start' | 'body_end'

export const PLACEMENTS: { id: Placement; title: string; short: string; hint: string }[] = [
  {
    id: 'head',
    title: 'Đầu trang (head)',
    short: 'Trong thẻ head',
    hint: 'Chạy sớm nhất. Dùng cho Google Analytics, Tag Manager, Pixel, thẻ xác minh website.',
  },
  {
    id: 'body_start',
    title: 'Đầu thân trang (body)',
    short: 'Ngay sau mở body',
    hint: 'Dùng cho thẻ noscript của Tag Manager, widget chat, mã cần có sớm trong thân trang.',
  },
  {
    id: 'body_end',
    title: 'Cuối trang (footer)',
    short: 'Trước đóng body',
    hint: 'Chạy sau cùng, không làm chậm lúc trang hiện ra. Dùng cho remarketing, công cụ phụ.',
  },
]

export type TemplateId = 'ga4' | 'gtm' | 'meta_pixel' | 'clarity' | 'bing_verify'

export type TemplatePart = {
  /** Khoá phần mã (lưu trong config.part) để sinh lại đúng phần khi sửa ID. */
  key: string
  placement: Placement
  name: string
  code: (id: string) => string
}

export type TemplateDef = {
  id: TemplateId
  name: string
  sub: string
  label: string
  placeholder: string
  hint: string
  pattern: RegExp
  parts: TemplatePart[]
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    sub: 'Chỉ cần ID đo lường',
    label: 'ID đo lường GA4',
    placeholder: 'G-XXXXXXXXXX',
    hint: 'Lấy ở GA4 › Quản trị › Luồng dữ liệu. Bắt đầu bằng G-.',
    pattern: /^G-[A-Z0-9]{6,14}$/,
    parts: [
      {
        key: 'main',
        placement: 'head',
        name: 'Google Analytics 4',
        code: (id) =>
          `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${id}');\n</script>`,
      },
    ],
  },
  {
    id: 'gtm',
    name: 'Google Tag Manager',
    sub: 'Tự thêm cả head và body',
    label: 'ID vùng chứa',
    placeholder: 'GTM-XXXXXXX',
    hint: 'Bắt đầu bằng GTM-. Tự đặt 2 phần mã đúng vị trí.',
    pattern: /^GTM-[A-Z0-9]{4,10}$/,
    parts: [
      {
        key: 'head',
        placement: 'head',
        name: 'Google Tag Manager (head)',
        code: (id) =>
          `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\nnew Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\nj=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n})(window,document,'script','dataLayer','${id}');</script>\n<!-- End Google Tag Manager -->`,
      },
      {
        key: 'noscript',
        placement: 'body_start',
        name: 'Google Tag Manager (noscript)',
        code: (id) =>
          `<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>\n<!-- End Google Tag Manager (noscript) -->`,
      },
    ],
  },
  {
    id: 'meta_pixel',
    name: 'Meta Pixel',
    sub: 'Facebook, Instagram',
    label: 'ID Pixel',
    placeholder: '1234567890123456',
    hint: 'Dãy số ở Trình quản lý sự kiện của Meta.',
    pattern: /^\d{8,20}$/,
    parts: [
      {
        key: 'main',
        placement: 'head',
        name: 'Meta Pixel',
        code: (id) =>
          `<!-- Meta Pixel Code -->\n<script>\n!function(f,b,e,v,n,t,s)\n{if(f.fbq)return;n=f.fbq=function(){n.callMethod?\nn.callMethod.apply(n,arguments):n.queue.push(arguments)};\nif(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\nn.queue=[];t=b.createElement(e);t.async=!0;\nt.src=v;s=b.getElementsByTagName(e)[0];\ns.parentNode.insertBefore(t,s)}(window, document,'script',\n'https://connect.facebook.net/en_US/fbevents.js');\nfbq('init', '${id}');\nfbq('track', 'PageView');\n</script>\n<!-- End Meta Pixel Code -->`,
      },
    ],
  },
  {
    id: 'clarity',
    name: 'Microsoft Clarity',
    sub: 'Ghi lại phiên xem',
    label: 'ID dự án',
    placeholder: 'abcd1234ef',
    hint: 'Lấy ở Clarity › Cài đặt › Mã theo dõi.',
    pattern: /^[a-z0-9]{6,16}$/,
    parts: [
      {
        key: 'main',
        placement: 'head',
        name: 'Microsoft Clarity',
        code: (id) =>
          `<script type="text/javascript">\n(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};\nt=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;\ny=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);\n})(window, document, "clarity", "script", "${id}");\n</script>`,
      },
    ],
  },
  {
    id: 'bing_verify',
    name: 'Thẻ xác minh Bing',
    sub: 'Bing Webmaster Tools',
    label: 'Giá trị xác minh',
    placeholder: 'ABCDEF1234567890',
    hint: 'Chuỗi content của thẻ msvalidate.01.',
    pattern: /^[A-Za-z0-9_-]{8,64}$/,
    parts: [
      {
        key: 'main',
        placement: 'head',
        name: 'Thẻ xác minh Bing',
        code: (id) => `<meta name="msvalidate.01" content="${id}" />`,
      },
    ],
  },
]

export const getTemplate = (id: string): TemplateDef | undefined => TEMPLATES.find((t) => t.id === id)

/** null = hợp lệ, còn lại là câu báo lỗi cho người dùng. */
export function validateTemplateId(t: TemplateDef, raw: string): string | null {
  const id = raw.trim()
  if (!id) return `Hãy nhập ${t.label.toLowerCase()}.`
  if (!t.pattern.test(id)) return `${t.label} chưa đúng định dạng (ví dụ ${t.placeholder}).`
  return null
}

/** Mã của một phần mẫu với ID đã kiểm. */
export function templatePartCode(t: TemplateDef, partKey: string, id: string): string | null {
  const part = t.parts.find((p) => p.key === partKey)
  return part ? part.code(id.trim()) : null
}
