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
- O Preview do commit `42285d4` ficou verde. A execução remota [`35778154721`](https://github.com/jukazilli/oplib/actions/runs/35778154721) aprovou os 11 testes E2E em 15,4 s e as 9 medições Lighthouse; ela comprova ausência de regressão pública, mas não executa publicação autenticada nem substitui o aceite abaixo.
- Depois da ação humana de publicação, a consulta saneada do Preview encontrou 6 posts: 1 público, 3 rascunhos e 2 retirados. O run [`35858970051`](https://github.com/jukazilli/oplib/actions/runs/35858970051) abriu a publicação real pela listagem pública e aprovou leitura, canonical, comentários, axe e largura de 320 px. Essa é prova do estado público resultante, não da atomicidade interna do comando.

## Pendências de aceite

- Verificação em banco `preview` de publicação, atualização, concorrência e rollback, com auditoria saneada.
- Verificação responsiva/autenticada do fluxo; a automação desta sessão não encontrou Chrome nem navegador interno disponível. O bloqueio local contra duplo envio foi coberto no componente e os testes do fluxo passaram.
- Repetir no Preview autenticado com um dos rascunhos existentes: abrir, continuar a edição e publicar/atualizar sem receber comparação; repetir o envio idêntico e, em uma segunda sessão, alterar de fato a mesma publicação para confirmar que o conflito continua aparecendo.
- A navegação pública de uma publicação real já foi comprovada; falta correlacionar o comando administrativo com auditoria, versão e invalidação sem registrar conteúdo editorial.
- Migration AUD-001 ainda não aplicada em produção.
