# EVID-WEB-003-01 — Acervo, pesquisa, filtros e paginação

- **Estado:** evidência parcial; Preview pendente.

## Provas locais

- Contrato de URL normaliza termo, área, tipo, categoria, tag, ano, ordem, visualização e página; parâmetros inválidos voltam a padrões seguros.
- Consulta sempre exige `status = published`, pesquisa título/resumo/Markdown e aplica filtros por slugs reais com `exists`.
- Ordem usa `publishedAt` e ID como desempate; página possui nove resultados e nunca ultrapassa a última página válida.
- Áreas, categoria e tags são agregadas na própria consulta paginada, evitando N+1.
- Feed e Grade usam a mesma fonte, preservam parâmetros e abrem a URL canônica.
- Estados distinguem acervo vazio, pesquisa sem resultado, carregamento e erro recuperável.
- `pnpm test`: 28 arquivos e 116 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e rota `/publicacoes`: aprovados após a otimização.

## Pendências

- O Preview de `b50acad` passou no axe WCAG A/AA, mas revelou overflow horizontal em `/publicacoes`: viewport 320 px, documento 338 px. A correção limita o grid e seus controles à coluna disponível; falta repetir a medição no Preview corrigido.
- Executar consulta real na branch Neon `preview`, combinações de filtros e `EXPLAIN` representativo.
- Confirmar retirada desaparecendo imediatamente da lista e da pesquisa.
- Validar URL, voltar/avançar, Feed/Grade, paginação, axe e breakpoints no Preview.
- Registrar screenshots e aceite humano.
