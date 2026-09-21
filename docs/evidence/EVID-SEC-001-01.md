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
- Restam corpus de segurança completo, testes em Preview, WAF e aceite de produção. Esta evidência não aprova SEC-001 nem GATE-MVP.

## Auditoria de dependências

- `pnpm audit --prod` em 21/09/2026: dois alertas **moderados**, nenhum alto ou crítico. Ambos vêm de `@clerk/ui@1.33.1` → adaptadores Solana → `@solana/web3.js@1.99.0` → `jayson@4.3.0`: `uuid@8.3.2` ([GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)) e `stream-json@1.9.1` ([GHSA-528h-pc64-c93x](https://github.com/advisories/GHSA-528h-pc64-c93x)).
- `pnpm audit --prod --audit-level high` saiu com código 0, mas ainda informou os dois moderados. `.github/workflows/ci.yml` passa a executar o mesmo comando após instalação congelada; a execução remota do novo job ainda precisa ser observada.
- `pnpm format:check` e `node scripts/validate-repository.mjs` passaram localmente. A formatação mecânica adicional normalizou arquivos canônicos e snapshots sem alterar seus valores; `pnpm db:check` passou com uma URL PostgreSQL sintética apenas para satisfazer a validação de configuração, sem conexão com banco real.
- Validação final local do corte: 46 arquivos, 192 testes, lint, typecheck e build aprovados. O teste de metadados do editor manteve as mesmas asserções e recebeu limite próprio de 15 segundos após exceder de forma intermitente o padrão de 5 segundos na suíte completa; isolado e na repetição completa, passou.
- A aplicação importa `@clerk/ui/themes` e CSS do tema, não os adaptadores Solana diretamente. Isso **não prova** ausência de exposição transitiva. Não foi aplicada atualização major forçada a `uuid` ou `stream-json` sob `jayson` sem teste de compatibilidade.
- Os dois alertas moderados exigem revisão de alcance e resolução ou aceite formal antes de encerrar SEC-001. A auditoria deve ser repetida no gate final, pois a base de avisos muda com o tempo.

## Contrato de payload dos comentários

- A rota pública exige `application/json`, aceitando parâmetros como `charset=utf-8`; outros tipos retornam `415` com orientação curta.
- JSON malformado retorna `400`, separado de falhas reais de infraestrutura. Corpo declarado ou efetivamente acima de 10 KB é recusado antes do parse.
- Esses erros não identificam visitante, não consomem rate limit, não persistem comentário e não geram evento de falha operacional. Todas as respostas são `no-store` e não ecoam o payload.
- `tests/unit/comments-route.test.ts`: 7 testes aprovados, incluindo tipo incompatível, JSON truncado, limite declarado, limite efetivo e ausência de efeitos colaterais.
- Validação completa do corte: 46 arquivos, 194 testes, format check, lint, typecheck e build aprovados.
- Ainda faltam prova em Preview e os demais grupos do corpus SEC-001; esta seção não encerra a regressão de segurança.
