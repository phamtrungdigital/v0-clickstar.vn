'use client'

// Nút liên hệ nổi GÓC TRÁI DƯỚI: 2 nút tròn Zalo + Hotline, cả hai về 0383 406 735.
// - Zalo mở zalo.me; Hotline bấm gọi (tel:). Số hotline hiện ở tooltip khi rê chuột
//   (KHÔNG có chip số luôn hiện — theo yêu cầu).
// - Hiện trên mọi trang công khai, ẩn ở khu admin. z-index dưới popup hồ sơ (modal che được).
import { usePathname } from 'next/navigation'

const PHONE = '0383406735'
const PHONE_DISPLAY = '0383 406 735'
const ZALO_URL = 'https://zalo.me/0383406735'

export function FloatingContact() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin-cls')) return null

  return (
    <div className="fc-widget" role="region" aria-label="Liên hệ nhanh">
      <a
        className="fc-fab fc-fab--zalo"
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo với Click Star"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.9 3 2.75 6.46 2.75 10.73c0 2.4 1.32 4.54 3.4 5.96-.14.98-.57 2.2-1.5 3.02-.26.23-.12.66.22.68 1.9.12 3.45-.66 4.46-1.4.98.26 2.02.4 3.17.4 5.1 0 9.25-3.46 9.25-7.66C21.25 6.46 17.1 3 12 3Z" />
          <circle cx="8.3" cy="10.8" r="1.15" fill="#0068FF" />
          <circle cx="12" cy="10.8" r="1.15" fill="#0068FF" />
          <circle cx="15.7" cy="10.8" r="1.15" fill="#0068FF" />
        </svg>
        <span className="fc-tip" role="tooltip">
          Chat Zalo<small>Nhắn tin tư vấn ngay</small>
        </span>
      </a>

      <a className="fc-fab fc-fab--call" href={`tel:${PHONE}`} aria-label={`Gọi hotline ${PHONE_DISPLAY}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6.5 3.5h3l1.3 4-2 1.4a12.5 12.5 0 0 0 5.3 5.3l1.4-2 4 1.3v3a1.7 1.7 0 0 1-1.85 1.7C11.2 21.1 2.9 12.8 2.3 5.35A1.7 1.7 0 0 1 4 3.5h2.5Z" />
        </svg>
        <span className="fc-tip" role="tooltip">
          Gọi Hotline<small>{PHONE_DISPLAY}</small>
        </span>
      </a>

      <style>{`
        .fc-widget{
          position:fixed;
          left:clamp(16px,2.2vw,24px);
          bottom:clamp(16px,2.2vw,24px);
          /* Trên banner cá nhân hoá (z-60) để nút luôn bấm được, nhưng dưới popup hồ sơ
             (z-70) để modal che được khi mở. */
          z-index:65;
          display:flex;flex-direction:column;gap:14px;
          font-family:inherit;
        }
        .fc-fab{
          position:relative;width:60px;height:60px;border-radius:50%;
          display:grid;place-items:center;text-decoration:none;color:#fff;outline:none;
          transition:transform .22s cubic-bezier(.34,1.56,.64,1), box-shadow .22s ease, filter .22s ease;
          -webkit-tap-highlight-color:transparent;
        }
        .fc-fab svg{position:relative;z-index:3;width:27px;height:27px;display:block}
        .fc-fab--zalo{
          background:radial-gradient(130% 130% at 30% 20%, #3f90ff 0%, #0068FF 55%, #0050CC 100%);
          box-shadow:0 10px 24px rgba(0,104,255,.42), inset 0 1px 0 rgba(255,255,255,.35);
        }
        .fc-fab--call{
          background:radial-gradient(130% 130% at 30% 20%, #5aa0ff 0%, #3687FC 52%, #155CBD 100%);
          box-shadow:0 10px 24px rgba(54,135,252,.45), inset 0 1px 0 rgba(255,255,255,.35);
        }
        .fc-fab:hover{transform:translateY(-3px) scale(1.06);filter:brightness(1.04)}
        .fc-fab:active{transform:translateY(-1px) scale(1.01)}
        .fc-fab:focus-visible{box-shadow:0 0 0 3px #fff, 0 0 0 6px #3687FC, 0 10px 24px rgba(54,135,252,.4)}
        .fc-fab::before,.fc-fab::after{content:"";position:absolute;inset:0;border-radius:50%;z-index:1}
        .fc-fab::before{animation:fcPulse 2.6s ease-out infinite}
        .fc-fab--call::before{animation-delay:1.3s}
        .fc-fab::after{border:1px solid rgba(255,255,255,.18)}
        @keyframes fcPulse{
          0%{box-shadow:0 0 0 0 rgba(54,135,252,.42)}
          70%{box-shadow:0 0 0 14px rgba(54,135,252,0)}
          100%{box-shadow:0 0 0 0 rgba(54,135,252,0)}
        }
        .fc-fab--zalo::before{animation-name:fcPulseZalo}
        @keyframes fcPulseZalo{
          0%{box-shadow:0 0 0 0 rgba(0,104,255,.45)}
          70%{box-shadow:0 0 0 14px rgba(0,104,255,0)}
          100%{box-shadow:0 0 0 0 rgba(0,104,255,0)}
        }
        .fc-tip{
          position:absolute;left:calc(100% + 14px);top:50%;
          transform:translateY(-50%) translateX(-6px);
          background:#0B2A57;color:#fff;white-space:nowrap;
          padding:9px 13px;border-radius:11px;font-size:13.5px;font-weight:600;line-height:1.2;
          box-shadow:0 10px 24px rgba(11,42,87,.25);
          opacity:0;visibility:hidden;pointer-events:none;
          transition:opacity .2s ease, transform .2s ease;z-index:4;
        }
        .fc-tip small{display:block;font-weight:500;font-size:11.5px;opacity:.72;margin-top:2px}
        .fc-tip::before{
          content:"";position:absolute;right:100%;top:50%;transform:translateY(-50%);
          border:6px solid transparent;border-right-color:#0B2A57;
        }
        .fc-fab:hover .fc-tip,.fc-fab:focus-visible .fc-tip{
          opacity:1;visibility:visible;transform:translateY(-50%) translateX(0);
        }
        @media (max-width:480px){
          .fc-fab{width:52px;height:52px}
          .fc-fab svg{width:23px;height:23px}
          .fc-widget{gap:12px}
          .fc-tip{display:none}
        }
        @media (prefers-reduced-motion:reduce){
          .fc-fab,.fc-fab::before,.fc-tip{animation:none!important;transition:none!important}
          .fc-fab:hover{transform:none}
        }
      `}</style>
    </div>
  )
}
