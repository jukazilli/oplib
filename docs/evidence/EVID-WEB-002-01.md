# EVID-WEB-002-01 — Página inicial editorial

## Entrega

- Hero com a promessa e a ação principal aprovadas em UX-002.
- Pesquisa encaminhada ao acervo público.
- Destaque principal e até três destaques secundários, exclusivamente publicados.
- Lista das seis publicações mais recentes e áreas com conteúdo publicado.
- Loading, vazio e erro parcial sem inutilizar as demais seções.
- Lista de espera deliberadamente ausente até WEB-007 oferecer um fluxo real.

## Evidência local

- `pnpm test`: 28 arquivos e 123 testes aprovados.
- `pnpm lint`: aprovado sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado; rota `/` dinâmica compilada.
- `tests/unit/home-page.test.tsx`: hero, navegação, descoberta, vazio e falha parcial cobertos.

## Validação preservada para o Preview/final

- Conferir capas presentes e ausentes, ordem editorial e links reais.
- Conferir celular, tablet, desktop e zoom de 200%.
- Executar axe e registrar screenshots.
- Simular indisponibilidade independente de destaques, recentes e áreas.
