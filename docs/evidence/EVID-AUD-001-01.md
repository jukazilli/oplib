# EVID-AUD-001-01 — Trilha administrativa mínima

- **Estado:** revisão técnica; migration e prova em banco pendentes.
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

## Pendências de aceite

- Executar migration em banco controlado e verificar um evento sintético sem dados sensíveis.
- Integrar chamadas de sucesso na transação dos comandos administrativos posteriores.
