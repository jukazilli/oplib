# QUAL-001 — Acessibilidade e responsividade do MVP

- [x] Auditar Início, Publicações e Áreas no Preview com axe WCAG 2.0/2.1 A/AA.
- [x] Corrigir overflow do acervo em 320 px e preservar nome acessível da pesquisa compacta.
- [x] Corrigir semântica e anúncio do loading do acervo.
- [x] Automatizar o gate público no workflow E2E com bypass protegido do Vercel.
- [x] Confirmar no Preview tablet, desktop, skip link por teclado e preferência por movimento reduzido com o E2E ampliado.
- [ ] Repetir com publicações, paginação, comentários e conteúdo editorial representativo.
- [ ] Auditar administração autenticada, incluindo editor, taxonomia e moderação.
- [ ] Executar validação humana com zoom de 200%, navegação completa por teclado, leitor de tela e inspeção visual de movimento reduzido.
- [ ] Registrar aceite humano final antes de mover para `done`.

## Evidência atual

O workflow `E2E Preview` `35732127987` executou nove testes no commit `2f545d9`, todos aprovados na primeira passagem. A evidência cobre as rotas públicas sem conteúdo representativo em 320, 768 e 1440 px, axe, skip link e preferência de movimento reduzido; não substitui os cenários finais preservados no ledger.
