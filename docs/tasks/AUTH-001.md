# AUTH-001 — Entrar e sair da administração

- [x] Contrato canônico e implementação herdada da FND-008 revisados.
- [x] Limite entre AUTH-001, AUTH-002 e ADM-001 definido.
- [x] Entrada administrativa direciona o proprietário para `/admin`.
- [x] Falhas de autenticação preservam mensagens genéricas do provedor.
- [x] Saída explícita encerra a sessão e direciona para `/sign-in`.
- [x] Cadastro público permanece ausente na aplicação e restrito no Clerk.
- [ ] Testes locais e E2E de Preview aprovados.
- [ ] Backlog, matriz e evidência final reconciliados.

## Contrato do corte

- **Objetivo:** completar a jornada de entrada e saída do único administrador.
- **Dentro:** rota `/sign-in`, redirecionamento pós-login, ação explícita `Sair`, redirecionamento pós-logout e prova da ausência de cadastro público.
- **Fora:** shell administrativo definitivo, recuperação de rascunho após expiração, matriz de autorização por comando, MFA e Production.
- **Dependências satisfeitas:** `GATE-FND` aprovado para desenvolvimento/Preview e base Clerk entregue por FND-008.

## Decisões

- A sessão continua gerenciada pelo Clerk; autorização administrativa continua condicionada à allowlist no servidor.
- `Sair` encerra todas as sessões do navegador, comportamento padrão do `SignOutButton`, e retorna à rota de entrada.
- A tela de entrada mantém somente o título necessário; o formulário já torna a ação evidente.
- Mensagens inválidas são responsabilidade do fluxo hospedado do Clerk e não recebem texto que permita enumerar identidades.
- Não será criada rota `/sign-up`; o modo `restricted` da instância continua sendo a barreira no provedor.

## Provas esperadas

- `TEST-AUTH-001-01`: login válido direciona para `/admin`.
- `TEST-AUTH-001-02`: tentativa inválida apresenta falha genérica.
- `TEST-AUTH-001-03`: logout remove o acesso administrativo e retorna para `/sign-in`.
- `TEST-AUTH-001-04`: `/sign-up` não existe e a tela de entrada não oferece cadastro.
- `EVID-AUTH-001-01`: testes locais e E2E com conta de teste no Preview, sem registrar identidade ou segredo.
