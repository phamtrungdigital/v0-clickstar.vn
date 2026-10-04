# Mockup minh hoạ: mục "Dự án đã thực hiện" (/services/custom-software#du-an)

Thư mục này KHÔNG được build hay deploy. Đây là bản nguồn HTML của các hình minh hoạ, giữ lại để sửa về sau.

- Ảnh đang dùng trên website: `public/images/custom-software/v4/*.webp`
- Nội dung chữ của từng dự án: `app/services/custom-software/_data/content.ts` (`WORK`)
- Quy tắc thiết kế và dữ liệu mẫu: `BRIEF.md`

## Lịch sử (anh Trung duyệt 4/10/2026)

1. Ảnh chụp giao diện thật của hệ thống làm cho khách, đã che tên: bị loại vì nhìn vẫn ra hệ thống của khách.
2. Mockup tự vẽ v2: bị loại vì "giống màu sắc của AI". Lỗi của v2: mỗi bản một màu nhấn rực, nền tối, chip tô màu, hoạ tiết, bo góc lớn, câu thuyết minh tính năng nằm trong UI.
3. v3: UI chân thật nhưng toàn trung tính. Bị loại vì "âm bản nhìn xấu quá", cần một chút màu thương hiệu cho có sức sống.
4. **v4 (đang dùng)**: giữ bố cục và độ thật của v3, thêm màu thương hiệu kiểu app thật có cá tính:
   - khung điều hướng màu thương hiệu;
   - nút chính và mục đang chọn theo màu nhấn;
   - nhãn tint nhạt, biểu đồ 2-3 màu, avatar màu dịu.

   Vẫn không gradient, không neon, không câu thuyết minh. Chi tiết trong `BRIEF.md`.

## Sửa và xuất lại ảnh

1. Sửa file `.html` tương ứng. Tệp tự chứa, không tải tài nguyên ngoài, font hệ thống: render trên macOS ra SF Pro.
2. Render @2x bằng Playwright, desktop mặc định 1280×800:
   ```bash
   node render.cjs ads-command-center.html ads-command-center.png
   node render.cjs event-checkin.html event-registration.png --selector=#registration --transparent
   node render.cjs event-checkin.html event-checkin.png --selector=#scanner --transparent
   ```
   `render.cjs` lấy Playwright từ `../admin-clickstar/node_modules` (đường dẫn tuyệt đối ở đầu file, đổi nếu máy khác). Script in ra cảnh báo:
   - chữ cấm;
   - "dấu hiệu AI": gradient, bo góc > 12px, bóng nặng, blur, màu bão hoà;
   - tràn khung, chữ bị cắt.

   Từ cấm có tên khách nằm ở `forbidden.local.txt` (gitignore, vì repo public).
3. Chuyển sang webp:
   - Ảnh desktop: 2400×1500, quality 88.
   - Ảnh điện thoại: giữ nền trong suốt. Nếu kích thước đổi thì cập nhật `width/height` trong `content.ts`.
