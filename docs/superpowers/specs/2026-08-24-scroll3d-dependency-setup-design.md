# Setup de dependências — scroll-3d em `my-portfolio`

- **Data:** 2026-08-24
- **Status:** aprovado, aguardando plano de implementação

## Contexto

`c:\my-portfolio` vai ser o projeto onde o plugin `scroll-3d` (Claude Code / Claude Cowork) gera um site 3D imersivo a partir de um briefing. Hoje a pasta contém só `AGENTS.md` (doc do plugin) e `SKILL.md` (adapter `flow-asset-generator`), não é repositório git, e nenhuma das dependências opcionais do plugin está configurada.

Verificação feita nesta sessão:
- `/plugin marketplace add ankitstage21/3D-website` e `/plugin install scroll-3d@scroll3d-plugin` foram executados anteriormente, mas **não deixaram rastro** em `~/.claude/plugins` (nem em `cache/`, nem em `marketplaces/`) — o plugin não está de fato instalado.
- `node` v24.16.0, `npm` 11.13.0 e `git` 2.54.0 estão disponíveis.
- `ffmpeg` não está no PATH.
- `winget` e `choco` não estão no PATH deste ambiente (Windows 11).
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` não estão setadas.

## Objetivo

Deixar todas as dependências do `scroll-3d` prontas e verificadas **antes** do primeiro uso real do `site-planner`, para que o fluxo de criação de um site não pare no meio por falta de pré-requisito.

## Fora de escopo

- Não inclui rodar o `site-planner` nem gerar um site de verdade — só o setup de ambiente.
- Não inclui configurar Higgsfield MCP (usuário optou por Google Flow como backend de asset).
- Não inclui automatizar a geração do `CLOUDFLARE_API_TOKEN` (é uma ação manual no dashboard da Cloudflare, só documentamos o passo a passo).

## Passos

### 1. Corrigir instalação do plugin
Reexecutar:
```
/plugin marketplace add ankitstage21/3D-website
/plugin install scroll-3d@scroll3d-plugin
```
Verificação: os arquivos do plugin (`site-planner`, `asset-generator`, `shared-scroll-engine` etc.) devem existir em `~/.claude/plugins/cache` ou `marketplaces` após o comando. Só considerar concluído com evidência em disco, não pelo output do comando.

### 2. Inicializar git
- `git init` em `c:\my-portfolio`
- `.gitignore` cobrindo `node_modules/`, `.env`, saídas de build/deploy, e diretórios temporários de extração de frame (usados pelo `frame-pipeline`)
- Commit inicial com `AGENTS.md` e `SKILL.md` existentes

### 3. ffmpeg no PATH
Necessário para a técnica `video-scroll-effect` (extração de ~180 JPGs).
- Checar se o App Installer (fonte do `winget`) está registrado; se sim, `winget install ffmpeg`.
- Se `winget` continuar indisponível, baixar o build estático recomendado por ffmpeg.org (gyan.dev) e adicionar a pasta `bin` ao PATH do usuário via `setx`.
- Verificação: `ffmpeg -version` numa sessão de shell nova (PATH só propaga em sessões novas).

### 4. Backend de assets: Google Flow
Ativa o adapter descrito em `SKILL.md` (`flow-asset-generator`), no lugar do `asset-generator`/Higgsfield padrão.
- Clonar `Mitanshp5/Google-Flow_MCP`, `npm install`
- Registrar o servidor MCP no client (Claude Code)
- `npm run start-browser` (abre Chrome com `--remote-debugging-port`) e `npm run start-mcp`
- Confirmação manual do usuário: o Chrome aberto precisa estar logado na conta Google com assinatura AI Pro/Ultra (é ela que paga a geração)
- Gravar a flag `ASSET_BACKEND=flow` no `AGENTS.md` do projeto, conforme instruído pelo `SKILL.md`

**Risco registrado:** o `SKILL.md` deste adapter admite explicitamente que foi construído sem acesso ao código-fonte real do `asset-generator` do `scroll-3d` — é um adapter não-oficial, best-effort. Depois que o passo 1 (instalação real do plugin) estiver concluído, é preciso abrir os arquivos reais das skills `site-planner` e `asset-generator` para confirmar se a convenção de flag `ASSET_BACKEND` é de fato lida em algum lugar do fluxo. Se não for, o adapter precisa ser ajustado (ex.: point de integração diferente) antes de depender dele num build real. Isso deve ser um passo explícito do plano de implementação, não assumido como certo.

### 5. Deploy Cloudflare
- Gerar `CLOUDFLARE_API_TOKEN` no dashboard Cloudflare (My Profile → API Tokens → criar token com permissão de deploy Pages/Workers)
- Obter `CLOUDFLARE_ACCOUNT_ID` (barra lateral do dashboard)
- Setar as duas como variável de ambiente **persistente** do usuário no Windows (`setx`), nunca hardcoded em arquivo versionado — `.env` já cai no `.gitignore` do passo 2 caso seja usado como armazenamento intermediário

### 6. Checklist final "pronto pra criar"
Antes de invocar `site-planner` pela primeira vez, confirmar:
- [ ] Plugin `scroll-3d` presente em `~/.claude/plugins`
- [ ] Repositório git inicializado e sem mudanças pendentes
- [ ] `ffmpeg -version` funciona numa sessão nova
- [ ] Servidor MCP do Google Flow responde (Chrome logado na conta certa)
- [ ] `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` setadas no ambiente

## Critério de sucesso

Todos os itens do checklist do passo 6 verificáveis como concluídos, e a ressalva do passo 4 (compatibilidade real do `ASSET_BACKEND=flow`) investigada e resolvida ou documentada como desvio conhecido.
