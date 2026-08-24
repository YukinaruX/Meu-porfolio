# Setup de Dependências scroll-3d Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar `c:\my-portfolio` com todas as dependências do plugin `scroll-3d` instaladas e verificáveis, para que a primeira invocação real do `site-planner` não pare no meio por falta de pré-requisito.

**Architecture:** Um script PowerShell único (`scripts/verify-setup.ps1`) acumula uma função `Test-*` por dependência, uma por tarefa deste plano. Cada tarefa segue o ciclo: adicionar o check → rodar e confirmar que falha (estado real atual) → resolver a dependência de verdade → rodar de novo e confirmar que passa → commit. A Tarefa 7 roda o script completo como aceite final.

**Tech Stack:** PowerShell 5.1, `claude` CLI (plugins + MCP), git, winget, Node.js/npm (Google-Flow_MCP), Cloudflare dashboard.

## Global Constraints

- Plugin correto: `scroll-3d@scroll3d-plugin`, marketplace `ankitstage21/3D-website` (não `hardi-11/3d-website`, que é o marketplace do README original)
- Backend de geração de assets: **Google Flow**, não Higgsfield (decisão já tomada no spec)
- Nenhuma dependência opcional é obrigatória — o fallback padrão (imagem plana guiada por scroll) funciona sem custo mesmo se algum passo deste plano não for concluído
- Segredos (Cloudflare token, conta Google) nunca em arquivo versionado — sempre variável de ambiente de usuário ou arquivo de config já coberto pelo `.gitignore`
- Referência de spec: `docs/superpowers/specs/2026-08-24-scroll3d-dependency-setup-design.md`

---

### Task 1: `.gitignore` do projeto

**Files:**
- Create: `.gitignore`

**Interfaces:**
- Consumes: nada (primeira tarefa sobre um repositório git já inicializado, com um commit existente contendo o spec)
- Produces: regras de ignore (`node_modules/`, `.env`, `.env.*`, `dist/`, `build/`, `.frame-cache/`, `*.log`) que todas as tarefas seguintes dependem implicitamente para não versionar segredo/artefato gerado

- [ ] **Step 1: Criar arquivos-sonda pra provar que ainda não há ignore**

```bash
mkdir -p node_modules && echo "probe" > node_modules/probe.txt
echo "SECRET=probe" > .env.probe
```

- [ ] **Step 2: Rodar `git status --porcelain` e confirmar que os arquivos-sonda aparecem (falha esperada)**

Run: `git status --porcelain`
Expected: linhas `?? node_modules/` e `?? .env.probe` presentes na saída

- [ ] **Step 3: Escrever o `.gitignore`**

```gitignore
node_modules/
.env
.env.*
dist/
build/
.frame-cache/
*.log
```

- [ ] **Step 4: Rodar `git status --porcelain` de novo e confirmar que os arquivos-sonda sumiram**

Run: `git status --porcelain`
Expected: nenhuma linha contendo `node_modules` ou `.env.probe` (só `?? .gitignore` deve aparecer)

- [ ] **Step 5: Remover os arquivos-sonda (eram só para o teste)**

```bash
rm -rf node_modules .env.probe
```

- [ ] **Step 6: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore for scroll-3d project artifacts and secrets"
```

---

### Task 2: Corrigir instalação do plugin scroll-3d + script de verificação (base)

**Files:**
- Create: `scripts/verify-setup.ps1`

**Interfaces:**
- Consumes: `.gitignore` da Task 1 (garante que nada indevido seja versionado a partir daqui)
- Produces: `scripts/verify-setup.ps1` v1 — parâmetro `-Check` aceitando `Plugin|All`, função `Test-Plugin() -> [bool]`. Tarefas 4, 5 e 6 vão editar este mesmo arquivo adicionando suas próprias funções `Test-*` e expandindo o `ValidateSet`.

- [ ] **Step 1: Escrever o script com o primeiro check**

```powershell
param(
    [ValidateSet('Plugin', 'All')]
    [string]$Check = 'All'
)

function Test-Plugin {
    $installed = claude plugin list --json 2>$null | ConvertFrom-Json
    $found = $installed | Where-Object { $_.id -like 'scroll-3d@*' }
    if ($found) {
        Write-Host "[OK] Plugin: $($found.id) instalado (scope $($found.scope))"
        return $true
    }
    Write-Host "[FAIL] Plugin: nenhum id 'scroll-3d@*' em 'claude plugin list --json'"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
```

- [ ] **Step 2: Rodar o check e confirmar que falha (estado real: plugin não instalado)**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check Plugin`
Expected: linha `[FAIL] Plugin: ...` e exit code `1`

- [ ] **Step 3: Instalar o marketplace e o plugin de verdade**

O one-liner `claude plugin marketplace add ankitstage21/3D-website` falha (`Marketplace file not found`) porque o manifesto do repositório não fica na raiz — ele está em `scroll3d-plugin/.claude-plugin/marketplace.json`, com o plugin em si em `scroll3d-plugin/plugins/scroll-3d/`. `claude plugin marketplace add owner/repo` só procura o manifesto na raiz do repo, e não existe flag pra apontar pra um subdiretório. Apontar `marketplace add` direto pra URL do `marketplace.json` também não funciona sozinho: o `install` subsequente falha porque só o JSON é baixado, não a árvore `plugins/` que o manifesto referencia via `"source": "./plugins/scroll-3d"`.

A solução é clonar o repositório pra um local permanente (não use pasta de scratchpad/temp — remover a marketplace depois desinstala o plugin como efeito colateral) e apontar o `marketplace add` pro subdiretório `scroll3d-plugin` dentro do clone:

```bash
git clone --depth 1 https://github.com/ankitstage21/3D-website.git "$USERPROFILE/.claude/plugin-sources/3D-website"
claude plugin marketplace add "$USERPROFILE/.claude/plugin-sources/3D-website/scroll3d-plugin"
claude plugin install scroll-3d@scroll3d-plugin -y
```

- [ ] **Step 4: Rodar o check de novo e confirmar que passa**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check Plugin`
Expected: linha `[OK] Plugin: scroll-3d@scroll3d-plugin instalado (scope user)` e exit code `0`

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-setup.ps1
git commit -m "feat: install scroll-3d plugin and add setup verification script"
```

---

### Task 3: Investigar convenções reais do plugin instalado (ASSET_BACKEND + variáveis Cloudflare)

**Files:**
- Create: `docs/plugin-conventions.md`

**Interfaces:**
- Consumes: plugin instalado da Task 2 (usa `claude plugin list --json` pra achar o `installPath` real em disco)
- Produces: `docs/plugin-conventions.md` com duas linhas de veredito (`ASSET_BACKEND: confirmado|divergente` e `CLOUDFLARE_VARS: confirmado|divergente`) que as Tasks 5 e 6 leem antes de gravar config

O `SKILL.md` do adapter `flow-asset-generator` admite que foi escrito sem acesso ao código-fonte real do `asset-generator`. Esta tarefa confirma, contra os arquivos reais do plugin já instalado, se a convenção de flag documentada realmente existe.

- [ ] **Step 1: Localizar o `installPath` do plugin e buscar por `ASSET_BACKEND` e `CLOUDFLARE`**

```powershell
$plugin = claude plugin list --json | ConvertFrom-Json | Where-Object { $_.id -like 'scroll-3d@*' }
$installPath = $plugin.installPath
Write-Output "installPath: $installPath"
Get-ChildItem -Recurse -Path $installPath -Include *.md,*.js,*.mjs,*.json -ErrorAction SilentlyContinue |
    Select-String -Pattern 'ASSET_BACKEND' | Tee-Object -Variable assetBackendMatches
Get-ChildItem -Recurse -Path $installPath -Include *.md,*.js,*.mjs,*.json -ErrorAction SilentlyContinue |
    Select-String -Pattern 'CLOUDFLARE' | Tee-Object -Variable cloudflareMatches
```

Expected: a saída lista todos os arquivos reais do `site-planner`/`asset-generator`/`build-reviewer` que mencionam esses termos (pode ser vazia — isso também é um resultado válido).

- [ ] **Step 2: Escrever o veredito em `docs/plugin-conventions.md`**

Se `$assetBackendMatches` não estiver vazio, use o veredito "confirmado" com o(s) caminho(s) encontrado(s). Se estiver vazio, use "divergente" com o plano de contingência abaixo. Mesma lógica para `$cloudflareMatches`, mas se divergente, liste os nomes de variável de ambiente que os arquivos reais usam no lugar de `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` (procure por padrões tipo `process.env.` ou `env.` nos arquivos `.js`/`.mjs` do `installPath`).

```markdown
# Convenções reais do plugin scroll-3d (verificado em 2026-08-24)

## ASSET_BACKEND
Veredito: ASSET_BACKEND: confirmado
Evidência: <caminho(s) de arquivo e trecho encontrados no Step 1>

<!-- Se divergente, use este bloco no lugar do acima:
Veredito: ASSET_BACKEND: divergente
Evidência: nenhuma ocorrência de ASSET_BACKEND em `<installPath>`
Plano de contingência: abrir `<installPath>/skills/site-planner/SKILL.md` (ou arquivo
equivalente), localizar o ponto onde invoca `asset-generator`, e documentar ali
manualmente que a seção deve usar as tools `flow_*` do MCP `google-flow` em vez do
Higgsfield — a automação por flag não é suportada pelo build real, é preciso
instruir isso no briefing passado ao site-planner.
-->

## CLOUDFLARE_VARS
Veredito: CLOUDFLARE_VARS: confirmado
Evidência: <caminho(s) de arquivo e trecho encontrados no Step 1>

<!-- Se divergente, use este bloco no lugar do acima:
Veredito: CLOUDFLARE_VARS: divergente
Nomes reais encontrados: <ex. CF_API_TOKEN, CF_ACCOUNT_ID>
Ação: Task 6 deste plano deve setar os nomes reais listados aqui, não
CLOUDFLARE_API_TOKEN/CLOUDFLARE_ACCOUNT_ID.
-->
```

- [ ] **Step 3: Commit**

```bash
git add docs/plugin-conventions.md
git commit -m "docs: verify ASSET_BACKEND and Cloudflare env var conventions against real plugin files"
```

---

### Task 4: ffmpeg no PATH

**Files:**
- Modify: `scripts/verify-setup.ps1`

**Interfaces:**
- Consumes: `scripts/verify-setup.ps1` v1 (Task 2)
- Produces: `scripts/verify-setup.ps1` v2 — adiciona `Test-Ffmpeg() -> [bool]`, `-Check` ganha o valor `Ffmpeg`. `ffmpeg` fica disponível no PATH de usuário.

- [ ] **Step 1: Adicionar o check (arquivo completo)**

```powershell
param(
    [ValidateSet('Plugin', 'Ffmpeg', 'All')]
    [string]$Check = 'All'
)

function Test-Plugin {
    $installed = claude plugin list --json 2>$null | ConvertFrom-Json
    $found = $installed | Where-Object { $_.id -like 'scroll-3d@*' }
    if ($found) {
        Write-Host "[OK] Plugin: $($found.id) instalado (scope $($found.scope))"
        return $true
    }
    Write-Host "[FAIL] Plugin: nenhum id 'scroll-3d@*' em 'claude plugin list --json'"
    return $false
}

function Test-Ffmpeg {
    $v = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Ffmpeg: $($v | Select-Object -First 1)"
        return $true
    }
    Write-Host "[FAIL] Ffmpeg: 'ffmpeg -version' falhou ou nao esta no PATH"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }
if ($Check -eq 'All' -or $Check -eq 'Ffmpeg') { $results += Test-Ffmpeg }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
```

- [ ] **Step 2: Rodar o check e confirmar que falha**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check Ffmpeg`
Expected: `[FAIL] Ffmpeg: ...` e exit code `1`

- [ ] **Step 3: Instalar via winget**

```powershell
winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
```

Se `winget` não for reconhecido nessa sessão de shell, chame pelo caminho completo:
```powershell
& "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe" install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
```

- [ ] **Step 4: Abrir uma sessão de shell nova (o PATH só propaga em sessões novas) e confirmar que o check passa**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check Ffmpeg`
Expected: `[OK] Ffmpeg: ffmpeg version ...` e exit code `0`

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-setup.ps1
git commit -m "feat: install ffmpeg and add its check to verify-setup"
```

---

### Task 5: Backend de assets Google Flow (MCP + flag no AGENTS.md)

**Files:**
- Create: `C:\Users\User\mcp-servers\Google-Flow_MCP\config\flow.config.json` (fora do repositório — é uma ferramenta reutilizável, não código do site)
- Modify: `scripts/verify-setup.ps1`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: `scripts/verify-setup.ps1` v2 (Task 4); veredito `ASSET_BACKEND` de `docs/plugin-conventions.md` (Task 3)
- Produces: `scripts/verify-setup.ps1` v3 — adiciona `Test-GoogleFlowMcp() -> [bool]` e `Test-AssetBackendFlag() -> [bool]`, `-Check` ganha `GoogleFlowMcp` e `AssetBackendFlag`. Servidor MCP `google-flow` registrado no escopo local do projeto. `AGENTS.md` ganha a flag (ou a nota de divergência, conforme Task 3).

- [ ] **Step 1: Clonar e instalar dependências**

```bash
mkdir -p "$USERPROFILE/mcp-servers"
cd "$USERPROFILE/mcp-servers"
git clone https://github.com/Mitanshp5/Google-Flow_MCP.git
cd Google-Flow_MCP
npm install
```

- [ ] **Step 2: Criar o config a partir do exemplo**

```powershell
Copy-Item "$env:USERPROFILE\mcp-servers\Google-Flow_MCP\config\flow.config.example.json" "$env:USERPROFILE\mcp-servers\Google-Flow_MCP\config\flow.config.json"
```

- [ ] **Step 3: PARAR e perguntar ao usuário dois valores**

Antes de continuar, pergunte ao usuário:
1. Qual é o e-mail da conta Google com a assinatura AI Pro/Ultra que deve gerar os assets (`expectedAccount`)?
2. Qual o nome do perfil do Chrome logado nessa conta? (Peça pra abrir `chrome://version` no Chrome e olhar **Profile Path** — o nome é a última pasta, ex. `Default` ou `Profile 1`.)

Edite `config/flow.config.json` com esses dois valores:

```json
{
  "expectedAccount": "<email fornecido pelo usuário>",
  "chromeProfile": "<perfil fornecido pelo usuário>"
}
```

- [ ] **Step 4: Registrar o servidor MCP no Claude Code (escopo local deste projeto)**

Rodar a partir de `c:\my-portfolio`:
```bash
claude mcp add google-flow -s local -- node "$USERPROFILE/mcp-servers/Google-Flow_MCP/src/index.js"
```

- [ ] **Step 5: Adicionar os checks ao script (arquivo completo)**

```powershell
param(
    [ValidateSet('Plugin', 'Ffmpeg', 'GoogleFlowMcp', 'AssetBackendFlag', 'All')]
    [string]$Check = 'All'
)

function Test-Plugin {
    $installed = claude plugin list --json 2>$null | ConvertFrom-Json
    $found = $installed | Where-Object { $_.id -like 'scroll-3d@*' }
    if ($found) {
        Write-Host "[OK] Plugin: $($found.id) instalado (scope $($found.scope))"
        return $true
    }
    Write-Host "[FAIL] Plugin: nenhum id 'scroll-3d@*' em 'claude plugin list --json'"
    return $false
}

function Test-Ffmpeg {
    $v = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Ffmpeg: $($v | Select-Object -First 1)"
        return $true
    }
    Write-Host "[FAIL] Ffmpeg: 'ffmpeg -version' falhou ou nao esta no PATH"
    return $false
}

function Test-GoogleFlowMcp {
    $configPath = "$env:USERPROFILE\mcp-servers\Google-Flow_MCP\config\flow.config.json"
    if (-not (Test-Path $configPath)) {
        Write-Host "[FAIL] GoogleFlowMcp: config nao encontrado em $configPath"
        return $false
    }
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if (-not $config.expectedAccount -or $config.expectedAccount -eq 'your-email@gmail.com') {
        Write-Host "[FAIL] GoogleFlowMcp: expectedAccount nao preenchido em flow.config.json"
        return $false
    }
    $mcpList = claude mcp list 2>&1 | Out-String
    if ($mcpList -notmatch 'google-flow') {
        Write-Host "[FAIL] GoogleFlowMcp: 'google-flow' nao aparece em 'claude mcp list'"
        return $false
    }
    Write-Host "[OK] GoogleFlowMcp: config preenchido e servidor registrado (conta $($config.expectedAccount))"
    return $true
}

function Test-AssetBackendFlag {
    $agentsPath = "$PSScriptRoot\..\AGENTS.md"
    $content = Get-Content $agentsPath -Raw
    if ($content -match 'ASSET_BACKEND\s*=\s*flow') {
        Write-Host "[OK] AssetBackendFlag: ASSET_BACKEND=flow presente em AGENTS.md"
        return $true
    }
    Write-Host "[FAIL] AssetBackendFlag: ASSET_BACKEND=flow ausente em AGENTS.md"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }
if ($Check -eq 'All' -or $Check -eq 'Ffmpeg') { $results += Test-Ffmpeg }
if ($Check -eq 'All' -or $Check -eq 'GoogleFlowMcp') { $results += Test-GoogleFlowMcp }
if ($Check -eq 'All' -or $Check -eq 'AssetBackendFlag') { $results += Test-AssetBackendFlag }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
```

- [ ] **Step 6: Rodar os dois novos checks e confirmar que ainda falham (AGENTS.md sem a flag ainda)**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check GoogleFlowMcp`
Expected: `[OK]` se os steps 1–4 já foram concluídos corretamente (este check valida config + registro, não depende da flag)

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check AssetBackendFlag`
Expected: `[FAIL] AssetBackendFlag: ...` (a flag ainda não foi escrita)

- [ ] **Step 7: Gravar a flag no `AGENTS.md`**

Se o veredito de `docs/plugin-conventions.md` for `ASSET_BACKEND: confirmado`, adicione ao final de `AGENTS.md`:

```markdown

## Configuração local deste projeto

ASSET_BACKEND=flow
```

Se o veredito foi `divergente`, adicione em vez disso a nota de contingência (copie o texto do "Plano de contingência" escrito em `docs/plugin-conventions.md` Step 2 da Task 3) e ajuste `Test-AssetBackendFlag` no script para procurar por essa nota em vez do padrão `ASSET_BACKEND=flow` — nesse caso, descreva a mudança feita no commit da Step 9 abaixo em vez de seguir o texto genérico.

- [ ] **Step 8: Rodar o check de novo e confirmar que passa**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check AssetBackendFlag`
Expected: `[OK] AssetBackendFlag: ASSET_BACKEND=flow presente em AGENTS.md` e exit code `0`

- [ ] **Step 9: Commit**

```bash
git add scripts/verify-setup.ps1 AGENTS.md
git commit -m "feat: register google-flow MCP server and record ASSET_BACKEND flag"
```

---

### Task 6: Credenciais de deploy Cloudflare

**Files:**
- Modify: `scripts/verify-setup.ps1`

**Interfaces:**
- Consumes: `scripts/verify-setup.ps1` v3 (Task 5); veredito `CLOUDFLARE_VARS` de `docs/plugin-conventions.md` (Task 3)
- Produces: `scripts/verify-setup.ps1` v4 — adiciona `Test-CloudflareEnv() -> [bool]`, `-Check` ganha `CloudflareEnv`. Variáveis de ambiente de usuário `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` (ou os nomes reais, se `docs/plugin-conventions.md` apontou divergência) setadas de forma persistente.

- [ ] **Step 1: Adicionar o check (arquivo completo — repete as 4 funções anteriores e acrescenta a nova)**

```powershell
param(
    [ValidateSet('Plugin', 'Ffmpeg', 'GoogleFlowMcp', 'AssetBackendFlag', 'CloudflareEnv', 'All')]
    [string]$Check = 'All'
)

function Test-Plugin {
    $installed = claude plugin list --json 2>$null | ConvertFrom-Json
    $found = $installed | Where-Object { $_.id -like 'scroll-3d@*' }
    if ($found) {
        Write-Host "[OK] Plugin: $($found.id) instalado (scope $($found.scope))"
        return $true
    }
    Write-Host "[FAIL] Plugin: nenhum id 'scroll-3d@*' em 'claude plugin list --json'"
    return $false
}

function Test-Ffmpeg {
    $v = & ffmpeg -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Ffmpeg: $($v | Select-Object -First 1)"
        return $true
    }
    Write-Host "[FAIL] Ffmpeg: 'ffmpeg -version' falhou ou nao esta no PATH"
    return $false
}

function Test-GoogleFlowMcp {
    $configPath = "$env:USERPROFILE\mcp-servers\Google-Flow_MCP\config\flow.config.json"
    if (-not (Test-Path $configPath)) {
        Write-Host "[FAIL] GoogleFlowMcp: config nao encontrado em $configPath"
        return $false
    }
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    if (-not $config.expectedAccount -or $config.expectedAccount -eq 'your-email@gmail.com') {
        Write-Host "[FAIL] GoogleFlowMcp: expectedAccount nao preenchido em flow.config.json"
        return $false
    }
    $mcpList = claude mcp list 2>&1 | Out-String
    if ($mcpList -notmatch 'google-flow') {
        Write-Host "[FAIL] GoogleFlowMcp: 'google-flow' nao aparece em 'claude mcp list'"
        return $false
    }
    Write-Host "[OK] GoogleFlowMcp: config preenchido e servidor registrado (conta $($config.expectedAccount))"
    return $true
}

function Test-AssetBackendFlag {
    $agentsPath = "$PSScriptRoot\..\AGENTS.md"
    $content = Get-Content $agentsPath -Raw
    if ($content -match 'ASSET_BACKEND\s*=\s*flow') {
        Write-Host "[OK] AssetBackendFlag: ASSET_BACKEND=flow presente em AGENTS.md"
        return $true
    }
    Write-Host "[FAIL] AssetBackendFlag: ASSET_BACKEND=flow ausente em AGENTS.md"
    return $false
}

function Test-CloudflareEnv {
    $token = [Environment]::GetEnvironmentVariable('CLOUDFLARE_API_TOKEN', 'User')
    $account = [Environment]::GetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID', 'User')
    if ($token -and $account) {
        Write-Host "[OK] CloudflareEnv: CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID setados (usuario)"
        return $true
    }
    Write-Host "[FAIL] CloudflareEnv: falta CLOUDFLARE_API_TOKEN e/ou CLOUDFLARE_ACCOUNT_ID (variavel de ambiente do usuario)"
    return $false
}

$results = @()
if ($Check -eq 'All' -or $Check -eq 'Plugin') { $results += Test-Plugin }
if ($Check -eq 'All' -or $Check -eq 'Ffmpeg') { $results += Test-Ffmpeg }
if ($Check -eq 'All' -or $Check -eq 'GoogleFlowMcp') { $results += Test-GoogleFlowMcp }
if ($Check -eq 'All' -or $Check -eq 'AssetBackendFlag') { $results += Test-AssetBackendFlag }
if ($Check -eq 'All' -or $Check -eq 'CloudflareEnv') { $results += Test-CloudflareEnv }

if ($results -contains $false) { exit 1 }
Write-Output "Todos os checks selecionados passaram."
exit 0
```

Se `docs/plugin-conventions.md` apontou nomes de variável diferentes de `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`, troque os dois literais dentro de `Test-CloudflareEnv` pelos nomes reais antes de seguir.

- [ ] **Step 2: Rodar o check e confirmar que falha**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check CloudflareEnv`
Expected: `[FAIL] CloudflareEnv: ...` e exit code `1`

- [ ] **Step 3: PARAR e pedir para o usuário gerar o token**

Peça para o usuário:
1. Abrir `https://dash.cloudflare.com/profile/api-tokens`
2. Clicar em **Create Token**
3. Usar um token customizado com permissão de deploy (Account → Cloudflare Pages → Edit, ou Workers Scripts → Edit, conforme o que `docs/plugin-conventions.md` tiver confirmado sobre o alvo real de deploy)
4. Copiar o token gerado
5. Pegar o **Account ID** na barra lateral direita do dashboard (em qualquer domínio/Workers & Pages overview)
6. Colar os dois valores na conversa

- [ ] **Step 4: Setar as variáveis de ambiente de usuário, de forma persistente**

```powershell
[Environment]::SetEnvironmentVariable('CLOUDFLARE_API_TOKEN', '<token fornecido pelo usuário>', 'User')
[Environment]::SetEnvironmentVariable('CLOUDFLARE_ACCOUNT_ID', '<account id fornecido pelo usuário>', 'User')
```

- [ ] **Step 5: Abrir uma sessão de shell nova e confirmar que o check passa**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check CloudflareEnv`
Expected: `[OK] CloudflareEnv: ...` e exit code `0`

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-setup.ps1
git commit -m "feat: add Cloudflare deploy credentials check to verify-setup"
```

---

### Task 7: Verificação final completa

**Files:**
- Modify: `docs/superpowers/specs/2026-08-24-scroll3d-dependency-setup-design.md`

**Interfaces:**
- Consumes: `scripts/verify-setup.ps1` v4 completo (todas as tasks anteriores)
- Produces: checklist do spec marcado como concluído; confirmação de que o projeto está pronto para a primeira invocação real do `site-planner`

- [ ] **Step 1: Rodar todos os checks de uma vez**

Run: `powershell -ExecutionPolicy Bypass -File scripts/verify-setup.ps1 -Check All`
Expected: cinco linhas `[OK]` (Plugin, Ffmpeg, GoogleFlowMcp, AssetBackendFlag, CloudflareEnv), mensagem final "Todos os checks selecionados passaram." e exit code `0`

- [ ] **Step 2: Marcar o checklist do spec como concluído**

Em `docs/superpowers/specs/2026-08-24-scroll3d-dependency-setup-design.md`, na seção "### 6. Checklist final "pronto pra criar"", marque as cinco caixas `- [ ]` como `- [x]`.

- [ ] **Step 3: Commit final**

```bash
git add docs/superpowers/specs/2026-08-24-scroll3d-dependency-setup-design.md
git commit -m "chore: mark scroll-3d dependency setup checklist complete"
```
