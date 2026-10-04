# Mockup minh hoạ: mục "Dự án đã thực hiện" (/services/custom-software#du-an)

Thư mục này KHÔNG được build hay deploy. Đây là bản nguồn HTML của các hình minh hoạ, giữ lại để sửa về sau.

- Ảnh đang dùng trên website: `public/images/custom-software/v2/*.webp`
- Nội dung chữ của từng dự án: `app/services/custom-software/_data/content.ts` (`WORK`)
- Quy tắc thiết kế và dữ liệu mẫu: `BRIEF.md`

## Vì sao là mockup tự vẽ

Lần đầu em dùng ảnh chụp giao diện thật của hệ thống làm cho khách (đã che tên). Anh Trung loại bộ ảnh đó ngày 4/10/2026 vì nhìn vẫn nhận ra hệ thống của khách. Từ đó ảnh dự án ẩn tên phải là mockup tự thiết kế: ngôn ngữ hình ảnh riêng, dữ liệu mẫu trung tính, không địa danh thật, không dùng từ vựng đặc trưng của khách.

## Sửa và xuất lại ảnh

1. Sửa file `.html` tương ứng. Tệp tự chứa, chỉ cần Google Fonts.
2. Render @2x bằng Playwright:
   ```bash
   node render.cjs ads-command-center.html ads-command-center.png
   node render.cjs event-checkin.html event-registration.png --selector=#registration --transparent
   node render.cjs event-checkin.html event-checkin.png --selector=#scanner --transparent
   ```
   `render.cjs` lấy Playwright từ `../admin-clickstar/node_modules` (đường dẫn tuyệt đối ở đầu file, đổi nếu máy khác). Script in ra cảnh báo chữ cấm, tràn khung và font chưa nạp.
3. Chuyển sang webp: ảnh desktop 2400×1500, quality 88. Ảnh điện thoại giữ nền trong suốt. Nếu kích thước ảnh điện thoại đổi thì cập nhật `width/height` trong `content.ts`.
