# Contribuindo com o OPALIB

## Fluxo de trabalho

1. Escolha um item pronto no backlog canônico.
2. Crie uma branch curta a partir de `main`.
3. Atualize D08 e D09 quando o estado, a implementação, os testes ou as evidências mudarem.
4. Faça commits pequenos e coerentes.
5. Abra um pull request usando o template do projeto.
6. Aguarde os checks obrigatórios e resolva as conversas de revisão.

## Convenção de branches

Use um prefixo que represente a finalidade, como `feat/`, `fix/`, `docs/`, `chore/`, `test/` ou `ci/`, seguido do item do backlog quando aplicável.

Exemplo: `chore/fnd-001-repository-governance`.

## Commits

Prefira mensagens no formato Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:` ou `ci:`.

## Pull requests

Todo pull request deve informar:

- item do backlog e problema resolvido;
- escopo e arquivos relevantes;
- testes e checks executados;
- riscos, migrations e rollback quando aplicáveis;
- evidências sem segredos ou dados pessoais.

Não reduza requisitos canônicos silenciosamente. Mudanças de arquitetura, stack ou escopo precisam ser registradas nos documentos correspondentes.

## Segredos e dados sensíveis

Nunca versione arquivos `.env`, tokens, cookies, chaves, connection strings, recovery codes ou dados pessoais desnecessários. Se um segredo for exposto, revogue-o imediatamente e siga `SECURITY.md`.
