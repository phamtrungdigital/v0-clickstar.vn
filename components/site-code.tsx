import { parseHeadCode, type HeadTag } from '@/lib/cms/code-parse'

/**
 * Chèn mã tuỳ chỉnh (Cài đặt → Mã tuỳ chỉnh) vào website. Server component: HTML nằm sẵn trong bản trả về nên script
 * chạy đúng như dán tay vào mã nguồn. Mỗi mã có thuộc tính data-cs-code=<id> để màn quản trị kiểm tra "đã chạy chưa".
 *
 * Bảo mật: chỉ admin cấp cao sửa được (quyền ở cơ sở dữ liệu và ở hành động máy chủ). dangerouslySetInnerHTML là cố ý,
 * giống như dán mã vào mã nguồn.
 */

type Item = { id: string; code: string }

// Tên thuộc tính HTML → tên prop của React.
const ATTR_TO_PROP: Record<string, string> = {
  class: 'className',
  for: 'htmlFor',
  charset: 'charSet',
  'http-equiv': 'httpEquiv',
  crossorigin: 'crossOrigin',
  referrerpolicy: 'referrerPolicy',
  nomodule: 'noModule',
  fetchpriority: 'fetchPriority',
  hreflang: 'hrefLang',
  imagesrcset: 'imageSrcSet',
  imagesizes: 'imageSizes',
}

function propsOf(attrs: HeadTag['attrs'], id: string): Record<string, unknown> {
  const props: Record<string, unknown> = { 'data-cs-code': id }
  for (const [name, value] of Object.entries(attrs)) {
    // Bỏ thuộc tính sự kiện (onload, onclick...): React không nhận chuỗi mã làm sự kiện, và đây cũng là rủi ro không cần thiết.
    if (name.startsWith('on') || name === 'style' || name === 'dangerouslysetinnerhtml') continue
    props[ATTR_TO_PROP[name] ?? name] = value
  }
  return props
}

function renderTag(t: HeadTag, id: string, key: string) {
  const props = propsOf(t.attrs, id)
  switch (t.tag) {
    case 'meta':
      return <meta key={key} {...props} />
    case 'link':
      return <link key={key} {...props} />
    case 'script':
      return t.inner?.trim() ? (
        <script key={key} {...props} dangerouslySetInnerHTML={{ __html: t.inner }} />
      ) : (
        <script key={key} {...props} />
      )
    case 'style':
      return <style key={key} {...props} dangerouslySetInnerHTML={{ __html: t.inner ?? '' }} />
    case 'noscript':
      return <noscript key={key} {...props} dangerouslySetInnerHTML={{ __html: t.inner ?? '' }} />
  }
}

/**
 * Chỉ bản chính thức (Vercel production) mới chạy mã tuỳ chỉnh. Bản preview và máy chạy thử không chạy,
 * để lượt kiểm thử không lẫn vào số liệu GA4 và CDP. Màn quản trị kiểm tra mã trên địa chỉ chính thức nên không bị ảnh hưởng.
 */
export const SITE_CODE_LIVE = process.env.VERCEL_ENV === 'production'

const GA4_ID = /\bG-[A-Z0-9]{6,14}\b/g

/**
 * Tắt theo dõi khi đang ở khu quản trị: đặt cờ tắt của Google Analytics (ga-disable-<mã>) và cờ __cdpOptOut cho CDP
 * trước khi các mã khác chạy. Layout gốc không đọc đường dẫn ở máy chủ (để trang tĩnh), nên kiểm tra ngay trên trình duyệt.
 */
function TrackingGuard({ codes }: { codes: string[] }) {
  const ids = [...new Set(codes.flatMap((c) => c.match(GA4_ID) ?? []))]
  const js = `(function(){try{if(location.pathname.indexOf('/admin-cls')===0){window.__cdpOptOut=true;${ids
    .map((id) => `window['ga-disable-${id}']=true;`)
    .join('')}}}catch(e){}})();`
  return <script data-cs-guard="" dangerouslySetInnerHTML={{ __html: js }} />
}

/**
 * Các mã "Đầu trang", dựng thật sự vào <head>. `legacy` là mã ở ô Header cũ (mục SEO ghi khối Google Analytics 4 vào đó),
 * cũng được đưa vào <head> bằng cùng cách.
 */
export function HeadCode({ items, legacy, allCodes = [] }: { items: Item[]; legacy?: string | null; allCodes?: string[] }) {
  const all: Item[] = [...(legacy?.trim() ? [{ id: 'legacy-head', code: legacy }] : []), ...items]
  return (
    <>
      <TrackingGuard codes={[...all.map((s) => s.code), ...allCodes]} />
      {all.flatMap((s) => parseHeadCode(s.code).tags.map((t, i) => renderTag(t, s.id, `${s.id}-${i}`)))}
    </>
  )
}

/** Các mã "Đầu thân trang" hoặc "Cuối trang": HTML nguyên văn, mỗi mã trong một khung riêng. */
export function BodyCode({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((s) =>
        s.code.trim() ? (
          <div key={s.id} data-cs-code={s.id} dangerouslySetInnerHTML={{ __html: s.code }} suppressHydrationWarning />
        ) : null
      )}
    </>
  )
}
