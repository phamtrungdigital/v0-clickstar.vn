'use client'

import { useState } from 'react'
import { 
  Database, Plus, CheckCircle2, XCircle, AlertCircle, RefreshCw, Settings,
  ExternalLink, Zap, BarChart3, Users, Globe, Mail, MessageSquare,
  ShoppingCart, CreditCard, FileText, Cloud, Server, Webhook, Play,
  CheckCircle, Loader2, Terminal, Copy, Eye, EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

type IntegrationConfig = {
  id: string
  name: string
  description: string
  icon: any
  category: string
  status: string
  lastSync: string
  data: Record<string, string>
  config: Record<string, string>
}

const initialIntegrations: IntegrationConfig[] = [
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Phân tích website và hành vi người dùng',
    icon: BarChart3,
    category: 'analytics',
    status: 'connected',
    lastSync: '5 phút trước',
    data: { events: '125,430', users: '45,231' },
    config: { measurementId: 'G-XXXXXXXXXX', streamId: '1234567890', dataRetention: '14 months' }
  },
  {
    id: 'gads',
    name: 'Google Ads',
    description: 'Quản lý và tối ưu chiến dịch quảng cáo',
    icon: Globe,
    category: 'ads',
    status: 'connected',
    lastSync: '10 phút trước',
    data: { campaigns: '12', spend: '45.2M' },
    config: { customerId: '123-456-7890', conversionId: 'AW-XXXXXXXXX', refreshToken: 'ya29.xxx...' }
  },
  {
    id: 'fbads',
    name: 'Meta Ads',
    description: 'Quản lý quảng cáo Facebook/Instagram',
    icon: Users,
    category: 'ads',
    status: 'connected',
    lastSync: '15 phút trước',
    data: { campaigns: '8', spend: '32.5M' },
    config: { pixelId: '1234567890123456', accessToken: 'EAAxxxxxxx...', adAccountId: 'act_123456789' }
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Đồng bộ contacts và deals',
    icon: Users,
    category: 'crm',
    status: 'connected',
    lastSync: '2 phút trước',
    data: { contacts: '3,456', deals: '234' },
    config: { portalId: '12345678', apiKey: 'pat-na1-xxxxxxxx', syncInterval: '5 minutes' }
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation',
    icon: Mail,
    category: 'email',
    status: 'error',
    lastSync: '2 giờ trước',
    data: { subscribers: '12,345', campaigns: '45' },
    config: { apiKey: '', audienceId: 'abc123def', datacenter: 'us21' }
  },
  {
    id: 'zalo',
    name: 'Zalo ZNS',
    description: 'Gửi tin nhắn ZNS tự động',
    icon: MessageSquare,
    category: 'messaging',
    status: 'connected',
    lastSync: '30 phút trước',
    data: { sent: '8,234', delivered: '98%' },
    config: { oaId: '1234567890', secretKey: 'zalo_secret_xxx', templateId: 'template_001' }
  },
]

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'ads', label: 'Ads' },
  { id: 'crm', label: 'CRM' },
  { id: 'email', label: 'Email' },
]

export default function AdminIntegrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [activeCategory, setActiveCategory] = useState('all')
  const [syncing, setSyncing] = useState<string | null>(null)
  const [showTestPanel, setShowTestPanel] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<{[key: string]: {status: string, message: string, time: number}}>({})
  const [showApiKey, setShowApiKey] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editConfig, setEditConfig] = useState<Record<string, string>>({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeCategory)

  const startEdit = (integration: IntegrationConfig) => {
    setEditingId(integration.id)
    setEditConfig({ ...integration.config })
  }

  const saveEdit = () => {
    if (!editingId) return
    setIntegrations(prev => prev.map(i => 
      i.id === editingId ? { ...i, config: editConfig } : i
    ))
    setEditingId(null)
    setEditConfig({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditConfig({})
  }

  const isSecret = (key: string) => {
    return key.toLowerCase().includes('key') || 
           key.toLowerCase().includes('token') || 
           key.toLowerCase().includes('secret')
  }

  const maskValue = (value: string) => {
    if (!value || value.length <= 8) return '••••••••'
    return value.slice(0, 4) + '••••••••' + value.slice(-4)
  }

  const handleSync = (id: string) => {
    setSyncing(id)
    setTimeout(() => setSyncing(null), 2000)
  }

  const handleTest = (id: string) => {
    setTestingId(id)
    // Simulate test
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [id]: {
          status: Math.random() > 0.2 ? 'success' : 'error',
          message: Math.random() > 0.2 ? 'Kết nối thành công' : 'Không thể kết nối',
          time: Math.floor(Math.random() * 500 + 100)
        }
      }))
      setTestingId(null)
    }, 1500)
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const errorCount = integrations.filter(i => i.status === 'error').length

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Tích hợp dữ liệu</h1>
          <p className="text-xs text-slate-500">Kết nối và đồng bộ dữ liệu từ các nền tảng</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowTestPanel(!showTestPanel)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 border rounded text-xs transition-colors",
              showTestPanel 
                ? "bg-primary text-white border-primary" 
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            Test Mode
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" />
            Thêm tích hợp
          </button>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 rounded flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{connectedCount}</p>
              <p className="text-[10px] text-slate-500">Đang kết nối</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-100 rounded flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{errorCount}</p>
              <p className="text-[10px] text-slate-500">Cần sửa lỗi</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-100 rounded flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{integrations.length}</p>
              <p className="text-[10px] text-slate-500">Tổng tích hợp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors",
              activeCategory === cat.id 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "bg-white dark:bg-slate-800 rounded-lg border p-3 transition-all hover:shadow-sm",
              integration.status === 'error' 
                ? "border-red-200 dark:border-red-900" 
                : "border-slate-200 dark:border-slate-700"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded flex items-center justify-center",
                  integration.status === 'connected' && "bg-primary/10 text-primary",
                  integration.status === 'error' && "bg-red-100 text-red-600"
                )}>
                  <integration.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                  <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{integration.description}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-2">
              {integration.status === 'connected' && (
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-medium rounded">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    OK
                  </span>
                  <span className="text-[10px] text-slate-500">{integration.lastSync}</span>
                </div>
              )}
              {integration.status === 'error' && (
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Lỗi
                  </span>
                  <span className="text-[10px] text-red-600 truncate">{integration.error}</span>
                </div>
              )}
            </div>

            {/* Data */}
            {integration.data && (
              <div className="grid grid-cols-2 gap-2 mb-2 p-2 bg-slate-50 dark:bg-slate-900 rounded text-center">
                {Object.entries(integration.data).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{value}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Test results */}
            {showTestPanel && testResults[integration.id] && (
              <div className={cn(
                "mb-2 p-2 rounded text-[10px]",
                testResults[integration.id].status === 'success' 
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              )}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    {testResults[integration.id].status === 'success' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {testResults[integration.id].message}
                  </span>
                  <span>{testResults[integration.id].time}ms</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1">
              {showTestPanel && (
                <button
                  onClick={() => handleTest(integration.id)}
                  disabled={testingId === integration.id}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded text-[10px] font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 disabled:opacity-50"
                >
                  {testingId === integration.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  Test
                </button>
              )}
              <button
                onClick={() => handleSync(integration.id)}
                disabled={syncing === integration.id}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3 h-3", syncing === integration.id && "animate-spin")} />
                Sync
              </button>
              <button 
                onClick={() => startEdit(integration)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                title="Chỉnh sửa cấu hình"
              >
                <Settings className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test All Panel */}
      {showTestPanel && (
        <div className="bg-slate-900 rounded-lg p-3 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold">Test Console</h3>
            </div>
            <button 
              onClick={() => {
                integrations.forEach((i, idx) => {
                  setTimeout(() => handleTest(i.id), idx * 500)
                })
              }}
              className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500 text-white rounded text-[10px] hover:bg-emerald-600"
            >
              <Play className="w-3 h-3" />
              Test tất cả
            </button>
          </div>
          
          <div className="bg-slate-800 rounded p-2 font-mono text-[10px] max-h-32 overflow-y-auto">
            {Object.entries(testResults).length === 0 ? (
              <p className="text-slate-500">Nhấn &quot;Test&quot; để kiểm tra kết nối...</p>
            ) : (
              Object.entries(testResults).map(([id, result]) => {
                const integration = integrations.find(i => i.id === id)
                return (
                  <div key={id} className="flex items-center gap-2 py-0.5">
                    <span className={result.status === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                      {result.status === 'success' ? '[OK]' : '[ERR]'}
                    </span>
                    <span className="text-slate-300">{integration?.name}</span>
                    <span className="text-slate-500">- {result.message} ({result.time}ms)</span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Webhook & API */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Webhook & API</h2>
          <a href="#" className="flex items-center gap-1 text-xs text-primary hover:underline">
            <ExternalLink className="w-3 h-3" />
            Tài liệu API
          </a>
        </div>
        
        <div className="space-y-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">Webhook URL</span>
              <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                <Copy className="w-3 h-3 text-slate-400" />
              </button>
            </div>
            <code className="text-xs text-emerald-600 dark:text-emerald-400">https://api.clickstar.vn/webhook/xyz123</code>
          </div>
          
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">API Key</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                </button>
                <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
            <code className="text-xs text-slate-600 dark:text-slate-400">
              {showApiKey ? 'sk_live_abc123xyz456def789' : '••••••••••••••••••••'}
            </code>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Cấu hình {integrations.find(i => i.id === editingId)?.name}
              </h3>
              <button onClick={cancelEdit} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                <XCircle className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
              {Object.entries(editConfig).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400 mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                    {isSecret(key) && <span className="ml-1 text-amber-500">*</span>}
                  </label>
                  <div className="flex gap-1">
                    <input 
                      type={isSecret(key) && !showSecrets[key] ? 'password' : 'text'}
                      value={value}
                      onChange={(e) => setEditConfig({...editConfig, [key]: e.target.value})}
                      className="flex-1 px-2 py-1.5 border border-slate-200 dark:border-slate-700 rounded text-xs bg-white dark:bg-slate-900"
                      placeholder={`Nhập ${key}...`}
                    />
                    {isSecret(key) && (
                      <button 
                        onClick={() => setShowSecrets({...showSecrets, [key]: !showSecrets[key]})}
                        className="px-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50"
                      >
                        {showSecrets[key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-lg">
              <button 
                className="text-xs text-red-600 hover:underline"
              >
                Ngắt kết nối
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={cancelEdit}
                  className="px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button 
                  onClick={saveEdit}
                  className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary/90"
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
