// Trang động (bài viết, dự án, liên hệ) mặc định "streaming metadata": canonical, hreflang, robots được đẩy xuống <body>
// sau khi vỏ trang gửi đi, chỉ các bot không chạy JavaScript mới nhận trong <head>. Googlebot không nằm trong danh sách mặc định
// của Next (Google có hiển thị JS nên vẫn đọc được), nhưng thẻ noindex và hreflang của bản /en cần nằm ngay trong HTML gốc,
// nên thêm Googlebot vào danh sách. Cấu hình này GHI ĐÈ danh sách mặc định, nên chép lại danh sách của Next 16.2
// (node_modules/next/dist/shared/lib/router/utils/html-bots.js; xem lại khi nâng cấp Next). Khách thường vẫn được streaming.
const HTML_LIMITED_BOTS =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot/i

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots: HTML_LIMITED_BOTS,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      // Bỏ polyfill trình duyệt cũ mà Next tự chèn vào JS trang (xem lib/no-legacy-polyfills.js).
      '../build/polyfills/polyfill-module': './lib/no-legacy-polyfills.js',
      'next/dist/build/polyfills/polyfill-module': './lib/no-legacy-polyfills.js',
    },
  },
  experimental: {
    // Tree-shake import từ barrel (icon/date) → giảm JS client (landing + admin).
    optimizePackageImports: ['lucide-react', 'date-fns'],
    // Nhúng CSS thẳng vào HTML: tệp CSS chặn việc vẽ trang nên trước đây phải tranh băng thông với ~280 KB JS và font,
    // về muộn ~3 giây trên mạng chậm (đo bằng Playwright, Pixel 7, 1,6 Mbps) trong khi HTML + CSS riêng lẻ vẽ sau ~0,9 giây.
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Ảnh sắc nét: cho phép quality cao (Next 16 chặn quality không khai báo). <Image dùng 95.
    qualities: [75, 90, 95, 100],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'ffcqkrlzgofptspukrmo.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    // Lớp bảo vệ thứ hai ngoài thẻ meta: khu quản trị và API không bao giờ được lập chỉ mục.
    return [
      { source: '/admin-cls/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
  async rewrites() {
    // Sitemap: trình duyệt (Sec-Fetch-Dest: document) xem bảng, trình thu thập vẫn nhận XML thuần ở cùng địa chỉ.
    const views = { '/sitemap.xml': 'muc-luc', '/sitemap-trang.xml': 'trang', '/sitemap-blog.xml': 'blog', '/sitemap-du-an.xml': 'du-an' }
    return {
      beforeFiles: Object.entries(views).map(([source, nhom]) => ({
        source,
        has: [{ type: 'header', key: 'sec-fetch-dest', value: 'document' }],
        destination: `/sitemap-xem/${nhom}`,
      })),
    }
  },
  async redirects() {
    return [
      // URL đăng nhập gọn: clickstar.vn/login → trang login admin (/admin-cls/login vẫn chạy như cũ)
      { source: '/login', destination: '/admin-cls/login', permanent: false },
      { source: '/dang-nhap', destination: '/admin-cls/login', permanent: false },
    ]
  },
}

export default nextConfig
