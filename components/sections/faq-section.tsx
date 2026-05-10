'use client'

import { useState } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { useLanguage, type Language } from '@/contexts/language-context'

const faqsData: Record<Language, { question: string; answer: string }[]> = {
  vi: [
    { question: "ClickStar cung cấp những dịch vụ nào?", answer: "Chúng tôi cung cấp giải pháp chuyển đổi số toàn diện: Digital Marketing (SEO, Ads, Content), Thiết kế Website, Dashboard dữ liệu, Tích hợp AI, Xây dựng hệ thống Automation và CRM/CDP cho doanh nghiệp." },
    { question: "Chi phí cho một dự án thường là bao nhiêu?", answer: "Chi phí phụ thuộc vào quy mô và yêu cầu cụ thể của dự án. Chúng tôi cung cấp báo giá miễn phí sau khi tìm hiểu nhu cầu. Các gói dịch vụ được thiết kế phù hợp với doanh nghiệp vừa và nhỏ đến enterprise." },
    { question: "Thời gian triển khai một dự án mất bao lâu?", answer: "Tùy thuộc vào loại dự án: Website đơn giản 2-4 tuần, Dashboard/CRM 4-8 tuần, Hệ thống AI tích hợp 8-12 tuần. Chúng tôi luôn đảm bảo tiến độ và báo cáo thường xuyên." },
    { question: "Làm sao để bắt đầu hợp tác với ClickStar?", answer: "Bạn có thể liên hệ qua form trên website, hotline hoặc email. Đội ngũ tư vấn sẽ gọi lại trong 24h để tìm hiểu nhu cầu và đề xuất giải pháp phù hợp nhất." },
    { question: "ClickStar có hỗ trợ sau khi bàn giao dự án không?", answer: "Có, chúng tôi cung cấp gói bảo trì và hỗ trợ kỹ thuật sau bàn giao. Ngoài ra còn có các gói đào tạo để team của bạn có thể tự vận hành và phát triển hệ thống." },
    { question: "Dữ liệu của chúng tôi có được bảo mật không?", answer: "Hoàn toàn bảo mật. Chúng tôi tuân thủ các tiêu chuẩn bảo mật quốc tế, ký NDA với khách hàng, và sử dụng các giải pháp mã hóa tiên tiến nhất cho mọi dự án." }
  ],
  en: [
    { question: "What services does ClickStar provide?", answer: "We provide comprehensive digital transformation solutions: Digital Marketing (SEO, Ads, Content), Website Design, Data Dashboard, AI Integration, Automation Systems and CRM/CDP for businesses." },
    { question: "How much does a project usually cost?", answer: "Cost depends on the scale and specific requirements of the project. We provide free quotes after understanding your needs. Service packages are designed for SMEs to enterprises." },
    { question: "How long does it take to implement a project?", answer: "Depending on project type: Simple website 2-4 weeks, Dashboard/CRM 4-8 weeks, AI integrated system 8-12 weeks. We always ensure progress and regular reporting." },
    { question: "How to start working with ClickStar?", answer: "You can contact via form on website, hotline or email. Our consulting team will call back within 24h to understand your needs and propose the most suitable solution." },
    { question: "Does ClickStar provide support after project handover?", answer: "Yes, we provide maintenance and technical support packages after handover. There are also training packages so your team can operate and develop the system independently." },
    { question: "Is our data secure?", answer: "Absolutely secure. We comply with international security standards, sign NDAs with clients, and use the most advanced encryption solutions for all projects." }
  ]
}

export function FAQSection() {
  const { language, t } = useLanguage()
  const faqs = faqsData[language]
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[35%_65%] gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {t('CÂU HỎI THƯỜNG GẶP', 'FREQUENTLY ASKED QUESTIONS')}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-foreground leading-tight mb-6">
              {t('Giải đáp', 'Answers to')}{' '}
              <span className="text-primary">{t('thắc mắc', 'your questions')}</span>
            </h2>

            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8">
              {t(
                'Tìm câu trả lời cho những thắc mắc phổ biến về dịch vụ, quy trình làm việc và những gì bạn có thể kỳ vọng khi hợp tác cùng chúng tôi.',
                'Find answers to common questions about our services, workflow and what you can expect when partnering with us.'
              )}
            </p>

            <button className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full hover:bg-foreground/90 transition-all duration-200 group">
              {t('Xem thêm câu hỏi', 'View more questions')}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-background-soft border-primary/20' 
                    : 'bg-background border-border hover:border-primary/30'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span className={`font-semibold text-base lg:text-lg transition-colors duration-200 ${
                    openIndex === index ? 'text-primary' : 'text-foreground'
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    openIndex === index 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>
                
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
