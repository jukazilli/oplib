# EVID-QUAL-001-01 — Acessibilidade e responsividade do MVP

- **Estado:** evidência parcial; superfícies públicas sem publicação auditadas no Preview.

## Provas no Preview

- Workflow `E2E Preview` da PR #38, execução `35730558797`, no commit `91c863f`: Início, Publicações e Áreas responderam com sucesso em Chromium a 320 × 700 e `scrollWidth` não excedeu a viewport. A primeira passagem do axe capturou o loading de `/publicacoes` e encontrou `aria-label` proibido em `div`; o retry passou após o conteúdo substituir o fallback. O resultado foi classificado como flaky, não como aprovação limpa.
- O loading foi corrigido para `role="status"`, anúncio `aria-live="polite"` e placeholders decorativos ocultos da árvore. Nova execução de Preview sem retry é necessária.
- Workflow `E2E Preview` `35731044752`, commit `8af10e1`: seis testes passaram na primeira execução, sem retry ou flaky. As três rotas públicas disponíveis responderam, não excederam 320 px e não apresentaram violações axe WCAG 2.0/2.1 A ou AA. A semântica do fallback corrigido é coberta separadamente por teste unitário.
- PR #37, commit `b50acad`: axe-core 4.13 executado com WCAG 2 A/AA e 2.1 A/AA em `/`, `/publicacoes` e `/areas`; nenhuma violação foi encontrada no estado disponível sem publicações.
- `/` e `/areas` não apresentaram largura horizontal excedente em viewport de 320 px.
- `/publicacoes` apresentou regressão reproduzível: viewport de 320 px e documento de 338 px. A causa foi o tamanho mínimo intrínseco dos controles no grid de filtros; a correção aplica coluna `minmax(0, 1fr)` e controles `min-w-0`/`w-full`.
- Na repetição local da correção em 320 px, a largura foi normalizada para 320 px. Axe encontrou o link iconográfico de pesquisa sem nome quando seu texto fica oculto; o cabeçalho passou a manter `aria-label="Pesquisar"` em todos os breakpoints e ganhou teste unitário. Após o ajuste, a nova execução local retornou zero violações WCAG A/AA.

## Limites da evidência

- Axe automatizado não substitui teclado, leitor de tela, contraste visual, zoom de 200% nem avaliação humana.
- O ambiente não tinha publicação no ar; página de leitura, cards, paginação e conteúdo editorial ainda precisam ser auditados com dados representativos.
- Administração autenticada, comentários e moderação permanecem pendentes.
- `/sobre` e `/privacidade` ainda geram `404` de prefetch e pertencem a WEB-006/DEC-002.

## Próxima comprovação

- Cobrir tablet, desktop, zoom de 200%, movimento reduzido, teclado e leitor de tela nas jornadas completas.
- Repetir axe e overflow com publicação, paginação, comentários e administração autenticada.
