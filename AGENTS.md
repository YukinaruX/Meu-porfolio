# AGENTS.md — scroll-3d

Plugin para Claude Code / Claude Cowork que transforma um briefing em texto em um site 3D imersivo, com movimento de profundidade real acionado por scroll.

## Visão geral

- **Entrada:** uma frase de briefing (ou um site de referência a clonar)
- **Saída:** URL ao vivo (deploy Cloudflare) + código-fonte salvo na pasta conectada
- **Stack de renderização:** Three.js (fixado na versão r160) + WebGL
- **Sem custo obrigatório:** o fallback padrão (imagem plana guiada por scroll) não depende de nenhum serviço pago

## Instalação

```bash
/plugin marketplace add ankitstage21/3D-website
/plugin install scroll-3d@scroll3d-plugin
```

> **Atenção:** o README do repositório original referencia o marketplace `hardi-11/3d-website`. Ao instalar a partir deste fork, use `ankitstage21/3D-website`. O nome do plugin em si é sempre `scroll-3d@scroll3d-plugin`.

Repositório: https://github.com/ankitstage21/3D-website

## Dependências opcionais

| Requisito | Necessário para |
|---|---|
| `ffmpeg` no PATH | Extração de frames (efeito de vídeo no scroll) |
| Higgsfield MCP + créditos | Geração de cenas em vídeo (~54 créditos por clipe 1080p) |
| `CLOUDFLARE_API_TOKEN` / `ACCOUNT_ID` | Deploy automático |

Nenhuma é obrigatória. Se o deploy falhar ou não estiver configurado, o código-fonte é salvo normalmente.

## Fluxo de execução

1. **`site-planner`** — único ponto de entrada e única skill com poder de decisão estrutural
   - Intake do briefing (do zero ou clonando um site de referência)
   - Gera um plano de site em JSON
   - Apresenta checkpoint de aprovação: paleta, lista de seções, assets por seção, estimativa total de créditos
   - Distribui cada seção para a skill de técnica correspondente

## Skills de técnica de renderização

| Skill | Método | Observação |
|---|---|---|
| `video-scroll-effect` | Scrub de frames em canvas (~180 JPGs) | Efeito clássico, não é WebGL |
| `3d-scene-effect` | Three.js guiado por scroll | Fallback padrão sem custo (imagem plana) |
| `pointer-follow-effect` | Three.js guiado por cursor | Vira pose estática em telas de toque |
| `click-navigate` | Hotspots Three.js → pontos de câmera | Funciona em toque e desktop |
| `physics-play` | Three.js + cannon-es | Mais pesada; máximo uma por site |
| `hybrid-2d3d` | Layout 2D editorial + objeto 3D embutido | Única técnica não fixada ao scroll |
| `cursor-trail` | Trilha de partícula em canvas 2D | Só atmosfera, nunca carrega estrutura |

## Skills de suporte

- **`shared-scroll-engine`** — base do projeto: shell, CSS e utilitários JS compartilhados
- **`asset-generator`** — geração via Higgsfield e importação de assets do usuário
- **`scroll-style-helper`** — chamadas de estilo específicas de site com scroll
- **`frame-pipeline`** — monitora renderizações e roda o `ffmpeg`
- **`reference-analyzer`** — busca e estrutura um site de referência indicado
- **`build-reviewer`** — QA antes do deploy, bloqueia falhas graves

## Restrição técnica: Three.js r160

Fixado propositalmente na r160 — última versão que ainda inclui o build `three.min.js` tradicional. Da r161 em diante esse formato foi removido; migrar exigiria reescrever cada engine para módulos ES.

## Backend de geração alternativo: Flow em vez de Higgsfield

Se você não tem Higgsfield MCP mas tem acesso ao **Google Flow** (assinatura Google AI Pro/Ultra), existe um adaptador que substitui a skill `asset-generator` por uma versão que fala com o Flow via MCP de terceiros (browser automation), em vez de créditos avulsos do Higgsfield. Ver `flow-asset-generator/SKILL.md`.

Diferenças principais a considerar antes de ativar:
- Sem estimativa de "créditos por clipe" — o custo é a cota da assinatura, não crédito comprado
- Geração é sequencial (Flow não faz lote), então o `frame-pipeline` precisa enfileirar
- Sem API oficial do Flow — tudo via automação de navegador (Playwright/CDP), mais sensível a falhas de download
- Sem equivalente direto ao "Enhancer" (upscale) do Higgsfield

## Princípios de integridade do build (não inflar resultado)

- Vídeo planejado e não gerado (por qualquer motivo, inclusive se nunca foi tentado) → marcado explicitamente como **falha**, nunca omitido
- Falha em seção de vídeo → o build **para**, nunca troca silenciosamente por técnica mais barata
- Toda seção cujo resultado final divergiu do plano aprovado entra numa lista de **"desvios do plano"**, exibida com destaque antes de declarar o build pronto
- Todo build gera um `DESIGN.md` com tabela plano vs. resultado — **sem esse arquivo, o build é considerado falho**