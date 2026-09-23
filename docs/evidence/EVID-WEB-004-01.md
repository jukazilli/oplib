# EVID-WEB-004-01 — Página pública de leitura

- **Estado:** evidência parcial; leitura real em 320 px aprovada no Preview.

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

- Confirmar que rascunho, retirada e slug inexistente têm resposta indistinguível.
- Inspecionar tablet, desktop e zoom de 200%.
- Registrar capa presente, tabela larga, código e links externos.
- Obter aceite visual humano antes de mover para `done`.

## Prova integrada no Preview

- O run inicial `35780570104` encontrou overflow horizontal reproduzível na publicação real em 320 px e foi rejeitado.
- O commit `c4b71d5` corrigiu encolhimento e quebra de conteúdo no artigo, Markdown, referências e formulário de comentários.
- O run [`35858970051`](https://github.com/jukazilli/oplib/actions/runs/35858970051) aprovou os 12 testes E2E em 17,9 s, sem retry. A leitura real respondeu com sucesso, exibiu artigo, título, comentários e canonical, não dependeu de capa, não excedeu 320 px e não apresentou violações axe WCAG A/AA.
