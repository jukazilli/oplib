# OPS-001 — Desenvolvimento integrado em Preview

- **Estado:** aprovado
- **Data:** 20 de setembro de 2026
- **Responsável:** Juliano Zilli
- **Afeta:** FND-005 a FND-012, integração, E2E e fluxo de entrega

## Decisão

O OPALIB não usará Docker nem PostgreSQL local. A máquina de desenvolvimento será usada para edição, typecheck, testes unitários e build. A validação integrada principal ocorrerá em Preview Vercel, funcionando como staging e conectado exclusivamente a recursos não produtivos do Neon.

## Fluxo esperado

1. criar a mudança e executar checks locais aplicáveis;
2. publicar a branch e abrir o pull request;
3. gerar Preview Vercel para o mesmo commit;
4. aplicar migrations versionadas na branch Neon não produtiva por workflow controlado;
5. executar smoke, E2E e validação humana no endereço online;
6. permitir merge somente com os gates aprovados.

## Guardas

- Preview nunca utiliza credenciais ou dados de produção;
- migration de produção nunca ocorre automaticamente em todo commit;
- falha de migration interrompe a validação e impede promoção;
- o deploy `READY` não substitui smoke, E2E ou aceite humano;
- os checks locais rápidos permanecem obrigatórios para reduzir ciclos remotos desnecessários.
