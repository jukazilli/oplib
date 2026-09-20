# EVID-FND-008-01 — Clerk administrativo

- **Item:** FND-008
- **Data:** 20 de setembro de 2026
- **Aplicação:** Clerk `Opal Lib`, instância de desenvolvimento
- **Commit funcional:** `e639d34`

## Implementação

- `@clerk/nextjs` integrado ao App Router do Next.js 16.
- `ClerkProvider` dentro de `<body>` e proxy com a rota automática `/__clerk/:path*`.
- Login próprio em `/sign-in`, sem rota ou controle público de cadastro.
- Acesso a `/admin` condicionado à sessão Clerk e à correspondência exata com `ADMIN_CLERK_USER_ID` no servidor.
- Instância de desenvolvimento com cadastro em modo `restricted`.
- Chaves e allowlist criptografadas na Vercel e limitadas ao Preview da branch `feat/fnd-008-clerk-admin`.

## TEST-FND-008-01 — acesso permitido

O proprietário autenticou-se no Preview com o usuário administrativo configurado e acessou a tela do acervo.

## TEST-FND-008-02 — acesso negado

Uma segunda identidade foi criada durante o ensaio, autenticou-se e não recebeu acesso ao acervo. Isso comprova que autenticação não concede autorização administrativa. Após o ensaio, novos cadastros foram restringidos na configuração do Clerk.

## TEST-FND-008-03 — sessão ausente

O teste unitário cobre sessão ausente e espera o estado `unauthenticated`; a camada de servidor redireciona esse estado para `/sign-in`. O ciclo de sessão e sua revogação permanecem gerenciados pelo Clerk.

## Verificações

- `clerk doctor`: aplicação alcançável, credenciais de desenvolvimento presentes e produção ausente por decisão.
- `pnpm typecheck`: aprovado.
- `pnpm lint`: aprovado.
- `pnpm test`: 11 testes aprovados.
- `pnpm build`: aprovado.
- Deployment Preview `READY`: `https://oplib-m6536ru5d-feather-tecnologias.vercel.app`.

Produção não recebeu chaves nem deployment neste corte. MFA de produção permanece condicionada à `DEC-004`. Nenhuma chave ou identidade Clerk foi registrada nesta evidência.
