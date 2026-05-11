'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { PageHero } from '@/components/sections/page-hero'
import { useLanguage } from '@/contexts/language-context'
import { 
  Target, 
  Heart, 
  Zap, 
  Users, 
  TrendingUp, 
  Award,
  CheckCircle2,
  ArrowRight,
  Linkedin,
  Mail,
  Sparkles,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react'

export default function AboutPage() {
  const { t } = useLanguage()

  const stats = [
    { value: '10+', label: t('Năm kinh nghiệm', 'Years of Experience') },
    { value: '500+', label: t('Dự án hoàn thành', 'Projects Completed') },
    { value: '50+', label: t('Chuyên gia', 'Experts') },
    { value: '98%', label: t('Khách hàng hài lòng', 'Client Satisfaction') },
  ]

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: t('Tập trung vào kết quả', 'Results-Focused'),
      description: t(
        'Mọi giải pháp đều hướng đến kết quả đo lường được, từ tăng trưởng doanh thu đến tối ưu chi phí.',
        'Every solution aims for measurable results, from revenue growth to cost optimization.'
      )
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('Đồng hành tận tâm', 'Dedicated Partnership'),
      description: t(
        'Chúng tôi không chỉ là nhà cung cấp dịch vụ, mà là người bạn đồng hành trong hành trình phát triển.',
        'We are not just service providers, but partners in your growth journey.'
      )
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('Công nghệ tiên tiến', 'Cutting-edge Technology'),
      description: t(
        'Ứng dụng AI, Machine Learning và các công nghệ mới nhất để tạo lợi thế cạnh tranh cho khách hàng.',
        'Applying AI, Machine Learning and the latest technologies to create competitive advantages.'
      )
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('Minh bạch & Tin cậy', 'Transparency & Trust'),
      description: t(
        'Báo cáo rõ ràng, quy trình minh bạch và cam kết bảo mật thông tin tuyệt đối.',
        'Clear reporting, transparent processes and absolute commitment to information security.'
      )
    },
  ]

  const team = [
    {
      name: t('Nguyễn Minh Đức', 'Nguyen Minh Duc'),
      role: t('CEO & Founder', 'CEO & Founder'),
      image: '/images/team/ceo.jpg',
      bio: t(
        'Hơn 15 năm kinh nghiệm trong lĩnh vực Marketing và chuyển đổi số. Từng giữ vị trí cấp cao tại các tập đoàn lớn.',
        'Over 15 years of experience in Marketing and digital transformation. Former senior positions at major corporations.'
      ),
      linkedin: '#'
    },
    {
      name: t('Trần Thu Hương', 'Tran Thu Huong'),
      role: t('Giám đốc Marketing', 'Chief Marketing Officer'),
      image: '/images/team/cmo.jpg',
      bio: t(
        'Chuyên gia chiến lược Marketing với hơn 10 năm kinh nghiệm triển khai chiến dịch đa kênh thành công.',
        'Marketing strategy expert with over 10 years of experience in successful multi-channel campaigns.'
      ),
      linkedin: '#'
    },
    {
      name: t('Lê Hoàng Nam', 'Le Hoang Nam'),
      role: t('Giám đốc Công nghệ', 'Chief Technology Officer'),
      image: '/images/team/cto.jpg',
      bio: t(
        'Kỹ sư phần mềm với chuyên môn sâu về kiến trúc hệ thống, Cloud và các giải pháp doanh nghiệp.',
        'Software engineer with deep expertise in system architecture, Cloud and enterprise solutions.'
      ),
      linkedin: '#'
    },
    {
      name: t('Phạm Thị Lan', 'Pham Thi Lan'),
      role: t('Trưởng bộ phận AI', 'Head of AI'),
      image: '/images/team/ai-lead.jpg',
      bio: t(
        'Tiến sĩ về Machine Learning, chuyên gia triển khai các giải pháp AI cho doanh nghiệp.',
        'PhD in Machine Learning, expert in implementing AI solutions for enterprises.'
      ),
      linkedin: '#'
    },
    {
      name: t('Vũ Quang Huy', 'Vu Quang Huy'),
      role: t('Trưởng bộ phận Data', 'Head of Data'),
      image: '/images/team/data-lead.jpg',
      bio: t(
        'Chuyên gia phân tích dữ liệu với kinh nghiệm xây dựng hệ thống CDP và BI cho nhiều doanh nghiệp lớn.',
        'Data analytics expert with experience building CDP and BI systems for large enterprises.'
      ),
      linkedin: '#'
    },
    {
      name: t('Đặng Thị Mai', 'Dang Thi Mai'),
      role: t('Giám đốc Sáng tạo', 'Creative Director'),
      image: '/images/team/creative-director.jpg',
      bio: t(
        'Hơn 8 năm kinh nghiệm trong thiết kế thương hiệu và trải nghiệm người dùng cho các thương hiệu hàng đầu.',
        'Over 8 years of experience in brand design and user experience for leading brands.'
      ),
      linkedin: '#'
    },
  ]

  const milestones = [
    { year: '2014', title: t('Thành lập Click Star', 'Click Star Founded'), description: t('Bắt đầu với đội ngũ 5 người, tập trung vào Digital Marketing.', 'Started with a team of 5, focusing on Digital Marketing.') },
    { year: '2017', title: t('Mở rộng dịch vụ CRM', 'CRM Services Expansion'), description: t('Ra mắt giải pháp CRM và hệ thống hóa quy trình chăm sóc khách hàng.', 'Launched CRM solutions and customer care process systematization.') },
    { year: '2020', title: t('Tích hợp AI & Data', 'AI & Data Integration'), description: t('Đầu tư mạnh vào công nghệ AI và phân tích dữ liệu cho doanh nghiệp.', 'Heavy investment in AI technology and data analytics for businesses.') },
    { year: '2023', title: t('500+ Dự án', '500+ Projects'), description: t('Cột mốc 500 dự án thành công với 98% khách hàng hài lòng.', 'Milestone of 500 successful projects with 98% client satisfaction.') },
    { year: '2024', title: t('Mở rộng quy mô', 'Scale Expansion'), description: t('Đội ngũ 50+ chuyên gia, phục vụ khách hàng toàn quốc và quốc tế.', 'Team of 50+ experts, serving nationwide and international clients.') },
  ]

  const industries = [
    t('Giáo dục', 'Education'),
    t('Y tế', 'Healthcare'),
    t('Bán lẻ', 'Retail'),
    t('Thương mại điện tử', 'E-commerce'),
    t('Dịch vụ cao cấp', 'Premium Services'),
    t('Tài chính', 'Finance'),
    t('Bất động sản', 'Real Estate'),
    t('F&B', 'F&B'),
  ]

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <PageHero />

      {/* Stats row */}
      <section className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Click Star Team"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 max-w-[240px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">10+</div>
                    <div className="text-sm text-muted-foreground">{t('Năm kinh nghiệm', 'Years Experience')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <Lightbulb className="w-4 h-4" />
                {t('Câu chuyện của chúng tôi', 'Our Story')}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6">
                {t('Hơn 10 năm đồng hành cùng', 'Over 10 Years Partnering with')}{' '}
                <span className="text-primary">{t('doanh nghiệp Việt', 'Vietnamese Businesses')}</span>
              </h2>

              <div className="space-y-5 text-muted-foreground leading-relaxed">
                <p>
                  {t(
                    'Với nền tảng chuyên môn hơn 10 năm trong lĩnh vực Marketing, CRM và hệ thống hóa quy trình chăm sóc khách hàng, đội ngũ Click Star đã triển khai chiến dịch cho nhiều ngành nghề khác nhau như giáo dục, y tế, bán lẻ, thương mại điện tử đến các dịch vụ cao cấp.',
                    'With over 10 years of expertise in Marketing, CRM and customer care process systematization, Click Star team has implemented campaigns for various industries such as education, healthcare, retail, e-commerce to premium services.'
                  )}
                </p>
                <p>
                  {t(
                    'Khác với các đơn vị chỉ tập trung vào quảng cáo, Click Star định vị mình là đối tác chiến lược toàn diện. Chúng tôi chú trọng tối ưu hành trình khách hàng, bắt đầu từ việc thu hút đúng tệp tiềm năng, chuyển đổi thành doanh thu và xây dựng nền tảng khách hàng trung thành.',
                    'Unlike agencies that only focus on advertising, Click Star positions itself as a comprehensive strategic partner. We focus on optimizing the customer journey, starting from attracting the right prospects, converting to revenue and building a loyal customer base.'
                  )}
                </p>
                <p>
                  {t(
                    'Mỗi giải pháp đều được thiết kế linh hoạt, dễ triển khai và tối ưu chi phí, mang lại hiệu quả rõ ràng.',
                    'Each solution is designed to be flexible, easy to implement and cost-effective, delivering clear results.'
                  )}
                </p>
              </div>

              {/* Industries */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-foreground mb-4">
                  {t('Ngành nghề đã phục vụ:', 'Industries Served:')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-white rounded-full text-sm text-muted-foreground border border-border"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" />
              {t('Giá trị cốt lõi', 'Core Values')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
              {t('Những giá trị', 'Values That')}{' '}
              <span className="text-primary">{t('dẫn lối', 'Guide Us')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t(
                'Click Star không chỉ cung cấp dịch vụ mà còn là người bạn đồng hành. Chúng tôi cam kết mang đến giá trị lâu dài.',
                'Click Star not only provides services but is also a companion. We are committed to delivering long-term value.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-28 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <Rocket className="w-4 h-4" />
              {t('Hành trình phát triển', 'Our Journey')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              {t('Cột mốc', 'Key')}{' '}
              <span className="text-primary">{t('quan trọng', 'Milestones')}</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />

            <div className="grid lg:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative text-center">
                  {/* Dot */}
                  <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-4 border-foreground z-10" />
                  
                  <div className={`lg:${index % 2 === 0 ? 'pb-20' : 'pt-20'}`}>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                      <h3 className="font-bold text-lg mb-2">{milestone.title}</h3>
                      <p className="text-white/70 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4" />
              {t('Đội ngũ chuyên gia', 'Our Expert Team')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
              {t('Những con người', 'The People')}{' '}
              <span className="text-primary">{t('đứng sau thành công', 'Behind Success')}</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t(
                'Đội ngũ chuyên gia giàu kinh nghiệm trong Digital Marketing, AI, Data và Chuyển đổi số.',
                'A team of experts with extensive experience in Digital Marketing, AI, Data and Digital Transformation.'
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={member.linkedin}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a 
                      href="#"
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-4 h-4" />
                {t('Tại sao chọn chúng tôi', 'Why Choose Us')}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight mb-6">
                {t('Đối tác chiến lược', 'A Strategic Partner')}{' '}
                <span className="text-primary">{t('toàn diện', 'For All Your Needs')}</span>
              </h2>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t(
                  'Click Star cam kết mang đến giá trị lâu dài, cùng doanh nghiệp kiến tạo chiến lược, thúc đẩy tăng trưởng và xây dựng nền tảng vững chắc trong kỷ nguyên số.',
                  'Click Star is committed to delivering long-term value, working with businesses to create strategies, drive growth and build a solid foundation in the digital age.'
                )}
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  t('Tối ưu hành trình khách hàng từ A-Z', 'End-to-end customer journey optimization'),
                  t('Giải pháp linh hoạt, dễ triển khai', 'Flexible, easy-to-implement solutions'),
                  t('Đội ngũ chuyên gia đa lĩnh vực', 'Multi-disciplinary expert team'),
                  t('Cam kết kết quả đo lường được', 'Commitment to measurable results'),
                  t('Hỗ trợ 24/7, đồng hành lâu dài', '24/7 support, long-term partnership'),
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg group"
              >
                {t('Liên hệ tư vấn ngay', 'Contact Us Now')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=500&fit=crop"
                      alt="Team collaboration"
                      width={400}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
                      alt="Data analysis"
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
                      alt="Strategy meeting"
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=500&fit=crop"
                      alt="Technology"
                      width={400}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            {t('Sẵn sàng bắt đầu hành trình', 'Ready to Start Your')}{' '}
            <span className="text-accent">{t('chuyển đổi số?', 'Digital Transformation?')}</span>
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            {t(
              'Liên hệ ngay với đội ngũ chuyên gia của chúng tôi để được tư vấn miễn phí và nhận giải pháp phù hợp nhất.',
              'Contact our expert team now for free consultation and receive the most suitable solution.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-lg group"
            >
              {t('Nhận tư vấn miễn phí', 'Get Free Consultation')}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:+84123456789"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {t('Gọi ngay: +84 123 456 789', 'Call: +84 123 456 789')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
