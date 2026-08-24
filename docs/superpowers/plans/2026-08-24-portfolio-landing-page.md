# Portfolio Landing Page — scroll-3d Implementation Plan

> **Status: NOT YET EXECUTED.** This plan was fully designed and approved via `scroll-3d:site-planner`'s intake/creative/review checkpoint (Step 2c) on 2026-08-24, but the user asked to defer the actual build ("implementar depois quando meus tokens tiverem zerados") — this file is the resume point. All research (GitHub repo audit, content, palette) and the site plan itself are final and approved; nothing below requires re-asking the user unless something in "Open questions at execution time" comes up.

**Goal:** Build and deploy a scroll-driven 3D portfolio landing page for Rikelme Batista (GitHub: `YukinaruX`) using the `scroll-3d` plugin, explicitly exercising the `google-flow` MCP server (registered per `docs/superpowers/plans/2026-08-24-scroll3d-dependency-setup.md`, Task 5) for two generated video sections — this build is partly a deliberate test of that MCP integration, not just a landing page.

**Prerequisites:** All satisfied — see `scripts/verify-setup.ps1 -Check All` (must still return 5/5 `[OK]` before starting; re-run it first if picking this up much later, in case local machine state drifted).

---

## 1. Person / brand content (verified against real GitHub data on 2026-08-24)

- **Name:** Rikelme Batista
- **Role:** Engenheiro de Software, Feira de Santana, BA, Brasil
- **Tagline:** "Transformando lógica em produto — do back-end ao deploy"
- **Bio:** Dev focado em resolver problemas reais com código — sistemas internos de gestão (ERP/facilities), automações de processos operacionais, bots de WhatsApp e aplicações multiplataforma, do back-end ao deploy em Docker.
- **Focus:** Automações, SaaS, Sistemas Web, ERP
- **Stack:** Go, TypeScript, Node.js, Python, React, C#, PostgreSQL, Supabase, Docker
- **Contact:** GitHub `https://github.com/YukinaruX` · LinkedIn `https://www.linkedin.com/in/rikelme-batista-196561272` · Email `nevepsiquica333@gmail.com`

### Featured projects (final list — 4, confirmed by user, overriding earlier candidates)

1. **Facilities MG** — private repos `Mansao-Green-Software/facilities-backend` + `facilities-frontend` (same system, two repos — treat as one project). Sistema interno de gestão de facilities para a Mansão Green: controla ciclo completo de solicitações de materiais, equipamentos, veículos, encomendas, assinaturas e atividades operacionais, com fluxos de aprovação e rastreamento de status em tempo real. Stack: Go 1.23 (backend), React 18 + TypeScript (frontend). **No repo link** (private, user's employer) — describe as a case study only.
2. **Lideres-MG** — private repo `Mansao-Green-Software/Lideres-MG`. Sistema interno de gestão de performance para squads de vendas ao vivo (chamadas/lives em grupos de Telegram/WhatsApp) atuando em iGaming, vendas diretas e captação de FTD: planejamento diário/semanal, execução de chamadas, metas mensais vs. realizado, aderência a scripts/funis, alertas de risco de meta. Stack: Go + React. **No repo link** (private, employer) — case study only.
3. **Estudos CRECI-BA** — public repo `YukinaruX/sistema-pessoal-pra-estudo-de-concurso-creci`. Sistema pessoal de estudos para o concurso do CRECI-BA (corretor de imóveis, banca Quadrix): simulados com cronômetro e autosave, histórico de desempenho, plano de estudos, revisão de erros por repetição espaçada (Leitner, 5 caixas), múltiplos jogos educativos (Sobrevivência, Trilha do Saber). Stack: Vite + React + Supabase (Postgres + Auth + RLS). **Link OK** — `https://github.com/YukinaruX/sistema-pessoal-pra-estudo-de-concurso-creci`.
4. **Landing Page — Everton Editor** — public repo `YukinaruX/Landing-Page-Everton-Editor`, a freelance/client project (not the user's own product — for Everton Sousa Gonçalves, video editor/motion designer). Static HTML/CSS/JS, no framework, deployed on Vercel. **Link OK** — repo `https://github.com/YukinaruX/Landing-Page-Everton-Editor`, live site `https://landing-page-everton-editor-6nvp.vercel.app/`.

Projects considered and explicitly dropped: `Facilities-mg-go` (personal repo, superseded by the real org repos above), `chip-guard-hub`/"Contingency Hub" and `device-flow-manager` (same domain — user chose to drop both entirely in favor of the final 4-project list), `encanto-festa`, `fazaboa-delivery-app`, `biolead-ai`, and the rest of the ~29 repos audited (mostly Lovable/Manus-scaffolded or low-commit-count, not featured).

---

## 2. Approved site plan

**Palette** (reused from the user's existing GitHub profile README theme, for brand consistency):
- `bg`: `#0d1117`
- `accent`: `#00d4ff`
- Text: white/light gray on the dark background

```json
{
  "brand": "Rikelme Batista",
  "palette": { "bg": "#0d1117", "accent": "#00d4ff", "text": "#e6edf3" },
  "sections": [
    {
      "type": "hero",
      "id": "hero",
      "nav_label": "Início",
      "technique": "video-scroll-effect",
      "content_brief": "Nome 'Rikelme Batista', cargo 'Engenheiro de Software', tagline 'Transformando lógica em produto — do back-end ao deploy'. Visual: conceito 'Terminal vira arquitetura' — texto/código caindo no escuro (estilo terminal, sutil, não literal Matrix) que dissolve e se recompõe numa cidade isométrica de servidores/pipelines brilhando em ciano sobre fundo #0d1117. Gerar via Google Flow (MCP google-flow, tools flow_*) — NÃO Higgsfield, ver seção 4 abaixo. Sugestão de estrutura: 2 beats — (1) queda/dissolução de código, (2) arquitetura isométrica revelada e assentada."
    },
    {
      "type": "about",
      "id": "sobre",
      "nav_label": "Sobre",
      "technique": "hybrid-2d3d",
      "content_brief": "Bio curta (ver seção 1), foco (Automações/SaaS/Sistemas Web/ERP), badges de stack (Go, TypeScript, Node.js, Python, React, C#, PostgreSQL, Supabase, Docker), localização (Feira de Santana, BA). Custo zero — sem geração, layout editorial com objeto 3D procedural pequeno e discreto (não disputa espaço com hero/Facilities MG)."
    },
    {
      "type": "project-featured",
      "id": "facilities-mg",
      "nav_label": "Facilities MG",
      "technique": "video-scroll-effect",
      "content_brief": "Case study do sistema Facilities MG (ver descrição completa na seção 1, item 1) — SEM link de repositório (privado, propriedade do empregador do usuário), apresentar como case/descrição apenas. Visual: conceito 'Rede neural pulsante' — malha de nós conectados brilhando em ciano, partículas de dados fluindo entre pontos, pulsando — metáfora para solicitações/aprovações/materiais fluindo em tempo real pelo sistema (encaixa no domínio real do produto). Gerar via Google Flow — ver seção 4."
    },
    {
      "type": "projects-tour",
      "id": "projetos",
      "nav_label": "Projetos",
      "technique": "click-navigate",
      "content_brief": "Tour com 3 hotspots, um por projeto, custo zero (sem geração): (1) Lideres-MG — case study, SEM link (privado); descrição completa na seção 1, item 2. (2) Estudos CRECI-BA — COM link para o repo público; descrição na seção 1, item 3. (3) Landing Page Everton Editor — COM link para o repo público E para o site ao vivo; descrição na seção 1, item 4, deixar claro que é um projeto freelance/cliente, não produto próprio."
    },
    {
      "type": "contact",
      "id": "contato",
      "nav_label": "Contato",
      "technique": "hybrid-2d3d",
      "content_brief": "GitHub, LinkedIn e e-mail (ver seção 1) como CTAs claros. Custo zero — sem geração."
    }
  ]
}
```

No reference site was used — this plan was built from scratch (creative mode), not cloned from another site's structure.

---

## 3. Generation scope (deliberately testing google-flow)

- **2 sections generate real video via Google Flow:** `hero` and `facilities-mg`. This was an explicit user request — the whole build exists partly to exercise the `google-flow` MCP integration set up in the dependency-setup plan.
- **3 sections stay zero-cost** (`sobre`, `projetos`, `contato`) — deliberately, to keep generation scope focused rather than maximal on a first real test of the MCP.
- No Higgsfield credit estimate applies (Google Flow is subscription-quota-based, not per-clip credits — see `AGENTS.md`'s "Backend de geração alternativo" section). Generation is sequential (Flow has no batch mode) — expect the two clips to generate one after another, not in parallel; budget wall-clock time accordingly.

---

## 4. MANDATORY: Google Flow briefing note (read before invoking video-scroll-effect)

The real installed `scroll-3d` plugin has **no `ASSET_BACKEND` flag** — `asset-generator`/`site-planner` are hardcoded to Higgsfield with no pluggable mechanism (verified in `docs/plugin-conventions.md`; full context in `AGENTS.md`'s "Configuração local deste projeto" section). This means: when this plan is executed, whoever invokes `video-scroll-effect` for the `hero` and `facilities-mg` sections **must explicitly state in that invocation's briefing** that those two sections should use the `flow_*` tools of the `google-flow` MCP server (registered locally — `claude mcp list` should show it) instead of the default Higgsfield pipeline. This is not automatic and must be repeated at invocation time — there is no persistent config that makes it happen on its own.

Before invoking, also re-confirm `google-flow` is still registered and its config still points at a real, current Google account:
```powershell
claude mcp list   # expect a line for google-flow
powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check GoogleFlowMcp
```

---

## 5. Execution steps (when resuming — no further user confirmation needed, Step 2c already approved this exact plan)

1. Re-run `scripts/verify-setup.ps1 -Check All` — confirm 5/5 `[OK]` (machine state may have drifted since 2026-08-24).
2. Re-confirm `google-flow` MCP registration per Section 4 above.
3. Group `plan.sections` (Section 2's JSON) by `technique`: `video-scroll-effect` owns `hero` + `facilities-mg` (in that order — hero is section 1, so it goes first); `hybrid-2d3d` owns `sobre` + `contato`; `click-navigate` owns `projetos`.
4. Invoke `video-scroll-effect` first (it owns the first section, `hero`) with: both its sections (`hero`, `facilities-mg`) in plan order, `plan.brand`/`plan.palette` from Section 2, the full ordered `{id, nav_label}` list from all 5 sections (for building the nav bar once), a connected-folder/project slug, and the explicit Google Flow briefing from Section 4 for both of its sections. Do NOT let it run its own deploy step yet — it does not own the last section.
5. Invoke `hybrid-2d3d` next, into the same project folder, for `sobre` and `contato` — no generation needed, no deploy.
6. Invoke `click-navigate` last (it owns `projetos`, the last section in plan order) into the same project folder, for its 3-hotspot tour per Section 2's `content_brief` — **this is the skill that runs the final deploy step** (Cloudflare Pages, per `AGENTS.md`/`docs/plugin-conventions.md` — needs `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`, already set per `scripts/verify-setup.ps1 -Check CloudflareEnv`). Tell `video-scroll-effect` and `hybrid-2d3d` explicitly to skip their own deploy steps when invoking them.
7. Relay any `⚠️ Plan deviations` the executing skills report (e.g. if Flow generation fails for `hero` or `facilities-mg` and something reroutes) — do not silently absorb them; this is mandatory per the plugin's own build-integrity rules (`AGENTS.md`, "Princípios de integridade do build").
8. Confirm the live URL loads and a `DESIGN.md` (plan vs. actual result table) was generated in the connected folder before declaring this done.

## Execution attempt log

**2026-08-24, attempt 1:** Ran Section 5 steps 1-3 successfully (`verify-setup.ps1 -Check All` 5/5 OK, `claude mcp list`/`claude mcp get google-flow` both show it registered + `✔ Connected`). Invoked `scroll-3d:video-scroll-effect` for `hero` + `facilities-mg` per step 4. **Blocked immediately**: none of the `google-flow` MCP's tools (`flow_connect`, `flow_generate_image`, `flow_generate_video`, etc. — see `Google-Flow_MCP`'s README "Available tools" table) were visible via `ToolSearch` in that session, despite the server showing as connected via the standalone `claude mcp` CLI. Root cause (likely): the MCP server was registered via `claude mcp add -s local` in an earlier session (Task 5 of the dependency-setup plan) — Claude Code loads project-local MCP servers at session start, so a server registered mid-session doesn't retroactively appear in that same session's tool list. Did NOT fall back to Higgsfield or any substitute — stopped and asked the user. **User is restarting the Claude Code session** to pick up the MCP server; resume from here once tools are confirmed available.

**When resuming:** before anything else, confirm `google-flow`'s tools are now visible (e.g. `ToolSearch` for `flow_connect` or similar) — if still not visible, this is a deeper problem (not just a session-load timing issue) and needs fresh investigation, don't assume a second restart will fix it. Once tools ARE visible, you still need `flow_connect` (which internally launches/attaches Chrome via CDP per the server's own README "Typical workflow") before `flow_generate_image`/`flow_generate_video` will work — this opens a real, visible Chrome window signed into the user's real Google account; that's expected/intended (not a bug), but worth a heads-up to the user in the moment since it's a visible side effect on their machine, not a silent background action.

**2026-08-24, attempt 2:** Resumed in a new session. `google-flow` MCP tools ARE now visible via `ToolSearch` (attempt 1's blocker confirmed resolved by session restart). Re-ran `verify-setup.ps1 -Check All` — 5/5 `[OK]` (ffmpeg needed a `$env:Path` refresh from Machine/User scope first; this is a known sandbox PATH artifact, not a real ffmpeg absence — same fix noted in `[[scroll3d-dependency-setup-status]]`). Invoked `video-scroll-effect` for `hero` + `facilities-mg` with the Google Flow briefing. **Blocked again, new issue**: `flow_connect` failed with `Chrome profile "Default" not found at C:\Users\<username>\AppData\Local\Google\Chrome\User Data\Default`. Root cause (confirmed via systematic-debugging): `config/flow.config.json`'s `chromeUserDataDir` field still held the literal unsubstituted template placeholder `C:/Users/<username>/AppData/Local/Google/Chrome/User Data` — never filled in with the real username during Task 5 of the dependency-setup plan, even though `expectedAccount`/`chromeProfile` were. The real profile does exist at `C:/Users/User/AppData/Local/Google/Chrome/User Data/Default` (verified). **Fixed the config file** (`<username>` → `User`), but `flow_connect` still returned the identical stale error afterward — the running `google-flow` MCP server process reads `flow.config.json` once at startup and caches it in memory (same class of issue as attempt 1's tool-visibility blocker: no `claude mcp` CLI subcommand reloads/restarts a single live server mid-session). **Config fix is in place; a session restart should pick it up.** Did not attempt any Higgsfield fallback — per this skill's own rule, a Flow connection failure is reported upward, not silently rerouted.

**When resuming (attempt 3):** the config fix is already committed to `flow.config.json` — do not re-diagnose this from scratch. First call should be `mcp__google-flow__flow_connect` directly (skip re-running verify-setup/mcp-list, those were already 5/5 clean in attempt 2 and machine state hasn't had time to drift). If it still reports the `<username>` path, something re-wrote/reverted the config — investigate fresh rather than assuming another restart fixes it. If it connects, proceed straight to generating the `hero` keyframe/video per Section 4's briefing.

**2026-08-24, attempt 3:** Resumed in a new session (user restarted per attempt 2's instructions). Called `mcp__google-flow__flow_connect` directly. **Blocked again, third distinct issue**: `EPIPE, O arquivo já está sendo usado por outro processo` on `...\Temp\chrome-kiara-cdp-<ts>\Default\Network`. Root cause (read `Google-Flow_MCP/src/browser/connect.js`, `launchChromeDirect()`, lines ~105-136): the server always copies the entire real Chrome `Default` profile folder (`fs.cpSync(profileSource, ..., { recursive: true })`, no locked-file handling) into a fresh temp dir before launching an isolated CDP-connected Chrome instance — this is unconditional, no config flag avoids it. The user's real Chrome was running at the time (13 `chrome.exe` processes, one visible window with active work), which locks profile DB files (e.g. under `Default/Network`) and makes the copy fail. **Fix: user closed all real Chrome windows** (confirmed via `Get-Process chrome` → 0), then `flow_connect` succeeded — browser connected, navigated to `https://labs.google/fx/tools/flow` (`flowAccessible: true`), `flow_account_check` verified `nevepsiquica333@gmail.com` (`method: "assumed"`, i.e. cookie/profile-based, not a hard DOM read — fine given the real profile's cookies were copied). One transient hiccup along the way: the first post-fix `flow_connect` call itself threw `page.goto: Timeout 30000ms exceeded` waiting for `networkidle` (Google Flow likely keeps background connections open, so `networkidle` may never fire within 30s) — but `flow_status` right after showed the browser/page had actually connected and loaded fine, so this specific timeout was not a real blocker, just a `networkidle` wait heuristic mismatch.

**When resuming (attempt 4, if ever needed):** `flow_connect` requires the real Chrome to be fully closed first (`Get-Process chrome` should return 0) — this is now a standing precondition, not a one-off; add it to Section 4's pre-flight checklist if this keeps recurring. If `flow_connect` throws a `networkidle` timeout, don't treat it as fatal on its own — call `flow_status`/`flow_account_check` next to see if the connection actually succeeded anyway before retrying or escalating.

**2026-08-24, attempt 3 (continued) — fourth distinct bug found:** With `flow_connect`/`flow_account_check` both green, invoked `scroll-3d:video-scroll-effect` directly for `hero`+`facilities-mg` (skipped re-invoking `site-planner`, per this plan's own "Execution steps" note that the plan is already approved). Followed the skill's pipeline, substituting `flow_generate_image`/`flow_generate_video` for the skill's Higgsfield calls per Section 4's mandatory briefing. `ffmpeg` failed in both the Bash and PowerShell tool shells (`command not found`) — confirmed via `Get-ChildItem` that the winget install is still genuinely present on disk (`$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe`) — same known sandbox PATH artifact as `[[scroll3d-dependency-setup-status]]`, not a real absence; use the full path or refresh `$env:Path` from Machine+User scope in whichever shell actually runs `extract-frames.sh` later.

`flow_generate_image` (auto_confirm:false, for the `hero` keyframe) failed: `"Could not find project card to navigate into. The project was created but no card link was found."` Screenshots (`flow_screenshot`, plus the tool's own auto-saved debug screenshots) showed the browser was sitting on Google Flow's public marketing "Tools" page (`.../flow#tools`), not an authenticated in-app project workspace — no account avatar visible. Debug screenshots and a `flow_discover_ui` call both revealed the actual bug: they write/read relative to `C:\my-portfolio` (this project's cwd) instead of the `Google-Flow_MCP` server's own install directory — e.g. `flow_discover_ui` threw `ENOENT ... 'C:\my-portfolio\config\selectors.map.json'`. Root cause (read `src/utils/config.js`): `getFlowHome()` returns `config.flowHome || FLOW_HOME` — and `flow.config.json` had `"flowHome": "."`, a truthy relative string that wins over the correctly-computed absolute `FLOW_HOME` fallback; every consumer (`discover-ui.js`'s `SELECTORS_PATH`, `screenshots.js`'s `SCREENSHOT_DIR`, `file-manager.js`'s `OUTPUT_BASE`, `project-navigator.js`'s `PROJECTS_FILE`) does a naive `path.join(getFlowHome(), ...)` with no cwd-anchoring, so `"."` silently resolves against the MCP server *process's* cwd (which Claude Code sets to the connected project folder) instead of the server's own directory. This most likely explains the "could not find project card" error too: `project-navigator.js`'s `PROJECTS_FILE` (`config/flow.projects.json`, the project registry it reads/writes to locate existing project cards) was being read from the wrong location. **Fixed:** `flow.config.json`'s `flowHome` changed from `"."` to the real absolute path `C:/Users/User/mcp-servers/Google-Flow_MCP` (same fix pattern as the earlier `chromeUserDataDir` fix). Cleaned up the misplaced `C:\my-portfolio\screenshots-debug\` debug artifacts this bug produced (own-session junk, not user content). **Same caching problem as every previous config fix: the already-running MCP server process cached `flowHome: "."` in memory at startup (`config.js` reads the file once at module load) — needs a session restart to pick up.**

**When resuming (attempt 4):** the `flowHome` fix is already committed to `flow.config.json` — don't re-diagnose from scratch. After restart: (1) `flow_connect` (Chrome must be closed first, see attempt 3's note above), (2) `flow_account_check`, (3) `flow_discover_ui` with `page:"main"` as a smoke test — if it no longer throws the `selectors.map.json` ENOENT, the fix landed; if it does, the config got reverted/overwritten, investigate fresh — (4) proceed to `flow_generate_image` for the `hero` keyframe (prompt/model/ratio already drafted in this log's attempt-3 tool call: "Terminal vira arquitetura" concept, Nano Banana Pro, 16:9, project_name "rikelme-portfolio", campaign "hero"). Use the full `ffmpeg.exe` path noted above (or refresh `$env:Path`) once frame extraction is reached.

## Open questions at execution time (none blocking — judgment calls for whoever resumes this)

- Exact `beats`/motion keyword names for the two `video-scroll-effect` sections are left to that skill's own vocabulary (`molten-birth`, `frozen-time`, `bloom`, `descent`, `light-reveal`, or a custom `beats` sequence) — the `content_brief` text in Section 2 describes the narrative, not a literal enum value; pick whichever named pattern (or custom beats) best matches the described narrative when actually generating.
- If Google Flow generation fails or is unavailable when this is picked up, follow the plugin's own fallback rule: mark the section as an explicit plan deviation (Section 5, step 7) rather than silently swapping to Higgsfield or a cheaper technique.
