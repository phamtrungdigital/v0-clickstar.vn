'use client'

import { useState } from 'react'
import { 
  Shield, Plus, Edit2, Trash2, Users, Check, X, ChevronDown, ChevronRight,
  Settings, FileText, BarChart3, Mail, Database, Megaphone, Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Permission = {
  id: string
  label: string
  description: string
}

type PermissionGroup = {
  id: string
  label: string
  icon: any
  permissions: Permission[]
}

type Role = {
  id: string
  name: string
  description: string
  color: string
  userCount: number
  permissions: string[]
  isSystem?: boolean
}

const permissionGroups: PermissionGroup[] = [
  {
    id: 'system',
    label: 'Hệ thống',
    icon: Settings,
    permissions: [
      { id: 'system.full', label: 'Toàn quyền hệ thống', description: 'Truy cập tất cả chức năng' },
      { id: 'system.settings', label: 'Cài đặt hệ thống', description: 'Thay đổi cấu hình website' },
      { id: 'system.users', label: 'Quản lý người dùng', description: 'Thêm, sửa, xóa người dùng' },
      { id: 'system.roles', label: 'Quản lý phân quyền', description: 'Tạo và chỉnh sửa vai trò' },
    ]
  },
  {
    id: 'content',
    label: 'Nội dung',
    icon: FileText,
    permissions: [
      { id: 'content.view', label: 'Xem nội dung', description: 'Xem trang và bài viết' },
      { id: 'content.create', label: 'Tạo nội dung', description: 'Tạo trang và bài viết mới' },
      { id: 'content.edit', label: 'Chỉnh sửa nội dung', description: 'Sửa trang và bài viết' },
      { id: 'content.delete', label: 'Xóa nội dung', description: 'Xóa trang và bài viết' },
      { id: 'content.publish', label: 'Xuất bản', description: 'Xuất bản nội dung lên website' },
    ]
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: Search,
    permissions: [
      { id: 'seo.view', label: 'Xem SEO', description: 'Xem cấu hình SEO' },
      { id: 'seo.edit', label: 'Chỉnh sửa SEO', description: 'Thay đổi meta tags, sitemap' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    permissions: [
      { id: 'marketing.campaigns', label: 'Quản lý chiến dịch', description: 'Tạo và quản lý chiến dịch' },
      { id: 'marketing.email', label: 'Email Marketing', description: 'Gửi email marketing' },
      { id: 'marketing.leads', label: 'Quản lý leads', description: 'Xem và xử lý leads' },
    ]
  },
  {
    id: 'analytics',
    label: 'Phân tích',
    icon: BarChart3,
    permissions: [
      { id: 'analytics.view', label: 'Xem báo cáo', description: 'Xem các báo cáo phân tích' },
      { id: 'analytics.export', label: 'Xuất báo cáo', description: 'Tải xuống báo cáo' },
    ]
  },
  {
    id: 'integrations',
    label: 'Tích hợp',
    icon: Database,
    permissions: [
      { id: 'integrations.view', label: 'Xem tích hợp', description: 'Xem danh sách tích hợp' },
      { id: 'integrations.manage', label: 'Quản lý tích hợp', description: 'Kết nối và cấu hình tích hợp' },
    ]
  },
]

const initialRoles: Role[] = [
  { 
    id: 'admin', 
    name: 'Quản trị viên', 
    description: 'Toàn quyền quản lý hệ thống', 
    color: 'bg-red-500', 
    userCount: 2,
    permissions: ['system.full'],
    isSystem: true
  },
  { 
    id: 'editor', 
    name: 'Biên tập viên', 
    description: 'Quản lý nội dung và SEO', 
    color: 'bg-blue-500', 
    userCount: 3,
    permissions: ['content.view', 'content.create', 'content.edit', 'content.publish', 'seo.view', 'seo.edit']
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    description: 'Quản lý chiến dịch và leads', 
    color: 'bg-purple-500', 
    userCount: 4,
    permissions: ['marketing.campaigns', 'marketing.email', 'marketing.leads', 'analytics.view', 'analytics.export']
  },
  { 
    id: 'analyst', 
    name: 'Phân tích viên', 
    description: 'Xem và xuất báo cáo', 
    color: 'bg-emerald-500', 
    userCount: 2,
    permissions: ['analytics.view', 'analytics.export', 'integrations.view']
  },
  { 
    id: 'viewer', 
    name: 'Người xem', 
    description: 'Chỉ xem, không chỉnh sửa', 
    color: 'bg-slate-500', 
    userCount: 5,
    permissions: ['content.view', 'analytics.view']
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(permissionGroups.map(g => g.id))

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    )
  }

  const togglePermission = (permId: string) => {
    if (!editingRole) return
    const newPermissions = editingRole.permissions.includes(permId)
      ? editingRole.permissions.filter(p => p !== permId)
      : [...editingRole.permissions, permId]
    setEditingRole({ ...editingRole, permissions: newPermissions })
  }

  const saveRole = () => {
    if (!editingRole) return
    setRoles(prev => prev.map(r => r.id === editingRole.id ? editingRole : r))
    setEditingRole(null)
  }

  const hasPermission = (role: Role, permId: string) => {
    return role.permissions.includes('system.full') || role.permissions.includes(permId)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Phân quyền</h1>
          <p className="text-xs text-slate-500">Quản lý vai trò và quyền truy cập</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
          <Plus className="w-3.5 h-3.5" />
          Tạo vai trò mới
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Roles list */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Danh sách vai trò</h2>
          {roles.map(role => (
            <div 
              key={role.id}
              onClick={() => setEditingRole(role)}
              className={cn(
                "bg-white dark:bg-slate-800 rounded-lg border p-3 cursor-pointer transition-colors",
                editingRole?.id === role.id 
                  ? "border-primary" 
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", role.color)}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">{role.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{role.description}</p>
                </div>
                {role.isSystem && (
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-[9px] text-slate-500 rounded">Hệ thống</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {role.userCount} người dùng
                </span>
                <span className="text-[10px] text-slate-500">
                  {role.permissions.includes('system.full') ? 'Toàn quyền' : `${role.permissions.length} quyền`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Permissions editor */}
        <div className="lg:col-span-2">
          {editingRole ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", editingRole.color)}>
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{editingRole.name}</p>
                    <p className="text-[10px] text-slate-500">{editingRole.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!editingRole.isSystem && (
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                {permissionGroups.map(group => (
                  <div key={group.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className="w-full flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <group.icon className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-medium text-slate-900 dark:text-white">{group.label}</span>
                        <span className="text-[10px] text-slate-500">
                          ({group.permissions.filter(p => hasPermission(editingRole, p.id)).length}/{group.permissions.length})
                        </span>
                      </div>
                      {expandedGroups.includes(group.id) ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {expandedGroups.includes(group.id) && (
                      <div className="border-t border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                        {group.permissions.map(perm => {
                          const isChecked = hasPermission(editingRole, perm.id)
                          const isDisabled = editingRole.isSystem || editingRole.permissions.includes('system.full')
                          return (
                            <label 
                              key={perm.id}
                              className={cn(
                                "flex items-center justify-between p-2 cursor-pointer",
                                !isDisabled && "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-900 dark:text-white">{perm.label}</p>
                                <p className="text-[10px] text-slate-500">{perm.description}</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => !isDisabled && togglePermission(perm.id)}
                                disabled={isDisabled}
                                className="rounded border-slate-300 w-4 h-4 text-primary focus:ring-primary disabled:opacity-50"
                              />
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
                <button 
                  onClick={() => setEditingRole(null)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button 
                  onClick={saveRole}
                  className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
                  disabled={editingRole.isSystem}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
              <Shield className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm text-slate-900 dark:text-white font-medium">Chọn vai trò để xem quyền</p>
              <p className="text-xs text-slate-500 mt-1">Click vào một vai trò bên trái để xem và chỉnh sửa quyền</p>
            </div>
          )}
        </div>
      </div>

      {/* Permission matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ma trận phân quyền</h2>
          <p className="text-[10px] text-slate-500">Tổng quan quyền của tất cả vai trò</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900">
                <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Quyền</th>
                {roles.map(role => (
                  <th key={role.id} className="text-center px-2 py-2">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mb-0.5", role.color)}>
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">{role.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {permissionGroups.flatMap(group => 
                group.permissions.map(perm => (
                  <tr key={perm.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-3 py-1.5">
                      <p className="text-xs text-slate-900 dark:text-white">{perm.label}</p>
                    </td>
                    {roles.map(role => (
                      <td key={role.id} className="text-center px-2 py-1.5">
                        {hasPermission(role, perm.id) ? (
                          <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
