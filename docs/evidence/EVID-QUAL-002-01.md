# EVID-QUAL-002-01 — Desempenho e degradação segura

Estado: `in-progress`.

## Degradação comprovada localmente

- Falha isolada ou simultânea das consultas de curtidas e comentários não derruba a página de leitura.
- O artigo permanece legível; nenhuma contagem ou lista falsa é apresentada.
- `tests/unit/public-publication-page.test.tsx` cobre os três cenários com falha injetada.
- `pnpm test`: 46 arquivos, 180 testes; lint, typecheck e build aprovados no commit `438962f`.

## Medição automatizada preparada

- O workflow manual `E2E Preview` mede Início, Publicações e Áreas depois do smoke funcional, usando três execuções Lighthouse por rota no perfil móvel.
- FCP, LCP, TBT, CLS, Speed Index, transferência e nota de performance recebem uma mediana por rota no resumo do job.
- A linha de base começa informativa: os limites de referência geram avisos até serem confrontados com conteúdo editorial representativo, evitando transformar ruído sintético em gate arbitrário.
- Os relatórios JSON são saneados antes do upload para remover os headers usados no acesso ao Preview protegido. Relatórios HTML não são enviados ao artefato.
- A execução [`35767611132`](https://github.com/jukazilli/oplib/actions/runs/35767611132), commit `0f7b858`, aprovou os nove testes E2E e as nove medições. O artefato contém exatamente nove JSON saneados e o resumo; a inspeção não encontrou `extraHeaders`, `x-vercel-protection-bypass` ou `x-vercel-set-bypass-cookie`.
- Linha de base móvel inicial: Início 91, Áreas 86 e Publicações 86; FCP entre 1,86 e 1,93 s; LCP entre 3,09 e 3,80 s; TBT entre 78 e 112 ms; CLS 0; transferência entre 341,6 e 380,8 KiB.
- O JavaScript transferido ficou entre 208,3 e 214,2 KiB, com mediana de aproximadamente 63 KiB indicada como não usada. LCP acima da referência de 2,5 s e JavaScript não usado entram na investigação; ainda não são conclusão com o acervo vazio.
- O primeiro run `35766834296` tornou visível uma falha no empacotamento da evidência: relatórios duplicados eram contados e o diretório oculto não era anexado. O commit `0f7b858` deduplicou por URL/instante e passou a publicar uma cópia saneada em diretório próprio antes da prova aceita.
- A primeira hipótese de bundle foi tratada sem mudar o contrato de autenticação: `ClerkProvider`, antes global, passou a envolver apenas `/sign-in` e `/admin`, as únicas superfícies com componentes cliente do Clerk. A composição segue a orientação oficial de montar o provedor mais abaixo quando a identidade é necessária só em rotas específicas.
- Antes/depois deve ser repetido no Preview. Além das três rotas públicas, o smoke precisa confirmar entrada, perfil e logout para impedir que a redução de JavaScript público introduza regressão autenticada.

## Redução do JavaScript público

- A execução [`35769022761`](https://github.com/jukazilli/oplib/actions/runs/35769022761), commit `e70e9dd`, aprovou novamente os nove testes E2E, incluindo redirecionamento administrativo e renderização de `/sign-in`, e produziu nove relatórios saneados sem marcadores dos headers protegidos.
- Início: performance 91 → 95; LCP 3,09 → 2,72 s; transferência 341,6 → 271,2 KiB; JavaScript 214,1 → 163,4 KiB; JavaScript não usado 62,8 → 27,5 KiB.
- Áreas: performance 86 → 89; LCP 3,80 → 3,45 s; transferência 380,8 → 271,5 KiB; JavaScript 208,3 → 156,9 KiB; JavaScript não usado 63,1 → 27,6 KiB.
- Publicações: performance 86 → 90; LCP 3,79 → 3,45 s; transferência 342,8 → 272,3 KiB; JavaScript 214,2 → 163,3 KiB; JavaScript não usado 62,7 → 27,2 KiB.
- A melhora consistente confirma a hipótese do provedor global. O LCP ainda supera 2,5 s e deve ser investigado com conteúdo representativo; os números sintéticos não encerram QUAL-002 nem substituem perfil/logout autenticados no aceite final.

## Shell público antes dos dados

- Nos nove relatórios do run `35769022761`, o LCP foi texto estático: o `h1` na Home e em Publicações e o parágrafo introdutório em Áreas. Não houve imagem LCP nem falha de `font-display`; o único CSS bloqueante tinha cerca de 10 KiB e economia estimada nula.
- Áreas e Publicações aguardavam suas consultas antes de devolver qualquer parte da página, embora título e introdução não dependessem dos dados. O shell dessas duas rotas passou a ser síncrono; lista de áreas e pesquisa/taxonomia são transmitidas depois por `Suspense`.
- Os fallbacks anunciam uma única espera por rota e mantêm os placeholders fora da árvore acessível. Estados vazio, sucesso e erro continuam sob os mesmos componentes e boundaries.
- Prova local: dois arquivos direcionados, sete testes; suíte completa com 57 arquivos e 228 testes; lint, typecheck e build aprovados. Pendente: medir o novo Preview e confirmar redução do atraso de renderização sem regressão de streaming.
- O run [`35770571883`](https://github.com/jukazilli/oplib/actions/runs/35770571883) confirmou LCP de 2,58 s e nota 95 em Áreas, contra 3,45 s e 89 antes. Publicações caiu de 3,45 para 2,65 s, mas os três relatórios registraram CLS 0,152 causado pelo rodapé deslocado quando o fallback de 192 px foi substituído pelo formulário e estado vazio.
- Como desempenho não pode ser comprado com instabilidade visual, esse estado foi rejeitado. O fallback de Publicações agora replica a grade dos filtros, barra de resultados e reserva de conteúdo; a próxima execução deve demonstrar CLS ≤ 0,1 mantendo a redução do LCP.
- A execução aceita [`35772383744`](https://github.com/jukazilli/oplib/actions/runs/35772383744), commit `745b429`, aprovou novamente os nove testes E2E. As nove medições tiveram CLS 0; Publicações atingiu nota 94, LCP 2,75 s e `elementRenderDelay` mediano de 558 ms.
- Na mesma execução, Início atingiu 96/LCP 2,43 s e Áreas 95/LCP 2,58 s. A reserva estrutural eliminou o deslocamento sem desfazer o ganho do streaming. Os relatórios permaneceram saneados e o artefato temporário contém nove JSON mais o resumo.

## Plano da consulta crítica

- `scripts/analyze-public-search.mjs` abre transação PostgreSQL `READ ONLY`, deriva filtros somente de uma publicação existente e executa `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` para a contagem e a página ordenada equivalentes ao acervo público.
- A saída omite título, termo, slugs, IDs, URL e plano textual; registra apenas quantidade saneada, presença de cada filtro, tempos, buffers, linhas e tipos de nós.
- A primeira execução conectou com sucesso e encontrou cinco posts, todos rascunhos. O resultado `insufficient-data` é a prova correta neste estado: sem publicação não existe consulta pública representativa para aceitar ou orientar índice.
- Após a primeira publicação real, a execução saneada encontrou 6 posts e 1 publicado. Com termo, tipo, ano, área, categoria e tag derivados internamente, a contagem planejou/executou em 0,578/2,141 ms e a página em 0,673/0,160 ms, usando `Bitmap Index Scan`/`Index Scan`; não apareceu `Seq Scan` nem regressão evidente no conjunto atual.
- A medição é uma baseline pequena, não justificativa para criar índice adicional. Deve ser repetida quando o volume editorial crescer e confrontada com telemetria de campo.

## Conteúdo representativo no Preview

- A primeira execução com publicação real, run `35780570104`, revelou overflow horizontal reproduzível na leitura em 320 px. O estado foi rejeitado; o teste permaneceu como regressão.
- O commit `c4b71d5` permite que título, Markdown e referências quebrem tokens longos, garante que os contêineres editoriais possam encolher e remove a largura intrínseca dos campos de comentário.
- O run [`35858970051`](https://github.com/jukazilli/oplib/actions/runs/35858970051) aprovou os 12 testes E2E em 17,9 s, sem retry: a publicação real abriu em 320 px, sem overflow, com artigo, comentários e canonical presentes, nenhuma imagem opcional e nenhuma violação axe WCAG 2.0/2.1 A ou AA.
- A mesma execução completou nove medições Lighthouse móveis. Início/Áreas/Publicações obtiveram performance 96/96/95, LCP 2,572/2,321/2,718 s, TBT 48/64/62 ms e CLS 0. A transferência permaneceu entre 273,2 e 273,7 KiB; JavaScript entre 156,9 e 163,9 KiB, com 27,3 a 27,6 KiB apontados como não usados.
- O artefato `10749310268` contém somente nove JSON saneados e o resumo: zero HTML e zero ocorrências de `extraHeaders`, `x-vercel-protection-bypass` ou `x-vercel-set-bypass-cookie`.
- A medição confirma o acervo com conteúdo representativo e mantém estabilidade visual. Ela ainda não mede a página individual no Lighthouse nem substitui dados de campo.

## Ainda não comprovado

- Falha real de Blob/imagem e análise conclusiva de bundle.
- Dados de campo e medição Lighthouse da página individual publicada.
