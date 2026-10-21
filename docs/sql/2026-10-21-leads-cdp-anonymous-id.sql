-- Bước B (21/10/2026): nối lead với hành trình truy cập trong CDP Click Star.
-- Lưu mã khách ẩn danh của CDP (cookie cdp_aid do cdp.js đặt) vào lead lúc khách gửi form liên hệ.
-- Chỉ thêm 1 cột có thể trống và đổi hàm submit_lead nhận thêm 1 tham số tuỳ chọn. Không sửa, không xoá dòng nào có sẵn.

begin;

-- 1) Cột mới: 9 lead cũ để trống (chưa có mã từ trước).
alter table public.leads add column if not exists cdp_anonymous_id text;

-- Tra hành trình theo mã khách (màn Báo cáo, bước D).
create index if not exists leads_cdp_anonymous_id_idx on public.leads (cdp_anonymous_id) where cdp_anonymous_id is not null;

-- 2) Hàm tạo lead: thêm p_cdp_aid. Phải xoá bản 6 tham số cũ rồi tạo lại, vì nếu chỉ "create or replace"
--    với chữ ký mới thì Postgres giữ cả hai bản và lời gọi 6 tham số sẽ bị mơ hồ.
drop function if exists public.submit_lead(text, text, text, text, text, text);

create function public.submit_lead(
  p_name text,
  p_phone text,
  p_email text default null,
  p_company text default null,
  p_message text default null,
  p_source text default 'website',
  p_cdp_aid text default null
)
returns uuid
language plpgsql
security definer
set search_path to ''
as $function$
declare v_id uuid;
begin
  insert into public.leads (name, phone, email, company, message, source, status, cdp_anonymous_id)
  values (p_name, p_phone, nullif(p_email,''), nullif(p_company,''),
          nullif(p_message,''), coalesce(nullif(p_source,''),'website'), 'new',
          -- Chỉ nhận đúng dạng UUID (cdp.js tạo bằng crypto.randomUUID), giá trị khác bỏ qua.
          case when p_cdp_aid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then lower(p_cdp_aid) end)
  returning id into v_id;
  return v_id;
end; $function$;

-- 3) Quyền gọi giữ như cũ (form liên hệ gọi bằng anon).
revoke all on function public.submit_lead(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_lead(text, text, text, text, text, text, text) to anon, authenticated, service_role;

commit;

-- Kiểm tra sau khi áp:
-- select column_name from information_schema.columns where table_name='leads' and column_name='cdp_anonymous_id';  -- 1 dòng
-- select oid::regprocedure from pg_proc where proname='submit_lead';  -- đúng 1 bản, 7 tham số
-- select count(*) from public.leads;  -- vẫn 9
