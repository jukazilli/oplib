# EVID-FND-010-01 — CI de pull request

- **Item:** FND-010
- **Data:** 20 de setembro de 2026
- **Pull request:** https://github.com/jukazilli/oplib/pull/10
- **Commit funcional:** `288be4e`

## Implementação

- Workflow `CI` executado em pull requests para `main` e por acionamento manual.
- Node.js `22.12.0` e pnpm `9.11.0`, iguais às versões fixadas no repositório.
- Instalação por `pnpm install --frozen-lockfile`.
- Gates de formato, lint, tipos, testes unitários e build de produção.
- Job com permissão somente de leitura e sem segredos de Preview ou Production.
- CodeQL mantido no workflow dedicado já existente.
- Check `Quality` adicionado aos status obrigatórios do ruleset ativo `Protect main`.

## TEST-FND-010-01 — workflow verde

A execução restaurada no commit `0043916` concluiu o check `Quality` em 1 minuto e 6 segundos. Também ficaram verdes CodeQL, política do repositório e Vercel Preview.

- CI: https://github.com/jukazilli/oplib/actions/runs/35517294556
- CodeQL: https://github.com/jukazilli/oplib/actions/runs/35517294650
- Política: https://github.com/jukazilli/oplib/actions/runs/35517294540

## TEST-FND-010-02 — erro bloqueado

O commit isolado `bafeee3` introduziu apenas um desvio de espaçamento em `package.json`. O check `Quality` falhou na etapa `Check formatting` em 20 segundos. O desvio foi removido imediatamente pelo commit de reversão `0043916`.

- Execução bloqueada: https://github.com/jukazilli/oplib/actions/runs/35517252691

Após a prova, todos os checks voltaram ao estado aprovado. O pull request permanece aberto e não foi mesclado; Production não foi alterada.
