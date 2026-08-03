'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { TechPipelineContent, TechPipelineGroup, ClientLogoItem } from '@/lib/cms/types'
import { I18nInput, TextInput } from './i18n-input'
import { ImagePicker } from './image-picker'

/**
 * Form khối "Sơ đồ công nghệ (pipeline)". Mỗi tầng có: tiêu đề, dòng phụ,
 * danh sách logo (CÓ TÊN hiển thị) và tuỳ chọn các dòng code cho terminal.
 * Dòng code nhập mỗi dòng 1 câu; ký tự đầu quyết định màu: $ lệnh, → bước
 * chạy (kết thúc ✓ được tô xanh), ✦ dòng kết quả.
 */
export function TechPipelineForm({
  content,
  onChange,
}: {
  content: TechPipelineContent
  onChange: (next: TechPipelineContent) => void
}) {
  const groups = content.groups ?? []

  const updateGroup = (idx: number, next: TechPipelineGroup) => {
    const arr = [...groups]
    arr[idx] = next
    onChange({ ...content, groups: arr })
  }
  const addGroup = () =>
    onChange({
      ...content,
      groups: [...groups, { title: { vi: '', en: '' }, caption: { vi: '', en: '' }, items: [] }],
    })
  const removeGroup = (idx: number) =>
    onChange({ ...content, groups: groups.filter((_, i) => i !== idx) })
  const moveGroup = (idx: number, dir: -1 | 1) => {
    const to = idx + dir
    if (to < 0 || to >= groups.length) return
    const arr = [...groups]
    ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
    onChange({ ...content, groups: arr })
  }

  return (
    <div className="space-y-4">
      <div id="form-tech_pipeline.eyebrow" className="scroll-mt-32">
        <I18nInput
          label="Dòng chữ nhỏ phía trên"
          value={content.eyebrow}
          onChange={(v) => onChange({ ...content, eyebrow: v })}
        />
        <p className="text-[10px] text-slate-500 mt-1">
          vd: HỆ SINH THÁI CÔNG NGHỆ CLICK STAR. Để trống thì không hiện.
        </p>
      </div>

      <div id="form-tech_pipeline.sub" className="scroll-mt-32">
        <I18nInput
          label="Câu mô tả dưới tiêu đề"
          value={content.sub ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, sub: v })}
        />
      </div>

      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
            {groups.length} tầng (thứ tự = chiều dữ liệu chảy)
          </p>
          <button
            type="button"
            onClick={addGroup}
            className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-3 h-3" />
            Thêm tầng
          </button>
        </div>

        {groups.map((group, gi) => (
          <details
            key={gi}
            id={`form-tech_pipeline.group.${gi}`}
            open={gi === 0}
            className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
          >
            <summary className="px-3 py-2 cursor-pointer text-sm font-medium select-none flex items-center justify-between">
              <span className="truncate">
                Tầng {gi + 1}: {group.title?.vi || '(chưa đặt tên)'}
              </span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    moveGroup(gi, -1)
                  }}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  title="Lên trên"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    moveGroup(gi, 1)
                  }}
                  className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  title="Xuống dưới"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm(`Xoá tầng "${group.title?.vi || gi + 1}" và toàn bộ logo trong đó?`))
                      removeGroup(gi)
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            </summary>

            <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
              <I18nInput
                label="Tiêu đề tầng"
                value={group.title}
                onChange={(v) => updateGroup(gi, { ...group, title: v })}
              />
              <I18nInput
                label="Dòng phụ (tuỳ chọn)"
                value={group.caption ?? { vi: '', en: '' }}
                onChange={(v) => updateGroup(gi, { ...group, caption: v })}
              />

              <TerminalEditor group={group} onChange={(next) => updateGroup(gi, next)} />

              <GroupItems group={group} groupIndex={gi} onChange={(next) => updateGroup(gi, next)} />
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

/** Ô nhập dòng code terminal: mỗi dòng textarea = 1 dòng gõ trên web */
function TerminalEditor({
  group,
  onChange,
}: {
  group: TechPipelineGroup
  onChange: (next: TechPipelineGroup) => void
}) {
  const lines = group.terminal ?? []

  const setLang = (lang: 'vi' | 'en', raw: string) => {
    const rows = raw.split('\n')
    // Ghép theo chỉ số dòng; dòng thiếu bên kia thì giữ chuỗi rỗng
    const max = Math.max(rows.length, lines.length)
    const next: { vi: string; en: string }[] = []
    for (let i = 0; i < max; i++) {
      const cur = lines[i] ?? { vi: '', en: '' }
      next.push({ ...cur, [lang]: rows[i] ?? '' })
    }
    // Cắt đuôi các dòng rỗng cả 2 thứ tiếng
    while (next.length > 0 && !next[next.length - 1].vi && !next[next.length - 1].en) next.pop()
    onChange({ ...group, terminal: next.length > 0 ? next : undefined })
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2.5 space-y-2">
      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
        Terminal gõ code (tuỳ chọn)
      </p>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Mỗi dòng 1 câu, web sẽ gõ lần lượt rồi lặp lại. Ký tự đầu quyết định màu:{' '}
        <code>$</code> dòng lệnh · <code>→</code> bước chạy (kết thúc bằng <code>✓</code> sẽ
        tô xanh) · <code>✦</code> dòng kết quả. Để trống cả ô = tầng không có terminal.
      </p>
      <div>
        <label className="block text-[10px] font-medium text-slate-500 mb-1">Tiếng Việt</label>
        <textarea
          value={lines.map((l) => l.vi).join('\n')}
          onChange={(e) => setLang('vi', e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full px-2.5 py-2 bg-slate-900 text-green-300 font-mono text-xs rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div>
        <label className="block text-[10px] font-medium text-slate-500 mb-1">English</label>
        <textarea
          value={lines.map((l) => l.en).join('\n')}
          onChange={(e) => setLang('en', e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full px-2.5 py-2 bg-slate-900 text-green-300 font-mono text-xs rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  )
}

/** Danh sách logo của 1 tầng — giống form Dải logo nhưng TÊN sẽ hiển thị dưới logo */
function GroupItems({
  group,
  groupIndex,
  onChange,
}: {
  group: TechPipelineGroup
  groupIndex: number
  onChange: (next: TechPipelineGroup) => void
}) {
  const items = group.items ?? []

  const updateItem = (idx: number, next: ClientLogoItem) => {
    const arr = [...items]
    arr[idx] = next
    onChange({ ...group, items: arr })
  }
  const addItem = () =>
    onChange({ ...group, items: [...items, { logo: '', name: { vi: '', en: '' }, href: '' }] })
  const removeItem = (idx: number) => onChange({ ...group, items: items.filter((_, i) => i !== idx) })
  const move = (idx: number, dir: -1 | 1) => {
    const to = idx + dir
    if (to < 0 || to >= items.length) return
    const arr = [...items]
    ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
    onChange({ ...group, items: arr })
  }

  return (
    <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          {items.length} logo
        </p>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded"
        >
          <Plus className="w-3 h-3" />
          Thêm logo
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
          Tầng chưa có logo nào sẽ tự ẩn khỏi trang.
        </p>
      )}

      {items.map((item, idx) => (
        <details
          key={idx}
          id={`form-tech_pipeline.group.${groupIndex}.item.${idx}`}
          className="bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-700 scroll-mt-32"
        >
          <summary className="px-3 py-1.5 cursor-pointer text-xs font-medium select-none flex items-center justify-between">
            <span className="truncate">
              {idx + 1}. {item.name?.vi || '(chưa đặt tên)'}
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  move(idx, -1)
                }}
                className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                title="Lên trên"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  move(idx, 1)
                }}
                className="px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                title="Xuống dưới"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm(`Xoá logo "${item.name?.vi || idx + 1}"?`)) removeItem(idx)
                }}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          </summary>

          <div className="p-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
            <ImagePicker
              label="Ảnh logo"
              value={item.logo}
              onChange={(v) => updateItem(idx, { ...item, logo: v })}
              hint="Ưu tiên SVG hoặc PNG nền trong suốt."
            />
            <div>
              <I18nInput
                label="Tên (bắt buộc — HIỂN THỊ dưới logo)"
                value={item.name}
                onChange={(v) => updateItem(idx, { ...item, name: v })}
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Khác dải logo thường: tên ở khối này hiện ngay dưới logo cho dễ nhận diện.
              </p>
            </div>
            <TextInput
              label="Link (tuỳ chọn)"
              value={item.href ?? ''}
              onChange={(v) => updateItem(idx, { ...item, href: v })}
              hint="Để trống thì logo không bấm được. Có link sẽ mở ở tab mới."
            />
          </div>
        </details>
      ))}
    </div>
  )
}
