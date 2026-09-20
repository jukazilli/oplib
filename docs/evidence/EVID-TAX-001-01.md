# EVID-TAX-001-01 — Áreas de conhecimento

## Resultado atual

**Estado:** aprovado.

## Implementação comprovada

- três áreas canônicas com UUIDs e slugs estáveis;
- seed transacional e idempotente por slug;
- linhas inalteradas não recebem novo `updated_at`;
- unicidade de nome normalizado e slug preservada pelo schema;
- associação N:N entre publicações e áreas já protegida por chave primária composta;
- nenhuma decisão sobre o controle visual do campo Área foi antecipada.

## Validação no Preview

- **Data:** 20/09/2026.
- Primeira execução: `3` áreas canônicas verificadas; `3` registros alterados.
- Segunda execução: `3` áreas canônicas verificadas; `0` registros alterados, comprovando idempotência.
- Drill transacional: uma publicação sintética foi associada a duas áreas; a repetição foi rejeitada pela constraint com código PostgreSQL `23505`.
- Limpeza: a transação do drill foi revertida e não deixou publicação sintética no Preview.

## Suíte local

- `46` testes aprovados em `11` arquivos;
- typecheck, lint e build aprovados;
- `29` arquivos de governança validados.

## Checks finais

- Vercel Preview: aprovado na PR #20.
- Vercel Preview Comments: aprovado na PR #20.
- Corte reconciliado no backlog e na matriz operacional como `done`.
