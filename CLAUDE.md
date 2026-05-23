# CLAUDE.md — Quy định cho Claude Code khi làm việc trên v0-clickstar.vn

> File này được Claude tự đọc mỗi conversation. Bổ sung quy định project-specific
> để phối hợp với rule global ở `~/.claude/CLAUDE.md`.

---

## QUY ĐỊNH 1 — Tránh compound Bash trigger popup permission

Claude Code có security check HARDCODED (không override được qua `settings.json`)
sẽ trigger popup permission khi gặp các pattern compound bash. Để chạy mượt,
**luôn dùng các pattern thay thế dưới đây**:

### ❌ TRÁNH (luôn trigger popup, dù đã allow trong settings):

```bash
# 1. Compound + redirect (cd && grep với redirect stderr)
cd "/path" && grep ... 2>/dev/null | head -X

# 2. python3 -c "multi-line\nscript" (newline trong quoted string)
python3 -c "
import os
print(os.getcwd())
"

# 3. Heredoc với cat hoặc node
cat > file.txt << 'EOF'
multiple lines
EOF
```

### ✅ DÙNG THAY:

```bash
# 1. Absolute path + tool flags, không cần cd
grep -rn "X" "/absolute/path/" --include="*.tsx" | head -10

# 2. git -C thay cd && git
git -C "/Users/stdigital/Documents/Trung ST/Github.Code/v0-clickstar.vn" status

# 3. Viết file /tmp/script.py rồi chạy
# Bước 1: dùng Write tool tạo /tmp/script.py
# Bước 2: python3 /tmp/script.py

# 4. Heredoc commit message vẫn OK (đã trong .claude/settings.json)
git commit -m "$(cat <<'EOF'
message ở đây
EOF
)"
```

---

## QUY ĐỊNH 2 — Allow list project (đã setup)

File `.claude/settings.json` (commit vào repo) đã allow:

- **Git**: add/commit/push origin dev/feat-/fix-/perf-/chore-, fetch/pull/merge/checkout/stash/restore, `git -C`
- **pnpm**: build/lint/typecheck/install
- **Exec wide** (anh đã accept rủi ro 22/5/2026): curl, vercel, python3, node, perl, sed, awk, mkdir, cp, mv, chmod
- **Cleanup**: chỉ `rm /tmp/*` (KHÔNG allow rm ngoài /tmp)
- **MCP**: Supabase (execute_sql, apply_migration, get/list reads, deploy_edge_function), Vercel (get_deployment/runtime_logs/list_*), Claude Preview (full UI testing), Claude in Chrome (full), CCD session (mark_chapter/spawn_task/list_sessions/search/archive)

File `.claude/settings.local.json` (gitignored, personal) giữ popup cho:

- `git push origin main`, `git push --force`, `git reset --hard`, `git branch -D`
- `rm -rf /Users/*`, `rm -rf ~/*`, `chmod 777`, `sudo`
- Supabase delete/reset/rebase/merge_branch, pause/restore/create_project

---

## QUY ĐỊNH 3 — DB migration vẫn theo rule global

Mặc dù `mcp__supabase__apply_migration` đã được allow tự do trong `.claude/settings.json`
(anh quyết định 22/5/2026 để tiết kiệm time), em **vẫn phải tuân thủ rule global** ở
`~/.claude/CLAUDE.md`:

- Luôn **gửi SQL preview** cho anh review trước khi apply (paste code block + giải thích + dự kiến rows affected)
- Anh OK migration SQL → em apply prod → verify → mới push code vào dev
- Data backfill (UPDATE mass rows) cũng theo flow trên
- Allow chỉ giảm popup, KHÔNG bỏ qua rule preview-before-prod

---

## QUY ĐỊNH 4 — Vercel deployment poll

Khi push dev/main và đợi build, **luôn dùng pattern**:

```bash
# Background poll với until loop — em được notification khi xong
until python3 -c "
import urllib.request, sys
try:
    r = urllib.request.urlopen('https://...', timeout=10)
    sys.exit(0 if r.status == 200 else 1)
except: sys.exit(1)
"; do sleep 15; done && echo "READY"
```

Chạy với `run_in_background: true` để không block khi đợi.

---

## QUY ĐỊNH 5 — BẮT BUỘC đưa link test sau mỗi push (anh nhắc 22/5/2026)

**Sau MỖI lần push code (dev hoặc main), em PHẢI:**

1. **Đợi Vercel build READY** (poll background, không gửi link khi còn Building)
2. **Verify build thực sự pick up commit mới** (check 1-2 markers HTML cụ thể từ thay đổi, không chỉ check 200 OK — vì 200 có thể là commit cũ vẫn cached)
3. **Gửi anh:**
   - ✅ Link preview URL (dev) hoặc prod URL
   - ✅ 2-5 bước test cụ thể anh có thể click ngay
   - ✅ Tóm tắt fix gì + commit hash
   - ✅ Note nếu có credential cần login (email/password admin)

**KHÔNG được:**
- ❌ Push xong rồi đứng yên đợi anh hỏi link
- ❌ Báo "em đã ship" mà không kèm URL
- ❌ Gửi URL khi build còn Building (anh mở sẽ thấy commit cũ → confused)
- ❌ Chỉ gửi tóm tắt code thay đổi mà không có link click được

**Pattern chuẩn (sau khi build READY):**

```
## 🚀 [Phase X] đã ship dev/prod — Anh test giúp em

🔗 **Link:** https://...

📋 **N bước test:**
1. Mở [URL cụ thể]
2. Click vào...
3. Check...

**Commit:** abc1234
**Fix:** tóm tắt 1-2 dòng
```
