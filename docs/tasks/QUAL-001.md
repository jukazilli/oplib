# QUAL-001 — Acessibilidade e responsividade do MVP

- [x] Auditar Início, Publicações e Áreas no Preview com axe WCAG 2.0/2.1 A/AA.
- [x] Corrigir overflow do acervo em 320 px e preservar nome acessível da pesquisa compacta.
- [x] Corrigir semântica e anúncio do loading do acervo.
- [x] Automatizar o gate público no workflow E2E com bypass protegido do Vercel.
- [x] Confirmar no Preview tablet, desktop, skip link por teclado e preferência por movimento reduzido com o E2E ampliado.
- [x] Repetir leitura em 320 px com publicação real, comentários e conteúdo editorial representativo.
- [ ] Repetir acervo com massa suficiente para paginação e combinações representativas de cards/filtros.
- [ ] Auditar administração autenticada, incluindo editor, taxonomia e moderação.
- [ ] Executar validação humana com zoom de 200%, navegação completa por teclado, leitor de tela e inspeção visual de movimento reduzido.
- [ ] Registrar aceite humano final antes de mover para `done`.

## Evidência atual

O workflow `E2E Preview` `35858970051` executou 12 testes no commit `c4b71d5`, todos aprovados na primeira passagem. Além das três rotas públicas em 320, 768 e 1440 px, axe, skip link e movimento reduzido, a execução cobre uma leitura real em 320 px com comentários, canonical, ausência segura de capa e sem overflow. Paginação representativa, administração e validação humana permanecem no ledger.
