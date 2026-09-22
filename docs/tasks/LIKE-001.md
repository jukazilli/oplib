# LIKE-001 — Curtir uma vez por navegador

- [x] Contrato confirmado em D02 §8.5, D05 §8, D07 §§10–11, TL §12 e backlog.
- [x] Identificador aleatório opaco mantido somente em cookie protegido.
- [x] Banco recebe somente HMAC com pepper secreto.
- [x] Inserção idempotente usa a constraint `UNIQUE(post_id, visitor_hash)` e devolve contagem autoritativa.
- [x] Rascunho/retirada não aceitam curtida e não revelam o estado editorial.
- [x] Interface não antecipa incremento, bloqueia repetição e preserva leitura em erro.
- [x] Não existe operação de desfazer/remover curtida.
- [x] Testes, build, UTF-8, evidência e ledger validados.

Validação local concluída com 151 testes, lint, typecheck e build. Concorrência e persistência reais, WAF e acessibilidade em navegador permanecem no roteiro de Preview/final.

## Decisão

A identidade não usa IP, fingerprint, conta ou dados pessoais declarados. O cookie `HttpOnly`, `SameSite=Lax` e `Secure` em execução de produção contém apenas UUID aleatório; o servidor persiste seu HMAC. A limitação canônica permanece: limpar os dados do navegador permite nova curtida. O WAF da fundação cobre limitação grosseira da rota, enquanto a constraint do banco preserva o invariante sob repetição e concorrência.
