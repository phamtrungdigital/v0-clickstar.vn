<?xml version="1.0" encoding="UTF-8"?>
<!-- Trình bày sitemap thành bảng khi mở bằng trình duyệt. Công cụ tìm kiếm đọc XML gốc, không dùng tệp này. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="s xhtml image">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="vi">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap · Click Star</title>
        <style>
          :root { color-scheme: light; }
          body { margin: 0; background: #f5f5f7; color: #1d1d1f; font: 15px/1.5 -apple-system, "SF Pro Text", Inter, system-ui, sans-serif; }
          main { max-width: 1080px; margin: 0 auto; padding: 32px 16px 48px; }
          h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }
          p.sub { margin: 6px 0 20px; color: #6e6e73; }
          .card { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 16px; box-shadow: 0 8px 24px -12px rgba(0,0,0,.1); overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-weight: 500; font-size: 12.5px; color: #6e6e73; padding: 12px 16px; border-bottom: 1px solid rgba(0,0,0,.08); white-space: nowrap; }
          td { padding: 10px 16px; border-top: 1px solid rgba(0,0,0,.06); vertical-align: top; }
          tr:first-child td { border-top: 0; }
          td.n { color: #86868b; width: 40px; font-variant-numeric: tabular-nums; }
          td.d { white-space: nowrap; color: #515154; font-variant-numeric: tabular-nums; }
          a { color: #1e6dda; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .chip { display: inline-block; padding: 1px 9px; border-radius: 999px; font-size: 12px; font-weight: 500; background: rgba(0,0,0,.05); color: #515154; }
          .chip.en { background: rgba(30,109,218,.1); color: #1e6dda; }
          .muted { color: #86868b; }
          .back { display: inline-block; margin-bottom: 14px; font-size: 14px; }
        </style>
      </head>
      <body>
        <main>
          <xsl:apply-templates/>
        </main>
      </body>
    </html>
  </xsl:template>

  <!-- Mục lục -->
  <xsl:template match="s:sitemapindex">
    <h1>Sitemap Click Star</h1>
    <p class="sub">Mục lục gồm <xsl:value-of select="count(s:sitemap)"/> nhóm. Bấm vào từng nhóm để xem danh sách trang.</p>
    <div class="card">
      <table>
        <tr><th>#</th><th>Nhóm</th><th>Cập nhật gần nhất</th></tr>
        <xsl:for-each select="s:sitemap">
          <tr>
            <td class="n"><xsl:value-of select="position()"/></td>
            <td>
              <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
              <div class="muted">
                <xsl:choose>
                  <xsl:when test="contains(s:loc, 'sitemap-trang')">Trang chủ, dịch vụ, bảng giá, dự án, giới thiệu, blog, liên hệ</xsl:when>
                  <xsl:when test="contains(s:loc, 'sitemap-blog')">Bài viết, mới nhất trước</xsl:when>
                  <xsl:when test="contains(s:loc, 'sitemap-du-an')">Dự án tiêu biểu</xsl:when>
                </xsl:choose>
              </div>
            </td>
            <td class="d"><xsl:value-of select="concat(substring(s:lastmod, 9, 2), '/', substring(s:lastmod, 6, 2), '/', substring(s:lastmod, 1, 4))"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </div>
  </xsl:template>

  <!-- Danh sách trang -->
  <xsl:template match="s:urlset">
    <a class="back" href="/sitemap.xml">← Mục lục sitemap</a>
    <h1>
      <xsl:choose>
        <xsl:when test="contains(s:url[1]/s:loc, '/blog/')">Bài viết</xsl:when>
        <xsl:when test="contains(s:url[1]/s:loc, '/projects/')">Dự án</xsl:when>
        <xsl:otherwise>Trang chính</xsl:otherwise>
      </xsl:choose>
    </h1>
    <p class="sub">
      <xsl:value-of select="count(s:url)"/> địa chỉ, gồm <xsl:value-of select="count(s:url[contains(s:loc, 'clickstar.vn/en')])"/> bản tiếng Anh.
    </p>
    <div class="card">
      <table>
        <tr><th>#</th><th>Địa chỉ</th><th>Ngôn ngữ</th><th>Ảnh</th><th>Cập nhật</th></tr>
        <xsl:for-each select="s:url">
          <tr>
            <td class="n"><xsl:value-of select="position()"/></td>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td>
              <xsl:choose>
                <xsl:when test="contains(s:loc, 'clickstar.vn/en')"><span class="chip en">EN</span></xsl:when>
                <xsl:otherwise><span class="chip">VI</span></xsl:otherwise>
              </xsl:choose>
            </td>
            <td class="d"><xsl:value-of select="count(image:image)"/></td>
            <td class="d">
              <xsl:choose>
                <xsl:when test="s:lastmod"><xsl:value-of select="concat(substring(s:lastmod, 9, 2), '/', substring(s:lastmod, 6, 2), '/', substring(s:lastmod, 1, 4))"/></xsl:when>
                <xsl:otherwise><span class="muted">không khai</span></xsl:otherwise>
              </xsl:choose>
            </td>
          </tr>
        </xsl:for-each>
      </table>
    </div>
  </xsl:template>
</xsl:stylesheet>
