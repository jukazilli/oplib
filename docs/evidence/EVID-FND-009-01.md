# EVID-FND-009-01 — Blob para capas

- **Item:** FND-009
- **Data:** 20 de setembro de 2026
- **Store:** `oplib-covers-preview`
- **Commit funcional:** `aa04a5c`

## Implementação

- Store Vercel Blob público, exclusivo de Preview, ativo em `gru1`.
- Runtime conectado por OIDC gerenciado pela Vercel, sem token persistente no código.
- Escrita autorizada no servidor por `requireAdmin()` antes da emissão de token curto para upload direto.
- Pathname imutável gerado no servidor sob `preview/covers`, sem overwrite.
- JPEG, PNG, WebP e AVIF permitidos, com limite de 5 MB.
- MIME e assinatura binária validados no navegador e novamente no callback autenticado; conteúdo incompatível é removido.
- Cache público de um ano para URLs imutáveis.
- Exclusão bloqueada enquanto a capa permanecer referenciada.

## TEST-FND-009-01 — upload e leitura pública

O proprietário enviou uma imagem pela área administrativa do Preview. A interface confirmou `Capa enviada.` e renderizou a imagem pela URL pública do Blob. O store registrou um objeto com 1,76 MB no host público `xcuhly6rzve6os9w.public.blob.vercel-storage.com`.

## TEST-FND-009-02 — arquivo inválido

Os testes unitários confirmam:

- assinaturas válidas de JPEG, PNG, WebP e AVIF;
- rejeição de MIME não permitido;
- rejeição quando a assinatura não corresponde ao MIME declarado;
- rejeição acima de 5 MB.

## TEST-FND-009-03 — escrita anônima

Uma requisição sem sessão ao endpoint de geração de pathname recebeu `307 Temporary Redirect` para `/sign-in`. Nenhum token de upload ou pathname gravável foi emitido.

## Verificações

- `pnpm lint`: aprovado.
- `pnpm typecheck`: aprovado.
- `pnpm test`: 19 testes aprovados após a prova online.
- `pnpm build`: aprovado.
- Deployment Preview `READY`: `https://oplib-h6gyhjunq-feather-tecnologias.vercel.app`.

Produção não recebeu store, variável ou deployment neste corte. Nenhum token Blob foi registrado nesta evidência.
