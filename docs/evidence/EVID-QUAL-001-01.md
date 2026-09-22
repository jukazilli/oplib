# EVID-QUAL-001-01 — Acessibilidade e responsividade do MVP

- **Estado:** evidência parcial; superfícies públicas sem publicação auditadas no Preview.

## Provas no Preview

- PR #37, commit `b50acad`: axe-core 4.13 executado com WCAG 2 A/AA e 2.1 A/AA em `/`, `/publicacoes` e `/areas`; nenhuma violação foi encontrada no estado disponível sem publicações.
- `/` e `/areas` não apresentaram largura horizontal excedente em viewport de 320 px.
- `/publicacoes` apresentou regressão reproduzível: viewport de 320 px e documento de 338 px. A causa foi o tamanho mínimo intrínseco dos controles no grid de filtros; a correção aplica coluna `minmax(0, 1fr)` e controles `min-w-0`/`w-full`.

## Limites da evidência

- Axe automatizado não substitui teclado, leitor de tela, contraste visual, zoom de 200% nem avaliação humana.
- O ambiente não tinha publicação no ar; página de leitura, cards, paginação e conteúdo editorial ainda precisam ser auditados com dados representativos.
- Administração autenticada, comentários e moderação permanecem pendentes.
- `/sobre` e `/privacidade` ainda geram `404` de prefetch e pertencem a WEB-006/DEC-002.

## Próxima comprovação

- Repetir `/publicacoes` em 320 px no Preview da correção e confirmar `scrollWidth === innerWidth`.
- Repetir axe no mesmo artefato; depois cobrir tablet, desktop, zoom, movimento reduzido, teclado e leitor de tela nas jornadas completas.
