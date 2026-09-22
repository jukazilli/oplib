# EVID-WEB-001-01 — Shell público responsivo

- **Estado:** evidência parcial; inspeção no Preview pendente.

## Provas locais

- Layout público compartilhado contém skip link, cabeçalho, conteúdo principal e rodapé.
- Navegação expõe Início, Publicações, Áreas, Pesquisa e Sobre, sem divulgar administração, login ou cadastro.
- Destino atual usa `aria-current`; foco global permanece visível e controles possuem alvos mínimos.
- Compacto mantém Publicações e Pesquisa visíveis; destinos secundários usam menu curto.
- `pnpm test`: 25 arquivos e 107 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e `git diff --check`: aprovados.
- Busca de mojibake nos arquivos alterados: nenhuma ocorrência.

## Pendências

- O E2E local não iniciou porque o servidor Playwright ficou sem `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Executar axe, teclado, compacto/médio/amplo e zoom de 200% no Preview.
- Registrar screenshots e aceite humano antes de mover para `done`.
