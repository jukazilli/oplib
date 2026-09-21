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

- PR: `#21` (`feat/tax-002-manage-taxonomy` sobre `feat/tax-001-knowledge-areas`);
- deployment Preview: `8UABcfs5mBJnFkqfAqWb1aaaEk9P`;
- checks `Vercel` e `Vercel Preview Comments`: aprovados;
- inspeção do componente real em desktop e viewport móvel de `390×844`: hierarquia, campos, ações e fluxo destrutivo aprovados, sem rolagem horizontal;
- formulário destrutivo expandido confirmou item, contagem de uso, substituição e remoção explícita.

O Preview remoto estava protegido pelo login da Vercel. A inspeção visual foi executada em rota local efêmera com o componente real e dados sintéticos; rota e bypass temporários foram removidos antes do commit de fechamento.
