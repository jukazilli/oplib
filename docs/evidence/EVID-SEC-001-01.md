# EVID-SEC-001-01 — Regressão de segurança

Estado: `in_progress`.

## Proveniência de mutações públicas

- `src/lib/security/request.ts` centraliza a checagem: `Origin` deve coincidir exatamente com a origem da requisição; `Sec-Fetch-Site`, quando presente, deve ser `same-origin`; sem ambos, um `Referer` presente também deve coincidir. Ausência de todos os sinais permanece aceita para clientes legados.
- As rotas POST de curtida e comentário executam a checagem antes de identificar visitante, limitar ou persistir.
- `tests/unit/security.test.ts`, `tests/unit/like-route.test.ts` e `tests/unit/comments-route.test.ts` cobrem sinais conflitantes, cross-site sem `Origin`, mesmo site de outra origem, `Referer` divergente e tráfego legítimo. Resultado isolado: 3 arquivos, 23 testes aprovados.
- Validação completa sequencial: 46 arquivos, 192 testes, lint, typecheck e build aprovados.
- Política alinhada à [orientação OWASP para Fetch Metadata e fallback de origem](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Limites da prova

- Cabeçalhos ausentes de clientes legados ainda são aceitos; `Sec-Fetch-Site` é defesa contra requisições de navegador, não autenticação de cliente.
- Restam corpus de segurança completo, testes em Preview, WAF, scanning de dependências e aceite de produção. Esta evidência não aprova SEC-001 nem GATE-MVP.
