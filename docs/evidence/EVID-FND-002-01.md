# EVID-FND-002-01 — Toolchain e aplicação-base

- **Item:** FND-002
- **Data:** 20 de setembro de 2026
- **Pull request:** [#4 — feat: materializa aplicação-base do FND-002](https://github.com/jukazilli/oplib/pull/4)
- **Branch:** `feat/fnd-002-application-base`
- **Commit de implementação:** `fdea43e7ff5e3247de19d1d6585ed9ed7bd9325c`

## Versões materializadas

| Ferramenta        |    Versão |
| ----------------- | --------: |
| Node.js           | `22.12.0` |
| pnpm              |  `9.11.0` |
| Next.js           |  `16.3.5` |
| React e React DOM |  `19.2.8` |
| TypeScript        |   `5.9.3` |

As versões estão fixadas em `package.json`, `.nvmrc`, `.node-version` e `pnpm-lock.yaml`.

## TEST-FND-002-01 — instalação reproduzível

Executado localmente com Node.js `22.12.0` e pnpm `9.11.0`:

```text
pnpm install --frozen-lockfile
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 750ms
```

## TEST-FND-002-02 — tipos, build e execução

- `pnpm typecheck`: aprovado após gerar os tipos de rota do Next.js;
- `pnpm build`: aprovado com as rotas `/` e `/_not-found` estáticas;
- `pnpm dev`: servidor pronto e `GET /` respondeu HTTP `200`;
- `pnpm start --port 3001`: build de produção respondeu HTTP `200`;
- HTML validado com `lang="pt-BR"`, título `OPALIB` e headline pública esperada;
- `scripts/validate-repository.mjs`: 20 arquivos obrigatórios validados.

## Limites preservados

- nenhum monorepo, Pages Router, estado global ou dependência fora da stack foi introduzido;
- a página usa Server Component e não envia JavaScript de interação desnecessário;
- a interface é deliberadamente mínima; tokens, fontes, componentes e testes visuais pertencem ao FND-003;
- scripts de lint, formatação, testes, E2E e banco serão adicionados quando as respectivas ferramentas forem materializadas, sem placeholders.
