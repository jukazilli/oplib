# OPALIB

Acervo editorial interdisciplinar para publicar, organizar e descobrir artigos científicos e conteúdos autorais.

## Estado do projeto

O projeto está na fase de Fundação. A aplicação-base já pode ser executada localmente, e a documentação canônica está em [`docs/`](docs/):

- [`docs/08_Backlog_Canonico_Rastreabilidade_e_Plano_de_Entrega.md`](docs/08_Backlog_Canonico_Rastreabilidade_e_Plano_de_Entrega.md)
- [`docs/09_Matriz_Operacional_de_Rastreabilidade.md`](docs/09_Matriz_Operacional_de_Rastreabilidade.md)

## Desenvolvimento local

Pré-requisitos:

- Node.js `22.12.0`;
- pnpm `9.11.0`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Stack aprovada

- Node.js 22 LTS
- Next.js 16 com App Router
- React 19.2 e TypeScript estrito
- pnpm
- Neon PostgreSQL e Drizzle ORM
- Clerk, Vercel e Vercel Blob

As versões exatas estão fixadas no manifesto e no lockfile.

## Como contribuir

Leia [`CONTRIBUTING.md`](CONTRIBUTING.md). Mudanças devem ser realizadas em branch curta e submetidas por pull request para `main`.

## Segurança

Não publique vulnerabilidades, tokens, chaves ou outros segredos em issues. Consulte [`SECURITY.md`](SECURITY.md).

## Licença

A licença do código ainda não foi definida. A ausência de um arquivo `LICENSE` não concede permissão de uso, modificação ou redistribuição.
