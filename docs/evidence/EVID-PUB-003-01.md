# EVID-PUB-003-01 — Metadados, referências e endereço permanente

- **Estado:** técnico concluído; aceite visual do Preview pendente
- **Rota:** `/admin/publicacoes`

## Entrega comprovada

- rascunho persiste resumo, tipo, áreas, categoria, tags, curso, disciplina e data original;
- slug é normalizado sem acentos e alocado sob bloqueio transacional por endereço-base;
- slug salvo não acompanha automaticamente futuras alterações do título;
- referências bibliográficas e links relacionados são validados, ordenados e substituídos atomicamente;
- o composer inicial continua leve e revela detalhes somente pela ação contextual;
- a prévia representa resumo, tipo, dados acadêmicos e referências;
- cópia local e resolução de conflito incluem todos os novos campos.

## Validações automatizadas

- `TEST-PUB-003-01`: validações de metadados e links;
- `TEST-PUB-003-02`: normalização e alocação concorrente de slug;
- `TEST-PUB-003-03`: referências ordenadas e integração do composer.
- `pnpm test` — 21 arquivos e 81 testes aprovados;
- `pnpm lint` — aprovado;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado.

## Aceite visual pendente

- [ ] controles contextuais não tornam a composição densa;
- [ ] detalhes continuam operáveis no celular;
- [ ] prévia apresenta a hierarquia correta;
- [ ] referências podem ser adicionadas, removidas e reordenadas com clareza.
