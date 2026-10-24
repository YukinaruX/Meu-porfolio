# Configuração do painel

Supabase conectado ao projeto `trpwretnmxbkoahchlzp`. Migration confirmada, usuário existente autorizado em `admin_users` e Edge Function `lead-intake` publicada em 23/10/2026. Os pedidos são gerenciados exclusivamente no painel Supabase.

O envio real foi verificado com um registro sintético, removido ao terminar: criação, reenvio sem duplicação, contato inválido, preflight CORS, origem não permitida, leitura anônima e sincronização sem autenticação. Também foram verificadas leitura/alteração como administrador e ausência de leitura para identidade fora da lista via contexto RLS. O login com a senha pessoal deve ser conferido pelo proprietário em `/painel`; nenhuma senha foi solicitada ou alterada.

A função permite explicitamente `https://rikfazlp.online`. `ALLOWED_ORIGINS` configura origens adicionais; sem esse segredo, também permite `http://127.0.0.1:5173`, `http://localhost:5173`, `http://127.0.0.1:5174`, `http://localhost:5174`, `http://127.0.0.1:4185`, `http://127.0.0.1:4173` e `http://localhost:4173`. Origens desconhecidas continuam bloqueadas. A versão 4 da função inclui o domínio de produção.

`src/lib/supabase-public.js` contém a URL e a chave **publishable** públicas deste projeto, usadas quando a hospedagem não define `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`. As variáveis de ambiente continuam podendo substituir esses valores. Nenhum segredo ou chave service-role deve entrar nesse arquivo. O build publicado não depende do `.env` local; RLS e autenticação mantêm o controle de acesso aos pedidos. Referência: [chaves públicas Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

`node scripts/verify-production-quote.cjs --live` verifica o formulário real e cria um único pedido sintético. O UUID fica em `docs/private/production-quote-test.json`; confirme e remova exclusivamente esse registro após o teste.

`node scripts/verify-supabase.mjs` repete a verificação HTTP real e imprime o UUID do pedido sintético para limpeza posterior pelo painel. `node scripts/verify-crm.cjs` verifica a interface local com ou sem configuração. Login com senha, logout, expiração, quota sob carga não foram testados nesta etapa.

## Supabase

1. Use um projeto Supabase e execute `supabase/migrations/202610230001_leads.sql` no SQL Editor (uma vez). As tabelas têm RLS; visitantes não podem consultar, alterar ou inserir diretamente.
2. Crie seu usuário em Authentication → Users. Desative novos cadastros públicos, se não forem necessários. Copie o UUID do seu usuário e execute, substituindo o exemplo:

```sql
insert into public.admin_users(user_id) values ('UUID-DO-SEU-USUARIO');
```

3. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` ao `.env` existente, sem apagar as variáveis Cloudflare. Apenas URL e chave pública entram no navegador. Nunca use service_role com prefixo VITE_.
4. Configure o segredo `ALLOWED_ORIGINS` da Edge Function com as origens exatas, separadas por vírgula, por exemplo `http://127.0.0.1:5173,https://seu-dominio.com`. Origens fora da lista são bloqueadas. URL e service_role do Supabase são disponibilizados pelo ambiente de Edge Functions.
5. Vincule o projeto pela CLI (`supabase link --project-ref SEU_PROJECT_REF`) e publique a função com `supabase functions deploy lead-intake`. `verify_jwt=false` é intencional para o formulário público; o painel verifica as permissões por RLS.
6. Rode `npm.cmd run build` após configurar as variáveis. Publique somente dist. O host deve servir index.html para `/painel` (SPA fallback).
7. Acesse `/painel` com seu e-mail e senha. A sessão fica na memória e acaba ao recarregar ou expirar. Não há cadastro de administrador público.

O formulário apresenta um resumo editável e salva apenas após o visitante ler o aviso e clicar em **Solicitar orçamento**. Depois de salvar, confirma o recebimento e informa que o retorno será pelo contato fornecido; WhatsApp aparece como opção secundária. Em caso de falha ou indisponibilidade, também oferece WhatsApp como alternativa. Cada conversa possui UUID para novas tentativas não criarem duplicatas. A função limita globalmente a 20 envios por minuto, sem guardar IP; isso é uma proteção básica, não substitui proteção de abuso na borda. Ajuste conforme o tráfego real.

O painel consulta os pedidos automaticamente a cada 15 segundos enquanto estiver visível e ao retornar para a aba. A atualização pausa durante operações e é encerrada no logout; o botão Atualizar permanece disponível. Não exige ativação do Supabase Realtime.

## Privacidade e operação

O aviso publicado descreve os campos reais, orçamento como finalidade, operadores previstos e preferências de idioma. Não instala analytics, publicidade nem coleta IP nos pedidos. O registro do aviso é ciência da informação, sem autorização de marketing.

A retenção de 12 meses sem interação é uma política proposta para operação manual; não há job automático de exclusão. Confirme a política antes de publicar. Avalie região do projeto, contratos dos fornecedores e transferências internacionais conforme a operação efetiva; este texto não constitui validação jurídica.

Referências: [ANPD — Cookies e proteção de dados pessoais](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais), [Supabase — RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase — getUser](https://supabase.com/docs/reference/javascript/auth-getuser).

## Verificação antes de uso real

Teste usuário anônimo sem leitura de leads, usuário autenticado fora da lista sem acesso, administrador autorizado, criação e repetição do mesmo envio, contato inválido, limite de envios, status, logout, expiração e exclusão. Essas verificações de integração dependem do projeto real e não foram executadas apenas com o build local.
