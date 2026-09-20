# EVID-FND-012-01 — Release e rollback controlados

## Estado

Evidência parcial. O ensaio de release foi aprovado sem alterar Production; o ensaio de rollback aguarda um deployment produtivo conhecido e autorização de go-live.

## Implementação

- workflow manual `.github/workflows/release.yml`;
- operações independentes `rehearse`, `promote` e `rollback`;
- Vercel CLI fixada em `59.23.2`;
- confirmação textual e validação de SHA e URL;
- promoção e rollback limitados a `main` e ao GitHub Environment `Production`;
- Environment `Production` protegido por revisor obrigatório e branch protegida;
- migration pela conexão direta antes da promoção;
- rollback de banco deliberadamente não automatizado.

## TEST-FND-012-01 — Release de ensaio

- execução: `https://github.com/jukazilli/oplib/actions/runs/35520232749`;
- commit: `b942a939adc538acce95362b9142699590de1b7a`;
- Preview: `https://oplib-o0asyyz8a-feather-tecnologias.vercel.app`;
- resultado: aprovado;
- quality gates, build e três testes Playwright aprovados;
- jobs `promote` e `rollback` ignorados, sem acesso a Production.

## TEST-FND-012-02 — Rollback

Pendente. A documentação e a guarda estão prontas, mas não será criado nem alterado deployment de Production somente para satisfazer o teste. O teste deverá usar um deployment que já tenha servido Production e permanecerá condicionado à decisão de go-live `DEC-004`.

Nenhum token, segredo, connection string ou dado de usuário foi incluído nesta evidência.
