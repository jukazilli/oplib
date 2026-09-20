# EVID-FND-014-01 — Observabilidade e saúde

## Estado

Concluída. O health, os logs estruturados e o alerta sintético foram comprovados em Preview e GitHub Actions sem serviço externo adicional.

## TEST-FND-014-01 — Health

- endpoint: `/api/health`;
- resposta contém somente `status`, `database` e `version`;
- header `x-correlation-id` gerado pelo servidor;
- cache desabilitado;
- estado saudável retorna `200`; falha do banco retorna `503` sem detalhes internos;
- Preview: `https://oplib-lq7mx7dia-feather-tecnologias.vercel.app`;
- execução verde com quatro cenários: `https://github.com/jukazilli/oplib/actions/runs/35525688790`.

## TEST-FND-014-02 — Redação

- logger serializa somente timestamp, nível, evento, correlação, módulo, resultado, duração e código estável;
- erro original, stack, conexão, headers, cookies e corpos não são aceitos pelo contrato;
- suíte local: 26 testes aprovados.

## TEST-FND-014-03 — Alerta sintético

- workflow manual `Observability Drill`;
- exige confirmação `EMIT_TEST_FAILURE`;
- emite somente evento e código sintéticos e termina com falha intencional;
- execução registrada: `https://github.com/jukazilli/oplib/actions/runs/35525273717`.

## Correção operacional comprovada

A primeira execução E2E retornou `503` porque `DATABASE_URL` e `DATABASE_URL_UNPOOLED` estavam limitadas à antiga branch `feat/fnd-007-vercel-preview`. As mesmas credenciais foram ampliadas para todas as branches de Preview. Production permaneceu sem alteração. Após novo deployment, o health e toda a suíte E2E passaram.

Nenhum segredo, connection string, cookie, conteúdo editorial ou dado de usuário foi registrado nesta evidência.
