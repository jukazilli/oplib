# EVID-AUTH-001-01 — Entrada e saída administrativas

## Resultado atual

**Estado:** implementação pronta e validação automatizada aprovada; aceite autenticado do proprietário pendente.

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

## Aceite autenticado pendente

As chaves Clerk não ficam nesta máquina e não foram copiadas para o GitHub Actions. Sem `CLERK_SECRET_KEY` ou sessão humana, o Playwright encontra corretamente a proteção anti-bot do Clerk e não pode simular a conta real.

O proprietário deve validar no Preview, sem registrar credenciais na evidência:

1. abrir `/sign-in` e entrar com a conta administrativa;
2. confirmar o redirecionamento para `/admin` e o título `Acervo`;
3. acionar `Sair` e confirmar o retorno a `/sign-in`;
4. tentar abrir `/admin` novamente e confirmar que o acesso continua revogado;
5. informar apenas “aprovado” ou a divergência observada.

Até esse aceite, `TEST-AUTH-001-01` e `TEST-AUTH-001-03` permanecem pendentes e AUTH-001 não deve ser marcado como `done`.
