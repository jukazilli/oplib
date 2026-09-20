# EVID-FND-005-01 — Neon em São Paulo

- **Item:** FND-005
- **Data:** 20 de setembro de 2026
- **Provedor:** Neon PostgreSQL

## Provisionamento

- projeto `oplib` criado na região `aws-sa-east-1` — AWS South America East 1 (São Paulo);
- PostgreSQL 18;
- branches persistentes `production`, `preview`, `development` e `test`;
- `production` é a branch padrão;
- branches não produtivas derivam de `production` e não expiram automaticamente;
- pooling disponível e habilitado para conexões de runtime.

## Separação de papéis

Cada branch possui:

- `oplib_runtime`, sem `SUPERUSER`, `CREATEDB`, `CREATEROLE`, replicação ou bypass de RLS;
- `oplib_migration`, sem privilégios administrativos globais e com permissão de criação limitada ao schema de migrations.

Os papéis foram criados por SQL porque papéis adicionados pelo Console Neon recebem associação administrativa incompatível com o requisito de runtime sem DDL.

## TEST-FND-005-01 — conectividade por ambiente

`SELECT 1` foi executado com sucesso nas branches:

- `production`;
- `preview`;
- `development`;
- `test`.

## TEST-FND-005-02 — DDL negado ao runtime

Na branch `test`:

- `SELECT current_user, 1` executou como `oplib_runtime` e retornou `1`;
- `CREATE TABLE` executado no mesmo contexto falhou com `permission denied for schema public` (`SQLSTATE 42501`);
- a associação temporária usada para assumir o papel durante o teste foi removida imediatamente.

Nenhuma senha, connection string, host, ID de projeto ou ID de branch foi registrado nesta evidência. As senhas dos logins permanecem indisponíveis até a vinculação direta aos cofres de Vercel/GitHub nos cortes dependentes.
