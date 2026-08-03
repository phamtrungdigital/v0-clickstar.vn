'use client'

import type { CodeTerminalContent } from '@/lib/cms/types'
import { I18nInput } from './i18n-input'

/**
 * Form khối "Cửa sổ code (terminal)". Mỗi dòng textarea = 1 dòng web gõ ra.
 * Ký tự đầu quyết định màu: $ lệnh · ✓ kết quả bước · → bước chạy (đuôi ✓
 * tô xanh) · ✦ dòng chốt · thụt khoảng trắng = output xám.
 */
export function CodeTerminalForm({
  content,
  onChange,
}: {
  content: CodeTerminalContent
  onChange: (next: CodeTerminalContent) => void
}) {
  const lines = content.lines ?? []

  const setLang = (lang: 'vi' | 'en', raw: string) => {
    const rows = raw.split('\n')
    // Ghép theo chỉ số dòng; bên kia thiếu thì giữ chuỗi rỗng
    const max = Math.max(rows.length, lines.length)
    const next: { vi: string; en: string }[] = []
    for (let i = 0; i < max; i++) {
      const cur = lines[i] ?? { vi: '', en: '' }
      next.push({ ...cur, [lang]: rows[i] ?? '' })
    }
    // Cắt đuôi các dòng rỗng cả 2 thứ tiếng
    while (next.length > 0 && !next[next.length - 1].vi && !next[next.length - 1].en) next.pop()
    onChange({ ...content, lines: next })
  }

  return (
    <div className="space-y-4">
      <div id="form-code_terminal.eyebrow" className="scroll-mt-32">
        <I18nInput
          label="Dòng chữ nhỏ phía trên (tuỳ chọn)"
          value={content.eyebrow ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, eyebrow: v })}
        />
      </div>

      <div id="form-code_terminal.sub" className="scroll-mt-32">
        <I18nInput
          label="Câu mô tả dưới tiêu đề (tuỳ chọn)"
          value={content.sub ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, sub: v })}
        />
      </div>

      <div id="form-code_terminal.tab" className="scroll-mt-32">
        <I18nInput
          label="Nhãn tab cửa sổ (tuỳ chọn)"
          value={content.tab ?? { vi: '', en: '' }}
          onChange={(v) => onChange({ ...content, tab: v })}
        />
        <p className="text-[10px] text-slate-500 mt-1">vd: clickstar-ops — zsh</p>
      </div>

      <div
        id="form-code_terminal.lines"
        className="scroll-mt-32 rounded-md border border-slate-200 dark:border-slate-700 p-2.5 space-y-2"
      >
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase">
          Các dòng code ({lines.length} dòng)
        </p>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Mỗi dòng 1 câu, web gõ lần lượt rồi lặp lại. Ký tự đầu quyết định màu:{' '}
          <code>$</code> dòng lệnh · <code>✓</code> kết quả bước · <code>→</code> bước chạy
          (kết thúc <code>✓</code> tô xanh) · <code>✦</code> dòng chốt · thụt đầu dòng bằng
          khoảng trắng = output xám.
        </p>
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Tiếng Việt</label>
          <textarea
            value={lines.map((l) => l.vi).join('\n')}
            onChange={(e) => setLang('vi', e.target.value)}
            rows={9}
            spellCheck={false}
            className="w-full px-2.5 py-2 bg-slate-900 text-green-300 font-mono text-xs rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-1">English</label>
          <textarea
            value={lines.map((l) => l.en).join('\n')}
            onChange={(e) => setLang('en', e.target.value)}
            rows={9}
            spellCheck={false}
            className="w-full px-2.5 py-2 bg-slate-900 text-green-300 font-mono text-xs rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
    </div>
  )
}
