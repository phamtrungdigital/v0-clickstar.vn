// Ảnh bìa bài viết dựng bằng code (next/og → PNG 1200x630). Server-only.
// Khung thương hiệu cố định: màu #3687FC / #155CBD / #E8F1FF, font Plus Jakarta Sans
// (đủ dấu tiếng Việt), logo Click Star. Không logo bên thứ ba, không số liệu, không người.
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

const BLUE = '#3687FC'
const BLUE_DARK = '#155CBD'
const BLUE_LIGHT = '#E8F1FF'
const NAVY = '#0B2A57'

type FontDef = { name: string; data: ArrayBuffer; weight: 500 | 700 | 800; style: 'normal' }

let cache: { fonts: FontDef[]; logoWhite: string; logoBlue: string } | null = null

async function assets() {
  if (cache) return cache
  const root = process.cwd()
  const fontFile = (subset: string, weight: number) =>
    path.join(root, 'lib/ai/fonts', `plus-jakarta-sans-${subset}-${weight}-normal.woff`)
  const fonts: FontDef[] = []
  // Bộ vietnamese phải mang TÊN RIÊNG: satori chỉ chọn 1 font cho mỗi tên (theo độ đậm),
  // glyph thiếu thì tìm ở các tên khác cùng độ đậm. Trùng tên → chữ có dấu rơi về font
  // mặc định, nét mảnh lệch với phần còn lại của tiêu đề.
  for (const subset of ['latin', 'vietnamese']) {
    for (const weight of [500, 700, 800] as const) {
      const buf = await readFile(fontFile(subset, weight))
      fonts.push({
        name: subset === 'latin' ? 'Plus Jakarta Sans' : 'Plus Jakarta Sans VN',
        data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
        weight,
        style: 'normal',
      })
    }
  }
  const logo = async (name: string) =>
    `data:image/png;base64,${(await readFile(path.join(root, 'lib/ai/cover-assets', name))).toString('base64')}`
  cache = { fonts, logoWhite: await logo('logo-white.png'), logoBlue: await logo('logo-blue.png') }
  return cache
}

/** Cỡ chữ tiêu đề theo độ dài để luôn vừa khung (tối đa ~4 dòng). */
function titleSize(title: string, base: number) {
  const len = title.length
  if (len <= 40) return base
  if (len <= 60) return Math.round(base * 0.86)
  if (len <= 85) return Math.round(base * 0.74)
  return Math.round(base * 0.64)
}

function TitleCover({ title, kicker, logo }: { title: string; kicker: string; logo: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        backgroundColor: BLUE_DARK,
        fontFamily: 'Plus Jakarta Sans',
        overflow: 'hidden',
      }}
    >
      {/* Mảng hình học phẳng ở góc phải, cùng tông xanh */}
      <div
        style={{
          position: 'absolute',
          right: -180,
          top: -160,
          width: 620,
          height: 620,
          borderRadius: 9999,
          backgroundColor: BLUE,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 90,
          bottom: -230,
          width: 420,
          height: 420,
          borderRadius: 9999,
          border: `48px solid ${BLUE}`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 14,
          height: '100%',
          backgroundColor: BLUE_LIGHT,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px 56px 86px',
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: BLUE_LIGHT,
              color: BLUE_DARK,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              padding: '10px 20px',
              borderRadius: 8,
              textTransform: 'uppercase',
            }}
          >
            {kicker}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: '#FFFFFF',
            fontSize: titleSize(title, 68),
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: -1,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logo} width={238} height={35} />
          <div style={{ display: 'flex', color: BLUE_LIGHT, fontSize: 22, fontWeight: 700 }}>clickstar.vn</div>
        </div>
      </div>
    </div>
  )
}

function ChecklistCover({
  title,
  kicker,
  points,
  logo,
}: {
  title: string
  kicker: string
  points: string[]
  logo: string
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: BLUE_LIGHT,
        fontFamily: 'Plus Jakarta Sans',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 620,
          height: '100%',
          padding: '60px 40px 52px 64px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              color: BLUE_DARK,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 22,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: 'flex',
              color: NAVY,
              fontSize: titleSize(title, 54),
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: -0.5,
            }}
          >
            {title}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={218} height={32} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: 580,
          height: '100%',
          padding: '48px 56px 48px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: '34px 34px 14px',
            boxShadow: '0 12px 32px rgba(21, 92, 189, 0.12)',
          }}
        >
          {points.slice(0, 3).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 22 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: BLUE,
                  marginRight: 18,
                  flexShrink: 0,
                }}
              >
                {/* Dấu tích vẽ bằng viền (font không có glyph ✓) */}
                <div
                  style={{
                    display: 'flex',
                    width: 11,
                    height: 20,
                    marginTop: -4,
                    borderRight: '4px solid #FFFFFF',
                    borderBottom: '4px solid #FFFFFF',
                    transform: 'rotate(45deg)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', color: NAVY, fontSize: 26, fontWeight: 700, lineHeight: 1.3, paddingTop: 3 }}>
                {p}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export type CoverInput = { title: string; kicker: string; points: string[] }

/** Dựng 2 biến thể ảnh bìa, trả PNG (Buffer). */
export async function renderCovers(input: CoverInput): Promise<Array<{ key: 'title' | 'checklist'; label: string; png: Buffer }>> {
  const a = await assets()
  const size = { width: 1200, height: 630 }
  const kicker = input.kicker.trim().slice(0, 28) || 'Góc nhìn'
  const title = input.title.trim().slice(0, 120)
  const points = input.points.map((p) => p.trim()).filter(Boolean).slice(0, 3)

  const toPng = async (el: React.ReactElement) => {
    const res = new ImageResponse(el, { ...size, fonts: a.fonts })
    return Buffer.from(await res.arrayBuffer())
  }

  const out: Array<{ key: 'title' | 'checklist'; label: string; png: Buffer }> = [
    { key: 'title', label: 'Tiêu đề lớn', png: await toPng(<TitleCover title={title} kicker={kicker} logo={a.logoWhite} />) },
  ]
  if (points.length >= 2) {
    out.push({
      key: 'checklist',
      label: 'Checklist',
      png: await toPng(<ChecklistCover title={title} kicker={kicker} points={points} logo={a.logoBlue} />),
    })
  }
  return out
}
