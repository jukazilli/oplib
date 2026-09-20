# EVID-FND-016-01 — Foundation Readiness

## Resultado da auditoria

**Estado atual:** aprovada para desenvolvimento e Preview, condicionada à exceção `OPS-002`. Production permanece bloqueada.

## Promessa versus evidência

| Item | Evidência observada | Status de auditoria |
| --- | --- | --- |
| FND-001 | governança, ruleset e validação do repositório | FECHADO |
| FND-002 | versões fixadas, instalação reproduzível e build | FECHADO |
| FND-003 | tokens, UI-base e ferramentas de teste | FECHADO |
| FND-004 | schemas de configuração, gitignore e runbook | FECHADO |
| FND-005 | Neon `aws-sa-east-1`, branches e conectividade comprovadas | FECHADO |
| FND-006 | migration, constraints e schema check comprovados em Neon não produtivo | FECHADO |
| FND-007 | Preview Vercel em `gru1` e ambientes segregados | FECHADO |
| FND-008 | autenticação e allowlist de desenvolvimento; MFA produtivo pendente | PARCIAL PARA PRODUCTION |
| FND-009 | Vercel Blob de Preview, upload autorizado e validação de arquivo | FECHADO |
| FND-010 | CI, CodeQL, ruleset e falha bloqueante comprovados | FECHADO |
| FND-011 | smoke e axe no Preview | FECHADO |
| FND-012 | ensaio de release aprovado; rollback produtivo aguarda go-live | PARCIAL PARA PRODUCTION |
| FND-013 | headers, payload e WAF Preview em log | FECHADO |
| FND-014 | health Neon, logs saneados e drill sintético | FECHADO |
| FND-015 | congelada por `OPS-002`; nenhum backup ou restore real | NÃO IMPLEMENTADO — EXCEÇÃO |

## TEST-FND-016-01 — Aceite integrado

Validações locais executadas nesta branch:

- `pnpm format:check`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm typecheck`: aprovado;
- `pnpm test`: 26 testes aprovados em 7 arquivos;
- `pnpm build`: aprovado;
- `node scripts/validate-repository.mjs`: 29 arquivos de governança aprovados;
- `git diff --check`: aprovado.

`pnpm db:check` não foi repetido localmente porque `OPS-001` mantém credenciais Neon fora da máquina de desenvolvimento. A prova integrada válida permanece em `EVID-FND-006-01`.

Validação remota desta branch:

- Preview: `https://oplib-git-feat-fnd-016-foundation-readiness-feather-tecnologias.vercel.app`;
- E2E: `https://github.com/jukazilli/oplib/actions/runs/35529425596`;
- resultado: quatro cenários aprovados em Chromium, incluindo página pública, proteção administrativa, acessibilidade básica e health conectado ao Neon;
- CI, CodeQL, política do repositório e deployment Vercel do PR #16 aprovados.

## Estado de integração

Os PRs #10 a #14 continuam abertos e encadeados. Seus checks e evidências estão verdes, mas `main` ainda não materializa toda a Fundação. A sequência deverá ser integrada de forma controlada, sem acionar Production inadvertidamente.

## Exceções e bloqueios de Production

- `OPS-002`: permite funcionalidades apenas em desenvolvimento e Preview com dados reconstruíveis;
- `DEC-004`: MFA produtivo ainda não resolvido;
- FND-012: rollback produtivo ainda não ensaiado;
- FND-015: backup restaurável ainda não comprovado.

Nenhuma dessas exceções autoriza go-live. O smoke remoto permite aprovar o `GATE-FND` para desenvolvimento/Preview; Production continua bloqueada.

## Dívidas não bloqueantes registradas

- `pnpm audit` encontrou três vulnerabilidades moderadas transitivas: duas pela árvore de `@clerk/ui` (`uuid` e `stream-json`) e uma de desenvolvimento pela árvore legada do `drizzle-kit` (`esbuild`);
- o alerta Dependabot #1 da branch padrão corresponde ao `esbuild`; a branch atual já possui versões corrigidas nos caminhos principais, mas ainda carrega `0.18.20` por dependência transitiva do Drizzle;
- `pnpm/action-setup@v4` emitiu aviso de runtime Node.js 20 descontinuado e foi executado sob Node.js 24 pelo runner;
- esses itens devem ser tratados na manutenção contínua e reavaliados em `SEC-001` antes de Production, sem ampliar a FND-016.

## Decisão de fechamento

- FND-016: **FECHADA**;
- `GATE-FND`: **APROVADO PARA DESENVOLVIMENTO E PREVIEW POR EXCEÇÃO**;
- Production: **BLOQUEADA**;
- próximo corte funcional pode começar somente com dados sintéticos ou reconstruíveis e sem migration destrutiva ou exclusão permanente dependente de restore.
