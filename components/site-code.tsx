import { parseAttrs, parseHeadCode, type HeadTag } from '@/lib/cms/code-parse'

/**
 * Chèn mã tuỳ chỉnh (Cài đặt → Mã tuỳ chỉnh) vào website. Server component: HTML nằm sẵn trong bản trả về nên script
 * chạy đúng như dán tay vào mã nguồn. Mỗi mã có thuộc tính data-cs-code=<id> để màn quản trị kiểm tra "đã chạy chưa".
 *
 * Bảo mật: chỉ admin cấp cao sửa được (quyền ở cơ sở dữ liệu và ở hành động máy chủ). dangerouslySetInnerHTML là cố ý,
 * giống như dán mã vào mã nguồn.
 */

type Item = { id: string; code: string }

/*
 * TẢI SAU (tốc độ trên điện thoại): mọi thẻ <script> JavaScript trong mã tuỳ chỉnh (GA4, CDP...) được dựng thành
 * <script type="text/plain" data-cs-defer> nên trình duyệt chưa tải, chưa chạy. DeferredCodeLoader (cuối <body>) chạy lại
 * chúng đúng thứ tự khi khách tương tác lần đầu (chạm, cuộn, gõ phím, rê chuột) hoặc 3,5 giây sau sự kiện load.
 * Lý do: gtag.js 177 KB + cdp.js chạy lúc mở trang tạo các tác vụ dài, PageSpeed điện thoại tính vào Total Blocking Time
 * (220 ms). Đổi lại: khách rời trang trong vài giây đầu mà không tương tác thì GA4/CDP không ghi lượt đó.
 * Thẻ không phải JavaScript (JSON-LD, meta, link, style, noscript) giữ nguyên, chạy/hiện ngay như cũ.
 */
const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module'])

function isDeferrableScript(attrs: Record<string, string | true>): boolean {
  const t = typeof attrs.type === 'string' ? attrs.type.trim().toLowerCase() : ''
  return JS_TYPES.has(t)
}

/**
 * Thuộc tính đánh dấu một script tải sau: type="text/plain" để trình duyệt bỏ qua, giữ type gốc (module) để chạy lại đúng.
 * async đổi thành data-cs-async: React 19 coi <script async src> là tài nguyên riêng (đẩy lên đầu <head>, tự quản lý),
 * thẻ giữ chỗ không được để React đụng vào.
 */
function deferAttrs(attrs: Record<string, string | true>): Record<string, string> {
  const t = typeof attrs.type === 'string' ? attrs.type.trim().toLowerCase() : ''
  return {
    type: 'text/plain',
    'data-cs-defer': '',
    ...(t === 'module' ? { 'data-cs-type': 'module' } : {}),
    ...(attrs.async !== undefined ? { 'data-cs-async': '' } : {}),
  }
}

/** Đổi các thẻ <script> JavaScript trong một đoạn HTML (mã "Đầu thân trang" / "Cuối trang") sang dạng tải sau. */
function deferScriptsInHtml(html: string): string {
  return html.replace(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi, (whole, rawAttrs: string) => {
    if (!isDeferrableScript(parseAttrs(rawAttrs))) return whole
    const extra = Object.entries(deferAttrs(parseAttrs(rawAttrs)))
      .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v}"`))
      .join('')
    const withoutType = rawAttrs
      .replace(/\stype\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\sasync(\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?(?=[\s>]|$)/gi, '')
    return `<script${extra}${withoutType}>`
  })
}

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
    case 'script': {
      const p: Record<string, unknown> = isDeferrableScript(t.attrs) ? { ...props, ...deferAttrs(t.attrs) } : props
      if (p['data-cs-async'] !== undefined) delete p.async
      return t.inner?.trim() ? (
        <script key={key} {...p} dangerouslySetInnerHTML={{ __html: t.inner }} />
      ) : (
        <script key={key} {...p} />
      )
    }
    case 'style':
      return <style key={key} {...props} dangerouslySetInnerHTML={{ __html: t.inner ?? '' }} />
    case 'noscript':
      return <noscript key={key} {...props} dangerouslySetInnerHTML={{ __html: t.inner ?? '' }} />
  }
}

/**
 * Chỉ bản chính thức (Vercel production) mới GHI số liệu. Bản preview và máy chạy thử vẫn tải mã tuỳ chỉnh (để kiểm được
 * cách tải và đo tốc độ giống bản chính thức) nhưng TrackingGuard bật sẵn cờ tắt của GA4 (ga-disable-<mã>) và CDP
 * (__cdpOptOut), nên lượt kiểm thử không lẫn vào số liệu. Màn quản trị kiểm tra mã trên địa chỉ chính thức.
 */
export const SITE_CODE_TRACKING = process.env.VERCEL_ENV === 'production'

const GA4_ID = /\bG-[A-Z0-9]{6,14}\b/g

/**
 * Tắt theo dõi khi đang ở khu quản trị (và mọi trang của bản preview / máy chạy thử): đặt cờ tắt của Google Analytics (ga-disable-<mã>) và cờ __cdpOptOut cho CDP
 * trước khi các mã khác chạy. Layout gốc không đọc đường dẫn ở máy chủ (để trang tĩnh), nên kiểm tra ngay trên trình duyệt.
 */
function TrackingGuard({ codes }: { codes: string[] }) {
  const ids = [...new Set(codes.flatMap((c) => c.match(GA4_ID) ?? []))]
  const off = SITE_CODE_TRACKING ? '' : 'true||'
  const js = `(function(){try{if(${off}location.pathname.indexOf('/admin-cls')===0){window.__cdpOptOut=true;${ids
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
          <div key={s.id} data-cs-code={s.id} dangerouslySetInnerHTML={{ __html: deferScriptsInHtml(s.code) }} suppressHydrationWarning />
        ) : null
      )}
    </>
  )
}

// Chạy lại các script đánh dấu data-cs-defer, đúng thứ tự: script ngoài không async/defer thì đợi tải xong mới sang thẻ kế
// (giữ đúng ngữ nghĩa như khi nằm thẳng trong HTML); script mới chèn ngay sau thẻ giữ chỗ, giữ mọi thuộc tính (data-write-key,
// data-cs-code...). document.currentScript vẫn đúng với script chèn bằng JS nên cdp.js đọc được data-write-key.
const LOADER = `(function(){var started=false,EV=['pointerdown','keydown','touchstart','scroll','wheel','mousemove'];
function start(){if(started)return;started=true;for(var j=0;j<EV.length;j++)removeEventListener(EV[j],start,true);
var list=document.querySelectorAll('script[data-cs-defer]'),i=0;
function next(){while(i<list.length){var old=list[i++],s=document.createElement('script'),a=old.attributes;
for(var k=0;k<a.length;k++){var n=a[k].name;if(n!=='type'&&n!=='data-cs-defer'&&n!=='data-cs-type'&&n!=='data-cs-async')s.setAttribute(n,a[k].value);}
var t=old.getAttribute('data-cs-type');if(t)s.type=t;var src=old.getAttribute('src');
if(src){var wait=!old.hasAttribute('data-cs-async')&&!old.hasAttribute('async')&&!old.hasAttribute('defer');s.async=!wait;
if(wait){s.onload=s.onerror=next;old.parentNode.insertBefore(s,old.nextSibling);return;}
old.parentNode.insertBefore(s,old.nextSibling);}else{s.text=old.text;old.parentNode.insertBefore(s,old.nextSibling);}}}
next();}
for(var j=0;j<EV.length;j++)addEventListener(EV[j],start,{capture:true,passive:true,once:true});
function arm(){setTimeout(start,3500);}
if(document.readyState==='complete')arm();else addEventListener('load',arm);})();`

/** Đặt cuối <body>, sau mọi mã tuỳ chỉnh. */
export function DeferredCodeLoader() {
  return <script data-cs-loader="" dangerouslySetInnerHTML={{ __html: LOADER }} />
}
