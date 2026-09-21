# EVID-ADM-001-01 — Shell e visão geral administrativa

## Resultado atual

**Estado:** aprovado.

## Implementação comprovada

- shell administrativo responsivo com navegação compacta e saída explícita;
- visão geral com contagens reais de publicadas, rascunhos, retiradas e comentários ocultos;
- lista dos cinco comentários mais recentes vinculados à publicação;
- ausência de ação “Nova publicação” duplicada na visão geral e na navegação;
- destinos futuros identificados sem links que terminem em páginas inexistentes;
- estados vazio e degradado com mensagens curtas e sem detalhes técnicos;
- falha de leitura registrada apenas com campos controlados e correlation ID;
- consulta adiada até uma requisição real com `connection()`;
- envio de capa removido da visão geral e preservado tecnicamente para integração ao fluxo editorial.
- composição editorial integrada a Publicações registrada em DOC-04/DOC-05, com referência original em `docs/assets/reference-threads.png`.

## TEST-ADM-001-01 — Desktop e celular

Cobertura local:

- navegação e estado atual;
- ausência de links quebrados para módulos futuros;
- ação dominante;
- quatro contagens;
- estado vazio de comentários;
- comentário recente com publicação de origem;
- shell adaptável por breakpoints e navegação horizontal em telas estreitas.

Smoke anônimo inicial aprovado no run `35541148070`; após a remoção do upload de capa, o run `35541831185` repetiu e aprovou redirecionamento da administração, comandos protegidos, segurança, acessibilidade pública e health.

Em 20/09/2026, o proprietário acessou o Preview autenticado, identificou o upload de capa fora de contexto, aprovou sua remoção da visão geral e declarou o ajuste aprovado. A infraestrutura de capa permaneceu preservada para o fluxo editorial.

## TEST-ADM-001-02 — Cache privado

- o build classifica `/admin` como rota dinâmica (`ƒ`);
- `requireAdmin()` permanece no layout da árvore administrativa;
- a consulta ao banco não roda durante a pré-renderização;
- a combinação de autenticação por requisição, `connection()` e classificação dinâmica impede geração de resposta administrativa pública compartilhável; a regressão de acesso anônimo permanece coberta pelo smoke.

## Validação local

- `pnpm test`: 44 testes em 10 arquivos;
- `pnpm exec tsc --noEmit --incremental false`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm build`: aprovado;
- `/admin`: rota dinâmica no relatório do build.
- Preview: `https://oplib-git-feat-adm-001-admin-shell-feather-tecnologias.vercel.app`;
- E2E Preview final: run `35541831185` aprovado.

## Decisão de fechamento

- `TEST-ADM-001-01`: aprovado pela suíte, smoke remoto e aceite autenticado do proprietário;
- `TEST-ADM-001-02`: aprovado pela proteção de sessão, renderização dinâmica e ausência de cache público;
- ADM-001: **FECHADA**.
