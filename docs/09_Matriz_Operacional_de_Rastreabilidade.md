---
document_id: DOC-09
title: Matriz Operacional de Rastreabilidade — OPALIB
status: canonical
version: 1.0.0
date: 2026-09-20
approved_by: Juliano Zilli
depends_on:
  - DOC-08
  - all-canonical-baseline-documents
governs:
  - requirement-to-code-traceability
  - test-traceability
  - evidence-traceability
  - delivery-state
---

# Matriz Operacional de Rastreabilidade — OPALIB

## 1. Objetivo

Conectar cada decisão e item do backlog canônico à sua origem, destino de implementação, testes, evidências e estado real de entrega.

Na versão inicial desta matriz ainda não existe implementação. Por isso:

- “Destino previsto” indica onde o item deverá ser materializado;
- “Implementação atual” permanece `—` até existir código, configuração ou decisão aprovada;
- testes listados são contratos previstos, não resultados;
- evidências listadas são identificadores esperados, não provas já produzidas;
- nenhum item recebe `done` por possuir apenas documentação.

## 2. Fontes e autoridade

| Código | Fonte canônica                                                   | Autoridade                                |
| ------ | ---------------------------------------------------------------- | ----------------------------------------- |
| D02    | `docs/02_Briefing_de_Produto_e_Escopo.md`                        | escopo e regras do produto                |
| D03    | `docs/03_Visao_de_Product_Owner.md`                              | valor, prioridade e trade-offs            |
| PUX    | `docs/Principios_de_UX_UI.md`                                    | princípios de experiência                 |
| D04    | `docs/04_Direcao_de_UI_e_Design_System.md`                       | direção visual e componentes              |
| D05    | `docs/05_Especificacao_de_UX_e_Fluxos.md`                        | fluxos, estados e feedback                |
| D06    | `docs/06_Tecnicas_de_Desenvolvimento.md`                         | práticas e quality gates                  |
| D07    | `docs/07_Engenharia_e_Arquitetura.md`                            | arquitetura, módulos e invariantes        |
| TL     | `docs/Visao_do_Tech_Lead.md`                                     | stack e toolchain                         |
| INF    | `docs/Infraestrutura_e_Plano_de_Fundacao.md`                     | serviços, ambientes e Fundação            |
| D08    | `docs/08_Backlog_Canonico_Rastreabilidade_e_Plano_de_Entrega.md` | itens, ordem, critérios, testes e estados |
| D09    | este documento                                                   | localização operacional e evidência real  |

D08 é a fonte canônica do backlog. D09 é a projeção operacional e deve ser atualizada no mesmo pull request sempre que estado, implementação, testes ou evidências mudarem.

## 3. Convenções operacionais

### 3.1. Destinos previstos

| Prefixo                | Localização principal                         |
| ---------------------- | --------------------------------------------- |
| aplicação              | `src/app/`                                    |
| componentes            | `src/components/`                             |
| módulos                | `src/modules/`                                |
| infraestrutura interna | `src/lib/` e arquivos de configuração na raiz |
| migrations             | `drizzle/` e `src/lib/db/`                    |
| integração             | `tests/integration/`                          |
| E2E                    | `tests/e2e/`                                  |
| automação              | `.github/workflows/`                          |
| runbooks               | `docs/runbooks/`                              |
| decisões               | `docs/decisions/`                             |
| evidências duráveis    | `docs/evidence/`                              |

Os caminhos são planejados e podem ser refinados sem alterar a arquitetura, desde que a matriz e as fronteiras canônicas sejam atualizadas.

### 3.2. Evidências

Cada `EVID-*` deverá apontar para prova segura, como:

- pull request e commit;
- execução de CI;
- relatório de teste;
- migration aplicada em ambiente identificado;
- URL de Preview ou Production;
- status de deployment;
- relatório de restore;
- aceite humano;
- captura sem segredo ou dado pessoal desnecessário.

Quando uma evidência externa puder expirar, `docs/evidence/<ID>.md` preservará data, commit, resultado, hash quando aplicável e link original. Artefatos pesados não serão adicionados ao Git sem necessidade.

### 3.3. Estados

Os estados seguem D08: `ready`, `planned`, `blocked-human`, `in-progress`, `review`, `done` e `cancelled`.

Um item só pode mudar para `done` se os campos “Implementação atual”, “Testes” e “Evidência” apontarem para resultados reais e os critérios de D08 estiverem satisfeitos.

## 4. Estado inicial

| Estado          | Quantidade | Observação                                 |
| --------------- | ---------: | ------------------------------------------ |
| `ready`         |          0 | nenhum item aguardando início imediato     |
| `planned`       |         46 | aguardam ordem e dependências              |
| `blocked-human` |          5 | DEC-001 a DEC-004 e CNT-001                |
| `in-progress`   |          0 | nenhum item em execução                    |
| `review`        |          0 | nenhuma entrega em validação               |
| `done`          |          4 | FND-001 a FND-004 concluídos e comprovados |
| `cancelled`     |          0 | nenhum item removido                       |

Total: 55 itens permanentes.

## 5. Decisões humanas

| ID      | Origem                    | Requisito                                         | Destino previsto            | Implementação atual | Testes previstos  | Evidência esperada | Status          |
| ------- | ------------------------- | ------------------------------------------------- | --------------------------- | ------------------- | ----------------- | ------------------ | --------------- |
| DEC-001 | D02 §20; INF §10          | decidir domínio ou confirmar `vercel.app`         | `docs/decisions/DEC-001.md` | —                   | `TEST-DEC-001-01` | `EVID-DEC-001-01`  | `blocked-human` |
| DEC-002 | D02 §20; D04 §19; D05 §3  | aprovar Sobre, licença, contato e privacidade     | `docs/decisions/DEC-002.md` | —                   | `TEST-DEC-002-01` | `EVID-DEC-002-01`  | `blocked-human` |
| DEC-003 | D02 §20; D07 §10; INF §19 | definir retenção após exclusão de comentário      | `docs/decisions/DEC-003.md` | —                   | `TEST-DEC-003-01` | `EVID-DEC-003-01`  | `blocked-human` |
| DEC-004 | TL §8; INF §13            | aprovar Clerk Pro ou reabrir autenticação com MFA | `docs/decisions/DEC-004.md` | —                   | `TEST-DEC-004-01` | `EVID-DEC-004-01`  | `blocked-human` |

## 6. Fundação

| ID      | Origem                           | Requisito                                     | Destino previsto                                                                  | Implementação atual                                                                                          | Testes previstos                     | Evidência esperada                 | Status        |
| ------- | -------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------- | ------------- |
| FND-001 | D06 §§20–23; INF §§9,24          | proteger e preparar o repositório             | `.github/`, `README.md`, ruleset GitHub                                           | `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/`, `scripts/validate-repository.mjs`                 | `TEST-FND-001-01`, `TEST-FND-001-02` | `docs/evidence/EVID-FND-001-01.md` | `done`        |
| FND-002 | TL §§4–6,20; INF §24             | materializar Next.js, Node, TypeScript e pnpm | `package.json`, lockfile, `src/app/`, configs raiz                                | `package.json`, `pnpm-lock.yaml`, `.nvmrc`, `.node-version`, `tsconfig.json`, `next.config.ts`, `src/app/`   | `TEST-FND-002-01`, `TEST-FND-002-02` | `docs/evidence/EVID-FND-002-01.md` | `done`        |
| FND-003 | PUX; D04; TL §9                  | criar tokens, UI-base e ferramentas de teste  | `src/styles/`, `src/components/ui/`, configs de teste                             | `src/app/styles.css`, `src/components/ui/`, `eslint.config.mjs`, `vitest.config.mts`, `playwright.config.ts` | `TEST-FND-003-01`, `TEST-FND-003-02` | `docs/evidence/EVID-FND-003-01.md` | `done`        |
| FND-004 | D06 §14; TL §22; INF §18         | validar configuração e segredos               | `.env.example`, `src/lib/env/`, `.gitignore`                                      | `.env.example`, `src/lib/env/`, `.gitignore`, `docs/runbooks/configuration.md`                               | `TEST-FND-004-01`, `TEST-FND-004-02` | `docs/evidence/EVID-FND-004-01.md` | `done`        |
| FND-005 | D07 §§22–23; TL §7; INF §§7–8,11 | provisionar Neon e branches em São Paulo      | Neon + `docs/runbooks/neon.md`                                                    | projeto Neon em São Paulo, branches isoladas e conexão direta separada da pooled                             | `TEST-FND-005-01`, `TEST-FND-005-02` | `docs/evidence/EVID-FND-005-01.md` | `done`        |
| FND-006 | D06 §16; D07 §§10–11; INF §12    | configurar schema, constraints e migrations   | `src/lib/db/`, `drizzle/`, `drizzle.config.ts`, `scripts/verify-database.mjs`     | schema aplicado e validado em `development` e `preview`                                                      | `TEST-FND-006-*`                     | `docs/evidence/EVID-FND-006-01.md` | `done`        |
| FND-007 | D02 §13; TL §§5–6; INF §§7,10    | vincular Vercel em `gru1`                     | Vercel, `vercel.json`, `docs/runbooks/vercel.md`                                  | projeto vinculado, Preview `Ready` em `gru1` e Neon Preview isolado                                          | `TEST-FND-007-*`                     | `docs/evidence/EVID-FND-007-01.md` | `done`        |
| FND-008 | D07 §16; TL §8; INF §13          | configurar Clerk, allowlist e MFA             | Clerk + `src/modules/identity/`                                                   | Clerk dev restrito; admin permitido e segunda identidade negada; produção condicionada à DEC-004             | `TEST-FND-008-*`                     | `docs/evidence/EVID-FND-008-01.md` | `done`        |
| FND-009 | D02 §8.4; D07 §19; INF §14       | configurar Blob público para capas            | Vercel Blob + `src/modules/media/`                                                | store Preview público em `gru1`; upload administrativo e negação anônima comprovados                         | `TEST-FND-009-*`                     | `docs/evidence/EVID-FND-009-01.md` | `done`        |
| FND-010 | D06 §20; TL §20; INF §16         | configurar CI de pull request                 | `.github/workflows/ci.yml`                                                        | CI verde; falha de formato bloqueada; check `Quality` obrigatório no ruleset de `main`                       | `TEST-FND-010-*`                     | `docs/evidence/EVID-FND-010-01.md` | `done`        |
| FND-011 | D06 §18.3; TL §19; INF §16       | configurar E2E, axe e smoke                   | `playwright.config.ts`, `tests/e2e/foundation.spec.ts`                            | smoke público, proteção administrativa e axe aprovados no Preview                                            | `TEST-FND-011-*`                     | `docs/evidence/EVID-FND-011-01.md` | `done`        |
| FND-012 | D06 §§20–21; INF §§16–17         | configurar release e rollback                 | `.github/workflows/release.yml`, runbook                                          | workflow manual e ensaio Preview aprovados; rollback produtivo aguarda go-live                               | `TEST-FND-012-*`                     | `docs/evidence/EVID-FND-012-01.md` | `in-progress` |
| FND-013 | D02 §11; D07 §24; INF §19        | aplicar baseline de segurança                 | `src/lib/security/`, headers, Vercel Firewall                                     | headers e payload aprovados; regra WAF Preview ativa em modo log                                             | `TEST-FND-013-*`                     | `docs/evidence/EVID-FND-013-01.md` | `done`        |
| FND-014 | D06 §13; D07 §21; INF §20        | configurar logs, health e alertas             | `src/lib/observability/`, `src/app/api/health/route.ts`                           | health Neon, logs saneados e drill de alerta comprovados no Preview                                          | `TEST-FND-014-*`                     | `docs/evidence/EVID-FND-014-01.md` | `done`        |
| FND-015 | D07 §23; INF §§14–15             | criar backup criptografado e provar restore   | `.github/workflows/backup.yml`, `scripts/`, `docs/runbooks/backup-and-restore.md` | automação local pronta; backup e restore reais pendentes                                                     | `TEST-FND-015-*`                     | `docs/evidence/EVID-FND-015-01.md` | `in-progress` |
| FND-016 | TL §26; INF §§25–26              | executar aceite integrado da Fundação         | `docs/tasks/FND-016.md`, `docs/evidence/EVID-FND-016-01.md`                       | Fundação aprovada para desenvolvimento/Preview por `OPS-002`; Production bloqueada                           | `TEST-FND-016-01`                    | `docs/evidence/EVID-FND-016-01.md` | `done`        |

## 7. Identidade e administração

| ID       | Origem                   | Requisito                                           | Destino previsto                                              | Implementação atual | Testes previstos  | Evidência esperada | Status    |
| -------- | ------------------------ | --------------------------------------------------- | ------------------------------------------------------------- | ------------------- | ----------------- | ------------------ | --------- |
| AUTH-001 | D02 §9; D05 §10; D07 §16 | entrar e sair da administração                      | `src/app/admin/`, `src/components/admin/`, `src/modules/identity/` | login/logout explícitos, erro genérico e cadastro ausente; aceite autenticado aprovado | `TEST-AUTH-001-*` | `docs/evidence/EVID-AUTH-001-01.md` | `done` |
| AUTH-002 | D05 §10; D07 §16; TL §8  | proteger sessão, rotas e comandos                   | `src/proxy.ts`, `src/modules/identity/authorization.ts`       | —                   | `TEST-AUTH-002-*` | `EVID-AUTH-002-01` | `planned` |
| ADM-001  | D04 §§20–23; D05 §§3,11  | criar shell e visão geral administrativa            | `src/app/(admin)/admin/`, `src/components/admin/`             | —                   | `TEST-ADM-001-*`  | `EVID-ADM-001-01`  | `planned` |
| ADM-002  | D05 §3; D02 §20; D04 §19 | materializar configurações institucionais aprovadas | `src/app/(admin)/admin/configuracoes/` ou conteúdo versionado | —                   | `TEST-ADM-002-*`  | `EVID-ADM-002-01`  | `planned` |

## 8. Taxonomia e publicação

| ID      | Origem                                | Requisito                                       | Destino previsto                                            | Implementação atual | Testes previstos | Evidência esperada | Status    |
| ------- | ------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------- | ------------------- | ---------------- | ------------------ | --------- |
| TAX-001 | D02 §§8.1–8.3; D04 §6; D07 §§9.2,10   | criar áreas de conhecimento estáveis            | `src/modules/taxonomy/`, migration/seed                     | —                   | `TEST-TAX-001-*` | `EVID-TAX-001-01`  | `planned` |
| TAX-002 | D02 §9; D05 §20; D07 §9.2             | administrar categorias e tags                   | `src/modules/taxonomy/`, `src/app/(admin)/admin/taxonomia/` | —                   | `TEST-TAX-002-*` | `EVID-TAX-002-01`  | `planned` |
| PUB-001 | D02 §§9–10; D05 §§12–13               | criar e salvar rascunho manualmente             | `src/modules/publishing/`, editor admin                     | —                   | `TEST-PUB-001-*` | `EVID-PUB-001-01`  | `planned` |
| PUB-002 | D02 §10; D05 §§13–14; D07 §12; TL §10 | editar e pré-visualizar Markdown seguro         | `src/lib/markdown/`, `src/components/editor/`               | —                   | `TEST-PUB-002-*` | `EVID-PUB-002-01`  | `planned` |
| PUB-003 | D02 §§8.2–8.3; D05 §12; D07 §10       | manter metadados, referências e slug            | `src/modules/publishing/`, schema/migrations                | —                   | `TEST-PUB-003-*` | `EVID-PUB-003-01`  | `planned` |
| MED-001 | D02 §8.4; D05 §19; D07 §19            | enviar, substituir e remover capa               | `src/modules/media/`, componentes de upload                 | —                   | `TEST-MED-001-*` | `EVID-MED-001-01`  | `planned` |
| PUB-004 | D05 §§15–16; D07 §§11,18              | publicar e atualizar atomicamente               | `src/modules/publishing/actions/`, cache tags               | —                   | `TEST-PUB-004-*` | `EVID-PUB-004-01`  | `planned` |
| PUB-005 | D05 §17; D07 §§11,18                  | retirar e republicar, invalidando cache         | `src/modules/publishing/actions/`                           | —                   | `TEST-PUB-005-*` | `EVID-PUB-005-01`  | `planned` |
| PUB-006 | D02 §§8.1,9; D04 §14; D07 §9.1        | definir destaque editorial                      | `src/modules/publishing/`, home cache                       | —                   | `TEST-PUB-006-*` | `EVID-PUB-006-01`  | `planned` |
| PUB-007 | D02 §9; D04 §21; D05 §11              | listar e localizar publicações na administração | `src/app/(admin)/admin/publicacoes/`                        | —                   | `TEST-PUB-007-*` | `EVID-PUB-007-01`  | `planned` |
| PUB-008 | D05 §18; D07 §§11,15                  | excluir publicação com guardas e transação      | `src/modules/publishing/actions/delete-post.ts`             | —                   | `TEST-PUB-008-*` | `EVID-PUB-008-01`  | `planned` |
| AUD-001 | D02 §11; D07 §§10,16; D06 §13         | registrar eventos administrativos mínimos       | `src/modules/identity/audit/`, schema/migration             | —                   | `TEST-AUD-001-*` | `EVID-AUD-001-01`  | `planned` |

## 9. Experiência pública e descoberta

| ID      | Origem                                 | Requisito                                      | Destino previsto                                           | Implementação atual | Testes previstos | Evidência esperada | Status    |
| ------- | -------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- | ------------------- | ---------------- | ------------------ | --------- |
| WEB-001 | D04 §13; D05 §3; PUX 001–005           | criar shell público responsivo                 | `src/app/(public)/layout.tsx`, `src/components/editorial/` | —                   | `TEST-WEB-001-*` | `EVID-WEB-001-01`  | `planned` |
| WEB-002 | D02 §8.1; D04 §14; D05 §4              | criar página inicial editorial                 | `src/app/(public)/page.tsx`, `src/modules/discovery/`      | —                   | `TEST-WEB-002-*` | `EVID-WEB-002-01`  | `planned` |
| WEB-003 | D02 §§8.1–8.2; D05 §5; D07 §13         | implementar acervo, busca, filtros e paginação | `src/app/(public)/publicacoes/`, `src/modules/discovery/`  | —                   | `TEST-WEB-003-*` | `EVID-WEB-003-01`  | `planned` |
| WEB-004 | D02 §8.3; D04 §16; D05 §6              | criar página de leitura da publicação          | `src/app/(public)/publicacoes/[slug]/`                     | —                   | `TEST-WEB-004-*` | `EVID-WEB-004-01`  | `planned` |
| WEB-005 | D02 §12; D05 §7                        | compartilhar por recurso nativo ou copiar link | `src/components/editorial/share-action.tsx`                | —                   | `TEST-WEB-005-*` | `EVID-WEB-005-01`  | `planned` |
| WEB-006 | D02 §§2,5,12; D04 §19; D05 §3; INF §19 | publicar Sobre e Privacidade                   | `src/app/(public)/sobre/`, `src/app/(public)/privacidade/` | —                   | `TEST-WEB-006-*` | `EVID-WEB-006-01`  | `planned` |
| SEO-001 | D02 §12; TL §17                        | gerar metadata, canonical e prévia social      | Metadata API nas rotas públicas                            | —                   | `TEST-SEO-001-*` | `EVID-SEO-001-01`  | `planned` |
| SEO-002 | D02 §12; D07 §17; TL §17               | gerar sitemap, robots e dados estruturados     | `src/app/sitemap.ts`, `robots.ts`, JSON-LD                 | —                   | `TEST-SEO-002-*` | `EVID-SEO-002-01`  | `planned` |

## 10. Interações e moderação

| ID       | Origem                            | Requisito                                 | Destino previsto                                            | Implementação atual | Testes previstos  | Evidência esperada | Status    |
| -------- | --------------------------------- | ----------------------------------------- | ----------------------------------------------------------- | ------------------- | ----------------- | ------------------ | --------- |
| LIKE-001 | D02 §8.5; D05 §8; D07 §14; TL §12 | curtir uma vez por navegador sem desfazer | `src/modules/interactions/likes/`, Route Handler, migration | —                   | `TEST-LIKE-001-*` | `EVID-LIKE-001-01` | `planned` |
| COM-001  | D02 §8.6; D05 §9; D07 §15; TL §12 | publicar e listar comentário imediato     | `src/modules/interactions/comments/`, Route Handler, UI     | —                   | `TEST-COM-001-*`  | `EVID-COM-001-01`  | `planned` |
| MOD-001  | D02 §8.7; D04 §23; D05 §21        | consultar comentários na administração    | `src/app/(admin)/admin/comentarios/`                        | —                   | `TEST-MOD-001-*`  | `EVID-MOD-001-01`  | `planned` |
| MOD-002  | D02 §8.7; D05 §21; D07 §§11,15    | ocultar e restaurar comentário            | `src/modules/interactions/moderation/`                      | —                   | `TEST-MOD-002-*`  | `EVID-MOD-002-01`  | `planned` |
| MOD-003  | D02 §8.7; D05 §21; D07 §15        | excluir comentário permanentemente        | `src/modules/interactions/moderation/delete-comment.ts`     | —                   | `TEST-MOD-003-*`  | `EVID-MOD-003-01`  | `planned` |

## 11. Qualidade, conteúdo e release

| ID       | Origem                                | Requisito                                 | Destino previsto                                    | Implementação atual | Testes previstos  | Evidência esperada | Status          |
| -------- | ------------------------------------- | ----------------------------------------- | --------------------------------------------------- | ------------------- | ----------------- | ------------------ | --------------- |
| UX-001   | PUX 008–011,016; D05 §§22–25          | completar estados, feedback e recuperação | componentes/fluxos afetados + E2E                   | —                   | `TEST-UX-001-*`   | `EVID-UX-001-01`   | `planned`       |
| QUAL-001 | PUX 012–013; D04 §§30–31; D05 §24     | validar acessibilidade e responsividade   | `tests/e2e/accessibility.spec.ts`, checklist manual | —                   | `TEST-QUAL-001-*` | `EVID-QUAL-001-01` | `planned`       |
| QUAL-002 | D03 §9; D06 §17; D07 §§5,18,20        | validar desempenho e degradação segura    | testes de falha, Lighthouse e análise de bundle     | —                   | `TEST-QUAL-002-*` | `EVID-QUAL-002-01` | `planned`       |
| SEC-001  | D02 §11; D06 §§14–15,18.4; D07 §24    | executar regressão de segurança           | `tests/security/`, CI, Vercel Firewall              | —                   | `TEST-SEC-001-*`  | `EVID-SEC-001-01`  | `planned`       |
| CNT-001  | D02 §§2,17; D03 §10                   | preparar conteúdo inaugural aprovado      | banco Preview/Production + fonte autoral segura     | —                   | `TEST-CNT-001-01` | `EVID-CNT-001-01`  | `blocked-human` |
| REL-001  | D02 §17; D03 §6; D06 §26; INF §§25–26 | validar e lançar o MVP                    | workflow release, Vercel Production, relatório      | —                   | `TEST-REL-001-*`  | `EVID-REL-001-01`  | `planned`       |

## 12. Rastreabilidade dos gates

| Gate              | Itens exigidos                                                                          | Evidência de aprovação               | Estado    |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------------------------ | --------- |
| GATE-FND          | FND-001 a FND-016                                                                       | `docs/evidence/GATE-FND.md`          | `planned` |
| GATE-EDITORIAL    | AUTH-001/002, ADM-001, TAX-001, PUB-001–005/007, MED-001, AUD-001, WEB-001/004          | `docs/evidence/GATE-EDITORIAL.md`    | `planned` |
| GATE-DISCOVERY    | WEB-002/003/005, PUB-006, SEO-001/002                                                   | `docs/evidence/GATE-DISCOVERY.md`    | `planned` |
| GATE-INTERACTIONS | LIKE-001, COM-001, MOD-001–003, DEC-003                                                 | `docs/evidence/GATE-INTERACTIONS.md` | `planned` |
| GATE-MVP          | gates anteriores, ADM-002, WEB-006, UX-001, QUAL-001/002, SEC-001, CNT-001, DEC-002/004 | `docs/evidence/GATE-MVP.md`          | `planned` |

DEC-001 não bloqueia GATE-MVP se o uso inicial de `vercel.app` for explicitamente registrado.

## 13. Atualização obrigatória durante a execução

Ao iniciar um item:

1. confirmar dependências em D08;
2. mudar D08 e D09 para `in-progress` no mesmo PR ou commit de início;
3. preencher “Implementação atual” somente com arquivos ou recursos existentes;
4. manter os IDs de teste definidos;
5. registrar desvios sem reescrever a intenção original.

Ao enviar para revisão:

1. apontar PR/commit;
2. listar migrations e configurações alteradas;
3. ligar resultados reais de teste;
4. criar ou atualizar `docs/evidence/<ID>.md`;
5. mover para `review`.

Ao concluir:

1. validar todos os critérios de D08;
2. verificar Preview ou ambiente exigido;
3. confirmar que a evidência não contém segredo;
4. registrar aceite humano quando necessário;
5. mover D08 e D09 para `done` no mesmo commit.

## 14. Regras contra falso progresso

Não contam como conclusão:

- arquivo vazio ou placeholder;
- teste ignorado, comentado ou sem asserção útil;
- mock que substitui a invariante principal;
- deployment `READY` sem smoke;
- migration gerada mas não testada;
- screenshot sem ligação com o critério;
- documentação afirmando comportamento inexistente;
- evidência expirada sem resumo durável;
- implementação fora da stack canônica;
- item marcado `done` com decisão humana ainda aberta.

## 15. Auditoria de consistência

Antes de cada gate, verificar:

- todos os IDs de D08 existem em D09;
- nenhum ID de D09 está ausente em D08;
- estados são idênticos;
- caminhos de implementação existem;
- testes referenciados existem e executam;
- evidências existem e correspondem ao commit;
- requirements não foram reduzidos pela implementação;
- itens fora do escopo não foram introduzidos;
- documentação afetada foi reconciliada.

## 16. Situação atual e próximo passo

A baseline documental DOC-02 a DOC-09 está concluída. O projeto ainda não possui Fundação nem código executável; isso é um estado válido e explicitamente registrado.

O item `FND-004 — Definir configuração e segredos` está concluído. O próximo item aplicável é `FND-005 — Provisionar Neon em São Paulo`, condicionado ao login humano no provedor. A implementação funcional somente poderá começar após `GATE-FND` ou exceção formalmente aprovada.
