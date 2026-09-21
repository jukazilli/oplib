# Registro cumulativo de testes do MVP

Este documento preserva tudo o que deverá ser validado na rodada final do MVP. Cada slice acrescenta seus testes sem apagar os anteriores. Evidências automatizadas podem ser executadas durante a implementação; itens marcados como `final` serão repetidos pelo proprietário no aceite consolidado.

## Protocolo

- Registrar por ID do backlog: objetivo, pré-condições, passos, resultado esperado e ambiente.
- Separar `automatizado`, `Preview` e `final/humano`.
- Não remover um teste porque passou numa entrega intermediária.
- Todo defeito encontrado no aceite final volta ao item de origem, sem ampliar o escopo silenciosamente.

## PUB-004 — Publicar e atualizar

- [ ] `Preview/final`: publicar um rascunho completo após confirmação.
- [ ] `Preview/final`: repetir o envio idêntico e confirmar sucesso idempotente.
- [ ] `Preview/final`: alterar a mesma publicação em duas sessões e confirmar conflito somente para conteúdos diferentes.
- [ ] `Preview/final`: atualizar conteúdo público e confirmar que a versão anterior permanece até o commit.
- [ ] `Preview`: comprovar auditoria, rollback transacional e invalidação de cache.
- [ ] `Final`: repetir o fluxo em desktop e celular, incluindo duplo clique e falha recuperável.

## PUB-005 — Retirar e republicar

- [ ] `Preview/final`: cancelar e depois confirmar `Retirar do ar`.
- [ ] `Preview/final`: confirmar estado `Retirada do ar` e disponibilidade da ação `Republicar`.
- [ ] `Preview/final`: republicar e confirmar retorno ao estado `Publicada`.
- [ ] `Preview`: comprovar datas, auditoria, conflito e rollback no banco.
- [ ] `Final`: confirmar ausência em página, listagens, pesquisa e sitemap enquanto retirada.

## WEB-001 — Shell público responsivo

- [ ] `Final`: percorrer cabeçalho e rodapé somente com teclado, com foco visível.
- [ ] `Final`: conferir localização atual e ausência de entrada administrativa na navegação pública.
- [ ] `Final`: verificar compacto, médio, amplo e zoom de 200%, sem corte ou sobreposição.
- [ ] `Automatizado`: executar axe sem violações críticas.

## WEB-004 — Página pública de leitura

- [ ] `Automatizado/Preview`: abrir uma publicação por slug e conferir título, resumo, autoria, datas, taxonomia, Markdown e referências.
- [ ] `Automatizado/Preview`: confirmar que rascunho, retirada e slug inexistente apresentam a mesma indisponibilidade pública.
- [ ] `Final`: ler uma publicação longa em celular, tablet e desktop, sem barra lateral ou elementos competindo com o texto.
- [ ] `Final`: conferir capa presente e ausente, sem espaço vazio indevido.
- [ ] `Final`: testar links externos, tabela larga e bloco de código em tela pequena.
- [ ] `Automatizado`: executar axe e confirmar hierarquia de títulos e regiões.

## WEB-003 — Acervo, pesquisa, filtros e paginação

- [ ] `Automatizado/Preview`: pesquisa vazia lista somente publicações públicas em ordem estável.
- [ ] `Automatizado/Preview`: combinar termo, área, tipo, categoria, tag e ano; conferir total e resultados.
- [ ] `Final`: compartilhar a URL filtrada, atualizar e usar voltar/avançar sem perder estado.
- [ ] `Final`: alternar Feed/Grade e navegar entre páginas sem perder filtros.
- [ ] `Final`: conferir estados sem publicações e sem resultados, incluindo `Limpar filtros`.
- [ ] `Preview`: retirar uma publicação e confirmar ausência imediata do acervo e da pesquisa.
- [ ] `Preview`: medir consulta representativa e registrar plano se houver degradação.
- [ ] `Automatizado`: executar axe e responsividade dos filtros em celular, tablet e desktop.

## PUB-006 — Destaque editorial

- [ ] `Automatizado/Preview`: destacar uma publicação pública e confirmar feedback, auditoria e invalidação da home.
- [ ] `Automatizado/Preview`: remover o destaque e confirmar ausência nas seleções públicas.
- [ ] `Preview`: criar vários destaques e confirmar principal por `publishedAt DESC, id DESC`.
- [ ] `Preview`: confirmar que rascunho e retirada não podem ser alterados nem aparecem como destaque público.
- [ ] `Final`: conferir ações `Destacar` e `Remover destaque` apenas nos estados elegíveis.

## WEB-002 — Página inicial editorial

- [ ] `Automatizado/Preview`: confirmar que principal, demais destaques e recentes contêm somente publicações públicas e ordem determinística.
- [ ] `Preview`: provocar falha isolada em destaques, recentes e áreas; confirmar que as demais seções permanecem utilizáveis.
- [ ] `Final`: conferir promessa, ação `Explorar publicações`, busca e hierarquia da primeira dobra em celular, tablet e desktop.
- [ ] `Final`: conferir capa presente/ausente, títulos acessíveis antes das imagens e ausência de layout de dashboard.
- [ ] `Final`: abrir publicação principal, recente e caminho por área.
- [ ] `Automatizado`: executar axe, estados vazio/loading e zoom de 200%.
- **Evidência:** `docs/evidence/EVID-WEB-002-01.md`; screenshots e axe pendentes no Preview.
