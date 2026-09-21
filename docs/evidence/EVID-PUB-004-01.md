# EVID-PUB-004-01 — Publicação e atualização

- **Estado:** evidência parcial; PUB-004 ainda não concluída.

## Provas locais

- `publishInputSchema` exige título, resumo, Markdown, tipo, área e versão salva; rascunhos continuam incompletos.
- `publishPublication` usa status e `updatedAt` esperados; conteúdo, relações, data e auditoria de sucesso são confirmados na mesma transação.
- O composer diferencia salvar rascunho, publicar e atualizar; confirmação nomeia o título e a consequência.
- `revalidatePath` roda somente após sucesso e cobre administração, lista pública e slug novo/anterior.
- `npm test`: 24 arquivos, 100 testes aprovados, inclusive falha de cache após commit.
- `npm run lint`, `npm run typecheck`, `npm run build` e `git diff --check`: aprovados após o corte local.

## Pendências de aceite

- Verificação em banco `preview` de publicação, atualização, concorrência e rollback, com auditoria saneada.
- Verificação responsiva/autenticada do fluxo e confirmação de duplo envio.
- A rota pública `/publicacoes/[slug]` é parte de WEB-004 e ainda não existe. A ação devolve o endereço reservado, mas não se deve apresentá-lo como página já acessível.
- Migration AUD-001 ainda não aplicada em produção.
