/**
 * Giao diện Apple cho khu quản trị (/admin-cls), áp lên mọi màn bằng một lớp dùng chung.
 *
 * - Biến --ad-*: bảng màu, bóng, nền kính. Khung (admin-shell) và các màn mới dùng trực tiếp biến này.
 * - Phần "đồng bộ": ánh xạ các lớp Tailwind đang dùng rải rác ở 95 file (nền, viền, chữ xám, bo góc, cỡ chữ, ô nhập, bảng)
 *   sang cùng một bộ giá trị, để mọi màn đổi theo mà chưa cần sửa từng file. Các đợt sau sẽ chuyển từng màn sang thành phần
 *   dùng chung rồi bỏ dần các ánh xạ không còn cần.
 * - CSS đặt trong thẻ <style> của component (không để trong globals.css) vì cache CSS của Turbopack từng làm quy tắc mới không lên.
 *   Quy tắc không nằm trong @layer nên thắng các lớp tiện ích của Tailwind.
 *
 * Chỉ áp dụng trong .admin-scope: website công khai không bị ảnh hưởng. Hiện chỉ có giao diện sáng.
 */
const CSS = String.raw`
.admin-scope{
  --ad-bg:#f5f5f7; --ad-surface:#ffffff; --ad-surface-2:#fbfbfd;
  --ad-fg:#1d1d1f; --ad-fg-2:#515154; --ad-fg-3:#6e6e73;
  --ad-line:rgba(0,0,0,.08); --ad-line-2:rgba(0,0,0,.14);
  --ad-fill-soft:rgba(0,0,0,.03); --ad-fill:rgba(0,0,0,.05); --ad-fill-2:rgba(0,0,0,.09);
  --ad-accent:#1e6dda; --ad-accent-d:#1859b8; --ad-accent-soft:rgba(30,109,218,.10);
  --ad-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px -12px rgba(0,0,0,.10);
  --ad-glass:rgba(255,255,255,.72);

  /* nối vào biến theme có sẵn (các thành phần shadcn dùng chúng) */
  --background:var(--ad-bg); --foreground:var(--ad-fg);
  --card:var(--ad-surface); --card-foreground:var(--ad-fg);
  --popover:var(--ad-surface); --popover-foreground:var(--ad-fg);
  --muted:var(--ad-fill); --muted-foreground:var(--ad-fg-3);
  --secondary:var(--ad-accent-soft); --secondary-foreground:var(--ad-fg);
  --primary:var(--ad-accent); --primary-dark:var(--ad-accent-d);
  --accent:var(--ad-fill); --accent-foreground:var(--ad-fg);
  --border:var(--ad-line); --input:var(--ad-line-2); --ring:var(--ad-accent);
  --radius:14px;

  font-family:var(--font-inter),Inter,-apple-system,"SF Pro Text",system-ui,sans-serif;
  letter-spacing:-.011em;
  -webkit-font-smoothing:antialiased;
  accent-color:var(--ad-accent);
}
.admin-scope ::selection{background:var(--ad-accent-soft)}

/* Kính mờ cho thanh trên và thanh lưu cố định */
.admin-scope .ad-glass,
.admin-scope .sticky.top-11{
  background:var(--ad-glass);
  -webkit-backdrop-filter:saturate(180%) blur(22px);
  backdrop-filter:saturate(180%) blur(22px);
}
/* Thanh lưu dính ở đầu trang sửa: nằm ngay dưới thanh trên cao 52px */
.admin-scope .sticky.top-11{top:52px}
.admin-scope .sticky h1{font-size:19px}

/* Chữ: cỡ nhỏ nâng lên cho dễ đọc, không dùng chữ hoa kéo giãn cho nhãn mục */
.admin-scope .text-\[10px\]{font-size:11.5px}
.admin-scope .text-\[11px\]{font-size:12.5px}
.admin-scope .text-xs{font-size:13px;line-height:1.45}
.admin-scope .text-\[13px\]{font-size:14px}
.admin-scope .text-sm{font-size:14.5px;line-height:1.5}
.admin-scope .text-base{font-size:15.5px}
.admin-scope .text-lg{font-size:18px}
.admin-scope .text-2xl{font-size:26px}
.admin-scope .uppercase{text-transform:none}
.admin-scope .tracking-wide,.admin-scope .tracking-wider,.admin-scope .tracking-widest{letter-spacing:0}
.admin-scope h1:not([class*="text-["]){font-size:26px;line-height:1.2;font-weight:600;letter-spacing:-.022em;color:var(--ad-fg)}

/* Màu chữ */
.admin-scope .text-slate-900,.admin-scope .text-slate-800{color:var(--ad-fg)}
.admin-scope .text-slate-700,.admin-scope .text-slate-600,.admin-scope .hover\:text-slate-700:hover{color:var(--ad-fg-2)}
.admin-scope .text-slate-500{color:var(--ad-fg-3)}
.admin-scope .text-slate-400{color:#86868b}
.admin-scope .text-slate-300{color:#a1a1a6}

/* Nền */
.admin-scope .bg-white{background-color:var(--ad-surface)}
.admin-scope .bg-slate-50,.admin-scope .hover\:bg-slate-50:hover{background-color:var(--ad-fill-soft)}
.admin-scope .bg-slate-100,.admin-scope .hover\:bg-slate-100:hover{background-color:var(--ad-fill)}
.admin-scope .bg-slate-200,.admin-scope .hover\:bg-slate-200:hover{background-color:var(--ad-fill-2)}

/* Viền */
.admin-scope .border-slate-100,.admin-scope .border-slate-200{border-color:var(--ad-line)}
.admin-scope .border-slate-300,.admin-scope .hover\:border-slate-300:hover{border-color:var(--ad-line-2)}
.admin-scope .divide-slate-100>:not(:last-child),.admin-scope .divide-slate-200>:not(:last-child){border-color:var(--ad-line)}
.admin-scope hr{border-color:var(--ad-line)}

/* Một màu nhấn: màu cam cũ chuyển sang xanh thương hiệu */
.admin-scope .bg-orange-500{background-color:var(--ad-accent)}
.admin-scope .hover\:bg-orange-600:hover{background-color:var(--ad-accent-d)}
.admin-scope .bg-orange-50,.admin-scope .bg-orange-100,.admin-scope .hover\:bg-orange-100:hover{background-color:var(--ad-accent-soft)}
.admin-scope .text-orange-400,.admin-scope .text-orange-600,.admin-scope .text-orange-700{color:var(--ad-accent)}
.admin-scope .focus\:border-orange-500:focus{border-color:var(--ad-accent)}
.admin-scope .focus\:ring-orange-500\/30:focus,.admin-scope .focus-visible\:ring-orange-500\/40:focus-visible,.admin-scope .focus-visible\:ring-orange-500\/50:focus-visible{--tw-ring-color:var(--ad-accent-soft)}
.admin-scope .border-orange-300,.admin-scope .border-orange-400\/35{border-color:var(--ad-line-2)}
.admin-scope .ring-orange-100{--tw-ring-color:var(--ad-accent-soft)}
.admin-scope .accent-orange-500{accent-color:var(--ad-accent)}
.admin-scope .to-orange-500,.admin-scope .hover\:to-orange-600:hover{--tw-gradient-to:var(--ad-accent)}
.admin-scope .to-orange-50{--tw-gradient-to:var(--ad-accent-soft)}

/* Màu tím của nút AI (module AI đang tắt) cũng về một màu nhấn */
.admin-scope .bg-violet-500,.admin-scope .bg-violet-600{background-color:var(--ad-accent)}
.admin-scope .hover\:bg-violet-600:hover,.admin-scope .hover\:bg-violet-700:hover{background-color:var(--ad-accent-d)}
.admin-scope .bg-violet-50,.admin-scope .bg-violet-100,.admin-scope .hover\:bg-violet-100:hover{background-color:var(--ad-accent-soft)}
.admin-scope .text-violet-500,.admin-scope .text-violet-600,.admin-scope .text-violet-700{color:var(--ad-accent)}
.admin-scope .border-violet-200,.admin-scope .border-violet-300{border-color:var(--ad-line-2)}

/* Nút chính dạng viên thuốc */
.admin-scope button.bg-primary,.admin-scope a.bg-primary{border-radius:999px;font-weight:500}

/* Bo góc thống nhất */
.admin-scope .rounded{border-radius:8px}
.admin-scope .rounded-md{border-radius:10px}
.admin-scope .rounded-lg{border-radius:14px}
.admin-scope .rounded-xl{border-radius:16px}
.admin-scope .rounded-2xl{border-radius:20px}

/* Khối trắng có viền: thêm bóng nhẹ như thẻ của Apple */
.admin-scope .bg-white.rounded-lg.border,
.admin-scope .bg-white.rounded-xl.border{box-shadow:var(--ad-shadow)}
.admin-scope .shadow-sm{box-shadow:var(--ad-shadow)}
.admin-scope .shadow-md,.admin-scope .shadow-lg{box-shadow:0 8px 28px -10px rgba(0,0,0,.18)}
.admin-scope .shadow-xl,.admin-scope .shadow-2xl{box-shadow:0 16px 48px -12px rgba(0,0,0,.24)}

/* Ô nhập: bo 10px, viền mảnh, vòng sáng xanh khi chọn */
.admin-scope input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="color"]):not([type="hidden"]),
.admin-scope select,
.admin-scope textarea{border-radius:10px;border-color:var(--ad-line-2)}
.admin-scope input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="color"]):not([type="hidden"]):focus,
.admin-scope select:focus,
.admin-scope textarea:focus{outline:none;border-color:var(--ad-accent);box-shadow:0 0 0 4px var(--ad-accent-soft)}
.admin-scope input::placeholder,.admin-scope textarea::placeholder{color:#86868b}
.admin-scope :focus-visible{outline:2px solid var(--ad-accent);outline-offset:2px}

/* Bảng: tiêu đề cột chữ thường xám, hàng thoáng, di chuột sáng nhẹ */
.admin-scope table{border-collapse:collapse}
.admin-scope th{text-transform:none;letter-spacing:0;font-weight:500;font-size:12.5px;color:var(--ad-fg-3)}
.admin-scope tbody tr:hover{background-color:var(--ad-fill-soft)}

/* Chuyển động nhẹ */
.admin-scope button,.admin-scope a{transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease}
.admin-scope button:disabled{cursor:not-allowed}

/* Thanh cuộn mảnh */
.admin-scope ::-webkit-scrollbar{width:10px;height:10px}
.admin-scope ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:10px;border:3px solid transparent;background-clip:content-box}
.admin-scope ::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.35);background-clip:content-box}
.admin-scope ::-webkit-scrollbar-track{background:transparent}
`

export function AdminTheme() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />
}
