# AUTH-001 — Entrar e sair da administração

- [x] Contrato canônico e implementação herdada da FND-008 revisados.
- [x] Limite entre AUTH-001, AUTH-002 e ADM-001 definido.
- [x] Entrada administrativa direciona o proprietário para `/admin`.
- [x] Falhas de autenticação preservam mensagens genéricas do provedor.
- [x] Saída explícita encerra a sessão e direciona para `/sign-in`.
- [x] Cadastro público permanece ausente na aplicação e restrito no Clerk.
- [x] Testes locais e smoke anônimo do Preview aprovados.
- [ ] Login e logout reais validados pelo proprietário no Preview.
- [x] Backlog, matriz e evidência parcial reconciliados.

## Contrato do corte

- **Objetivo:** completar a jornada de entrada e saída do único administrador.
- **Dentro:** rota `/sign-in`, redirecionamento pós-login, ação explícita `Sair`, redirecionamento pós-logout e prova da ausência de cadastro público.
- **Fora:** shell administrativo definitivo, recuperação de rascunho após expiração, matriz de autorização por comando, MFA e Production.
- **Dependências satisfeitas:** `GATE-FND` aprovado para desenvolvimento/Preview e base Clerk entregue por FND-008.

## Decisões

- A sessão continua gerenciada pelo Clerk; autorização administrativa continua condicionada à allowlist no servidor.
- `Sair` encerra todas as sessões do navegador, comportamento padrão do `SignOutButton`, e retorna à rota de entrada.
- A tela de entrada mantém somente o título necessário; o formulário já torna a ação evidente.
- Erros de identidade inexistente, senha incorreta e acesso não permitido recebem a mesma mensagem genérica por configuração do `ClerkProvider`.
- Não será criada rota `/sign-up`; o modo `restricted` da instância continua sendo a barreira no provedor.

## Estado de validação

- 29 testes unitários aprovados, incluindo redirecionamentos e unificação das mensagens de erro.
- Smoke do Preview aprovado com cinco cenários no run `35530978746`.
- A proteção anti-bot do Clerk impede submeter o formulário em Playwright remoto sem token de teste.
- As chaves Clerk estão corretamente ausentes desta máquina e do GitHub Actions; por isso `TEST-AUTH-001-01` e `TEST-AUTH-001-03` aguardam aceite humano com a conta do proprietário.

## Provas esperadas

- `TEST-AUTH-001-01`: login válido direciona para `/admin`.
- `TEST-AUTH-001-02`: tentativa inválida apresenta falha genérica.
- `TEST-AUTH-001-03`: logout remove o acesso administrativo e retorna para `/sign-in`.
- `TEST-AUTH-001-04`: `/sign-up` não existe e a tela de entrada não oferece cadastro.
- `EVID-AUTH-001-01`: testes locais e E2E com conta de teste no Preview, sem registrar identidade ou segredo.
