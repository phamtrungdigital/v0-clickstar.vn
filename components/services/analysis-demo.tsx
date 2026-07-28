'use client'

import { useState } from 'react'
import {
  GraduationCap,
  Stethoscope,
  Building2,
  Sofa,
  AlertTriangle,
  Info,
  CheckCircle2,
  Flame,
  Bot,
  MessageSquare,
  ClipboardCheck,
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

/**
 * Khối "Demo phân tích cụ thể" — 4 tab theo 4 ngành (anh Trung chốt 28/7/2026).
 *
 * 3 LUẬT KHI SỬA FILE NÀY:
 * 1. Hội thoại và số liệu ở đây là dữ liệu DỰNG SẴN để minh hoạ cách hệ thống
 *    đọc một cuộc gọi. TUYỆT ĐỐI không gắn tên khách hàng thật, tên nhân viên
 *    thật, hay trình bày như kết quả đã đo được của một khách cụ thể.
 * 2. Không viết thống kê kiểu "nhóm này chốt cao hơn X%" — chỉ mô tả HÀNH VI
 *    hệ thống được cấu hình để làm.
 * 3. Mọi khối JSON phải bọc overflow-x-auto: globals.css không có guard
 *    overflow-x nên khối tràn sẽ làm cả trang cuộn ngang trên mobile.
 */

type Tone = 'risk' | 'warn' | 'info' | 'good'

type Turn = { at: string; who: 'sale' | 'khach'; line: string }
type Signal = { at: string; tone: Tone; text: string }
type Outcome = { label: string; value: string }

const TONE_STYLE: Record<Tone, { chip: string; icon: React.ReactNode }> = {
  risk: {
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  warn: {
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  info: {
    chip: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: <Info className="w-3.5 h-3.5" />,
  },
  good: {
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
}

export function AnalysisDemo() {
  const { t } = useLanguage()
  const [active, setActive] = useState(0)

  const scenarios: {
    industry: string
    title: string
    icon: React.ReactNode
    turns: Turn[]
    signals: Signal[]
    json: string
    outcomes: Outcome[]
  }[] = [
    /* ─────────────── 1. Giáo dục / du học ─────────────── */
    {
      industry: t('Giáo dục · Du học', 'Education · Study abroad'),
      title: t('Phụ huynh hỏi học phí rồi tắt máy', 'Parent asks the price, then hangs up'),
      icon: <GraduationCap className="w-5 h-5" />,
      turns: [
        {
          at: '00:12',
          who: 'sale',
          line: t(
            'Dạ em chào chị, chị đang quan tâm chương trình du học nghề Đức đúng không ạ?',
            'Hello, you were asking about the vocational study programme in Germany, is that right?'
          ),
        },
        {
          at: '00:19',
          who: 'khach',
          line: t(
            'Ừ chị xem trên Facebook. Cho chị hỏi tổng chi phí hết bao nhiêu?',
            'Yes, I saw it on Facebook. How much does the whole thing cost?'
          ),
        },
        {
          at: '00:26',
          who: 'sale',
          line: t(
            'Dạ trọn gói thì tuỳ lộ trình chị ạ, để em gửi bảng chi tiết qua Zalo nhé.',
            'It depends on the pathway — let me send you the detailed sheet over Zalo.'
          ),
        },
        {
          at: '00:34',
          who: 'khach',
          line: t('Chị hỏi con số thôi mà, khoảng bao nhiêu?', 'I just want a number. Roughly how much?'),
        },
        {
          at: '00:41',
          who: 'sale',
          line: t(
            'Dạ cái này em phải hỏi lại bộ phận tư vấn ạ…',
            'I would have to check with the advisory team on that…'
          ),
        },
        {
          at: '00:49',
          who: 'khach',
          line: t('Thôi để chị tìm hiểu thêm đã. [cúp máy]', 'Never mind, I will look into it myself. [hangs up]'),
        },
      ],
      signals: [
        {
          at: '00:26',
          tone: 'warn',
          text: t(
            'Né câu hỏi giá — khách hỏi trực tiếp, nhân viên chuyển hướng sang kênh khác',
            'Price question dodged — customer asked directly, agent redirected to another channel'
          ),
        },
        {
          at: '00:34',
          tone: 'warn',
          text: t(
            'Khách phải hỏi lại lần hai: tín hiệu mất kiên nhẫn',
            'Customer had to ask twice: an impatience signal'
          ),
        },
        {
          at: '00:41',
          tone: 'warn',
          text: t(
            '“phải hỏi lại bộ phận” — nhân viên không có khung giá để trả lời tại chỗ',
            '“I have to check with the team” — agent has no price range to answer on the spot'
          ),
        },
        {
          at: '00:49',
          tone: 'risk',
          text: t(
            'Khách chủ động kết thúc, không hẹn được bước tiếp theo nào',
            'Customer ended the call; no next step was agreed'
          ),
        },
        {
          at: '—',
          tone: 'info',
          text: t(
            'Cuộc gọi chỉ 49 giây, nhân viên nói 71% thời lượng nhưng không đưa ra được thông tin khách cần',
            'Only 49 seconds; the agent spoke 71% of the time yet delivered none of the information asked for'
          ),
        },
      ],
      json: `{
  "call_id": "cl_3b81e0",
  "duration_sec": 49,
  "quality": {
    "score": 41,
    "criteria": {
      "chao_hoi": true,
      "khai_thac_nhu_cau": false,
      "tra_loi_cau_hoi_gia": false,
      "chot_buoc_tiep_theo": false
    }
  },
  "sentiment": { "overall": "negative", "drop_at_sec": 34 },
  "talk_ratio": { "agent": 0.71, "customer": 0.29 },
  "extracted": {
    "nhu_cau": "Du học nghề Đức",
    "objection": "khong_duoc_bao_gia",
    "next_step": null
  },
  "flags": [
    "khach_chu_dong_cup_may",
    "cau_hoi_gia_khong_duoc_tra_loi"
  ],
  "crm": { "stage": "can_goi_lai", "task_created": true }
}`,
      outcomes: [
        {
          label: t('Điểm chất lượng', 'Quality score'),
          value: t('41/100 — trượt 3 trên 4 tiêu chí', '41/100 — failed 3 of 4 criteria'),
        },
        {
          label: t('Việc hệ thống tự tạo', 'Task created automatically'),
          value: t(
            'Gọi lại trong 24 giờ kèm khung học phí cụ thể, giao cho đúng nhân viên đó',
            'Call back within 24 hours with a concrete fee range, assigned to that same agent'
          ),
        },
        {
          label: t('Ghi nhận vào báo cáo tuần', 'Logged into the weekly report'),
          value: t(
            'Nhóm lỗi “câu hỏi giá không được trả lời” — nếu nhóm này còn tăng, vấn đề nằm ở kịch bản chứ không ở một người',
            'Error group “price question left unanswered” — if it keeps growing, the problem is the script, not one person'
          ),
        },
      ],
    },

    /* ─────────────── 2. Nha khoa / thẩm mỹ ─────────────── */
    {
      industry: t('Nha khoa · Thẩm mỹ', 'Dental · Aesthetics'),
      title: t('Khách sợ đau và giấu ngân sách thật', 'Customer fears pain and hides the real budget'),
      icon: <Stethoscope className="w-5 h-5" />,
      turns: [
        {
          at: '01:05',
          who: 'khach',
          line: t(
            'Em muốn hỏi niềng răng trong suốt, nhưng em sợ đau lắm.',
            'I want to ask about clear aligners, but I am really afraid of the pain.'
          ),
        },
        {
          at: '01:14',
          who: 'sale',
          line: t(
            'Dạ chị yên tâm, niềng trong suốt gần như không đau đâu ạ, ai làm cũng khen nhẹ nhàng.',
            'Don’t worry, clear aligners are almost painless — everyone says how gentle it is.'
          ),
        },
        { at: '01:22', who: 'khach', line: t('Thế chi phí tầm bao nhiêu?', 'And how much does it cost?') },
        {
          at: '01:27',
          who: 'sale',
          line: t('Dạ khoảng 80 đến 120 triệu tuỳ ca chị ạ.', 'Around 80 to 120 million, depending on the case.'),
        },
        {
          at: '01:35',
          who: 'khach',
          line: t('Ồ… cao hơn em nghĩ. Em tính tầm 50 thôi.', 'Oh… higher than I thought. I was budgeting about 50.'),
        },
        {
          at: '01:44',
          who: 'sale',
          line: t(
            'Dạ bên em có trả góp 0% 12 tháng, chị qua khám miễn phí rồi bác sĩ tư vấn cụ thể nhé.',
            'We offer 12-month interest-free instalments — come in for a free check-up and the doctor will advise.'
          ),
        },
        {
          at: '01:58',
          who: 'khach',
          line: t('Ừ để em xem lịch rồi báo lại.', 'Alright, let me check my schedule and get back to you.'),
        },
      ],
      signals: [
        {
          at: '01:14',
          tone: 'risk',
          text: t(
            'Cam kết tuyệt đối về y khoa: “gần như không đau”, “ai làm cũng khen” — phát ngôn rủi ro, cần chuẩn hoá lại',
            'Absolute medical claim: “almost painless”, “everyone praises it” — risky wording that needs standardising'
          ),
        },
        {
          at: '01:35',
          tone: 'info',
          text: t(
            'Ngân sách thật lộ ra: 50 triệu — lệch 30 đến 70 triệu so với mức vừa báo',
            'Real budget revealed: 50 million — 30 to 70 million below the quote just given'
          ),
        },
        {
          at: '01:44',
          tone: 'good',
          text: t(
            'Xử lý phản đối đúng hướng: đưa phương án trả góp và mời khám miễn phí',
            'Objection handled well: instalment option offered plus a free consultation'
          ),
        },
        {
          at: '01:58',
          tone: 'warn',
          text: t(
            'Bước tiếp theo mơ hồ — không chốt được ngày giờ cụ thể',
            'Next step left vague — no specific date or time was locked in'
          ),
        },
      ],
      json: `{
  "call_id": "cl_77c204",
  "duration_sec": 143,
  "quality": {
    "score": 68,
    "criteria": {
      "khai_thac_nhu_cau": true,
      "xu_ly_lo_ngai": true,
      "bao_gia_ro_rang": true,
      "chot_lich_cu_the": false
    }
  },
  "sentiment": { "overall": "neutral", "concern": "so_dau" },
  "extracted": {
    "dich_vu": "Niềng răng trong suốt",
    "ngan_sach_khach": 50000000,
    "bao_gia_da_dua": [80000000, 120000000],
    "objection": "gia_cao_hon_du_kien",
    "next_step": { "type": "clinic_visit", "date": null }
  },
  "compliance": [
    {
      "type": "medical_over_promise",
      "at_sec": 74,
      "quote": "gần như không đau",
      "severity": "medium"
    }
  ],
  "crm": { "stage": "cho_dat_lich", "task_created": true }
}`,
      outcomes: [
        {
          label: t('Cảnh báo tuân thủ', 'Compliance alert'),
          value: t(
            'Phát ngôn cam kết y khoa được gửi cho quản lý ngay trong ngày, kèm đúng đoạn ghi âm để nghe lại',
            'The medical over-promise is sent to the manager the same day, with the exact audio excerpt attached'
          ),
        },
        {
          label: t('Trường tự điền vào CRM', 'Field auto-filled in the CRM'),
          value: t(
            'Ngân sách thật 50 triệu — con số nhân viên không nhập tay bao giờ',
            'Real budget of 50 million — a number agents never type in themselves'
          ),
        },
        {
          label: t('Gợi ý cho lần liên hệ sau', 'Suggestion for the follow-up'),
          value: t(
            'Hồ sơ này hợp gói trả góp, không hợp gói cao cấp — tránh báo lại đúng mức giá vừa bị từ chối',
            'This lead fits the instalment package, not the premium one — avoid re-quoting the price already rejected'
          ),
        },
      ],
    },

    /* ─────────────── 3. Bất động sản ─────────────── */
    {
      industry: t('Bất động sản', 'Real estate'),
      title: t('Khách quan tâm nhưng “để bàn với vợ đã”', 'Interested — but “let me talk to my wife first”'),
      icon: <Building2 className="w-5 h-5" />,
      turns: [
        {
          at: '03:20',
          who: 'khach',
          line: t(
            'Căn hai phòng ngủ hướng Đông Nam còn không em?',
            'Do you still have a two-bedroom facing south-east?'
          ),
        },
        {
          at: '03:28',
          who: 'sale',
          line: t('Dạ còn 3 căn tầng 12, 15 và 21 anh ạ.', 'Yes — three units left, on floors 12, 15 and 21.'),
        },
        {
          at: '03:40',
          who: 'khach',
          line: t(
            'Giá tầm 2 tỷ mốt đúng không? Anh có sẵn 800, còn lại vay.',
            'Around 2.1 billion, right? I have 800 million ready and would borrow the rest.'
          ),
        },
        {
          at: '03:52',
          who: 'sale',
          line: t(
            'Dạ đúng rồi ạ, bên em hỗ trợ vay 70%, lãi ưu đãi 18 tháng đầu.',
            'That’s right — we support financing up to 70%, with a preferential rate for the first 18 months.'
          ),
        },
        {
          at: '04:10',
          who: 'khach',
          line: t(
            'Ừ, để anh về bàn với vợ đã. Cuối tuần anh gọi lại.',
            'Alright, let me discuss it with my wife. I will call you back at the weekend.'
          ),
        },
        { at: '04:18', who: 'sale', line: t('Dạ vâng em chờ tin anh.', 'Of course — I will wait to hear from you.') },
      ],
      signals: [
        {
          at: '03:40',
          tone: 'info',
          text: t(
            'Trích được đủ bộ tài chính: tổng ngân sách, vốn tự có, nhu cầu vay',
            'Full financial picture captured: total budget, own capital, financing need'
          ),
        },
        {
          at: '03:52',
          tone: 'good',
          text: t(
            'Trả lời đúng trọng tâm, có sẵn phương án tài chính đi kèm',
            'Answered the point directly, with a financing option ready'
          ),
        },
        {
          at: '04:10',
          tone: 'warn',
          text: t(
            '“bàn với vợ” — nhóm phản đối được cấu hình theo dõi riêng vì người ra quyết định không có mặt trong cuộc gọi',
            '“discuss with my wife” — an objection group tracked separately because the decision-maker was not on the call'
          ),
        },
        {
          at: '04:18',
          tone: 'risk',
          text: t(
            'Nhân viên nhận “để khách gọi lại”: không hẹn ngày, không mời được người cùng quyết định',
            'Agent accepted “I will call you back”: no date set, decision-maker not invited in'
          ),
        },
      ],
      json: `{
  "call_id": "cl_5e19a4",
  "duration_sec": 298,
  "quality": {
    "score": 74,
    "criteria": {
      "khai_thac_nhu_cau": true,
      "tu_van_tai_chinh": true,
      "xu_ly_tu_choi": false,
      "chot_buoc_tiep_theo": false
    }
  },
  "sentiment": { "overall": "positive", "risk": false },
  "extracted": {
    "nhu_cau": "Căn hộ 2 phòng ngủ, hướng Đông Nam",
    "ngan_sach": 2100000000,
    "von_tu_co": 800000000,
    "can_vay": true,
    "objection": "can_ban_voi_gia_dinh",
    "next_step": null
  },
  "flags": ["de_khach_tu_goi_lai", "nguoi_quyet_dinh_vang_mat"],
  "crm": { "stage": "dang_can_nhac", "task_created": true }
}`,
      outcomes: [
        {
          label: t('Việc hệ thống tự tạo', 'Task created automatically'),
          value: t(
            'Chủ động gọi lại thứ Sáu và mời cả hai vợ chồng đi xem nhà — thay vì ngồi chờ khách gọi',
            'Proactively call back on Friday and invite both spouses to the viewing — instead of waiting'
          ),
        },
        {
          label: t('Luật kịch bản được áp', 'Playbook rule applied'),
          value: t(
            'Với phản đối “bàn với gia đình”, hệ thống không cho đóng ở trạng thái “khách sẽ gọi lại” khi chưa có lịch có mặt người cùng quyết định',
            'For the “discuss with family” objection, the system will not let the call close as “customer will call back” without a scheduled meeting including the decision-maker'
          ),
        },
        {
          label: t('Dữ liệu vào phễu', 'Data into the pipeline'),
          value: t(
            'Vốn tự có 800 triệu vào đúng trường — bộ phận tài chính lọc được ngay danh sách khách đủ điều kiện vay',
            'The 800 million own-capital figure lands in its own field — finance can instantly filter leads who qualify'
          ),
        },
      ],
    },

    /* ─────────────── 4. Nội thất ─────────────── */
    {
      industry: t('Nội thất · Xây dựng', 'Interiors · Construction'),
      title: t('Khách phàn nàn tiến độ sau khi đã ký', 'Post-contract complaint about delivery delays'),
      icon: <Sofa className="w-5 h-5" />,
      turns: [
        {
          at: '00:08',
          who: 'khach',
          line: t(
            'Anh ký hợp đồng từ 20/5, hẹn 6 tuần, giờ 9 tuần rồi vẫn chưa lắp xong!',
            'I signed on 20 May with a 6-week deadline — it has been 9 weeks and installation still is not finished!'
          ),
        },
        {
          at: '00:20',
          who: 'sale',
          line: t(
            'Dạ em xin lỗi anh, bên xưởng đang bị chậm gỗ nhập ạ…',
            'I am sorry — the workshop is being held up by delayed timber imports…'
          ),
        },
        {
          at: '00:31',
          who: 'khach',
          line: t(
            'Lần nào gọi cũng nghe câu đấy. Anh cần một cái ngày cụ thể.',
            'I hear that every single time I call. I need an actual date.'
          ),
        },
        {
          at: '00:40',
          who: 'sale',
          line: t(
            'Dạ để em kiểm tra rồi báo lại anh trong hôm nay ạ.',
            'Let me check and come back to you today.'
          ),
        },
        {
          at: '00:48',
          who: 'khach',
          line: t(
            'Nếu tuần này không xong anh yêu cầu hoàn cọc đấy.',
            'If it is not done this week, I am asking for my deposit back.'
          ),
        },
      ],
      signals: [
        {
          at: '00:08',
          tone: 'risk',
          text: t(
            'Trễ tiến độ 3 tuần so với cam kết trong hợp đồng',
            'Three weeks past the deadline committed to in the contract'
          ),
        },
        {
          at: '00:31',
          tone: 'risk',
          text: t(
            '“lần nào gọi cũng” — hệ thống đối chiếu lịch sử và xác nhận đây là lần khiếu nại thứ ba của cùng khách',
            '“every time I call” — cross-referenced against history and confirmed as this customer’s third complaint'
          ),
        },
        {
          at: '00:48',
          tone: 'risk',
          text: t(
            'Đe doạ đòi hoàn cọc: nguy cơ mất khách kèm rủi ro tranh chấp hợp đồng',
            'Deposit-refund threat: churn risk combined with contractual dispute risk'
          ),
        },
        {
          at: '—',
          tone: 'warn',
          text: t(
            'Cảm xúc tiêu cực ngay từ giây đầu và không hạ nhiệt trong suốt cuộc gọi',
            'Negative from the first second, with no de-escalation across the whole call'
          ),
        },
      ],
      json: `{
  "call_id": "cl_c40d92",
  "duration_sec": 56,
  "call_type": "khieu_nai",
  "sentiment": {
    "overall": "negative",
    "de_escalated": false,
    "risk_level": "high"
  },
  "extracted": {
    "objection": "cham_tien_do",
    "tre_han_tuan": 3,
    "refund_threat": true,
    "next_step": {
      "type": "callback_same_day",
      "committed": true
    }
  },
  "history": { "complaint_count": 3, "first_complaint_days_ago": 26 },
  "flags": ["nguy_co_huy_hop_dong", "khieu_nai_lap_lai"],
  "alert": { "to": "quan_ly_du_an", "sent_at_sec": 56 }
}`,
      outcomes: [
        {
          label: t('Cảnh báo tức thì', 'Immediate alert'),
          value: t(
            'Đẩy về quản lý dự án ngay khi cuộc gọi kết thúc — không đợi tới báo cáo cuối tuần thì đã muộn',
            'Pushed to the project manager the moment the call ends — waiting for the weekly report would be too late'
          ),
        },
        {
          label: t('Ghép với lịch sử khách', 'Matched against customer history'),
          value: t(
            'Đây là lần khiếu nại thứ ba trong 26 ngày — mức độ ưu tiên tự nâng lên, không phụ thuộc việc ai nhớ ra',
            'This is the third complaint in 26 days — priority is raised automatically, not left to someone remembering'
          ),
        },
        {
          label: t('Vào bảng nguyên nhân khiếu nại', 'Into the complaint-cause report'),
          value: t(
            'Xếp vào nhóm “chậm nguyên vật liệu” — nếu nhóm này chiếm phần lớn khiếu nại, vấn đề nằm ở chuỗi cung ứng chứ không ở đội bán hàng',
            'Filed under “material delays” — if that group dominates complaints, the problem is the supply chain, not the sales team'
          ),
        },
      ],
    },
  ]

  const s = scenarios[active]

  return (
    <div>
      {/* Tab chọn ngành */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {scenarios.map((sc, i) => {
          const on = i === active
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={`text-left rounded-xl border p-3.5 transition-all duration-200 ${
                on
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-teal-50 shadow-md shadow-cyan-500/10'
                  : 'border-border bg-white hover:border-cyan-200 hover:shadow-sm'
              }`}
            >
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  on ? 'text-cyan-700' : 'text-muted-foreground'
                }`}
              >
                {sc.icon}
                <span className="truncate">{sc.industry}</span>
              </span>
              <span className="block text-sm font-semibold text-foreground leading-snug">{sc.title}</span>
            </button>
          )
        })}
      </div>

      {/* 3 bước */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* ① Đoạn hội thoại */}
        <div className="rounded-2xl border border-border bg-white overflow-hidden flex flex-col">
          <StepHeader n="1" icon={<MessageSquare className="w-4 h-4" />} title={t('Đoạn hội thoại', 'The conversation')} />
          <div className="p-4 space-y-3 flex-1">
            {s.turns.map((turn, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="text-[10px] font-mono text-muted-foreground pt-1 w-9 flex-shrink-0">{turn.at}</span>
                <div className="min-w-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      turn.who === 'sale' ? 'text-cyan-600' : 'text-slate-500'
                    }`}
                  >
                    {turn.who === 'sale' ? t('Nhân viên', 'Agent') : t('Khách', 'Customer')}
                  </span>
                  <p className="text-sm text-foreground leading-snug">{turn.line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ② AI đọc ra gì */}
        <div className="rounded-2xl border border-border bg-white overflow-hidden flex flex-col">
          <StepHeader n="2" icon={<Bot className="w-4 h-4" />} title={t('AI đọc ra gì', 'What the AI reads')} />
          <div className="p-4 space-y-3 flex-1">
            {s.signals.map((sig, i) => {
              const st = TONE_STYLE[sig.tone]
              return (
                <div key={i} className={`rounded-lg border px-3 py-2.5 ${st.chip}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {st.icon}
                    <span className="text-[10px] font-mono font-bold">{sig.at}</span>
                  </div>
                  <p className="text-xs leading-snug">{sig.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ③ Kết quả trả về */}
        <div className="rounded-2xl border border-border bg-white overflow-hidden flex flex-col">
          <StepHeader
            n="3"
            icon={<ClipboardCheck className="w-4 h-4" />}
            title={t('Kết quả trả về', 'What comes back')}
          />
          <div className="p-4 space-y-4 flex-1">
            <div className="rounded-lg bg-slate-900 p-3 overflow-x-auto">
              <pre className="text-[10.5px] leading-relaxed font-mono text-slate-200 whitespace-pre">{s.json}</pre>
            </div>

            <div className="space-y-2.5">
              {s.outcomes.map((o, i) => (
                <div key={i} className="rounded-lg border border-border bg-slate-50 px-3 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 mb-1">{o.label}</p>
                  <p className="text-xs text-foreground leading-snug">{o.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ n, icon, title }: { n: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-slate-50">
      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <span className="text-cyan-600">{icon}</span>
      <span className="text-sm font-bold text-foreground">{title}</span>
    </div>
  )
}
