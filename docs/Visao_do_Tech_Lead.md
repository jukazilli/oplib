# OPALIB — Visão do Tech Lead

| Campo | Valor |
|---|---|
| Projeto | OPALIB |
| Documento | Visão do Tech Lead |
| Versão | 1.0.0 |
| Estado | Aprovado — canônico |
| Data | 20 de setembro de 2026 |
| Responsável | Tech Lead |
| Repositório | `jukazilli/oplib` |
| Método de referência | Processo de Desenvolvimento de MVP de Software com IA Assistida, commit `12c87840bcb7779e3072eb717814a7bc28c623b8` |

## 1. Finalidade

Este documento transforma a arquitetura aprovada do OPALIB em escolhas técnicas executáveis. Ele define linguagem, runtime, framework, bibliotecas, convenções, testes e ferramentas que devem ser usadas na fundação do MVP.

As decisões desta visão não alteram o escopo, os fluxos, a experiência ou a arquitetura já aprovados. Qualquer mudança estrutural futura deve ser registrada e aprovada antes da implementação.

## 2. Documentos de entrada

Esta visão depende dos seguintes documentos canônicos:

- `docs/02_Briefing_de_Produto_e_Escopo.md`;
- `docs/03_Visao_de_Product_Owner.md`;
- `docs/Principios_de_UX_UI.md`;
- `docs/04_Direcao_de_UI_e_Design_System.md`;
- `docs/05_Especificacao_de_UX_e_Fluxos.md`;
- `docs/06_Tecnicas_de_Desenvolvimento.md`;
- `docs/07_Engenharia_e_Arquitetura.md`.

Em caso de conflito, prevalece o documento mais específico aprovado para o tema. Nenhuma decisão técnica pode ampliar silenciosamente o MVP.

## 3. Princípios técnicos

1. Um único aplicativo full-stack e um único repositório.
2. Renderização no servidor por padrão; JavaScript no cliente apenas quando houver interação real.
3. PostgreSQL como fonte de verdade e regras críticas reforçadas no banco.
4. Autorização administrativa verificada no servidor em toda operação sensível.
5. Conteúdo Markdown tratado como dado não confiável e renderizado por uma cadeia única e segura.
6. Dependências adicionadas somente quando retirarem complexidade ou risco de forma mensurável.
7. Tecnologias estáveis são preferidas; recursos beta não podem ser dependências centrais do MVP.
8. A aplicação deve permanecer simples de executar, testar, implantar e substituir por outro mantenedor.

## 4. Resumo executivo da stack

| Camada | Decisão aprovada | Política de versão |
|---|---|---|
| Linguagem | TypeScript em modo estrito | série 5.x, versão exata no lockfile |
| Runtime | Node.js 24 LTS | versão fixada em `.nvmrc` e `package.json` |
| Framework | Next.js App Router | 16.3.x; usar o patch estável corrente |
| Interface | React | 19.2.x, conforme compatibilidade do Next.js |
| Hospedagem | Vercel | Functions no runtime Node.js com Fluid Compute |
| Banco | Neon PostgreSQL | PostgreSQL suportado pelo Neon no projeto |
| Acesso ao banco | Drizzle ORM + Drizzle Kit + `pg` | versões estáveis compatíveis e fixadas |
| Autenticação administrativa | Clerk para Next.js | `@clerk/nextjs` 7.x |
| Validação | Zod | 4.x |
| CSS | Tailwind CSS | 4.x |
| Componentes | shadcn/ui sobre Radix | CLI v4; componentes copiados seletivamente |
| Ícones | Lucide React | versão estável fixada |
| Markdown | `react-markdown`, `remark-gfm`, `rehype-sanitize` | versões estáveis fixadas; HTML bruto proibido |
| Imagens | `next/image` + Vercel Blob público | SDK estável fixado |
| Testes unitários/integrados | Vitest + Testing Library | versões estáveis fixadas |
| Testes ponta a ponta | Playwright + axe-core | versões estáveis fixadas |
| Qualidade | ESLint flat config + Prettier | versões estáveis compatíveis |
| Gerenciador | pnpm | versão estável fixada em `packageManager` |

A expressão “versão estável fixada” significa que a fundação selecionará uma versão exata, registrará essa versão no manifesto e no lockfile e impedirá atualizações automáticas de versão principal.

## 5. Linguagem, runtime e execução

### TL-STACK-001 — TypeScript estrito

Todo código da aplicação será escrito em TypeScript, com `strict: true`, `noUncheckedIndexedAccess: true` e verificação sem emissão no pipeline.

Regras:

- não usar `any` explícito sem justificativa registrada no código;
- validar dados externos em runtime com Zod;
- derivar tipos do schema sempre que isso reduzir duplicação;
- não confiar apenas em tipos TypeScript nas fronteiras HTTP, formulários, cookies, variáveis de ambiente ou banco.

### TL-STACK-002 — Node.js 24 LTS

O runtime padrão será Node.js 24 LTS. A série 26 ainda era “Current” na data desta decisão; produção deve usar uma linha LTS. A versão será fixada para desenvolvimento, CI e Vercel.

### TL-STACK-003 — Runtime Node.js, não Edge por padrão

Rotas, Server Actions e Route Handlers usarão o runtime Node.js. O runtime Edge só poderá ser introduzido por decisão explícita que demonstre benefício e compatibilidade com autenticação, driver PostgreSQL e bibliotecas usadas.

## 6. Framework, renderização e fronteiras React

### TL-STACK-004 — Next.js 16 App Router

O OPALIB usará Next.js 16 com App Router. Não haverá diretório `pages` nem mistura de dois roteadores.

Padrões obrigatórios:

- Server Components são o padrão;
- Client Components recebem a diretiva `"use client"` somente na menor fronteira interativa possível;
- páginas públicas leem dados no servidor por meio da camada de serviço, sem chamar uma API HTTP interna;
- mutações administrativas usam Server Actions;
- interações públicas disparadas pelo navegador, como curtir e comentar, usam Route Handlers com caminhos explícitos;
- `proxy.ts` protege a entrada das rotas administrativas, mas nunca substitui a autorização dentro de cada mutação;
- APIs e utilitários específicos do servidor devem ser marcados ou organizados para impedir importação acidental no cliente.

### TL-STACK-005 — Estratégia de renderização

| Superfície | Estratégia |
|---|---|
| Início, listagens e publicação | renderização no servidor com cache editorial |
| Busca e filtros | renderização no servidor orientada por parâmetros da URL |
| Contador e envio de curtida | resposta dinâmica por Route Handler |
| Lista e envio de comentários | leitura e mutação dinâmicas, sem incorporar dado privado |
| Administração | dinâmica, autenticada e sem cache público |
| Prévia Markdown | Client Component isolado, usando a mesma configuração do renderizador público |

## 7. Banco de dados e persistência

### TL-STACK-006 — Neon PostgreSQL

O Neon PostgreSQL permanece como fonte de verdade para publicações, taxonomias, comentários, curtidas, estados editoriais e trilha mínima de moderação.

Conexões:

- a aplicação usa a URL com pooling em `DATABASE_URL`;
- migrações usam conexão direta em `DATABASE_URL_UNPOOLED`;
- o cliente `pg` é integrado a `attachDatabasePool` nas Vercel Functions com Fluid Compute;
- conexões nunca são abertas no navegador;
- toda consulta recebe parâmetros; concatenação de entrada do usuário em SQL é proibida.

### TL-LIB-001 — Drizzle ORM e Drizzle Kit

Drizzle foi escolhido para schemas tipados, consultas próximas de SQL e migrações explícitas sem impor uma camada operacional pesada.

Regras:

- schemas ficam versionados no repositório;
- toda alteração estrutural gera migração revisável;
- migrações não executam automaticamente durante cada inicialização da aplicação;
- recursos nativos do PostgreSQL, como índices únicos, full-text search e `pg_trgm`, podem ser usados por migrações SQL;
- transações devem proteger operações com mais de uma escrita dependente;
- contadores derivados não substituem a tabela de eventos quando uma restrição única é necessária.

### Integridade mínima no banco

Devem existir, no mínimo:

- unicidade do `slug` da publicação;
- estados editoriais restritos ao conjunto permitido;
- unicidade da curtida por `post_id` e hash do visitante;
- chaves estrangeiras com política de exclusão explícita;
- timestamps de criação e atualização;
- índices para publicação, data, destaque, taxonomia, busca e moderação;
- exclusão lógica ou registro de moderação quando necessário à auditoria definida na arquitetura.

## 8. Identidade e autorização administrativa

### TL-STACK-007 — Clerk

Clerk será usado apenas para a identidade do administrador. Ele foi escolhido por fornecer sessões gerenciadas, integração oficial com Next.js, revogação de sessão e autenticação multifator sem exigir que o OPALIB armazene senhas.

Controles obrigatórios:

- não haverá rota pública de cadastro no produto;
- somente o `userId` do proprietário presente na allowlist de ambiente poderá exercer ações administrativas;
- autenticação sem correspondência na allowlist não concede qualquer papel;
- MFA deve estar ativada para a conta administrativa antes da produção;
- toda Server Action e todo Route Handler administrativo verifica sessão e allowlist no servidor;
- a interface oculta não é considerada controle de segurança;
- sessões podem ser revogadas pelo provedor;
- o componente de login do Clerk pode ser tematizado com os tokens do OPALIB, sem recriar o protocolo de autenticação.

A variável pública do Clerk identifica o aplicativo e não é segredo. A chave secreta e a identificação do administrador permanecem apenas no servidor.

### Alternativa não adotada: Neon Auth

O Neon Auth foi avaliado, mas não foi escolhido para o MVP. A documentação consultada não tornou tão direta quanto o Clerk a combinação exigida de MFA, gestão de sessão e acesso fechado para um único administrador. A decisão pode ser reavaliada quando essa equivalência estiver comprovada, sem alterar a camada de domínio.

## 9. Interface, estilos e componentes

### TL-STACK-008 — Tailwind CSS 4 e tokens próprios

Tailwind será usado como mecanismo de estilo. As cores, tipografia, espaçamentos, raios, sombras e estados definidos no Design System serão expostos como variáveis CSS semânticas. Valores arbitrários repetidos são proibidos.

O MVP terá apenas tema claro. Infraestrutura de alternância de tema não será adicionada.

### TL-LIB-002 — shadcn/ui sobre Radix

shadcn/ui fornecerá componentes acessíveis cuja fonte ficará no repositório. Somente os componentes necessários serão adicionados; instalar o catálogo inteiro é proibido.

Diretrizes:

- base Radix;
- personalização pelos tokens “Opala Lunar Editorial”;
- componentes de domínio não devem expor internamente detalhes do Radix;
- estados de foco, teclado, erro, carregamento e desabilitado são obrigatórios;
- nenhuma tela deve parecer um painel SaaS genérico quando o Design System pedir linguagem editorial.

### TL-LIB-003 — Lucide React

Lucide será a única biblioteca de ícones. Ícones não substituem rótulos essenciais e recebem alternativa acessível quando transmitirem significado.

### TL-LIB-004 — Fontes com `next/font`

Newsreader será usada em títulos editoriais e Manrope na interface, conforme o Design System. Ambas serão carregadas com `next/font`, variáveis CSS e subconjuntos necessários, evitando requisições de fonte em tempo de navegação.

## 10. Markdown e publicação segura

### TL-STACK-009 — Pipeline Markdown único

O Markdown armazenado no banco é a fonte canônica. O renderizador público e a prévia administrativa importam a mesma configuração compartilhada.

Pipeline aprovado:

1. `react-markdown` interpreta o Markdown;
2. `remark-gfm` habilita apenas extensões GFM necessárias;
3. `rehype-sanitize` aplica uma allowlist explícita de elementos e atributos;
4. componentes React próprios controlam links, imagens, títulos, tabelas e blocos de código;
5. HTML bruto permanece desabilitado; `rehype-raw` não será instalado.

Regras:

- scripts, eventos HTML, `iframe`, estilos embutidos e URLs perigosas são proibidos;
- links externos usam política segura de `rel` quando abrirem outra aba;
- imagens no corpo só poderão usar origens aprovadas;
- a capa não faz parte do corpo Markdown e possui campo próprio com texto alternativo obrigatório;
- a prévia deve reproduzir o mesmo resultado estrutural da publicação pública;
- comentários são texto simples e nunca passam pelo renderizador Markdown.

Não será adotado MDX no MVP, pois permitir componentes executáveis em conteúdo amplia a superfície de ataque e não atende a uma necessidade aprovada.

## 11. Formulários, estado e fluxo de dados

### TL-LIB-005 — Zod nas fronteiras

Zod valida:

- variáveis de ambiente no início da aplicação;
- entradas de Server Actions e Route Handlers;
- formulários administrativos;
- nome e texto de comentários;
- parâmetros relevantes de rota e busca;
- metadados de upload.

### Formulários

Serão usados formulários HTML, Server Actions, `useActionState` e componentes React nativos. React Hook Form não faz parte da fundação; só poderá ser introduzido caso a complexidade real do editor demonstre ganho claro.

### Estado

- estado compartilhável de busca, filtro e paginação fica na URL;
- estado efêmero fica local ao componente;
- estado persistente fica no servidor;
- Redux, Zustand, TanStack Query e SWR não fazem parte do MVP inicial;
- não haverá store global para duplicar dados já controlados pelo servidor.

## 12. Curtidas e comentários

### Curtidas

O navegador recebe um identificador aleatório opaco em cookie seguro. O servidor armazena somente um hash com segredo do servidor e impõe `UNIQUE(post_id, visitor_hash)`.

Regras:

- a ação é irreversível na interface;
- a inserção e a contagem observável são atômicas;
- repetir a requisição devolve o estado atual sem incrementar novamente;
- fingerprinting de dispositivo não será usado;
- limpar dados do navegador pode permitir nova curtida, limitação aceita para o MVP;
- o cliente nunca informa um contador absoluto ao servidor.

### Comentários

Comentários aceitam nome opcional de até 80 caracteres e texto simples de até 1.500 caracteres. Nome vazio resulta em “Anônimo”. A publicação é imediata.

Controles:

- validação e normalização no servidor;
- escaping padrão do React;
- limite de frequência por rota;
- honeypot e tempo mínimo de preenchimento como proteção de baixo atrito;
- possibilidade administrativa de ocultar, restaurar e excluir;
- resposta genérica ao visitante, sem expor detalhes internos;
- IP bruto não será persistido como identidade de comentário ou curtida.

## 13. Imagens e armazenamento de objetos

### TL-STACK-010 — Vercel Blob público

Capas serão armazenadas no Vercel Blob e referenciadas por URL no PostgreSQL. O Blob será público porque as capas pertencem a publicações públicas.

Regras:

- upload somente por fluxo administrativo autenticado;
- tipos MIME permitidos: JPEG, PNG, WebP e AVIF;
- limite de tamanho definido na fundação e validado antes do envio;
- nomes de arquivo gerados pelo servidor;
- metadados e texto alternativo persistidos no banco;
- remoção de objeto órfão ocorre somente após confirmação e com trilha de erro;
- `next/image` renderiza capa responsiva com `sizes` coerente;
- prioridade de carregamento é reservada à imagem LCP realmente visível;
- origens remotas são limitadas por `remotePatterns`.

Neon Object Storage não será usado como dependência central enquanto permanecer em beta e limitado por região.

## 14. Cache e invalidação

### TL-STACK-011 — Cache Components do Next.js 16

O projeto habilitará `cacheComponents: true`. Cache será explícito e restrito a conteúdo público editorial.

Convenções:

- `use cache` apenas em funções ou componentes de leitura pública determinística;
- tags por publicação, listagem e taxonomia;
- `cacheLife` apropriado ao tipo de conteúdo;
- `updateTag` após mutações administrativas que exigem consistência de leitura imediata;
- administração, curtidas, comentários e respostas personalizadas não entram em cache público;
- nunca ler cookies ou sessão dentro de uma função cacheada;
- invalidação faz parte da mesma entrega da mutação editorial.

## 15. Busca

A busca do MVP será feita no PostgreSQL, inicialmente com full-text search nos campos aprovados e, quando necessário, `pg_trgm` para tolerância controlada.

Não serão adotados Algolia, Elasticsearch, Meilisearch ou serviço equivalente. A camada de serviço preservará a possibilidade de troca futura sem contaminar componentes de interface.

## 16. Segurança de aplicação e plataforma

### TL-STACK-012 — Controles em camadas

O conjunto mínimo inclui:

- HTTPS gerenciado pela Vercel;
- proteção DDoS da plataforma;
- Vercel Firewall/WAF para limites grosseiros por rota e método;
- regras de Firewall testadas primeiro em log, depois em preview e somente então publicadas em produção;
- rate limit de aplicação e restrições de banco para garantir invariantes mesmo quando contadores regionais divergirem;
- cookies `HttpOnly`, `Secure` e `SameSite` adequados;
- cabeçalhos de segurança e CSP introduzida em modo de relatório antes do bloqueio;
- validação Zod e limite de corpo em toda entrada pública;
- nenhuma renderização de HTML fornecido pelo usuário;
- segredos somente em variáveis protegidas da Vercel;
- logs sem conteúdo integral de comentários, cookies, tokens, URLs de conexão ou chaves;
- dependências auditadas e atualizações de segurança revisadas;
- mensagens de erro públicas sem stack trace.

O Firewall reduz abuso, mas não substitui autorização, idempotência e integridade no banco.

## 17. SEO e metadados

Serão usados os recursos nativos do Next.js:

- Metadata API para título, descrição, canonical e Open Graph;
- metadados dinâmicos por publicação;
- `sitemap.ts` e `robots.ts`;
- imagem social gerada por convenção do Next.js quando necessário;
- dados estruturados somente quando representarem fielmente o conteúdo;
- páginas administrativas e prévias com `noindex`.

Não será adicionada biblioteca de SEO genérica.

## 18. Observabilidade

O MVP usará Vercel Runtime Logs e métricas de plataforma. Um invólucro local produzirá logs estruturados com:

- nível;
- evento;
- identificador de correlação;
- módulo;
- duração quando aplicável;
- código de resultado sem dado sensível.

Sentry ou outro serviço externo não faz parte da fundação. Sua adoção exige evidência de que os sinais da Vercel são insuficientes.

## 19. Estratégia de testes

### TL-TEST-001 — Pirâmide pragmática

| Nível | Ferramentas | Cobertura esperada |
|---|---|---|
| Unitário | Vitest | regras de domínio, slug, validação, Markdown, permissões e utilitários |
| Componente | Vitest, Testing Library, jest-dom | componentes interativos e estados acessíveis |
| Integração | Vitest + banco PostgreSQL isolado | repositórios, migrações, restrições únicas, comentários e curtidas |
| Ponta a ponta | Playwright | leitura, busca, curtida, comentário, login admin, publicação e moderação |
| Acessibilidade | axe-core no Playwright + verificação manual | páginas críticas, formulários, foco e navegação por teclado |

### Casos críticos obrigatórios

- visitante lê publicação sem login;
- conteúdo rascunho não é exposto;
- Markdown malicioso não produz HTML executável;
- prévia e publicação usam o mesmo pipeline;
- duas curtidas concorrentes do mesmo navegador incrementam uma única vez;
- curtida não possui ação de desfazer;
- comentário válido aparece imediatamente;
- comentário inválido ou abusivo é rejeitado com resposta segura;
- administrador autorizado publica e invalida cache;
- usuário autenticado fora da allowlist continua sem acesso;
- administrador oculta, restaura e exclui comentário;
- capa responsiva mantém proporção e texto alternativo;
- busca e filtros preservam estado na URL.

### Banco de teste

Testes de integração usam um branch Neon isolado de produção. No CI, a meta é criar um branch temporário por execução, aplicar migrações e removê-lo ao final; até essa automação existir, um branch exclusivo de teste deve ser limpo de forma controlada. Testes nunca apontam para a URL de produção.

### Cobertura

Cobertura numérica não substitui cenários. Como guarda inicial, módulos de domínio e segurança devem manter pelo menos 80% de linhas e branches, além de todos os casos críticos acima.

## 20. Ferramentas de desenvolvimento e qualidade

### TL-TOOL-001 — pnpm e lockfile

- `pnpm` é o único gerenciador do projeto;
- a versão exata fica no campo `packageManager`;
- `pnpm-lock.yaml` é versionado;
- CI usa instalação congelada;
- scripts canônicos ficam no `package.json`.

### TL-TOOL-002 — Lint e formatação

- ESLint 9 com flat config e `eslint-config-next`;
- `no-restricted-imports` para reforçar fronteiras de módulo;
- Prettier 3 com plugin oficial do Tailwind para ordenação de classes;
- não executar dois formatadores ou dois linters concorrentes;
- erros de lint bloqueiam o merge.

### TL-TOOL-003 — Scripts mínimos

| Script | Responsabilidade |
|---|---|
| `dev` | iniciar desenvolvimento |
| `build` | produzir build de produção |
| `start` | executar build produzido |
| `lint` | validar ESLint |
| `format:check` | validar formatação |
| `typecheck` | validar TypeScript sem emitir |
| `test` | testes rápidos |
| `test:integration` | testes com PostgreSQL |
| `test:e2e` | Playwright |
| `db:generate` | gerar migração Drizzle |
| `db:migrate` | aplicar migrações com conexão direta |
| `db:check` | verificar estado de schema/migração |

### TL-TOOL-004 — CI

O pipeline obrigatório será detalhado no plano de fundação, mas deverá executar ao menos:

1. instalação congelada;
2. lint;
3. verificação de formato;
4. typecheck;
5. testes unitários;
6. testes de integração quando a mudança tocar banco ou domínio;
7. build de produção;
8. E2E crítico em preview antes da promoção quando o ambiente estiver disponível.

## 21. Organização do código

Estrutura de referência:

```text
src/
  app/
    (public)/
    (admin)/
    api/
    sitemap.ts
    robots.ts
  components/
    ui/
    editorial/
  modules/
    publishing/
    taxonomy/
    discovery/
    interactions/
    identity/
    media/
  lib/
    db/
    env/
    markdown/
    security/
    observability/
  styles/
drizzle/
tests/
  integration/
  e2e/
```

Regras:

- `app` coordena rotas e composição, não concentra regra de negócio;
- cada módulo contém domínio, casos de uso e adaptadores próprios;
- componentes `ui` são genéricos; componentes editoriais expressam o Design System;
- acesso ao banco ocorre por repositórios/serviços do servidor;
- módulos não importam internamente de outro módulo por caminhos privados;
- utilitários compartilhados só vão para `lib` quando houver uso real por mais de um módulo;
- barrel files amplos e ciclos de dependência devem ser evitados.

## 22. Variáveis de ambiente

| Variável | Exposição | Finalidade |
|---|---|---|
| `DATABASE_URL` | servidor, segredo | conexão PostgreSQL com pooling |
| `DATABASE_URL_UNPOOLED` | CI/migração, segredo | conexão direta para migrações |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | pública | identificação do aplicativo Clerk |
| `CLERK_SECRET_KEY` | servidor, segredo | operações seguras de autenticação |
| `ADMIN_CLERK_USER_ID` | servidor | allowlist do único administrador |
| `BLOB_READ_WRITE_TOKEN` | servidor, segredo | upload e remoção de capas |
| `VISITOR_ID_PEPPER` | servidor, segredo | hash do identificador opaco de curtida |
| `NEXT_PUBLIC_SITE_URL` | pública | URL canônica do ambiente |

Um schema Zod falha cedo quando uma variável obrigatória estiver ausente ou inválida. Arquivos `.env` reais não são versionados; somente um `.env.example` sem valores secretos.

## 23. Dependências rejeitadas no MVP

| Opção | Decisão | Motivo |
|---|---|---|
| Microserviços ou monorepo | rejeitada | complexidade sem necessidade de escala organizacional |
| Runtime Edge como padrão | rejeitada | compatibilidade inferior com a stack escolhida sem benefício comprovado |
| Prisma | não adotado | Drizzle oferece controle SQL e migração suficiente com menor camada para este projeto |
| Driver Neon HTTP como padrão | não adotado | `pg` com pooling e Fluid Compute atende melhor às conexões e transações do aplicativo |
| Neon Auth | não adotado agora | Clerk atende de forma mais direta MFA e sessão do único administrador |
| MDX | rejeitado | permite capacidades executáveis desnecessárias ao conteúdo |
| Editor rich text | rejeitado | requisito aprovado é Markdown simples com prévia |
| Redux/Zustand | rejeitado | não existe estado global complexo aprovado |
| TanStack Query/SWR | não adotado | Server Components, URL e Server Actions cobrem o fluxo inicial |
| Redis | rejeitado | banco e Firewall são suficientes para as invariantes do MVP |
| Busca externa | rejeitada | PostgreSQL atende ao volume esperado |
| Sentry | adiado | observabilidade nativa será validada primeiro |
| Tema escuro | fora do escopo | Design System aprovado é claro |
| Neon Object Storage beta | rejeitado como núcleo | recurso beta e restrição regional |

## 24. Política de dependências

Antes de adicionar uma biblioteca, o responsável deve responder:

1. A plataforma ou a linguagem já resolve o problema adequadamente?
2. A biblioteca possui manutenção ativa, licença compatível e documentação oficial?
3. Ela funciona em Node.js 24, Next.js 16 e React 19?
4. Ela aumenta o bundle do cliente? Se sim, o custo é justificado?
5. Ela processará dados não confiáveis ou ampliará a superfície de ataque?
6. Existe apenas uma biblioteca aprovada para essa responsabilidade?
7. Há testes para o comportamento introduzido?

Versões principais são atualizadas em mudanças próprias, com changelog revisado, build e suíte completa. Dependências transitivas críticas devem ser acompanhadas por alertas do GitHub.

## 25. Registro de decisões técnicas

| ID | Decisão | Estado |
|---|---|---|
| TL-STACK-001 | TypeScript estrito | aprovado |
| TL-STACK-002 | Node.js 24 LTS | aprovado |
| TL-STACK-003 | Runtime Node.js por padrão | aprovado |
| TL-STACK-004 | Next.js 16 App Router | aprovado |
| TL-STACK-005 | Server-first por superfície | aprovado |
| TL-STACK-006 | Neon PostgreSQL | aprovado |
| TL-STACK-007 | Clerk para único administrador | aprovado |
| TL-STACK-008 | Tailwind 4 e shadcn/ui seletivo | aprovado |
| TL-STACK-009 | Markdown sanitizado sem HTML bruto | aprovado |
| TL-STACK-010 | Vercel Blob público para capas | aprovado |
| TL-STACK-011 | Cache Components explícito | aprovado |
| TL-STACK-012 | Segurança em camadas | aprovado |
| TL-LIB-001 | Drizzle ORM/Kit e `pg` | aprovado |
| TL-LIB-002 | shadcn/ui com Radix | aprovado |
| TL-LIB-003 | Lucide React | aprovado |
| TL-LIB-004 | Newsreader e Manrope por `next/font` | aprovado |
| TL-LIB-005 | Zod nas fronteiras | aprovado |
| TL-TEST-001 | Vitest, Testing Library, Playwright e axe | aprovado |
| TL-TOOL-001 | pnpm fixado | aprovado |
| TL-TOOL-002 | ESLint e Prettier | aprovado |
| TL-TOOL-003 | scripts canônicos | aprovado |
| TL-TOOL-004 | CI com gates de qualidade | aprovado |

## 26. Critérios de prontidão para a fundação

A etapa seguinte pode iniciar quando:

- este documento estiver versionado na branch principal;
- as versões exatas forem materializadas no manifesto e lockfile;
- a conta administrativa e a exigência de MFA puderem ser configuradas;
- os projetos Neon, Vercel e Blob puderem ser separados por ambiente;
- os segredos puderem ser armazenados fora do Git;
- houver uma estratégia executável para migrations e branch de teste;
- o pipeline Markdown compartilhado estiver coberto por testes de segurança;
- os gates mínimos de CI estiverem definidos no plano de fundação.

## 27. Fontes técnicas consultadas

Pesquisa realizada em 20 de setembro de 2026, priorizando documentação oficial:

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [Node.js — releases](https://nodejs.org/en/about/previous-releases)
- [Neon — escolha de conexão](https://neon.com/docs/connect/choose-connection)
- [Neon — Drizzle](https://neon.com/docs/guides/drizzle)
- [Neon — branching](https://neon.com/docs/introduction/branching)
- [Drizzle ORM — conexão com Neon](https://orm.drizzle.team/docs/connect-neon)
- [Vercel — Fluid Compute](https://vercel.com/docs/fluid-compute)
- [Vercel — Blob](https://vercel.com/docs/vercel-blob)
- [Vercel — Firewall](https://vercel.com/docs/vercel-firewall)
- [Clerk — Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS com Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Zod](https://zod.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

## 28. Próxima etapa

Com esta visão aprovada, a próxima entrega aplicável do processo é `Infraestrutura_e_Plano_de_Fundacao.md`, responsável por converter a stack em ambientes, serviços, segredos, CI/CD, migrations, segurança operacional e sequência de implementação da fundação.
