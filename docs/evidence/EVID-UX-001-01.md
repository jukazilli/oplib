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

## Prova incremental: conflito entre cópia local e servidor

- `tests/unit/draft-composer.test.tsx` cobre agora as duas escolhas quando uma cópia local tem versão-base anterior à versão carregada do servidor.
- Antes da escolha, o editor mantém os campos do servidor e apresenta as opções; `Manter versão salva` descarta a cópia local, enquanto `Recuperar minha cópia` só aplica seu conteúdo após ação explícita.
- Teste isolado do componente: 12 testes aprovados. Suíte completa repetida sem build concorrente: 46 arquivos, 182 testes aprovados; lint, typecheck e build aprovados. A confirmação de saída, queda de rede, foco e recuperação em navegador/Preview continuam pendentes; esta prova não fecha UX-001.
