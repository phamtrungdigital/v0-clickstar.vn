# Deploy: ClickStarDeploy (generated, do not edit)

Every push to the `main` branch deploys this repo to **https://dev.clickstar.vn** through GitLab CI
(job `autodeploy`).
The code is built on the GitLab Runner (alpine:3.20), copied to the server, `.autodeploy/deploy.sh` runs, then the new release is
switched in with a health check. A deploy usually takes 15 seconds to a few minutes.

## Rules for AI agents
- A commit or push is NOT the end of the task: the website only changes when the deploy succeeds.
- After `git push` to `main`, wait for the result before telling the user the work is done:
  `bash .autodeploy/wait-deploy.sh` (Claude Code runs it automatically after `git push` through the
  hook in `.claude/settings.json`). It prints LIVE, or the error, the AI diagnosis and the log tail.
- If the deploy fails: fix the cause, push again, wait again. Only say it is done after LIVE.
  If the change was not pushed to `main`, tell the user it is not deployed yet.
- ClickStarDeploy may push its own commit fixing `.autodeploy/deploy.sh`: run `git pull` before the next change.
- Do not edit `.autodeploy/*`, the ClickStarDeploy include in `.gitlab-ci.yml`, or this file: they are
  managed from the ClickStarDeploy dashboard (https://gitlab.clickstar.vn:8443) and rewritten on every apply.
- Runtime secrets live in the server's `.env`, managed in the dashboard; never commit them.
- Environment variables the app needs: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## You control this project's server and deployment (ClickStarDeploy MCP "clickstar-dev-clickstar-vn")
The owner is usually not a developer and speaks plain Vietnamese ("web lỗi rồi", "thêm chat realtime",
"cho upload file to hơn", "web chậm quá"). Never ask them to run commands, SSH, open dashboards or edit
config: do it yourself with the `mcp__clickstar-dev-clickstar-vn__*` tools, then explain the result in simple words.
- Start any server / deploy / "website" request with `project_info`.
- Website broken or slow: `health_check`, `deploy_status`, `deploy_log`; `run_command` to read logs on
  the server; `releases` + `rollback` when the last deploy broke it and the fix is not quick.
- A feature that needs something on the server (websocket, Redis, queue worker, cron, database, bigger
  upload limit, extra domain): install/configure it with `run_command`, store secrets with `set_env`,
  record the change with `save_server_change`, then write the code here and push.
- Deployment itself (build, install script, deploy.sh, long-running process): `plan_get` /
  `plan_update` then `apply` (+ `job_log`). Never edit `.autodeploy/*` by hand.
- Data questions ("có bao nhiêu user", "đơn hàng hôm qua", "sao không lưu được"): `db_info`, then `db_query`
  (read-only by default, add LIMIT). Change data with `write=true` only when the owner clearly asks, after `backup`.
- Before anything that touches data: `backup`. Never show secret values (passwords, hashes, tokens) to the owner.
  "Lấy lại dữ liệu hôm qua": `backup_list` then `backup_restore` (it dumps the current data first). Nightly
  backups: `backup_schedule`.
- Try risky changes on a dev copy first: `dev_status` / `dev_create`, work on the dev branch, `dev_promote`
  once the owner approves.
- New domain or subdomain: `dns_set` (owner's Cloudflare), then nginx `server_name` + certbot with `run_command`.
- Big or binary files to/from the server: `file_upload` / `file_download` (one-time curl links).
- `resources` for CPU/RAM/disk; `notify_owner` when a long job finishes; `webhooks` for deploy notifications.
- If the `mcp__clickstar-dev-clickstar-vn__*` tools are missing in this session, say in one sentence: "Anh/chị vào
  ClickStarDeploy → dự án dev.clickstar.vn → Pipelines → Lấy khoá & prompt toàn quyền, rồi dán vào đây một lần."
  Then continue with what you can do in the code.
