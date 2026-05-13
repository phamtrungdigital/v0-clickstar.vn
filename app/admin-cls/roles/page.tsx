import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function RolesPage() {
  return (
    <div className="space-y-3 max-w-3xl">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Phân quyền</h1>
        <p className="text-xs text-slate-500">
          Hiện tại có 3 role trong DB. Phân quyền chi tiết theo route sẽ enforce ở phase sau.
        </p>
      </div>

      <div className="space-y-2">
        <RoleCard
          name="Admin"
          color="emerald"
          desc="Toàn quyền: edit content, quản lý posts, leads, users, settings."
        />
        <RoleCard
          name="Editor"
          color="blue"
          desc="Edit content + posts. Không quản lý users/settings/leads. (Chưa enforce — hiện tại có toàn quyền)"
        />
        <RoleCard
          name="Viewer"
          color="slate"
          desc="Chỉ xem dashboard + content. Không edit. (Chưa enforce — hiện tại có toàn quyền)"
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
        <strong>⚠ Lưu ý:</strong> Hiện tại tất cả các role đều có toàn quyền truy cập admin (do RLS chỉ check
        is_active=true). Khi cần phân quyền thật sự (vd Viewer chỉ xem được), em sẽ refactor middleware + RLS
        để check theo `role`.
      </div>

      <p className="text-xs text-slate-500">
        Đổi role của user tại{' '}
        <Link href="/admin-cls/users" className="text-primary hover:underline">
          /admin-cls/users
        </Link>
      </p>
    </div>
  )
}

const COLORS: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
}

function RoleCard({ name, color, desc }: { name: string; color: string; desc: string }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${COLORS[color]}`}>
      <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-sm">{name}</h3>
        <p className="text-xs mt-1 opacity-80">{desc}</p>
      </div>
    </div>
  )
}
