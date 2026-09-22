# EVID-SEO-002-01 — Sitemap, robots e dados estruturados

## Entrega

- Sitemap com home, acervo e somente publicações `published`.
- Datas de modificação e capa incluídas quando disponíveis.
- Development/Preview e Production sem origem explícita retornam sitemap vazio e bloqueiam crawling.
- Production libera rotas públicas e exclui administração, APIs e autenticação.
- Publicação/atualização/retirada/republicação invalidam `/sitemap.xml`.
- Article JSON-LD contém somente título, resumo, datas, canonical, autor/editor, áreas, tags e capa existentes.
- Serialização neutraliza fechamento de `script` vindo do conteúdo.

## Evidência local

- `pnpm test`: 32 arquivos e 137 testes aprovados.
- `pnpm lint`: aprovado sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado; `/robots.txt` e `/sitemap.xml` compilados.
- `tests/unit/seo-discovery-files.test.ts`: sitemap e robots por ambiente cobertos.
- `tests/unit/structured-data.test.ts`: fidelidade e serialização segura cobertas.
- `tests/unit/draft-actions.test.ts`: regressão das ações editoriais aprovada após a invalidação adicional.

## Validação preservada para o Preview/final

- Abrir `/robots.txt` e `/sitemap.xml` em Preview e Production.
- Retirar/republicar conteúdo real e observar remoção/retorno no sitemap.
- Validar XML e uma publicação no teste de resultados avançados.
- Confirmar origem canônica definitiva antes de permitir indexação.
