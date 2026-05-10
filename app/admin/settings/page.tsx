'use client'

import { useState } from 'react'
import { 
  Settings, Globe, Bell, Shield, Code, Save, Eye, EyeOff, Copy, RefreshCw, CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'general', label: 'Chung', icon: Settings },
  { id: 'notifications', label: 'Thông báo', icon: Bell },
  { id: 'security', label: 'Bảo mật', icon: Shield },
  { id: 'api', label: 'API', icon: Code },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Cài đặt</h1>
          <p className="text-xs text-slate-500">Quản lý cài đặt hệ thống</p>
        </div>
        <button 
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors",
            saved ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Đã lưu' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        {/* Sidebar */}
        <div className="lg:w-40 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded text-xs font-medium whitespace-nowrap transition-colors",
                  activeTab === tab.id 
                    ? "bg-primary text-white" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {activeTab === 'general' && (
            <>
              {/* Site info */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Thông tin website</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Tên website</label>
                    <input
                      type="text"
                      defaultValue="ClickStar"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Tagline</label>
                    <input
                      type="text"
                      defaultValue="Digital Marketing & AI Solutions"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">URL website</label>
                    <input
                      type="url"
                      defaultValue="https://clickstar.vn"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Email liên hệ</label>
                    <input
                      type="email"
                      defaultValue="contact@clickstar.vn"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      defaultValue="0901 234 567"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      defaultValue="123 Nguyễn Huệ, Q.1, TP.HCM"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Ngôn ngữ & Khu vực</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Ngôn ngữ</label>
                    <select className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Múi giờ</label>
                    <select className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs">
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                      <option value="Asia/Singapore">Singapore (GMT+8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Cài đặt thông báo</h2>
              <div className="space-y-2">
                {[
                  { label: 'Lead mới', desc: 'Nhận thông báo khi có lead mới', enabled: true },
                  { label: 'Báo cáo hàng tuần', desc: 'Gửi email báo cáo tổng hợp', enabled: true },
                  { label: 'Cảnh báo SEO', desc: 'Thông báo khi có vấn đề SEO', enabled: false },
                  { label: 'Lỗi tích hợp', desc: 'Thông báo khi tích hợp lỗi', enabled: true },
                  { label: 'Cập nhật hệ thống', desc: 'Thông báo bản cập nhật mới', enabled: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={item.enabled} className="w-4 h-4 text-primary rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Đổi mật khẩu</h2>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Mật khẩu hiện tại</label>
                    <input type="password" placeholder="••••••••" className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Mật khẩu mới</label>
                      <input type="password" placeholder="••••••••" className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Xác nhận</label>
                      <input type="password" placeholder="••••••••" className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Xác thực 2 yếu tố</h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">Bảo vệ tài khoản với authenticator app</p>
                  </div>
                  <button className="px-2 py-1.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-200">
                    Kích hoạt
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'api' && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">API Key</h2>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Secret Key</label>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value="sk_live_abc123xyz456def789"
                        readOnly
                        className="w-full px-2 py-1.5 pr-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      >
                        {showApiKey ? <EyeOff className="w-3 h-3 text-slate-500" /> : <Eye className="w-3 h-3 text-slate-500" />}
                      </button>
                    </div>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Tạo: 15/01/2024</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Webhook URL</h2>
                <div>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1">Endpoint</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      defaultValue="https://api.clickstar.vn/webhook"
                      className="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono"
                    />
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
