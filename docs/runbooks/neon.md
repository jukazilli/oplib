# Neon PostgreSQL

## Topologia aprovada

- região: `aws-sa-east-1` (São Paulo);
- branch padrão e produtiva: `production`;
- branches persistentes não produtivas: `preview`, `development` e `test`;
- conexões de runtime usam pooling;
- migrations usam conexão direta e nunca executam no boot da aplicação.

## Papéis por branch

- `oplib_runtime`: login sem superusuário, criação de banco, criação de papéis, replicação ou bypass de RLS; possui apenas `CONNECT`, `USAGE` no schema e permissões DML concedidas pelas migrations;
- `oplib_migration`: login sem privilégios administrativos globais; possui `CONNECT`, `USAGE` e `CREATE` no schema necessário para migrations controladas.

Os papéis devem ser criados por SQL. A criação pelo botão **Add role** do Console Neon associa o usuário ao papel administrativo interno e não atende à separação exigida para runtime.

## Segredos

- nenhuma connection string ou senha é registrada no repositório;
- a senha só é definida ou rotacionada quando puder ser inserida diretamente no cofre do ambiente consumidor;
- `DATABASE_URL` usa endpoint pooled e o papel de runtime;
- `DATABASE_URL_UNPOOLED` usa endpoint direto e o papel de migration;
- produção nunca é disponibilizada a Preview, pull request ou teste.

## Verificação operacional

Em cada branch:

1. executar `SELECT 1`;
2. confirmar no catálogo que ambos os papéis são login e não possuem `SUPERUSER`, `CREATEDB`, `CREATEROLE` ou `BYPASSRLS`;
3. em ambiente não produtivo, assumir temporariamente `oplib_runtime` e comprovar que `CREATE TABLE` falha com `permission denied for schema public`;
4. remover imediatamente qualquer associação temporária usada apenas para o teste.

IDs, hosts, URLs de conexão e senhas não fazem parte da evidência versionada.
