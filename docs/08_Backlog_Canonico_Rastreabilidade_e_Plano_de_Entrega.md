---
document_id: DOC-08
title: Backlog Canônico, Rastreabilidade e Plano de Entrega — OPALIB
status: canonical
version: 1.0.0
date: 2026-09-20
approved_by: Juliano Zilli
depends_on:
  - DOC-02
  - DOC-03
  - Principios_de_UX_UI.md
  - DOC-04
  - DOC-05
  - DOC-06
  - DOC-07
  - Visao_do_Tech_Lead.md
  - Infraestrutura_e_Plano_de_Fundacao.md
governs:
  - canonical-backlog
  - delivery-order
  - acceptance-criteria
  - tests
  - evidence
  - release-gates
---

# Backlog Canônico, Rastreabilidade e Plano de Entrega — OPALIB

## 1. Objetivo

Transformar a baseline aprovada do OPALIB em unidades permanentes, ordenadas e verificáveis de trabalho.

Este documento responde:

- o que deve ser construído;
- em qual ordem;
- quais decisões humanas ainda são necessárias;
- de que documentos cada item se origina;
- quais dependências e riscos precisam ser respeitados;
- quais testes e evidências provam a conclusão;
- quando a Fundação e o MVP podem receber estado `READY`.

Nenhum item autoriza mudança silenciosa de produto, UX, arquitetura, stack ou infraestrutura.

## 2. Fontes canônicas

| Código | Documento |
|---|---|
| D02 | `docs/02_Briefing_de_Produto_e_Escopo.md` |
| D03 | `docs/03_Visao_de_Product_Owner.md` |
| PUX | `docs/Principios_de_UX_UI.md` |
| D04 | `docs/04_Direcao_de_UI_e_Design_System.md` |
| D05 | `docs/05_Especificacao_de_UX_e_Fluxos.md` |
| D06 | `docs/06_Tecnicas_de_Desenvolvimento.md` |
| D07 | `docs/07_Engenharia_e_Arquitetura.md` |
| TL | `docs/Visao_do_Tech_Lead.md` |
| INF | `docs/Infraestrutura_e_Plano_de_Fundacao.md` |

As referências usam o código do documento e o nome da seção para permanecerem compreensíveis mesmo após pequenas alterações editoriais.

## 3. Convenções do backlog

### 3.1. Tipos

| Tipo | Uso |
|---|---|
| `decision` | escolha humana que não pode ser presumida |
| `foundation` | habilitador técnico anterior às funcionalidades |
| `feature` | comportamento com valor direto para visitante ou administrador |
| `quality` | segurança, acessibilidade, desempenho ou resiliência transversal |
| `content` | material editorial necessário ao lançamento |
| `release` | integração, verificação e promoção do produto |

### 3.2. Estados

| Estado | Significado |
|---|---|
| `ready` | pode iniciar, pois entradas e dependências estão disponíveis |
| `planned` | aprovado, mas aguarda dependência ou ordem de entrega |
| `blocked-human` | exige escolha, login, MFA, compra ou ação exclusiva do proprietário |
| `in-progress` | implementação iniciada com evidência de trabalho |
| `review` | implementação concluída, aguardando validação |
| `done` | critérios, testes e evidências aprovados |
| `cancelled` | removido por decisão documental explícita |

### 3.3. Prioridade

- `P0`: indispensável para Fundação ou lançamento seguro;
- `P1`: indispensável ao MVP, após o núcleo editorial;
- `P2`: decisão ou refinamento que não bloqueia o primeiro deploy quando houver alternativa segura.

### 3.4. Regras permanentes

- IDs nunca são reutilizados.
- Um item cancelado permanece registrado.
- Mudança de critério exige atualização da origem documental.
- Nenhuma funcionalidade começa antes de `GATE-FND` ou de exceção aprovada.
- “Deployment concluído” não equivale a item `done`.
- Evidências não podem conter segredos, cookies, chaves, connection strings ou dados pessoais desnecessários.

## 4. Definition of Ready

Um item funcional pode começar quando:

- objetivo e escopo estão claros;
- critérios de aceite são testáveis;
- dependências concluídas ou disponíveis;
- decisões humanas associadas estão resolvidas;
- UX e estados aplicáveis estão definidos;
- risco de segurança foi identificado;
- ambiente e dados de teste estão disponíveis;
- não existe conflito conhecido entre documentos canônicos.

## 5. Definition of Done

Um item só recebe `done` quando:

- todos os critérios de aceite foram atendidos;
- testes previstos passaram no nível adequado;
- lint, tipos, testes e build permanecem verdes;
- estados de carregamento, vazio, sucesso e erro foram tratados quando aplicáveis;
- acessibilidade e responsividade foram verificadas;
- autorização, validação e logging foram revisados;
- documentação afetada foi atualizada;
- evidências seguras foram anexadas;
- nenhuma regressão conhecida foi ocultada;
- o comportamento foi validado no ambiente exigido.

## 6. Decisões humanas pendentes

### DEC-001 — Domínio público do OPALIB

- **Tipo:** `decision`
- **Prioridade:** `P2`
- **Status:** `blocked-human`
- **Origem:** D02 §20 “Decisões pendentes”; INF §10 “Aplicação e Vercel”.
- **Objetivo:** definir se e quando o endereço `vercel.app` será substituído por domínio próprio.
- **Descrição:** a Fundação e o MVP podem usar o domínio Vercel. Compra, transferência, DNS e renovação exigem decisão e eventual aprovação de custo.
- **Critérios:** domínio escolhido ou uso de `vercel.app` confirmado; URL canônica definida; plano de redirecionamento registrado.
- **Dependências:** nenhuma.
- **Riscos:** links públicos mudarem sem redirecionamento; custo recorrente não previsto.
- **Testes:** `TEST-DEC-001-01` valida canonical e redirects quando houver domínio.
- **Evidência:** `EVID-DEC-001-01` decisão registrada sem credenciais de DNS.

### DEC-002 — Conteúdo institucional, licença e contato

- **Tipo:** `decision`
- **Prioridade:** `P0`
- **Status:** `blocked-human`
- **Origem:** D02 §20; D04 §19 “Página Sobre”; D05 §3 “Estrutura de navegação”.
- **Objetivo:** definir as informações autorais publicadas no Sobre, a licença/reprodução do acervo e o canal de contato para privacidade.
- **Descrição:** o proprietário fornecerá biografia curta, informações profissionais permitidas, regra de reprodução dos textos e contato público.
- **Critérios:** textos aprovados; nenhuma informação sensível; licença explícita; canal de privacidade definido.
- **Dependências:** nenhuma.
- **Riscos:** exposição excessiva de dados pessoais; conteúdo publicado sem regra de uso.
- **Testes:** `TEST-DEC-002-01` revisão de conteúdo e links.
- **Evidência:** `EVID-DEC-002-01` conteúdo aprovado em arquivo versionado.

### DEC-003 — Retenção após exclusão de comentário

- **Tipo:** `decision`
- **Prioridade:** `P0`
- **Status:** `blocked-human`
- **Origem:** D02 §20; D07 §10 “Comment” e “AuditEvent”; INF §19 “LGPD e minimização”.
- **Objetivo:** determinar por quanto tempo a evidência administrativa mínima de uma exclusão será mantida.
- **Descrição:** o texto do comentário deve ser removido permanentemente; a decisão precisa definir se serão preservados apenas ID, data, publicação, ação e administrador, e por qual prazo.
- **Critérios:** prazo aprovado; campos mínimos definidos; rotina de expurgo e justificativa documentadas.
- **Dependências:** nenhuma.
- **Riscos:** retenção excessiva ou perda de rastreabilidade de moderação.
- **Testes:** `TEST-DEC-003-01` verifica anonimização e expurgo.
- **Evidência:** `EVID-DEC-003-01` política aprovada.

### DEC-004 — Custo do MFA administrativo

- **Tipo:** `decision`
- **Prioridade:** `P0`
- **Status:** `blocked-human`
- **Origem:** TL §8 “Clerk”; INF §13 `COST-GATE-001`.
- **Objetivo:** manter MFA obrigatório em produção sem contratação implícita.
- **Descrição:** aprovar Clerk Pro ou reabrir TL-STACK-007 para escolher alternativa validada com MFA.
- **Critérios:** opção registrada; custo aprovado quando aplicável; MFA comprovado antes do go-live.
- **Dependências:** nenhuma.
- **Riscos:** administração sem segundo fator ou contratação não autorizada.
- **Testes:** `TEST-DEC-004-01` autenticação com segundo fator e recuperação segura.
- **Evidência:** `EVID-DEC-004-01` status do gate, sem códigos de recuperação.

## 7. Fundação — FND

### FND-001 — Proteger e preparar o repositório

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `done`.
- **Origem:** D06 §§20–23; INF §§9 e 24.
- **Objetivo:** tornar o GitHub a origem protegida de código, documentação e automação.
- **Descrição:** criar README operacional, licença técnica do código quando decidida, templates essenciais, ruleset, Dependabot, secret scanning e CodeQL.
- **Critérios:** PR obrigatório; checks exigidos; force push bloqueado; alertas de segurança ativos; nenhum segredo versionado.
- **Dependências:** nenhuma.
- **Riscos:** ruleset bloquear o único mantenedor antes de o workflow existir.
- **Testes:** `TEST-FND-001-01` PR de ensaio; `TEST-FND-001-02` push/check deliberadamente inválido.
- **Evidência:** `EVID-FND-001-01` links do ruleset, PR e checks.

### FND-002 — Materializar toolchain e aplicação-base

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** TL §§4–6 e 20; INF §24 FND-002.
- **Objetivo:** criar a base executável coerente com a stack aprovada.
- **Descrição:** Next.js 16 App Router, React 19.2, Node 22 LTS, TypeScript estrito e pnpm fixado, sem monorepo.
- **Critérios:** versões exatas registradas; lockfile reproduzível; scripts canônicos existentes; `dev` e `build` funcionam.
- **Dependências:** FND-001.
- **Riscos:** scaffolding adicionar recursos ou dependências fora da stack.
- **Testes:** `TEST-FND-002-01` instalação limpa; `TEST-FND-002-02` typecheck e build.
- **Evidência:** `EVID-FND-002-01` commit e logs dos scripts sem segredos.

### FND-003 — Criar baseline de UI e qualidade

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** PUX; D04 §§4–12 e 24–33; TL §9; INF §24 FND-003.
- **Objetivo:** materializar os tokens “Opala Lunar Editorial” e a base de testes.
- **Descrição:** configurar Tailwind 4, Newsreader, Manrope, componentes shadcn necessários, Vitest, Testing Library e Playwright.
- **Critérios:** tema somente claro; tokens semânticos; foco visível; página-base responsiva; ferramentas de teste executáveis.
- **Dependências:** FND-002.
- **Riscos:** aparência genérica de painel; instalação excessiva de componentes.
- **Testes:** `TEST-FND-003-01` componente-base; `TEST-FND-003-02` contraste, teclado e 200% zoom.
- **Evidência:** `EVID-FND-003-01` screenshot responsivo e relatório de teste.

### FND-004 — Definir configuração e segredos

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §14; TL §22; INF §18.
- **Objetivo:** validar configuração e impedir vazamento de segredos.
- **Descrição:** `.env.example`, schema Zod, gitignore, escopo por ambiente e procedimento de pull seguro.
- **Critérios:** aplicação falha cedo para chave ausente; `NEXT_PUBLIC_*` contém apenas valores públicos; arquivos locais ignorados.
- **Dependências:** FND-002.
- **Riscos:** segredo incluído no bundle ou log.
- **Testes:** `TEST-FND-004-01` variável ausente; `TEST-FND-004-02` varredura do bundle e Git.
- **Evidência:** `EVID-FND-004-01` schema e relatório de scanning.

### FND-005 — Provisionar Neon em São Paulo

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D07 §§22–23; TL §7; INF §§7–8 e 11.
- **Objetivo:** disponibilizar PostgreSQL isolado por ambiente em `aws-sa-east-1`.
- **Descrição:** criar projeto, branches `production`, `preview`, `development` e `test`, roles de runtime/migration e pooling.
- **Critérios:** região confirmada antes da criação; branches isoladas; runtime sem DDL; produção inacessível a PRs.
- **Dependências:** FND-004; login humano no Neon.
- **Riscos:** região incorreta é imutável; uso acidental de produção.
- **Testes:** `TEST-FND-005-01` `SELECT 1` por ambiente; `TEST-FND-005-02` DDL negado à role de runtime.
- **Evidência:** `EVID-FND-005-01` região, nomes de branches e testes sem URLs.

### FND-006 — Configurar schema e migrations

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §16; D07 §§10–11; TL §7; INF §12.
- **Objetivo:** tornar o schema reproduzível e reforçar invariantes no banco.
- **Descrição:** configurar Drizzle, migration inicial, constraints, índices e tabela de controle.
- **Critérios:** banco vazio chega ao schema atual; pooled não é usado para migration; unicidades e FKs são comprovadas.
- **Dependências:** FND-005.
- **Riscos:** drift ou migration destrutiva sem backup.
- **Testes:** `TEST-FND-006-01` migration limpa; `TEST-FND-006-02` constraints; `TEST-FND-006-03` schema diff.
- **Evidência:** `EVID-FND-006-01` migration versionada e relatório CI.

### FND-007 — Vincular projeto Vercel em São Paulo

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §13; TL §§5–6; INF §§7 e 10.
- **Objetivo:** executar a aplicação em Vercel Functions `gru1`.
- **Descrição:** criar/vincular um projeto, configurar Node 22, Fluid Compute, scopes de ambiente e domínio Vercel.
- **Critérios:** projeto correto ligado; Preview `READY`; região comprovada; Development, Preview e Production separados.
- **Dependências:** FND-002, FND-004, FND-005; login humano na Vercel.
- **Riscos:** vínculo ao projeto/time errado; Preview usar segredo de produção.
- **Testes:** `TEST-FND-007-01` deployment Preview; `TEST-FND-007-02` matriz de env.
- **Evidência:** `EVID-FND-007-01` URL Preview, commit e região.

### FND-008 — Configurar Clerk administrativo

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned` com gate humano para produção.
- **Origem:** D07 §16; TL §8; INF §13.
- **Objetivo:** criar a base de identidade do único administrador.
- **Descrição:** instâncias dev/prod, usuário proprietário, chaves escopadas, allowlist e redirects; não criar cadastro público.
- **Critérios:** usuário permitido autenticado; usuário fora da allowlist negado; chaves secretas no servidor; MFA exigido em produção.
- **Dependências:** FND-004, FND-007, DEC-004 para produção.
- **Riscos:** considerar login equivalente a autorização; cobrança sem aceite.
- **Testes:** `TEST-FND-008-01` acesso permitido; `TEST-FND-008-02` acesso negado; `TEST-FND-008-03` sessão revogada.
- **Evidência:** `EVID-FND-008-01` resultados sem identidade ou segredo.

### FND-009 — Configurar Blob para capas

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §8.4; D07 §19; TL §13; INF §14.
- **Objetivo:** disponibilizar armazenamento público seguro para capas.
- **Descrição:** criar store, OIDC/token por ambiente, prefixos e regras de upload imutável.
- **Critérios:** somente fluxo autenticado escreve; formato e 5 MB validados; objeto público é legível; Preview não grava em produção.
- **Dependências:** FND-007, FND-008.
- **Riscos:** upload não autorizado, objeto órfão ou conteúdo malicioso.
- **Testes:** `TEST-FND-009-01` upload válido; `TEST-FND-009-02` tipo/tamanho inválidos; `TEST-FND-009-03` acesso anônimo de escrita negado.
- **Evidência:** `EVID-FND-009-01` URL de objeto sintético e resultados.

### FND-010 — Configurar CI de pull request

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §20; TL §20; INF §16.
- **Objetivo:** bloquear regressões antes do merge.
- **Descrição:** format, lint, typecheck, unitários, integração, build, CodeQL e auditoria aplicável.
- **Critérios:** instalação congelada; falha bloqueia merge; secrets não chegam a PR não confiável; cache não mascara erro.
- **Dependências:** FND-002, FND-003, FND-004, FND-006.
- **Riscos:** falso verde ou permissão excessiva no workflow.
- **Testes:** `TEST-FND-010-01` workflow verde; `TEST-FND-010-02` erro intencional bloqueado.
- **Evidência:** `EVID-FND-010-01` links das execuções.

### FND-011 — Configurar E2E e smoke

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §18.3; TL §19; INF §16.
- **Objetivo:** validar o aplicativo no ambiente real de Preview.
- **Descrição:** Playwright, axe e smoke de página, health, banco e autenticação mínima.
- **Critérios:** Preview recebe base URL; screenshots/traces sem segredo; falha impede promoção.
- **Dependências:** FND-007, FND-008, FND-010.
- **Riscos:** teste apontar para produção ou depender de dado real.
- **Testes:** `TEST-FND-011-01` smoke Preview; `TEST-FND-011-02` axe básico.
- **Evidência:** `EVID-FND-011-01` relatório Playwright.

### FND-012 — Configurar release de produção e rollback

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §§20–21; INF §§16–17.
- **Objetivo:** promover o mesmo commit aprovado com migration e retorno controlados.
- **Descrição:** GitHub Environment protegido, workflow manual, migration direta, deploy Vercel, smoke e rollback.
- **Critérios:** aprovação humana; commit rastreável; migration antes da versão dependente; rollback ensaiado.
- **Dependências:** FND-010, FND-011; DEC-004 para go-live.
- **Riscos:** deploy automático competir com migration; rollback incompatível com schema.
- **Testes:** `TEST-FND-012-01` release de ensaio; `TEST-FND-012-02` rollback.
- **Evidência:** `EVID-FND-012-01` workflow, deployment e commit.

### FND-013 — Aplicar baseline de segurança

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §11; D07 §24; TL §16; INF §19.
- **Objetivo:** estabelecer controles de borda, headers e entrada antes das features públicas.
- **Descrição:** TLS, CSP Report-Only, headers, cookies, payload limits, WAF em log e respostas seguras.
- **Critérios:** headers presentes; sem stack pública; WAF validado em Preview; nenhuma regra publicada sem revisão humana.
- **Dependências:** FND-007, FND-008.
- **Riscos:** CSP quebrar Clerk ou fontes; regra bloquear uso legítimo.
- **Testes:** `TEST-FND-013-01` headers; `TEST-FND-013-02` payload excessivo; `TEST-FND-013-03` autenticação abusiva.
- **Evidência:** `EVID-FND-013-01` relatório de headers e WAF anonimizado.

### FND-014 — Configurar observabilidade e saúde

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D06 §13; D07 §21; TL §18; INF §20.
- **Objetivo:** detectar falhas sem expor conteúdo ou segredos.
- **Descrição:** logs estruturados, correlation ID, `/api/health`, métricas nativas e alertas de pipeline/uso.
- **Critérios:** health seguro; erro sintético correlacionável; logs sem cookie, token, Markdown ou comentário integral.
- **Dependências:** FND-007, FND-010.
- **Riscos:** observabilidade vazar dados ou ser insuficiente pela retenção curta.
- **Testes:** `TEST-FND-014-01` health; `TEST-FND-014-02` redaction; `TEST-FND-014-03` alerta sintético.
- **Evidência:** `EVID-FND-014-01` evento e alerta saneados.

### FND-015 — Configurar backup e provar restauração

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D07 §23; INF §§14.2 e 15.
- **Objetivo:** atingir RPO de 24 horas e RTO de 4 horas para o MVP.
- **Descrição:** snapshot, `pg_dump` diário criptografado, store privado, retenção e restore em branch temporária.
- **Critérios:** chave privada offline; backup verificável; restore sem tocar produção; branch temporária removida.
- **Dependências:** FND-005, FND-006, FND-007; ação humana para guardar chave privada.
- **Riscos:** backup ilegível, quota excedida ou chave perdida.
- **Testes:** `TEST-FND-015-01` integridade; `TEST-FND-015-02` restore e consulta de sanidade.
- **Evidência:** `EVID-FND-015-01` hash, duração e resultado sem conteúdo.

### FND-016 — Smoke e aceite da Fundação

- **Tipo:** `foundation`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** TL §26; INF §§25–26.
- **Objetivo:** provar que a base pode receber funcionalidades.
- **Descrição:** reconciliar repositório, toolchain, CI, Preview, Neon, migrations, auth, Blob, segurança, logs, backup e rollback.
- **Critérios:** todos os FND anteriores `done`; nenhum segredo exposto; exceções registradas; `GATE-FND` aprovado.
- **Dependências:** FND-001 a FND-015; DEC-004 pode permanecer aberto somente se produção continuar bloqueada e a Fundação for aceita para desenvolvimento.
- **Riscos:** considerar contas criadas como ambiente pronto.
- **Testes:** `TEST-FND-016-01` checklist integrado.
- **Evidência:** `EVID-FND-016-01` relatório de Foundation Readiness.

## 8. Identidade e administração

### AUTH-001 — Entrar e sair da administração

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §9; D05 §10; D07 §16.
- **Objetivo:** permitir que somente o proprietário inicie e encerre sessão administrativa.
- **Descrição:** rota própria, UI tematizada do Clerk, mensagem genérica e logout explícito; nenhuma divulgação na navegação pública.
- **Critérios:** login válido direciona à visão geral; inválido não enumera identidade; logout invalida acesso; cadastro público ausente.
- **Dependências:** GATE-FND, FND-008.
- **Riscos:** confundir autenticação com autorização.
- **Testes:** `TEST-AUTH-001-01` sucesso; `-02` falha genérica; `-03` logout.
- **Evidência:** `EVID-AUTH-001-01` E2E com conta de teste.

### AUTH-002 — Proteger sessão, rotas e comandos

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D05 §10 “Sessão expirada”; D07 §16; TL §8.
- **Objetivo:** bloquear toda leitura ou mutação administrativa sem sessão e allowlist válidas.
- **Descrição:** `proxy.ts` como primeira barreira e autorização repetida no servidor em cada ação sensível.
- **Critérios:** acesso direto negado; mutação forjada negada; sessão expirada preserva rascunho local e retorna ao contexto após novo login.
- **Dependências:** AUTH-001.
- **Riscos:** confiar somente no middleware ou na interface.
- **Testes:** `TEST-AUTH-002-01` matriz negativa por comando; `-02` expiração.
- **Evidência:** `EVID-AUTH-002-01` relatório de autorização.

### ADM-001 — Shell e visão geral administrativa

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D04 §§20–23; D05 §§3 e 11.
- **Objetivo:** orientar o autor sem dashboard denso.
- **Descrição:** navegação para Publicações, Nova publicação, Categorias e tags, Comentários e Sair; resumo de contagens e comentários recentes, sem gráficos.
- **Critérios:** ação dominante visível; estados vazio/erro; responsivo; não cacheado publicamente.
- **Dependências:** AUTH-002.
- **Riscos:** virar dashboard genérico ou expor dados a cache.
- **Testes:** `TEST-ADM-001-01` E2E desktop/mobile; `-02` cache headers.
- **Evidência:** `EVID-ADM-001-01` screenshots e teste.

### ADM-002 — Configurações essenciais do acervo

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D05 §3 “Área administrativa”; D02 §20; D04 §19.
- **Objetivo:** concentrar somente configurações institucionais realmente aprovadas, sem criar um painel genérico.
- **Descrição:** disponibilizar os campos definidos em DEC-002 para identidade pública, licença e contato; segredos e configuração de infraestrutura nunca serão editáveis pela interface.
- **Critérios:** somente campos aprovados existem; autorização no servidor; validação e confirmação; mudança pública rastreada; alternativa de conteúdo estático pode encerrar o item sem UI mediante decisão documentada.
- **Dependências:** ADM-001, AUTH-002, DEC-002.
- **Riscos:** transformar preferências operacionais em CMS excessivo ou expor configuração sensível.
- **Testes:** `TEST-ADM-002-01` autorização/validação; `-02` atualização pública; `-03` ausência de segredos.
- **Evidência:** `EVID-ADM-002-01` decisão de implementação e E2E quando houver UI.

## 9. Taxonomia e núcleo editorial

### TAX-001 — Áreas de conhecimento

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §§8.1–8.3; D04 §6; D07 §§9.2 e 10.
- **Objetivo:** representar Engenharia de Software, Educação Física e conteúdo interdisciplinar.
- **Descrição:** seed idempotente, slugs estáveis, associação de uma ou mais áreas e identidade visual por área.
- **Critérios:** duplicidade recusada; pelo menos uma área exigida para publicar; associações preservadas.
- **Dependências:** GATE-FND.
- **Riscos:** área virar texto livre e fragmentar filtros.
- **Testes:** `TEST-TAX-001-01` seed repetido; `-02` associação múltipla.
- **Evidência:** `EVID-TAX-001-01` teste de integração.

### TAX-002 — Administrar categorias e tags

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §9; D05 §20; D07 §9.2.
- **Objetivo:** criar, renomear, pesquisar, consultar uso e excluir taxonomia com integridade.
- **Descrição:** nomes normalizados e slugs únicos; exclusão em uso exige substituição ou remoção de associações.
- **Critérios:** duplicata recusada; uso exibido; exclusão segura; erros identificam o campo.
- **Dependências:** AUTH-002, TAX-001.
- **Riscos:** quebrar filtros ou URLs por renomeação.
- **Testes:** `TEST-TAX-002-01` CRUD; `-02` duplicidade; `-03` exclusão associada.
- **Evidência:** `EVID-TAX-002-01` E2E e constraints.

### PUB-001 — Criar e salvar rascunho manualmente

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §§9–10; D05 §§12–13.
- **Objetivo:** iniciar toda publicação como rascunho e salvar conscientemente.
- **Descrição:** formulário editorial, estado “Alterações não salvas”, último salvamento e recuperação temporária no navegador.
- **Critérios:** novo conteúdo não é público; salvar é manual; saída pendente avisa; recuperação local nunca sobrescreve versão mais nova.
- **Dependências:** AUTH-002, ADM-001, TAX-001.
- **Riscos:** perda de trabalho ou publicação acidental.
- **Testes:** `TEST-PUB-001-01` rascunho; `-02` saída; `-03` recuperação/conflito.
- **Evidência:** `EVID-PUB-001-01` E2E do fluxo.

### PUB-002 — Editor e prévia Markdown segura

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §10; D05 §§13–14; D07 §12; TL §10.
- **Objetivo:** escrever Markdown e visualizar o mesmo resultado que será publicado.
- **Descrição:** editor/preview lado a lado no desktop e por abas no compacto, pipeline compartilhado sem HTML bruto.
- **Critérios:** GFM permitido renderiza; HTML/script/URL perigosa são neutralizados; preview não indexa nem executa interações; paridade estrutural comprovada.
- **Dependências:** PUB-001.
- **Riscos:** XSS ou divergência entre preview e público.
- **Testes:** `TEST-PUB-002-01` elementos suportados; `-02` corpus malicioso; `-03` paridade.
- **Evidência:** `EVID-PUB-002-01` suíte e snapshots estruturais.

### PUB-003 — Metadados, referências e endereço permanente

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §§8.2–8.3; D05 §12; D07 §10 “Post” e “Reference”.
- **Objetivo:** registrar metadados completos e um slug estável.
- **Descrição:** título, resumo, tipo, áreas, categoria, tags, curso, disciplina, data original, referências, links e slug único.
- **Critérios:** obrigatórios validados; links válidos; referências ordenáveis; slug único e não alterado automaticamente após publicação.
- **Dependências:** PUB-001, TAX-001, TAX-002.
- **Riscos:** quebra de URL ou metadado inconsistente.
- **Testes:** `TEST-PUB-003-01` validações; `-02` slug concorrente; `-03` referências.
- **Evidência:** `EVID-PUB-003-01` integração e E2E.

### MED-001 — Enviar, substituir e remover capa

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §8.4; D05 §19; D07 §19; TL §13.
- **Objetivo:** associar uma capa responsiva opcional sem arriscar o conteúdo editorial.
- **Descrição:** upload autenticado, preview, alt obrigatório, substituição e remoção; falha não apaga o editor.
- **Critérios:** somente formatos e 5 MB aprovados; alt exigido; URL/metadados consistentes; objeto órfão tratado.
- **Dependências:** PUB-001, FND-009.
- **Riscos:** arquivo malicioso, capa órfã ou lentidão.
- **Testes:** `TEST-MED-001-01` fluxo válido; `-02` tipo/tamanho; `-03` falha do Blob.
- **Evidência:** `EVID-MED-001-01` E2E e inspeção responsiva.

### PUB-004 — Publicar e atualizar conteúdo público

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D05 §§15–16; D07 §§11 e 18.
- **Objetivo:** tornar pública somente uma versão validada e confirmada.
- **Descrição:** validação, confirmação, transação de status/data, atualização explícita e invalidação de cache.
- **Critérios:** duplo envio impedido; conteúdo público anterior permanece até confirmação; sucesso entrega URL; audit event criado.
- **Dependências:** PUB-002, PUB-003, MED-001, AUD-001.
- **Riscos:** estado parcial, cache antigo ou conteúdo não sanitizado.
- **Testes:** `TEST-PUB-004-01` publicar; `-02` concorrência; `-03` atualizar/cache; `-04` falha transacional.
- **Evidência:** `EVID-PUB-004-01` E2E e registros de auditoria saneados.

### PUB-005 — Retirar e republicar

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D05 §17; D07 §§11 e 18.
- **Objetivo:** retirar conteúdo de forma reversível e imediata em origem e cache.
- **Descrição:** transição para `withdrawn`, remoção de listagens/busca/sitemap e republicação controlada.
- **Critérios:** URL pública retorna indisponível sem detalhe administrativo; cache invalidado; administração mantém acesso; republicação confirmada.
- **Dependências:** PUB-004.
- **Riscos:** conteúdo retirado continuar no CDN ou sitemap.
- **Testes:** `TEST-PUB-005-01` retirar em todas as superfícies; `-02` cache; `-03` republicar.
- **Evidência:** `EVID-PUB-005-01` E2E e inspeção de sitemap/cache.

### PUB-006 — Definir destaque editorial

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §§8.1 e 9; D04 §14; D07 §9.1.
- **Objetivo:** controlar a publicação principal e outros destaques sem ranking automático.
- **Descrição:** ação administrativa para destacar/remover destaque em publicação pública.
- **Critérios:** rascunho/retirada não aparece em destaque público; alteração invalida home; feedback claro.
- **Dependências:** PUB-004.
- **Riscos:** múltiplas publicações principais sem regra determinística.
- **Testes:** `TEST-PUB-006-01` elegibilidade e ordenação; `-02` cache.
- **Evidência:** `EVID-PUB-006-01` E2E admin/home.

### PUB-007 — Listar e localizar publicações na administração

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §9; D04 §21; D05 §11.
- **Objetivo:** encontrar rascunhos, publicados e retirados para continuar o trabalho.
- **Descrição:** lista com busca, status, área, atualização e ações coerentes.
- **Critérios:** filtros preservados quando útil; estados vazios; ações secundárias não competem com editar; curtidas visíveis sem identidade.
- **Dependências:** ADM-001, PUB-001.
- **Riscos:** ação destrutiva acidental em lista densa.
- **Testes:** `TEST-PUB-007-01` filtros/status; `-02` responsividade e teclado.
- **Evidência:** `EVID-PUB-007-01` E2E.

### PUB-008 — Excluir publicação permanentemente

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D05 §18; D07 §§11 e 15.
- **Objetivo:** permitir exclusão excepcional com proteção proporcional.
- **Descrição:** somente `withdrawn`, diálogo secundário, digitação exata do título, transação e auditoria.
- **Critérios:** publicada não pode ser excluída; título incorreto bloqueia; relacionamentos seguem política; falha não produz sucesso visual.
- **Dependências:** PUB-005, AUD-001, FND-015.
- **Riscos:** perda irreversível e objeto de capa órfão.
- **Testes:** `TEST-PUB-008-01` guardas; `-02` exclusão transacional; `-03` falha de storage.
- **Evidência:** `EVID-PUB-008-01` E2E com dados sintéticos e backup aplicável.

### AUD-001 — Registrar ações administrativas relevantes

- **Tipo:** `quality`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §11; D07 §10 “AuditEvent” e §16; D06 §13.
- **Objetivo:** manter trilha mínima de publicação, retirada, exclusão, destaque e moderação.
- **Descrição:** evento com ação, entidade, resultado, admin e data, sem segredo ou conteúdo integral.
- **Critérios:** sucesso e falha relevante distinguíveis; evento imutável pela UI; dados minimizados.
- **Dependências:** GATE-FND, AUTH-002.
- **Riscos:** log virar repositório de conteúdo sensível.
- **Testes:** `TEST-AUD-001-01` matriz de eventos; `-02` redaction.
- **Evidência:** `EVID-AUD-001-01` eventos sintéticos saneados.

## 10. Experiência pública e descoberta

### WEB-001 — Shell público responsivo

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D04 §13; D05 §3; PUX P-UX-001 a P-UX-005.
- **Objetivo:** oferecer navegação simples entre Início, Publicações, Áreas, Pesquisa e Sobre.
- **Descrição:** cabeçalho e rodapé editoriais; administração ausente; conteúdo domina a hierarquia.
- **Critérios:** navegação por teclado; indicação de localização; compacto/médio/amplo; sem tema escuro.
- **Dependências:** GATE-FND, FND-003.
- **Riscos:** menu profundo ou excesso de elementos.
- **Testes:** `TEST-WEB-001-01` teclado; `-02` breakpoints; `-03` 200% zoom.
- **Evidência:** `EVID-WEB-001-01` screenshots e axe.

### WEB-002 — Página inicial editorial

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §8.1; D04 §14; D05 §4.
- **Objetivo:** apresentar propósito, publicação principal, destaques, recentes e áreas.
- **Descrição:** home sem rolagem infinita, com falhas isoladas por seção.
- **Critérios:** conteúdo publicado apenas; ordem determinística; estados loading/vazio/erro; imagens não bloqueiam títulos.
- **Dependências:** WEB-001, PUB-004, PUB-006, TAX-001.
- **Riscos:** falha de uma consulta inutilizar toda a home.
- **Testes:** `TEST-WEB-002-01` dados/ordem; `-02` estados; `-03` falha parcial.
- **Evidência:** `EVID-WEB-002-01` E2E e screenshots.

### WEB-003 — Acervo, pesquisa, filtros e paginação

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §§8.1–8.2; D05 §5; D07 §13; TL §15.
- **Objetivo:** localizar publicações por texto e taxonomia sem serviço externo.
- **Descrição:** busca PostgreSQL, filtros por área, tipo, categoria, tag e período, ordenação e paginação estável.
- **Critérios:** pesquisa vazia lista acervo; URL preserva estado; total exibido; limpar filtros; conteúdo retirado ausente; falha preserva termos.
- **Dependências:** PUB-004, TAX-001, TAX-002, WEB-001.
- **Riscos:** consultas lentas ou paginação instável.
- **Testes:** `TEST-WEB-003-01` combinações; `-02` URL/back-forward; `-03` sem resultado; `-04` desempenho.
- **Evidência:** `EVID-WEB-003-01` E2E e plano de consulta quando aplicável.

### WEB-004 — Página de leitura da publicação

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §8.3; D04 §16; D05 §6.
- **Objetivo:** oferecer leitura longa confortável em endereço permanente.
- **Descrição:** área/tipo, título, resumo, autor/datas, capa opcional, Markdown, referências, tags, compartilhamento, interações e relacionados.
- **Critérios:** coluna legível; código/tabelas utilizáveis em telas pequenas; links externos seguros; capa ausente não reserva vazio; retirada/inexistência usa mensagem genérica.
- **Dependências:** PUB-002, PUB-003, PUB-004, MED-001, WEB-001.
- **Riscos:** layout competir com o conteúdo ou expor rascunho.
- **Testes:** `TEST-WEB-004-01` renderização; `-02` acesso por status; `-03` responsive/axe.
- **Evidência:** `EVID-WEB-004-01` E2E de leitura.

### WEB-005 — Compartilhar publicação

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §12; D05 §7.
- **Objetivo:** compartilhar o endereço permanente sem login.
- **Descrição:** Web Share API quando suportada e cópia de link como fallback.
- **Critérios:** sucesso “Link copiado”; falha orienta cópia manual; URL é canonical pública.
- **Dependências:** WEB-004, SEO-001.
- **Riscos:** compartilhar Preview ou URL transitória.
- **Testes:** `TEST-WEB-005-01` share suportado; `-02` clipboard; `-03` falha.
- **Evidência:** `EVID-WEB-005-01` E2E compatível.

### WEB-006 — Sobre e Política de Privacidade

- **Tipo:** `feature`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §§2, 5 e 12; D04 §19; D05 §3; INF §19 “LGPD e minimização”.
- **Objetivo:** explicar o acervo, o autor, a interdisciplinaridade, a licença e o tratamento mínimo de dados.
- **Descrição:** duas páginas públicas estáveis com linguagem clara e contato aprovado.
- **Critérios:** conteúdo aprovado; cookies/curtidas/comentários explicados; sem promessa jurídica indevida; contato funcional.
- **Dependências:** DEC-002, WEB-001, DEC-003 para texto de retenção.
- **Riscos:** política divergente da implementação.
- **Testes:** `TEST-WEB-006-01` links/conteúdo; `-02` revisão de correspondência técnica.
- **Evidência:** `EVID-WEB-006-01` páginas em Preview e aprovação humana.

### SEO-001 — Metadados, canonical e prévia social

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §12; TL §17.
- **Objetivo:** tornar cada publicação identificável em busca e compartilhamento.
- **Descrição:** Metadata API, título, descrição, canonical, Open Graph e capa/fallback.
- **Critérios:** somente conteúdo publicado indexável; Preview/admin `noindex`; URLs permanentes; alt e dimensões coerentes.
- **Dependências:** WEB-004, DEC-001 quando houver domínio.
- **Riscos:** indexar Preview, rascunho ou URL duplicada.
- **Testes:** `TEST-SEO-001-01` metadados por status/ambiente; `-02` social card.
- **Evidência:** `EVID-SEO-001-01` HTML/metadados capturados.

### SEO-002 — Sitemap, robots e dados estruturados

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §12; D07 §17; TL §17.
- **Objetivo:** expor descoberta técnica fiel ao conteúdo público.
- **Descrição:** `sitemap.ts`, `robots.ts` e schema estruturado somente quando aplicável.
- **Critérios:** publicado presente; retirado/rascunho/admin ausentes; datas corretas; ambientes não produtivos bloqueados.
- **Dependências:** PUB-005, SEO-001.
- **Riscos:** cache manter URL retirada.
- **Testes:** `TEST-SEO-002-01` sitemap por status; `-02` robots por ambiente; `-03` schema.
- **Evidência:** `EVID-SEO-002-01` arquivos/validação.

## 11. Interações públicas e moderação

### LIKE-001 — Curtir uma vez por navegador

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §8.5; D05 §8; D07 §14; TL §12.
- **Objetivo:** registrar curtida anônima, irreversível e consistente.
- **Descrição:** identificador opaco em cookie seguro, hash com pepper, constraint única e resposta autoritativa.
- **Critérios:** sem login/nome/e-mail; contador muda somente após servidor; repetição/concorrência incrementa uma vez; não existe endpoint de desfazer; falha não bloqueia leitura.
- **Dependências:** WEB-004, FND-013, FND-014.
- **Riscos:** abuso, fingerprinting ou contador inconsistente.
- **Testes:** `TEST-LIKE-001-01` primeira curtida; `-02` repetição; `-03` concorrência; `-04` erro; `-05` ausência de remoção.
- **Evidência:** `EVID-LIKE-001-01` E2E e constraint.

### COM-001 — Publicar e listar comentários

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §8.6; D05 §9; D07 §15; TL §12.
- **Objetivo:** permitir comentário imediato sem conta e sem e-mail.
- **Descrição:** nome opcional de 80 caracteres, “Anônimo” por padrão, texto simples de 1.500, aviso de privacidade e lista visível.
- **Critérios:** comentário persiste antes do sucesso; aparece imediatamente; formulário limpa só no sucesso; HTML/Markdown/link ficam texto; erro preserva conteúdo; estados e rate limit claros.
- **Dependências:** WEB-004, FND-013, FND-014.
- **Riscos:** spam, XSS, conteúdo pessoal ou ofensivo imediato.
- **Testes:** `TEST-COM-001-01` nome/anônimo; `-02` limites; `-03` payload malicioso; `-04` falha/retry; `-05` rate limit.
- **Evidência:** `EVID-COM-001-01` E2E e segurança.

### MOD-001 — Consultar comentários na administração

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §8.7; D04 §23; D05 §21.
- **Objetivo:** localizar comentários visíveis e ocultos com a publicação de origem.
- **Descrição:** lista moderável com estado, data, nome/Anônimo, trecho e vínculo ao post.
- **Critérios:** autorização em servidor; filtros de estado; conteúdo tratado como texto; estados vazio/erro.
- **Dependências:** COM-001, AUTH-002, ADM-001.
- **Riscos:** renderizar conteúdo não confiável na administração.
- **Testes:** `TEST-MOD-001-01` listagem/filtros; `-02` XSS na admin.
- **Evidência:** `EVID-MOD-001-01` E2E.

### MOD-002 — Ocultar e restaurar comentário

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §8.7; D05 §21; D07 §§11 e 15.
- **Objetivo:** retirar rapidamente conteúdo da área pública sem destruí-lo.
- **Descrição:** ocultar sem confirmação pesada, oferecer desfazer temporário e restaurar mantendo autoria/data.
- **Critérios:** oculto some completamente do público e cache; permanece na admin; restauração preserva dados; auditoria registrada.
- **Dependências:** MOD-001, AUD-001.
- **Riscos:** cache exibir comentário oculto ou ação concorrente produzir estado incorreto.
- **Testes:** `TEST-MOD-002-01` ocultar; `-02` desfazer/restaurar; `-03` cache/concorrência.
- **Evidência:** `EVID-MOD-002-01` E2E público/admin.

### MOD-003 — Excluir comentário permanentemente

- **Tipo:** `feature`; **Prioridade:** `P1`; **Status:** `planned`.
- **Origem:** D02 §8.7; D05 §21; D07 §15.
- **Objetivo:** remover permanentemente um comentário mediante confirmação inequívoca.
- **Descrição:** diálogo com nome, post, trecho e irreversibilidade; conteúdo removido e evidência mínima conforme política.
- **Critérios:** confirmação obrigatória; comentário desaparece da admin e do público; auditoria minimizada; expurgo conforme prazo.
- **Dependências:** MOD-001, AUD-001, DEC-003.
- **Riscos:** retenção indevida ou exclusão acidental.
- **Testes:** `TEST-MOD-003-01` confirmação; `-02` remoção transacional; `-03` retenção/expurgo.
- **Evidência:** `EVID-MOD-003-01` E2E com dado sintético.

## 12. Qualidade transversal e lançamento

### UX-001 — Estados, feedback e recuperação

- **Tipo:** `quality`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** PUX P-UX-008 a P-UX-011 e P-UX-016; D05 §§22–25.
- **Objetivo:** garantir que ações e interrupções permaneçam compreensíveis.
- **Descrição:** revisar loading, vazio, sucesso, erro, retry, foco e preservação de entrada em todas as superfícies.
- **Critérios:** mensagens dizem o que ocorreu e o próximo passo; feedback não depende de cor; falhas de interação não derrubam leitura; saída com mudança pendente avisa.
- **Dependências:** itens funcionais implementados.
- **Riscos:** tratamento inconsistente ou perda silenciosa de dados.
- **Testes:** `TEST-UX-001-01` matriz de estados; `-02` falhas injetadas.
- **Evidência:** `EVID-UX-001-01` checklist por fluxo.

### QUAL-001 — Acessibilidade e responsividade do MVP

- **Tipo:** `quality`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** PUX P-UX-012 e P-UX-013; D04 §§30–31; D05 §24.
- **Objetivo:** preservar intenção e operação em celular, tablet, desktop, teclado e tecnologia assistiva.
- **Descrição:** auditoria automatizada e manual das jornadas críticas.
- **Critérios:** sem violação crítica de axe; foco visível e devolvido; zoom 200%; redução de movimento; alvos confortáveis; contraste aprovado.
- **Dependências:** AUTH-001, PUB-004, WEB-003, WEB-004, COM-001, MOD-002.
- **Riscos:** falso positivo de automação substituir teste manual.
- **Testes:** `TEST-QUAL-001-01` axe; `-02` teclado; `-03` leitores de tela básico; `-04` breakpoints.
- **Evidência:** `EVID-QUAL-001-01` relatório e capturas.

### QUAL-002 — Desempenho e degradação segura

- **Tipo:** `quality`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D03 §9; D06 §17; D07 §§5, 18 e 20.
- **Objetivo:** manter leitura rápida e disponível quando interações ou mídia falharem.
- **Descrição:** validar cache editorial, imagens responsivas, tamanho do cliente e falhas isoladas.
- **Critérios:** corpo do artigo continua legível sem Blob/interações; nenhuma dependência cliente desnecessária; Core Web Vitals avaliados; consulta crítica sem regressão evidente.
- **Dependências:** WEB-002, WEB-003, WEB-004, LIKE-001, COM-001.
- **Riscos:** cache incorreto ou hidratação excessiva.
- **Testes:** `TEST-QUAL-002-01` falhas simuladas; `-02` Lighthouse/medição; `-03` bundle.
- **Evidência:** `EVID-QUAL-002-01` relatório de desempenho e degradação.

### SEC-001 — Regressão de segurança do MVP

- **Tipo:** `quality`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §11; D06 §§14–15 e 18.4; D07 §24; TL §16; INF §19.
- **Objetivo:** provar os controles críticos antes de produção.
- **Descrição:** suíte de autorização negativa, XSS, SQL injection, CSRF, upload, rate limit, payload e exposição de segredo.
- **Critérios:** corpus malicioso neutralizado; mutações admin negadas sem allowlist; nenhum segredo no cliente/log; WAF publicado após Preview; dependências sem vulnerabilidade crítica conhecida.
- **Dependências:** todos os itens de autenticação, publicação, mídia e interação.
- **Riscos:** teste superficial ou regra de proteção quebrar fluxo legítimo.
- **Testes:** `TEST-SEC-001-01` matriz OWASP aplicável; `-02` auth; `-03` Markdown/comentário; `-04` upload; `-05` scanning.
- **Evidência:** `EVID-SEC-001-01` relatório saneado e exceções aprovadas.

### CNT-001 — Preparar conteúdo inaugural

- **Tipo:** `content`; **Prioridade:** `P0`; **Status:** `blocked-human`.
- **Origem:** D02 §§2 e 17; D03 §10.
- **Objetivo:** lançar o acervo com conteúdo real suficiente para validar a experiência.
- **Descrição:** cadastrar pelo menos uma publicação completa e aprovada, preferencialmente mais conteúdos para testar recentes, áreas e destaque.
- **Critérios:** texto de autoria/reprodução permitida; referências revisadas; capa/alt quando usada; metadados completos; revisão no Preview.
- **Dependências:** PUB-004, WEB-004, DEC-002.
- **Riscos:** usar conteúdo sem licença, incompleto ou sensível.
- **Testes:** `TEST-CNT-001-01` revisão editorial e links.
- **Evidência:** `EVID-CNT-001-01` URL Preview da publicação aprovada.

### REL-001 — Validar e lançar o MVP

- **Tipo:** `release`; **Prioridade:** `P0`; **Status:** `planned`.
- **Origem:** D02 §17; D03 §6; D06 §26; INF §§25–26.
- **Objetivo:** promover um MVP seguro, recuperável e rastreável.
- **Descrição:** executar checklist final, backup, migration, deploy, smoke, observação e registro de release.
- **Critérios:** GATE-FND e GATE-MVP aprovados; DEC-002, DEC-003 e DEC-004 resolvidos; conteúdo inaugural publicado; produção sem erro crítico; rollback e restore conhecidos.
- **Dependências:** todos os itens `P0` e funcionalidades `P1` declaradas obrigatórias ao MVP.
- **Riscos:** pressão para publicar com gate aberto ou falso verde de deployment.
- **Testes:** `TEST-REL-001-01` E2E completo; `-02` smoke pós-deploy; `-03` scan de logs; `-04` rollback readiness.
- **Evidência:** `EVID-REL-001-01` release, commit, URL, testes e aceite humano.

## 13. Gates

### GATE-FND — Fundação pronta

É aprovado quando FND-001 a FND-016 estão `done`, ou quando uma exceção explícita identifica item, impacto, prazo e responsável. A exceção nunca pode liberar produção sem MFA, segregação de ambientes, migrations, secrets, CI, backup restaurável e autorização no servidor.

### GATE-EDITORIAL — Publicar e ler com segurança

Exige AUTH-001, AUTH-002, ADM-001, TAX-001, PUB-001 a PUB-005, PUB-007, MED-001, AUD-001, WEB-001 e WEB-004.

### GATE-DISCOVERY — Encontrar e compartilhar

Exige WEB-002, WEB-003, WEB-005, SEO-001 e SEO-002.

### GATE-INTERACTIONS — Interagir e moderar

Exige LIKE-001, COM-001, MOD-001, MOD-002 e MOD-003, além de DEC-003.

### GATE-MVP — Pronto para produção

Exige todos os gates anteriores, ADM-002, WEB-006, UX-001, QUAL-001, QUAL-002, SEC-001, CNT-001, DEC-002 e DEC-004. DEC-001 pode permanecer aberto se `vercel.app` for explicitamente aceito como URL canônica inicial.

## 14. Plano de entrega

| Marco | Escopo | Resultado verificável |
|---|---|---|
| M0 — Fundação | DEC aplicáveis + FND-001 a FND-016 | `GATE-FND` aprovado |
| M1 — Núcleo administrativo | AUTH, ADM, TAX, PUB-001 a PUB-003, MED, AUD | rascunho seguro criado e pré-visualizado |
| M2 — Publicar e ler | PUB-004, PUB-005, PUB-007, PUB-008, WEB-001, WEB-004 | `GATE-EDITORIAL` aprovado |
| M3 — Descobrir | PUB-006, WEB-002, WEB-003, WEB-005, SEO-001, SEO-002 | `GATE-DISCOVERY` aprovado |
| M4 — Interagir | LIKE-001, COM-001, MOD-001 a MOD-003 | `GATE-INTERACTIONS` aprovado |
| M5 — Endurecer e lançar | ADM-002, WEB-006, UX, QUAL, SEC, CNT e REL | `GATE-MVP` e release aprovados |

### Caminho crítico

```text
FND → AUTH → RASCUNHO → MARKDOWN → PUBLICAÇÃO → LEITURA
                                      ↓
                                DESCOBERTA/SEO
                                      ↓
                               INTERAÇÕES/MODERAÇÃO
                                      ↓
                            QUALIDADE + CONTEÚDO + RELEASE
```

A interação não deve atrasar a validação do núcleo editorial, mas continua obrigatória para o MVP definido.

## 15. Matriz de rastreabilidade de requisitos

| Origem | Necessidade | Itens principais |
|---|---|---|
| D02 §8.1 | home, recentes, destaques e áreas | WEB-002, PUB-006, TAX-001 |
| D02 §8.2 | organização do conteúdo | TAX-001, TAX-002, PUB-003, WEB-003 |
| D02 §8.3 | estrutura da publicação | PUB-003, WEB-004 |
| D02 §8.4 | capa responsiva | FND-009, MED-001, QUAL-002 |
| D02 §8.5 | curtida anônima irreversível | LIKE-001 |
| D02 §8.6 | comentário imediato sem login | COM-001 |
| D02 §8.7 | moderação | MOD-001, MOD-002, MOD-003 |
| D02 §9 | administração | AUTH-001, AUTH-002, ADM-001, PUB, TAX, MOD |
| D02 §10 | Markdown com preview | PUB-001, PUB-002 |
| D02 §11 | segurança | FND-013, AUD-001, SEC-001 |
| D02 §12 | descoberta e compartilhamento | WEB-003, WEB-005, SEO-001, SEO-002 |
| D03 §7 Jornada 1 | descobrir e ler | WEB-002, WEB-003, WEB-004 |
| D03 §7 Jornada 2 | publicar conhecimento | AUTH, PUB, MED, TAX |
| D03 §7 Jornada 3 | interagir sem cadastro | LIKE-001, COM-001 |
| D03 §7 Jornada 4 | moderar | MOD-001 a MOD-003 |
| PUX | leitura, baixa densidade, feedback e acessibilidade | WEB, UX-001, QUAL-001 |
| D04 | identidade “Opala Lunar Editorial” | FND-003, WEB-001, ADM-001, QUAL-001 |
| D05 §§4–9 | fluxos públicos e estados | WEB-002 a WEB-005, LIKE-001, COM-001, UX-001 |
| D05 §§10–21 | fluxos administrativos | AUTH, ADM, PUB, MED, TAX, MOD |
| D06 | qualidade de engenharia | todos FND, QUAL-002, SEC-001 |
| D07 §§9–19 | módulos e consistência | TAX, PUB, WEB, LIKE, COM, MOD, AUD |
| TL | stack e bibliotecas | FND-002 a FND-014 |
| INF §24 | plano de Fundação | FND-001 a FND-016 |

## 16. Cobertura dos módulos arquiteturais

| Módulo D07 | Itens |
|---|---|
| Publishing | PUB-001 a PUB-008 |
| Taxonomy | TAX-001, TAX-002 |
| Discovery | WEB-002 a WEB-005, SEO-001, SEO-002 |
| Interactions | LIKE-001, COM-001, MOD-001 a MOD-003 |
| Identity and Access | FND-008, AUTH-001, AUTH-002 |
| Media | FND-009, MED-001 |
| Cross-cutting | ADM-002, AUD-001, UX-001, QUAL-001, QUAL-002, SEC-001 |

## 17. Testes mínimos de regressão do MVP

1. visitante acessa home, acervo e publicação sem login;
2. rascunho e retirada nunca aparecem publicamente;
3. busca e filtros permanecem na URL;
4. Markdown malicioso não executa código;
5. preview e publicação usam a mesma política;
6. administrador fora da allowlist não lê nem altera dados;
7. publicação e atualização exigem confirmação;
8. retirada invalida origem, cache, busca e sitemap;
9. exclusão de publicação exige estado retirado e digitação do título;
10. upload inválido é recusado sem perder o editor;
11. duas curtidas concorrentes do mesmo navegador geram uma;
12. curtida não possui caminho de remoção;
13. comentário anônimo aparece apenas depois de persistido;
14. comentário malicioso permanece texto simples;
15. falha de comentário preserva o texto e não bloqueia o artigo;
16. ocultação remove o comentário do público e permite restauração;
17. exclusão de comentário respeita confirmação e retenção aprovada;
18. teclado, foco, 200% zoom e breakpoints funcionam nas jornadas críticas;
19. logs, HTML e bundle não contêm segredos;
20. backup recente restaura em branch temporária;
21. Preview não usa dados ou credenciais de produção;
22. smoke pós-deploy e rollback readiness são aprovados.

## 18. Evidência de entrega

Cada item `done` deve apontar para uma ou mais evidências:

- commit e pull request;
- execução de CI;
- relatório Vitest/Playwright/axe;
- migration e teste de schema;
- URL de Preview;
- screenshot sem dado sensível;
- resultado de consulta de sanidade sem connection string;
- status de deployment;
- evento de auditoria sintético;
- hash e relatório de restore;
- aceite humano quando necessário.

Evidência deve provar o comportamento, não apenas a existência do arquivo.

## 19. Controle de escopo

Permanecem fora deste backlog do MVP:

- login ou perfil de visitante;
- download de PDF ou anexos;
- desfazer curtida;
- moderação prévia de comentário;
- resposta encadeada;
- edição de comentário pelo visitante;
- notificações e newsletter;
- seguidores, feed social, gamificação ou ranking;
- pagamentos, cursos ou assinaturas;
- IA, recomendação automática ou geração de conteúdo;
- aplicativo nativo;
- modo offline;
- tema escuro;
- realtime, filas, workers dedicados ou busca externa;
- editor rich text ou MDX.

Qualquer inclusão exige revisão de produto, UX, arquitetura, stack, infraestrutura e backlog.

## 20. Próxima etapa

Com o backlog aprovado, a próxima entrega canônica é o Documento 09 — Matriz Operacional de Rastreabilidade. Ela deverá conectar cada requisito e item a código, migrations, testes, deploys, evidências e estado real durante a execução.
