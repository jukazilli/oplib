# EVID-QUAL-002-01 — Desempenho e degradação segura

Estado: `in_progress`.

## Degradação comprovada localmente

- Falha isolada ou simultânea das consultas de curtidas e comentários não derruba a página de leitura.
- O artigo permanece legível; nenhuma contagem ou lista falsa é apresentada.
- `tests/unit/public-publication-page.test.tsx` cobre os três cenários com falha injetada.
- `pnpm test`: 46 arquivos, 180 testes; lint, typecheck e build aprovados no commit `438962f`.

## Ainda não comprovado

- Falha real de Blob/imagem, medições Core Web Vitals, análise de bundle e plano de consulta crítico.
- Medições e comportamento em Preview/navegador, sob condições de rede e dispositivo representativas.
