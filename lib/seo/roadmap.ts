/**
 * Lộ trình SEO hiển thị ở Admin → SEO → tab "Lộ trình SEO". Là dữ liệu viết tay trong code:
 * làm xong việc nào thì đổi `status` (và `date`) của việc đó rồi đẩy lên cùng đợt với thay đổi.
 *
 *  done = đã làm xong · wait = đang chờ Google/bên ngoài · todo = đội kỹ thuật sẽ làm · mine = cần quản trị viên xử lý
 */
export type RoadmapStatus = 'done' | 'wait' | 'todo' | 'mine'

export type RoadmapItem = {
  id: string
  title: string
  status: RoadmapStatus
  /** Ai làm: Kỹ thuật (phát triển site), Quản trị (chủ site), Google (chờ bên ngoài). */
  who: 'Kỹ thuật' | 'Quản trị' | 'Google'
  /** Ngày xong (dd/mm), chỉ có khi status = done. */
  date?: string
  /** Mức ưu tiên cho việc chưa làm. */
  prio?: 'cao'
  /** Vì sao cần làm, một hai câu. */
  why: string
  /** Các bước cụ thể. */
  steps: string[]
  /** Ghi chú thêm: giới hạn, lưu ý, hiện trạng. */
  note?: string
}

export type RoadmapGroup = { id: string; title: string; hint: string; items: RoadmapItem[] }

export const ROADMAP_UPDATED = '19/10/2026'

export const ROADMAP: RoadmapGroup[] = [
  {
    id: 'tech',
    title: 'Nền tảng kỹ thuật',
    hint: 'Để Google và AI đọc được site đúng và nhanh.',
    items: [
      {
        id: 'tech-base', title: 'robots.txt, canonical, noindex khu quản trị, trang 404', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Báo cho công cụ tìm kiếm trang nào là bản chính, khu quản trị không được lập chỉ mục.',
        steps: ['robots.txt cho phép toàn bộ phần công khai, chặn /admin-cls và /api', 'Mỗi trang có canonical tự trỏ, bỏ tham số ?utm', 'Trang 404 trả mã 404 thật và có noindex'],
      },
      {
        id: 'tech-schema', title: 'Dữ liệu có cấu trúc (JSON-LD) cho tổ chức, bài viết, dịch vụ, đường dẫn trang', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Giúp Google và AI hiểu trang này nói về cái gì, của ai.',
        steps: ['Organization và WebSite ở trang chủ', 'BlogPosting cho bài viết, Service cho trang dịch vụ, BreadcrumbList cho mọi trang', 'Mỗi ngôn ngữ có dữ liệu riêng'],
      },
      {
        id: 'tech-speed', title: 'Tốc độ: bỏ 310 KB JavaScript thừa, nhúng CSS vào HTML', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Trang nhanh được xếp hạng tốt hơn và bot AI đọc trọn trang trước khi hết thời gian chờ.',
        steps: ['Chữ hiện lần đầu từ 3,0 xuống 0,8 giây trên mạng chậm (đo bằng Chrome giả lập Pixel 7)', 'Sửa lỗi trang chủ và bảng giá tràn ngang 32px', 'Ảnh trong bài blog tải trễ'],
        note: 'Chưa đụng font chữ: đổi sang font biến thiên sẽ giảm tải thêm nhưng làm đổi nét chữ, cần quản trị viên duyệt bằng mắt.',
      },
      {
        id: 'tech-404', title: 'Bài viết hoặc dự án không tồn tại trả mã 404 thật', status: 'todo', who: 'Kỹ thuật',
        why: 'Hiện trả 200 kèm noindex (Google gọi là soft 404), làm báo cáo Search Console khó đọc.',
        steps: ['Kiểm tra vì sao trang động bị giữ mã 200 (do màn chờ loading.tsx)', 'Sửa để trả 404 và chạy lại kiểm tra Googlebot'],
      },
    ],
  },
  {
    id: 'content',
    title: 'Nội dung và tiêu đề',
    hint: 'Cái Google hiện trên kết quả tìm kiếm.',
    items: [
      {
        id: 'content-titles', title: 'Tiêu đề chuẩn thương hiệu cho 12 trang và 12 bài blog', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Tiêu đề 30 đến 60 ký tự, có tên thương hiệu, không bị Google cắt cụt.',
        steps: ['Đã rút gọn và áp lên production', 'Màn SEO báo mục nào còn dài hoặc ngắn'],
      },
      {
        id: 'content-admin', title: 'Màn quản lý SEO và tab SEO trong trình sửa bài', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Quản trị viên tự sửa tiêu đề, mô tả, ảnh chia sẻ, xem trước Google mà không cần nhờ đội kỹ thuật.',
        steps: ['Danh sách chung trang, bài, dự án kèm điểm', 'Tab Kiểm tra toàn site', 'Tab Tiếng Anh cho trang, dịch vụ, bài'],
      },
      {
        id: 'content-og', title: 'Ảnh chia sẻ riêng cho từng trang', status: 'todo', who: 'Kỹ thuật',
        why: 'Nhiều trang đang dùng chung một ảnh khi dán link lên Facebook, Zalo, LinkedIn nên khó thu hút bấm.',
        steps: ['Liệt kê trang chưa có ảnh riêng ở màn SEO', 'Tạo ảnh 1200x630 theo thương hiệu cho trang dịch vụ và bài mới', 'Tải lên mục Ảnh chia sẻ ở từng trang'],
      },
      {
        id: 'content-links', title: 'Liên kết nội bộ từ bài blog sang trang dịch vụ liên quan', status: 'todo', who: 'Kỹ thuật',
        why: 'Dồn sức xếp hạng cho trang dịch vụ, và giúp cả khách lẫn bot đi tiếp.',
        steps: ['Mỗi bài có 2 đến 3 liên kết tới dịch vụ đúng chủ đề', 'Trang dịch vụ liên kết ngược tới 3 bài hay nhất', 'Văn bản liên kết mô tả đúng đích đến, không dùng "bấm vào đây"'],
      },
      {
        id: 'content-translate', title: 'Dịch thân bài 3 bài cũ sang tiếng Anh', status: 'todo', who: 'Kỹ thuật',
        why: 'Ba bài (xu-huong-ai, xay-dung-dashboard, crm-vs-cdp-comparison) chưa có bản /en nên đang noindex.',
        steps: ['Đội kỹ thuật dịch, quản trị viên đọc duyệt', 'Lưu thân bài tiếng Anh từ 600 ký tự trở lên thì bản /en tự được lập chỉ mục'],
      },
    ],
  },
  {
    id: 'i18n',
    title: 'Đa ngôn ngữ',
    hint: 'Bản tiếng Việt và tiếng Anh có địa chỉ riêng.',
    items: [
      {
        id: 'i18n-en', title: 'Tiếng Anh có địa chỉ riêng /en, hreflang hai chiều, sitemap 73 địa chỉ', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Google và AI phục vụ đúng ngôn ngữ cho đúng người, không trộn hai bản vào một địa chỉ.',
        steps: ['Tiếng Việt giữ nguyên địa chỉ cũ', 'Mỗi trang có cặp vi, en, x-default', 'Bản chưa dịch đủ thì noindex'],
      },
      {
        id: 'i18n-projects', title: 'Nhãn số liệu và lĩnh vực tiếng Anh cho 9 dự án', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Trang dự án bản /en không còn lẫn chữ Việt.',
        steps: ['Đã chạy SQL và quét lại 10 trang /en/projects: sạch'],
      },
      {
        id: 'i18n-wait', title: 'Google đọc lại sitemap và nhận bản /en', status: 'wait', who: 'Google',
        why: 'Phụ thuộc Google, thường mất vài ngày đến vài tuần.',
        steps: ['Sau 1 đến 2 tuần xem báo cáo Trang và hreflang trong Search Console', 'Có trang /en bị loại thì báo đội kỹ thuật kiểm tra'],
      },
    ],
  },
  {
    id: 'ai-read',
    title: 'SEO cho AI 1: cho AI đọc được site',
    hint: 'ChatGPT, Perplexity, Claude, Gemini chỉ trích dẫn được trang mà bot của họ đọc được.',
    items: [
      {
        id: 'ai-robots', title: 'robots.txt không chặn bot AI', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Bot tìm kiếm của AI (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot) mà bị chặn thì site không bao giờ được nhắc trong câu trả lời.',
        steps: ['Hiện cho phép mọi bot đọc phần công khai', 'Muốn cấm riêng bot huấn luyện (GPTBot, Google-Extended, ClaudeBot) mà vẫn cho bot tìm kiếm: thêm quy tắc userAgent trong app/robots.ts'],
        note: 'Đã bật như vậy là chủ ý: ưu tiên được AI nhắc tên.',
      },
      {
        id: 'ai-html', title: 'Nội dung có sẵn trong HTML gốc, không cần chạy JavaScript', status: 'done', who: 'Kỹ thuật', date: '19/10',
        why: 'Phần lớn bot AI không chạy JavaScript: chữ nào chỉ hiện sau khi chạy script thì AI không thấy.',
        steps: ['Trang chủ, dịch vụ, blog, dự án đều dựng sẵn từ máy chủ', 'Đã kiểm bằng cách tắt JavaScript: HTML vẫn có đủ chữ của từng trang'],
        note: 'Trang tĩnh bọc nội dung trong khối ẩn chờ nạp, chữ vẫn nằm trong HTML nên bot đọc được. Trình duyệt tắt JS thì không thấy: chỉ ảnh hưởng người tắt JS.',
      },
      {
        id: 'ai-llms', title: 'Tạo tệp /llms.txt giới thiệu site cho AI', status: 'todo', who: 'Kỹ thuật', prio: 'cao',
        why: 'Một trang chữ thuần liệt kê Click Star là gì, làm gì và các trang quan trọng, để AI nắm nhanh. Hiện /llms.txt trả 404.',
        steps: ['Soạn bản đầu: giới thiệu 3 câu, danh sách dịch vụ, dự án, bài blog nổi bật kèm mô tả một dòng', 'Tự cập nhật từ CMS để không bị cũ', 'Quản trị viên duyệt nội dung trước khi lên'],
        note: 'Chưa công cụ AI lớn nào cam kết dùng tệp này, nhưng chi phí thấp, làm một lần.',
      },
    ],
  },
  {
    id: 'ai-cite',
    title: 'SEO cho AI 2: viết để AI trích dẫn',
    hint: 'AI chọn đoạn trả lời rõ, có số liệu, có nguồn và có người chịu trách nhiệm.',
    items: [
      {
        id: 'ai-answer', title: 'Đoạn trả lời trực tiếp 40 đến 60 chữ ngay dưới tiêu đề mỗi trang dịch vụ và bài blog', status: 'todo', who: 'Kỹ thuật', prio: 'cao',
        why: 'AI thường trích đúng đoạn trả lời gọn đứng đầu. Ví dụ "Làm website doanh nghiệp tại Click Star mất bao lâu?" thì câu đầu phải trả lời luôn: "Từ 3 đến 6 tuần tùy quy mô..."',
        steps: ['Viết lại phần mở đầu 6 trang dịch vụ và 5 bài blog hay nhất', 'Mỗi đoạn nêu rõ con số: thời gian, chi phí khoảng, kết quả điển hình', 'Quản trị viên xác nhận số liệu đúng thực tế'],
        note: 'Số liệu phải là số thật, không ước lượng.',
      },
      {
        id: 'ai-faq', title: 'Khối câu hỏi thường gặp kèm dữ liệu FAQPage cho các trang dịch vụ còn lại', status: 'todo', who: 'Kỹ thuật',
        why: 'Hiện chỉ Phần mềm theo yêu cầu và Speech Insight AI có. Câu hỏi và trả lời ngắn là dạng AI trích nhiều nhất.',
        steps: ['5 đến 8 câu hỏi khách hay hỏi cho 6 trang dịch vụ và bảng giá', 'Lấy câu hỏi từ tin nhắn chatbot và biểu mẫu liên hệ thật', 'Gắn FAQPage schema cho từng trang'],
        note: 'Google không còn hiện khối FAQ nổi cho site thương mại, nhưng AI vẫn đọc.',
      },
      {
        id: 'ai-questions', title: 'Tiêu đề phụ dạng câu hỏi khách hay hỏi trong bài blog', status: 'todo', who: 'Kỹ thuật',
        why: 'Câu hỏi trong tiêu đề phụ khớp với cách người dùng gõ vào ChatGPT và Perplexity.',
        steps: ['Đổi tiêu đề phụ kiểu "Giới thiệu" thành "CRM khác CDP ở điểm nào?"', 'Mỗi tiêu đề phụ có câu trả lời ngay dòng đầu'],
      },
      {
        id: 'ai-facts', title: 'Số liệu có nguồn và ngày cập nhật hiển thị rõ', status: 'todo', who: 'Kỹ thuật',
        why: 'AI ưu tiên nguồn mới và có dẫn chứng. Bài không ghi ngày cập nhật dễ bị bỏ qua.',
        steps: ['Thêm dòng "Cập nhật lần cuối" vào bài và trang dịch vụ', 'Số liệu thị trường kèm tên nguồn và năm', 'Con số của Click Star (500+ doanh nghiệp...) ghi rõ tính đến tháng nào'],
      },
      {
        id: 'ai-tables', title: 'Định nghĩa ngắn và bảng so sánh cho khái niệm hay bị hỏi', status: 'todo', who: 'Kỹ thuật',
        why: 'Câu "A khác B thế nào" rất hay gặp (CRM và CDP, Meta Ads và Google Ads). Bảng so sánh gọn dễ được AI lấy nguyên.',
        steps: ['Chọn 5 cặp khái niệm từ câu hỏi thật của khách', 'Mỗi cặp: một câu định nghĩa, một bảng 4 đến 6 dòng, một câu khuyên chọn khi nào'],
      },
      {
        id: 'ai-author', title: 'Tác giả và người kiểm duyệt cho từng bài (E-E-A-T)', status: 'todo', who: 'Kỹ thuật',
        why: 'AI và Google đánh giá cao nội dung có người thật, có chuyên môn đứng tên.',
        steps: ['Thêm khối tác giả cuối bài: tên, chức danh, link trang đội ngũ', 'Gắn dữ liệu Person cho tác giả trong BlogPosting', 'Quản trị viên chọn người đứng tên và cung cấp chức danh'],
        note: 'Đội ngũ có sẵn ở trang chủ nên làm nhanh.',
      },
    ],
  },
  {
    id: 'ai-entity',
    title: 'SEO cho AI 3: thương hiệu rõ ràng',
    hint: 'AI chỉ nhắc một thương hiệu khi chắc chắn nó là ai, ở đâu, đáng tin không.',
    items: [
      {
        id: 'ai-sameas', title: 'Điền liên kết Facebook, LinkedIn, YouTube, Zalo ở Cài đặt', status: 'mine', who: 'Quản trị', prio: 'cao',
        why: 'Site đã sẵn khai báo sameAs nhưng các ô liên kết mạng xã hội trong Cài đặt đang trống, nên AI khó nối các hồ sơ thành một thương hiệu.',
        steps: ['Admin → Cài đặt → mục mạng xã hội: dán link trang chính thức', 'Kiểm tra thẻ sameAs đã xuất hiện ở trang chủ'],
      },
      {
        id: 'ai-nap', title: 'Tên, địa chỉ, điện thoại giống nhau ở mọi nơi', status: 'mine', who: 'Quản trị',
        why: 'Thông tin mâu thuẫn giữa website, Facebook, Zalo OA, Google làm AI giảm độ tin.',
        steps: ['Website đã thống nhất hotline 0383 406 735', 'Rà soát Facebook, Zalo OA, LinkedIn, Google: tên là "Click Star", cùng số điện thoại, cùng địa chỉ'],
      },
      {
        id: 'ai-gbp', title: 'Tạo và hoàn thiện Google Business Profile', status: 'mine', who: 'Quản trị',
        why: 'Là nguồn Google và Gemini dùng để biết doanh nghiệp có thật, kèm đánh giá khách hàng.',
        steps: ['Tạo hồ sơ, xác minh bằng thư hoặc điện thoại', 'Điền ngành, dịch vụ, giờ làm việc, ảnh', 'Chuẩn bị sẵn đoạn mô tả để dán vào hồ sơ'],
      },
      {
        id: 'ai-about', title: 'Đoạn định nghĩa thương hiệu 2 câu ở đầu trang Giới thiệu', status: 'todo', who: 'Kỹ thuật',
        why: 'Khi AI được hỏi "Click Star là gì", nó cần một câu rõ để trích.',
        steps: ['Viết 2 câu: là ai, làm gì, cho ai, ở đâu, từ năm nào', 'Dùng lại đúng câu đó trong mô tả của dữ liệu Organization và llms.txt'],
      },
    ],
  },
  {
    id: 'ai-off',
    title: 'SEO cho AI 4: có mặt ngoài website',
    hint: 'AI tin lời người khác nói về mình hơn lời mình tự nói.',
    items: [
      {
        id: 'ai-reviews', title: 'Có đánh giá khách hàng thật trên Google và các trang đánh giá', status: 'mine', who: 'Quản trị',
        why: 'AI hay trích điểm số và nhận xét từ Google, Clutch, Facebook khi so sánh nhà cung cấp.',
        steps: ['Xin 10 đánh giá đầu từ khách hàng đang hài lòng', 'Soạn sẵn tin nhắn mời đánh giá kèm liên kết trực tiếp'],
      },
      {
        id: 'ai-mentions', title: 'Được nhắc tên trên báo ngành và bài khách mời', status: 'mine', who: 'Quản trị',
        why: 'AI trích nguồn bên thứ ba nhiều hơn trang tự giới thiệu.',
        steps: ['Chọn 3 trang báo hoặc cộng đồng ngành marketing, công nghệ phù hợp', 'Soạn bài chia sẻ kinh nghiệm từ dự án thật (đã được khách đồng ý)'],
      },
      {
        id: 'ai-video', title: 'Video trên YouTube có phụ đề và mô tả đầy đủ', status: 'todo', who: 'Kỹ thuật',
        why: 'YouTube là nguồn Google AI Overviews và nhiều AI khác trích rất thường xuyên.',
        steps: ['Chọn video giới thiệu dịch vụ và dự án', 'Viết tiêu đề, mô tả, phụ đề tiếng Việt và tiếng Anh', 'Nhúng lại vào trang dịch vụ liên quan'],
        note: 'Cần có kênh YouTube chính thức trước.',
      },
    ],
  },
  {
    id: 'ai-measure',
    title: 'SEO cho AI 5: đo lường',
    hint: 'Biết AI có đọc và nhắc mình không thì mới chỉnh được.',
    items: [
      {
        id: 'ai-ga4', title: 'Gắn Google Analytics 4', status: 'mine', who: 'Quản trị', prio: 'cao',
        why: 'Chưa có GA4 thì không đo được ai vào site, từ đâu, kể cả từ ChatGPT hay Perplexity.',
        steps: ['Tạo thuộc tính GA4, lấy mã G-XXXXXXXXXX', 'Admin → SEO → Kiểm tra toàn site → dán mã vào ô Google Analytics 4 (chỉ admin)'],
      },
      {
        id: 'ai-referrer', title: 'Báo cáo lượt vào từ chatgpt.com, perplexity.ai, gemini, claude.ai, copilot', status: 'todo', who: 'Kỹ thuật',
        why: 'Cho biết AI nào đang đưa khách về và về trang nào.',
        steps: ['Sau khi có GA4: tạo nhóm kênh "AI" lọc theo nguồn giới thiệu', 'Lập báo cáo tháng đầu'],
        note: 'Chờ gắn Google Analytics 4.',
      },
      {
        id: 'ai-botlog', title: 'Xem bot AI có đang đọc site không', status: 'todo', who: 'Kỹ thuật',
        why: 'Nếu OAI-SearchBot, PerplexityBot, ClaudeBot không có trong nhật ký truy cập thì chưa thể được nhắc.',
        steps: ['Lọc nhật ký truy cập Vercel theo tên bot', 'Ghi nhận bot nào đã vào, trang nào được đọc nhiều'],
      },
      {
        id: 'ai-monthly', title: 'Mỗi tháng thử hỏi AI 20 câu khách hay hỏi', status: 'todo', who: 'Kỹ thuật',
        why: 'Cách thẳng nhất để biết Click Star có được nhắc không, và đối thủ nào đang được nhắc thay.',
        steps: ['Lập danh sách 20 câu (ví dụ "công ty làm CRM cho doanh nghiệp ở Việt Nam")', 'Hỏi ChatGPT, Perplexity, Gemini, Google AI Overviews', 'Ghi lại có nhắc Click Star không, nguồn nào được trích, rồi chọn việc sửa'],
        note: 'Danh sách câu hỏi khách thật hay hỏi qua điện thoại sẽ giúp kết quả sát thực tế hơn.',
      },
    ],
  },
  {
    id: 'search',
    title: 'Việc quản trị với Search Console',
    hint: 'Cần thực hiện bằng tài khoản chủ sở hữu.',
    items: [
      {
        id: 'sc-verify', title: 'Xác minh quyền sở hữu trên Search Console', status: 'done', who: 'Quản trị', date: '19/10',
        why: 'Để xem dữ liệu tìm kiếm và gửi sitemap.', steps: ['Đã gắn thẻ xác minh và hoàn tất xác minh'],
      },
      {
        id: 'sc-sitemap', title: 'Gửi sitemap.xml', status: 'mine', who: 'Quản trị', prio: 'cao',
        why: 'Báo Google biết 73 địa chỉ (gồm bản /en).',
        steps: ['Search Console → Sơ đồ trang web → nhập sitemap.xml → Gửi'],
      },
      {
        id: 'sc-review', title: 'Xem báo cáo Trang và hreflang sau 1 đến 2 tuần', status: 'mine', who: 'Quản trị',
        why: 'Phát hiện sớm trang bị loại hoặc bản /en chưa được nhận.',
        steps: ['Search Console → Lập chỉ mục → Trang: xem mục "Không được lập chỉ mục"', 'Lưu lại ảnh chụp màn hình nếu có trang bất thường'],
      },
    ],
  },
]

export function roadmapCounts() {
  const all = ROADMAP.flatMap((g) => g.items)
  const count = (s: RoadmapStatus) => all.filter((i) => i.status === s).length
  return { total: all.length, done: count('done'), wait: count('wait'), todo: count('todo'), mine: count('mine') }
}
