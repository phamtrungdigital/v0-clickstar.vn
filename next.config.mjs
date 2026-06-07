/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake import từ barrel (icon/date) → giảm JS client (landing + admin).
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'ffcqkrlzgofptspukrmo.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
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
