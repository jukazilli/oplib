# EVID-WEB-001-01 — Shell público responsivo

- **Estado:** evidência parcial; inspeção no Preview pendente.

## Provas locais

- O corte `/areas` oferece página pública real com somente áreas de publicações no ar, contagens e links para `/publicacoes?area=<slug>`; estado vazio coberto por teste. Build lista `/areas` como rota dinâmica.
- Neste corte: 52 arquivos e 219 testes aprovados; lint, typecheck, build e `git diff --check` aprovados. A simulação unitária de falha da consulta não foi concluída e permanece no roteiro cumulativo.
- Layout público compartilhado contém skip link, cabeçalho, conteúdo principal e rodapé.
- Navegação expõe Início, Publicações, Áreas, Pesquisa e Sobre, sem divulgar administração, login ou cadastro.
- Destino atual usa `aria-current`; foco global permanece visível e controles possuem alvos mínimos.
- Compacto mantém Publicações e Pesquisa visíveis; destinos secundários usam menu curto.
- `pnpm test`: 25 arquivos e 107 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e `git diff --check`: aprovados.
- Busca de mojibake nos arquivos alterados: nenhuma ocorrência.

## Pendências

- Preview da PR #37 (`b50acad`): `/areas` respondeu HTTP 200 e mostrou título, estado vazio e navegação em desktop e 390 px sem corte visível. O ambiente não tinha publicações no ar; links e contagens por área ainda exigem dados publicados. O console registrou `404` de prefetch para `/sobre` e `/privacidade`, vinculados a WEB-006/DEC-002, não a `/areas`.
- O E2E local não iniciou porque o servidor Playwright ficou sem `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Executar axe, teclado, compacto/médio/amplo e zoom de 200% no Preview.
- Registrar screenshots e aceite humano antes de mover para `done`.
