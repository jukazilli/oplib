# Configuração e segredos

## Princípios

- Vercel é a fonte de configuração do runtime.
- GitHub Environments guarda apenas segredos exigidos por automações protegidas.
- Nenhum segredo é enviado por chat, issue, pull request, log ou artefato.
- Preview nunca recebe credenciais de produção.
- O OPALIB não usa Docker nem banco de dados local.

## Configuração local

O arquivo `.env.example` documenta somente nomes. Quando um check local precisar de valor público, copie o arquivo para `.env.local` e preencha apenas o estritamente necessário. Variantes `.env.*` permanecem ignoradas, exceto `.env.example`.

## Preview

1. vincule o repositório ao projeto Vercel correto;
2. configure valores no escopo Preview pelo painel ou CLI autenticada;
3. confirme que URLs Neon apontam para a branch `preview`;
4. nunca cole valores no terminal compartilhado ou em logs;
5. gere o deployment e execute smoke/E2E contra sua URL;
6. rotacione imediatamente qualquer valor exposto.

`vercel env pull` pode sobrescrever `.env.local`. Revise o destino antes de executar e nunca versione o arquivo gerado.

## Produção

Valores de Production são configurados separadamente e só podem ser usados pelo deployment e pelos workflows protegidos correspondentes. Migrations usam `DATABASE_URL_UNPOOLED` e nunca executam no build ou no boot da aplicação.
