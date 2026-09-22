# EVID-SEO-001-01 — Metadados, canonical e prévia social

## Entrega

- Metadata global com origem, template de título, descrição e canonical da home.
- Metadata dinâmica de publicação com canonical permanente, Open Graph e Twitter Card.
- Capa real preserva texto alternativo e dimensões conhecidas.
- Fallback institucional gerado em 1200 × 630 quando a publicação não possui capa.
- Slug não público não recebe canonical e retorna `noindex`.
- Development, Preview e Production sem `NEXT_PUBLIC_SITE_URL` explícita permanecem `noindex`.

## Evidência local

- `pnpm test`: 29 arquivos e 128 testes aprovados.
- `pnpm lint`: aprovado sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado; `/opengraph-image` gerada como rota estática.
- `tests/unit/public-publication-page.test.tsx`: canonical, fallback, capa e indisponibilidade cobertos.
- `tests/unit/seo-metadata.test.ts`: política de indexação por ambiente coberta.

## Validação preservada para o Preview/final

- Inspecionar o HTML entregue a crawler limitado e confirmar metadata no `head`.
- Validar visualmente fallback e capa em ferramenta de prévia social.
- Confirmar que a URL de Preview não é usada como canonical.
- Definir/confirmar a origem definitiva de Production antes da indexação pública.
