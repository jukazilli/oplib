# EVID-AUD-001-01 — Trilha administrativa mínima

- **Estado:** infraestrutura concluída na branch Neon `preview`; `production` não alterada.
- **Migration:** `drizzle/0002_gigantic_retro_girl.sql`.

## Provas locais

- A matriz de ações cobre publicar, atualizar, retirar, republicar, excluir e destacar publicação, além de ocultar, restaurar e excluir comentário.
- O tipo de entidade deriva da ação, sem campo livre do cliente.
- O resultado distingue `success` e `failure`.
- Metadados aceitam somente `errorCode` estável; Markdown, comentário, segredo, stack e dados de sessão não são aceitos pelo contrato.
- A escrita pode usar a transação da mutação e identifica o administrador por `admin_identities`.
- A migration preserva eventos anteriores como `success`, remove o default para novas escritas e impõe check de resultado.
- `pnpm test`: 24 arquivos e 94 testes aprovados.
- `pnpm lint`, `pnpm typecheck` e `pnpm build`: aprovados.
- `pnpm db:check`: artefatos consistentes; a verificação não conectou a banco real.

## Prova de banco

- Branch Neon `preview` (`br-still-resonance-acf2ce9r`) confirmada pelo host direto, distinto de `production`.
- `pnpm db:migrate`: migration aplicada com sucesso somente em `preview`.
- Consulta de schema: `audit_events.result` existe, é obrigatório e não possui default para novas escritas.
- Evento sintético `publication.publish`/`failure` foi inserido e lido com metadado contendo somente `errorCode`; o rollback foi confirmado por consulta posterior com contagem zero.
- Os comandos de publicação e moderação ainda não existem; a integração de cada evento de sucesso/falha relevante permanece critério dos respectivos cortes.
