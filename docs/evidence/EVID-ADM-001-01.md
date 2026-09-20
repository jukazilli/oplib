# EVID-ADM-001-01 — Shell e visão geral administrativa

## Resultado atual

**Estado:** implementação e smoke anônimo do Preview aprovados; aceite autenticado pendente.

## Implementação comprovada

- shell administrativo responsivo com navegação compacta e saída explícita;
- visão geral com contagens reais de publicadas, rascunhos, retiradas e comentários ocultos;
- lista dos cinco comentários mais recentes vinculados à publicação;
- ação dominante “Nova publicação” visível e indisponível até o fluxo editorial existir;
- destinos futuros identificados sem links que terminem em páginas inexistentes;
- estados vazio e degradado com mensagens curtas e sem detalhes técnicos;
- falha de leitura registrada apenas com campos controlados e correlation ID;
- consulta adiada até uma requisição real com `connection()`;
- envio de capa já entregue preservado na administração.

## TEST-ADM-001-01 — Desktop e celular

Cobertura local:

- navegação e estado atual;
- ausência de links quebrados para módulos futuros;
- ação dominante;
- quatro contagens;
- estado vazio de comentários;
- comentário recente com publicação de origem;
- shell adaptável por breakpoints e navegação horizontal em telas estreitas.

Pendente no Preview:

- screenshot autenticado em desktop;
- screenshot autenticado em celular;
- inspeção visual do conteúdo real do banco.

Smoke anônimo aprovado em `https://github.com/jukazilli/oplib/actions/runs/35541148070`, cobrindo redirecionamento da administração, comandos protegidos, segurança, acessibilidade pública e health.

## TEST-ADM-001-02 — Cache privado

- o build classifica `/admin` como rota dinâmica (`ƒ`);
- `requireAdmin()` permanece no layout da árvore administrativa;
- a consulta ao banco não roda durante a pré-renderização;
- comprovação do `Cache-Control` da resposta autenticada permanece pendente no Preview.

## Validação local

- `pnpm test`: 44 testes em 10 arquivos;
- `pnpm exec tsc --noEmit --incremental false`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm build`: aprovado;
- `/admin`: rota dinâmica no relatório do build.
- Preview: `https://oplib-git-feat-adm-001-admin-shell-feather-tecnologias.vercel.app`;
- E2E Preview: run `35541148070` aprovado.

## Pendências de fechamento

- executar smoke autenticado em desktop e celular;
- comprovar resposta privada e não armazenável;
- obter aceite do proprietário.
