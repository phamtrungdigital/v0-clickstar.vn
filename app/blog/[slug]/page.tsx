'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, Facebook, Twitter, Linkedin, Copy, Check, Lightbulb, AlertCircle, BookOpen, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLanguage, type Language } from '@/contexts/language-context'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'

interface ContentBlock {
  type: 'h2' | 'h3' | 'p' | 'list' | 'highlight' | 'tip' | 'warning' | 'quote'
  content: string | string[]
}

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: ContentBlock[]
  image: string
  category: string
  author: string
  authorRole: string
  authorImage: string
  authorBio: string
  date: string
  readTime: string
}

const blogPostsData: Record<Language, BlogPost[]> = {
  vi: [
    {
      id: 1,
      slug: 'ai-marketing-trends-2024',
      title: '5 xu hướng AI trong Marketing không thể bỏ qua năm 2024',
      excerpt: 'Khám phá những xu hướng AI đang thay đổi cách các doanh nghiệp tiếp cận marketing và tương tác với khách hàng.',
      content: [
        { type: 'p', content: 'Trí tuệ nhân tạo (AI) đang cách mạng hóa ngành marketing với tốc độ chưa từng có. Năm 2024 đánh dấu bước ngoặt quan trọng khi các công nghệ AI trở nên phổ biến và dễ tiếp cận hơn bao giờ hết.' },
        { type: 'highlight', content: 'Theo báo cáo của McKinsey, 65% doanh nghiệp đã áp dụng AI vào marketing và con số này dự kiến tăng lên 85% vào cuối năm 2024.' },
        { type: 'h2', content: '1. AI Generative trong Content Marketing' },
        { type: 'p', content: 'Các công cụ như ChatGPT, Claude, và Gemini đang thay đổi cách chúng ta tạo nội dung. Không chỉ viết bài, AI còn có thể hỗ trợ toàn bộ quy trình content marketing.' },
        { type: 'list', content: ['Tạo ý tưởng content sáng tạo và độc đáo', 'Viết email marketing cá nhân hóa theo từng phân khúc', 'Tối ưu SEO tự động với keyword research', 'Tạo mô tả sản phẩm hấp dẫn, chuyển đổi cao'] },
        { type: 'tip', content: 'Mẹo: Sử dụng AI như một công cụ hỗ trợ, không phải thay thế hoàn toàn. Kết hợp sáng tạo của con người với tốc độ của AI để đạt hiệu quả tối đa.' },
        { type: 'h2', content: '2. Hyper-Personalization với AI' },
        { type: 'p', content: 'Cá nhân hóa không còn là "nice to have" mà đã trở thành yêu cầu bắt buộc. AI giúp phân tích hành vi người dùng real-time để tạo trải nghiệm độc đáo cho từng khách hàng.' },
        { type: 'list', content: ['Đề xuất sản phẩm chính xác dựa trên lịch sử mua hàng', 'Tùy chỉnh trải nghiệm website theo từng user', 'Gửi thông điệp đúng thời điểm vàng', 'Dự đoán nhu cầu khách hàng trước khi họ nhận ra'] },
        { type: 'quote', content: '"Personalization at scale was impossible before AI. Now it\'s not just possible, it\'s expected." - David Cancel, CEO Drift' },
        { type: 'h2', content: '3. AI Chatbot thế hệ mới' },
        { type: 'p', content: 'Chatbot không còn là những câu trả lời máy móc, cứng nhắc. Chatbot AI 2024 có khả năng hiểu ngữ cảnh, xử lý các yêu cầu phức tạp và mang lại trải nghiệm gần như con người.' },
        { type: 'list', content: ['Hiểu ngữ cảnh và intent của người dùng', 'Xử lý yêu cầu phức tạp, đa bước', 'Chuyển tiếp thông minh đến nhân viên khi cần', 'Học hỏi và cải thiện liên tục từ mỗi cuộc hội thoại'] },
        { type: 'warning', content: 'Lưu ý: Đừng để chatbot xử lý các vấn đề nhạy cảm như khiếu nại nghiêm trọng hay hoàn tiền lớn. Luôn có kênh chuyển đổi sang nhân viên thật.' },
        { type: 'h2', content: '4. Predictive Analytics' },
        { type: 'p', content: 'Dự đoán xu hướng và hành vi khách hàng giúp marketing trở nên proactive thay vì reactive. Doanh nghiệp có thể đi trước đối thủ bằng cách hiểu khách hàng tốt hơn.' },
        { type: 'list', content: ['Dự đoán churn rate và có hành động giữ chân kịp thời', 'Xác định khách hàng tiềm năng cao để ưu tiên chăm sóc', 'Tối ưu ngân sách quảng cáo dựa trên dự báo ROI', 'Timing chiến dịch chính xác theo mùa vụ'] },
        { type: 'highlight', content: 'Doanh nghiệp sử dụng Predictive Analytics có tỷ lệ chuyển đổi cao hơn 73% so với những doanh nghiệp không sử dụng.' },
        { type: 'h2', content: '5. Visual AI và Video Marketing' },
        { type: 'p', content: 'AI không chỉ xử lý text mà còn hình ảnh và video. Đây là xu hướng đặc biệt quan trọng khi video content đang chiếm ưu thế trên mọi nền tảng.' },
        { type: 'list', content: ['Tự động tạo thumbnail hấp dẫn, tăng CTR', 'Chỉnh sửa video tự động: cắt, ghép, thêm caption', 'Tạo hình ảnh sản phẩm từ mô tả text', 'Phân tích sentiment từ video và hình ảnh'] },
        { type: 'h2', content: 'Kết luận' },
        { type: 'p', content: 'AI trong marketing không còn là tương lai - nó đã là hiện tại. Doanh nghiệp nào bắt đầu áp dụng sớm sẽ có lợi thế cạnh tranh rõ rệt so với những doanh nghiệp chần chừ.' },
        { type: 'tip', content: 'Tại ClickStar, chúng tôi đã giúp hơn 500 doanh nghiệp tích hợp AI vào chiến lược marketing. Liên hệ để được tư vấn miễn phí!' }
      ],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
      category: 'AI & Marketing',
      author: 'Nguyễn Văn Minh',
      authorRole: 'CEO & Founder',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      authorBio: 'CEO & Founder của ClickStar với hơn 10 năm kinh nghiệm trong lĩnh vực Digital Marketing và AI. Anh đã tư vấn cho hơn 200 doanh nghiệp về chiến lược chuyển đổi số.',
      date: '15/01/2024',
      readTime: '8 phút'
    },
    {
      id: 2,
      slug: 'data-dashboard-guide',
      title: 'Xây dựng Dashboard dữ liệu hiệu quả cho doanh nghiệp',
      excerpt: 'Hướng dẫn chi tiết cách thiết kế và triển khai dashboard giúp theo dõi KPI và ra quyết định nhanh chóng.',
      content: [
        { type: 'p', content: 'Trong thời đại data-driven, việc có một dashboard tốt là điều kiện tiên quyết để ra quyết định nhanh và chính xác. Bài viết này sẽ hướng dẫn bạn từ A-Z cách xây dựng dashboard hiệu quả.' },
        { type: 'highlight', content: 'Dashboard tốt giúp giảm 30% thời gian phân tích dữ liệu và tăng 25% tốc độ ra quyết định theo nghiên cứu của Gartner.' },
        { type: 'h2', content: 'Tại sao doanh nghiệp cần Dashboard?' },
        { type: 'p', content: 'Dashboard không chỉ là công cụ hiển thị số liệu - nó là trung tâm điều khiển của doanh nghiệp, giúp mọi người cùng nhìn về một hướng.' },
        { type: 'list', content: ['Tổng hợp dữ liệu từ nhiều nguồn vào một nơi', 'Theo dõi KPIs real-time', 'Phát hiện vấn đề sớm trước khi quá muộn', 'Chia sẻ insights với team dễ dàng'] },
        { type: 'h2', content: 'Nguyên tắc thiết kế Dashboard hiệu quả' },
        { type: 'h3', content: '1. Xác định mục tiêu rõ ràng' },
        { type: 'p', content: 'Mỗi dashboard nên phục vụ một mục đích cụ thể và nhóm người dùng nhất định. Đừng cố nhét quá nhiều thông tin vào một dashboard.' },
        { type: 'h3', content: '2. Chọn đúng metrics' },
        { type: 'p', content: 'Không phải tất cả dữ liệu đều quan trọng. Tập trung vào KPIs thực sự ảnh hưởng đến quyết định kinh doanh.' },
        { type: 'tip', content: 'Nguyên tắc 5-7: Mỗi dashboard không nên có quá 5-7 metrics chính để người xem có thể nắm bắt nhanh.' },
        { type: 'h3', content: '3. Thiết kế trực quan' },
        { type: 'p', content: 'Dashboard phải dễ đọc trong vài giây. Sử dụng biểu đồ phù hợp và màu sắc hợp lý để truyền tải thông tin hiệu quả.' },
        { type: 'list', content: ['Sử dụng line chart cho xu hướng theo thời gian', 'Bar chart cho so sánh giữa các nhóm', 'Pie chart cho tỷ lệ phần trăm (hạn chế dùng)', 'KPI cards cho các số liệu quan trọng nhất'] },
        { type: 'warning', content: 'Tránh sử dụng quá nhiều màu sắc. Giới hạn 3-5 màu chính và sử dụng nhất quán trong toàn bộ dashboard.' },
        { type: 'h3', content: '4. Real-time khi cần thiết' },
        { type: 'p', content: 'Không phải tất cả dữ liệu đều cần real-time. Xác định đâu là dữ liệu cần cập nhật liên tục và đâu có thể cập nhật theo ngày.' },
        { type: 'h2', content: 'Công nghệ và công cụ' },
        { type: 'list', content: ['Looker Studio: Miễn phí, tích hợp tốt với Google Analytics', 'Tableau: Mạnh mẽ, phù hợp enterprise', 'Power BI: Tích hợp tốt với hệ sinh thái Microsoft', 'Custom Dashboard: Linh hoạt nhất, phù hợp yêu cầu đặc thù'] },
        { type: 'h2', content: 'Kết luận' },
        { type: 'p', content: 'Dashboard tốt là dashboard được sử dụng. Hãy bắt đầu đơn giản và cải thiện dần theo feedback của người dùng. Đừng chờ đến khi hoàn hảo mới launch.' },
        { type: 'quote', content: '"A dashboard is not about pretty charts. It\'s about driving action." - Cole Nussbaumer Knaflic' }
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      category: 'Data Analytics',
      author: 'Trần Thị Hương',
      authorRole: 'Marketing Director',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      authorBio: 'Marketing Director với chuyên môn về Data Analytics và Business Intelligence. Chị đã thiết kế hơn 100 dashboard cho các doanh nghiệp từ SME đến enterprise.',
      date: '12/01/2024',
      readTime: '10 phút'
    }
  ],
  en: [
    {
      id: 1,
      slug: 'ai-marketing-trends-2024',
      title: '5 AI Trends in Marketing You Cannot Miss in 2024',
      excerpt: 'Discover the AI trends that are changing how businesses approach marketing and customer engagement.',
      content: [
        { type: 'p', content: 'Artificial Intelligence (AI) is revolutionizing the marketing industry at an unprecedented pace. 2024 marks an important turning point as AI technologies become more popular and accessible than ever.' },
        { type: 'highlight', content: 'According to McKinsey, 65% of businesses have adopted AI in marketing, and this number is expected to rise to 85% by the end of 2024.' },
        { type: 'h2', content: '1. Generative AI in Content Marketing' },
        { type: 'p', content: 'Tools like ChatGPT, Claude, and Gemini are changing how we create content. Beyond writing, AI can support the entire content marketing process.' },
        { type: 'list', content: ['Generate creative and unique content ideas', 'Write personalized marketing emails for each segment', 'Automate SEO optimization with keyword research', 'Create compelling, high-converting product descriptions'] },
        { type: 'tip', content: 'Tip: Use AI as a support tool, not a complete replacement. Combine human creativity with AI speed for maximum effectiveness.' },
        { type: 'h2', content: '2. Hyper-Personalization with AI' },
        { type: 'p', content: 'Personalization is no longer "nice to have" but has become a must. AI helps analyze user behavior in real-time to create unique experiences for each customer.' },
        { type: 'list', content: ['Accurate product recommendations based on purchase history', 'Customize website experience per user', 'Send messages at the golden moment', 'Predict customer needs before they realize'] },
        { type: 'quote', content: '"Personalization at scale was impossible before AI. Now it\'s not just possible, it\'s expected." - David Cancel, CEO Drift' },
        { type: 'h2', content: '3. Next-Generation AI Chatbots' },
        { type: 'p', content: 'Chatbots are no longer mechanical, rigid responses. 2024 AI chatbots can understand context, handle complex requests, and deliver near-human experiences.' },
        { type: 'list', content: ['Understand user context and intent', 'Handle complex, multi-step requests', 'Smart handoff to human agents when needed', 'Continuously learn and improve from each conversation'] },
        { type: 'warning', content: 'Note: Don\'t let chatbots handle sensitive issues like serious complaints or large refunds. Always have a channel to transfer to real agents.' },
        { type: 'h2', content: '4. Predictive Analytics' },
        { type: 'p', content: 'Predicting trends and customer behavior helps marketing become proactive instead of reactive. Businesses can stay ahead of competitors by understanding customers better.' },
        { type: 'list', content: ['Predict churn rate and take timely retention actions', 'Identify high-potential customers for priority care', 'Optimize advertising budget based on ROI forecast', 'Accurate campaign timing by season'] },
        { type: 'highlight', content: 'Businesses using Predictive Analytics have 73% higher conversion rates compared to those who don\'t.' },
        { type: 'h2', content: '5. Visual AI and Video Marketing' },
        { type: 'p', content: 'AI processes not just text but also images and videos. This is a particularly important trend as video content dominates all platforms.' },
        { type: 'list', content: ['Automatically create attractive thumbnails, increase CTR', 'Auto-edit videos: cut, merge, add captions', 'Generate product images from text descriptions', 'Analyze sentiment from videos and images'] },
        { type: 'h2', content: 'Conclusion' },
        { type: 'p', content: 'AI in marketing is not the future - it\'s the present. Businesses that start applying early will have a clear competitive advantage over those who hesitate.' },
        { type: 'tip', content: 'At ClickStar, we have helped over 500 businesses integrate AI into their marketing strategy. Contact us for free consultation!' }
      ],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
      category: 'AI & Marketing',
      author: 'Nguyen Van Minh',
      authorRole: 'CEO & Founder',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      authorBio: 'CEO & Founder of ClickStar with over 10 years of experience in Digital Marketing and AI. He has consulted for over 200 businesses on digital transformation strategy.',
      date: 'Jan 15, 2024',
      readTime: '8 min'
    },
    {
      id: 2,
      slug: 'data-dashboard-guide',
      title: 'Building an Effective Data Dashboard for Your Business',
      excerpt: 'A detailed guide on how to design and implement dashboards that help track KPIs and make quick decisions.',
      content: [
        { type: 'p', content: 'In the data-driven era, having a good dashboard is a prerequisite for making quick and accurate decisions. This article will guide you from A-Z on how to build an effective dashboard.' },
        { type: 'highlight', content: 'Good dashboards reduce data analysis time by 30% and increase decision-making speed by 25% according to Gartner research.' },
        { type: 'h2', content: 'Why Do Businesses Need Dashboards?' },
        { type: 'p', content: 'A dashboard is not just a data display tool - it\'s the control center of your business, helping everyone look in the same direction.' },
        { type: 'list', content: ['Aggregate data from multiple sources in one place', 'Track KPIs in real-time', 'Detect issues early before it\'s too late', 'Share insights with team easily'] },
        { type: 'h2', content: 'Principles for Effective Dashboard Design' },
        { type: 'h3', content: '1. Define Clear Objectives' },
        { type: 'p', content: 'Each dashboard should serve a specific purpose and target user group. Don\'t try to cram too much information into one dashboard.' },
        { type: 'h3', content: '2. Choose the Right Metrics' },
        { type: 'p', content: 'Not all data is important. Focus on KPIs that truly affect business decisions.' },
        { type: 'tip', content: 'The 5-7 Rule: Each dashboard should not have more than 5-7 main metrics so viewers can grasp quickly.' },
        { type: 'h3', content: '3. Visual Design' },
        { type: 'p', content: 'Dashboards should be readable in seconds. Use appropriate charts and sensible colors to convey information effectively.' },
        { type: 'list', content: ['Use line charts for time-based trends', 'Bar charts for comparing groups', 'Pie charts for percentages (use sparingly)', 'KPI cards for the most important numbers'] },
        { type: 'warning', content: 'Avoid using too many colors. Limit to 3-5 main colors and use them consistently throughout the dashboard.' },
        { type: 'h3', content: '4. Real-time When Necessary' },
        { type: 'p', content: 'Not all data needs to be real-time. Determine which data needs continuous updates and which can be updated daily.' },
        { type: 'h2', content: 'Technology and Tools' },
        { type: 'list', content: ['Looker Studio: Free, integrates well with Google Analytics', 'Tableau: Powerful, suitable for enterprise', 'Power BI: Integrates well with Microsoft ecosystem', 'Custom Dashboard: Most flexible, suitable for specific requirements'] },
        { type: 'h2', content: 'Conclusion' },
        { type: 'p', content: 'A good dashboard is a dashboard that gets used. Start simple and improve gradually based on user feedback. Don\'t wait until it\'s perfect to launch.' },
        { type: 'quote', content: '"A dashboard is not about pretty charts. It\'s about driving action." - Cole Nussbaumer Knaflic' }
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      category: 'Data Analytics',
      author: 'Tran Thi Huong',
      authorRole: 'Marketing Director',
      authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      authorBio: 'Marketing Director with expertise in Data Analytics and Business Intelligence. She has designed over 100 dashboards for businesses from SME to enterprise.',
      date: 'Jan 12, 2024',
      readTime: '10 min'
    }
  ]
}

const relatedPostsData: Record<Language, { slug: string; title: string; image: string; category: string }[]> = {
  vi: [
    { slug: 'crm-vs-cdp-comparison', title: 'CRM vs CDP: Lựa chọn nào phù hợp?', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', category: 'CRM & CDP' },
    { slug: 'chatbot-ai-business', title: 'Triển khai Chatbot AI cho doanh nghiệp', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop', category: 'AI Automation' },
    { slug: 'digital-marketing-roi', title: 'Đo lường ROI trong Digital Marketing', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop', category: 'Digital Marketing' }
  ],
  en: [
    { slug: 'crm-vs-cdp-comparison', title: 'CRM vs CDP: Which is Right?', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', category: 'CRM & CDP' },
    { slug: 'chatbot-ai-business', title: 'Deploying AI Chatbot for Business', image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop', category: 'AI Automation' },
    { slug: 'digital-marketing-roi', title: 'Measuring ROI in Digital Marketing', image: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=250&fit=crop', category: 'Digital Marketing' }
  ]
}

// Content Block Renderer
function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3 group">
          <span className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
          <span>{block.content as string}</span>
        </h2>
      )
    case 'h3':
      return (
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-4 pl-5 border-l-2 border-primary/30">
          {block.content as string}
        </h3>
      )
    case 'p':
      return (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
          {block.content as string}
        </p>
      )
    case 'list':
      return (
        <ul className="mb-6 space-y-3 pl-1">
          {(block.content as string[]).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base sm:text-lg text-muted-foreground">
              <ChevronRight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'highlight':
      return (
        <div className="my-8 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary rounded-r-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
              {block.content as string}
            </p>
          </div>
        </div>
      )
    case 'tip':
      return (
        <div className="my-8 p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                Pro Tip
              </p>
              <p className="text-base text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {block.content as string}
              </p>
            </div>
          </div>
        </div>
      )
    case 'warning':
      return (
        <div className="my-8 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                Lưu ý quan trọng
              </p>
              <p className="text-base text-amber-800 dark:text-amber-300 leading-relaxed">
                {block.content as string}
              </p>
            </div>
          </div>
        </div>
      )
    case 'quote':
      return (
        <blockquote className="my-10 relative pl-8 py-4">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
          <p className="text-xl sm:text-2xl text-foreground italic font-serif leading-relaxed">
            {block.content as string}
          </p>
        </blockquote>
      )
    default:
      return null
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { language, t } = useLanguage()
  const blogPosts = blogPostsData[language]
  const relatedPosts = relatedPostsData[language]
  const [copied, setCopied] = useState(false)

  const post = blogPosts.find(p => p.slug === params.slug) || blogPosts[0]

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <MainNav />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              {t('Quay lại danh sách', 'Back to list')}
            </Link>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6 text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <Image
                src={post.authorImage}
                alt={post.author}
                width={56}
                height={56}
                className="rounded-full ring-4 ring-background shadow-lg"
              />
              <div>
                <p className="font-bold text-foreground text-lg">{post.author}</p>
                <p className="text-sm text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Share Bar - Sticky */}
            <div className="lg:fixed lg:left-8 xl:left-16 lg:top-1/2 lg:-translate-y-1/2 mb-8 lg:mb-0">
              <div className="flex lg:flex-col items-center gap-3 p-3 bg-card rounded-full lg:rounded-2xl shadow-lg border border-border">
                <span className="text-xs text-muted-foreground lg:hidden">{t('Chia sẻ:', 'Share:')}</span>
                <button 
                  className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full bg-secondary text-foreground flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="article-content">
              {post.content.map((block, index) => (
                <ContentBlockRenderer key={index} block={block} />
              ))}
            </div>

            {/* Divider */}
            <div className="my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Author Bio */}
            <div className="p-8 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-2xl border border-border">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={80}
                  height={80}
                  className="rounded-xl shadow-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                    {t('Về tác giả', 'About the Author')}
                  </p>
                  <p className="text-xl font-bold text-foreground mb-2">{post.author}</p>
                  <p className="text-muted-foreground leading-relaxed">{post.authorBio}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="py-16 lg:py-20 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary rounded-full" />
              {t('Bài viết liên quan', 'Related Articles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              {t('Sẵn sàng bắt đầu?', 'Ready to start?')}
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              {t('Bạn cần tư vấn về giải pháp công nghệ?', 'Need consultation on technology solutions?')}
            </h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              {t(
                'Đội ngũ chuyên gia của ClickStar sẵn sàng hỗ trợ bạn 24/7. Liên hệ ngay để nhận tư vấn miễn phí.',
                'ClickStar expert team is ready to support you 24/7. Contact now for free consultation.'
              )}
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-10 py-5 rounded-full text-lg transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              {t('Liên hệ ngay', 'Contact now')}
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
