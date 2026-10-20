/**
 * Câu hỏi thường gặp cho trang dịch vụ, xoay quanh chuyên môn và năng lực thực thi của Click Star.
 * Nội dung bám đúng những gì trang dịch vụ và trang bảng giá đang công bố (quy trình, công cụ, hạng mục, thời gian, bảo mật).
 * Hai trang Phần mềm theo yêu cầu và Speech Insight AI có FAQ riêng trong thư mục _data của chúng nên không nằm ở đây.
 * Sửa chữ ở đây thì sửa cả hai ngôn ngữ; FAQPage JSON-LD tự lấy từ cùng nguồn này.
 */
export type ServiceFaqItem = { q: { vi: string; en: string }; a: { vi: string; en: string } }

export const SERVICE_FAQ: Record<string, ServiceFaqItem[]> = {
  website: [
    {
      q: { vi: 'Quy trình thiết kế website của Click Star gồm những bước nào?', en: "What are the steps in Click Star's website design process?" },
      a: {
        vi: 'Gồm 6 bước: khám phá và phân tích (mục tiêu kinh doanh, đối thủ, hành vi người dùng), thiết kế UI/UX trên Figma, hoàn thiện nhận diện thương hiệu, phát triển code kèm CMS và trang quản trị, tối ưu SEO và cài đặt đo lường, cuối cùng là ra mắt và hỗ trợ. Cả quy trình thường khoảng 4 đến 6 tuần. Doanh nghiệp theo dõi tiến độ và duyệt thiết kế trực tuyến qua portal riêng.',
        en: 'Six steps: discovery and analysis (business goals, competitors, user behaviour), UI/UX design in Figma, brand identity, development with a CMS and admin panel, SEO and measurement setup, then launch and support. The whole process usually takes about 4 to 6 weeks. You follow progress and approve designs online through a dedicated project portal.',
      },
    },
    {
      q: { vi: 'Website Click Star làm có chuẩn SEO và tải nhanh không?', en: 'Are the websites Click Star builds SEO-ready and fast?' },
      a: {
        vi: 'Có. Website được thiết kế responsive, tối ưu Core Web Vitals với mục tiêu từ 90 điểm PageSpeed trở lên, cấu trúc semantic, sitemap, meta tags, schema markup và liên kết nội bộ ngay từ đầu. Khi bàn giao, Google Analytics, Search Console và theo dõi chuyển đổi đã được cài sẵn.',
        en: 'Yes. Sites are built responsive and tuned for Core Web Vitals with a PageSpeed target of 90 or higher, with semantic structure, sitemap, meta tags, schema markup and internal linking from the start. At handover, Google Analytics, Search Console and conversion tracking are already set up.',
      },
    },
    {
      q: { vi: 'Click Star làm được những loại website nào?', en: 'What types of website can Click Star build?' },
      a: {
        vi: 'Website doanh nghiệp, website thương mại điện tử (giỏ hàng, thanh toán, quản lý đơn hàng, tích hợp CRM), landing page thu lead, website giới thiệu dự án, website giáo dục (quản lý khóa học, bài kiểm tra, cổng học viên) và website nhà hàng, quán cà phê (menu số, đặt bàn, kết nối giao hàng).',
        en: 'Corporate sites, e-commerce (cart, checkout, order management, CRM integration), lead-generation landing pages, portfolio sites, education sites (course management, quizzes, student portal) and restaurant or cafe sites (digital menu, table booking, delivery integration).',
      },
    },
    {
      q: { vi: 'Sau khi bàn giao, doanh nghiệp có tự cập nhật nội dung được không?', en: 'After handover, can we update the content ourselves?' },
      a: {
        vi: 'Được. Website có CMS và trang quản trị để doanh nghiệp tự sửa nội dung. Click Star hướng dẫn sử dụng CMS khi bàn giao, sau đó bảo trì và hỗ trợ kỹ thuật theo cam kết hỗ trợ đã thống nhất.',
        en: 'Yes. Every site comes with a CMS and admin panel so you can edit content yourself. Click Star trains your team on the CMS at handover, then provides maintenance and technical support under the agreed support terms.',
      },
    },
    {
      q: { vi: 'Website có kết nối được với quảng cáo và CRM không?', en: 'Can the website connect to advertising and a CRM?' },
      a: {
        vi: 'Có. Landing page và theo dõi chuyển đổi được chuẩn bị sẵn cho Google Ads và Meta Ads (pixel, remarketing, A/B testing). Website thương mại có thể tích hợp CRM để khách đặt hàng hoặc để lại thông tin được ghi nhận thẳng vào hệ thống chăm sóc khách hàng.',
        en: 'Yes. Landing pages and conversion tracking are prepared for Google Ads and Meta Ads (pixels, remarketing, A/B testing). E-commerce sites can integrate a CRM so orders and enquiries land directly in your customer care system.',
      },
    },
  ],
  'digital-marketing': [
    {
      q: { vi: 'Click Star chạy được quảng cáo trên những nền tảng nào?', en: 'Which advertising platforms does Click Star run?' },
      a: {
        vi: 'Google Ads (Search và Display), Meta Ads (Facebook và Instagram), TikTok Ads và Spark Ads, YouTube Video Ads, Zalo Ads và LinkedIn Ads, kèm retargeting và remarketing. Mỗi kênh có chiến lược riêng thay vì áp một cách làm cho tất cả.',
        en: 'Google Ads (Search and Display), Meta Ads (Facebook and Instagram), TikTok Ads and Spark Ads, YouTube Video Ads, Zalo Ads and LinkedIn Ads, plus retargeting and remarketing. Each channel gets its own strategy rather than one approach for all.',
      },
    },
    {
      q: { vi: 'Quy trình triển khai gồm những bước nào, bao lâu thì bắt đầu chạy?', en: 'What does the delivery process look like and how soon do campaigns start?' },
      a: {
        vi: 'Gồm 5 bước: khám phá và phân tích (khoảng 1 đến 2 tuần: họp kick-off, audit kênh hiện tại, phân tích đối thủ, chốt KPI), xây chiến lược và kế hoạch, thiết lập tài khoản, pixel và chạy chiến dịch thử, tối ưu và mở rộng liên tục, rồi báo cáo định kỳ. Thường sau 3 đến 4 tuần doanh nghiệp bắt đầu thấy kết quả.',
        en: 'Five steps: discovery and analysis (about 1 to 2 weeks: kick-off meeting, audit of current channels, competitor analysis, KPIs), strategy and plan, account and pixel setup with a pilot campaign, continuous optimisation and scaling, then regular reporting. Businesses usually see results after 3 to 4 weeks.',
      },
    },
    {
      q: { vi: 'Làm sao để theo dõi hiệu quả chiến dịch?', en: 'How do we track campaign performance?' },
      a: {
        vi: 'Doanh nghiệp có portal riêng với dashboard cập nhật theo thời gian thực, nhận báo cáo tự động qua email hằng tuần, họp đánh giá hằng tháng và duyệt nội dung, thiết kế trước khi chiến dịch chạy. Khi số liệu lệch, chiến lược được điều chỉnh ngay trong kỳ họp.',
        en: 'You get a dedicated portal with a real-time dashboard, an automatic weekly report by email, a monthly review meeting, and approval of content and creative before campaigns run. If the numbers drift, the strategy is adjusted at the review.',
      },
    },
    {
      q: { vi: 'Click Star làm SEO và nội dung như thế nào?', en: 'How does Click Star approach SEO and content?' },
      a: {
        vi: 'Bắt đầu bằng audit kỹ thuật, sau đó nghiên cứu từ khóa, tối ưu on-page và off-page, viết và tối ưu nội dung, xây liên kết chất lượng. Mục tiêu là website xuất hiện ở các từ khóa mang lại khách hàng, đo bằng lượng truy cập tự nhiên và số khách để lại thông tin.',
        en: 'It starts with a technical audit, then keyword research, on-page and off-page optimisation, content creation and optimisation, and quality link building. The goal is to rank for the keywords that bring customers, measured by organic traffic and enquiries.',
      },
    },
    {
      q: { vi: 'Phí dịch vụ và ngân sách quảng cáo được tính thế nào?', en: 'How are service fees and ad budgets handled?' },
      a: {
        vi: 'Phí dịch vụ tính theo gói: Starter từ 8 triệu đồng mỗi tháng, Professional từ 25 triệu đồng mỗi tháng, Enterprise báo giá theo nhu cầu. Phí quảng cáo trả cho Facebook, Google, TikTok và Zalo do doanh nghiệp quyết định ngân sách và trả trực tiếp cho nền tảng.',
        en: 'Service fees are by plan: Starter from 8 million VND a month, Professional from 25 million VND a month, Enterprise quoted to your needs. Ad spend on Facebook, Google, TikTok and Zalo is set by you and paid directly to the platforms.',
      },
    },
  ],
  'ai-integration': [
    {
      q: { vi: 'Click Star tích hợp AI vào những việc gì trong doanh nghiệp?', en: 'What business tasks does Click Star integrate AI into?' },
      a: {
        vi: 'Sáu nhóm việc chính: tạo nội dung (bài viết, email, quảng cáo), thiết kế hình ảnh, sản xuất video, phân tích dữ liệu và báo cáo tự động, chatbot hỗ trợ khách hàng trên website, Messenger, Zalo và email, và tối ưu quảng cáo (ngân sách, nhắm đối tượng, thử nghiệm mẫu quảng cáo).',
        en: 'Six main areas: content creation (articles, email, ads), image design, video production, data analysis and automatic reporting, customer support chatbots on the website, Messenger, Zalo and email, and ad optimisation (budget, targeting, creative testing).',
      },
    },
    {
      q: { vi: 'Click Star làm việc với những công cụ AI nào?', en: 'Which AI tools does Click Star work with?' },
      a: {
        vi: 'Claude, GPT và Gemini cho phân tích, viết nội dung và nghiên cứu; Midjourney và DALL-E cho hình ảnh; Runway và Sora cho video; ElevenLabs cho giọng nói. Công cụ được chọn theo bài toán của từng doanh nghiệp, không áp một bộ công cụ cố định cho mọi khách hàng.',
        en: 'Claude, GPT and Gemini for analysis, writing and research; Midjourney and DALL-E for images; Runway and Sora for video; ElevenLabs for voice. Tools are chosen for each business problem rather than one fixed toolset for every client.',
      },
    },
    {
      q: { vi: 'Quy trình tích hợp AI gồm những bước nào?', en: 'What are the steps of an AI integration project?' },
      a: {
        vi: 'Gồm 4 bước: khảo sát và đánh giá quy trình hiện tại (khoảng 1 đến 2 tuần), thiết kế giải pháp và chọn công cụ phù hợp (khoảng 1 tuần), triển khai, kết nối API và đào tạo đội ngũ sử dụng (khoảng 2 đến 4 tuần), sau đó đo lường, tinh chỉnh và mở rộng liên tục. Tổng thời gian đến khi chạy khoảng 4 đến 7 tuần.',
        en: 'Four steps: survey and assessment of current processes (about 1 to 2 weeks), solution design and tool selection (about 1 week), implementation, API connection and team training (about 2 to 4 weeks), then continuous measurement, tuning and scaling. Total time until it runs is about 4 to 7 weeks.',
      },
    },
    {
      q: { vi: 'Dữ liệu doanh nghiệp đưa vào AI được bảo vệ thế nào?', en: 'How is business data protected when it goes into AI?' },
      a: {
        vi: 'Click Star phân loại dữ liệu trước khi đưa vào AI và chỉ gọi mô hình AI từ máy chủ, khóa truy cập không nằm trong trình duyệt. Dữ liệu nhạy cảm như hồ sơ khách hàng hay hợp đồng chỉ được dùng sau khi rà điều khoản lưu trữ của dịch vụ AI và đối chiếu quy định bảo vệ dữ liệu cá nhân hiện hành.',
        en: 'Click Star classifies data before it reaches AI and calls AI models only from the server, so access keys never sit in the browser. Sensitive data such as customer records or contracts is used only after reviewing the AI service storage terms and checking current personal data protection rules.',
      },
    },
    {
      q: { vi: 'AI có thay thế nhân viên của chúng tôi không?', en: 'Will AI replace our staff?' },
      a: {
        vi: 'AI nhận phần việc lặp lại và tốn thời gian, còn quyết định và kiểm duyệt kết quả quan trọng vẫn do người làm. Click Star đào tạo đội ngũ sử dụng công cụ ngay trong giai đoạn triển khai để nhân viên làm việc nhanh hơn thay vì bị thay thế.',
        en: 'AI takes the repetitive, time-consuming work, while decisions and review of important results stay with people. Click Star trains your team on the tools during rollout so staff work faster rather than being replaced.',
      },
    },
  ],
  automation: [
    {
      q: { vi: 'Click Star tự động hóa được những quy trình nào?', en: 'Which processes can Click Star automate?' },
      a: {
        vi: 'Bốn nhóm phổ biến: chăm sóc khách hàng (chatbot AI trả lời 24/7, phân loại yêu cầu, chuyển nhân viên khi cần, lưu vào CRM), thông báo và cảnh báo thông minh từ nhiều nguồn, quy trình nội dung (lên ý tưởng, viết nháp, duyệt, đăng theo lịch) và báo cáo tự động gửi định kỳ.',
        en: 'Four common groups: customer care (AI chatbot 24/7, request triage, handover to staff when needed, saving to the CRM), smart alerts and notifications from many sources, content workflows (ideas, draft, review, scheduled publishing) and automatic periodic reports.',
      },
    },
    {
      q: { vi: 'Nền tảng automation của Click Star khác gì Zapier hay Make?', en: 'How is the Click Star automation platform different from Zapier or Make?' },
      a: {
        vi: 'Click Star Automation là nền tảng do Click Star tự phát triển, vận hành và bảo trì, nên quy trình được thiết kế riêng cho nghiệp vụ của từng doanh nghiệp thay vì ghép mẫu có sẵn. Khi cần, hệ thống vẫn kết nối thêm Zapier, Make và webhook để nối tới hàng nghìn ứng dụng khác.',
        en: 'Click Star Automation is a platform Click Star builds, operates and maintains itself, so workflows are designed around each business rather than stitched from templates. When needed it still connects to Zapier, Make and webhooks to reach thousands of other apps.',
      },
    },
    {
      q: { vi: 'Quy trình triển khai AI Automation gồm những bước nào?', en: 'What are the steps of an AI automation project?' },
      a: {
        vi: 'Gồm 4 bước: phân tích quy trình và xác định việc lặp lại có thể tự động hóa (khoảng 1 tuần), thiết kế sơ đồ workflow và chọn AI phù hợp, xây dựng và kết nối trên nền tảng Click Star (khoảng 2 đến 3 tuần), cuối cùng chạy thử, sửa lỗi và tối ưu liên tục.',
        en: 'Four steps: analyse processes and identify repetitive work that can be automated (about 1 week), design the workflow diagram and pick the right AI, build and connect on the Click Star platform (about 2 to 3 weeks), then test, fix and keep optimising.',
      },
    },
    {
      q: { vi: 'AI xử lý trong workflow như thế nào và khi nào cần người duyệt?', en: 'How does AI work inside a workflow and when does a person step in?' },
      a: {
        vi: 'Mỗi workflow đi theo chuỗi: sự kiện kích hoạt (webhook, lịch, sự kiện hệ thống), AI phân tích bằng Claude hoặc GPT, nền tảng điều phối rồi thực thi hành động. Với việc có hậu quả như nội dung gửi khách hay yêu cầu phức tạp, workflow dừng ở bước duyệt hoặc chuyển cho nhân viên thay vì tự quyết.',
        en: 'Each workflow runs as a chain: a trigger (webhook, schedule, system event), AI analysis with Claude or GPT, orchestration by the platform, then the action. For consequential work such as customer-facing content or complex requests, the workflow pauses for review or hands over to staff instead of deciding on its own.',
      },
    },
    {
      q: { vi: 'Sau khi chạy, ai vận hành và sửa lỗi?', en: 'After go-live, who runs it and fixes problems?' },
      a: {
        vi: 'Vì nền tảng do Click Star tự vận hành và bảo trì, đội ngũ Click Star theo dõi, sửa lỗi và tối ưu workflow sau khi chạy. Doanh nghiệp không phải tự dựng hạ tầng hay quản lý nhiều công cụ rời rạc.',
        en: 'Because Click Star operates and maintains the platform, the Click Star team monitors, fixes and optimises workflows after go-live. You do not have to build infrastructure or manage a scatter of separate tools.',
      },
    },
  ],
  'crm-cdp': [
    {
      q: { vi: 'CRM và CDP khác nhau thế nào, doanh nghiệp nên bắt đầu từ đâu?', en: 'How do CRM and CDP differ, and where should a business start?' },
      a: {
        vi: 'CDP giống radar theo dõi mọi người ghé website kể cả khi chưa biết tên, dành cho đội marketing. CRM là sổ khách hàng để đội sales và chăm sóc làm việc với người đã để lại thông tin. Doanh nghiệp mới có thể bắt đầu bằng CRM, khi chạy quảng cáo nhiều thì bổ sung CDP để dữ liệu hành vi chảy thẳng vào CRM.',
        en: 'A CDP is a radar that tracks everyone visiting the website, even before their name is known, used by marketing. A CRM is the customer book for sales and care teams working with people who left their details. New businesses can start with a CRM and add a CDP once they run a lot of ads, so behaviour data flows straight into the CRM.',
      },
    },
    {
      q: { vi: 'CDP nhận diện khách chưa để lại thông tin như thế nào?', en: 'How does the CDP recognise visitors who have not left their details?' },
      a: {
        vi: 'Mỗi trình duyệt nhận một mã ngẫu nhiên không chứa tên hay số điện thoại, mọi hành vi như trang đã xem, mức cuộn, nguồn quảng cáo được gắn vào mã đó. Khi khách điền form, nhắn Zalo hoặc chatbot, hệ thống chuẩn hóa số điện thoại hoặc email, khớp hồ sơ và gộp toàn bộ lịch sử trước đó vào một hồ sơ duy nhất.',
        en: 'Each browser gets a random ID that holds no name or phone number, and behaviour such as pages viewed, scroll depth and ad source is attached to it. When the visitor fills a form or messages on Zalo or the chatbot, the system normalises the phone number or email, matches the profile and merges all earlier history into a single record.',
      },
    },
    {
      q: { vi: 'Click Star kết nối CRM và CDP với những hệ thống nào?', en: 'Which systems does Click Star connect the CRM and CDP to?' },
      a: {
        vi: 'Website, nền tảng quảng cáo, email, kênh chăm sóc khách hàng như Zalo và chatbot, biểu mẫu và cuộc gọi. Phần triển khai gồm cài đặt theo dõi, xây đường dẫn dữ liệu và nhận diện khách trùng giữa các nguồn, thường mất 2 đến 4 tuần.',
        en: 'The website, ad platforms, email, customer care channels such as Zalo and the chatbot, forms and phone calls. The rollout covers tracking setup, building the data pipeline and recognising the same customer across sources, usually 2 to 4 weeks.',
      },
    },
    {
      q: { vi: 'Dữ liệu khách hàng cũ trong Excel hay phần mềm khác có chuyển sang được không?', en: 'Can we migrate existing customer data from Excel or other software?' },
      a: {
        vi: 'Được. Click Star chuyển dữ liệu từ Excel, Google Sheets, MySQL hoặc hệ thống cũ sang nền tảng mới, đối chiếu và ánh xạ các trường để bảo đảm dữ liệu toàn vẹn. Thời gian và chi phí phụ thuộc khối lượng dữ liệu, được báo sau buổi tư vấn miễn phí.',
        en: 'Yes. Click Star migrates data from Excel, Google Sheets, MySQL or legacy systems into the new platform, reconciling and mapping fields to keep the data intact. Time and cost depend on data volume and are quoted after a free consultation.',
      },
    },
    {
      q: { vi: 'Sau khi triển khai, đội sales hưởng lợi cụ thể ra sao?', en: 'Once live, how does the sales team benefit in practice?' },
      a: {
        vi: 'Khi khách để lại số điện thoại, hồ sơ tự chuyển sang CRM kèm toàn bộ ngữ cảnh: khách đến từ đâu, đã xem gì, quan tâm điều gì, điểm quan tâm bao nhiêu. Sales nhận thông báo để gọi nhanh, mọi cuộc gọi và báo giá ghi vào cùng một hồ sơ, nên không phải bắt đầu từ con số không.',
        en: 'When a visitor leaves a phone number, the profile moves to the CRM with full context: where they came from, what they viewed, what interests them and their interest score. Sales gets notified to call quickly, and every call and quote goes into the same record, so nobody starts from zero.',
      },
    },
  ],
  dashboard: [
    {
      q: { vi: 'Dashboard kết nối được với những nguồn dữ liệu nào?', en: 'Which data sources can the dashboard connect to?' },
      a: {
        vi: 'Google Analytics, Google Ads, Meta Ads, TikTok Ads, Zalo Ads, các hệ thống CRM (HubSpot, Salesforce, Zoho hoặc CRM riêng), Excel và Google Sheets, mạng xã hội, hệ thống bán hàng POS và ERP. Dữ liệu từ nhiều nguồn được gom về một màn hình duy nhất.',
        en: 'Google Analytics, Google Ads, Meta Ads, TikTok Ads, Zalo Ads, CRM systems (HubSpot, Salesforce, Zoho or a custom CRM), Excel and Google Sheets, social media, and POS and ERP systems. Data from all sources comes together on one screen.',
      },
    },
    {
      q: { vi: 'Quy trình triển khai dashboard gồm những bước nào?', en: 'What are the steps of a dashboard project?' },
      a: {
        vi: 'Gồm 5 bước: khảo sát nguồn dữ liệu và chốt chỉ số quan trọng (khoảng 1 đến 2 tuần), thiết kế giao diện và xác nhận với các bên liên quan (khoảng 1 tuần), tích hợp dữ liệu qua API và đường ống ETL (khoảng 2 đến 3 tuần), cài đặt AI điều chỉnh theo ngành, rồi đưa vào chạy và đào tạo đội ngũ.',
        en: 'Five steps: survey data sources and agree the key metrics (about 1 to 2 weeks), design the interface and confirm it with stakeholders (about 1 week), integrate data through APIs and ETL pipelines (about 2 to 3 weeks), set up the AI tuned to your industry, then go live and train your team.',
      },
    },
    {
      q: { vi: 'Dữ liệu trên dashboard được bảo mật như thế nào?', en: 'How is dashboard data secured?' },
      a: {
        vi: 'Dữ liệu được mã hóa AES-256, phân quyền chi tiết theo vai trò để kiểm soát ai xem được gì, bảo mật cấp hàng dữ liệu, nhật ký ghi lại mọi thao tác và sao lưu hằng ngày. Hệ thống thiết kế theo OWASP Top 10, TLS 1.2 trở lên và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
        en: 'Data is encrypted with AES-256, role-based permissions control who sees what, row-level security protects records, an audit log records every action and backups run daily. The system follows OWASP Top 10, TLS 1.2 or higher and Decree 13/2023/ND-CP on personal data protection.',
      },
    },
    {
      q: { vi: 'Dashboard cập nhật nhanh cỡ nào và xem trên điện thoại được không?', en: 'How fresh is the data, and can I view it on a phone?' },
      a: {
        vi: 'Dữ liệu đồng bộ khoảng mỗi 30 giây nên số liệu luôn mới. Dashboard hiển thị tốt trên điện thoại để lãnh đạo xem tình hình kinh doanh mọi lúc, kèm báo cáo tự động gửi định kỳ.',
        en: 'Data syncs about every 30 seconds so figures stay current. The dashboard works well on a phone so leaders can check the business anytime, with automatic periodic reports on top.',
      },
    },
    {
      q: { vi: 'AI trong dashboard làm được những gì?', en: 'What can the AI inside the dashboard do?' },
      a: {
        vi: 'Dashboard tích hợp Claude để phân tích và giải thích số liệu, dự đoán xu hướng doanh thu và hành vi khách hàng, trả lời câu hỏi bằng ngôn ngữ tự nhiên như "chiến dịch nào có ROI cao nhất tháng này", đề xuất điều chỉnh ngân sách và cảnh báo ngay khi chi phí hoặc hiệu quả biến động bất thường.',
        en: 'The dashboard integrates Claude to analyse and explain figures, forecast revenue trends and customer behaviour, answer natural-language questions such as "which campaign has the highest ROI this month", suggest budget adjustments and alert you when cost or performance moves abnormally.',
      },
    },
  ],
}

/** Câu trả lời nhanh cho từng dịch vụ (câu đầu tiên của khối FAQ). Chỉ ghi số liệu chủ site đã xác nhận ngày 20/10/2026. */
export const SERVICE_QUICK: Record<string, ServiceFaqItem> = {
  website: {
    q: { vi: 'Thiết kế website tại Click Star mất bao lâu?', en: 'How long does website design at Click Star take?' },
    a: {
      vi: 'Quy trình 6 bước từ khảo sát đến ra mắt thường kéo dài khoảng 4 đến 6 tuần: khảo sát 3 đến 5 ngày, thiết kế UI/UX 7 đến 10 ngày, nhận diện thương hiệu 5 đến 7 ngày, phát triển 14 đến 21 ngày, sau đó tối ưu SEO, cài đo lường và bàn giao. Website thiết kế responsive, tối ưu tốc độ tải và chuẩn SEO kỹ thuật. Chi phí được báo sau buổi tư vấn miễn phí.',
      en: 'The six-step process from discovery to launch usually takes about 4 to 6 weeks: discovery 3 to 5 days, UI/UX design 7 to 10 days, brand identity 5 to 7 days, development 14 to 21 days, then SEO optimisation, measurement setup and handover. Sites are built responsive, fast-loading and technically SEO-ready. Cost is quoted after a free consultation.',
    },
  },
  'digital-marketing': {
    q: { vi: 'Dịch vụ Digital Marketing giá bao nhiêu, bao lâu thấy kết quả?', en: 'How much does digital marketing cost and when do results show?' },
    a: {
      vi: 'Gói Starter từ 8 triệu đồng mỗi tháng, gói Professional từ 25 triệu đồng mỗi tháng, gói Enterprise báo giá theo nhu cầu. Phí quảng cáo trả cho Facebook, Google, TikTok tính riêng theo ngân sách của doanh nghiệp. Thông thường sau 3 đến 4 tuần doanh nghiệp bắt đầu thấy kết quả.',
      en: 'The Starter plan is from 8 million VND a month, Professional from 25 million VND a month, and Enterprise is quoted to your needs. Ad spend paid to Facebook, Google and TikTok is billed separately according to your own budget. Businesses usually start to see results after 3 to 4 weeks.',
    },
  },
  'crm-cdp': {
    q: { vi: 'Triển khai CRM và CDP mất bao lâu, chi phí bao nhiêu?', en: 'How long does a CRM and CDP rollout take and what does it cost?' },
    a: {
      vi: 'Tích hợp CRM và CDP với hệ thống hiện có (website, nền tảng quảng cáo, email, chăm sóc khách hàng) mất khoảng 2 đến 4 tuần, chi phí một lần từ 20 đến 50 triệu đồng. Sau đó vận hành theo gói từ 15 triệu hoặc từ 35 triệu đồng mỗi tháng.',
      en: 'Connecting a CRM and CDP to your existing systems (website, ad platforms, email, customer care) takes about 2 to 4 weeks, with a one-time cost of 20 to 50 million VND. After that it runs on a plan from 15 million or from 35 million VND a month.',
    },
  },
  'ai-integration': {
    q: { vi: 'Tích hợp AI vào quy trình doanh nghiệp mất bao lâu, chi phí bao nhiêu?', en: 'How long does AI integration take and what does it cost?' },
    a: {
      vi: 'Quy trình 4 bước gồm khảo sát 1 đến 2 tuần, thiết kế giải pháp 1 tuần, triển khai và tích hợp 2 đến 4 tuần, rồi tối ưu liên tục, tức khoảng 4 đến 7 tuần cho đến khi chạy. Riêng một quy trình AI riêng đã rõ phạm vi, ví dụ chấm điểm khách hàng tiềm năng hay tự phân loại email, thường mất 2 đến 3 tuần với chi phí từ 15 đến 40 triệu đồng. Click Star tư vấn miễn phí một đối một trước khi báo giá.',
      en: 'The four-step process is discovery 1 to 2 weeks, solution design 1 week, implementation and integration 2 to 4 weeks, then continuous tuning, so about 4 to 7 weeks until it runs. A single custom AI workflow with a clear scope, such as lead scoring or automatic email sorting, usually takes 2 to 3 weeks and costs 15 to 40 million VND. Click Star gives a free one-to-one consultation before quoting.',
    },
  },
  automation: {
    q: { vi: 'Tự động hóa quy trình bằng AI mất bao lâu?', en: 'How long does AI process automation take?' },
    a: {
      vi: 'Phân tích quy trình mất khoảng 1 tuần, xây dựng và kết nối trên nền tảng Click Star mất 2 đến 3 tuần, sau đó chạy thử và tối ưu liên tục. Click Star tự phát triển nền tảng tự động hóa và thiết kế quy trình riêng cho nghiệp vụ của từng doanh nghiệp, thay vì dùng một mẫu chung cho mọi khách hàng.',
      en: 'Analysing the process takes about 1 week, building and connecting it on the Click Star platform takes 2 to 3 weeks, then comes testing and continuous optimisation. Click Star builds its own automation platform and designs each workflow around the specific operations of the business, rather than using one template for every client.',
    },
  },
  dashboard: {
    q: { vi: 'Dashboard dữ liệu của Click Star dùng để làm gì, mất bao lâu?', en: 'What is a Click Star data dashboard for, and how long does it take?' },
    a: {
      vi: 'Dashboard gom số liệu bán hàng, quảng cáo và vận hành từ nhiều nguồn vào một màn hình, tự cập nhật và có báo cáo tự động, để lãnh đạo xem tình hình kinh doanh trong vài giây thay vì tổng hợp thủ công. Ba giai đoạn đầu (khảo sát 1 đến 2 tuần, thiết kế 1 tuần, tích hợp dữ liệu 2 đến 3 tuần) cộng lại khoảng 4 đến 6 tuần, sau đó cài AI, đưa vào chạy và đào tạo đội ngũ. Chi phí được báo sau buổi tư vấn miễn phí.',
      en: 'A dashboard brings sales, advertising and operations figures from many sources onto one screen, updates itself and sends automatic reports, so leaders see the state of the business in seconds instead of compiling it by hand. The first three phases (discovery 1 to 2 weeks, design 1 week, data integration 2 to 3 weeks) add up to about 4 to 6 weeks, followed by AI setup, go-live and team training. Cost is quoted after a free consultation.',
    },
  },
  'custom-software': {
    q: { vi: 'Làm phần mềm theo yêu cầu mất bao lâu?', en: 'How long does custom software take to build?' },
    a: {
      vi: 'Phiên bản đầu tiên với các chức năng cốt lõi thường mất khoảng 6 đến 10 tuần, tùy phạm vi. Quy trình gồm khảo sát 1 đến 2 tuần, thiết kế 2 đến 3 tuần, phát triển theo từng chặng 2 tuần (thời gian tùy phạm vi), kiểm thử 1 đến 2 tuần và chuyển giao khoảng 1 tuần. Mỗi thay đổi lên môi trường thử để doanh nghiệp duyệt trước khi lên hệ thống chính.',
      en: 'A first version with the core features usually takes about 6 to 10 weeks, depending on scope. The process is discovery 1 to 2 weeks, design 2 to 3 weeks, build in two-week sprints (duration depends on scope), testing 1 to 2 weeks and handover about 1 week. Every change goes to a test environment for you to approve before it reaches the live system.',
    },
  },
  'speech-insight-ai': {
    q: { vi: 'Triển khai Speech Insight AI mất bao lâu?', en: 'How long does Speech Insight AI take to set up?' },
    a: {
      vi: 'Bước kết nối nguồn ghi âm mất 1 đến 3 ngày làm việc, tùy tổng đài hiện có và công việc viết kết nối. Sau đó là giai đoạn chạy thử để hiệu chỉnh bộ tiêu chí chấm điểm và từ điển riêng, rồi chạy chính thức: 100% cuộc gọi được chuyển thành văn bản, chấm điểm theo tiêu chí của doanh nghiệp và gắn cờ những cuộc gọi vi phạm.',
      en: 'Connecting the recording source takes 1 to 3 business days, depending on your existing call system and the work of writing the connector. Next comes a pilot period to tune your scorecard and custom dictionary, then full operation: 100% of calls are turned into text, scored against your own criteria and flagged when they break the rules.',
    },
  },
}

/** Danh sách FAQ đầy đủ của một dịch vụ: câu trả lời nhanh đứng đầu, rồi các câu hỏi thường gặp. */
export function serviceFaqItems(slug: string): ServiceFaqItem[] {
  const quick = SERVICE_QUICK[slug]
  return [...(quick ? [quick] : []), ...(SERVICE_FAQ[slug] ?? [])]
}
