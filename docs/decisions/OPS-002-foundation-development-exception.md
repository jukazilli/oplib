# OPS-002 — Exceção de continuidade da Fundação para desenvolvimento

- **Estado:** aprovado
- **Data:** 20 de setembro de 2026
- **Responsável:** Juliano Zilli
- **Afeta:** FND-012, FND-015, FND-016, `GATE-FND` e início dos itens funcionais

## Contexto

O MVP terá poucos conteúdos durante o desenvolvimento e continuará restrito a dados sintéticos ou reconstruíveis. Antecipar agora a custódia de chave offline, o backup criptografado e o drill de restauração aumentaria a complexidade antes de existir risco proporcional de perda de conteúdo real.

A máquina de desenvolvimento não é considerada persistente: ela pode ser apagada ou formatada a qualquer momento. Isso não representa suspeita de comprometimento. Código, documentação e automação permanecem versionados no GitHub; recursos integrados permanecem em Vercel, Neon e Clerk.

## Decisão

- A FND-015 permanece `planned` e fica congelada por decisão de escopo.
- O PR #15 permanece em draft para preservar a implementação já preparada sem integrá-la ao corte atual.
- O Vercel Blob continua sendo o armazenamento de capas do MVP.
- A avaliação de Cloudflare R2 para capas e Backblaze B2 para recuperação fica adiada para um corte futuro de infraestrutura.
- A FND-016 pode aprovar a Fundação somente para desenvolvimento e Preview, por exceção explícita.
- O `GATE-FND` não autoriza Production enquanto FND-012, FND-015 e DEC-004 não estiverem integralmente resolvidos.

## Guardas obrigatórias

- usar apenas conteúdo sintético, reconstruível ou mantido também em fonte externa durante a exceção;
- não executar migration destrutiva;
- não habilitar exclusões permanentes dependentes de recuperação;
- não promover Production;
- manter ambientes e segredos segregados;
- retomar a FND-015 antes do go-live ou antes de armazenar conteúdo real insubstituível, o que ocorrer primeiro.

## Impacto aceito

Durante a exceção não existe RPO de 24 horas nem RTO de 4 horas comprovado para o banco. Perda da branch de Preview poderá exigir recriação por migrations e novos dados sintéticos. Esse risco é aceito apenas porque o ambiente não é produtivo e não deve conter conteúdo insubstituível.

## Critério de encerramento da exceção

A exceção termina quando backup criptografado, retenção e restore em branch temporária forem comprovados por `EVID-FND-015-01`, ou quando outra estratégia de recuperação for aprovada e testada documentalmente.
