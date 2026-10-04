# Brief: ảnh giao diện cho mục "Dự án đã thực hiện" (clickstar.vn/services/custom-software)

Mục tiêu: ảnh nhìn như **ảnh chụp màn hình phần mềm đang chạy thật**, do một đội sản phẩm lâu năm làm, có **màu
thương hiệu và sức sống** nhưng không có dấu hiệu "AI gen". Chủ dự án duyệt qua 4 vòng (4/10/2026): ảnh chụp app khách
(loại: lộ khách) → mockup nhiều màu neon (loại: "màu AI") → UI trung tính (loại: "âm bản, xấu") → **v4 đang dùng**.

## Màu
- Vùng nội dung trung tính (trắng, xám rất nhạt, viền 1px `#E4E4E7`, chữ `#18181B`/`#1F2328`, chữ phụ `#6B7280`).
- **Mỗi sản phẩm một thương hiệu**, thể hiện như app thật có cá tính (Slack, HubSpot, Asana, Zendesk):
  - Khung điều hướng mang màu thương hiệu: sidebar nền đậm hoặc thanh trên cùng, chữ trắng, mục đang chọn nền trắng
    10-14% + vạch màu nhấn. Logo sản phẩm là khối màu.
  - Màu nhấn cho nút chính, link, tab/ô chọn đang bật, công tắc, thanh tiến độ, đường dữ liệu chính.
  - Nhãn/trạng thái kiểu GitHub/Linear: nền tint rất nhạt + chữ đậm cùng tông, dùng có chủ đích. Cùng một ý nghĩa thì
    cùng một màu; màu thương hiệu không gánh nghĩa "nguy hiểm".
  - Biểu đồ 2-3 màu hài hoà; avatar chữ cái màu dịu.
- Bộ màu hiện tại:

  | Sản phẩm | Khung | Nhấn |
  | --- | --- | --- |
  | Điều hành quảng cáo | navy `#1B2A4E` | cam |
  | Dữ liệu khách hàng | thanh trên teal `#0F766E` | teal |
  | Việc nhóm | than `#1F2023` | san hô |
  | Đồng ý cookie | xanh rừng `#12372A` | xanh `#1F9D55` |
  | Trợ lý tư vấn | aubergine | tím mận |
  | Check-in sự kiện | — | xanh lơ đậm `#0E7490` |

- Tỷ lệ màu: thương hiệu khoảng 15-25% diện tích (gồm khung), trạng thái/nhãn khoảng 5-10%.

## Cấm (dấu hiệu AI)
Gradient, glow, blur/glass, text-shadow, hoạ tiết trang trí, emoji, màu neon trên diện tích lớn, nền tối toàn màn
(trừ khung camera và khung điều hướng thương hiệu), bo góc > 12px (trừ khung điện thoại), bóng đổ mềm to, KPI khổng lồ,
câu thuyết minh tính năng trong UI, viền nét đứt cho nút lọc, avatar pastel cầu vồng, thân điện thoại vẽ vector.
Không dùng xanh dương sáng kiểu `#3687FC`/`#1E5FCB`/`#0B66C3` làm màu chính.

## Bố cục và nội dung
- Như app thật: điều hướng, breadcrumb, thanh công cụ (tìm kiếm, lọc, xuất), bảng có header nhạt, số canh phải,
  sort, phân trang, chữ dài cắt "…", ô trống "—", thời gian tương đối. Dòng cuối bị mép màn hình cắt là bình thường.
- Tính năng lộ qua chính UI (menu vai trò, tab "Lịch sử thao tác", dòng "đồng bộ lần cuối 06:00"…), không chú thích.
- Font hệ thống `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  (render ra SF Pro), mono `ui-monospace, "SF Mono", Menlo, monospace` cho mã/ID, số tabular-nums.
  Cỡ chữ ở 1280×800: nội dung 13.5-14px, tiêu đề trang 18-20px, KPI 22-26px. Bo 6-8px.
- Tiếng Việt chuẩn, không "—", không emoji. Tên người hư cấu, không thương hiệu thật (trừ Meta, Google, Zalo, Gmail),
  tên miền `example.com`, không địa danh thật (chi nhánh Trung tâm/Bắc/Nam/Đông/Tây/Ven Hồ). SĐT/IP che bớt.
  Số liệu khớp nhau, thứ trong tuần đúng lịch 2026.
- Điện thoại: ảnh chụp màn hình phẳng 390×844, bo 28px, viền 1px, thanh trạng thái tối giản, nền ngoài trong suốt.

## Kỹ thuật
Tệp HTML tự chứa. Render bằng `render.cjs` (xem README): desktop 1280×800 @2x, script quét chữ cấm và dấu hiệu AI
(gradient, bo góc > 12px, bóng nặng, blur, text-shadow, mảng màu neon lớn), tràn khung, chữ bị cắt.
