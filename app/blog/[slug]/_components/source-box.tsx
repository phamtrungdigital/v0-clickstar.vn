import { Children, isValidElement, type ReactNode } from 'react'

/** Tiêu đề cố định của khung nguồn. Đoạn đầu của một khối trích dẫn (>) bắt đầu bằng đúng chữ này thì được vẽ thành khung. */
const TITLES = ['Nguồn gốc và lưu ý', 'Sources and notes']

function textOf(n: ReactNode): string {
  if (typeof n === 'string') return n
  if (typeof n === 'number') return String(n)
  if (Array.isArray(n)) return n.map(textOf).join('')
  if (isValidElement(n)) return textOf((n.props as { children?: ReactNode }).children)
  return ''
}

/**
 * Nhận ra khối trích dẫn dạng:
 *   > **Nguồn gốc và lưu ý** · Đối chiếu ngày 21/10/2026
 *   > - [x] [Tên tài liệu](https://...) · nguồn
 *   > - [ ] Lưu ý dành cho người đọc
 * Không đúng dạng này thì trả null và khối vẫn hiện như trích dẫn thường.
 */
export function splitSourceBox(children: ReactNode): { title: string; date: string; rest: ReactNode[] } | null {
  const items = Children.toArray(children).filter((c) => !(typeof c === 'string' && c.trim() === ''))
  if (items.length < 2) return null
  const head = textOf(items[0]).trim()
  const title = TITLES.find((t) => head.startsWith(t))
  if (!title) return null
  const date = head.slice(title.length).replace(/^\s*[·|-]\s*/, '').trim()
  return { title, date, rest: items.slice(1) }
}

export function SourceBox({ title, date, rest }: { title: string; date: string; rest: ReactNode[] }) {
  return (
    <aside className="bp-src" aria-label={title}>
      <div className="bp-src-top">
        <p className="bp-src-ttl">{title}</p>
        {date && <span className="bp-src-dt">{date}</span>}
      </div>
      {rest}
    </aside>
  )
}
