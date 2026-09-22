# EVID-MOD-002-01 — Ocultar e restaurar

## Implementação

- `src/modules/interactions/moderation/repository.ts`: transição condicional e auditoria na mesma transação.
- `src/app/admin/comentarios/actions.ts`: autorização, validação, revalidação e resposta controlada.
- `src/components/admin/comment-moderation-action.tsx`: progresso, sucesso, erro e desfazer temporário.
- Comentário oculto não aparece na consulta pública `listVisibleComments`; permanece no filtro administrativo.

## Prova local

- Testes de repositório, ação e controle cobrem transições, conflito, falha, autorização, auditoria e desfazer.
- `pnpm test`: 46 arquivos e 177 testes aprovados.
- `pnpm lint`, `pnpm typecheck` e `pnpm build`: aprovados.

## Pendente Preview/final

- Confirmar transação e auditoria em Neon, duas sessões concorrentes e ocultação/restauração em publicação aberta.
- Confirmar ausência completa no público após recarga, sem espaço de moderação, e restauração com mesma autoria/data.
- Validar foco, teclado, leitor de tela, temporizador de desfazer, celular e falha de rede.
