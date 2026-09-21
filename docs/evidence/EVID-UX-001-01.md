# EVID-UX-001-01 — Estados e recuperação

## Prova parcial: leitura pública

- `src/app/(public)/publicacoes/[slug]/page.tsx` usa resultados independentes para curtidas e comentários.
- Se uma ou ambas as consultas falham, título, resumo, Markdown, referências e compartilhamento continuam legíveis.
- A área afetada explica a indisponibilidade e a tentativa por recarga; não apresenta zero inventado nem ação de comentário sem lista confiável.
- Log de degradação contém somente código estável e correlation ID, não erro bruto, cookie ou texto de comentário.
- `tests/unit/public-publication-page.test.tsx` injeta falhas individuais e simultâneas.
- `pnpm test`: 46 arquivos, 180 testes aprovados.
- `pnpm lint`, `pnpm typecheck` e `pnpm build`: aprovados.

UX-001 permanece aberto para matriz completa de estados, edição com alterações pendentes, foco e validação humana no Preview.
