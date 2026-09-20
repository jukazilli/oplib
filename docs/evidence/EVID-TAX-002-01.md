# EVID-TAX-002-01 — Administração de categorias e tags

## Escopo comprovado

- criação, renomeação, pesquisa e consulta de uso;
- unicidade por nome normalizado e slug;
- proteção referencial de item associado;
- exclusão transacional com substituição ou remoção explícita das associações;
- comandos administrativos autenticados e erros associados ao campo aplicável.

## Evidência local

- `pnpm test`: `52` testes aprovados em `13` arquivos;
- `pnpm typecheck`: aprovado;
- `pnpm lint`: aprovado;
- `pnpm build`: aprovado;
- rota dinâmica `/admin/taxonomia` incluída no build.

## Evidência de banco no Preview

Comando: `node --env-file=.env.local scripts/verify-taxonomy.mjs`.

Resultado: CRUD, rejeição de duplicidade, bloqueio de exclusão associada, substituição de categoria e remoção de associações de tag aprovados. Toda a verificação ocorreu em transação e terminou com `ROLLBACK`; nenhum dado sintético permaneceu.

## Evidência remota

A registrar após a publicação da branch e conclusão dos checks.
