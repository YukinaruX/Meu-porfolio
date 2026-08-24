# Convenções reais do plugin scroll-3d (verificado em 2026-08-24)

Verificado contra os arquivos reais instalados em:
`C:\Users\User\.claude\plugins\cache\scroll3d-plugin\scroll-3d\0.2.0` (plugin `scroll-3d@scroll3d-plugin`, versão `0.2.0`, conforme `claude plugin list --json`).

Busca executada (Step 1 do brief): `Get-ChildItem -Recurse -Include *.md,*.js,*.mjs,*.json` sobre
o `installPath` acima, com `Select-String -Pattern 'ASSET_BACKEND'` e `Select-String -Pattern 'CLOUDFLARE'`.
Também foram lidos por completo `skills\asset-generator\SKILL.md` e `skills\site-planner\SKILL.md`
(a lógica de decisão de qual backend de geração usar, se existisse, estaria em um desses dois arquivos),
e feita uma busca adicional case-insensitive por `flow`/`google-flow`/`flow_` e por `AGENTS.md` em todo
o `installPath`, para não depender só do grep literal por `ASSET_BACKEND`.

## ASSET_BACKEND
Veredito: ASSET_BACKEND: divergente
Evidência: nenhuma ocorrência de `ASSET_BACKEND` em
`C:\Users\User\.claude\plugins\cache\scroll3d-plugin\scroll-3d\0.2.0` (0 matches no grep do Step 1).
Busca adicional case-insensitive por `flow`, `google-flow` e `flow_` no mesmo `installPath` também
retornou 0 ocorrências, assim como uma busca por `AGENTS.md` (o plugin real não lê esse arquivo em
nenhum ponto). `skills\asset-generator\SKILL.md` (lido por completo) é hardcoded para Higgsfield: usa
literalmente os modelos `nano_banana_pro` (Step 2, imagem) e `seedance_2_0` (Step 3, vídeo) via chamadas
Higgsfield (`generate_image`/`generate_video`), sem nenhum ponto de decisão condicional por variável de
ambiente ou flag — não há branch nem menção a um backend alternativo. `skills\site-planner\SKILL.md`
(lido por completo) reforça isso: seu Step 2c menciona explicitamente "which sections will get
Higgsfield-generated visuals" e "Total estimated **Higgsfield** credit cost" como parte fixa do fluxo de
revisão do plano — o Higgsfield não é um backend plugável, é a única via de geração que o plugin real
conhece. A premissa do `SKILL.md` do adapter `flow-asset-generator` (que `site-planner`/`asset-generator`
leriam uma flag `ASSET_BACKEND=flow` de `AGENTS.md` para trocar para Google Flow) não corresponde ao
código real instalado.

Plano de contingência: abrir `C:\Users\User\.claude\plugins\cache\scroll3d-plugin\scroll-3d\0.2.0\skills\site-planner\SKILL.md`,
localizar o ponto onde invoca `asset-generator` (Step 2c, "Per-section asset plan", e o Step 3 handoff que
delega a cada technique skill, que por sua vez chama `asset-generator`), e documentar ali manualmente —
via briefing passado ao `site-planner` na hora de acionar o plugin, não via edição do arquivo do plugin
instalado — que a seção deve usar as tools `flow_*` do MCP `google-flow` em vez do Higgsfield. A
automação por flag (`ASSET_BACKEND`) não é suportada pelo build real; é preciso instruir isso
explicitamente no briefing/prompt passado ao `site-planner` a cada uso, já que não existe um mecanismo de
configuração persistente para essa troca no plugin como instalado.

## CLOUDFLARE_VARS
Veredito: CLOUDFLARE_VARS: confirmado
Evidência: `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` aparecem literalmente, com esses nomes exatos,
no passo de deploy de todas as 6 technique skills que possuem etapa de deploy (`3d-scene-effect`,
`click-navigate`, `cursor-trail`, `hybrid-2d3d`, `physics-play`, `video-scroll-effect`) — 18 ocorrências
de `CLOUDFLARE` no total no `installPath`. Trecho representativo, idêntico (a menos do número do step) em
todas elas — ex. `skills\3d-scene-effect\SKILL.md`, linhas 100-107:

```
### 5. Deploy to Cloudflare Pages + write out to connected folder
(Same as video-scroll-effect's Step 7/7b — runs once, after all sections from the plan,
whether built by video-scroll-effect, 3d-scene-effect, or both, are in the same project.)
- Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment variables.
- Load credentials first: `set -a && source .env && set +a`.
- Deploy: `npx wrangler pages deploy <project-dir> --project-name=<slug> --branch=main`.
- Confirm the live URL loads before telling the user it's ready.
- Always write out to the connected folder regardless of deploy success.
```

E em `skills\video-scroll-effect\SKILL.md`, linhas 178-181 (fonte canônica, referenciada pelas outras
skills como "Same as video-scroll-effect's Step 7/7b"):

```
- Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set as environment variables
...
  before the wrangler command, so CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are in scope).
```

Os nomes de variável assumidos em `SKILL.md`/`AGENTS.md` do adapter (`CLOUDFLARE_API_TOKEN` e
`CLOUDFLARE_ACCOUNT_ID`) batem exatamente com os nomes reais usados pelo plugin instalado — nenhuma ação
de correção necessária para a Task 6 quanto a nomes de variável.
