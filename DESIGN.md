# DESIGN.md — Rikelme Batista portfolio (scroll-3d)

## Animação do menu de navegação — 23/10/2026

| Pedido | Resultado |
|---|---|
| Animar abertura do menu de rotas | Painel revela de cima para baixo com deslocamento suave; links entram em sequência |
| Fechamento coerente | Painel recolhe e ícone alterna entre menu e X com rotação e fade |
| Movimento reduzido | Transições desativadas pela preferência do sistema |

Links ocultos deixam de aceitar foco e interação ao terminar o fechamento. Escape e seleção de rota continuam fechando o menu. Sem novas dependências, assets ou publicação; sem desvios do pedido.

## Remoção do destaque no início — 23/10/2026

| Pedido | Resultado |
|---|---|
| Retirar o cartão Alice Vieira do início | Removido do hero; texto e ações passam a ocupar uma única coluna, sem espaço reservado para o cartão |
| Preservar a vitrine de projetos | Alice Vieira continua na seção de projetos |

Estilos exclusivos do cartão removidos. Sem novos assets, dependências ou publicação. Sem desvios do pedido.

## Remoção de controles de pausa e fechamento das prévias — 23/10/2026

| Pedido | Resultado |
|---|---|
| Remover botões de pausa em todo o site | Removidos do hero, carrossel de projetos e faixa da stack |
| Manter a faixa | Loop preservado, com pausa no hover e lista estática na preferência por movimento reduzido |
| Fechar Riclick sem reabrir sozinho | Abertura dos links controlada no React; fechamento cancela a ação padrão e a propagação do evento; clique no fundo exige início e fim fora da janela |

Validação: build de produção passou. `verify-reader-close.cjs` confirmou fechamento persistente por X, Escape e fundo em 1440px e 390px, reabertura intencional e links diretos, sem erros JavaScript. `verify-showcase-loop.cjs` confirmou avanço, pausa no hover, retomada, volta contínua, ausência de botões de pausa e movimento reduzido. Sem desvios do pedido implementado e sem publicação. A frase sobre alteração adicional da faixa veio incompleta; o loop atual foi preservado.

Esta seção substitui as descrições históricas de controles manuais de pausa abaixo.

## Faixa da stack em loop — 23/10/2026

| Pedido | Resultado |
|---|---|
| Faixa com ícones da stack | Logo Loop oficial do React Bits abaixo do hero, com ícones e nomes de 14 tecnologias |
| Incluir Git, Jenkins, Kotlin, Python, C# e Java | Incluídos junto de Go, React, Next.js, TypeScript, JavaScript, PostgreSQL, Supabase e Docker; lista Sobre mim atualizada |
| Movimento contínuo | Velocidade de 42px/s, pausa no hover, controle Pausar/Retomar e bordas com fade |
| Acessibilidade e desempenho | Movimento reduzido apresenta lista única sem animação; rótulos PT/EN; SVGs locais sem CDN em produção |

LogoLoop JSX/CSS oficiais mantidos sem alterações; origem no mesmo commit React Bits documentado em PROVENANCE.md. SVGs Devicon com commit fixado em docs/devicon-source.json, licença MIT em public/licenses/devicon.txt. Sem nova dependência npm ou imagem gerada.

Validação: build passou. Chrome verificou todos os SVGs carregados, avanço contínuo, pausa no hover e por botão, retomada, lista estática com 14 itens, ausência de overflow em 320/390/768/1440px e rótulos em inglês, sem erros JavaScript. Capturas em docs/private/stack-loop-desktop.png e stack-reduced-mobile.png. Fonte e dist atualizados; sem publicação.

## Foto no navbar — 23/10/2026

| Pedido | Resultado |
|---|---|
| Foto de perfil junto ao nome | Retrato existente rikelme-chat.png em avatar circular de 36px ao lado de Rikelme Batista; 28px em telas estreitas |
| Remover ícone NFC | Removidos o ícone, o import e o estilo da assinatura antiga; nome e link para o início mantidos |

Build de produção passou. Verificação no Chrome confirmou foto carregada, nome preservado, ausência do ícone, ausência de overflow em 320/390/768/1440px e navegação mobile funcional. Capturas em docs/private/navbar-photo-mobile.png e navbar-photo-desktop.png. Sem nova imagem gerada ou publicação.

## Currículo em inglês — 23/10/2026

| Arquivo fornecido | Resultado |
|---|---|
| Rikelme_Batista_Resume_EN.pdf | Cópia idêntica em public/resume-rikelme-batista-en.pdf; os dois links de currículo usam esse PDF quando EN está selecionado |
| Versão PT | Mantido o PDF em português; alternar para PT restaura os dois destinos |

Rótulos em inglês atualizados para Download résumé e Résumé, removendo a indicação anterior de documento em português. Build passou; navegador confirmou ambos os links nos dois idiomas e PDF de produção byte a byte idêntico ao original por SHA-256. Sem edição do PDF ou nova publicação.

## Abertura contextual do chat — 23/10/2026

| Pedido | Resultado |
|---|---|
| Substituir a animação de folha por uma abertura coerente com o chat | Painel surge com fade, leve subida de 16px e escala de 0,94 para 1 em 280ms, com origem alinhada ao centro do balão |
| Manter consistência e acessibilidade | AnimatedContent oficial do React Bits; preferência por movimento reduzido mantém abertura imediata |

Removidos inclinação, rotação, máscara e decoração de dobra da versão anterior. A mesma abertura atende o balão e os CTAs de orçamento, preservando respostas e comportamento da conversa. Sem novas dependências ou publicação.

Validação: build de produção e scripts/verify-crm.cjs passaram, incluindo abertura, edição, envio com nova tentativa, confirmação PT/EN e comportamento do painel.

## Abertura do chat como folha — 23/10/2026

| Pedido | Resultado |
|---|---|
| Animação de folha se abrindo ao abrir o balão | AnimatedContent oficial do React Bits em trigger mount, com perspectiva, inclinação, escala e revelação de baixo para cima em 650ms; dobra com gradiente e clip-path decorativo |
| Abertura por qualquer entrada | Efeito aplicado ao painel montado pelo balão ou pelos CTAs de orçamento; repete a cada reabertura, mantendo respostas da conversa |
| Movimento reduzido | Abertura imediata, sem transformação, máscara ou dobra; decoração não intercepta cliques |

Validação: build e scripts/verify-crm.cjs passaram. Revisão no Chrome em 390px confirmou dobra durante a abertura, painel totalmente visível ao terminar (transform/mask none), fechamento por Escape, abertura pelos CTAs e ausência de movimento com a preferência reduzida. Evidências em docs/private/chat-paper-opening.png e chat-paper-open.png. Sem novas dependências, assets gerados ou publicação.

## Molduras da vitrine e apresentação do Riclick — 23/10/2026

| Pedido | Resultado |
|---|---|
| Riclick começar pela versão mobile no computador | previewMode mobile no conteúdo; Carousel e links do cartão começam em Celular, com Desktop ainda selecionável |
| Mockup próximo da Aloft | Moldura vertical com proporção 0,64, cantos de 16px, imagem de ponta a ponta, identificação superior discreta e navegação em cápsula sobreposta à base |
| Eliminar área vazia | Removidas barra de navegador e faixas laterais do modo mobile; capturas menores que a janela usam object-fit cover na miniatura |

As capturas originais não foram alteradas. O leitor completo mantém as imagens inteiras e as dimensões originais. Os componentes Carousel oficiais do React Bits, o loop da faixa e a pausa por hover permanecem. Sem nova publicação.

Validação: build, scripts/verify-showcase-mockup.cjs e npm.cmd run test:ui passaram. Conferidos Riclick inicialmente mobile em 1440/390px, captura preenchendo a largura e altura da moldura, controles sobrepostos, leitor abrindo no formato certo e desktop sem área vazia. Regressão confirmou arraste, teclado, swipe, movimento reduzido, zero erros JavaScript e nenhuma violação nas regras Axe executadas. Capturas de revisão em docs/private/riclick-mockup-1440.png e riclick-mockup-390.png.

## Seleção da vitrine e Riclick responsivo — 23/10/2026

| Pedido | Resultado |
|---|---|
| Não exibir Naveg, Quiz e CRECI | Removidos da lista exibida e das rotas de prévia; Naveg também removido dos cases de sistemas. Capturas anteriores preservadas, sem vínculos na interface |
| Refazer print do Riclick | Novas capturas reais: desktop 1440×1383 e celular 390×2744; aguardado o desaparecimento natural dos avisos temporários, sem ocultação artificial |
| Corrigir a responsividade | No próprio C:/Riclick/public/index.html, colunas inline substituídas por variável de quantidade desktop; CSS mantém breakpoints de duas/uma coluna e contém larguras intrínsecas de tabelas e filtros |

Diagnóstico reproduzido antes da correção: captura mobile de 390px expandia o layout para 554px e mantinha quatro colunas. Após a correção, teste de navegador passou em 320/390/768/1440px, com documento na largura esperada e uma/duas/quatro colunas conforme breakpoint. Nenhum overflow:hidden no documento, zoom ou recorte para disfarçar o problema. Correção e backups descritos em docs/riclick-responsive-fix.md e docs/private/riclick-responsive/.

A vitrine agora contém ANFC Cardápios, Riclick, Stockalto, Alice Vieira e Everton Editor. O Riclick continua representado pela interface local sem backend de automação; nenhuma rotina de envio foi iniciada. Servidor de captura encerrado ao concluir. Fonte, metadados e dist atualizados; sem nova publicação.

## Capturas dos quatro projetos locais — 23/10/2026

| Plano solicitado | Resultado |
|---|---|
| ANFC Cardápios, primeiro | Frontend Next.js na porta 4301; página de apresentação capturada em 1440×7939 e 390×12829; servidor encerrado |
| Riclick, depois | Interface estática original na porta 4302; 1440×1383 e 554×1767; servidor encerrado |
| Stockalto, depois | Modo de demonstração local já existente, frontend/API em 4303/4304; catálogo em 1440×2503 e 390×2852; ambos encerrados |
| Naveg, por último | Frontend Vite na porta 4305; redirecionamento real para /login, em 1440×1000 e 390×844; servidor encerrado |
| Adicionar à vitrine | Quatro novos cartões no início de Feitos para explorar; oito projetos no total; leitor desktop/celular e contador dinâmico |
| Não apresentar links locais como públicos | Novos cartões abrem as capturas; leitor informa desenvolvimento e omite links externos/código sem destino real |

**Limites das capturas:** Riclick foi servido pela interface original, sem iniciar o backend de automação/WhatsApp; não foram inventados indicadores e os estados vazios/carregamento pertencem à interface. Seu layout mobile produz documento de 554px a partir do viewport de 390px, preservado na imagem e identificado no case. Stockalto usa produtos e imagens de exemplo do modo demo do próprio projeto. Naveg mostra somente o login público, sem autenticar nem capturar áreas internas. Nenhuma captura foi substituída por imagem gerada.

Execução sequencial confirmada pelos horários em docs/private/local-captures/*.json: cada início ocorreu após o encerramento anterior. Verificação independente confirmou portas 4301–4305 fechadas ao terminar. Somente os processos iniciados pela captura foram encerrados; o servidor de desenvolvimento do portfólio foi preservado.

Validação: build, `scripts/verify-local-gallery.cjs`, `scripts/verify-showcase-loop.cjs` e `npm.cmd run test:ui` passaram. Conferidos dimensões dos oito PNGs, leitores dos quatro projetos, ausência de links localhost/pastas locais no site e notas em inglês. Regressão geral confirmou mouse, teclado, swipe mobile, movimento reduzido, zero erros JavaScript e nenhuma violação nas regras Axe executadas. Metadados em docs/project-captures.json. Fonte e dist atualizados; sem nova publicação.

## Carrossel contínuo — 23/10/2026

| Pedido | Resultado |
|---|---|
| Sites se movimentando em loop | Faixa avança continuamente a aproximadamente 32px/s; sequência repetida permite reposicionar a rolagem na volta sem espaço vazio |
| Parar ao passar o mouse sobre uma tela | Pausa imediata no cartão, retomando ao sair; controles e exploração da captura permanecem disponíveis |
| Controle do visitante | Botão Pausar/Retomar; pausa ao interagir, focar conteúdo, abrir dialog/chat ou deixar a faixa fora da tela; movimento reduzido desativa autoplay e repetições |

`npm.cmd run build`, `node scripts/verify-showcase-loop.cjs` e `npm.cmd run test:ui` passaram. Teste no Chrome confirmou avanço, pausa estável no hover, retomada ao sair, volta ao início, controle manual e movimento reduzido, sem erros JavaScript. Regressão geral confirmou arraste, teclado, swipe mobile, leitor e zero violações nas regras Axe executadas. Sem novas dependências, assets ou publicação.

## Direção Aloft implementada — 23/10/2026

Plano `docs/aloft-redesign-plan.json` aprovado explicitamente pelo proprietário. Esta seção prevalece sobre o planejamento e os históricos anteriores.

| Plano aprovado | Resultado |
|---|---|
| Preto, branco e azul; abertura direta | Novo hero com proposta de valor, CTA do orçamento, projeto real em destaque e Threads oficial com pausa |
| Carrossel de sites | Faixa com quatro projetos, setas e contador, arraste horizontal e teclado; Carousel oficial para alternar Desktop/Celular |
| Explorar as capturas | Oito PNG reais, rolagem vertical e arraste dentro da captura; leitor completo e links reais mantidos |
| Serviços | Três cartões com SpotlightCard oficial e CTA que abre o mesmo chat aprovado |
| Sistemas, processo e apresentação | Cases e trajetória preservados; quatro etapas de processo adicionadas com AnimatedContent |
| Dúvidas e contato | Cinco perguntas expansíveis e botão de orçamento junto aos canais existentes |
| PT/EN, chat e painel | Novos textos nos dois idiomas; chat editável e painel Supabase mantidos |
| React Bits e acessibilidade | Threads, AnimatedContent, Magnet, Carousel e SpotlightCard oficiais; origem fixada e adaptações documentadas |

### Validação

- `npm.cmd run build` passou. Bundle principal de aproximadamente 518 kB / 166 kB gzip; Vite emite aviso de tamanho, sem impedir o build. Não foi realizada medição de Core Web Vitals.
- `npm.cmd run test:ui` passou na produção local: setas, teclado, arraste horizontal com mouse, troca Desktop/Celular, rolagem vertical, leitor, links de prévia, Escape, menus e CTA de serviços abrindo o chat.
- Swipe real via eventos de toque do Chrome foi verificado em 390px. Responsividade sem transbordamento em 360, 390, 768 e 1366px; teste de idiomas também passou em 320 e 390px.
- Movimento reduzido verificado. Zero erros JavaScript e zero violações nas regras WCAG A/AA executadas pelo Axe. Os indicadores do Carousel foram ampliados para alvos de 40px após a auditoria inicial.
- `node scripts/verify-language.cjs` e `node scripts/verify-crm.cjs` passaram: traduções, conservação de respostas, resumo editável, falha/reenvio, confirmação e atualização automática do painel com respostas simuladas.
- Hero, projetos, serviços, processo e versões mobile revisados por capturas em `docs/private/`. Relatório funcional em `docs/private/react-qa.json`; revisão estrutural em `docs/aloft-build-review.json`.

Sem desvios do plano aprovado. A faixa externa utiliza scroll nativo e tratamento de ponteiro para separar os gestos; o Carousel do React Bits controla as telas dentro dos cartões. Nenhuma tela de projeto, métrica ou depoimento foi inventado. Nenhum asset ou vídeo gerado, zero créditos. Fonte e dist atualizados, sem nova publicação do site. Domínio público/CORS de produção continuam pendentes da informação do proprietário.

## Nova referência Aloft — 23/10/2026 — planejamento

| Pedido | Resultado atual |
|---|---|
| Explorar referência com mouse | Navegação registrada, carrossel arrastado e seta interna acionada, FAQ e menu mobile abertos; ferramentas, idiomas e privacidade visitados |
| Adaptar portfólio com React Bits | Plano concreto em docs/aloft-redesign-plan.json e análise em docs/aloft-reference-analysis.md; aprovação estrutural pendente |

Nenhuma alteração na interface nesta etapa de pesquisa. Nenhum vídeo ou asset gerado planejado, nenhum crédito gasto. Exploração não inclui todas as combinações localizadas nem destinos externos; detalhes e limitações na análise. As próximas alterações usarão as capturas reais e o conteúdo do proprietário.

## Fluxo de orçamento revisado — 23/10/2026

| Plano aprovado | Resultado |
|---|---|
| Revisar antes de enviar | Resumo dos quatro campos e edição com salvar/cancelar; alterações refletidas na conversa e no envio |
| Uma ação principal | Solicitar orçamento, habilitada após ciência do aviso; envio bloqueado enquanto salva |
| Confirmação e próximo passo | Recebimento confirmado apenas após sucesso; retorno pelo contato informado; WhatsApp secundário após envio, ou alternativa quando há falha/indisponibilidade |
| Pedidos atualizados automaticamente | Consulta a cada 15 segundos com painel visível e ao retornar à aba; pausa durante operações, cancela consultas e remove listeners no logout |
| Português e inglês | Resumo, edição, ações, erros e confirmação nos dois idiomas |

Validação: build de produção e `scripts/verify-crm.cjs` passaram. Teste mobile verificou edição e payload revisado, falha sem confirmação falsa, nova tentativa com mesmo UUID, confirmação PT/EN, WhatsApp secundário e consulta automática simulada com relógio do navegador, incluindo parada após logout. Chamadas de envio e autenticação desse teste foram simuladas; não criou pedidos reais. `scripts/verify-chat-send.cjs` atualizado para o novo fluxo. Código e dist atualizados; sem nova publicação do site ou alteração de banco. Sem desvios do fluxo aprovado.

## Correção do envio na porta 5174 — 23/10/2026

| Problema | Correção |
|---|---|
| Pedidos não apareciam no painel | Logs mostraram consulta do painel com HTTP 200 e preflight do envio com HTTP 403; origem usada era http://127.0.0.1:5174, ausente da lista CORS |
| Origem local bloqueada | Edge Function versão 3 inclui 5174 em 127.0.0.1 e localhost, mantendo lista explícita de origens |

Nenhuma alteração de schema ou permissões do painel. Pedidos bloqueados anteriormente não chegaram ao banco e precisam ser reenviados.

Validação: `scripts/verify-chat-send.cjs` completou as quatro perguntas no Chrome usando http://127.0.0.1:5174, enviou via botão Enviar pedido, recebeu HTTP 200 e exibiu Pedido salvo. A linha foi confirmada no banco e ficou visível sob o contexto RLS do administrador; registro sintético removido após a verificação.

## Remoção do Airtable — 23/10/2026

| Pedido | Resultado |
|---|---|
| Usar somente Supabase | Removidos botão e código de sincronização, referências no chat e aviso em PT/EN e chamadas externas da Edge Function |
| Texto simples no chat | Uso dos dados para responder ao pedido e link para o aviso; Supabase identificado dentro do aviso |

Esta decisão substitui as menções históricas a Airtable abaixo. A coluna legada airtable_synced_at permanece sem uso no banco já migrado.

Validação: build e teste da interface CRM passaram. Edge Function versão 2 publicada; teste HTTP confirmou recebimento, reenvio idempotente e rejeição da antiga ação sync. Pedido sintético removido. Interface atualizada no código e em dist, sem republicação do site.

## Integração Supabase real — 23/10/2026

Esta seção atualiza o estado da integração descrito abaixo.

| Plano | Resultado |
|---|---|
| Continuar após migration e cadastro | Migration conferida no projeto real; único usuário confirmado autorizado em `admin_users` |
| Receber pedidos | `lead-intake` publicada, dependência fixada em 2.118.0; criação e reenvio idempotente confirmados no banco |
| Proteger dados | Leitura anônima bloqueada; identidade autenticada fora da lista sem leitura; administrador pode alterar status; sync exige autenticação |
| Integrar interface | Chave pública enviada em apikey, token de usuário apenas quando autenticado; mensagens específicas para erros; teste CRM adaptado à configuração real |

Validação: build de produção, teste de interface CRM e teste geral do portfólio passaram. A verificação geral cobriu desktop, mobile, galeria, teclado, movimento reduzido, sem erros JavaScript nem violações Axe nas regras executadas. Testes HTTP reais passaram para CORS, origem bloqueada, contato inválido, sync sem token, envio e reenvio. O registro sintético foi removido após confirmar que só uma linha foi criada. Alteração de status foi verificada em transação revertida.

Pendências e desvios: domínio público ainda não informado, portanto CORS padrão restrito às origens locais documentadas; site não republicado. Airtable não configurado. Login com senha pessoal, logout, expiração e quota sob carga ainda não verificados. Advisor sem alerta crítico: informa ausência intencional de policies na tabela privada de quota e proteção de senhas vazadas desativada no Auth.

## Painel, privacidade e limpeza — 23/10/2026

| Pedido | Resultado | Estado |
|---|---|---|
| Armazenar pedidos no Supabase | Quarta pergunta de contato, ciência do aviso e envio explícito; migração SQL com RLS e função de entrada com validação e quota | Implementado; conexão real pendente |
| Painel próprio | `/painel`, login Supabase, lista, busca, status, exclusão, sessão em memória e acesso por lista de administradores | Implementado; integração real pendente |
| Airtable como CRM | Envio manual pelo painel via Edge Function, upsert por UUID, token somente no servidor | Implementado; base e segredo pendentes |
| Privacidade e cookies | Aviso PT/EN baseado nos campos reais; preferência de idioma somente com opt-in; sem analytics/publicidade | Implementado localmente |
| Limpar pasta | Removidos frames, dois MP4 antigos, engines legados e scripts de migração obsoletos, capturas duplicadas e logs Playwright; originais preservados em pasta privada | Concluído |

**Pendências e limites:** não há projeto Supabase vinculado nem credencial de execução Airtable. Nenhum pedido real foi salvo ou sincronizado. Retenção de 12 meses é política proposta com revisão manual, sem job de exclusão. Exclusão no Supabase não apaga cópia no Airtable. Sincronização é manual e unidirecional. Sem novo deploy. Esta seção prevalece sobre descrições históricas de arquivos legados preservados na raiz.

Validação local: build de produção passou; `scripts/verify-crm.cjs` passou para aviso de privacidade, habilitar/revogar preferência de idioma, quatro perguntas, resumo WhatsApp, envio indisponível sem configuração e bloqueio do login sem configuração em 390px. Banco, RLS e sincronização real ainda precisam dos testes de integração descritos em `docs/crm-setup.md`.

Verificação geral `npm.cmd run test:ui` também passou: desktop, menu mobile, galeria, teclado, movimento reduzido, zero erros JavaScript e nenhuma violação nas regras Axe executadas. Dois seletores antigos do teste foram atualizados para distinguir o modal de projetos do aviso e refletir o link atual da A-NFC.

## Voz do chat — 23/10/2026

| Plano solicitado | Resultado |
|---|---|
| Conversar em primeira pessoa usando o nome do proprietário | Apresentação como Rikelme Batista, perguntas em primeira pessoa, indicador de digitação com seu nome e convite para continuar comigo no WhatsApp, em português e inglês |

Sem desvios do pedido. O fluxo continua com três perguntas e envio do resumo pelo visitante no WhatsApp. As respostas são mensagens predefinidas; não há atendimento humano ao vivo neste widget. Sem novo deploy nesta etapa.

## Versão atual — reconstrução React + React Bits

**Implementada e validada localmente.** Esta seção prevalece sobre o histórico abaixo. Plano em `docs/portfolio-reactbits-plan.json`, aprovado pela instrução do usuário para seguir após apresentar a direção. Pedido adicional: usar Taste Skill v1, Awesome Design Professional, Web Design Guidelines, Image to Code, imagegen e Playwright CLI.

| Plano aprovado | Resultado | Evidência |
|---|---|---|
| Identidade editorial pedra/âmbar | Preto quente, creme, bronze, Archivo e Fraunces; Geist no corpo conforme Taste v1 | `src/styles.css`, referências e análise |
| React Bits real | Threads no hero, AnimatedContent nas entradas, Magnet nos CTAs | Componentes oficiais fixados no commit e licença documentados em `src/components/react-bits/PROVENANCE.md` |
| Referências antes do código | Cinco PNG de seção gerados e analisados antes da interface | `docs/design-references/`, `ANALYSIS.md`, `PROMPTS.md` |
| Projetos reais em destaque | Quatro projetos com oito PNG verdadeiros; leitor com desktop/celular, rolagem e link externo | `src/content.js`, `ProjectReader` |
| Cases privados e trajetória | Facilities, Naveg, A-NFC, Sistema A-NFC, Líderes MG e Riclick; experiência e formação do PDF | Dados editoriais selecionados; sem dados brutos no build |
| Layout responsivo e acessível | Menu mobile, dialog nativo, teclado, foco, controle de pausa, movimento reduzido | Playwright CLI e Axe |
| Build verificável | `npm.cmd run build` e `npm.cmd run test:ui` passaram na versão de produção | `docs/private/react-qa.json` |

### Verificação final

- Desktop 1440×900; responsividade em larguras 360, 390, 768 e 1366. CTA do hero cabe na primeira tela verificada, sem transbordamento horizontal.
- Galeria: abrir, trocar formato, compartilhar URL da prévia, rolar PNG inteiro, fechar com Escape e restaurar rolagem do fundo.
- Menu mobile: abrir, navegar e fechar com Escape. Cases e histórico: expansão funcional.
- Zero erros JavaScript durante os fluxos. Zero violações detectadas pelo Axe nas regras WCAG A/AA executadas. Não constitui auditoria manual integral de conformidade.
- Screenshots de desktop, mobile, projetos, leitor, sistemas, sobre e contato revisados visualmente em `docs/private/`.
- `dist/` contém 30 arquivos públicos, incluindo oito PNG. Sem `.env`, inventário GitHub, dados privados, arquivos AGENTS ou referências geradas. `git diff --check` passou.

### Migração e limites

- A nova entrada exige Vite. Publicar apenas `dist/`; abrir `index.html` diretamente não inicia React. Instruções no README.
- A interface anterior foi preservada em `docs/private/legacy-before-react/`. Os engines Three.js antigos permanecem inalterados e não são importados pelo novo site. A restrição r160 não foi alterada.
- Vídeos antigos não fazem parte da nova direção aprovada. Nenhum vídeo novo foi planejado ou substituído após falha. Nenhum crédito Higgsfield foi usado. imagegen foi usado por pedido explícito para cinco referências, não para simular produtos.
- CRECI-BA mostra somente a tela pública de acesso; os sistemas privados não ganharam ambientes públicos. Nenhum dado autenticado foi publicado.
- Sem novo deploy nesta etapa. Fonte e build de produção disponíveis localmente.

---

## Vitrine visual de sites — 21/10/2026

Referência fornecida: https://aloftagencia.com/ . A referência apresenta cases por capturas de telas em galerias horizontais. A adaptação preserva a identidade pedra/âmbar deste portfólio e usa exclusivamente PNG, conforme pedido.

| Plano | Resultado |
|---|---|
| Apresentar os sites como na referência | Quatro cases visuais, com faixa horizontal arrastável, setas e molduras de navegador |
| Não usar WebP | Oito capturas PNG reais: desktop e celular de Alice Vieira, Everton Editor, Estudos CRECI-BA e Quiz 9º Ano |
| Explorar conteúdo das páginas | Capturas completas com rolagem vertical dentro das molduras; sem iframes ou sessões dos visitantes |
| Acesso aos sites | Links reais de demonstração e código mantidos |
| Navegação acessível | Rolagem nativa, setas de teclado, botões com nomes acessíveis, foco visível e preferência por movimento reduzido |
| Manutenção | `scripts/capture-projects.cjs` atualiza capturas; `assets/projects/manifest.json` registra origem, dimensões e data |

Limites: as capturas são estáticas e não equivalem a navegar na aplicação. O CRECI-BA expõe uma tela pública de login; somente essa tela foi capturada, sem criar conta ou acessar dados autenticados. Nenhum screenshot de projeto privado foi inventado. A referência usa múltiplas páginas por cliente; esta primeira adaptação apresenta desktop e celular das páginas públicas disponíveis. Sem publicação nesta etapa.

Verificação concluída: `scripts/verify-showcase.cjs` passou em 1440px e 390px: oito imagens decodificadas, quatro cases, botões, teclado, rolagem interna e ausência de transbordamento; nenhum erro JavaScript. Screenshots revisados visualmente. O teste final é focado na galeria e não carrega os 360 frames dos vídeos das seções anteriores. Evidências ficam em `docs/private/`. Scripts e referências locais também passaram na verificação estática.

---

## Atualização de conteúdo — 21/10/2026

Estado desta atualização: **implementada localmente; publicação e QA visual pendentes**. O status histórico abaixo descreve o build anterior.

| Plano solicitado | Resultado | Limite |
|---|---|---|
| Conectar GitHub e analisar organizações | GitHub CLI autenticado; 65 repositórios inventariados, 47 privados, três organizações listadas | Metadados, READMEs e até cinco commits por autor na branch padrão; sem auditoria funcional do código |
| Atualizar perfil pelo currículo | PDF extraído; bio, formação e cinco experiências incorporadas | Datas conforme documento fornecido |
| Puxar LinkedIn | Perfil público encontrado via indexação | Acesso parcial e cache de cerca de cinco meses; atualização integral não confirmada |
| Indexar demonstrações | Quatro páginas públicas verificadas com HTTP 200 e títulos correspondentes | Não valida formulários, autenticação ou todos os fluxos |
| Completar conteúdo do portfólio | Catálogo editorial com oito projetos, trajetória e download do currículo | Cases privados sem URL permanecem sem demonstração pública |
| Manter identidade visual | Paleta pedra/âmbar, fontes e motores anteriores preservados | Catálogo responsivo em HTML/CSS adicionado após a exploração 3D |

### Desvios e pendências desta atualização

- Integração integral com LinkedIn não disponível; foi possível apenas consultar o perfil público indexado.
- Não foram criados ambientes de demonstração para projetos privados. Não foi removida autenticação de sistemas corporativos.
- Não houve novo deploy ou teste visual de navegador. Nenhum vídeo novo foi planejado ou gerado.
- Dados brutos de repositórios e currículo ficam em `docs/private/`, ignorado pelo Git; somente resumos editoriais selecionados foram incorporados ao HTML.

---

Status: **complete** — all 5 sections built. See
`docs/superpowers/plans/2026-08-24-portfolio-landing-page.md` for the full approved plan
and execution log.

## Design choices

- **Palette:** `bg #0d1117`, single accent `#00d4ff` (cyan), text `#e6edf3` — reused
  from the user's existing GitHub profile README theme for brand consistency.
- **Fonts:** Orbitron (headings/HUD) + Rajdhani (body), matching the shared-scroll-engine
  base stylesheet's HUD-styled aesthetic.
- **Sections (plan order):** hero (video-scroll-effect) → sobre (hybrid-2d3d) →
  facilities-mg (video-scroll-effect) → projetos (click-navigate) → contato (hybrid-2d3d).
- **Asset generation for the 2 video sections:** planned as a deliberate test of the
  `google-flow` MCP integration. The MCP automation path was blocked (see plan doc,
  attempt 4 — traced to Google's own automation/bot detection degrading the
  Playwright-CDP browser session, not a config bug). Per the user's decision, both
  clips were instead generated by the user manually in their own Chrome session via
  Google Flow's web UI, then handed off as local files for this skill to slice into
  frames. Content-wise this still matches the approved plan's briefs; process-wise it
  diverged from "MCP-automated generation" — noted here per the plugin's build-integrity
  rules (`AGENTS.md`, "Princípios de integridade do build").

## Plan vs. build

| Section | Planned technique | Built technique | Note |
|---|---|---|---|
| hero | video-scroll-effect | video-scroll-effect | Source clip generated via Google Flow **manually by the user** (MCP automation blocked — see above), not via the `google-flow` MCP tools as originally planned. 180 frames, 1600px/q88. |
| sobre | hybrid-2d3d | hybrid-2d3d | Matches plan — bio, focus areas, 9 stack badges, idle-rotating icosahedron (`motion:"orbit"`). No deviation. |
| facilities-mg | video-scroll-effect | video-scroll-effect | Same manual-Flow-generation deviation as hero. 180 frames, 1600px/q88. |
| projetos | click-navigate | click-navigate | Matches plan — 3 hotspots (Lideres-MG, Estudos CRECI-BA, Landing Page Everton Editor) over an abstract particle field (`motion:"abstract"`). Captions use `innerHTML` (not the stock engine's `textContent`) so the CRECI-BA and Everton Editor waypoints could carry real repo/live-site links per their content_brief — a deliberate, scoped modification to the copied `click-navigate.js`, not a template change. No other deviation. |
| contato | hybrid-2d3d | hybrid-2d3d | Matches plan — GitHub/LinkedIn/email CTAs, idle-rotating torus knot (`motion:"abstract"`). Serves as the site's closing section (no separate `.outro`). No deviation. |

## ⚠️ Plan deviations

- **Google Flow MCP automation failed for the `hero` and `facilities-mg` source clips.**
  Root cause (systematic debugging, plan doc attempt 4): `flow_connect`/`flow_account_check`
  reported a successful, verified connection, but the automated browser was actually
  sitting on Google Flow's public logged-out marketing page — confirmed via screenshot
  and cross-checked against `myaccount.google.com` (also silently served its logged-out
  marketing variant despite the source Chrome profile being genuinely signed in as the
  correct account, confirmed with the user). This pattern is consistent with Google's
  own bot/automation detection degrading the Playwright-CDP-attached session, not a
  fixable config/path bug like the three earlier issues in this same investigation
  (chromeUserDataDir placeholder, flowHome path, Chrome-must-be-closed profile lock).
  **No credits were spent** on the failed attempts (`flow_generate_image` was only
  called with `auto_confirm:false`, which consumes nothing).
  **Resolution:** user generated both clips manually via Google Flow's web UI and
  supplied them as local files; `video-scroll-effect` used them directly (its own
  Step 1b "user-supplied clip" path), skipping Higgsfield/Flow generation entirely.

## Post-build fixes

- **Reveal-line text was rendering off-center (right/bottom of true center) in `hero` and `facilities-mg` once scrolling began.** Root cause: `video-scroll-effect.js`'s per-frame `update()` set `el.style.transform = \`translateY(...)\`` on each `.reveal-line`, which — being an inline style — completely replaced (not composed with) the CSS class's `transform: translate(-50%, -50%)` centering rule the instant the first scroll frame fired. This is a defect in the plugin's shared engine template, reproduced and confirmed via browser inspection (computed `transform` matrix showed `translateX(0)` instead of the expected `-50%`). Fixed in this project's copy of `video-scroll-effect.js`: the per-frame update now composes `translate(-50%, calc(-50% + Npx))` instead of overwriting the whole property; the `prefers-reduced-motion` branch (which had the same bug via `transform: "none"`) was fixed the same way. Verified centered at multiple scroll positions and viewport sizes after the fix.

## Design refinement pass (frontend-design critique)

Self-critique flagged three genuinely templated defaults (not choices made for this
brief) and all three were addressed:

- **Typography.** Orbitron + Rajdhani was the plugin's literal hardcoded default for
  any scroll3d project, unrelated to this subject. Replaced with a 3-role system tied
  to the actual brief — a software engineer whose daily medium is code: **Space
  Grotesk** (display — headlines, hero reveal-lines, brand wordmark), **Inter** (body
  copy), **JetBrains Mono** (utility — nav links, badges, captions, stat labels; a
  literal, specific tie to "engenheiro de software" that a sci-fi HUD face didn't
  have). Letter-spacing reduced throughout — Orbitron's geometry needed heavy
  tracking, these faces don't.
- **Color hierarchy.** `--accent`/`--accent-2`/`--gold` were all the identical
  `#00d4ff` — zero hierarchy. Introduced a genuine two-tone system: `--accent`
  (`#00d4ff`, bright) reserved for interactive/active content (nav hover, badges,
  CTAs, active hotspot, reveal-line accent, "you are here" scroll progress);
  `--accent-2` (`#0a7f99`, muted teal) for ambient/passive states (idle hotspot rings,
  particle field, preloader fill, idle-rotating 3D material base). The primary brand
  cyan itself (reused from the user's GitHub README) was kept unchanged — only the
  *lack of a second tone* was the defect, not the hue itself.
- **3D objects.** `sobre` and `contato`'s icosahedron/torus-knot were the
  `hybrid-2d3d` engine's generic default-`switch`-case geometry, unrelated to this
  content. Replaced with two custom procedural geometries in this project's copy of
  `hybrid-2d3d.js`: `modular` (a loose cube cluster for `sobre`, evoking
  containers/modular services — ties to Docker/ERP-module content) and `network` (a
  sparse node-graph for `contato`, echoing `facilities-mg`'s "rede neural pulsante"
  motif at a calm scale — literal "let's connect" for a closing section). Both use
  the new muted `accent-2` as base material color with the bright `accent` reserved
  for the rim light, consistent with the color-hierarchy pass above. The shared
  engine's original `orbit`/`morph`/`abstract` cases were left intact as fallbacks,
  not removed.

Verified in-browser after each change: hero/facilities-mg centering still holds with
the new display face, Portuguese diacritics render correctly in all three new fonts,
both new 3D geometries are legible at the small `hybrid-stage` card size, and the
projetos hotspot idle/active states now read as a clear bright-vs-muted distinction
against the (now also muted) particle field.

## Contrast fix over unpredictable video content

User reported (2 screenshots) that `.reveal-line` text was nearly unreadable at
several points in `facilities-mg`'s scrub — both the light `--ink` lines and the
cyan `--accent` last line blended into the source clip's bright white/cyan node
highlights. Diagnosed via `scroll-3d:scroll-style-helper` (the skill built for this
exact scroll3d-specific problem) plus direct frame sampling across the clip: the
existing `.vignette` darkens the frame's edges/top/bottom but fades to fully
transparent in the center — exactly where `.overlay`/`.reveal-line` sits — so it
provided zero help precisely where needed, and the footage's brightest highlights
are the same hue family as the brand accent, so no vignette-at-the-edges or hue
swap could fix it (would also break brand consistency with every other section).
Fixed with three background-agnostic, shared changes to `.vignette`/`.reveal-line`
in `styles.css` (affects hero too, harmlessly, since it's already mostly dark there):
a center-focused radial scrim layered under the existing edge vignette, a dark
backing `text-shadow` alongside the existing colored glow, and `-webkit-text-stroke`
for the one case blurred shadows can't guarantee — a glyph landing directly on a
fully blown-out white bloom in the footage. Verified against both exact frames from
the user's screenshots (peak-opacity `p≈0.49`/`p≈0.90` moments, driven precisely via
`window.__scrubs`) — both now read cleanly.

## Full visual identity pivot — dark/editorial, stone & amber

User rejected the cyan/HUD-tech direction entirely after seeing a reference (a moody,
near-monochrome editorial design post — dark background, weathered sculptural subject,
bold sans + elegant italic serif type pairing, no neon accent). Confirmed scope: full
pivot including new source videos, not just a palette/type reskin.

**New palette:** `bg #0b0a08`, `ink #f3ede2` (warm cream, not pure white), `muted #9a9187`,
single accent `#b8916a` (aged brass/amber) with `accent-2 #6b5646` (deep bronze, ambient)
— replaces `#0d1117`/cyan entirely, including the "reused from GitHub README" cyan that
drove the original approved plan. Confirmed with the user this supersedes that decision.

**New typography:** **Archivo** (bold/800, structural — headlines, nav, badges, buttons)
+ **Fraunces italic** (emphasis — one power-word per key headline, e.g. "produto." /
"fluxo.") + **Inter** (body). Retired Space Grotesk/JetBrains Mono entirely — no more
mono/"terminal" signifier anywhere in the type system, matching the new editorial mood.
Added `.emphasis`/`.reveal-sub` markup to `.reveal-line` (only on hero's and
facilities-mg's final line, not every line — restraint) so one word breaks into the
italic serif at 1.15em with a small caption line below, directly reproducing the
reference's signature typographic move.

**New source videos**, both generated by the user via Google Flow, both re-extracted
to 180 frames/1600px/q88 same as before:
- `hero`: "Stone monolith with Go code" — real Go code (`func Construir(ideia string)
  { monumento.Erguer(ideia) }`) carved into dark stone, lit amber, revealing a
  monumental stone/circuit server structure. Replaces the "Terminal vira arquitetura"
  matrix-code concept — same narrative beat (logic becoming architecture), new visual
  language (monument, not screen).
- `facilities-mg`: "Stone tablets glowing amber sequence" — a vast floor of carved
  stone ledger-tablets, symbols lighting up in sequence, ending on a wide shot of a
  whole archive room of glowing tablets. Replaces "Rede neural pulsante" (also replaced
  an intermediate rejected concept, kintsugi/repaired-ceramic — user found the "fixing
  a break" metaphor wrong for a facilities/flow system, not the execution quality).

**Everything else re-skinned to match, not rebuilt:** `sobre`'s cube cluster and
`contato`'s node-graph (from the earlier frontend-design pass) kept their geometry,
only their material swapped from cyan/teal to bronze/amber — the "modular
containers"/"connection" concepts still fit this mood. Same for `projetos`' particle
field and hotspots, badges, buttons, nav, progress bar, vignette (unchanged — already
hue-agnostic) and the text-contrast fix (dark stroke + shadow, unchanged mechanism,
now paired with amber instead of cyan glow). Verified all 5 sections live in-browser
after the rebuild — text stays centered and legible, both new videos read clearly
against the new type treatment, 3D objects and UI read as one coherent system.

The two superseded source clips (`Code_dissolving_into_glowing_city_*.mp4`,
`Pulsating_neural_network_concept_*.mp4`) are still on disk (gitignored, not deployed)
in case the user wants to reference them later — not deleted without asking.

## Left-aligned composition + two-part identity line

User referenced a screenshot of the site's own current hero text (centered "Rikelme
Batista") and asked for it left-aligned instead, with "Rikelme Batista" and
"Engenheiro de Software" combined into one block using two font treatments (simple +
sophisticated) rather than two separately-timed centered beats.

Applied site-wide (not just that one line, for compositional consistency across hero
and facilities-mg): `.overlay`/`.reveal-line` repositioned from centered
(`left:50%;transform:translate(-50%,-50%)`) to left-aligned (`left:8%;
transform:translateY(-50%)`, `text-align:left`, `max-width:56vw`). Required also
setting `.overlay { justify-self:stretch; width:100% }` — `.sticky`'s
`display:grid;place-items:center` shrink-wraps grid items to content by default, so
`.overlay` was collapsing to near-zero width; percentage `left` on `.reveal-line` was
resolving against that instead of the viewport (same class of bug as the earlier
centering fix, inverse case). Added mobile override (`left:6%; max-width:88vw` under
700px).

New `.line-name`/`.line-role` classes: name/title in bold Archivo, role/subtitle in
italic Fraunces at 0.85em — both substantial, read as co-equal (unlike
`.emphasis`/`.reveal-sub`'s big-word + tiny-caption pairing used on the final line).
Hero's "Rikelme Batista" + "Engenheiro de Software" and facilities-mg's "Facilities MG"
+ "Gestão em tempo real" (shortened from "Gestão de facilities em tempo real" to avoid
redundancy with the title right above it) merged from 2 separately-timed reveal-lines
into 1 two-part beat each — hero/facilities-mg both now run a 2-beat structure
(identity/title → statement with emphasis word) instead of 3, timed `[0,0.5]` then
`[0.58,1.3]`.

Also fixed two stale transforms in `video-scroll-effect.js` left over from the earlier
contrast-fix pass, both still hardcoding the old centered `translate(-50%,-50%)` (the
`prefers-reduced-motion` branch, and the per-frame scroll-driven update) — both now
`translateY` only, matching the new left-anchored layout. Verified all 4 reveal-line
beats (2 per section) live in-browser: left-aligned, legible, consistent composition.

## Chat de orçamento pessoal — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Bolha com retrato fornecido | Retrato original em public/assets/rikelme-chat.png, botão fixo responsivo |
| Conversa semelhante ao WhatsApp | Chat guiado com nome, descrição do sistema e prazo; teclado, Escape e histórico durante a sessão |
| Solicitação fora da ANFC | Identidade pessoal de Rikelme, resumo para envio ao e-mail pessoal cadastrado |
| Link ANFC | Links de apresentação direcionam para https://anfc.shop |

Desvios do plano: nenhum de visual ou escopo. Destino WhatsApp depende de número ainda não informado; nesta versão o visitante envia o resumo pelo aplicativo de e-mail. Não há envio automático, backend ou atendente humano conectado ao chat.

## Ajustes do chat — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Destino de orçamento | WhatsApp pessoal 55 73 99969-8822 com resumo preenchido |
| Ritmo da conversa | Indicador de digitação de 1 a 1,9 segundos antes de cada pergunta e resumo; envio bloqueado durante espera |
| Convite apenas no final | Mensagem junto à bolha só aparece quando o rodapé entra na tela e o chat está fechado |
| Paleta do site | Preto, branco e azuis dos tokens do portfólio na bolha e no chat |

Desvios do plano: nenhum. O envio por e-mail provisório foi substituído por WhatsApp.

## Suporte a inglês no chat — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Inglês no chat de orçamento | Seletor PT/EN, detecção inicial do idioma do navegador e preferência salva localmente |
| Conversa completa traduzida | Perguntas, estados, botões, convite do rodapé, acessibilidade e resumo do WhatsApp |
| Troca durante a conversa | Respostas e rascunho preservados ao alternar o idioma |

Desvios do plano: nenhum. A tradução se aplica ao chat de orçamento.

## Idioma global do portfólio — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Seletor geral no site | PT/EN no cabeçalho, acessível no desktop e celular |
| Remover seletor exclusivo do chat | Chat usa o mesmo idioma global; respostas preservadas |
| Traduzir todo o site | Navegação, hero, projetos, prévias, cases, sobre, carreira, contato, rodapé, estados e acessibilidade |
| Persistência e metadados | Preferência salva, detecção do navegador, atributo lang, título e descrições atualizados |

Desvios do plano: nenhum. Nomes próprios, marcas e capturas originais dos projetos são preservados. O PDF de currículo fornecido permanece em português, identificado assim no botão em inglês.

## Balanço da bolha de mensagem — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Efeito de balanço vertical | Movimento suave de 7 px em ciclo de 3,6 s; pausa com hover, foco ou chat aberto; desativado na preferência por movimento reduzido |

Desvios do plano: nenhum.

## Ícone NFC no cabeçalho — 22/10/2026

| Plano solicitado | Resultado |
| --- | --- |
| Ícone NFC após Batista | Ícone ContactlessPayment da biblioteca existente, em azul da paleta, substituindo o ponto final da assinatura |

Desvios do plano: nenhum.
