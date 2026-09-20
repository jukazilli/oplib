# Neon PostgreSQL

## Topologia aprovada

- região: `aws-sa-east-1` (São Paulo);
- branch padrão e produtiva: `production`;
- branch não produtiva mínima: `preview`;
- `development` e `test` podem ser mantidas quando trouxerem valor ao fluxo, sem configuração adicional obrigatória;
- conexões de runtime usam pooling;
- migrations usam conexão direta e nunca executam no boot da aplicação.

## Credencial por branch

- A Fundação usa o papel padrão `neondb_owner`, criado e gerenciado pelo Neon.
- Separar papéis de runtime e migration é um hardening futuro, não um bloqueio para desenvolvimento ou staging.
- As migrations não devem depender da existência de papéis customizados.

Os papéis `oplib_runtime` e `oplib_migration` já criados podem permanecer sem uso. Não é necessário redefinir suas senhas ou configurá-los em cada branch.

## Segredos

- nenhuma connection string ou senha é registrada no repositório;
- `DATABASE_URL` usa endpoint pooled e o papel padrão do Neon;
- `DATABASE_URL_UNPOOLED` usa endpoint direto e o mesmo papel, apenas em migration ou operação controlada;
- produção nunca é disponibilizada a Preview, pull request ou teste.

## Verificação operacional

Em cada branch utilizada:

1. executar `SELECT 1`;
2. confirmar que a aplicação usa endpoint pooled;
3. confirmar que migrations usam endpoint direto;
4. nunca disponibilizar a credencial de produção em Preview, pull request ou teste.

IDs, hosts, URLs de conexão e senhas não fazem parte da evidência versionada.
