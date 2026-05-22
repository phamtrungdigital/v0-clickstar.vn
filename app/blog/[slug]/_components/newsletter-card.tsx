'use client'

import { useState } from 'react'
import { Send, Mail } from 'lucide-react'

export function NewsletterCard() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: tích hợp service email/newsletter; tạm UI demo
    if (!email.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setEmail('')
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-2xl p-6">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
        <Mail className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">Đăng ký nhận tin</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Nhận bài viết mới về Marketing, AI và Chuyển đổi số qua email mỗi tuần.
      </p>
      {submitted ? (
        <div className="text-sm text-emerald-600 font-medium">✓ Đã đăng ký thành công!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@congty.vn"
            required
            className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Đăng ký
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  )
}
