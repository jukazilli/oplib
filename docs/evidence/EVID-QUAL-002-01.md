# EVID-QUAL-002-01 — Desempenho e degradação segura

Estado: `in_progress`.

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
- Pendente: observar a primeira execução remota, registrar as medianas, revisar o peso de JavaScript e confirmar que nenhum material protegido aparece no artefato.

## Ainda não comprovado

- Falha real de Blob/imagem, medições com conteúdo representativo, análise conclusiva de bundle e plano de consulta crítico.
- Medições e comportamento em Preview/navegador, sob condições de rede e dispositivo representativas.
