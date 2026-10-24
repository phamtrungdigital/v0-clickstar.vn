import { parseAttrs, parseHeadCode, type HeadTag } from '@/lib/cms/code-parse'
import { CONSENT_MAX_AGE_DAYS, POLICY_VERSION, type ConsentCategory } from '@/lib/consent/shared'

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
 * chúng đúng thứ tự khi khách tương tác lần đầu (chạm, cuộn, gõ phím, rê chuột) hoặc 8 giây sau sự kiện load (máy đo PageSpeed theo dõi trang tới khoảng 6 giây, chờ 3,5 giây thì gtag vẫn bị tính vào Total Blocking Time).
 * Lý do: gtag.js 177 KB + cdp.js chạy lúc mở trang tạo các tác vụ dài, PageSpeed điện thoại tính vào Total Blocking Time
 * (220 ms). Đổi lại: khách rời trang trong vài giây đầu mà không tương tác thì GA4/CDP không ghi lượt đó.
 * Thẻ không phải JavaScript (JSON-LD, meta, link, style, noscript) giữ nguyên, chạy/hiện ngay như cũ.
 */
const JS_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module'])

/*
 * ĐỒNG Ý COOKIE (lib/consent/shared.ts): mỗi mã tuỳ chỉnh thuộc một nhóm, đoán theo nội dung mã. Bộ nạp chỉ chạy script
 * tải sau khi khách đã đồng ý nhóm đó (cần thiết luôn chạy). Chưa chọn hoặc từ chối: GA4 và CDP không tải gì cả.
 * Mã không nhận ra được xếp vào "Đo lường truy cập" cho chắc (chỉ chạy khi khách đồng ý).
 */
const MARKETING_RE = /fbevents|connect\.facebook\.net|facebook\.com\/tr|tiktok|doubleclick|googleadservices|\bAW-\d|ads\.linkedin|snap\.licdn|clarity\.ms|hotjar|zalo\.me\/.*pixel/i

export function snippetCategory(code: string): ConsentCategory {
  return MARKETING_RE.test(code) ? 'marketing' : 'analytics'
}

function isDeferrableScript(attrs: Record<string, string | true>): boolean {
  const t = typeof attrs.type === 'string' ? attrs.type.trim().toLowerCase() : ''
  return JS_TYPES.has(t)
}

/**
 * Thuộc tính đánh dấu một script tải sau: type="text/plain" để trình duyệt bỏ qua, giữ type gốc (module) để chạy lại đúng.
 * async đổi thành data-cs-async: React 19 coi <script async src> là tài nguyên riêng (đẩy lên đầu <head>, tự quản lý),
 * thẻ giữ chỗ không được để React đụng vào.
 */
function deferAttrs(attrs: Record<string, string | true>, cat: ConsentCategory): Record<string, string> {
  const t = typeof attrs.type === 'string' ? attrs.type.trim().toLowerCase() : ''
  return {
    type: 'text/plain',
    'data-cs-defer': '',
    'data-cs-cat': cat,
    ...(t === 'module' ? { 'data-cs-type': 'module' } : {}),
    ...(attrs.async !== undefined ? { 'data-cs-async': '' } : {}),
  }
}

/** Đổi các thẻ <script> JavaScript trong một đoạn HTML (mã "Đầu thân trang" / "Cuối trang") sang dạng tải sau. */
function deferScriptsInHtml(html: string, cat: ConsentCategory): string {
  return html.replace(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi, (whole, rawAttrs: string) => {
    if (!isDeferrableScript(parseAttrs(rawAttrs))) return whole
    const extra = Object.entries(deferAttrs(parseAttrs(rawAttrs), cat))
      .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v}"`))
      .join('')
    const withoutType = rawAttrs
      .replace(/\sdata-cs-(?:defer|cat|type|async)(\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/gi, '')
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

function renderTag(t: HeadTag, id: string, key: string, cat: ConsentCategory) {
  const props = propsOf(t.attrs, id)
  switch (t.tag) {
    case 'meta':
      return <meta key={key} {...props} />
    case 'link':
      return <link key={key} {...props} />
    case 'script': {
      const p: Record<string, unknown> = isDeferrableScript(t.attrs) ? { ...props, ...deferAttrs(t.attrs, cat) } : props
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
 * Chạy trước mọi mã tuỳ chỉnh, ngay trong <head>:
 * 1. window.__csConsentRead(): đọc cookie cs_consent (cùng định dạng, phiên bản và hạn với lib/consent/shared.ts), trả {a, m}
 *    hoặc null khi chưa chọn. Bộ nạp dùng để biết nhóm nào được chạy.
 * 2. Chế độ đồng ý của Google (Consent Mode v2): mặc định theo cookie, cập nhật khi khách lưu lựa chọn (sự kiện cs-consent).
 *    Chưa đồng ý cá nhân hóa và quảng cáo: tắt Google Signals và cá nhân hóa quảng cáo.
 * 3. Tắt ghi số liệu ở khu quản trị (và mọi trang của bản preview / máy chạy thử): cờ ga-disable-<mã> và __cdpOptOut.
 *    Layout gốc không đọc đường dẫn ở máy chủ (để trang tĩnh), nên kiểm tra ngay trên trình duyệt.
 */
function TrackingGuard({ codes }: { codes: string[] }) {
  const ids = [...new Set(codes.flatMap((c) => c.match(GA4_ID) ?? []))]
  const off = SITE_CODE_TRACKING ? '' : 'true||'
  const read = `window.__csConsentRead=function(){try{var m=document.cookie.match(/(?:^|;\\s*)cs_consent=([^;]*)/);if(!m)return null;var c=JSON.parse(decodeURIComponent(m[1]));if(c.pv!==${JSON.stringify(
    POLICY_VERSION
  )}||typeof c.ts!=='number'||Date.now()-c.ts>${CONSENT_MAX_AGE_DAYS}*864e5)return null;return{a:c.a===1,m:c.m===1};}catch(e){return null}};`
  const gcm = ids.length
    ? `window.dataLayer=window.dataLayer||[];function g(){dataLayer.push(arguments)}function st(c){var a=c&&c.a?'granted':'denied',m=c&&c.m?'granted':'denied';return{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m}}
var c0=window.__csConsentRead();g('consent','default',st(c0));if(!(c0&&c0.m)){g('set','allow_google_signals',false);g('set','allow_ad_personalization_signals',false);}
addEventListener('cs-consent',function(){g('consent','update',st(window.__csConsentRead()))});`
    : ''
  const js = `(function(){try{${read}${gcm}if(${off}location.pathname.indexOf('/admin-cls')===0){window.__cdpOptOut=true;${ids
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
      {all.flatMap((s) => {
        const cat = snippetCategory(s.code)
        return parseHeadCode(s.code).tags.map((t, i) => renderTag(t, s.id, `${s.id}-${i}`, cat))
      })}
    </>
  )
}

/** Các mã "Đầu thân trang" hoặc "Cuối trang": HTML nguyên văn, mỗi mã trong một khung riêng. */
export function BodyCode({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((s) =>
        s.code.trim() ? (
          <div key={s.id} data-cs-code={s.id} dangerouslySetInnerHTML={{ __html: deferScriptsInHtml(s.code, snippetCategory(s.code)) }} suppressHydrationWarning />
        ) : null
      )}
    </>
  )
}

// Chạy lại các script đánh dấu data-cs-defer, đúng thứ tự: script ngoài không async/defer thì đợi tải xong mới sang thẻ kế
// (giữ đúng ngữ nghĩa như khi nằm thẳng trong HTML); script mới chèn ngay sau thẻ giữ chỗ, giữ mọi thuộc tính (data-write-key,
// data-cs-code...). document.currentScript vẫn đúng với script chèn bằng JS nên cdp.js đọc được data-write-key.
// Chỉ chạy thẻ thuộc nhóm khách đã đồng ý (data-cs-cat); thẻ đã chạy gắn data-cs-done. Khách lưu lựa chọn (sự kiện cs-consent)
// thì chạy ngay các nhóm vừa được đồng ý, không chờ.
const LOADER = `(function(){var started=false,running=false,again=false,EV=['pointerdown','keydown','touchstart','scroll','wheel','mousemove'];
function ok(cat){if(cat==='necessary')return true;var c=window.__csConsentRead&&window.__csConsentRead();return !!c&&(cat==='marketing'?c.m:c.a);}
function run(){if(running){again=true;return;}running=true;
var all=document.querySelectorAll('script[data-cs-defer]:not([data-cs-done])'),list=[],i=0;
for(var q=0;q<all.length;q++)if(ok(all[q].getAttribute('data-cs-cat')||'analytics'))list.push(all[q]);
function done(){running=false;if(again){again=false;run();}}
function next(){while(i<list.length){var old=list[i++],s=document.createElement('script'),a=old.attributes;old.setAttribute('data-cs-done','');
for(var k=0;k<a.length;k++){var n=a[k].name;if(n!=='type'&&n.indexOf('data-cs-')!==0)s.setAttribute(n,a[k].value);}
var code=old.getAttribute('data-cs-code');if(code)s.setAttribute('data-cs-code',code);
var t=old.getAttribute('data-cs-type');if(t)s.type=t;var src=old.getAttribute('src');
if(src){var wait=!old.hasAttribute('data-cs-async')&&!old.hasAttribute('async')&&!old.hasAttribute('defer');s.async=!wait;
if(wait){s.onload=s.onerror=next;old.parentNode.insertBefore(s,old.nextSibling);return;}
old.parentNode.insertBefore(s,old.nextSibling);}else{s.text=old.text;old.parentNode.insertBefore(s,old.nextSibling);}}done();}
next();}
function start(){if(started)return;started=true;for(var j=0;j<EV.length;j++)removeEventListener(EV[j],start,true);run();}
for(var j=0;j<EV.length;j++)addEventListener(EV[j],start,{capture:true,passive:true,once:true});
addEventListener('cs-consent',function(){started=true;run();});
function arm(){setTimeout(start,8000);}
if(document.readyState==='complete')arm();else addEventListener('load',arm);})();`

/** Đặt cuối <body>, sau mọi mã tuỳ chỉnh. */
export function DeferredCodeLoader() {
  return <script data-cs-loader="" dangerouslySetInnerHTML={{ __html: LOADER }} />
}
