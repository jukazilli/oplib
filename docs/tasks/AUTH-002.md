# AUTH-002 — Proteger sessão, rotas e comandos

- [x] Contrato canônico, documentação Clerk/Next e implementação atual revisados.
- [x] Limite entre autenticação no Proxy e autorização junto ao recurso definido.
- [x] Proxy bloqueia entrada administrativa anônima e preserva retorno seguro.
- [x] Página administrativa repete sessão e allowlist no servidor.
- [x] Todo Route Handler administrativo repete sessão e allowlist no servidor.
- [x] Respostas de comando distinguem ausência de sessão (`401`) e identidade sem autorização (`404`).
- [x] Cliente trata sessão expirada e retorna ao contexto após novo login.
- [x] Matriz negativa, testes locais e smoke do Preview aprovados.
- [x] Sessão expirada validada pelo proprietário no Preview.
- [x] Backlog, matriz e evidência final reconciliados.

## Estado de validação

- 40 testes aprovados em 9 arquivos.
- Typecheck limpo, sem cache incremental, lint e build aprovados.
- Preview imutável `oplib-3edm8mopb-feather-tecnologias.vercel.app` no commit `b4a02ab`.
- Seis cenários E2E aprovados no run `35532991562`, incluindo página protegida e dois comandos anônimos.
- Identidade fora da allowlist permanece coberta pela matriz unitária e pelo ensaio Clerk de `EVID-FND-008-01`.
- O proprietário aprovou no Preview o redirecionamento por sessão expirada, a nova entrada e o retorno ao contexto administrativo em 20/09/2026.

## Contrato do corte

- **Objetivo:** impedir leitura ou mutação administrativa sem sessão e allowlist válidas.
- **Dentro:** primeira barreira no `proxy.ts`, proteção próxima a páginas e comandos, respostas sem detalhes sensíveis, retorno seguro após novo login e tratamento de sessão expirada no fluxo existente.
- **Fora:** editor e persistência do rascunho editorial, matriz dos comandos que ainda não existem, MFA e Production.
- **Dependência satisfeita:** AUTH-001 aprovado.

## Decisões

- O Proxy antecipa apenas autenticação; autorização por allowlist permanece repetida junto a cada recurso, conforme a recomendação atual do Clerk.
- Comandos retornam `401` para sessão ausente e `404` para identidade autenticada fora da allowlist, sempre com corpo genérico e `Cache-Control: no-store`.
- O parâmetro de retorno aceita apenas caminhos sob `/admin`; qualquer valor externo ou inválido cai em `/admin`.
- A entrada direta continua levando à visão geral. Quando a sessão expira dentro da administração, o login devolve ao caminho administrativo de origem.
- Preservação de conteúdo editorial local será materializada e testada com o editor em PUB-001/PUB-002; AUTH-002 entrega agora o contrato de retorno e evita prometer uma UI inexistente.

## Provas esperadas

- `TEST-AUTH-002-01`: matriz negativa para página e comandos existentes.
- `TEST-AUTH-002-02`: sessão expirada retorna à entrada e recupera o contexto administrativo.
- `EVID-AUTH-002-01`: relatório de autorização sem identidade ou segredo.
