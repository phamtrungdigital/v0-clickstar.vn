/** Nhúng một khối dữ liệu có cấu trúc (JSON-LD). Thay "<" để không thể đóng sớm thẻ script. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': Array.isArray(data) ? data : [data] }).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
