# Direção visual e tradução para código

As cinco referências PNG foram geradas com a ferramenta imagegen integrada antes da implementação. São referências de layout, não imagens de produtos entregues. A tela ilustrada de Alice/Everton não representa os sites reais e será substituída pelas capturas verificadas existentes.

## Sistema extraído

- Fundo preto quente #0b0a08, creme #f3ede2, bronze #b8916a. Divisores discretos em bronze escuro. Contraste do texto auxiliar elevado em relação às referências para leitura AA.
- Archivo para estrutura e Fraunces itálico para ênfase editorial. Geist para corpo, alinhado à Taste Skill v1. A preferência histórica por Inter foi revisada pelo pedido explícito da skill; não usar fonte de terminal.
- Contêiner máximo de 1400px, margens fluidas de 24 a 72px. Espaçamento baseado em 8px; seções com 96–144px entre blocos.
- Raios discretos de 3–6px; botões de 48px ou mais; texto auxiliar de pelo menos 13px. Sem cartões aninhados ou sombras luminosas.
- Quatro motivos: composição editorial deslocada, enquadramentos de imagem, linhas verticais de ritmo e acordeão horizontal. Movimento: entrada coreografada e expansão suave de conteúdo.

## Abertura — hero.png

Prioridade: título em duas linhas, alinhado à esquerda, seguido de descrição e CTA. Nome e profissão têm hierarquia secundária. O desenho de filamentos ocupa a direita, deixando o texto sobre uma área de alto contraste. Traduzir para Threads real do React Bits, com 56 linhas bronze, baixa velocidade e pausa acessível. Título de 52–100px conforme viewport, sem cortar CTA em notebook. Rodapé do hero informa a A-NFC e localização; não usar estatísticas fictícias.

## Projetos — projects.png

Cabeçalho em duas colunas. Galeria com proporção aproximada 1.4:1, títulos e descrições fora das imagens. Capturas verdadeiras de Alice Vieira e Everton Editor ocupam o primeiro par; CRECI e Quiz no segundo par. Áreas de imagem estáveis com recorte superior. Ao explorar, abrir leitor acessível com PNG inteiro, alternância desktop/celular e link externo. Não simular a aplicação dentro da captura.

## Sistemas — systems.png

Uma explicação de domínio, seguida de listagem aberta. Diagrama de quatro etapas de Facilities em coluna larga; texto contextual na coluna menor. No celular, diagrama em duas colunas sem transbordar. Seis cases em details/summary com descrições e stacks verificadas. Sem dashboards inventados e sem expor dados internos.

## Sobre — about.png

Coluna de apresentação menor e trajetória maior, com divisores. Manter graduação como em andamento. Duas experiências principais e formação visíveis; demais experiências em expansão nativa. Stack como lista tipográfica, sem pílulas decorativas.

## Contato — contact.png

Frase em duas linhas, e-mail destacado, CTA circular magnético e links sociais. Mais de 80px de respiro antes do rodapé. E-mail deve quebrar com segurança em telas pequenas. Footer com nome, localização e link de retorno ao topo.

## Skills e precedência

Taste Skill v1: assimetria, ritmo, Tailwind, ícones Phosphor e motion isolado. Awesome Design Professional: tokens semânticos, estados explícitos e acessibilidade; cores/fontes de sua amostra de loja não substituem a identidade solicitada. Web Design Guidelines: semântica, foco, movimento reduzido e dimensões de imagem. Image to Code: cinco referências analisadas antes do código. imagegen: geração integrada, sem CLI/API. Playwright CLI: validação visual e dos fluxos reais. React Bits: componentes oficiais fixados no commit documentado em PROVENANCE.md.
