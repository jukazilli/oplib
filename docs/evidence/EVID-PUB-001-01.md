# EVID-PUB-001-01 — Criação e salvamento manual de rascunho

- **Estado:** técnico concluído; aceite autenticado do Preview pendente
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

## Aceite pendente no Preview

O Preview exige SSO da Vercel e autenticação administrativa. A automação isolada não possui essas sessões e não tentou contornar as proteções.

O proprietário deverá verificar:

- [ ] desktop: título, conteúdo e ação `Salvar rascunho` possuem hierarquia clara;
- [ ] celular: composição em uma coluna, sem corte ou rolagem horizontal;
- [ ] após editar, aparece `Alterações não salvas`;
- [ ] ao salvar, o endereço recebe `?draft=<uuid>` e aparece `Salvo às HH:mm`;
- [ ] recarregar o endereço preserva o rascunho salvo;
- [ ] sair com mudanças pendentes apresenta aviso.
