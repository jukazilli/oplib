# EVID-FND-001-01 — Repositório protegido e preparado

- **Item:** FND-001
- **Data:** 20 de setembro de 2026
- **Pull request:** [#1 — chore: inicia governança do FND-001](https://github.com/jukazilli/oplib/pull/1)
- **Branch:** `chore/fnd-001-repository-governance`
- **Ruleset:** [Protect main](https://github.com/jukazilli/oplib/rules/23717360)

## Implementação

- README operacional, guia de contribuição e política de segurança;
- CODEOWNERS, templates de issue e pull request;
- Dependabot para npm e GitHub Actions;
- CodeQL para JavaScript/TypeScript;
- check automatizado da política do repositório;
- `.gitignore` protegendo arquivos de ambiente e segredos;
- ruleset ativo na `main`, sem bypass, exigindo PR e checks;
- exclusão e force push bloqueados;
- Dependabot Security Updates, secret scanning e push protection habilitados.

## TEST-FND-001-01 — PR e checks

- o PR #1 foi criado a partir de uma branch curta;
- [Repository policy aprovado](https://github.com/jukazilli/oplib/actions/runs/35486184288);
- [CodeQL aprovado](https://github.com/jukazilli/oplib/actions/runs/35486097286);
- os checks `Validate repository policy` e `Analyze (javascript-typescript)` são obrigatórios no ruleset.

## TEST-FND-001-02 — falha deliberada

A proteção de variantes de `.env` foi removida temporariamente no commit `662c3fceb34bd460123cf9aab14be95d70b81ef0`.

O [check de política falhou como esperado](https://github.com/jukazilli/oplib/actions/runs/35486165554), impedindo o estado verde do PR. A violação foi revertida no commit `edf279a6964c1de79f633b6d8df71419902398ab`, e a validação local voltou a aprovar os 14 arquivos obrigatórios.

## Decisões e pendências

- Node.js 22 LTS foi aprovado em `docs/decisions/TL-STACK-002-node-22.md` para materialização no FND-002.
- A licença do código permanece sem definição. Nenhum arquivo `LICENSE` foi criado e o README deixa a ausência de permissão explícita.
