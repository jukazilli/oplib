# EVID-FND-013-01 — Baseline de segurança

## Estado

Concluída. Headers, limite de payload e validação no Preview foram aprovados. A regra WAF foi publicada em modo `log`, sem bloquear tráfego.

## Controles implementados

- CSP em `Content-Security-Policy-Report-Only` com `frame-ancestors 'none'`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- política de referrer e permissions policy restritivas;
- limite de 64 KiB para JSON nas rotas administrativas de capa;
- limite verificado pelo tamanho declarado e pelos bytes realmente lidos;
- resposta `413` para excesso sem exposição de stack;
- política existente de tipo, tamanho e assinatura de arquivo preservada.

## TEST-FND-013-01 — Headers

- testes unitários aprovados;
- E2E do Preview confirmou CSP Report-Only, `nosniff` e proteção contra frame;
- execução: `https://github.com/jukazilli/oplib/actions/runs/35520855465`.

## TEST-FND-013-02 — Payload excessivo

- corpo com `Content-Length` acima do limite rejeitado;
- corpo transmitido acima do limite rejeitado mesmo sem confiar no header;
- suíte: 23 testes aprovados.

## TEST-FND-013-03 — Autenticação abusiva

- regra `Observe Preview admin authentication` publicada, ativa e válida;
- escopo: somente ambiente `preview` e caminho iniciado por `/sign-in`;
- ação: `log`, sem bloqueio;
- nenhum rascunho ou alteração pendente;
- telemetria do período registrou 7 acessos permitidos a `/sign-in`, confirmando que o fluxo continuou disponível durante a observação.

## Escopo futuro

Sanitização Markdown pertence a `PUB-002`. Rate limits de comentários e curtidas serão definidos quando as rotas correspondentes existirem. Nenhum segredo, IP ou dado de usuário foi registrado.
