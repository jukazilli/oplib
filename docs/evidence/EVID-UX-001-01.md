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

## Prova incremental: recuperação do comentário público

- Validação vazia e falha recuperável devolvem o foco ao campo `Comentário`, que passa a expor `aria-invalid="true"` e a referenciar a mensagem correspondente.
- Erros são anunciados como `alert`; a confirmação usa `status`, sem depender apenas de cor ou substituir o conteúdo digitado antes da confirmação do servidor.
- Mensagens controladas retornadas pela API continuam visíveis, mas exceções técnicas de rede não são expostas. A falha inesperada usa a mensagem pública aprovada e preserva nome e comentário para retry.
- `tests/unit/comments-section.test.tsx`: quatro testes aprovados, incluindo sucesso confirmado, vazio, falha, preservação, foco e retry bem-sucedido.
- Regressão completa: 53 arquivos e 221 testes, lint, typecheck e build aprovados.
- PR draft #39, commit `e5f4cc5`: Vercel aprovado; workflow `E2E Preview` `35738760614` executou nove testes públicos em Chromium, todos aprovados na primeira passagem em 15,5 segundos, sem retry ou flaky. O Preview não tinha publicação representativa, portanto essa execução prova ausência de regressão pública geral, mas não exercita o formulário de comentário real.

## Prova incremental: conflito entre cópia local e servidor

- `tests/unit/draft-composer.test.tsx` cobre agora as duas escolhas quando uma cópia local tem versão-base anterior à versão carregada do servidor.
- Antes da escolha, o editor mantém os campos do servidor e apresenta as opções; `Manter versão salva` descarta a cópia local, enquanto `Recuperar minha cópia` só aplica seu conteúdo após ação explícita.
- Teste isolado do componente: 12 testes aprovados. Suíte completa repetida sem build concorrente: 46 arquivos, 182 testes aprovados; lint, typecheck e build aprovados. A confirmação de saída, queda de rede, foco e recuperação em navegador/Preview continuam pendentes; esta prova não fecha UX-001.
