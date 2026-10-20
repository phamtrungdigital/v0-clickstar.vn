import type { I18n } from '@/lib/cms/types'

/**
 * Bằng chứng kỹ thuật cho trang "Phần mềm theo yêu cầu" (18/10/2026, anh Trung yêu cầu "bằng chứng
 * code thật, đội ngũ nhiều năm kinh nghiệm, tích hợp AI model cao cấp").
 *
 * LUẬT KHI SỬA:
 * 1. Đoạn mã trích là mã THẬT trong kho mã nguồn sản phẩm của Click Star (CDP Click Star, website
 *    Click Star), chỉ rút gọn dòng và dịch lại phần chú thích. KHÔNG tự viết mã minh hoạ rồi gắn
 *    nhãn "mã thật". Không trích mã của khách hàng, không có email, tên miền hay khoá của khách.
 * 2. Con số trong STATS đo từ kho mã nguồn ngày 18/10/2026 (đếm file migration, commit, test).
 *    Muốn đổi thì đo lại, ghi ngày đo; không làm tròn lên.
 * 3. "10+ năm" (kinh nghiệm của đội ngũ) và "100+ doanh nghiệp" theo xác nhận của chủ site ngày 20/10/2026; agency từ 2018, công ty thành lập 2025. Khớp trang Giới thiệu (CMS). Không thêm số nhân sự.
 * 4. Không ghi số phiên bản mô hình AI (đổi nhanh): chỉ ghi hãng và dòng mô hình.
 */

export type Lang = 'sql' | 'ts'
export type Excerpt = {
  id: string
  file: string
  repo: I18n
  lang: Lang
  /** Cùng một mã, chỉ khác phần chú thích theo ngôn ngữ */
  code: I18n
  proves: I18n
}

export const EVIDENCE = {
  kicker: { vi: 'Mã nguồn thật', en: 'Real source code' },
  title: { vi: 'Đây là cách chúng tôi viết mã', en: 'This is how we write code' },
  lede: {
    vi: '4 đoạn trích từ kho mã nguồn sản phẩm của Click Star, rút gọn dòng, giữ nguyên logic. Mỗi đoạn kèm lý do nó tồn tại.',
    en: '4 excerpts from Click Star’s own product repositories, trimmed for length with the logic untouched. Each says why it exists.',
  },
  from: { vi: 'Trích từ', en: 'Excerpt from' },
  proves: { vi: 'Đoạn này bảo đảm', en: 'This guarantees' },
}

export const EXCERPTS: Excerpt[] = [
  {
    id: 'rls',
    file: 'migrations/0002_harden_rls_helpers.sql',
    repo: { vi: 'CDP Click Star · PostgreSQL', en: 'Click Star CDP · PostgreSQL' },
    lang: 'sql',
    code: {
      vi: `-- Hàm kiểm tra thành viên nằm ở schema private, không lộ qua API công khai
create or replace function private.is_tenant_member(p_tenant_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.members m
    where m.tenant_id = p_tenant_id and m.user_id = auth.uid()
  );
$$;

-- Đọc: mọi thành viên của tổ chức. Ghi: chỉ owner hoặc admin
create policy profiles_select on public.profiles
  for select to authenticated
  using (private.is_tenant_member(tenant_id));

create policy profiles_write on public.profiles
  for all to authenticated
  using (private.is_tenant_editor(tenant_id))
  with check (private.is_tenant_editor(tenant_id));`,
      en: `-- Membership check lives in the private schema, never exposed through the public API
create or replace function private.is_tenant_member(p_tenant_id uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.members m
    where m.tenant_id = p_tenant_id and m.user_id = auth.uid()
  );
$$;

-- Read: any member of the tenant. Write: owners and admins only
create policy profiles_select on public.profiles
  for select to authenticated
  using (private.is_tenant_member(tenant_id));

create policy profiles_write on public.profiles
  for all to authenticated
  using (private.is_tenant_editor(tenant_id))
  with check (private.is_tenant_editor(tenant_id));`,
    },
    proves: {
      vi: 'Dữ liệu của tổ chức này không thể bị tổ chức khác đọc, kể cả khi một đoạn mã ứng dụng viết sai. Chặn nằm ở cơ sở dữ liệu.',
      en: 'One tenant can never read another’s data, even if an application bug slips through. The block sits in the database.',
    },
  },
  {
    id: 'ingest',
    file: 'migrations/0003_ingest_events.sql',
    repo: { vi: 'CDP Click Star · PostgreSQL', en: 'Click Star CDP · PostgreSQL' },
    lang: 'sql',
    code: {
      vi: `create or replace function public.ingest_events(p_write_key text, p_events jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
...
begin
  select id, tenant_id into v_source_id, v_tenant_id
  from public.sources where write_key = p_write_key;

  -- Khoá không hợp lệ thì dừng ngay, không ghi gì
  if v_source_id is null then
    raise exception 'invalid write_key' using errcode = '28000';
  end if;

  if jsonb_typeof(p_events) <> 'array' then
    raise exception 'events must be an array' using errcode = '22023';
  end if;

  for v_e in select * from jsonb_array_elements(p_events)
  loop
    v_anon := nullif(v_e->>'anonymous_id', '');
    if v_anon is null then continue; end if;`,
      en: `create or replace function public.ingest_events(p_write_key text, p_events jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
...
begin
  select id, tenant_id into v_source_id, v_tenant_id
  from public.sources where write_key = p_write_key;

  -- An invalid key stops here, nothing is written
  if v_source_id is null then
    raise exception 'invalid write_key' using errcode = '28000';
  end if;

  if jsonb_typeof(p_events) <> 'array' then
    raise exception 'events must be an array' using errcode = '22023';
  end if;

  for v_e in select * from jsonb_array_elements(p_events)
  loop
    v_anon := nullif(v_e->>'anonymous_id', '');
    if v_anon is null then continue; end if;`,
    },
    proves: {
      vi: 'Điểm nhận dữ liệu công khai vẫn xác thực khoá, kiểm tra kiểu đầu vào và bỏ bản ghi thiếu định danh trước khi ghi.',
      en: 'A public ingestion endpoint still authenticates the key, checks the input type and drops records without an identity before writing.',
    },
  },
  {
    id: 'phone',
    file: 'src/lib/phone.ts',
    repo: { vi: 'CDP Click Star · TypeScript', en: 'Click Star CDP · TypeScript' },
    lang: 'ts',
    code: {
      vi: `// Chuẩn hoá về E.164 ngay tại điểm nhận, trước khi ghi hoặc so khớp
export function toE164(input: string | null | undefined, defaultCC = "84"): string | null {
  if (!input) return null;
  let s = input.replace(/[\\s().\\-]/g, "").trim();
  if (!s) return null;

  if (s.startsWith("+")) {
    return /^\\+\\d{8,15}$/.test(s) ? s : null;
  }
  // 00xx: bỏ tiền tố quốc tế
  if (s.startsWith("00")) s = s.slice(2);
  // 0xxxxxxxxx: số nội địa VN, bỏ số 0 và gắn mã quốc gia
  else if (s.startsWith("0")) s = defaultCC + s.slice(1);

  const e164 = "+" + s;
  return /^\\+\\d{8,15}$/.test(e164) ? e164 : null;
}`,
      en: `// Normalise to E.164 at the point of entry, before storing or matching
export function toE164(input: string | null | undefined, defaultCC = "84"): string | null {
  if (!input) return null;
  let s = input.replace(/[\\s().\\-]/g, "").trim();
  if (!s) return null;

  if (s.startsWith("+")) {
    return /^\\+\\d{8,15}$/.test(s) ? s : null;
  }
  // 00xx: drop the international prefix
  if (s.startsWith("00")) s = s.slice(2);
  // 0xxxxxxxxx: Vietnamese local number, drop the 0 and add the country code
  else if (s.startsWith("0")) s = defaultCC + s.slice(1);

  const e164 = "+" + s;
  return /^\\+\\d{8,15}$/.test(e164) ? e164 : null;
}`,
    },
    proves: {
      vi: '“0901 234 321” và “+84 901 234 321” được nhận ra là một người. Hồ sơ khách không bị nhân đôi vì cách gõ số.',
      en: '“0901 234 321” and “+84 901 234 321” resolve to the same person, so profiles are not duplicated by how a number is typed.',
    },
  },
  {
    id: 'token',
    file: 'lib/admin-cls/admin-token.ts',
    repo: { vi: 'Website Click Star · TypeScript', en: 'Click Star website · TypeScript' },
    lang: 'ts',
    code: {
      vi: `function getSecret(): string | null {
  const secret = process.env.ADMIN_CACHE_SECRET
  if (secret && secret.length >= MIN_SECRET_LENGTH) return secret
  return null // thiếu khoá: không ký, không tin token nào
}

export function verifyAdminToken(raw: string | null | undefined): AdminCacheValue | null {
  if (!raw) return null
  const secret = getSecret()
  if (!secret) return null

  const parts = raw.split('.')
  if (parts.length !== 2) return null
  const [payload, sig] = parts

  // So sánh thời gian hằng, chống dò chữ ký từng byte
  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  ...`,
      en: `function getSecret(): string | null {
  const secret = process.env.ADMIN_CACHE_SECRET
  if (secret && secret.length >= MIN_SECRET_LENGTH) return secret
  return null // no key: sign nothing, trust no token
}

export function verifyAdminToken(raw: string | null | undefined): AdminCacheValue | null {
  if (!raw) return null
  const secret = getSecret()
  if (!secret) return null

  const parts = raw.split('.')
  if (parts.length !== 2) return null
  const [payload, sig] = parts

  // Constant-time compare, so the signature cannot be probed byte by byte
  const expected = Buffer.from(sign(payload, secret))
  const given = Buffer.from(sig)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  ...`,
    },
    proves: {
      vi: 'Cookie phân quyền có chữ ký HMAC nên người dùng không tự sửa thành quản trị viên được. Thiếu khoá thì hệ thống đóng cửa, không mở cửa.',
      en: 'The role cookie is HMAC-signed, so a user cannot edit it into an admin. With no key the system fails closed, not open.',
    },
  },
]

/** Số đo từ kho mã nguồn, ngày 18/10/2026 */
export const STATS: { value: string; label: I18n }[] = [
  { value: '48', label: { vi: 'migration SQL có đánh số trong kho CDP', en: 'numbered SQL migrations in the CDP repository' } },
  { value: '246', label: { vi: 'kiểm thử phân quyền cho hệ thống điều hành quảng cáo', en: 'permission tests for the ad-operations system' } },
  { value: '7', label: { vi: 'bộ kiểm thử, chạy trên cơ sở dữ liệu giả lập', en: 'test suites, run on a simulated database' } },
  { value: '187', label: { vi: 'commit trong kho CDP, mỗi commit một thay đổi có thể quay lui', en: 'commits in the CDP repository, each a reversible change' } },
]
export const STATS_NOTE = {
  vi: 'Số đo từ kho mã nguồn ngày 18/10/2026. Kiểm thử không chạm dữ liệu thật.',
  en: 'Measured from the repositories on 18 Oct 2026. Tests never touch real data.',
}

export const FLOW = {
  title: { vi: 'Một yêu cầu đi qua 6 chốt kiểm tra', en: 'One request, 6 checkpoints' },
  lede: {
    vi: 'Các đoạn mã ở trên nằm ở những chốt này. Thứ tự cố định: chốt sau không thay được chốt trước.',
    en: 'The code above lives at these checkpoints. The order is fixed: a later check never replaces an earlier one.',
  },
}

export const ARCH = {
  kicker: { vi: 'Kiến trúc', en: 'Architecture' },
  title: { vi: 'Kiến trúc tham chiếu cho mọi dự án', en: 'A reference architecture for every project' },
  lede: {
    vi: 'Điểm xuất phát chung, sau đó điều chỉnh theo nghiệp vụ. Mô hình AI và hệ thống bên ngoài chỉ được gọi từ máy chủ, không bao giờ từ trình duyệt.',
    en: 'A shared starting point, then tailored to your workflows. AI models and external systems are called from the server only, never from the browser.',
  },
  principles: [
    {
      title: { vi: 'Cơ sở dữ liệu là nơi chặn cuối', en: 'The database is the last gate' },
      body: { vi: 'Quyền được ràng buộc bằng Row Level Security, nên một lỗi ở tầng ứng dụng không làm lộ dữ liệu.', en: 'Access is bound by Row Level Security, so an application bug cannot leak data.' },
    },
    {
      title: { vi: 'Mọi thay đổi đều để lại dấu vết', en: 'Every change leaves a trace' },
      body: { vi: 'Nhật ký chỉ ghi thêm, ghi rõ ai làm gì lúc nào. Không ai sửa hay xoá được, kể cả quản trị viên.', en: 'An append-only log records who did what and when. Nobody can edit or delete it, admins included.' },
    },
    {
      title: { vi: 'Tách môi trường từ ngày đầu', en: 'Separate environments from day one' },
      body: { vi: 'Phát triển, thử nghiệm và vận hành là ba môi trường riêng, dữ liệu thật không bao giờ xuất hiện ở hai môi trường đầu.', en: 'Development, staging and production are three separate environments. Real data never appears in the first two.' },
    },
  ],
}

export const AI = {
  kicker: { vi: 'Tích hợp AI', en: 'Applied AI' },
  title: { vi: 'Mô hình AI cao cấp, kiểm soát chặt', en: 'Premium AI models, tightly controlled' },
  lede: {
    vi: 'Chúng tôi dùng các mô hình hàng đầu của Anthropic (Claude), OpenAI (GPT) và Google (Gemini), chọn theo từng tác vụ. Mô hình chỉ là một bước trong quy trình có kiểm chứng, không phải hộp đen nối thẳng vào dữ liệu.',
    en: 'We use the leading models from Anthropic (Claude), OpenAI (GPT) and Google (Gemini), chosen per task. The model is one step in a verified workflow, not a black box wired straight into your data.',
  },
  providers: ['Anthropic · Claude', 'OpenAI · GPT', 'Google · Gemini'],
  items: [
    {
      title: { vi: 'Đúng mô hình cho đúng việc', en: 'The right model for the job' },
      body: {
        vi: 'Việc cần suy luận như đọc hợp đồng, phân tích cuộc gọi dùng mô hình cao cấp. Việc lặp lại như phân loại, gắn nhãn dùng mô hình nhanh để giữ chi phí. Có phương án dự phòng khi một nhà cung cấp gián đoạn.',
        en: 'Reasoning-heavy work such as reading contracts or analysing calls uses a top-tier model. Repetitive work such as classification uses a fast model to keep cost down. A fallback covers provider outages.',
      },
    },
    {
      title: { vi: 'Chỉ trả lời từ dữ liệu đã duyệt', en: 'Answers only from approved data' },
      body: {
        vi: 'Truy xuất từ kho tri thức đã duyệt, lọc theo quyền của người hỏi, kèm nguồn trích dẫn. Câu chưa có đáp án được ghi lại để bổ sung, không để mô hình tự suy đoán.',
        en: 'Retrieval from an approved knowledge base, filtered by the asker’s permissions, with cited sources. Unanswered questions are logged for follow-up instead of letting the model guess.',
      },
    },
    {
      title: { vi: 'Đầu ra có cấu trúc, được kiểm chứng', en: 'Structured, verified output' },
      body: {
        vi: 'Kết quả trả về theo schema cố định và được kiểm tra trước khi ghi vào hệ thống. Dưới ngưỡng tin cậy hoặc dữ liệu nhạy cảm thì chuyển cho người duyệt.',
        en: 'Results follow a fixed schema and are validated before they touch your system. Below a confidence threshold, or when data is sensitive, a person reviews it.',
      },
    },
    {
      title: { vi: 'Dữ liệu được bảo vệ', en: 'Your data stays protected' },
      body: {
        vi: 'Che thông tin nhạy cảm trước khi gửi đi. Khoá API chỉ nằm ở máy chủ. Dữ liệu của doanh nghiệp không dùng để huấn luyện mô hình.',
        en: 'Sensitive fields are masked before sending. API keys live on the server only. Your data is not used to train models.',
      },
    },
    {
      title: { vi: 'Đo được chi phí và chất lượng', en: 'Cost and quality you can measure' },
      body: {
        vi: 'Mỗi lượt gọi ghi lại phiên bản prompt, số token, chi phí và người duyệt. Đặt hạn mức theo tháng, so chất lượng trước khi đổi mô hình.',
        en: 'Every call logs the prompt version, tokens, cost and reviewer. Monthly budgets are set, and quality is compared before any model change.',
      },
    },
  ],
  live: {
    title: { vi: 'Đã xây dựng, không phải ý tưởng', en: 'Already built, not a concept' },
    items: [
      { vi: 'Trợ lý tư vấn trên website, trả lời từ kho kiến thức đã duyệt, chuyển lead về CRM', en: 'Website assistant answering from an approved knowledge base and sending leads to the CRM' },
      { vi: 'Phân tích cuộc gọi: bóc băng, chấm điểm, điền thẳng vào CRM', en: 'Call analysis: transcription, scoring, writing straight into the CRM' },
    ],
    link: { vi: 'Xem Speech Insight AI', en: 'See Speech Insight AI' },
  },
}

export const TEAM = {
  kicker: { vi: 'Đội ngũ', en: 'The team' },
  title: { vi: 'Hơn 10 năm làm hệ thống cho doanh nghiệp', en: '10+ years building systems for businesses' },
  lede: {
    vi: 'Đội kỹ thuật Click Star đã đồng hành cùng hơn 100 doanh nghiệp tại Việt Nam, trong giáo dục, y tế, bán lẻ, thương mại điện tử và dịch vụ cao cấp.',
    en: 'Click Star’s engineers have worked with 100+ Vietnamese businesses across education, healthcare, retail, e-commerce and premium services.',
  },
  stats: [
    { value: '10+', label: { vi: 'năm làm Marketing, CRM và hệ thống hoá quy trình', en: 'years in Marketing, CRM and process systems' } },
    { value: '100+', label: { vi: 'doanh nghiệp đã đồng hành', en: 'businesses served' } },
    { value: '5', label: { vi: 'ngành đã làm: giáo dục, y tế, bán lẻ, thương mại điện tử, dịch vụ cao cấp', en: 'sectors: education, healthcare, retail, e-commerce, premium services' } },
  ],
  roles: [
    { title: { vi: 'Kỹ sư phần mềm', en: 'Software engineers' }, body: { vi: 'Viết và bảo trì mã ứng dụng, tích hợp hệ thống, tối ưu tốc độ.', en: 'Write and maintain application code, integrations and performance.' } },
    { title: { vi: 'Kỹ sư dữ liệu và bảo mật', en: 'Data and security engineers' }, body: { vi: 'Thiết kế mô hình dữ liệu, phân quyền Row Level Security, kiểm thử truy cập.', en: 'Design data models, Row Level Security and access tests.' } },
    { title: { vi: 'Kỹ sư AI', en: 'AI engineers' }, body: { vi: 'Chọn mô hình, dựng truy xuất tri thức, đo chất lượng và chi phí.', en: 'Select models, build retrieval and measure quality and cost.' } },
    { title: { vi: 'Thiết kế sản phẩm', en: 'Product designers' }, body: { vi: 'Thiết kế luồng làm việc và giao diện bấm thử được trước khi lập trình.', en: 'Design workflows and clickable prototypes before any code is written.' } },
    { title: { vi: 'Kiểm thử', en: 'QA' }, body: { vi: 'Kiểm thử chức năng, hiệu năng, phân quyền; cùng người dùng thật nghiệm thu.', en: 'Functional, performance and permission testing, then acceptance with real users.' } },
    { title: { vi: 'Vận hành', en: 'Operations' }, body: { vi: 'Giám sát, sao lưu, kiểm tra khôi phục và xử lý sự cố sau bàn giao.', en: 'Monitoring, backups, restore drills and incident response after handover.' } },
  ],
  practices: {
    title: { vi: 'Thói quen kỹ thuật cố định', en: 'Engineering habits we do not skip' },
    items: [
      { vi: 'Mọi thay đổi được người thứ hai xem xét trước khi gộp', en: 'Every change is reviewed by a second engineer before merge' },
      { vi: 'Kiểm tra tự động trước khi lên môi trường thử: kiểu dữ liệu, quy tắc mã, kiểm thử, dựng bản', en: 'Automated checks before staging: types, lint, tests and a full build' },
      { vi: 'Kiểm thử phân quyền chạy trên cơ sở dữ liệu giả lập, không chạm dữ liệu thật', en: 'Permission tests run on a simulated database, never on real data' },
      { vi: 'Quyết định kiến trúc lớn được ghi lại bằng văn bản, để người tiếp quản hiểu vì sao', en: 'Major architecture decisions are written down, so whoever takes over knows why' },
    ] as I18n[],
  },
}
