'use client'

import { useState } from 'react'
import { 
  Database, 
  Plus, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  Trash2,
  ExternalLink,
  Zap,
  BarChart3,
  Users,
  Globe,
  Mail,
  MessageSquare,
  ShoppingCart,
  CreditCard,
  FileText,
  Cloud,
  Server,
  Webhook
} from 'lucide-react'
import { cn } from '@/lib/utils'

const integrations = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Phân tích website và hành vi người dùng',
    icon: BarChart3,
    category: 'analytics',
    status: 'connected',
    lastSync: '5 phút trước',
    data: { events: '125,430', users: '45,231' }
  },
  {
    id: 'gads',
    name: 'Google Ads',
    description: 'Quản lý và tối ưu chiến dịch quảng cáo Google',
    icon: Globe,
    category: 'ads',
    status: 'connected',
    lastSync: '10 phút trước',
    data: { campaigns: '12', spend: '45.2M VND' }
  },
  {
    id: 'fbads',
    name: 'Meta Ads',
    description: 'Quản lý quảng cáo Facebook và Instagram',
    icon: Users,
    category: 'ads',
    status: 'connected',
    lastSync: '15 phút trước',
    data: { campaigns: '8', spend: '32.5M VND' }
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Đồng bộ contacts và deals từ HubSpot',
    icon: Users,
    category: 'crm',
    status: 'connected',
    lastSync: '2 phút trước',
    data: { contacts: '3,456', deals: '234' }
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation',
    icon: Mail,
    category: 'email',
    status: 'error',
    lastSync: '2 giờ trước',
    error: 'API key hết hạn',
    data: { subscribers: '12,345', campaigns: '45' }
  },
  {
    id: 'zalo',
    name: 'Zalo ZNS',
    description: 'Gửi tin nhắn ZNS tự động',
    icon: MessageSquare,
    category: 'messaging',
    status: 'connected',
    lastSync: '30 phút trước',
    data: { sent: '8,234', delivered: '98%' }
  },
  {
    id: 'shopee',
    name: 'Shopee',
    description: 'Đồng bộ đơn hàng từ Shopee',
    icon: ShoppingCart,
    category: 'ecommerce',
    status: 'disconnected',
    data: null
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Theo dõi thanh toán và doanh thu',
    icon: CreditCard,
    category: 'payment',
    status: 'connected',
    lastSync: '1 phút trước',
    data: { revenue: '156.8M VND', transactions: '234' }
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    description: 'Xuất dữ liệu tự động ra Google Sheets',
    icon: FileText,
    category: 'export',
    status: 'connected',
    lastSync: '1 giờ trước',
    data: { sheets: '5', lastExport: 'Hôm nay' }
  },
]

const availableIntegrations = [
  { name: 'Salesforce', icon: Cloud, category: 'crm' },
  { name: 'Slack', icon: MessageSquare, category: 'messaging' },
  { name: 'Zapier', icon: Zap, category: 'automation' },
  { name: 'Webhooks', icon: Webhook, category: 'developer' },
  { name: 'MySQL', icon: Database, category: 'database' },
  { name: 'PostgreSQL', icon: Server, category: 'database' },
]

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'ads', label: 'Quảng cáo' },
  { id: 'crm', label: 'CRM' },
  { id: 'email', label: 'Email' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'payment', label: 'Thanh toán' },
]

export default function AdminIntegrations() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [syncing, setSyncing] = useState<string | null>(null)

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory)

  const handleSync = (id: string) => {
    setSyncing(id)
    setTimeout(() => setSyncing(null), 2000)
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const errorCount = integrations.filter(i => i.status === 'error').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tích hợp dữ liệu</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kết nối và đồng bộ dữ liệu từ các nền tảng</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Thêm tích hợp
        </button>
      </div>

      {/* Status overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{connectedCount}</p>
              <p className="text-sm text-slate-500">Đang kết nối</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{errorCount}</p>
              <p className="text-sm text-slate-500">Cần sửa lỗi</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{integrations.length}</p>
              <p className="text-sm text-slate-500">Tổng tích hợp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
              activeCategory === cat.id 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "bg-white dark:bg-slate-800 rounded-xl border p-5 transition-all hover:shadow-md",
              integration.status === 'error' 
                ? "border-red-200 dark:border-red-900" 
                : "border-slate-200 dark:border-slate-700"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  integration.status === 'connected' && "bg-primary/10 text-primary",
                  integration.status === 'error' && "bg-red-100 text-red-600",
                  integration.status === 'disconnected' && "bg-slate-100 text-slate-400"
                )}>
                  <integration.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                  <p className="text-xs text-slate-500">{integration.description}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              {integration.status === 'connected' && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã kết nối
                  </span>
                  <span className="text-xs text-slate-500">Đồng bộ: {integration.lastSync}</span>
                </div>
              )}
              {integration.status === 'error' && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Lỗi
                  </span>
                  <span className="text-xs text-red-600">{integration.error}</span>
                </div>
              )}
              {integration.status === 'disconnected' && (
                <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full w-fit">
                  <XCircle className="w-3 h-3" />
                  Chưa kết nối
                </span>
              )}
            </div>

            {/* Data */}
            {integration.data && (
              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                {Object.entries(integration.data).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                    <p className="text-xs text-slate-500 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {integration.status === 'connected' && (
                <>
                  <button
                    onClick={() => handleSync(integration.id)}
                    disabled={syncing === integration.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={cn("w-4 h-4", syncing === integration.id && "animate-spin")} />
                    {syncing === integration.id ? 'Đang đồng bộ...' : 'Đồng bộ'}
                  </button>
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-slate-500" />
                  </button>
                </>
              )}
              {integration.status === 'error' && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
                  <Settings className="w-4 h-4" />
                  Sửa lỗi
                </button>
              )}
              {integration.status === 'disconnected' && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Kết nối
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Available integrations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tích hợp có sẵn</h2>
        <p className="text-sm text-slate-500 mb-6">Thêm các tích hợp mới để mở rộng khả năng phân tích</p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableIntegrations.map((integration, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-primary/10">
                  <integration.icon className="w-5 h-5 text-slate-500 group-hover:text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{integration.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{integration.category}</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Webhook section */}
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Webhook & API</h2>
            <p className="text-slate-400 text-sm mb-4">Tích hợp tùy chỉnh với webhook và REST API</p>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Webhook URL</p>
                <code className="text-sm text-emerald-400">https://api.clickstar.vn/webhook/xyz123</code>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Xem tài liệu API
          </button>
        </div>
      </div>
    </div>
  )
}
