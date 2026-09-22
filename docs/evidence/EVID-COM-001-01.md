# EVID-COM-001-01 — Comentários públicos

## Implementação

- `src/modules/interactions/comments/`: contrato, normalização, leitura visível, escrita transacional e limite local.
- `src/app/api/publications/[slug]/comments/route.ts`: validação, proteção e resposta sem cache.
- `src/components/editorial/comments-section.tsx`: aviso, formulário, feedback e lista de texto simples.
- Comentário só aparece após retorno do registro persistido; conteúdo não passa por Markdown nem `dangerouslySetInnerHTML`.

## Evidência local

- `tests/unit/comments-contract.test.ts`, `comments-rate-limit.test.ts`, `comments-route.test.ts`, `comments-section.test.tsx` e `public-publication-page.test.tsx`.
- `pnpm test`: 41 arquivos e 164 testes aprovados.
- `pnpm lint`, `pnpm typecheck` e `pnpm build`: aprovados; rota dinâmica de comentários compilada.

## Pendente para Preview/final

- Banco real: nome/anônimo, ordem, persistência, oculto ausente e publicação retirada recusada.
- WAF e concorrência: tráfego repetitivo entre instâncias e novo navegador; observar 429 sem conteúdo em logs.
- Navegador: teclado, foco, celular, zoom, leitor de tela, estados, falha de rede e payload literal.
- Moderação e recuperação serão comprovadas nos slices MOD-001–003.
