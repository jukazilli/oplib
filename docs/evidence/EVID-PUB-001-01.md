# EVID-PUB-001-01 — Criação e salvamento manual de rascunho

- **Estado:** concluída como fundação funcional
- **Aceite:** proprietário, em 21/09/2026, condicionado à evolução visual registrada em `PUB-007`
- **Implementação:** PR #23
- **Rota:** `/admin/publicacoes`

## Entrega comprovada

- `drizzle/0001_broken_frank_castle.sql` permite título, resumo, Markdown e tipo incompletos somente em `draft`;
- `posts_publishable_content` continua rejeitando conteúdo público incompleto;
- toda mutação chama `requireAdminCommand` no servidor;
- criação recebe slug técnico privado e mantém estado `draft`;
- atualizações usam `updated_at` como versão otimista;
- conflito preserva a cópia local e apresenta escolha entre ela e a versão do servidor;
- alterações não salvas são mantidas no navegador e avisam antes da saída;
- a navegação administrativa expõe `Publicações` como destino real;
- a UI mostra somente título, conteúdo, estado de salvamento e ação principal neste corte.

## Validações executadas

- `pnpm lint` — aprovado;
- `pnpm test` — 17 arquivos e 64 testes aprovados;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado, incluindo `/admin/publicacoes` dinâmica;
- `pnpm db:verify:drafts` — aprovado no banco configurado, com dados sintéticos revertidos;
- CI do PR #23 — Quality, CodeQL, política do repositório e Vercel aprovados.

## Aceite do Preview e ressalva de evolução

O proprietário aceitou o resultado como Preview e confirmou que ele não representa a UI final de `Publicações`.

Ficou determinado para `PUB-007`:

- lista editorial administrativa somente das publicações do proprietário, inspirada no ritmo de `docs/assets/navegacao-formato-feed.png`;
- menu de três pontos no topo de cada publicação;
- `Nova publicação` abrindo diálogo modal inspirado em `docs/assets/reference-threads.png`;
- preservação integral do backend, salvamento, recuperação e conflito entregues por `PUB-001`.

A referência visual não autoriza feed social, mistura de autores ou conteúdo de terceiros na administração. O feed público do visitante pertence aos slices WEB de descoberta.
