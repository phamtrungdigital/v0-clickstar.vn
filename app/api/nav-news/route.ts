import { NextResponse } from 'next/server'
import { getNavNews } from '@/lib/cms/posts'

// Dữ liệu công khai cho mục Tin tức trên thanh menu. Cache ở CDN 5 phút, khớp với cache trong getNavNews.
export async function GET() {
  const data = await getNavNews()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
