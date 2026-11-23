#!/usr/bin/env bash
set -euo pipefail
export NEXT_TELEMETRY_DISABLED=1
cd "$RELEASE_DIR"
echo "==> Node $(node -v), pnpm $(pnpm -v)"
ln -sfn "$SHARED_DIR/.env" .env
for V in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY; do
  grep -qs "^$V=" "$SHARED_DIR/.env" || { echo "!! Thiếu $V trong shared/.env" >&2; exit 1; }
done
# Dùng lại cache biên dịch giữa các bản phát hành, nhưng KHÔNG dùng lại cache dữ liệu (fetch-cache):
# dữ liệu phải đọc mới từ database mỗi lần build, nếu không trang tĩnh giữ nội dung cũ (vd trang chủ 404).
mkdir -p "$SHARED_DIR/next-cache" .next
rm -rf "$SHARED_DIR/next-cache/fetch-cache"
ln -sfn "$SHARED_DIR/next-cache" .next/cache
rm -rf .next/cache/fetch-cache
echo "==> pnpm install"
pnpm install --frozen-lockfile
echo "==> pnpm build"
( set -a; . "$SHARED_DIR/.env"; set +a; unset PORT HOSTNAME; export NODE_OPTIONS="--max-old-space-size=4096"; rm -rf .next/cache/fetch-cache; pnpm build )
[ -d .next/static ] || { echo "!! Không thấy .next/static sau build" >&2; exit 1; }
if grep -qs 'NEXT_HTTP_ERROR_FALLBACK;404' .next/server/app/index.html; then
  echo "!! Trang chủ build ra 404 (thiếu dòng pages.slug='home' trong database?)" >&2; exit 1
fi
cat > .autodeploy-start.sh <<'SH'
#!/usr/bin/env bash
set -eo pipefail
[ -n "${PORT:-}" ] || { echo "PORT chưa được đặt" >&2; exit 1; }
export HOSTNAME=127.0.0.1 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
cd "$(dirname "$0")"
exec node_modules/.bin/next start -H 127.0.0.1 -p "$PORT"
SH
chmod 755 .autodeploy-start.sh
echo "==> Bản phát hành sẵn sàng"

