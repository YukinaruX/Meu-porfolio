# flow-asset-generator

Substituto do `asset-generator` original do plugin `scroll-3d`, trocando o backend de geração de vídeo/imagem de **Higgsfield MCP** por **Google Flow MCP** (via browser automation, usando sua própria assinatura Google AI Pro/Ultra em vez de créditos por geração).

> ⚠️ Nota de honestidade: não tenho acesso ao código-fonte real do `asset-generator` do repositório `ankitstage21/3D-website` — não foi lido nesta conversa. O que segue é um adaptador construído a partir (1) do comportamento documentado do plugin no seu `AGENTS.md` e (2) da interface real de tools exposta pelos servidores MCP do Flow disponíveis hoje (ex. `Mitanshp5/Google-Flow_MCP`, `TMSSS05/google-flow-browser-mcp`). Antes de usar em produção, confira se os nomes de parâmetro batem com a versão do `asset-generator` que você tem instalada e ajuste o mapeamento se preciso.

## Por que isso existe

O `site-planner` do scroll-3d chama `asset-generator` toda vez que uma seção precisa de vídeo (`video-scroll-effect`) ou de cena 3D com textura gerada (`3d-scene-effect`, `hybrid-2d3d`). Na versão original, `asset-generator` fala com o **Higgsfield MCP**. Como você só tem o **Flow**, este arquivo redefine essa ponte.

## Pré-requisitos

1. Um dos MCP servers de Flow instalado e autenticado com sua conta Google (Chrome com CDP ativo):
   - `Mitanshp5/Google-Flow_MCP` (multiplataforma, Node)
   - `TMSSS05/google-flow-browser-mcp` (base do anterior)
2. Registrar o servidor no seu client (Claude Code / Cowork):
   ```bash
   git clone https://github.com/Mitanshp5/Google-Flow_MCP.git
   cd Google-Flow_MCP
   npm install
   npm run start-browser   # abre Chrome com --remote-debugging-port
   npm run start-mcp       # sobe o servidor MCP
   ```
3. Confirmar que o Chrome usado está logado na conta com a assinatura Google AI Pro/Ultra (é ela que paga a geração — não crédito avulso).

## Mapeamento de chamadas: Higgsfield → Flow

| Intenção do `site-planner` | Tool Higgsfield (original) | Tool Flow (substituta) | Observação |
|---|---|---|---|
| Gerar clipe de vídeo pra uma seção | `higgsfield generate video` | `flow_generate_video` | Flow aceita referenciar imagens/personagens já gerados via `@name` (ingredients) |
| Gerar still/imagem de referência | `higgsfield generate image` | `flow_generate_image` | Modelos: Imagen 4 / Nano Banana Pro / Nano Banana 2 |
| Criar personagem consistente entre seções | (Soul / character training) | `flow_create_character` | Consistência entre clipes via referência por nome |
| Criar cena com múltiplos personagens | — | `flow_create_scene` | Opcional, referencia characters já criados |
| Listar assets/personagens disponíveis pra reuso | — | `flow_list_mention_options` | Usa antes de montar o prompt de uma nova seção, pra reaproveitar consistência |
| Baixar resultado final | download automático | `download-latest` (via CDP) | Idêntico em espírito ao original |

## Diferenças de comportamento que o `build-reviewer` precisa saber

- **Sem custo por crédito avulso**: o Flow consome cota da assinatura, não créditos comprados (ao contrário da estimativa "~54 créditos por clipe 1080p" do Higgsfield). Ajuste ou remova essa linha do checkpoint de aprovação do `site-planner` quando este adaptador estiver ativo.
- **Geração é sequencial, não em lote**: Flow é "one-at-a-time" — não existe geração de 50 vídeos numa tacada. Se uma seção pede múltiplas variações, o `frame-pipeline` precisa enfileirar as chamadas em vez de assumir paralelismo.
- **Sem API oficial**: tudo roda por automação de navegador (Playwright + CDP). Isso significa: (a) mais lento por clipe, (b) mais sensível a mudanças de UI do Flow, (c) se a automação falhar no download, o adaptador deve pedir pro usuário baixar manualmente — igual à ressalva que o Higgsfield já tinha ("browser-driven, download pode ser bloqueado").
- **Sem endpoint de "enhance/upscale" dedicado**: se uma seção pedir upscale (equivalente ao Higgsfield Enhancer), não há substituto direto hoje — trate como "desvio do plano" no `DESIGN.md` em vez de simular.

## Regra de integridade (herdada do scroll-3d)

Mantém-se o princípio do plugin original: se `flow_generate_video` falhar ou a automação de download travar, a seção é marcada como **falha explícita** no build — nunca substituída silenciosamente por uma técnica mais barata, e sempre listada em "desvios do plano" no `DESIGN.md`.

## Como ativar no site-planner

No seu fork local, aponte a etapa de geração de assets para este arquivo em vez do `asset-generator` padrão — por exemplo, via uma flag no seu `AGENTS.md`/config do projeto:

```
ASSET_BACKEND=flow   # em vez de higgsfield
```

E garanta que o `site-planner`, ao montar o checkpoint de aprovação, leia esse valor antes de estimar custo/tempo — já que a lógica de "estimativa de créditos" some quando o backend é Flow.