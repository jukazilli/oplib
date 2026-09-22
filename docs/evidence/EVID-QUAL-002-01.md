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
- A execução [`35767611132`](https://github.com/jukazilli/oplib/actions/runs/35767611132), commit `0f7b858`, aprovou os nove testes E2E e as nove medições. O artefato contém exatamente nove JSON saneados e o resumo; a inspeção não encontrou `extraHeaders`, `x-vercel-protection-bypass` ou `x-vercel-set-bypass-cookie`.
- Linha de base móvel inicial: Início 91, Áreas 86 e Publicações 86; FCP entre 1,86 e 1,93 s; LCP entre 3,09 e 3,80 s; TBT entre 78 e 112 ms; CLS 0; transferência entre 341,6 e 380,8 KiB.
- O JavaScript transferido ficou entre 208,3 e 214,2 KiB, com mediana de aproximadamente 63 KiB indicada como não usada. LCP acima da referência de 2,5 s e JavaScript não usado entram na investigação; ainda não são conclusão com o acervo vazio.
- O primeiro run `35766834296` tornou visível uma falha no empacotamento da evidência: relatórios duplicados eram contados e o diretório oculto não era anexado. O commit `0f7b858` deduplicou por URL/instante e passou a publicar uma cópia saneada em diretório próprio antes da prova aceita.

## Ainda não comprovado

- Falha real de Blob/imagem, medições com conteúdo representativo, análise conclusiva de bundle e plano de consulta crítico.
- Medições e comportamento em Preview/navegador, sob condições de rede e dispositivo representativas.
