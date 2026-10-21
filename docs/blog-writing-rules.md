# Quy định viết bài blog Click Star (SEO, chuyên sâu)

> Áp dụng cho MỌI bài viết đăng ở clickstar.vn/blog (VI và EN). Claude đọc file này trước khi viết bất kỳ bài nào.
> Cập nhật lần cuối: 21/10/2026, theo yêu cầu của anh Trung. Nếu có xung đột, rule trong file này thắng ghi chú cá nhân của Claude.
> Quyền đăng: anh đã cho phép đăng luôn bài viết (INSERT `public.posts` ở trạng thái `published`, xóa cache, kiểm production) mà không cần duyệt từng bài. Mọi thay đổi code, SQL schema, cấu hình vẫn theo QUY ĐỊNH 1 của file CLAUDE.md global (preview trước, anh OK rồi mới lên production).

## Bảy tiêu chí bắt buộc

1. Chuẩn SEO.
2. Đáp ứng các yếu tố của Google.
3. Giọng văn chuyên gia, nghiêm túc.
4. Chữ căn đều hai bên ở màn hình máy tính.
5. Bài viết chất lượng, mang lại giá trị cho người đọc.
6. Hình ảnh chất lượng, mô tả được giá trị của nội dung.
7. Phân tích chuyên sâu.

Phần dưới nói rõ từng tiêu chí biến thành việc cụ thể thế nào. Cuối file có checklist trước khi đăng.

---

## 1. Chuẩn SEO

**Một bài, một ý định tìm kiếm.** Chọn một câu hỏi hoặc chủ đề chính người dùng thật sự tìm. Trước khi viết, truy vấn `public.posts` xem đã có bài trùng chủ đề chưa. Nếu có, viết bài bổ sung góc khác và dẫn sang bài cũ bằng văn bản, không viết lặp.

**Các vị trí cần có từ khóa chính (tự nhiên, không nhồi):** tiêu đề bài, đoạn mở đầu, một đến hai tiêu đề H2, slug, `seo_title`, `seo_description`, chữ mô tả (alt) của ảnh.

**Trường dữ liệu trong bảng `posts`:**

| Trường | Quy tắc |
|---|---|
| `slug` | Tiếng Việt không dấu, chữ thường, nối bằng dấu gạch ngang, mô tả đúng chủ đề, ổn định về sau. Kiểm tra slug chưa tồn tại trước khi INSERT. |
| `title` (vi, en) | Là H1 của trang, đọc tự nhiên như một tiêu đề báo, nêu rõ chủ đề và lợi ích. Không viết kiểu "Name: explainer". |
| `excerpt` (vi, en) | 1 đến 2 câu, nêu bài trả lời câu hỏi gì và dựa trên nguồn nào. Hiển thị ở thẻ bài và khối tóm tắt. |
| `seo_title` (vi, en) | Từ khóa chính ở đầu, khoảng 34 đến 46 ký tự (hậu tố " \| Click Star" do site tự thêm). Không trùng `title`. |
| `seo_description` (vi, en) | Tối đa 160 ký tự, một đến hai câu hoàn chỉnh, có lợi ích hoặc con số, không cắt giữa câu. |
| `tags` | 2 thẻ, dùng lại thẻ đã có (ví dụ SEO, AI, Công nghệ, Kỹ năng, Tin tức, Dữ liệu, Pháp lý, Thiết kế). |
| `cover_image` | Đường dẫn tương đối `/images/blog/<slug>/cover.png`. |
| `og_image` | URL tuyệt đối `https://clickstar.vn/images/blog/<slug>/cover.png`. |
| `topic_pillar`, `topic_stage`, `topic_kind` | Phân loại cho trang Quản trị bài viết (từ 21/10/2026), điền ngay trong INSERT. `topic_pillar`: `ai`, `data`, `marketing`, `build`, `news`, `legal`. `topic_stage`: `learn`, `guide`, `decide`. `topic_kind`: `guide`, `opinion`, `news`, `policy`. Không cần thêm dòng vào `POST_META` nữa. |
| `content` (vi, en) | Markdown, xem cấu trúc bên dưới. |

**Cấu trúc thân bài (không viết H1 trong nội dung vì H1 là `title`):**

1. Đoạn mở đầu: nêu vấn đề, bài trả lời gì, dựa trên nguồn nào, đối chiếu đến ngày nào. Không mở bằng câu hỏi tu từ chung chung.
2. `## Điểm chính` (EN: `## Key points`): 3 đến 7 gạch đầu dòng, mỗi dòng là một kết luận đứng được một mình (để người đọc lướt và để máy trích dẫn).
3. Ảnh infographic đầu tiên ngay sau Điểm chính.
4. Các mục `##` theo logic phân tích (xem mục 7). Tiêu đề mục là chủ đề hoặc câu hỏi người dùng thật sự đặt ra. Dùng `###` khi mục có nhánh con. Câu đầu tiên của mỗi mục trả lời thẳng, rồi mới giải thích.
5. Khối nhận định riêng, mở đầu bằng chữ đậm **Đánh giá của Click Star.** (EN: **Click Star's view.**) để tách rõ nhận định khỏi số liệu.
6. Mục việc nên làm (checklist, lộ trình theo ngày hoặc theo bước) và mục `## Những sai lầm thường gặp` (EN: `## Common mistakes`).
7. Đoạn kết: chỉ dẫn cách đọc nguyên bản (tên tài liệu, tổ chức, không dán link) và lời nhắc kiểm tra bản mới nhất. Không viết thêm đoạn tóm tắt lặp lại.

**Liên kết nội bộ:** nhắc bài liên quan của Click Star bằng văn bản ("Click Star đã có bài riêng về..."). Khối dịch vụ liên quan và khối tác giả do site tự render. Không chèn link ra ngoài trong thân bài; nguồn nêu bằng tên trong câu.

**Hai ngôn ngữ:** luôn viết đủ cả bản EN, dịch tự nhiên, cùng cấu trúc và cùng số liệu. Site chỉ cho index bản EN khi nội dung EN từ 600 ký tự trở lên, nhưng bài của Click Star luôn có bản EN đầy đủ.

**Ngày tháng:** ghi "đối chiếu đến ngày dd/mm/yyyy" trong đoạn mở đầu. Số liệu nào có ngày công bố thì nêu ngày đó trong câu.

**Sau khi đăng:** sitemap tự cập nhật trong khoảng 1 giờ (hreflang vi/en nằm trong sitemap, không nằm trong thẻ head). Không cần đổi gì thêm.

---

## 2. Đáp ứng các yếu tố của Google

Nền tảng: tài liệu "AI features and your website" và hướng dẫn nội dung hữu ích của Google Search Central. Google nói rõ không cần tệp riêng hay schema đặc biệt cho AI, trang chỉ cần được lập chỉ mục và đủ điều kiện hiện đoạn trích. Vì vậy chất lượng nội dung là việc chính.

- **Nội dung hữu ích, viết cho người đọc trước:** mỗi bài giải quyết một vấn đề thật của chủ doanh nghiệp hoặc người làm marketing, công nghệ ở Việt Nam. Không viết để nhồi từ khóa, không sản xuất hàng loạt, không trang mỏng, không lặp bài cũ.
- **E-E-A-T (trải nghiệm, chuyên môn, uy tín, tin cậy):**
  - Chuyên môn và tin cậy: số liệu từ nguồn chính (tài liệu chính thức, báo cáo, nghiên cứu có phương pháp rõ), nêu tên nguồn và ngày ngay trong câu.
  - Trải nghiệm và chuyên môn của Click Star: phần "Đánh giá của Click Star" dựa trên cách làm thực tế (ví dụ quy trình thiết kế, mục tiêu PageSpeed đang công bố ở trang dịch vụ). Chỉ nêu điều trang dịch vụ hoặc dự án của Click Star đã công bố. Không bịa khách hàng, dự án, con số, kết quả.
  - Minh bạch: khối tác giả, ngày đăng, ngày cập nhật do site tự hiển thị.
- **Chủ đề ảnh hưởng đến tiền hoặc quyền lợi người đọc (pháp lý, tài chính, sức khỏe):** thận trọng hơn mức thường. Ưu tiên văn bản gốc và tài liệu chính thức; nếu chỉ có bài tóm tắt của báo hoặc hãng luật thì ghi rõ và nhắc "cần đối chiếu văn bản gốc"; nêu ngày hiệu lực; không tư vấn thay luật sư; không đưa chi tiết chỉ thấy ở một nguồn không rõ.
- **Dữ liệu có cấu trúc:** site tự sinh (Article, FAQPage, Organization). Không đánh dấu điều không hiển thị trên trang.
- **Hiệu năng:** ảnh nhẹ (mỗi ảnh dưới 1 MB), có chữ mô tả, không chèn ảnh thừa. Không nhúng nội dung ngoài làm chậm trang.
- **Trung thực về giới hạn:** nghiên cứu về AI và tìm kiếm thay đổi nhanh; nêu rõ phạm vi (thị trường, năm, cỡ mẫu), không khái quát hóa một con số.

---

## 3. Giọng văn chuyên gia, nghiêm túc

- Người đọc: chủ doanh nghiệp, trưởng phòng marketing, quản lý công nghệ ở Việt Nam. Văn phong của một chuyên gia tư vấn: điềm tĩnh, chính xác, đi vào việc nên làm, chi phí, rủi ro, cách đo.
- Câu ngắn đến vừa, chủ động, rõ ý. Từ Việt phổ thông; giữ thuật ngữ ngành quen thuộc (SEO, CRM, GA4, Core Web Vitals) và giải thích lần đầu nếu cần. Không dịch máy móc.
- Xưng "Click Star" ở ngôi thứ ba, không dùng "chúng tôi", "chúng ta", "em", "anh". Bản EN dùng "Click Star", không dùng "we", "our".
- **Cấm:** emoji và ký tự trang trí; dấu gạch ngang dài (—, –) trong câu (dùng dấu phẩy, hai chấm, ngoặc đơn hoặc tách câu); sáo ngữ ("trong thời đại số", "không thể phủ nhận", "đóng vai trò quan trọng", "hãy cùng tìm hiểu", "chìa khóa vàng", "cuộc cách mạng", "bước ngoặt", "nói tóm lại"); tự khen ("hàng đầu", "số 1", "uy tín nhất", "tốt nhất"); câu giật tít; cường điệu.
- **Số lượng viết bằng chữ số, không viết bằng chữ** (anh Trung yêu cầu 20/10/2026, áp cả site): "7 thành phần", "6 phần", "3 model", "2 đến 3 ví dụ"; bản EN "7 components", "6-part", "3 or more". Áp cho tiêu đề, mô tả, nội dung và cả chữ trong ảnh. Giữ nguyên thành ngữ và thứ tự: "cả hai", "thứ hai", "hai phần ba", "dấu ba chấm", "một nửa". Số thập phân VI dùng dấu phẩy (73,3%), EN dùng dấu chấm (73.3%).
- Không suy đoán giới tính của người từ tên. Nhắc người bằng tên và vai trò, hoặc dùng cách nói trung tính.
- **Không đưa vào bài:** danh sách "Nguồn", mục "Giới hạn của bài này", mục "Về bài viết này", dấu tham chiếu [1][2]. Nguồn chỉ nêu trong câu ("theo Pew Research Center, tháng 7/2025...") và ở chân ảnh minh họa. (Anh Trung yêu cầu từ 18/10/2026.)
- Phân biệt rõ ba loại thông tin và dán nhãn khi dễ nhầm: số đã đo (có nguồn), kịch bản hoặc ước tính (ghi là ước tính), nhận định của Click Star (khối "Đánh giá của Click Star").

---

## 4. Chữ căn đều hai bên ở máy tính

Đã áp dụng ở mức code cho toàn site (commit dec0588 ngày 20/10/2026): thân bài blog, bài dự án và câu trả lời FAQ dùng `text-justify` từ màn hình 640px trở lên và `hyphens-auto` ở mọi cỡ; dưới 640px căn trái để tránh khoảng cách từ bị giãn.

Khi viết bài, để căn đều đẹp:
- Không đặt căn chỉnh thủ công trong nội dung; để giao diện xử lý.
- Đoạn văn ngắn để mắt dễ chịu, nhất là trên điện thoại (anh yêu cầu 21/10/2026): mỗi đoạn tối đa 2 đến 3 câu, khoảng 300 ký tự (không quá 350), xuống dòng bằng một dòng trống giữa các đoạn. Câu dài nối bằng dấu chấm phẩy thì tách thành các câu riêng. Đoạn mở đầu cũng theo luật này, tách thành 2 đến 3 đoạn: bối cảnh, phạm vi và nguồn, rồi điều bài sẽ trả lời. Tránh chuỗi dài không có khoảng trắng (URL dài, mã) trong đoạn văn; đưa vào danh sách hoặc bỏ.
- Danh sách dùng gạch đầu dòng ngắn gọn, mỗi mục một ý.
- Kiểm tra bài trên giao diện máy tính trước khi báo xong: không có dòng bị giãn chữ bất thường.

---

## 5. Bài viết chất lượng, mang lại giá trị cho người đọc

- **Mỗi bài phải để lại cho người đọc một thứ làm được ngay:** checklist, lộ trình theo ngày hoặc theo bước, tiêu chí chọn, bộ chỉ số để đo, danh sách sai lầm cần tránh. Bài chỉ tường thuật tin mà không có "việc nên làm" là chưa đạt.
- **Quy trình nghiên cứu:** WebSearch và WebFetch lấy nguồn chính trước (tài liệu chính thức, văn bản pháp luật, báo cáo gốc, trang dữ liệu của tổ chức nghiên cứu). Đọc đến phương pháp và giới hạn của từng nghiên cứu. Nguồn thứ cấp chỉ dùng khi không có nguồn chính, và phải ghi là số liệu thứ cấp.
- **Số liệu:** mỗi số có nguồn, ngày, phạm vi. Số nào không kiểm chứng được thì bỏ, không "làm tròn cho đẹp". Khi nguồn hai bên không khớp, nói rõ chỗ không khớp. Số về thị trường khác (Mỹ, châu Âu) phải ghi rõ và nói chưa có số đo tương đương cho Việt Nam nếu đúng như vậy.
- **Không bịa:** tên công ty, tên người, nghiên cứu, khảo sát, trích dẫn, kết quả dự án.
- **Trích dẫn:** diễn đạt lại bằng lời mới; không chép nguyên văn dài. Nếu cần trích nguyên văn, ngắn dưới 15 từ, nêu nguồn.
- **Điều khách đặt ra không có trong thực tế:** nói thẳng. Ví dụ yêu cầu "luật 2027" khi chưa có luật nào hiệu lực riêng từ 2027 thì bài nói rõ điều này và trình bày điều đang có hiệu lực. Ví dụ yêu cầu "mô tô bay" khi nguồn chỉ có ô tô bay thì bài ghi rõ.

---

## 6. Hình ảnh chất lượng, mô tả được giá trị nội dung

**Bộ ảnh tiêu chuẩn cho mỗi bài (anh yêu cầu 21/10/2026): ít nhất 5 ảnh**, gồm 1 ảnh bìa (1600x900) và ít nhất 4 infographic (rộng 1400, xuất ở tỷ lệ 1,5), mỗi infographic có bản VI và bản EN. Với 4 infographic, mỗi ngôn ngữ có 5 ảnh (cả ảnh bìa) và mỗi bài có 9 tệp. Cả 4 ảnh trong thân bài phải được chèn vào bài ở đúng chỗ liên quan, không dồn về một chỗ và không lặp ý giữa các ảnh. Đặt ở `public/images/blog/<slug>/`, tên tệp `cover.png` và `<tên>-vi.png`, `<tên>-en.png`.

**Nguyên tắc nội dung ảnh:**
- Mỗi infographic trả lời đúng một câu hỏi của bài và chứa dữ liệu thật của bài: mốc thời gian, bảng so sánh có tiêu chí, biểu đồ cột từ số liệu có nguồn, lộ trình, quy trình, sơ đồ luồng. Không dùng ảnh minh họa rỗng, không ảnh stock.
- Tiêu đề ảnh nói ra kết luận hoặc câu hỏi, không chỉ đặt tên chủ đề. Dòng phụ nêu phạm vi.
- Chân ảnh luôn có nguồn và ngày đối chiếu ("Nguồn: ..., đối chiếu 20/10/2026") hoặc nhãn trung thực: "Khung tham khảo của Click Star", "Mô hình minh họa, không phải số đo".
- Mọi chữ và số trên ảnh khớp 100% với bài. Định dạng số theo ngôn ngữ (VI: 70,22%; EN: 70.22%). Không dùng con số bịa để trông "đẹp" (đã từng phải sửa một ảnh có chữ "128/128 tests" không có thật).
- Không chụp hay dựng ảnh từ ứng dụng của khách hàng. Không dùng dấu hiệu "màu AI" hay nền xám âm bản; dùng màu thương hiệu Click Star.

**Thiết kế:** dựng bằng HTML rồi chụp bằng Playwright; font Plus Jakarta Sans (tắt `calt` và `liga` để không biến "5xx" thành "5×x"); logo Click Star ở chân ảnh; màu xanh thương hiệu cùng cam, xanh lá, tím, đỏ làm màu nhấn có ý nghĩa; chữ đủ lớn để đọc trên điện thoại; bo góc và khoảng thở đồng bộ với các ảnh trước. Ảnh bìa có một cụm chữ lớn và một hình đặc trưng cho chủ đề.

**Ảnh bìa (thumbnail) mỗi bài một diện mạo riêng (anh yêu cầu 21/10/2026).** Ảnh bìa là thứ người đọc thấy đầu tiên ở danh sách blog, nên hai bài khác nhau không được có ảnh bìa trông giống nhau. Lần rà ngày 21/10/2026 cho thấy 42 ảnh bìa cũ đa số cùng một bố cục (chữ trắng lớn bên trái, một thẻ bên phải) và cùng họ nền xanh dương, xanh lục hoặc teal tối. Từ nay:
- **Mỗi bài một họ màu nền riêng.** Chọn họ màu theo chủ đề (bảng dưới), và không dùng lại họ màu của 5 ảnh bìa gần nhất cùng nhóm chủ đề, cũng không dùng trùng với bài khác trong cùng đợt. Một đợt 8 bài thì có ít nhất 6 họ màu khác nhau; hai bài cùng họ màu phải khác hẳn bố cục.
- **Mỗi bài một hình đặc trưng riêng, dựng bằng chính nội dung của bài:** bong bóng hội thoại cho chatbot, sóng âm cho cuộc gọi, các cột pipeline cho CRM, vòng đo cho Core Web Vitals, thanh cuộn kết quả tìm kiếm cho SEO. Hình phải là mô hình trung thực của chủ đề, không dùng ảnh stock, không dùng biểu tượng rỗng. Thay đổi cả cách đặt hình (bên trái, giữa, phủ nền, chia đôi), cỡ chữ lớn và kiểu chữ nhấn, đừng lặp mãi bố cục "chữ trái, thẻ phải".
- **Giữ nhận diện Click Star ở những thứ cố định:** logo, phông Plus Jakarta Sans, dòng nhãn nhỏ phía trên, độ bo góc, màu nhấn vàng nhạt cho từ khóa. Đổi màu nền và hình, giữ phần này.
- **Chữ trên ảnh bìa là tiếng Anh ngắn** (một cụm lớn, một dòng phụ), độ tương phản chữ so với nền đạt tối thiểu 4,5:1, đọc được ở ảnh thu nhỏ 320 px.

| Nhóm chủ đề | Họ màu gợi ý (chọn một, luân phiên) |
|---|---|
| AI và tự động hóa | tím chàm đến tím đậm, cam đồng, hồng tím |
| Dữ liệu và khách hàng | xanh dương đậm, xanh ngọc, xanh lục rừng |
| Marketing số và SEO | đỏ rượu, cam đất, vàng nghệ đậm |
| Website và phần mềm | xanh than, xanh cổ vịt, xám than có nhấn lam |
| Tin tức và xu hướng | nâu cà phê, xanh đen, đỏ cam |
| Quy định và bảo mật | xanh navy, đỏ sẫm, lục ô liu |

Bảng chỉ là gợi ý để bắt đầu. Điều bắt buộc là ảnh bìa mới khác ảnh bìa các bài gần nhất cả về màu lẫn bố cục.

**Cách kiểm trước khi đăng:** xếp ảnh bìa mới cạnh ảnh bìa của 10 bài đăng gần nhất (ví dụ ghép thành một tấm bằng Playwright từ `public/images/blog/*/cover.png`), thu nhỏ rồi nhìn: nếu hai ảnh khó phân biệt thì làm lại một trong hai.

**Kiểm tra bắt buộc:** mở xem từng ảnh (cả VI và EN) trước khi đưa lên repo: chữ không tràn, không bị cắt, không chồng lên nhau, các hàng thẳng hàng, tiếng Việt có dấu đúng. Chữ mô tả (alt) trong markdown là câu có nghĩa, mô tả điều ảnh cho thấy.

---

## 7. Bài phân tích chuyên sâu

- **Độ dài tham chiếu:** khoảng 11.000 đến 14.000 ký tự mỗi bản ngôn ngữ (khoảng 9 đến 12 phút đọc). Dài vì có nội dung, không kéo dài bằng lặp ý.
- **Khung phân tích cho mỗi chủ đề lớn:** bối cảnh và định nghĩa, bằng chứng (số liệu cùng giới hạn của nó), ý nghĩa với doanh nghiệp Việt Nam ("điều này có nghĩa là gì"), phương án và điều kiện áp dụng, ngoại lệ, rủi ro, việc nên làm, cách đo.
- **So sánh có tiêu chí:** khi có hai phương án trở lên, so sánh theo tiêu chí cụ thể thay vì khen chê chung chung (có thể dùng infographic).
- **Chiều sâu kỹ thuật vừa đủ:** nêu cơ chế (vì sao) chứ không chỉ kết quả (cái gì). Giải thích thuật ngữ ở lần đầu.
- **Liên hệ chéo:** nối chủ đề với các lớp liên quan (ví dụ luật dữ liệu với cơ sở dữ liệu, UX với chất lượng dữ liệu nhập) khi nối đó thật sự giúp người đọc.
- **Nói rõ điều chưa biết:** chỗ chưa có số liệu cho Việt Nam, chỗ nguồn mâu thuẫn, chỗ nên hỏi chuyên gia.

---

## Quy trình thực hiện (đã chạy ổn từ 18/10/2026)

1. Xác định chủ đề và ý định tìm kiếm; kiểm tra `posts` xem có bài trùng không.
2. Nghiên cứu nguồn chính; ghi lại số liệu, ngày, phạm vi, giới hạn.
3. Viết bản VI rồi bản EN vào hai tệp markdown trong thư mục tạm của phiên (scratchpad). Quét lỗi: emoji, "—", "chúng tôi", "we/our", sáo ngữ, số không có nguồn.
4. Tạo ảnh bìa và ít nhất 4 infographic VI/EN (tổng ít nhất 5 ảnh mỗi bài); xem từng ảnh; sửa đến khi sạch lỗi bố cục.
5. Copy ảnh vào `public/images/blog/<slug>/`, commit, đẩy `main` (chỉ thêm ảnh, fast-forward). Đợi Vercel production Ready và ảnh trả 200. Nếu build lỗi do Turbopack font tạm thời ("next/font/google queries have exactly one entry"), tạo lại deployment từ bản lỗi với `forceNew=1`.
6. INSERT bài vào `public.posts` bằng `execute_sql` (project `ffcqkrlzgofptspukrmo`), nội dung đặt trong dấu `$c$...$c$`, kèm `topic_pillar`, `topic_stage`, `topic_kind`; trả về độ dài và md5 của `content->>'vi'` và `content->>'en'`, so với md5 của tệp (bỏ ký tự xuống dòng ở cuối).
7. Xóa cache (BẮT BUỘC): `invalidate_by_tags` với `projectIdOrName=prj_Y6WQLTRlGJozqb93HtFHpLshpjl4`, `teamId=team_vgn6bhswntTAUYdVbBVdCfQR`, `requestBody {tags: ["posts", "pages", "page:home"], target: "production"}`. Từ 21/10/2026 trang `/blog`, `/blog/<slug>` (và `/en`) là trang tĩnh (ISR): không xóa cache thì danh sách blog chỉ có bài mới sau tối đa 5 phút, bài sửa nội dung chỉ đổi sau tối đa 1 giờ. Sửa dự án bằng SQL cũng xóa tag `case_studies` (hoặc `pages`).
8. Kiểm production: trang VI và `/en` trả 200, tiêu đề đúng, canonical tự trỏ, không noindex, mọi ảnh tham chiếu trả 200, bài xuất hiện ở `/blog`.
9. Báo anh: link VI và EN, 2 đến 4 bước test, những điểm cần biết (nguồn thứ cấp, số chưa kiểm chứng được, điều chưa có dữ liệu Việt Nam). Cập nhật ghi chú bộ nhớ.

## Checklist trước khi đăng

- [ ] Một chủ đề, không trùng bài cũ; từ khóa chính có ở tiêu đề, mở đầu, slug, `seo_title`, `seo_description`.
- [ ] `seo_title` 34 đến 46 ký tự; `seo_description` không quá 160 ký tự; `excerpt` 1 đến 2 câu.
- [ ] Có Điểm chính, mục phân tích theo khung, khối "Đánh giá của Click Star", việc nên làm, sai lầm thường gặp, đoạn kết chỉ dẫn đọc nguyên bản.
- [ ] Mỗi số có nguồn và ngày trong câu; không có mục Nguồn, không có [n]; số thứ cấp được ghi rõ; chủ đề pháp lý, tài chính có nhắc đối chiếu văn bản gốc.
- [ ] Không emoji, không "—", không "chúng tôi/we/our", không sáo ngữ, không tự khen, không suy giới tính từ tên.
- [ ] Không có đoạn nào quá khoảng 350 ký tự (kể cả đoạn mở đầu); mỗi đoạn 2 đến 3 câu; có dòng trống giữa các đoạn, ở cả bản VI và EN.
- [ ] Có bản EN đầy đủ và khớp bản VI.
- [ ] Mỗi bài có ít nhất 5 ảnh (1 ảnh bìa và ít nhất 4 infographic) ở cả VI và EN, mỗi infographic nói một ý khác nhau; đã xem từng ảnh; chữ khớp bài; chân ảnh có nguồn; alt có nghĩa; mỗi ảnh dưới 1 MB.
- [ ] Ảnh bìa có họ màu và hình đặc trưng khác 10 bài gần nhất (đã xếp cạnh nhau để kiểm); đợt nhiều bài thì mỗi bài một diện mạo riêng.
- [ ] Đã điền `topic_pillar`, `topic_stage`, `topic_kind`.
- [ ] md5 và độ dài nội dung trong DB khớp tệp; cache đã xóa; production 200 ở VI và EN; ảnh 200.
