'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MainNav } from '@/components/layout/main-nav'
import { Footer } from '@/components/layout/footer'
import { AboutHero } from './_components/about-hero'
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
      name: 'Quỳnh Hương',
      role: t('Co-Founder', 'Co-Founder'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/quynh-huong-1779284373776.png',
      bio: t(
        'Người sáng lập Click Star với tầm nhìn xây dựng giải pháp Digital Marketing & Automation toàn diện cho doanh nghiệp Việt Nam.',
        'Co-Founder of Click Star with the vision of building comprehensive Digital Marketing & Automation solutions for Vietnamese businesses.'
      ),
      linkedin: '#'
    },
    {
      name: 'Trần Hằng',
      role: t('Advertising Specialist', 'Advertising Specialist'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/tran-hang-1779284392670.png',
      bio: t(
        'Chuyên gia quảng cáo đa nền tảng (Facebook, Google, TikTok, Zalo). Tối ưu chi phí/lead và mở rộng tệp khách hàng tiềm năng cho hàng chục dự án.',
        'Multi-platform advertising specialist (Facebook, Google, TikTok, Zalo). Optimizes cost per lead and expands customer base for dozens of projects.'
      ),
      linkedin: '#'
    },
    {
      name: 'Ngọc Hưng',
      role: t('Designing Expert', 'Designing Expert'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/ngoc-hung-1779284416736.png',
      bio: t(
        'Chuyên gia thiết kế UI/UX với phong cách hiện đại, tối ưu trải nghiệm người dùng và chuyển đổi cho website thương hiệu.',
        'UI/UX design expert with a modern style, optimizing user experience and conversions for brand websites.'
      ),
      linkedin: '#'
    },
    {
      name: 'Như Quỳnh',
      role: t('SEO Specialist', 'SEO Specialist'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/nhu-quynh-1779284437974.png',
      bio: t(
        'Chuyên gia SEO technical + content. Đưa nhiều website Click Star lên TOP Google ở các từ khóa cạnh tranh trong lĩnh vực giáo dục, y tế, bán lẻ.',
        'Technical + content SEO specialist. Has ranked multiple Click Star sites on Google TOP for competitive keywords in education, healthcare and retail.'
      ),
      linkedin: '#'
    },
    {
      name: 'Trung Đức',
      role: t('Design Team Leader', 'Design Team Leader'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/trung-duc-1779284539211.png',
      bio: t(
        'Trưởng nhóm thiết kế, dẫn dắt đội ngũ creative trong xây dựng nhận diện thương hiệu và sản phẩm số cho khách hàng doanh nghiệp.',
        'Design team leader, guiding the creative team in building brand identity and digital products for enterprise clients.'
      ),
      linkedin: '#'
    },
    {
      name: 'Hồng Ánh',
      role: t('Content Social', 'Content Social'),
      image: 'https://ffcqkrlzgofptspukrmo.supabase.co/storage/v1/object/public/media/cms/team/hong-anh-1779284493246.png',
      bio: t(
        'Chuyên gia content social với khả năng xây dựng kế hoạch nội dung đa nền tảng, giúp thương hiệu tiếp cận đúng khách hàng mục tiêu.',
        'Content social expert with the ability to build multi-platform content plans that help brands reach the right target audience.'
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

      <AboutHero />

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
      <section id="story" className="py-20 lg:py-28 bg-secondary/30">
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
                  sizes="(max-width: 1024px) 100vw, 50vw"
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

          {/* Timeline grid: cards connected by thin line, dot at top of each card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 relative auto-rows-fr">
            {/* Connecting line — only desktop */}
            <div
              className="hidden lg:block absolute top-3 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20"
              aria-hidden="true"
            />

            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex flex-col items-center h-full">
                {/* Dot — sits on the timeline line above the card */}
                <div className="hidden lg:flex items-center justify-center w-6 h-6 mb-4 flex-shrink-0">
                  <span className="absolute w-6 h-6 bg-primary/30 rounded-full animate-pulse" />
                  <span className="relative w-3 h-3 bg-primary rounded-full ring-4 ring-foreground" />
                </div>

                {/* Card — flex column with description flex-1 → all cards same height */}
                <div className="w-full flex-1 flex flex-col bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:border-primary/40 hover:bg-white/10 transition-all">
                  <div className="text-primary font-bold text-2xl mb-2">{milestone.year}</div>
                  <h3 className="font-bold text-base lg:text-lg mb-2 text-white">{milestone.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed flex-1">{milestone.description}</p>
                </div>
              </div>
            ))}
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                href="/contact"
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
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
                      alt="Data analysis"
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 1024px) 50vw, 25vw"
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
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=500&fit=crop"
                      alt="Technology"
                      width={400}
                      height={500}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 1024px) 50vw, 25vw"
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
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-lg group"
            >
              {t('Nhận tư vấn miễn phí', 'Get Free Consultation')}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="tel:+84123456789"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {t('Gọi ngay: 0977 713 428', 'Call: 0977 713 428')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
