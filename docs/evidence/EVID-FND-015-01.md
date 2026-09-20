# EVID-FND-015-01 — Backup e restauração

## Estado

Não implementada no corte atual. A FND-015 foi congelada por decisão explícita em `OPS-002` e permanece `planned`.

## Trabalho preservado

- PR draft: `https://github.com/jukazilli/oplib/pull/15`;
- automação de backup criptografado, retenção e restore preparada, mas não integrada;
- nenhum bucket privado, chave `age`, backup ou restore real foi criado;
- nenhuma configuração de Production foi alterada.

## Risco aceito

Desenvolvimento e Preview usam somente dados sintéticos, reconstruíveis ou preservados também fora da aplicação. Não existe RPO de 24 horas nem RTO de 4 horas comprovado durante a exceção.

## Retomada obrigatória

A FND-015 deve ser retomada antes de Production ou antes de conteúdo real insubstituível. O corte futuro poderá manter Vercel Blob ou aprovar outra estratégia, incluindo a avaliação já identificada de Cloudflare R2 e Backblaze B2.
