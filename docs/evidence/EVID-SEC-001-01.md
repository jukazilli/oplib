# EVID-SEC-001-01 — Regressão de segurança

Estado: `in_progress`.

## Proveniência de mutações públicas

- `src/lib/security/request.ts` centraliza a checagem: `Origin` deve coincidir exatamente com a origem da requisição; `Sec-Fetch-Site`, quando presente, deve ser `same-origin`; sem ambos, um `Referer` presente também deve coincidir. Ausência de todos os sinais permanece aceita para clientes legados.
- As rotas POST de curtida e comentário executam a checagem antes de identificar visitante, limitar ou persistir.
- `tests/unit/security.test.ts`, `tests/unit/like-route.test.ts` e `tests/unit/comments-route.test.ts` cobrem sinais conflitantes, cross-site sem `Origin`, mesmo site de outra origem, `Referer` divergente e tráfego legítimo. Resultado isolado: 3 arquivos, 23 testes aprovados.
- Validação completa sequencial: 46 arquivos, 192 testes, lint, typecheck e build aprovados.
- Política alinhada à [orientação OWASP para Fetch Metadata e fallback de origem](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Limites da prova

- Cabeçalhos ausentes de clientes legados ainda são aceitos; `Sec-Fetch-Site` é defesa contra requisições de navegador, não autenticação de cliente.
- Restam corpus de segurança completo, testes em Preview, WAF e aceite de produção. Esta evidência não aprova SEC-001 nem GATE-MVP.

## Auditoria de dependências

- `pnpm audit --prod` em 21/09/2026: dois alertas **moderados**, nenhum alto ou crítico. Ambos vêm de `@clerk/ui@1.33.1` → adaptadores Solana → `@solana/web3.js@1.99.0` → `jayson@4.3.0`: `uuid@8.3.2` ([GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)) e `stream-json@1.9.1` ([GHSA-528h-pc64-c93x](https://github.com/advisories/GHSA-528h-pc64-c93x)).
- `pnpm audit --prod --audit-level high` saiu com código 0, mas ainda informou os dois moderados. `.github/workflows/ci.yml` passa a executar o mesmo comando após instalação congelada; a execução remota do novo job ainda precisa ser observada.
- `pnpm format:check` e `node scripts/validate-repository.mjs` passaram localmente. A formatação mecânica adicional normalizou arquivos canônicos e snapshots sem alterar seus valores; `pnpm db:check` passou com uma URL PostgreSQL sintética apenas para satisfazer a validação de configuração, sem conexão com banco real.
- Validação final local do corte: 46 arquivos, 192 testes, lint, typecheck e build aprovados. O teste de metadados do editor manteve as mesmas asserções e recebeu limite próprio de 15 segundos após exceder de forma intermitente o padrão de 5 segundos na suíte completa; isolado e na repetição completa, passou.
- A aplicação importa `@clerk/ui/themes` e CSS do tema, não os adaptadores Solana diretamente. Isso **não prova** ausência de exposição transitiva. Não foi aplicada atualização major forçada a `uuid` ou `stream-json` sob `jayson` sem teste de compatibilidade.
- Os dois alertas moderados exigem revisão de alcance e resolução ou aceite formal antes de encerrar SEC-001. A auditoria deve ser repetida no gate final, pois a base de avisos muda com o tempo.

## Contrato de payload dos comentários

- A rota pública exige `application/json`, aceitando parâmetros como `charset=utf-8`; outros tipos retornam `415` com orientação curta.
- JSON malformado retorna `400`, separado de falhas reais de infraestrutura. Corpo declarado ou efetivamente acima de 10 KB é recusado antes do parse.
- Esses erros não identificam visitante, não consomem rate limit, não persistem comentário e não geram evento de falha operacional. Todas as respostas são `no-store` e não ecoam o payload.
- `tests/unit/comments-route.test.ts`: 7 testes aprovados, incluindo tipo incompatível, JSON truncado, limite declarado, limite efetivo e ausência de efeitos colaterais.
- Validação completa do corte: 46 arquivos, 194 testes, format check, lint, typecheck e build aprovados.
- Ainda faltam prova em Preview e os demais grupos do corpus SEC-001; esta seção não encerra a regressão de segurança.

## Regressão das rotas de capa

- `tests/unit/cover-routes.test.ts` exercita diretamente preparação de pathname, callbacks do protocolo de upload e remoção administrativa.
- Sessão ausente retorna `401`; identidade fora da allowlist retorna `404`; ambas são genéricas e `no-store`.
- O token só é emitido após autorização e restringe o namespace a UUID gerado, JPEG/PNG/WebP/AVIF, 5 MB e `allowOverwrite: false`.
- Caminho com travessia é recusado. Após o upload, bytes incompatíveis com o MIME declarado fazem o blob ser removido e o comando falhar sem sucesso falso.
- Corpo do protocolo acima de 64 KB retorna `413` antes de chamar o Blob. Remoção fora do prefixo do ambiente não alcança a rotina destrutiva.
- Todas as respostas dessas rotas passaram a declarar `Cache-Control: no-store`, inclusive sucesso e erros não autorizativos.
- Validação do corte: 3 arquivos e 21 testes direcionados; suíte completa com 47 arquivos e 202 testes; format check, lint, typecheck e build aprovados.
- A prova local não substitui o teste autenticado do Blob real, segregação Preview/Production nem inspeção de objeto no Preview.

## Conteúdo não confiável

- O pipeline compartilhado por prévia e publicação ignora HTML bruto e sanitiza URLs. O corpus cobre `javascript:`, variação de maiúsculas, `data:`, `vbscript:` e `file:` sem `href` navegável.
- Imagens inline não fazem parte dos elementos Markdown aprovados e contornariam o fluxo gerenciado de capa. O componente `img` agora não cria requisição remota: apresenta somente `Imagem: {texto alternativo}`; o editor orienta `Imagens no texto não são exibidas. Use a capa.` para sintaxe inline ou por referência.
- O texto é curto, voltado à ação e não expõe detalhes do pipeline. Nenhum novo bloco explicativo foi adicionado à interface.
- Autor e corpo maliciosos de comentários permanecem texto literal tanto na leitura pública quanto na moderação administrativa; scripts, imagens, Markdown e URLs não viram elementos ativos.
- Validação do corte: 4 arquivos e 20 testes direcionados; suíte completa com 47 arquivos e 209 testes; format check, lint, typecheck e build aprovados.
- Restam validação em navegador/Preview e os demais grupos de SEC-001; testes de DOM não equivalem a uma auditoria dinâmica completa de XSS.

## Consultas parametrizadas

- A composição de filtros da pesquisa pública foi isolada em `buildPublicSearchWhere`, mantendo exatamente a mesma consulta usada por `searchPublications`.
- `tests/unit/search-query-security.test.ts` compila o objeto SQL com o dialeto PostgreSQL e injeta aspas, wildcard, tautologia, múltiplas instruções e comentário SQL em busca, área, categoria e tag.
- O SQL compilado contém placeholders e nenhum trecho do ataque; busca, filtros, tipo e ano aparecem somente em `params`. O contrato de URL continua rejeitando slugs fora de `[a-z0-9-]` e limita a busca a 120 caracteres.
- A varredura dos repositórios encontrou uso dos operadores parametrizados do Drizzle e templates `sql`; não encontrou `sql.raw`. Essa prova cobre composição e compilação, mas o corpus ainda deve ser repetido contra PostgreSQL isolado no Preview.
- Validação do corte: 2 arquivos e 3 testes direcionados; suíte completa com 48 arquivos e 210 testes; format check, lint, typecheck e build aprovados.

## Rate limit local de comentários

- A regra permanece em três tentativas por visitante pseudônimo em uma janela móvel de cinco minutos, sem persistir IP bruto.
- O estado em memória agora aceita no máximo 10.000 visitantes com janela ativa. Ao atingir o teto, janelas totalmente vencidas são removidas; se todas ainda estiverem ativas, uma nova chave é recusada de forma fechada, sem ampliar a memória.
- Visitantes já rastreados continuam sujeitos ao próprio contador mesmo com o mapa cheio. `tests/unit/comments-rate-limit.test.ts` cobre janela, isolamento, teto, falha fechada e recuperação de espaço vencido.
- O limite local é uma proteção por instância e pode ser contornado por rotação de cookie ou distribuição entre instâncias. O WAF deve impor limites distintos para comentários e curtidas no Preview antes da promoção.
- Validação do corte: 3 testes direcionados; suíte completa com 48 arquivos e 212 testes; format check, lint, typecheck e build aprovados.
- Ainda devem ser verificados no Preview o `429`, a mensagem preservando o formulário, o reset após cinco minutos e o comportamento da borda. Esta seção não aprova SEC-001 nem o WAF.

## Autorização administrativa e exposição de segredos

- `tests/unit/admin-mutation-authorization.test.ts` percorre as oito Server Actions de taxonomia, moderação e publicação. Quando a autorização falha, todas rejeitam antes de validar o corpo, chamar repositório ou invalidar cache.
- As rotas administrativas de capa permanecem cobertas diretamente por `tests/unit/cover-routes.test.ts`, incluindo sessão ausente, identidade fora da allowlist e ausência de emissão, remoção ou token.
- `scripts/check-tracked-secrets.mjs` examina arquivos versionados sem dependência adicional e falha para variável sensível preenchida, URL PostgreSQL com credenciais, chave Clerk, token Blob ou chave privada. Arquivos binários e o lockfile são ignorados; `.env.example` vazio é aceito.
- O scanner registra somente caminho, linha e categoria, nunca o trecho nem o valor. `tests/unit/secret-scan.test.ts` prova tanto o repositório limpo quanto a falha com fixture, inclusive ausência do valor na saída.
- O job `Quality` executa `pnpm security:secrets` depois da instalação e antes dos checks de código. A varredura complementa — não substitui — GitHub Secret Scanning, CodeQL, separação server/client e rotação imediata após exposição.
- A fronteira pública continua coberta por `tests/unit/env.test.ts`; erros de infraestrutura continuam saneados por `tests/unit/observability.test.ts`. A execução remota do novo gate ainda deve ser observada antes de encerrar SEC-001.
- Após o build, os 36 arquivos de `.next/static` também passaram pelo scanner sem valor sensível. Dependências Clerk e Vercel Blob incluem os nomes `CLERK_SECRET_KEY` e `BLOB_READ_WRITE_TOKEN` e rotinas genéricas de parsing PEM no código distribuído, mas não seus valores; nome de configuração e implementação de biblioteca não constituem credencial.
- Validação do corte: 50 arquivos e 215 testes, scanner de 308 arquivos versionados e 36 artefatos estáticos, format check, lint, typecheck e build aprovados.

## Resolução dos alertas transitivos de tema

- A aplicação importava diretamente de `@clerk/ui` somente o objeto `shadcn` e uma diretiva Tailwind `@source`; os pacotes Solana, `jayson`, `uuid` e `stream-json` eram transitivos. A ausência de importação direta não bastava para provar ausência de risco no pacote instalado.
- Forçar `uuid@11` e `stream-json@3` sob `jayson@4.3.0` ultrapassaria os intervalos declarados `^8.3.2` e `^1.9.1`. Em vez de aceitar o risco ou introduzir overrides incompatíveis, `@clerk/ui` foi removido.
- `src/modules/identity/theme.ts` preserva o objeto mínimo do tema shadcn usado pelo `ClerkProvider`: nome, camada, tokens e classes são equivalentes à versão 1.33.1. A antiga diretiva CSS apenas apontava o Tailwind ao mesmo arquivo; o módulo local já pertence a `src/` e é descoberto pelo build.
- `tests/unit/auth-theme.test.ts` fixa o contrato de tokens/classes essenciais e o build gera CSS a partir do módulo local. Isso não equivale a comparação visual: o aceite em Preview deverá comparar login, perfil e sessão expirada em viewport amplo/compacto, foco, contraste e estados de erro.
- `pnpm audit --prod --json` passou de 622 dependências e dois alertas moderados para 268 dependências e zero alertas conhecidos. `pnpm why @clerk/ui` e `pnpm why jayson` não retornam cadeia instalada.
- A solução segue o formato de tema documentado pelo Clerk, mas o objeto passa a ser mantido pelo OPALIB. Atualizações futuras do SDK devem revisar o contrato local antes de alterar aparência ou remover tokens.
- PR draft [#35](https://github.com/jukazilli/oplib/pull/35), commit `7f710b3`: em 22/09/2026, `Quality` aprovou a auditoria sem vulnerabilidades conhecidas, o scanner de 310 arquivos, os 216 testes, lint, typecheck e build. `CodeQL`, política do repositório e deploy Vercel também passaram. O estado `READY` não substitui smoke autenticado, comparação visual, corpus em banco real nem WAF.

## Primeiro smoke no Preview protegido

- O deployment imutável do commit `1a4ae86` foi identificado pela API Vercel. `/api/health` respondeu `200`, `healthy`, `database: true`, versão correspondente ao commit, `Cache-Control: no-store`, CSP Report-Only e headers defensivos.
- Em navegador real com acesso temporário ao Preview, a home carregou e exibiu o estado vazio do acervo; `/sign-in` exibiu o formulário Clerk sem expor administração na navegação pública. Não foram enviadas credenciais nem mutações.
- O navegador mostrou `404` nos prefetched destinos `/areas` e `/sobre`. `/sobre` pertence a WEB-006 e depende de DEC-002; `/areas` consta no contrato do shell WEB-001, mas ainda não há rota nem slice próprio. Esses destinos não podem ser tratados como navegação aprovada no gate final.
- A tela Clerk exibiu controles em inglês apesar da moldura em português. A correção está no corte AUTH-001 de localização, com prova local e nova validação remota pendente.
- Não foram executados corpus malicioso contra PostgreSQL, teste autenticado nem WAF; o health check não prova esses itens.
- A localização de controles autorais da entrada foi corrigida e observada no Preview do PR #36; isso não altera os controles de segurança nem encerra o corpus SEC-001.

## Corpus negativo no Preview

- O smoke remoto passa a chamar curtidas e comentários com `Origin` divergente e `Sec-Fetch-Site: cross-site`, usando slug inexistente para provar que a recusa `403` acontece antes de consulta, cookie ou persistência.
- O endpoint de comentários também recebe mídia `text/plain` e JSON truncado; deve responder `415`/`400`, `no-store`, sem `Set-Cookie` e sem depender de publicação existente.
- A rota de curtidas foi alinhada ao contrato defensivo: respostas de proveniência inválida e publicação indisponível agora também declaram `Cache-Control: no-store`.
- Pendente: observar o corpus no Preview, testar publicação real, rate limit e limites distribuídos do WAF antes de encerrar SEC-001.
