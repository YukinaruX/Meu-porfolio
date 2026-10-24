# Redesign preto, azul e A-NFC

Pedido explícito do usuário: fundo full black, cor secundária azul, terciária branco e destaque à propriedade da A-NFC. Revisão de identidade e conteúdo dentro das cinco seções existentes; não há mudança de técnica, vídeos novos ou assets Higgsfield.

Três referências novas foram geradas com imagegen e inspecionadas antes da implementação: abertura, módulo da empresa e contato. Galeria e listagens mantêm a composição existente, recebendo a nova paleta.

## Extração

- Fundo #000000; texto #ffffff; azul #2563eb para ações e #6291ff para texto, foco e detalhes. Branco sobre #2563eb tem contraste aproximado 5.17:1; #6291ff sobre preto supera AA para texto. Auxiliar #a5adbd.
- Archivo e Geist, sem serifas ou itálicos. A abertura tem duas linhas: “Código. Produto.” e “Negócio.”. A segunda é azul. Corpo de 16–18px e CTA de pelo menos 52px.
- Threads real permanece na abertura com cores azuis. O padrão é atmosfericamente discreto e não tem glow neon. Pausa e movimento reduzido preservados.
- A identidade pessoal permanece principal. A A-NFC aparece no cargo, no CTA para conhecer a empresa, em uma assinatura com marca e no módulo da empresa dentro de Sobre.
- Logo original obtido de `R-M-Holding-de-negocios/anfc/public/images/brand.png`. Não redesenhar nem usar a versão imprecisa da referência gerada. Preservar o PNG original em uma pequena superfície branca para que o A preto permaneça legível.
- Módulo A-NFC: alinhamento assimétrico entre marca e narrativa, serviços em lista aberta e CTA para contato. Não inventar domínio, métricas, clientes ou disponibilidade comercial.
- Contato: título “Seu próximo projeto começa aqui.”, e-mail pessoal, afiliação à A-NFC e CTA circular azul.
- Mobile: uma coluna, logo de tamanho controlado e CTA principal visível sem transbordar. Nenhum card aninhado. Todas as páginas de fundo são pretas; capturas reais preservam as cores próprias dos projetos.

Os prompts completos estão em `PROMPTS.json`. Os PNG são estudos de layout, nunca screenshots dos produtos. A marca publicada usa o asset original.
