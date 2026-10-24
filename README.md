# Rikelme Batista — Portfólio

Portfólio em React + Vite, com identidade preta, branca e azul e componentes oficiais do React Bits. Direção inspirada na Aloft, com vitrine horizontal de projetos, prévias navegáveis em desktop/celular, serviços, processo e FAQ. Capturas dos sites em PNG, sem WebP.

## Desenvolvimento

Requer Node.js 24 e npm. No PowerShell do Windows:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço local exibido pelo Vite. O `index.html` agora é a entrada React e deve ser servido pelo Vite, não aberto diretamente pelo sistema de arquivos.

## Produção

```powershell
npm.cmd run build
npm.cmd run preview
```

A saída publicável é **somente `dist/`**. Não publicar a pasta inteira do projeto: ela contém documentos, histórico e ferramentas de trabalho. O build copia apenas os assets públicos selecionados.

## Verificação no navegador

Chrome instalado. Primeiro gere o build. O teste usa a porta local 4183:

```powershell
npm.cmd run build
npm.cmd run test:ui
```

O teste inicia uma prévia da produção, usa Playwright CLI em uma sessão própria e fecha seus processos ao terminar. Verifica galeria, modal, teclado, menu mobile, cases, currículo profissional, movimento reduzido e auditoria Axe. Evidências em `docs/private/` (ignorado pelo Git).

## Conteúdo e assets

- `src/content.js`: projetos, experiências e links públicos selecionados.
- `src/App.jsx`: seções e interações.
- `src/styles.css`: tokens, componentes Tailwind e responsividade.
- `src/components/react-bits/`: Threads, Magnet, AnimatedContent, Carousel, SpotlightCard e LogoLoop, com origem e adaptações em `PROVENANCE.md`.
- `src/components/TechStack.jsx` e `public/assets/stack/`: faixa da stack em loop, pausa ao passar o mouse e versão estática para movimento reduzido; SVGs Devicon locais com origem em `docs/devicon-source.json`.
- `src/components/ProjectShowcase.jsx`: faixa arrastável, controles de projetos e capturas com rolagem dentro de cada cartão.
- `src/components/HomeHero.jsx`, `StudioSections.jsx` e `src/studio.css`: abertura, serviços, processo, FAQ e composição visual.
- `docs/aloft-reference-analysis.md`, `docs/aloft-redesign-plan.json`: exploração da referência e plano aprovado.
- `public/assets/projects/`: capturas PNG reais, desktop e celular.
- `public/curriculo-rikelme-batista.pdf` e `public/resume-rikelme-batista-en.pdf`: currículos fornecidos, selecionados automaticamente conforme PT/EN nos links de download.
- `docs/design-references/`: cinco referências geradas antes do código e análise visual. Não fazem parte do build.
- `docs/private/legacy-before-react/`: backup local da interface anterior.

As descrições dos projetos privados não disponibilizam código ou acesso interno. A prévia do CRECI-BA mostra o login público. As telas das referências geradas são apenas estudos de layout; o site usa capturas verdadeiras dos projetos.

ANFC Cardápios, Riclick e Stockalto têm capturas locais na vitrine. Riclick mostra a interface sem backend de automação e Stockalto usa a demonstração local existente. Os cartões desses projetos abrem as capturas, sem apontar para localhost ou inventar uma URL pública. Naveg, Quiz e CRECI não são exibidos por decisão do proprietário. O print mobile do Riclick foi refeito após corrigir os grids inline que sobrepunham seus breakpoints.

`scripts/capture-local-project.cjs` inicia um projeto por execução, salva PNGs desktop/mobile e encerra sua própria árvore de processos em `finally`, verificando o fechamento da porta. Logs e horários ficam em `docs/private/local-captures/`. `node scripts/verify-local-gallery.cjs` verifica a sequência, dimensões e leitores das novas capturas.

## Painel e privacidade

O painel privado fica em `/painel`. Configuração de Supabase, permissões e Edge Function: [docs/crm-setup.md](docs/crm-setup.md). Sem a configuração real, o chat informa que o envio pelo site está indisponível e mantém o WhatsApp como opção.

Verificação local do fluxo: `node scripts/verify-crm.cjs` (build com ou sem configuração). Verificação HTTP real: `node scripts/verify-supabase.mjs` (cria pedido sintético e imprime UUID para exclusão pelo painel). O aviso de privacidade e as preferências de armazenamento ficam no rodapé. Analytics e publicidade não foram instalados.

Os recursos antigos de vídeo/scroll e capturas duplicadas foram removidos. `scripts/capture-projects.cjs` agora grava diretamente em `public/assets/projects/`; metadados em `docs/project-captures.json`. Originais fornecidos foram preservados em `docs/private/source-originals/`.

## Licenças

React Bits: MIT + Commons Clause, licença em `public/licenses/react-bits.txt`. Fontes distribuídas sob OFL; licenças em `public/licenses/`.

Ícones da stack: Devicon, MIT, licença em `public/licenses/devicon.txt`. Marcas pertencem aos respectivos titulares e identificam as tecnologias utilizadas.
