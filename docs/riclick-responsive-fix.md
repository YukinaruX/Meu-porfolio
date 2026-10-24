# Riclick — correção da captura responsiva

O teste de 390px reproduziu largura de documento de 554px e quatro colunas de indicadores. O HTML definia grid-template-columns inline, impedindo que os breakpoints existentes de 900/600px aplicassem duas/uma coluna.

Correção: passar a quantidade de colunas desktop por variável CSS --stats-columns e deixar as media queries controlarem a propriedade grid-template-columns. Conter largura intrínseca de filhos, tabelas e barra de filtros; permitir quebra dos controles em telas pequenas. Não usar overflow:hidden no documento, zoom, dados fictícios ou recorte para disfarçar o erro.

Teste reproduzível: scripts/verify-riclick-responsive.cjs, com 320/390/768/1440px e verificação da quantidade de colunas. Captura posterior pelo script existente, com encerramento do servidor. Interface servida sem backend de automação. Alterações limitadas a C:/Riclick/public/index.html e styles.css; versões anteriores preservadas em docs/private/riclick-responsive/.

Resultado: teste original falhou em 390px com documento de 554px e quatro colunas. Após a correção, todas as quatro larguras passaram, sem transbordamento do documento. Nova captura mobile mede 390×2744 e desktop 1440×1383. Aguardado o encerramento natural dos toasts antes do print. PNGs e dimensões atualizados no portfólio; servidor encerrado após capturar.
