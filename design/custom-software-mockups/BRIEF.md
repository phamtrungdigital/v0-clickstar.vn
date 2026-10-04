# Brief v3: ảnh giao diện CHÂN THẬT cho mục "Dự án đã thực hiện" (clickstar.vn)

## Vì sao làm lại lần 3
- v1 (ảnh chụp app thật của khách, đã che tên): bị loại vì nhìn ra hệ thống của khách.
- v2 (mockup tự thiết kế): bị loại vì **"giống màu sắc của AI, giống AI gen"**. Lỗi của v2:
  mỗi bản một màu nhấn rực (tím, xanh chanh, hổ phách trên nền tối, xanh mòng két), chip/pill tô màu khắp nơi,
  ô icon nền màu, gradient, hoạ tiết hình học trang trí, bo góc 14–16px mọi thứ, bóng đổ mềm,
  số KPI khổng lồ kèm chip "+6,4%" ở mọi thẻ, dải chữ thuyết minh tính năng đặt ngay trong UI
  ("Nhân viên chỉ thấy việc được giao… áp ở cơ sở dữ liệu"), bố cục ô lưới quá cân đối.
- Yêu cầu của chủ dự án: **"chân thật, không giống màu sắc của AI, chuyên nghiệp như UI của người nhiều năm kinh nghiệm"**.


## Mục tiêu
Nhìn như **ảnh chụp màn hình phần mềm đang chạy thật**, do một đội sản phẩm lâu năm làm (tham chiếu tinh thần:
Linear, Stripe Dashboard, Notion, GitHub, Intercom, HubSpot, Jira). Người xem không nghĩ "ảnh minh hoạ", mà nghĩ
"đây là hệ thống họ đã làm".

## Quy tắc thị giác (bắt buộc)
1. **Màu**: trung tính chiếm ≥ 90% diện tích (trắng, xám rất nhạt `#F7F7F8`/`#FAFAFA`, viền `#E4E4E7`/`#E5E7EB`,
   chữ `#18181B`/`#1F2328`, chữ phụ `#6B7280`/`#71717A`). Mỗi sản phẩm **một** màu thương hiệu trầm, chỉ dùng cho:
   nút chính, mục điều hướng đang chọn (vạch/chữ), link, ô chọn/radio đang bật, 1 đường dữ liệu chính trên biểu đồ.
   Màu trạng thái trầm và nhỏ: xanh `#1A7F37`, vàng `#9A6700`, đỏ `#CF222E`, xám; thể hiện bằng chữ màu, chấm 6–8px,
   hoặc nhãn viền mảnh/nền rất nhạt; KHÔNG rải chip tô màu khắp nơi.
2. **Cấm**: gradient, glow, blur/glassmorphism, text-shadow, hoạ tiết/hình khối trang trí, ô icon nền màu, emoji,
   minh hoạ, ảnh nền, màu neon/bão hoà cao trên diện tích lớn, giao diện nền tối (trừ khung camera của máy quét).
3. **Font**: font hệ thống `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
   (render ra SF Pro). Số `font-variant-numeric: tabular-nums`. Mono: `ui-monospace, "SF Mono", Menlo, monospace`,
   chỉ cho mã/ID/hash. Không Google Fonts.
4. **Cỡ chữ (desktop 1280×800)**: nội dung/bảng 13.5–14px, nhãn phụ 12–12.5px, tiêu đề trang 18–20px,
   số KPI 22–26px (không khổng lồ). Đậm vừa phải (600 cho tiêu đề, 500 cho nhãn).
5. **Hình khối**: bo góc 6px (nút, ô nhập), 8px (thẻ/khung) tối đa; viền 1px; bóng đổ không có hoặc rất nhẹ
   (`0 1px 2px rgba(0,0,0,.05)`); popover/menu mới có bóng vừa. Avatar tròn chữ cái, màu xám/màu trầm nhạt.
6. **Icon**: một bộ duy nhất, nét 1.5px, 16px, màu xám (inline SVG kiểu lucide/heroicons). Không icon tô màu.
7. **Bố cục như app thật**: thanh điều hướng (sidebar xám nhạt kiểu Notion/Linear với chữ thường, có workspace
   switcher, HOẶC top nav), breadcrumb, tiêu đề trang + hành động, thanh công cụ (tìm kiếm, bộ lọc, nút "Xuất",
   segmented control), bảng có header xám nhạt, cột canh phải cho số, sort icon, phân trang "1-25 trên 1.284".
   Mật độ thông tin vừa phải như app thật; dòng cuối bị mép màn hình cắt ngang là bình thường (ảnh chụp thật).
   KHÔNG dùng sidebar trắng có nhãn nhóm VIẾT HOA + mục chọn tô xanh dương (giống v1).
8. **Nội dung chân thật**: số lẻ, không tròn trịa; vài ô trống "—"; chữ dài bị cắt bằng "…" (text-overflow: ellipsis);
   thời gian tương đối ("2 phút trước", "Hôm qua 21:02"); vi mô chữ (microcopy) của sản phẩm thật, ngắn, đúng nghiệp vụ.
   **KHÔNG** viết câu giải thích tính năng cho người xem website trong UI. Tính năng phải lộ ra qua chính UI:
   ví dụ phân quyền = menu vai trò / nhãn "Chỉ xem" cạnh tên người dùng / tab "Phân quyền"; nhật ký thao tác = tab
   "Lịch sử" có dòng log; việc định kỳ = icon lặp nhỏ + "Hằng tuần" trong cột lịch; đồng bộ Meta = dòng trạng thái nhỏ
   "Meta Ads · đồng bộ lần cuối 06:00" ở thanh trên/chân trang.
9. **Biểu đồ**: tối giản kiểu Stripe: nét 1.5–2px, lưới mảnh, 1 màu chính + xám, không tô vùng đậm, không bo góc cột
   lớn, nhãn trục nhỏ xám.

## Kỹ thuật
- Tệp HTML tự chứa (CSS trong `<style>`, icon inline SVG), không tải tài nguyên ngoài.
- Desktop: `html,body{margin:0}`, khung app đúng 1280×800, `overflow:hidden`. Render:
  `node render.cjs <file.html> <out.png>` (mặc định 1280×800 @2x).
- Điện thoại: ảnh chụp màn hình phẳng (KHÔNG vẽ thân máy/viền đen/lỗ camera/dynamic island), khung màn 390×844 css px,
  bo góc 28px (được phép, gắn thuộc tính `data-device` cho phần tử khung để script bỏ qua kiểm bo góc), viền 1px `#D4D4D8`,
  thanh trạng thái điện thoại tối giản (giờ bên trái; sóng/wifi/pin bên phải, đơn sắc). Nền ngoài khung trong suốt.
  Render: `node render.cjs event-checkin.html event-registration.png --selector=#registration --transparent`.
- Script in ra: chữ cấm, font, **dấu hiệu AI** (gradient, bo góc > 12px, bóng nặng, blur, text-shadow, nền màu bão hoà
  cao), tràn ngang, chữ bị cắt cứng, lỗi JS. Mục "dấu hiệu AI" phải là "KHÔNG CÓ" (trừ khung camera máy quét được nền tối).
- Sau mỗi lần render: MỞ PNG bằng Read, tự soát như art director khó tính, sửa, lặp ít nhất 2 vòng.

## Quy tắc chữ và dữ liệu
- Tiếng Việt chuẩn dấu, không emoji, không dấu gạch dài "—" (dùng "·", ":" hoặc "-").
- Tên người hư cấu: Lan Anh, Hoàng Nam, Thu Trang, Đức Anh, Mai Phương, Gia Huy, Bảo Châu, Khánh Linh, Tuấn Kiệt,
  Ngọc Hân, Thanh Tùng, Phương Thảo, Minh Châu, Quỳnh Như.
- Không thương hiệu thật (trừ nền tảng Meta, Google, Zalo, Gmail). Tên miền chỉ `example.com`. Không địa danh thật:
  chi nhánh "Chi nhánh Trung tâm / Bắc / Nam / Đông / Tây / Ven Hồ".
- Ngành giáo dục nhưng dùng: học viên, khoá học, đăng ký học, buổi học thử, tư vấn viên (không dùng từ vựng tuyển sinh phổ thông).
- SĐT/email/IP che bớt: `09xx xxx 321`, `k***@gmail.com`, `113.161.xx.xx`. Ngày quanh 09–10/2026, hôm nay là Chủ nhật 04/10/2026
  (có thể đặt màn hình ở thứ năm 08/10/2026 nếu hợp lý, nhưng thứ trong tuần phải đúng lịch 2026).
- Số liệu khớp nhau (tổng, %, đơn giá).

## Giới hạn
Chỉ tạo/sửa file trong thư mục này. Không cài package.
