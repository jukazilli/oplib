# EVID-AUTH-002-01 — Proteção de sessão, rotas e comandos

## Resultado atual

**Estado:** implementação e validações automatizadas aprovadas; aceite humano de sessão expirada pendente.

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

O retorno seguro e a mensagem `Sessão expirada. Entre novamente.` estão cobertos por testes unitários. A expiração real aguarda o ensaio humano abaixo:

1. entrar no Preview e manter `/admin` aberto na primeira aba;
2. abrir `/admin` em uma segunda aba e acionar `Sair`;
3. voltar à primeira aba, escolher uma capa válida e acionar `Enviar capa`;
4. confirmar o redirecionamento para `/sign-in` com a mensagem de sessão expirada;
5. entrar novamente e confirmar o retorno a `/admin`.

O editor ainda não existe. A preservação efetiva do rascunho editorial local será materializada e validada em PUB-001/PUB-002; AUTH-002 entrega o contrato seguro de retorno ao contexto.

Até o aceite humano, AUTH-002 permanece `in-progress`.
