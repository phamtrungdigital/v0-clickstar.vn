-- Sổ đồng ý cookie (consent log) cho clickstar.vn — bằng chứng khách đã đồng ý / từ chối theo Nghị định 13/2023.
-- Chỉ THÊM dòng: không sửa, không xoá (trigger chặn). Không lưu IP, tên, email, số điện thoại.
-- Website ghi qua route /api/consent bằng khoá service_role; anon và authenticated không đọc/ghi trực tiếp.
-- Admin đọc qua hàm is_site_admin() (đã có) để làm báo cáo sau này.

create table if not exists public.consent_log (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  -- Mã ngẫu nhiên sinh ở trình duyệt khách, lưu trong cookie cs_consent; không phải mã CDP, không nối được với người cụ thể.
  visitor_id     uuid not null,
  action         text not null check (action in ('accept_all', 'reject_all', 'custom', 'withdraw')),
  analytics      boolean not null,   -- nhóm Đo lường truy cập (GA4, CDP)
  marketing      boolean not null,   -- nhóm Cá nhân hóa và quảng cáo
  policy_version text not null check (char_length(policy_version) <= 20),
  lang           text check (lang in ('vi', 'en')),
  page_path      text check (char_length(page_path) <= 300)
);

create index if not exists consent_log_created_at_idx on public.consent_log (created_at desc);

alter table public.consent_log enable row level security;
revoke all on public.consent_log from anon, authenticated;
grant select on public.consent_log to authenticated;

drop policy if exists consent_log_admin_read on public.consent_log;
create policy consent_log_admin_read on public.consent_log
  for select to authenticated
  using (public.is_site_admin());

-- Chỉ thêm dòng
create or replace function public.fn_consent_log_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'consent_log chỉ được thêm dòng, không sửa hoặc xoá';
end;
$$;

drop trigger if exists trg_consent_log_immutable on public.consent_log;
create trigger trg_consent_log_immutable
  before update or delete on public.consent_log
  for each row execute function public.fn_consent_log_immutable();
