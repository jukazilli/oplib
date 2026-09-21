# EVID-PUB-005-01 — Retirada e republicação

- **Estado:** evidência parcial; validação no Preview pendente.

## Provas locais

- `transitionPublicationStatus` condiciona a mudança à versão e ao estado esperados.
- Retirada grava `status = withdrawn`, `withdrawnAt` e auditoria `publication.withdraw` na mesma transação.
- Republicação restaura `status = published`, limpa `withdrawnAt`, preserva conteúdo/slug/data original e grava auditoria `publication.republish` na mesma transação.
- Conflito ou falha não invalida cache; sucesso invalida administração, início, acervo e slug.
- A lista administrativa oferece `Retirar do ar` apenas para publicadas e `Republicar` apenas para retiradas; a retirada exige confirmação com título e consequência.
- `pnpm test`: 24 arquivos e 106 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e `git diff --check`: aprovados.
- Busca de mojibake nos arquivos alterados: nenhuma ocorrência.

## Pendências de aceite

- Confirmar retirada e republicação na branch Neon `preview`, incluindo eventos de auditoria e rollback de falha.
- Confirmar que WEB-001/004 e sitemap, quando implementados, não servem publicação retirada.
- Executar inspeção autenticada responsiva no Preview e registrar aceite humano.
