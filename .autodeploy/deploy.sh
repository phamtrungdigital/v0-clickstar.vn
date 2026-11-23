#!/usr/bin/env bash
set -euo pipefail
# Chạy trong thư mục bản phát hành mới. Build Next.js tại chỗ với biến của shared/.env.
APP_DIR="${APP_DIR:-/var/www/dev-clickstar-vn}"
set -a; . "$APP_DIR/shared/.env"; set +a
export NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 COREPACK_ENABLE_DOWNLOAD_PROMPT=0
export NODE_OPTIONS="--max-old-space-size=4096"
# Dùng lại cache build giữa các bản phát hành cho nhanh
mkdir -p "$APP_DIR/shared/next-cache" .next
ln -sfn "$APP_DIR/shared/next-cache" .next/cache
pnpm install --frozen-lockfile --prod=false
pnpm build

