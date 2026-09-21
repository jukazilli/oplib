# EVID-MOD-001-01 — Lista administrativa de comentários

- `src/app/admin/comentarios/page.tsx` exige allowlist no servidor antes da consulta.
- `src/modules/admin/comments.ts` filtra estado e pagina por data/ID, incluindo ocultos.
- `src/components/admin/comments-list.tsx` mostra texto literal e publicação de origem, estados vazio/erro e navegação.
- `tests/unit/admin-comments.test.tsx` e `admin-comments-repository.test.ts` cobrem autorização, XSS literal, filtros, paginação e falha.
- `pnpm test`: 43 arquivos, 169 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`: aprovados; `/admin/comentarios` compilada como rota dinâmica.

Preview/final: confirmar acesso somente do administrador, filtro e várias páginas com datas iguais, comentário malicioso literal, link da publicação, teclado, axe, zoom e responsividade.
