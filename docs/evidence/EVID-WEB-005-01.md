# EVID-WEB-005-01 — Compartilhar publicação

## Entrega

- Ação secundária depois do conteúdo e da taxonomia.
- Web Share API recebe título, resumo e endereço permanente.
- Navegadores sem suporte copiam a URL canônica para o clipboard.
- Cópia confirmada por `Link copiado` em região anunciável.
- Cancelamento nativo é neutro; falha orienta a cópia pela barra do navegador.
- Nenhuma contagem ou capacidade social fora do escopo foi adicionada.

## Evidência local

- `pnpm test`: 30 arquivos e 132 testes aprovados.
- `pnpm lint`: aprovado sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado.
- `tests/unit/share-action.test.tsx`: compartilhamento nativo, clipboard, cancelamento e falha cobertos.
- `tests/unit/public-publication-page.test.tsx`: integração na leitura pública coberta.

## Validação preservada para o Preview/final

- Compartilhar em celular com suporte nativo.
- Copiar em desktop/navegador sem Web Share API.
- Bloquear clipboard e confirmar mensagem recuperável.
- Abrir o link recebido e confirmar publicação e origem canônica de Production.
