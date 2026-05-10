'use client'

import { useState } from 'react'
import { 
  Search, Plus, MoreHorizontal, Shield, User, Mail, Calendar,
  Edit2, Trash2, Key, CheckCircle, XCircle, Filter, Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

const users = [
  { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@clickstar.vn', role: 'admin', status: 'active', lastLogin: '2 phút trước', avatar: 'A' },
  { id: 2, name: 'Trần Thị Editor', email: 'editor@clickstar.vn', role: 'editor', status: 'active', lastLogin: '1 giờ trước', avatar: 'E' },
  { id: 3, name: 'Lê Văn Marketing', email: 'marketing@clickstar.vn', role: 'marketing', status: 'active', lastLogin: '3 giờ trước', avatar: 'M' },
  { id: 4, name: 'Phạm Thị Viewer', email: 'viewer@clickstar.vn', role: 'viewer', status: 'inactive', lastLogin: '2 ngày trước', avatar: 'V' },
  { id: 5, name: 'Hoàng Văn SEO', email: 'seo@clickstar.vn', role: 'editor', status: 'active', lastLogin: '5 giờ trước', avatar: 'S' },
]

const roles = [
  { 
    id: 'admin', 
    name: 'Quản trị viên', 
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    permissions: ['Toàn quyền hệ thống', 'Quản lý người dùng', 'Cấu hình website', 'Xem báo cáo', 'Chỉnh sửa nội dung']
  },
  { 
    id: 'editor', 
    name: 'Biên tập viên', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    permissions: ['Chỉnh sửa nội dung', 'Tạo bài viết', 'Upload media', 'Xem báo cáo cơ bản']
  },
  { 
    id: 'marketing', 
    name: 'Marketing', 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    permissions: ['Quản lý chiến dịch', 'Xem báo cáo', 'Quản lý leads', 'Gửi email']
  },
  { 
    id: 'viewer', 
    name: 'Người xem', 
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    permissions: ['Xem nội dung', 'Xem báo cáo cơ bản']
  },
]

const allPermissions = [
  { id: 'system.full', label: 'Toàn quyền hệ thống', category: 'Hệ thống' },
  { id: 'users.manage', label: 'Quản lý người dùng', category: 'Hệ thống' },
  { id: 'settings.config', label: 'Cấu hình website', category: 'Hệ thống' },
  { id: 'content.edit', label: 'Chỉnh sửa nội dung', category: 'Nội dung' },
  { id: 'content.create', label: 'Tạo bài viết', category: 'Nội dung' },
  { id: 'content.delete', label: 'Xóa nội dung', category: 'Nội dung' },
  { id: 'media.upload', label: 'Upload media', category: 'Media' },
  { id: 'media.delete', label: 'Xóa media', category: 'Media' },
  { id: 'reports.view', label: 'Xem báo cáo', category: 'Báo cáo' },
  { id: 'reports.export', label: 'Xuất báo cáo', category: 'Báo cáo' },
  { id: 'campaigns.manage', label: 'Quản lý chiến dịch', category: 'Marketing' },
  { id: 'leads.manage', label: 'Quản lý leads', category: 'Marketing' },
  { id: 'email.send', label: 'Gửi email', category: 'Marketing' },
]

type UserType = {
  id: number
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
  avatar: string
  permissions?: string[]
}

export default function UsersPage() {
  const [userList, setUserList] = useState<UserType[]>(users.map(u => ({
    ...u,
    permissions: roles.find(r => r.id === u.role)?.permissions || []
  })))
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRolesPanel, setShowRolesPanel] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', status: '', permissions: [] as string[] })

  const filteredUsers = userList.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = selectedRole === 'all' || user.role === selectedRole
    return matchSearch && matchRole
  })

  const getRoleInfo = (roleId: string) => roles.find(r => r.id === roleId)

  const startEditUser = (user: UserType) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions || []
    })
  }

  const saveUser = () => {
    if (!editingUser) return
    setUserList(prev => prev.map(u => 
      u.id === editingUser.id 
        ? { ...u, ...editForm }
        : u
    ))
    setEditingUser(null)
  }

  const togglePermission = (permId: string) => {
    setEditForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }))
  }

  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = []
    acc[perm.category].push(perm)
    return acc
  }, {} as Record<string, typeof allPermissions>)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quản lý tài khoản và phân quyền</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowRolesPanel(!showRolesPanel)}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Shield className="w-3.5 h-3.5" />
            Phân quyền
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm người dùng
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Users list */}
        <div className={cn("lg:col-span-2", showRolesPanel && "lg:col-span-2")}>
          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 mb-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
              >
                <option value="all">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <button className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Users table */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Người dùng</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase">Vai trò</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase hidden sm:table-cell">Trạng thái</th>
                  <th className="text-left px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase hidden md:table-cell">Đăng nhập</th>
                  <th className="text-right px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role)
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary text-[10px] font-medium">{user.avatar}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className={cn("px-1.5 py-0.5 text-[10px] font-medium rounded", roleInfo?.color)}>
                          {roleInfo?.name}
                        </span>
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded",
                          user.status === 'active' 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                        )}>
                          {user.status === 'active' ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                          {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[10px] text-slate-500 hidden md:table-cell">{user.lastLogin}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => startEditUser(user)}
                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" 
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-3 h-3 text-slate-400" />
                          </button>
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Đổi mật khẩu">
                            <Key className="w-3 h-3 text-slate-400" />
                          </button>
                          <button className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Xóa">
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>Hiển thị 1-{filteredUsers.length} của {userList.length} người dùng</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Trước</button>
              <button className="px-2 py-1 bg-primary text-white rounded">1</button>
              <button className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700">Sau</button>
            </div>
          </div>
        </div>

        {/* Roles panel */}
        {showRolesPanel && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Vai trò & Quyền hạn</h2>
                <button className="text-xs text-primary hover:underline">+ Tạo vai trò</button>
              </div>
              
              <div className="space-y-3">
                {roles.map((role) => (
                  <div key={role.id} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("px-1.5 py-0.5 text-[10px] font-medium rounded", role.color)}>
                        {role.name}
                      </span>
                      <button className="text-[10px] text-slate-500 hover:text-primary">Sửa</button>
                    </div>
                    <ul className="space-y-1">
                      {role.permissions.map((perm, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show roles panel toggle when hidden */}
        {!showRolesPanel && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Thống kê</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Tổng người dùng</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{userList.length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Đang hoạt động</span>
                  <span className="text-sm font-semibold text-emerald-600">{userList.filter(u => u.status === 'active').length}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Admin</span>
                  <span className="text-sm font-semibold text-red-600">{userList.filter(u => u.role === 'admin').length}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowRolesPanel(true)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Shield className="w-3.5 h-3.5" />
                Xem phân quyền
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add user modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md mx-4 p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Thêm người dùng mới</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Họ tên</label>
                <input type="text" className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" placeholder="Nhập họ tên" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                <input type="email" className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Vai trò</label>
                <select className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900">
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Mật khẩu</label>
                <input type="password" className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Hủy
              </button>
              <button className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
                Tạo người dùng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit user modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Chỉnh sửa: {editingUser.name}</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <XCircle className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="p-3 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Basic info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Thông tin cơ bản</h4>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Họ tên</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Vai trò</label>
                    <select 
                      value={editForm.role}
                      onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Trạng thái</label>
                    <select 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="suspended">Tạm khóa</option>
                    </select>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phân quyền chi tiết</h4>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-2 max-h-64 overflow-y-auto">
                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category} className="mb-3">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">{category}</p>
                        <div className="space-y-1">
                          {perms.map(perm => (
                            <label key={perm.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={editForm.permissions.includes(perm.id)}
                                onChange={() => togglePermission(perm.id)}
                                className="rounded border-slate-300 w-3 h-3"
                              />
                              <span className="text-xs text-slate-700 dark:text-slate-300">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditForm({...editForm, permissions: allPermissions.map(p => p.id)})}
                      className="text-[10px] text-primary hover:underline"
                    >
                      Chọn tất cả
                    </button>
                    <button 
                      onClick={() => setEditForm({...editForm, permissions: []})}
                      className="text-[10px] text-slate-500 hover:underline"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <button className="text-xs text-red-600 hover:underline">Xóa người dùng</button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button 
                  onClick={saveUser}
                  className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
