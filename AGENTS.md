<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Governança de UX do OPALIB

Antes de implementar qualquer tela, formulário ou interação nova:

1. consultar `docs/Principios_de_UX_UI.md`, `docs/04_Direcao_de_UI_e_Design_System.md` e `docs/05_Especificacao_de_UX_e_Fluxos.md`;
2. localizar o contrato de interação aplicável no backlog e na documentação;
3. não escolher um controle apenas por convenção ou preferência do agente;
4. se houver ambiguidade sobre campo, seleção, criação inline, confirmação, recuperação, responsividade ou acessibilidade, registrar a lacuna e interromper somente esse slice de UI até a decisão ser aprovada;
5. implementar apenas depois de definidos dados, controle, estados, validação, ações, teclado, celular e recuperação.

Em fluxos editoriais, `UX-002` é pré-requisito de entrada para qualquer formulário de criação de publicação.
