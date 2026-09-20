# EVID-FND-011-01 — E2E e smoke do Preview

- **Item:** FND-011
- **Data:** 20 de setembro de 2026
- **Pull request:** https://github.com/jukazilli/oplib/pull/11
- **Commit funcional:** `239cb6c`

## Implementação

- Playwright executa em Chromium contra a URL de Preview informada ao workflow.
- O bypass oficial de automação atravessa a proteção Vercel sem tornar o Preview público.
- O segredo `VERCEL_AUTOMATION_BYPASS_SECRET` permanece somente no GitHub Actions.
- Screenshots, relatório e trace são produzidos apenas em falha.
- A suíte não usa Docker, banco local ou identidade autenticada automatizada.

## TEST-FND-011-01 — smoke do Preview

A execução `35519513621` aprovou três cenários em 46 segundos:

- home pública disponível e com heading editorial esperado;
- visitante anônimo redirecionado de `/admin` para `/sign-in`;
- tela de acesso administrativo renderizada após o redirecionamento.

Execução: https://github.com/jukazilli/oplib/actions/runs/35519513621

## TEST-FND-011-02 — axe básico

A página pública não apresentou violações de impacto crítico no axe-core durante a mesma execução.

## Correção de ambiente

O primeiro ensaio detectou `500` porque as variáveis Clerk estavam limitadas a branches antigas. Os registros válidos foram alterados para todas as branches de Preview. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` foi recriada como `Config/plain`, pois é intencionalmente pública; `CLERK_SECRET_KEY` permaneceu `Sensitive`. Production não foi alterada.
