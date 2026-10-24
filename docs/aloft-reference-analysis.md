# Referência Aloft — exploração de 23/10/2026

Referência: https://aloftagencia.com/. Evidências de navegação por mouse e capturas em `docs/private/aloft-reference/`; scripts reproduzíveis em `scripts/explore-aloft.cjs` e `scripts/explore-aloft-details.cjs`.

## O que foi navegado

- Página inicial e links de Serviços, Cases, Sobre, Processo, FAQ e lideranças. Alguns links usam scroll JavaScript e não atualizam o hash para o destino; o endereço sozinho não prova a seção exibida.
- `/ferramentas/`, `/ferramentas/raio-x-da-conversao/` e `/ferramentas/custo-de-plataforma/`, seguindo os links pelos alvos visíveis e coordenadas do mouse.
- `/en/` e `/es/` pelo seletor de idiomas; `/politica-de-privacidade/` pelo rodapé.
- Carrossel: clique na seta da primeira vitrine trocou Home por Página de produto; arraste horizontal com mouse e capturas antes/depois.
- FAQ aberto com clique; menu mobile aberto em 390 × 844.

Não houve envio de formulários, contato com a agência ou acesso a contas. Não foi verificada toda combinação de idioma, ferramenta e destino externo. A inspeção abrangeu as rotas internas encontradas na navegação principal e nas ferramentas, não constitui garantia de descoberta de URLs não vinculadas.

## Padrões a adaptar

1. Hierarquia comercial: título curto e amplo, explicação de serviço, ação clara, trabalhos visíveis logo após a abertura.
2. Carrossel de projetos com cartões altos, capturas reais e identificação do projeto acima da moldura. A vitrine tem dois níveis: faixa de projetos e navegação interna por telas de um projeto.
3. Área de captura com exploração da página longa; controles e indicação de interação. Separar arraste horizontal da faixa e rolagem vertical da captura para evitar gestos concorrentes.
4. Serviços em cartões, detalhes em expansões, etapas do processo, FAQ e chamada final. Cabeçalho e ação de contato com presença consistente.
5. Preto, branco, azul, bordas discretas e tipografia forte. Efeitos apoiam a navegação; o conteúdo permanece utilizável em mobile e sem movimento.

## Adaptação ao conteúdo disponível

O portfólio possui quatro sites com uma captura desktop e uma mobile de cada. Portanto a navegação interna usará **Desktop / Celular**, sem inventar páginas de produto ou outras telas inexistentes. O leitor de captura completa e os links reais dos projetos permanecem disponíveis. Métricas, depoimentos, ferramentas comerciais e certificações da referência não serão transportados para este portfólio.

React Bits: componentes existentes AnimatedContent, Threads e Magnet; avaliar Carousel oficial para a navegação interna e SpotlightCard para serviços. Qualquer adaptação deverá ter origem e alterações registradas em `src/components/react-bits/PROVENANCE.md`. Fonte: https://github.com/DavidHDev/react-bits; documentação: https://reactbits.dev/components/carousel e https://reactbits.dev/components/spotlight-card.

## Plano para aprovação

Paleta: fundo #000000, superfície #10141c, texto #ffffff, texto secundário #a5adbd, ação #2563eb, destaque #6291ff.

| Ordem | Seção | Conteúdo e técnica | Assets |
|---|---|---|---|
| 1 | Início | Proposta de valor e CTA; Threads, AnimatedContent e Magnet | Marca A-NFC e identidade existentes |
| 2 | Projetos | Faixa horizontal arrastável, setas, contador; navegação interna Desktop/Celular com Carousel adaptado e leitor completo | Oito PNG reais existentes |
| 3 | Serviços | Sites, sistemas e automações; SpotlightCard e AnimatedContent | Ícones existentes |
| 4 | Sistemas | Cases privados e explicação do trabalho | Conteúdo existente; sem capturas internas |
| 5 | Processo | Briefing, proposta, desenvolvimento e entrega | Ícones e conteúdo editorial |
| 6 | Sobre | Rikelme, A-NFC e trajetória | Marca e dados existentes |
| 7 | Dúvidas e contato | FAQ, contato e abertura do chat de orçamento | Conteúdo existente e retrato do chat |

Chat aprovado, PT/EN e painel Supabase preservados. Trabalho na aplicação React/Vite existente; publicação não incluída nesta etapa. Sem novos assets gerados, sem vídeo planejado, zero créditos. Estado: aprovado pelo proprietário, implementado e validado. Relatório em docs/aloft-build-review.json.
