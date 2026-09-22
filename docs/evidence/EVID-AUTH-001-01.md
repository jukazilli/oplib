# EVID-AUTH-001-01 — Entrada e saída administrativas

## Resultado atual

**Estado:** aprovado.

## Implementação comprovada

- rota própria `/sign-in`, sem divulgação na navegação pública;
- login configurado para direcionar sempre a `/admin`;
- ação explícita `Sair`, com encerramento de sessão pelo Clerk e retorno a `/sign-in`;
- nenhuma rota `/sign-up` e instância Clerk mantida em modo `restricted`;
- erros de identidade inexistente, senha incorreta e acesso não permitido mapeados para a mesma mensagem genérica;
- autorização administrativa continua condicionada à allowlist no servidor, separada da autenticação.

## Validações aprovadas

- `pnpm test`: 29 testes em 8 arquivos;
- `pnpm lint`: aprovado;
- `pnpm typecheck`: aprovado;
- `pnpm build`: aprovado;
- `git diff --check`: aprovado;
- Preview Vercel: deployment aprovado no commit `ad34e86`;
- smoke remoto: cinco cenários aprovados em `https://github.com/jukazilli/oplib/actions/runs/35530978746`;
- `/admin` anônimo redireciona para `/sign-in`;
- `/sign-up` responde `404` e a entrada não oferece cadastro público.

## Aceite autenticado do proprietário

Em 20/09/2026, o proprietário informou `AUTH-001 aprovado` após executar o roteiro no Preview com a conta administrativa. O aceite comprova:

- login válido com redirecionamento para `/admin` e visão `Acervo`;
- ação explícita `Sair` com retorno a `/sign-in`;
- nova tentativa de abrir `/admin` bloqueada após o logout.

Nenhuma credencial ou identidade foi registrada. As chaves Clerk continuam ausentes desta máquina e do GitHub Actions.

## Decisão de fechamento

- `TEST-AUTH-001-01`: aprovado por aceite humano;
- `TEST-AUTH-001-02`: aprovado por mensagem genérica configurada e teste unitário;
- `TEST-AUTH-001-03`: aprovado por aceite humano;
- `TEST-AUTH-001-04`: aprovado por teste unitário e smoke remoto;
- AUTH-001: **FECHADA**.

## Regressão de localização descoberta no Preview

Em 22/09/2026, o Preview do PR #35 (commit `1a4ae86`) mostrou a moldura `Acesso administrativo` em português, mas os controles embutidos do Clerk em inglês (`Continue with Google`, `Email address or username`, `Continue`). O aceite anterior de login/logout não cobria a tradução completa da tela.

O módulo `authenticationLocalization` passou a combinar o recurso oficial `ptBR` do Clerk com os três erros genéricos já aprovados. O teste unitário fixa `pt-BR`, rótulos básicos e a preservação da mensagem de erro. A verificação visual no novo Preview e o fluxo autenticado continuam necessários; esta seção não revoga a prova anterior de autorização, mas não declara a regressão visual encerrada antes do teste remoto.
