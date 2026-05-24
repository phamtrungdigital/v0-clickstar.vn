// Send notification email to admin when new contact lead arrives.
// Uses Resend API (https://resend.com — free tier: 3000 emails/month, 100/day).
//
// Setup required:
//   1. Sign up at resend.com
//   2. Create API key
//   3. Add to Vercel env: RESEND_API_KEY=re_xxx
//   4. (Optional) Add LEAD_NOTIFY_EMAIL=trungstpham@gmail.com (default below)
//
// If RESEND_API_KEY missing, silently logs warning + returns — no email sent (graceful degradation).

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Click Star <noreply@resend.dev>'
const TO_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'trungstpham@gmail.com'
const ADMIN_LEADS_URL = 'https://clickstar.vn/admin-cls/leads'

export type LeadNotificationInput = {
  id: string
  name: string
  phone: string
  email: string | null
  company: string | null
  message: string | null
  service?: string | null
}

export async function sendLeadNotification(lead: LeadNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[lead-notification] RESEND_API_KEY missing — skipping email')
    return
  }

  const subject = `🔔 Lead mới: ${lead.name}${lead.service ? ` — ${lead.service}` : ''}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 12px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#1B7BFF 0%,#0055d4 100%);padding:24px 28px;">
            <div style="color:rgba(255,255,255,0.85);font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">CLICK STAR DIGITAL — LEAD MỚI</div>
            <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">${escapeHtml(lead.name)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1a1a1a;">
              <tr>
                <td width="100" style="padding:8px 0;color:#666;font-weight:500;">📞 SĐT:</td>
                <td style="padding:8px 0;"><a href="tel:${escapeAttr(lead.phone)}" style="color:#1B7BFF;text-decoration:none;font-weight:600;">${escapeHtml(lead.phone)}</a></td>
              </tr>
              ${lead.email ? `
              <tr>
                <td style="padding:8px 0;color:#666;font-weight:500;">✉️ Email:</td>
                <td style="padding:8px 0;"><a href="mailto:${escapeAttr(lead.email)}" style="color:#1B7BFF;text-decoration:none;">${escapeHtml(lead.email)}</a></td>
              </tr>` : ''}
              ${lead.company ? `
              <tr>
                <td style="padding:8px 0;color:#666;font-weight:500;">🏢 Công ty:</td>
                <td style="padding:8px 0;font-weight:500;">${escapeHtml(lead.company)}</td>
              </tr>` : ''}
              ${lead.service ? `
              <tr>
                <td style="padding:8px 0;color:#666;font-weight:500;">🎯 Dịch vụ:</td>
                <td style="padding:8px 0;"><span style="background:#1B7BFF15;color:#1B7BFF;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:600;">${escapeHtml(lead.service)}</span></td>
              </tr>` : ''}
            </table>

            ${lead.message ? `
            <div style="margin-top:20px;padding:16px;background:#f8fafb;border-left:3px solid #1B7BFF;border-radius:6px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#666;font-weight:600;margin-bottom:8px;">💬 NỘI DUNG YÊU CẦU</div>
              <div style="font-size:14px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${escapeHtml(lead.message)}</div>
            </div>` : ''}

            <div style="margin-top:24px;text-align:center;">
              <a href="${ADMIN_LEADS_URL}" style="display:inline-block;background:#1B7BFF;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:600;">Xem trong Admin →</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px;background:#f8fafb;border-top:1px solid #e8ecf2;font-size:11px;color:#888;">
            Email tự động từ <strong style="color:#1B7BFF;">clickstar.vn/contact</strong> · Lead ID: ${escapeHtml(lead.id.slice(0, 8))}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        html,
        // Plain-text fallback
        text: `Lead mới: ${lead.name}
SĐT: ${lead.phone}
${lead.email ? `Email: ${lead.email}\n` : ''}${lead.company ? `Công ty: ${lead.company}\n` : ''}${lead.service ? `Dịch vụ: ${lead.service}\n` : ''}
${lead.message || ''}

Xem trong Admin: ${ADMIN_LEADS_URL}`,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[lead-notification] Resend error:', res.status, errText.slice(0, 200))
    }
  } catch (e) {
    console.error('[lead-notification] send failed:', e)
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return map[c]
  })
}

function escapeAttr(s: string): string {
  return s.replace(/["']/g, '')
}
