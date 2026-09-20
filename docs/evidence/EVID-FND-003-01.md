# EVID-FND-003-01 — Baseline de UI e qualidade

- **Item:** FND-003
- **Data:** 20 de setembro de 2026
- **Branch:** `feat/fnd-003-ui-quality-baseline`

## Implementação

- Tailwind CSS 4 com PostCSS;
- tokens semânticos da direção “Opala Lunar Editorial”;
- Newsreader e Manrope por `next/font`;
- shadcn/ui inicializado com Radix e componente `Button` seletivo;
- ESLint flat config e Prettier com plugin Tailwind;
- Vitest e Testing Library;
- Playwright e axe-core;
- layout responsivo, tema claro, foco visível e redução de movimento.

## TEST-FND-003-01 — componente e qualidade

- `pnpm lint`: aprovado sem warnings;
- `pnpm typecheck`: aprovado;
- `pnpm test`: 1 arquivo e 1 teste aprovados;
- `pnpm build`: aprovado;
- `pnpm format:check`: aprovado;
- componente `Button` possui variantes principal e secundária, foco e estado desabilitado.

## TEST-FND-003-02 — acessibilidade e responsividade

- `pnpm test:e2e`: Chromium aprovado;
- axe-core: nenhuma violação automática na página-base;
- navegação sem interação desnecessária e estrutura semântica preservada;
- viewport desktop e compacto inspecionados;
- zoom do navegador exercitado sem perda da estrutura ou do conteúdo.

## Evidências visuais

- [Desktop](assets/EVID-FND-003-home-desktop.png)
- [Compacto](assets/EVID-FND-003-home-mobile.png)

## Decisão operacional associada

`docs/decisions/OPS-001-preview-first.md` registra que o projeto não usará Docker nem PostgreSQL local. A validação integrada ocorrerá em Preview Vercel com Neon não produtivo quando FND-005 a FND-011 estiverem configurados.
