# EVID-PUB-004-01 — Publicação e atualização

- **Estado:** evidência parcial; PUB-004 ainda não concluída.

## Provas locais

- `publishInputSchema` exige título, resumo, Markdown, tipo, área e versão salva; rascunhos continuam incompletos.
- `publishPublication` usa status e `updatedAt` esperados; conteúdo, relações, data e auditoria de sucesso são confirmados na mesma transação.
- Uma tentativa repetida com composição idêntica já publicada é reconhecida como sucesso; conteúdo diferente continua produzindo conflito real.
- A investigação no banco de Preview encontrou 6 rascunhos e confirmou frações de microssegundo em `updated_at` nos 6. O transporte por `Date`/JSON preserva somente milissegundos, por isso a antiga igualdade exata produzia conflito falso antes de qualquer publicação.
- A comparação otimista passou a usar a janela fechada/aberta do milissegundo transportado (`>= versão` e `< versão + 1 ms`) em salvar, publicar/atualizar, retirar/republicar e destacar. Uma consulta `READ ONLY` confirmou que os 6 rascunhos existentes são reconhecidos pela nova janela, sem ler nem alterar conteúdo.
- Novos rascunhos gravam `updatedAt` explicitamente a partir de `Date`, evitando criar nova fração não representável pelo cliente. O teste do composer comprova que um rascunho salvo é retomado e envia seu ID/versão persistidos ao publicar.
- O composer diferencia salvar rascunho, publicar e atualizar; confirmação nomeia o título e a consequência.
- `revalidatePath` roda somente após sucesso e cobre administração, lista pública e slug novo/anterior.
- Validação atual: 59 arquivos e 234 testes aprovados, inclusive retomada do rascunho salvo, falha de cache após commit e a regressão da janela de versão.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm format:check` e `git diff --check`: aprovados após o corte local.

## Pendências de aceite

- Verificação em banco `preview` de publicação, atualização, concorrência e rollback, com auditoria saneada.
- Verificação responsiva/autenticada do fluxo; a automação desta sessão não encontrou Chrome nem navegador interno disponível. O bloqueio local contra duplo envio foi coberto no componente e os testes do fluxo passaram.
- Repetir no Preview autenticado com um dos rascunhos existentes: abrir, continuar a edição e publicar sem receber comparação; em uma segunda sessão, alterar de fato a mesma publicação e confirmar que o conflito continua aparecendo.
- A rota pública `/publicacoes/[slug]` já existe em WEB-004; falta confirmar a navegação com uma publicação real no Preview.
- Migration AUD-001 ainda não aplicada em produção.
