import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Card, Chip, EmptyState, SectionCard, StatCard, btn, searchInputClass } from '@/components/admin/ui'
import { choiceOf, type ConsentAction, type ConsentReport } from '@/lib/cms/consent-report'

/** Tab "Đồng ý cookie" của màn Báo cáo. Server component: tra cứu bằng form GET (?q=), không cần JavaScript. */

const n = (x: number) => x.toLocaleString('vi-VN')
const pct = (part: number, total: number) =>
  total ? `${((part / total) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%` : '0%'

const ACTIONS: { key: ConsentAction; label: string; color: string }[] = [
  { key: 'accept_all', label: 'Đồng ý tất cả', color: '#1e6dda' },
  { key: 'custom', label: 'Tùy chỉnh', color: '#7ab3ff' },
  { key: 'reject_all', label: 'Từ chối', color: '#8e8e93' },
  { key: 'withdraw', label: 'Rút lại', color: '#ff9f0a' },
]
const ACTION_LABEL = Object.fromEntries(ACTIONS.map((a) => [a.key, a.label])) as Record<ConsentAction, string>

// Giờ Việt Nam cố định (máy chủ chạy UTC).
const fmtTime = (iso: string) => {
  const d = new Date(new Date(iso).getTime() + 7 * 3600_000).toISOString()
  return `${d.slice(11, 16)} ${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`
}
const fmtDay = (key: string) => `${key.slice(8, 10)}/${key.slice(5, 7)}`

export function ConsentReportView({ data }: { data: ConsentReport }) {
  if (!data.allowed) {
    return (
      <Card>
        <EmptyState
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Chỉ quản trị viên xem được sổ đồng ý"
          description="Sổ đồng ý cookie là bằng chứng pháp lý, chỉ tài khoản quyền Quản trị viên mới đọc được."
        />
      </Card>
    )
  }

  const k = data.kpis
  const base = `/admin-cls/reports?tab=consent&days=${data.days}`

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Khách đã chọn" value={n(k.visitors)} note={`${n(k.events)} lượt chọn, ${n(k.changed)} khách đổi ý`} />
        <StatCard label="Đồng ý tất cả" value={pct(k.all, k.visitors)} note={`${n(k.all)} khách`} tone="ok" />
        <StatCard label="Tùy chỉnh một phần" value={pct(k.partial, k.visitors)} note={`${n(k.partial)} khách`} />
        <StatCard label="Từ chối" value={pct(k.none, k.visitors)} note={`${n(k.none)} khách`} tone={k.none ? 'warn' : 'neutral'} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard
          title="Lượt chọn theo ngày"
          description="Mỗi lần khách bấm Đồng ý, Từ chối hoặc Lưu lựa chọn là một lượt (giờ Việt Nam)."
        >
          <DailyBars data={data} />
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Cho phép theo nhóm" description="Theo lựa chọn mới nhất của mỗi khách.">
            <Meter label="Đo lường truy cập" sub="GA4, CDP Click Star ghi nhận được" part={k.analytics} total={k.visitors} />
            <Meter label="Cá nhân hóa và quảng cáo" sub="Gợi ý theo lịch sử xem, Google Signals" part={k.marketing} total={k.visitors} />
          </SectionCard>
          <SectionCard title="Nơi khách chọn">
            {data.pages.length ? (
              <ul className="space-y-1.5 text-[13.5px]">
                {data.pages.map((p) => (
                  <li key={p.path} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate text-[var(--ad-fg)]" title={p.path}>
                      {p.path}
                    </span>
                    <span className="flex-none tabular-nums text-[var(--ad-fg-2)]">{n(p.count)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-[var(--ad-fg-3)]">Chưa có lượt nào trong kỳ.</p>
            )}
            {data.langs.length ? (
              <p className="mt-3 text-[12.5px] text-[var(--ad-fg-3)]">
                {data.langs.map((l) => `${l.lang === 'en' ? 'Tiếng Anh' : l.lang === 'vi' ? 'Tiếng Việt' : l.lang} ${n(l.count)}`).join(' · ')}
              </p>
            ) : null}
          </SectionCard>
        </div>
      </div>

      <SectionCard
        title="Danh sách lượt chọn"
        description={
          data.query
            ? `${n(data.listTotal)} lượt khớp "${data.query}"${data.query.length === 36 ? ' (toàn bộ lịch sử)' : ' trong kỳ'}`
            : `${n(data.listTotal)} lượt trong kỳ${data.listTotal > data.list.length ? `, hiện ${n(data.list.length)} lượt mới nhất` : ''}`
        }
        bodyClassName="px-0 pb-2"
      >
        <form action="/admin-cls/reports" method="get" className="mb-3 flex flex-wrap items-center gap-2 px-5">
          <input type="hidden" name="tab" value="consent" />
          <input type="hidden" name="days" value={data.days} />
          <input
            name="q"
            defaultValue={data.query}
            placeholder="Tra mã khách (mã lựa chọn trong Cài đặt cookie của khách)"
            aria-label="Tra mã khách"
            className={`${searchInputClass} w-full max-w-[420px]`}
          />
          <button type="submit" className={btn('primary')}>
            Tra cứu
          </button>
          {data.query ? (
            <Link href={base} className={btn('secondary')}>
              Bỏ lọc
            </Link>
          ) : null}
        </form>

        {data.list.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-[13.5px]">
              <thead className="text-[12.5px] text-[var(--ad-fg-3)]">
                <tr className="border-b border-[var(--ad-line)]">
                  <th className="px-5 py-2 font-medium">Thời điểm</th>
                  <th className="px-3 py-2 font-medium">Mã khách</th>
                  <th className="px-3 py-2 font-medium">Bấm</th>
                  <th className="px-3 py-2 font-medium">Đo lường</th>
                  <th className="px-3 py-2 font-medium">Cá nhân hóa</th>
                  <th className="px-3 py-2 font-medium">Trang</th>
                  <th className="px-5 py-2 font-medium">Phiên bản</th>
                </tr>
              </thead>
              <tbody>
                {data.list.map((r) => {
                  const c = choiceOf(r)
                  return (
                    <tr key={r.id} className="border-b border-[var(--ad-line)] last:border-0">
                      <td className="whitespace-nowrap px-5 py-2 tabular-nums text-[var(--ad-fg-2)]">{fmtTime(r.createdAt)}</td>
                      <td className="px-3 py-2">
                        <Link
                          href={`${base}&q=${r.visitorId}`}
                          title={`Xem lịch sử của ${r.visitorId}`}
                          className="font-mono text-[12.5px] text-[var(--ad-accent)] hover:underline"
                        >
                          {r.visitorId.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <Chip tone={c === 'all' ? 'ok' : c === 'none' ? 'neutral' : 'blue'}>{ACTION_LABEL[r.action]}</Chip>
                      </td>
                      <td className="px-3 py-2">{r.analytics ? 'Có' : 'Không'}</td>
                      <td className="px-3 py-2">{r.marketing ? 'Có' : 'Không'}</td>
                      <td className="max-w-[220px] truncate px-3 py-2 text-[var(--ad-fg-2)]" title={r.pagePath ?? ''}>
                        {r.lang === 'en' ? 'EN · ' : ''}
                        {r.pagePath || '-'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-2 tabular-nums text-[var(--ad-fg-3)]">{r.policyVersion}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-center text-[13.5px] text-[var(--ad-fg-3)]">
            {data.query ? 'Không có lượt nào khớp mã này.' : 'Chưa có lượt chọn nào trong kỳ.'}
          </p>
        )}
      </SectionCard>

      <p className="text-[12.5px] leading-relaxed text-[var(--ad-fg-3)]">
        Sổ chỉ ghi khách đã bấm chọn. Khách lướt qua mà không bấm gì không được ghi, và website coi như chưa đồng ý (không chạy GA4,
        CDP). Sổ không lưu tên, email hay địa chỉ IP; không sửa, không xoá được.
      </p>
    </div>
  )
}

function DailyBars({ data }: { data: ConsentReport }) {
  const max = Math.max(1, ...data.daily.map((d) => ACTIONS.reduce((s, a) => s + d.counts[a.key], 0)))
  const every = data.days <= 7 ? 1 : data.days <= 30 ? 5 : 15
  return (
    <div>
      <div className="flex h-[180px] items-end gap-[3px]" role="img" aria-label="Biểu đồ lượt chọn theo ngày">
        {data.daily.map((d) => {
          const total = ACTIONS.reduce((s, a) => s + d.counts[a.key], 0)
          const title = `${fmtDay(d.day)}: ${total} lượt${total ? ` (${ACTIONS.filter((a) => d.counts[a.key]).map((a) => `${a.label} ${d.counts[a.key]}`).join(', ')})` : ''}`
          return (
            <div key={d.day} title={title} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div className="flex flex-col-reverse overflow-hidden rounded-t-[3px]" style={{ height: `${(total / max) * 100}%` }}>
                {ACTIONS.map((a) =>
                  d.counts[a.key] ? (
                    <div key={a.key} style={{ height: `${(d.counts[a.key] / total) * 100}%`, background: a.color }} />
                  ) : null
                )}
              </div>
              {!total ? <div className="h-[2px] rounded bg-[var(--ad-fill-2)]" /> : null}
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-[3px] text-[11px] tabular-nums text-[var(--ad-fg-3)]">
        {data.daily.map((d, i) => (
          <div key={d.day} className="min-w-0 flex-1 overflow-visible whitespace-nowrap">
            {i % every === 0 ? fmtDay(d.day) : ''}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[var(--ad-fg-2)]">
        {ACTIONS.map((a) => (
          <span key={a.key} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: a.color }} />
            {a.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Meter({ label, sub, part, total }: { label: string; sub: string; part: number; total: number }) {
  const w = total ? (part / total) * 100 : 0
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[14px] font-medium text-[var(--ad-fg)]">{label}</span>
        <span className="text-[14px] font-semibold tabular-nums text-[var(--ad-fg)]">{pct(part, total)}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--ad-fill)]">
        <div className="h-full rounded-full bg-[var(--ad-accent)]" style={{ width: `${w}%` }} />
      </div>
      <p className="mt-1 text-[12px] text-[var(--ad-fg-3)]">
        {sub} · {n(part)}/{n(total)} khách
      </p>
    </div>
  )
}
