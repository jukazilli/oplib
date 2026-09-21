# EVID-WEB-004-01 — Página pública de leitura

- **Estado:** evidência parcial; Preview pendente.

## Provas locais

- `getPublicPublicationBySlug` consulta slug e `status = published` juntos; demais estados não retornam registro público.
- A página renderiza área, tipo, título, resumo, autor, datas, tempo de leitura determinístico, capa opcional, Markdown, referências, categoria e tags.
- Ausência pública usa `notFound()` e a resposta genérica “Esta publicação não está disponível.”.
- Markdown mantém sanitização compartilhada; links externos usam nova aba com `noopener noreferrer`; tabelas e blocos de código possuem rolagem horizontal.
- Controles pertencentes a WEB-005, LIKE-001 e COM-001 não foram simulados.
- `pnpm test`: 26 arquivos e 111 testes aprovados.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` e `git diff --check`: aprovados.
- Build contém a rota dinâmica `/publicacoes/[slug]`.

## Pendências

- O deploy explícito de Preview falhou antes do upload com `fetch failed` ao consultar Vercel/npm; a branch remota pode acionar a integração Git, mas esse estado não foi contado como evidência.
- Consultar uma publicação real na branch Neon `preview`.
- Confirmar que rascunho, retirada e slug inexistente têm resposta indistinguível.
- Executar axe e inspeção em celular, tablet, desktop e zoom de 200%.
- Registrar capa presente/ausente, tabela larga, código e links externos.
