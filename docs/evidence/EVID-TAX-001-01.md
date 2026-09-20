# EVID-TAX-001-01 — Áreas de conhecimento

## Resultado atual

**Estado:** implementação local concluída; Preview pendente.

## Implementação comprovada

- três áreas canônicas com UUIDs e slugs estáveis;
- seed transacional e idempotente por slug;
- linhas inalteradas não recebem novo `updated_at`;
- unicidade de nome normalizado e slug preservada pelo schema;
- associação N:N entre publicações e áreas já protegida por chave primária composta;
- nenhuma decisão sobre o controle visual do campo Área foi antecipada.

## Pendências

- executar seed duas vezes no banco de Preview;
- comprovar os três registros sem duplicidade;
- comprovar associação múltipla e repetição rejeitada;
- registrar checks finais e aceite.
