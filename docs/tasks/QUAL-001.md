# QUAL-001 — Acessibilidade e responsividade do MVP

- [x] Auditar Início, Publicações e Áreas no Preview com axe WCAG 2.0/2.1 A/AA.
- [x] Corrigir overflow do acervo em 320 px e preservar nome acessível da pesquisa compacta.
- [x] Corrigir semântica e anúncio do loading do acervo.
- [x] Automatizar o gate público no workflow E2E com bypass protegido do Vercel.
- [ ] Confirmar no Preview tablet, desktop, skip link por teclado e preferência por movimento reduzido com o E2E ampliado.
- [ ] Repetir com publicações, paginação, comentários e conteúdo editorial representativo.
- [ ] Auditar administração autenticada, incluindo editor, taxonomia e moderação.
- [ ] Executar tablet, desktop, zoom de 200%, movimento reduzido, teclado e leitor de tela.
- [ ] Registrar aceite humano final antes de mover para `done`.

## Evidência atual

O workflow `E2E Preview` `35731044752` executou seis testes no commit `8af10e1`, todos aprovados na primeira passagem. A evidência cobre somente as rotas públicas e o estado de dados disponível naquele Preview; não substitui os cenários finais preservados no ledger.
