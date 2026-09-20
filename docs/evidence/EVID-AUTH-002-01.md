# EVID-AUTH-002-01 — Proteção de sessão, rotas e comandos

## Resultado atual

**Estado:** aprovado.

## Implementação comprovada

- `proxy.ts` antecipa a autenticação em `/admin` e `/api/admin/*`;
- páginas repetem sessão e allowlist no servidor;
- os dois Route Handlers administrativos existentes repetem sessão e allowlist junto ao comando;
- sessão ausente em comando retorna `401`; identidade fora da allowlist retorna `404`;
- respostas negativas usam mensagem genérica e `Cache-Control: no-store`;
- retorno pós-login aceita somente caminhos internos sob `/admin`;
- sessão expirada no upload direciona à entrada, informa o estado e retorna ao contexto administrativo.

## TEST-AUTH-002-01 — Matriz negativa

- página `/admin` sem sessão: redirecionada para `/sign-in`;
- `POST /api/admin/covers/pathname` sem sessão: `401` genérico e `no-store`;
- `POST /api/admin/covers` sem sessão: `401` genérico e `no-store`;
- identidade diferente da allowlist: `404` na camada de autorização;
- retorno externo ou fora de `/admin`: normalizado para `/admin`;
- autorização junto aos comandos: coberta por `requireAdminCommand` e testes unitários.

Provas:

- `pnpm test`: 40 testes em 9 arquivos;
- `pnpm exec tsc --noEmit --incremental false`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm build`: aprovado;
- smoke do Preview: seis cenários aprovados em `https://github.com/jukazilli/oplib/actions/runs/35532991562`;
- ensaio anterior de identidade fora da allowlist: `EVID-FND-008-01`.

## TEST-AUTH-002-02 — Sessão expirada

O retorno seguro e a mensagem `Sessão expirada. Entre novamente.` estão cobertos por testes unitários. Em 20/09/2026, o proprietário informou `AUTH-002 aprovado` após executar o ensaio no Preview, comprovando:

- comando da aba com sessão revogada bloqueado;
- redirecionamento para `/sign-in` com mensagem de sessão expirada;
- nova autenticação concluída;
- retorno ao contexto `/admin`.

Nenhuma credencial ou identidade foi registrada na evidência.

O editor ainda não existe. A preservação efetiva do rascunho editorial local será materializada e validada em PUB-001/PUB-002; AUTH-002 entrega o contrato seguro de retorno ao contexto.

## Decisão de fechamento

- `TEST-AUTH-002-01`: aprovado pela suíte automatizada, smoke remoto e evidência anterior da allowlist;
- `TEST-AUTH-002-02`: aprovado por testes unitários e aceite humano no Preview;
- AUTH-002: **FECHADA**.
