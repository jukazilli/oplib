# EVID-FND-006-01 — Schema e migrations

- **Item:** FND-006
- **Data:** 20 de setembro de 2026
- **Banco:** Neon PostgreSQL

## Implementação

- Drizzle ORM e Drizzle Kit configurados para PostgreSQL.
- Migration inicial versionada em `drizzle/0000_even_tigra.sql`.
- 13 tabelas de domínio, quatro enums, FKs, checks e índices materializados.
- Controle do Drizzle configurado em `public.__oplib_migrations`.
- Aplicação usa `DATABASE_URL` pooled; migrations e verificações usam somente `DATABASE_URL_UNPOOLED` direta.
- A migration não depende de roles customizadas do provedor.

## TEST-FND-006-01 — migration limpa

`pnpm db:migrate` foi executado com sucesso por conexão direta nas branches Neon:

- `development`;
- `preview`.

Produção não foi alterada.

## TEST-FND-006-02 — constraints

`pnpm db:verify` confirmou nas duas branches:

- 13 tabelas de domínio e uma tabela de controle de migrations;
- uma migration registrada;
- rejeição de slug duplicado com SQLSTATE `23505`;
- rejeição de curtida duplicada por publicação e visitante com SQLSTATE `23505`;
- rejeição de FK inexistente com SQLSTATE `23503`.

As inserções de prova ocorreram dentro de transação finalizada com `ROLLBACK`.

## TEST-FND-006-03 — schema diff

`pnpm db:check` validou a consistência dos artefatos gerados. Testes unitários também inspecionam a migration versionada para impedir extensões preventivas, dependência de roles customizadas e perda das invariantes essenciais.

Nenhuma senha, connection string ou host foi gravado em arquivo, log versionado ou evidência. As URLs foram mantidas apenas em memória durante a execução e o clipboard foi limpo ao final.
