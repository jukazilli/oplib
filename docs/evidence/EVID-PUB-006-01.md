# EVID-PUB-006-01 — Destaque editorial

- **Estado:** evidência parcial; Preview pendente.

## Provas locais

- `setPublicationFeatured` exige status `published` e versão atual na mesma atualização.
- Alteração e auditoria `publication.feature` confirmam na mesma transação.
- A ação autenticada invalida administração e home somente após sucesso; conflito não invalida cache.
- Lista administrativa oferece `Destacar` ou `Remover destaque` somente para publicação pública e identifica o estado atual.
- `listFeaturedPublications` exige `published` e `featured`, limita quatro itens e ordena por `publishedAt DESC, id DESC`; o primeiro é deterministicamente o principal.
- `pnpm test`: 28 arquivos e 120 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e `git diff --check`: aprovados.

## Pendências

- Confirmar ativação/remoção e evento de auditoria na branch Neon `preview`.
- Confirmar conflito otimista e inelegibilidade de rascunho/retirada.
- Confirmar principal e demais destaques na home após WEB-002.
- Verificar invalidação da home e feedback responsivo no Preview.
