# Brief: hình minh hoạ cho mục "Dự án đã thực hiện" (clickstar.vn/services/custom-software)

## Bối cảnh
Click Star (công ty phần mềm và digital) giới thiệu 6 hệ thống đã làm cho khách, **ẩn tên khách**.
Bộ ảnh cũ chụp từ giao diện thật của khách. Chủ dự án từ chối vì nhìn **giống hệ thống của khách**
(người trong nghề nhận ra). Cần một bộ **mockup HTML hoàn toàn mới**, tự thiết kế, đẹp hơn, chung một
ngôn ngữ hình ảnh, không dựa trên bố cục hay ảnh nào cũ.

Đặc điểm của bộ ảnh cũ cần TRÁNH: sidebar trắng bên trái với nhãn nhóm VIẾT HOA (TỔNG QUAN, HIỆU SUẤT…), màu xanh dương
#3687FC / #1E5FCB / #0B66C3 làm màu chính, font Inter, hàng thẻ KPI ngang đầu trang + biểu đồ cột + bảng ở dưới,
khung iPhone có "dynamic island".

## Cách ảnh được dùng
Ảnh desktop 2880×1800 (render 1440×900 @2x) hiển thị trên website ở bề ngang ~860px (thu nhỏ ~60%),
bấm vào mới xem lớn. Vì vậy: **chữ to và thoáng hơn app thật**, ít chi tiết vụn, bố cục có điểm nhấn rõ.
Ảnh điện thoại hiển thị cao ~480px, hai máy đặt cạnh nhau trên nền xám nhạt.

## Hệ thiết kế chung ("Click Star demo kit")
- Font: **Be Vietnam Pro** 400/500/600/700 qua Google Fonts
  `<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`.
  Số dùng `font-variant-numeric: tabular-nums`. Mã/ID/giờ dùng JetBrains Mono.
- Cỡ chữ (desktop 1440 px): nội dung ≥ 15px, nhãn phụ ≥ 12.5px, tiêu đề màn 24–28px, số KPI 32–44px.
- Khung app KHÔNG dùng sidebar trắng nhãn viết hoa. Dùng một trong: thanh icon hẹp 64–72px (nền tối hoặc màu nhấn)
  + thanh trên cùng (tên sản phẩm, breadcrumb, ô tìm kiếm, avatar); hoặc thanh tab điều hướng ngang ở trên.
- Nền: sáng `#F4F4F1` (xám ấm) hoặc tối `#0E1116`; bề mặt thẻ `#FFFFFF` (tối: `#161A21`); chữ `#14171C`;
  chữ phụ `#6B7280`; viền `#E7E6E1`. Bo góc thẻ 14–16px, nút/ô 10px. Bóng rất nhẹ.
- Mỗi sản phẩm một màu nhấn riêng (xem từng mục). KHÔNG dùng xanh dương làm màu chính.
- Biểu đồ: SVG inline tự vẽ, mượt, có trục/nhãn tối giản, số khớp nhau. Không cần thư viện biểu đồ.
- Icon: SVG inline nét mảnh (kiểu lucide, stroke 1.75), tự viết path; hoặc lucide UMD từ unpkg (ghim phiên bản
  chạy được và gọi `lucide.createIcons()`). Không emoji.
- Avatar: vòng tròn chữ cái đầu, nhiều màu dịu. Không ảnh người.
- Logo sản phẩm: một hình khối hình học đơn giản (vuông bo, tròn, lục giác…) + tên sản phẩm tiếng Việt (ghi ở từng mục).
- Tệp HTML **tự chứa** (CSS trong `<style>`), không phụ thuộc file khác ngoài Google Fonts / unpkg.
- `html,body{margin:0}`; màn desktop dựng đúng khung 1440×900 (`width:1440px;height:900px;overflow:hidden`),
  phần nhìn thấy phải bố cục trọn vẹn (không lửng lơ một thẻ bị cắt nửa ở mép dưới; nếu có danh sách dài thì cắt
  bằng mép thẻ có fade hoặc để dòng cuối trọn).

## Nội dung và chữ
- Tiếng Việt có dấu chuẩn, văn phong gọn, rõ. **Không** emoji, **không** dấu gạch dài "—" (dùng "·", ":" hoặc "-"),
  không từ sáo rỗng ("tối ưu toàn diện", "nâng tầm", "đột phá").
- Dữ liệu mẫu hợp lý và **khớp nhau** (tổng = cộng các phần, % đúng, ngày tháng hợp lệ quanh 09–10/2026,
  tiền VND dạng "12,4 tr", "1,26 tỷ", số thập phân dấu phẩy).
- Tên người hư cấu (chọn trong): Lan Anh, Hoàng Nam, Thu Trang, Đức Anh, Mai Phương, Gia Huy, Bảo Châu,
  Khánh Linh, Tuấn Kiệt, Ngọc Hân, Thanh Tùng, Phương Thảo, Minh Châu, Quỳnh Như.
  Phạm Trung, Thu Hà, Quốc Bảo, Bảo Ngọc, Đức Huy.
- KHÔNG tên thương hiệu thật (trừ nền tảng: Meta, Google, Zalo, Gmail). Tên miền chỉ dùng `example.com`.
- KHÔNG địa danh thật. Chi nhánh đặt tên trung tính: "Chi nhánh Trung tâm", "Chi nhánh Bắc", "Chi nhánh Nam",
  "Chi nhánh Đông", "Chi nhánh Tây", "Chi nhánh Ven Hồ".
- Ngành giáo dục nhưng KHÔNG dùng từ vựng tuyển sinh phổ thông (tuyển sinh, phụ huynh, học sinh, nhập học, khối lớp).
  Dùng: học viên, khoá học, đăng ký học, buổi học thử, tư vấn viên.
- Số điện thoại/email trên màn hình phải che bớt: `09xx xxx 321`, `k***@gmail.com`; IP che `113.161.xx.xx`.

## Công cụ render (bắt buộc dùng để tự kiểm)
`node render.cjs <file.html> <out.png> [--selector=#id] [--transparent]`
In ra: chữ cấm, font đã nạp chưa, tràn ngang, chữ bị cắt, lỗi JS. Sau khi render, **mở PNG bằng công cụ Read để nhìn**
và sửa đến khi đẹp. Lặp ít nhất 2 vòng tự soát.

## Giới hạn làm việc
Chỉ tạo/sửa file trong thư mục này. Không cài package.
