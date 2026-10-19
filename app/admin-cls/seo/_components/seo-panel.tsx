'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { localizePath } from '@/lib/i18n/locale'
import { ImagePicker } from '@/app/admin-cls/pages/[slug]/edit/_components/image-picker'
import {
  DESC_MAX,
  TITLE_MAX,
  analyze,
  breadcrumbUrl,
  itemHasEn,
  measureDesc,
  measureTitle,
  suggestTitle,
  truncateChars,
  type Lang,
  type Level,
  type SeoDraft,
  type SeoItem,
} from '@/lib/seo/admin-seo'

export const TONE_TEXT: Record<Level, string> = {
  ok: 'text-emerald-600 dark:text-emerald-400',
  warn: 'text-amber-600 dark:text-amber-400',
  bad: 'text-red-600 dark:text-red-400',
}
export const TONE_BAR: Record<Level, string> = { ok: 'bg-emerald-500', warn: 'bg-amber-500', bad: 'bg-red-500' }

export const CARD = 'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'
export const INPUT =
  'w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 read-only:bg-slate-50 read-only:text-slate-500 dark:read-only:bg-slate-900/60'

export function FieldHead({ label, count, max, level }: { label: string; count: number; max: number; level: Level }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
      <span className={cn('text-[11px] tabular-nums', TONE_TEXT[level])}>
        {count} / {max} ký tự
      </span>
    </div>
  )
}

export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
      {children}
    </div>
  )
}

/**
 * Khối nhập SEO dùng chung cho ngăn sửa ở màn SEO và trình sửa bài viết:
 * tiêu đề, mô tả, ảnh chia sẻ, xem trước Google và thẻ chia sẻ, danh sách việc cần sửa.
 * Dữ liệu (draft) và ngôn ngữ (lang) do nơi dùng giữ, khối này chỉ hiển thị và báo thay đổi.
 */
export function SeoPanel({
  item,
  draft,
  onChange,
  lang,
  canEdit,
  pending = false,
  host,
  duplicateWith = [],
  layout = 'stack',
}: {
  item: SeoItem
  draft: SeoDraft
  /** Báo thay đổi bằng hàm cập nhật (không phải bản sao draft) để không ghi đè chữ gõ thêm trong lúc chờ tải ảnh lên. */
  onChange: (update: (d: SeoDraft) => SeoDraft) => void
  lang: Lang
  canEdit: boolean
  pending?: boolean
  host: string
  duplicateWith?: string[]
  /** 'stack': một cột (ngăn sửa hẹp). 'wide': hai cột, ô nhập bên trái, xem trước bên phải. */
  layout?: 'stack' | 'wide'
}) {
  const [serp, setSerp] = useState<'d' | 'm'>('d')

  const a = analyze(item, draft, duplicateWith)
  const title = measureTitle(item, draft, lang)
  const desc = measureDesc(item, draft, lang)
  const suggestion = lang === 'vi' && title.len > TITLE_MAX ? suggestTitle(title.raw) : ''
  const locked = !canEdit || pending

  const setText = (field: 'title' | 'desc', value: string) =>
    onChange((d) => ({ ...d, [lang]: { ...d[lang], [field]: value } }))

  const ogShown = draft.og || item.ogFallback
  const titleShown = truncateChars(title.shown, serp === 'd' ? TITLE_MAX : 56)
  const descShown = truncateChars(desc.shown, serp === 'd' ? DESC_MAX : 120)

  const fields = (
    <div className="space-y-4">
      {lang === 'en' && (
        <Note>
          Bản tiếng Anh nằm ở <span className="font-medium">{localizePath(item.path, 'en')}</span>.{' '}
          {item.kind === 'page' || item.kind === 'service'
            ? itemHasEn(item)
              ? 'Trang đã có tiêu đề SEO tiếng Anh nên bản /en được lập chỉ mục và đưa vào sitemap. Chỉ giữ khi nội dung tiếng Anh của trang đã dịch đủ; xóa tiêu đề để gỡ bản /en khỏi Google.'
              : 'Để trống thì bản /en dùng tạm chữ tiếng Việt và chưa được lập chỉ mục. Chỉ nhập khi nội dung tiếng Anh của trang đã dịch đủ: có tiêu đề tiếng Anh là bản /en được lập chỉ mục và đưa vào sitemap.'
            : `Để trống thì dùng bản tiếng Việt.${itemHasEn(item) ? '' : ' Mục này chưa đủ nội dung tiếng Anh nên bản /en chưa được lập chỉ mục.'}`}
        </Note>
      )}

      <div>
        <FieldHead label="Tiêu đề SEO" count={title.len} max={TITLE_MAX} level={title.level} />
        <textarea
          value={item.editable ? draft[lang].title : title.raw}
          onChange={(e) => setText('title', e.target.value)}
          readOnly={locked}
          rows={2}
          maxLength={200}
          placeholder={title.fromFallback ? title.raw : undefined}
          className={cn(INPUT, 'resize-none')}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Hệ thống tự thêm “| Click Star” ở cuối.
          {item.editable && ' Để trống thì dùng tên mục'}
          {item.editable && title.fromFallback && title.raw ? `: “${truncateChars(title.raw, 60)}”` : ''}
          {item.editable && '.'}
        </p>
        {canEdit && suggestion && (
          <div className="mt-1.5 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2.5 py-2 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <span className="flex-1 min-w-0">
              Gợi ý: <b className="font-medium">{suggestion}</b>
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() => setText('title', suggestion)}
              className="shrink-0 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
              Dùng gợi ý
            </button>
          </div>
        )}
      </div>

      <div>
        <FieldHead label="Mô tả SEO" count={desc.len} max={DESC_MAX} level={desc.level} />
        <textarea
          value={item.editable ? draft[lang].desc : desc.raw}
          onChange={(e) => setText('desc', e.target.value)}
          readOnly={locked}
          rows={3}
          maxLength={400}
          placeholder={desc.fromFallback ? desc.raw : undefined}
          className={cn(INPUT, 'resize-none')}
        />
        {desc.fromFallback && desc.len > 0 && item.descFallbackNote && (
          <p className="mt-1 text-[11px] text-slate-500">
            {item.descFallbackNote}
            {item.editable && ' Nhập riêng để kiểm soát câu hiện trên Google.'}
          </p>
        )}
      </div>

      {item.kind !== 'project' && canEdit && (
        <div>
          <ImagePicker
            label="Ảnh chia sẻ (hiện khi gửi link lên Facebook, Zalo)"
            value={draft.og}
            onChange={(v) => {
              if (pending) return
              onChange((d) => ({ ...d, og: v }))
            }}
            hint={
              item.ogFallback && !draft.og
                ? 'Đang dùng ảnh bìa của bài. Tải ảnh khác lên nếu muốn ảnh riêng. Tỷ lệ tốt nhất 1200×630px.'
                : 'Tỷ lệ tốt nhất 1200×630px.'
            }
          />
        </div>
      )}

    </div>
  )

  const previews = (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Xem trước trên Google (ước lượng)</span>
          <span className="flex gap-1 shrink-0">
            {(
              [
                ['d', 'Máy tính'],
                ['m', 'Điện thoại'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSerp(id)}
                className={cn(
                  'text-[11px] px-2 py-0.5 rounded-full border',
                  serp === id
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'border-slate-300 dark:border-slate-600 text-slate-500'
                )}
              >
                {label}
              </button>
            ))}
          </span>
        </div>
        <div
          className={cn(
            'rounded-lg bg-white border border-slate-200 dark:border-slate-600 px-3.5 py-3 text-left',
            serp === 'm' && 'max-w-[360px]'
          )}
        >
          <div className="text-[12px] text-slate-600 truncate">{breadcrumbUrl(host, lang === 'en' ? localizePath(item.path, 'en') : item.path)}</div>
          <div className="text-[18px] leading-snug text-[#1a0dab] mt-0.5 break-words">{titleShown || 'Chưa có tiêu đề'}</div>
          <div className="text-[13px] leading-snug text-slate-600 mt-0.5 break-words">
            {descShown || 'Chưa có mô tả: Google sẽ tự chọn một đoạn trong trang.'}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Khi chia sẻ lên Facebook, Zalo</div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden max-w-[380px] bg-white dark:bg-slate-800">
          {ogShown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ogShown} alt="" className="w-full aspect-[1200/630] object-cover bg-slate-100" />
          ) : (
            <div className="w-full aspect-[1200/630] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[11px] text-slate-500">
              Dùng ảnh mặc định của site
            </div>
          )}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50">
            <div className="text-[10px] uppercase text-slate-500">{host}</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">{title.shown}</div>
            <div className="text-xs text-slate-500 line-clamp-2">{desc.shown}</div>
          </div>
        </div>
      </div>

    </div>
  )

  const checks = (
    <div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Kiểm tra</div>
        {a.issues.length === 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Mục này đạt các kiểm tra cơ bản.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {a.issues.map((iss, i) => (
              <li key={i} className="flex gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                <AlertTriangle className={cn('w-4 h-4 shrink-0 mt-0.5', iss.level === 'bad' ? TONE_TEXT.bad : TONE_TEXT.warn)} />
                <span>{iss.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
  )

  if (layout === 'wide') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
        <div className="space-y-5 min-w-0">
          {fields}
          {checks}
        </div>
        <div className="min-w-0">{previews}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {fields}
      {previews}
      {checks}
    </div>
  )
}
