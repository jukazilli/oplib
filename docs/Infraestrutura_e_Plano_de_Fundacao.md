# OPALIB — Infraestrutura e Plano de Fundação

| Campo | Valor |
|---|---|
| Projeto | OPALIB |
| Documento | Infraestrutura e Plano de Fundação |
| Versão | 1.0.0 |
| Estado | Aprovado — canônico |
| Data | 20 de setembro de 2026 |
| Responsável | Infraestrutura / Fundação |
| Repositório | `jukazilli/oplib` |
| Método de referência | Processo de Desenvolvimento de MVP de Software com IA Assistida, commit `12c87840bcb7779e3072eb717814a7bc28c623b8` |

## 1. Finalidade

Este documento define onde a arquitetura e a stack aprovadas do OPALIB serão executadas, como os ambientes serão separados e em qual sequência a fundação técnica deverá ser construída e comprovada.

O plano prioriza:

- simplicidade operacional para um projeto pessoal mantido por uma pessoa;
- segurança compatível com um site público que possui administração privada;
- uso de serviços gerenciados;
- custo inicial mínimo;
- região próxima aos usuários e ao banco;
- capacidade de evoluir sem reconstruir o produto;
- evidência objetiva antes de iniciar funcionalidades.

Este documento não cria contas, não contrata planos, não executa migrations e não implanta serviços. Qualquer ação potencialmente cobrável permanece condicionada a aprovação humana explícita.

## 2. Entradas canônicas

O plano consome integralmente:

- `docs/02_Briefing_de_Produto_e_Escopo.md`;
- `docs/03_Visao_de_Product_Owner.md`;
- `docs/Principios_de_UX_UI.md`;
- `docs/04_Direcao_de_UI_e_Design_System.md`;
- `docs/05_Especificacao_de_UX_e_Fluxos.md`;
- `docs/06_Tecnicas_de_Desenvolvimento.md`;
- `docs/07_Engenharia_e_Arquitetura.md`;
- `docs/Visao_do_Tech_Lead.md`.

Nenhum provedor, serviço ou conveniência operacional pode alterar silenciosamente essas decisões.

## 3. Perfil de infraestrutura do OPALIB

| Dimensão | Premissa aprovada |
|---|---|
| Natureza | projeto pessoal e acervo acadêmico público |
| Usuários | visitantes externos sem conta e um único administrador |
| Crescimento esperado | gradual, sem expectativa de pico massivo no MVP |
| Disponibilidade | melhor esforço no início, sem SLA comercial próprio |
| Dados | publicações públicas, comentários públicos e identificadores técnicos pseudônimos |
| Arquivos | somente capas de publicação; sem PDF ou download de trabalhos |
| Operação | uma pessoa, sem equipe dedicada de DevOps |
| Estratégia | serviços gerenciados e poucos provedores |
| Custo | camada gratuita sempre que segura; qualquer cobrança exige aprovação específica |
| Cloud | preview e produção em nuvem desde a Fundação |
| Local | edição e checks rápidos sem Docker ou banco local; integração validada em Preview |
| Região primária | São Paulo, Brasil |

O OPALIB não precisa no MVP de filas, workers dedicados, realtime, Redis, scheduler da aplicação, processamento pesado, IA, mecanismos externos de busca ou clusters próprios.

## 4. Pesquisa atual e premissas de custo

Pesquisa realizada em 20 de setembro de 2026, em fontes oficiais. Limites e preços devem ser revalidados imediatamente antes de qualquer criação ou upgrade.

### Vercel

O plano Hobby estava disponível por US$ 0/mês para uso pessoal e não comercial. Entre os limites relevantes publicados estavam:

- 1 milhão de Edge Requests por mês;
- 100 GB de Fast Data Transfer por mês;
- 1 milhão de Function Invocations por mês;
- 4 horas de CPU ativa e 360 GB-horas de memória de Fluid Compute por mês;
- até 3 regras personalizadas de Firewall;
- 1 milhão de requisições permitidas pelo rate limit do Firewall por mês;
- 1 GB de Vercel Blob e 10 GB de transferência de Blob por mês;
- 5 mil transformações de Image Optimization por mês;
- uma hora de retenção de Runtime Logs.

No Hobby não há compra de excedente: ao atingir limites, o recurso pode ficar indisponível até a renovação do período. Se o projeto passar a ter finalidade comercial, o plano deverá ser revisto.

### Neon

O plano Free estava disponível permanentemente, sem cartão, com:

- 100 CU-horas de compute por projeto;
- até 0,5 GB de armazenamento por projeto;
- até 10 branches por projeto;
- scale-to-zero após 5 minutos;
- janela de histórico de 6 horas, limitada a 1 GB;
- um snapshot manual;
- 5 GB de transferência pública por projeto;
- ausência de SLA e de protected branches.

O plano Launch é pago por uso, sem mensalidade mínima, e permite maior armazenamento, histórico de até 7 dias e proteções adicionais. Não será ativado sem aprovação.

### Clerk

O plano Hobby estava disponível gratuitamente e comporta com folga o único administrador, porém não inclui MFA em produção. O plano Pro inclui MFA e estava anunciado por US$ 20/mês com cobrança anual ou US$ 25 no pagamento mensal.

Portanto, a combinação “Clerk + MFA obrigatório” aprovada na Visão do Tech Lead cria um custo real para produção.

### GitHub

O repositório atual é público. GitHub Actions é gratuito para repositórios públicos nos termos pesquisados, sujeito às políticas de uso da plataforma. Recursos de segurança e proteção deverão ser verificados no momento da configuração.

## 5. Alternativas de implantação

| Opção | Composição | Custo inicial | Segurança | Decisão |
|---|---|---:|---|---|
| A — totalmente gratuita | GitHub público + Vercel Hobby + Neon Free + Blob incluído + Clerk Hobby | US$ 0 | não atende ao MFA obrigatório em produção | rejeitada para produção |
| B — MVP seguro e enxuto | GitHub público + Vercel Hobby + Neon Free + Blob incluído + Clerk Pro | a partir de US$ 20/mês no Clerk anual | atende à baseline aprovada, respeitados os demais controles | recomendada |
| C — operação paga ampliada | GitHub + Vercel Pro + Neon Launch + Clerk Pro | Vercel e Clerk fixos, Neon por uso | maior retenção, escala e capacidade operacional | adiada até haver gatilho |

### Decisão INF-001

A infraestrutura alvo é a opção B. Durante a Fundação, recursos gratuitos e instâncias de desenvolvimento podem ser preparados, mas a ativação paga do Clerk Pro requer uma confirmação separada do proprietário.

Se o proprietário decidir não assumir esse custo, a Visão do Tech Lead deverá ser reaberta para selecionar e validar outra solução de autenticação com MFA. O requisito de MFA não será removido silenciosamente.

## 6. Topologia aprovada

| Responsabilidade | Serviço |
|---|---|
| Código, revisão e automação | GitHub |
| Aplicação Next.js, API e Server Actions | Vercel Functions com Fluid Compute |
| CDN, TLS, cache e proteção de borda | Vercel |
| Banco relacional | Neon PostgreSQL |
| Identidade administrativa | Clerk |
| Capas públicas | Vercel Blob público |
| Backups lógicos criptografados | Vercel Blob privado separado |
| Logs e métricas iniciais | Vercel Runtime Logs, Vercel Usage e Neon monitoring |
| Alertas operacionais iniciais | notificações do GitHub, Vercel, Neon e Clerk |

Fluxo de alto nível:

```text
Visitante
   ↓ HTTPS / CDN / Firewall
Vercel — Next.js em gru1
   ├── Neon PostgreSQL em aws-sa-east-1
   ├── Clerk — sessão administrativa
   └── Vercel Blob — capas públicas

GitHub
   ├── CI e evidências
   ├── preview deployments
   └── release controlada para produção
```

Não haverá servidor separado para API. A aplicação full-stack aprovada executa frontend, Route Handlers e Server Actions no mesmo projeto Vercel.

## 7. Região e residência operacional

### Decisão INF-002

- Vercel Functions: `gru1`, São Paulo;
- Neon: `aws-sa-east-1`, São Paulo;
- CDN: rede global da Vercel;
- Blob: região compatível escolhida no provisionamento, preferencialmente São Paulo quando disponível para o store.

Vercel e Neon oferecem regiões de compute/PostgreSQL em São Paulo na data da pesquisa. Manter aplicação e banco na mesma região reduz latência das consultas.

A região do projeto Neon não pode ser alterada depois da criação. A Fundação deve verificar o valor antes de confirmar o projeto. Mudança posterior exige novo projeto e migração de dados.

O uso de serviços beta do Neon restritos a outras regiões não justifica mover o banco. Object Storage e Functions do Neon não fazem parte da infraestrutura aprovada.

## 8. Ambientes

### 8.1. Mapeamento

| Ambiente | Código | Vercel | Neon | Dados | Finalidade |
|---|---|---|---|---|---|
| Local | branch Git do trabalho | nenhum | nenhum | nenhum | edição, typecheck, testes unitários e build |
| Teste de integração | commit/PR | GitHub Actions | `test` | sintéticos e descartáveis | testes automatizados |
| Preview | pull request | Preview Deployment | `preview` | sintéticos e moderados | validação humana e E2E |
| Produção | `main` liberada | Production | `production` | reais | site público |
| Restore test | execução temporária | nenhum | `restore-test-*` | cópia restaurada | prova de recuperação |

O OPALIB não usará Docker nem PostgreSQL local. Depois dos checks locais aplicáveis, cada pull request elegível será validado em um Preview Vercel conectado somente a recursos não produtivos. Esse Preview funciona como staging operacional do projeto.

### 8.2. Regras de segregação

- produção nunca compartilha branch, credencial ou Blob store gravável com outro ambiente;
- Preview nunca recebe a URL de banco da produção;
- dados reais não são copiados para Preview ou teste;
- testes podem limpar somente a branch explicitamente marcada para teste;
- variáveis Vercel são escopadas em Production, Preview e Development;
- cada ambiente Clerk usa instância/chaves apropriadas;
- capas de Preview usam prefixo ou store separado e política de limpeza;
- `NEXT_PUBLIC_SITE_URL` é próprio de cada ambiente;
- nenhuma automação possui permissão para excluir o projeto Neon de produção.
- nenhum comando local depende de Docker ou de PostgreSQL instalado na máquina;
- integração, E2E e validação humana usam Preview/Staging depois que FND-005 a FND-011 estiverem materializados.

### 8.3. Política de branches Neon

O plano Free permite até 10 branches. A Fundação manterá quatro persistentes: `production`, `preview`, `development` e `test`. Branches temporárias só serão criadas para migrations de maior risco ou teste de restore e deverão receber TTL ou exclusão imediata após evidência.

Se a quantidade se aproximar de oito branches, novas criações são bloqueadas até limpeza ou aprovação de upgrade.

## 9. Repositório e estratégia Git

### Decisão INF-003

O GitHub continua como origem canônica. O repositório permanecerá único e público enquanto não houver código ou informação que exija mudança de visibilidade.

Regras para `main`:

- alterações entram por pull request;
- pelo menos todos os checks obrigatórios precisam estar verdes;
- force push e exclusão da branch são proibidos;
- conversas de revisão devem estar resolvidas;
- merges diretos são evitados mesmo com um único mantenedor;
- dependências e lockfile são revisados no mesmo PR;
- commits assinados são recomendados, não bloqueadores na primeira Fundação;
- CODEOWNERS pode apontar para o proprietário quando o login estiver confirmado.

Automação de segurança:

- Dependabot alerts habilitados;
- Dependabot security updates habilitados;
- secret scanning e push protection habilitados quando disponíveis;
- CodeQL para JavaScript/TypeScript no repositório público;
- nenhum segredo em issues, commits, Actions logs ou artefatos.

O branch protection/ruleset será aplicado somente após o primeiro workflow existir, evitando bloquear o repositório sem check disponível.

## 10. Aplicação e Vercel

### Decisão INF-004

Será criado um único projeto Vercel ligado a `jukazilli/oplib`, com:

- framework detectado como Next.js;
- Node.js 22 LTS;
- package manager e lockfile fixados;
- região de Functions em `gru1`;
- Fluid Compute habilitado;
- Preview para pull requests;
- produção controlada a partir de `main`;
- TLS automático;
- CDN e cache da plataforma;
- domínio `vercel.app` durante a Fundação.

Domínio próprio não é requisito para provar a Fundação. Compra, transferência ou renovação de domínio é potencialmente cobrável e exige aprovação.

### Build e execução

- instalação com lockfile congelado;
- `typecheck`, lint e testes são executados antes do build elegível;
- `next build` é a prova de compilação de produção;
- migrations nunca rodam no boot da aplicação;
- runtime Node.js é o padrão;
- páginas administrativas não recebem cache público;
- conteúdo editorial usa o cache explícito definido na Visão do Tech Lead.

## 11. Neon PostgreSQL

### Decisão INF-005

Será usado um projeto Neon em `aws-sa-east-1`, integrado à Vercel por mecanismo oficial quando disponível.

Conexões:

- `DATABASE_URL`: pooled, usada pela aplicação;
- `DATABASE_URL_UNPOOLED`: direta, usada apenas por migration e operação controlada;
- SSL obrigatório;
- `pg` com pool anexado ao ciclo de vida da Vercel Function;
- credenciais diferentes por ambiente;
- role de runtime sem privilégios de DDL;
- role de migration guardada apenas em Vercel/GitHub Environment e nunca exposta à aplicação.

### Banco e roles

Cada branch usa o banco lógico e as roles definidos pela Fundação. A aplicação recebe somente:

- leitura e escrita nas tabelas necessárias;
- uso das sequences necessárias;
- nenhuma permissão para criar/drop de schema, role, banco ou extensão.

A role de migration pode executar DDL, mas não fica disponível no bundle ou no runtime público.

### Extensões

Somente extensões exigidas por uma migration aprovada serão habilitadas. A candidata inicial é `pg_trgm`, quando a busca provar necessidade. Extensões não são ativadas preventivamente.

## 12. Migrations e mudança de schema

### Decisão INF-006

Drizzle Kit gera migrations versionadas. O fluxo é:

1. alterar o schema tipado;
2. gerar a migration;
3. revisar SQL e impacto;
4. aplicar em `development`;
5. executar integração em `test`;
6. aplicar em `preview`;
7. validar E2E e smoke;
8. criar snapshot/backup aplicável de produção;
9. executar migration de produção por workflow manual protegido;
10. implantar a versão compatível;
11. executar smoke pós-deploy.

O push de uma branch sincroniza o código com o Preview Vercel. Mudanças de schema continuam versionadas no Git, mas sua aplicação no Neon não é um efeito cego de todo commit: o workflow identifica a branch não produtiva correta, aplica a migration por conexão direta e interrompe o Preview se houver falha. Produção permanece manual e protegida.

Regras:

- migrations de produção não são aplicadas em build público nem no start;
- toda migration precisa ser idempotente no processo, embora o SQL individual não precise aceitar execução dupla;
- expansão e contração são separadas quando houver risco de versão antiga coexistir;
- remoção de coluna ou dado exige backup verificado e plano de retorno;
- migration destrutiva requer aprovação humana específica;
- a tabela de controle do Drizzle é a fonte do estado aplicado;
- falha interrompe o release antes da promoção;
- rollback de código é preferível; rollback de banco usa migration corretiva ou restore conforme o incidente.

## 13. Autenticação administrativa

### Decisão INF-007

Clerk será provisionado com uma instância de desenvolvimento e uma instância de produção.

Configuração mínima:

- um único usuário administrador criado ou aprovado no painel;
- nenhum link ou rota de cadastro público;
- `ADMIN_CLERK_USER_ID` validado no servidor;
- MFA por aplicativo autenticador e backup codes antes da abertura da produção;
- URLs de redirect separadas por ambiente;
- sessão e revogação gerenciadas pelo Clerk;
- chaves públicas e secretas corretamente separadas;
- rota `/admin` protegida por `proxy.ts` e por autorização em cada ação;
- nenhum visitante precisa ou pode criar conta para ler, curtir ou comentar.

### COST-GATE-001 — MFA em produção

Estado: **aprovação de cobrança pendente**.

Antes do go-live, o proprietário deve escolher uma das opções:

1. aprovar Clerk Pro e habilitar MFA; ou
2. reabrir a decisão TL-STACK-007 para validar outra solução com MFA.

A Fundação pode avançar em ambiente de desenvolvimento, mas produção não recebe estado “pronta” enquanto esse gate permanecer aberto.

## 14. Vercel Blob

### 14.1. Capas públicas

Será criado um store público para capas. Escrita ocorre somente em fluxo administrativo autenticado.

Políticas:

- limite inicial de 5 MB por capa, apesar do limite maior da plataforma;
- JPEG, PNG, WebP e AVIF;
- validação de MIME e assinatura do arquivo;
- nome imutável gerado pelo servidor;
- sem overwrite; nova versão cria nova URL;
- CDN cache longo para objetos imutáveis;
- remoção somente depois de a referência no banco ser atualizada;
- monitoramento de armazenamento, operações e transferência.

Em Vercel, OIDC é preferido para acesso do runtime ao Blob. `BLOB_READ_WRITE_TOKEN` fica reservado a desenvolvimento local ou execução fora da Vercel quando realmente necessário.

### 14.2. Backups privados

Um store privado separado poderá guardar backups lógicos criptografados. Ele nunca é usado para capas ou conteúdo público.

- o dump é criptografado antes do upload;
- a chave pública de criptografia pode ficar na automação;
- a chave privada de recuperação fica offline com o proprietário;
- o token de escrita fica em GitHub Actions, escopado e mascarado;
- retenção inicial: 7 diários e 4 semanais, ajustada ao limite real de armazenamento;
- exclusão segue retenção somente após upload e verificação de integridade.

Se o volume ultrapassar a camada incluída, a retenção ou o provedor de backup deverá ser revisto antes de ativar cobrança.

## 15. Backups, restore e continuidade

### Decisão INF-008

Proteção em camadas:

1. histórico Neon de até 6 horas no Free;
2. um snapshot manual antes de mudanças relevantes;
3. `pg_dump` lógico diário criptografado;
4. backup adicional antes de migration destrutiva;
5. teste de restauração em branch temporária.

Objetivos iniciais:

| Objetivo | Meta do MVP |
|---|---|
| RPO | até 24 horas pelo backup diário; até 6 horas quando o histórico Neon for aplicável |
| RTO | até 4 horas em incidente recuperável pelo runbook |
| Teste de restore | na Fundação e depois trimestralmente |
| Retenção | 7 diários + 4 semanais, condicionada à capacidade gratuita |

O teste de restore deve:

- criar `restore-test-<data>`;
- restaurar backup sem tocar produção;
- aplicar uma consulta de sanidade;
- registrar duração, integridade e versão;
- excluir a branch temporária após a evidência.

Backups não substituem migrations revisadas nem proteções contra acesso administrativo indevido.

## 16. CI e qualidade

### Decisão INF-009

GitHub Actions executará os checks definidos na Visão do Tech Lead.

### Pull request

1. checkout;
2. instalar Node e pnpm fixados;
3. instalar com lockfile congelado;
4. `format:check`;
5. `lint`;
6. `typecheck`;
7. testes unitários;
8. testes de integração quando aplicável;
9. build de produção;
10. CodeQL e auditorias aplicáveis;
11. preview Vercel;
12. Playwright crítico contra Preview.

### Release

Produção terá workflow separado e controlado:

1. confirmar commit e checks verdes;
2. confirmar backup/snapshot quando necessário;
3. aprovar GitHub Environment `production`;
4. aplicar migration por conexão direta;
5. publicar/promover o artefato Vercel;
6. executar smoke test;
7. observar logs e métricas;
8. registrar evidência e resultado.

O Vercel CLI usado no CI terá versão fixada. `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` permanecem em GitHub Secrets/Environment. O workflow nunca imprime valores.

## 17. Estratégia de promoção e rollback

### Decisão INF-010

- cada PR elegível recebe Preview;
- Preview é validado antes do merge;
- `main` representa código liberável;
- produção é implantada somente depois dos gates;
- o mesmo commit testado deve identificar o deploy;
- rollback da Vercel aponta para deployment anterior conhecido;
- alterações de banco seguem compatibilidade retroativa para permitir rollback de código;
- se a migration quebrar uma invariante, o release para e segue o runbook de correção/restore.

O deploy não é considerado concluído apenas porque a Vercel mostra `READY`. É necessário smoke test funcional e varredura de erros.

## 18. Secrets e configuração

### Decisão INF-011

| Variável | Development | Preview | Production | Sensível |
|---|---|---|---|---|
| `DATABASE_URL` | branch development | branch preview | branch production | sim |
| `DATABASE_URL_UNPOOLED` | migration dev | migration preview | workflow protegido | sim |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | dev | dev/preview | production | não |
| `CLERK_SECRET_KEY` | dev | dev/preview | production | sim |
| `ADMIN_CLERK_USER_ID` | admin de teste | admin de teste | proprietário | servidor |
| `BLOB_READ_WRITE_TOKEN` | se necessário | store preview | evitar no runtime com OIDC | sim |
| `VISITOR_ID_PEPPER` | próprio | próprio | próprio | sim |
| `NEXT_PUBLIC_SITE_URL` | localhost | URL preview | URL canônica | não |
| `BACKUP_BLOB_READ_WRITE_TOKEN` | ausente | ausente | workflow backup | sim |
| `BACKUP_ENCRYPTION_PUBLIC_KEY` | opcional | ausente | workflow backup | não |

Regras:

- `.env.example` contém nomes e comentários, nunca valores;
- `.env.local` e variantes locais são ignorados pelo Git;
- Vercel é a fonte de configuração do runtime;
- `vercel link` ocorre antes de `vercel env pull`;
- `vercel env pull` pode sobrescrever `.env.local`, portanto customizações locais ficam em arquivo separado;
- scripts Drizzle carregam explicitamente o ambiente;
- variáveis `NEXT_PUBLIC_*` são tratadas como públicas;
- nenhum segredo passa pelo chat;
- rotação ocorre imediatamente após exposição e, preventivamente, conforme política do provedor ou revisão anual;
- segredos de Production não são disponibilizados a workflows de pull request.

## 19. Segurança de borda e aplicação

### Decisão INF-012

Baseline:

- TLS automático e redirecionamento para HTTPS;
- DDoS mitigation da Vercel;
- WAF com implantação progressiva: log, Preview e produção;
- limites de requisição distintos para comentários e curtidas;
- terceira regra reservada a abuso administrativo/autenticação ou padrão emergente;
- CSP inicialmente `Report-Only`, depois aplicada;
- `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, política de referrer e permissions policy;
- cookies seguros e escopo mínimo;
- corpo de requisição limitado;
- validação Zod no servidor;
- pipeline Markdown sem HTML bruto;
- respostas de erro sem stack trace;
- nenhuma confiança em IP como identidade permanente;
- administração protegida por Clerk, allowlist e MFA;
- princípio do menor privilégio no banco e nos tokens.

Regras de Firewall são controles auxiliares. A unicidade das curtidas e a autorização administrativa continuam garantidas pela aplicação e pelo banco.

### LGPD e minimização

- não persistir IP bruto de visitante por padrão;
- o identificador de curtida é aleatório, pseudônimo e armazenado como hash;
- nome de comentário é opcional;
- publicar aviso de privacidade simples antes do go-live;
- explicar uso de cookies estritamente necessários à curtida e à sessão administrativa;
- permitir contato para correção ou remoção de comentário quando aplicável;
- definir retenção dos logs conforme os limites dos provedores;
- não adicionar analytics comportamental no MVP.

## 20. Observabilidade e saúde

### Decisão INF-013

O MVP começa com recursos nativos:

- Vercel Runtime Logs;
- Vercel Usage Dashboard;
- status de deployments;
- métricas do Neon e consumo por branch;
- falhas de GitHub Actions;
- logs do Clerk para autenticação;
- endpoint `/api/health` sem dados sensíveis.

O health check retorna apenas versão, estado geral e disponibilidade do banco como boolean/status HTTP. Ele não expõe host, latência detalhada, stack, schema ou credenciais.

Alertas mínimos:

- falha de build/deploy;
- falha de migration;
- falha do backup diário;
- uso próximo dos limites de Vercel, Neon ou Blob;
- aumento repetido de erros 5xx;
- eventos administrativos negados ou anômalos, sem conteúdo sensível.

Sentry, drain externo e monitor de uptime são adiados. Serão reavaliados se a retenção de uma hora da Vercel impedir diagnóstico ou se o site exigir alerta de disponibilidade independente.

## 21. Objetivos operacionais

Estes objetivos são internos e não constituem SLA ao público:

| Indicador | Meta inicial |
|---|---|
| disponibilidade mensal observada | ≥ 99,0% após haver medição externa confiável |
| resposta do health check | < 1 s em condições normais, desconsiderando cold start inicial |
| taxa de erro 5xx | < 1% em janela de 15 minutos |
| restauração | RTO ≤ 4 h |
| perda máxima esperada | RPO ≤ 24 h |
| sucesso de backup | 100% dos jobs programados ou incidente aberto |
| deploy | rollback conhecido e smoke concluído |

Sem monitor externo, a disponibilidade não deve ser declarada como comprovada.

## 22. Capacidade e gatilhos de evolução

### Vercel

Reavaliar Hobby quando:

- houver uso comercial;
- qualquer quota atingir 80%;
- três regras de Firewall forem insuficientes;
- retenção de logs impedir diagnóstico;
- colaboração exigir recursos de equipe;
- indisponibilidade por limite se tornar risco real.

### Neon

Reavaliar Free quando:

- armazenamento atingir 0,4 GB;
- compute alcançar 80 CU-horas no mês;
- egress alcançar 4 GB;
- oito branches estiverem ativas;
- janela de restore de 6 horas for insuficiente;
- protected branch ou SLA se tornar necessário.

### Blob

Reavaliar quando:

- armazenamento atingir 0,8 GB;
- transferência atingir 8 GB no mês;
- operações atingirem 80% da quota;
- backups e capas competirem pela capacidade incluída.

### Clerk

Clerk Pro já é necessário para MFA na produção desta baseline. Crescimento de usuários não é um gatilho relevante porque apenas o administrador possui conta.

## 23. Ações humanas obrigatórias

O agente deve pausar e devolver ao proprietário qualquer etapa que envolva:

- login em provedor;
- MFA, CAPTCHA ou recovery code;
- aceite de termos;
- contratação, trial com conversão ou cartão;
- compra/transferência de domínio;
- visualização única de segredo;
- armazenamento da chave privada de backup;
- publicação definitiva de regra WAF;
- migration destrutiva ou restore de produção.

O proprietário nunca deve copiar para o chat senha, token, secret key, connection string, chave privada, recovery code ou dados de cartão.

## 24. Plano de Fundação

Os itens abaixo são habilitadores que deverão ser detalhados no Documento 08 como backlog `FND-*` com critérios, testes e evidências permanentes.

### FND-001 — Proteger e preparar o repositório

- criar README operacional mínimo, licença e arquivos de governança aplicáveis;
- configurar PRs, checks, ruleset, Dependabot, secret scanning e CodeQL;
- evidência: configuração e PR de teste aprovado.

### FND-002 — Materializar toolchain

- criar Next.js 16, Node 22, TypeScript estrito e pnpm fixado;
- instalar somente dependências aprovadas;
- criar lockfile e scripts canônicos;
- evidência: instalação limpa, typecheck e build.

### FND-003 — Criar baseline de UI e qualidade

- tokens do Design System, fontes, Tailwind 4 e componentes mínimos do shadcn/ui;
- configurar ESLint, Prettier, Vitest, Testing Library e Playwright;
- evidência: página-base responsiva, testes e auditoria acessível.

### FND-004 — Definir configuração e segredos

- criar `.env.example`, validação Zod e matriz de ambientes;
- configurar gitignore e política de segredo;
- evidência: falha segura para variável ausente e nenhum segredo versionado.

### FND-005 — Provisionar Neon em São Paulo

- criar projeto `aws-sa-east-1` e branches aprovadas;
- criar roles de runtime e migration;
- conectar Development/Preview/Production sem cruzamento;
- evidência: região, branches e `SELECT 1` por ambiente sem revelar URLs.

### FND-006 — Configurar schema e migrations

- Drizzle config, schema inicial e migration zero;
- aplicar em development, test e preview;
- provar controle de versão e conexão direta;
- evidência: relatório das migrations e teste de restrição.

### FND-007 — Vincular projeto Vercel

- criar/vincular um projeto, fixar runtime e região `gru1`;
- configurar Preview e Production;
- conectar Neon pelo caminho oficial;
- evidência: `.vercel/project.json` local ignorado, deployment Preview `READY` e health check.

### FND-008 — Configurar Clerk administrativo

- instâncias dev/prod, usuário proprietário, allowlist e redirects;
- testar acesso permitido e negado;
- manter COST-GATE-001 visível;
- evidência: teste de autorização sem expor identidade sensível.

### FND-009 — Configurar Blob para capas

- store público, políticas de upload, OIDC/token e prefixos por ambiente;
- evidência: upload autenticado, renderização responsiva e exclusão controlada.

### FND-010 — Configurar CI de pull request

- checks de formato, lint, tipos, unitários, integração, build, CodeQL e preview;
- evidência: workflow verde e teste intencionalmente vermelho bloqueando merge.

### FND-011 — Configurar E2E e smoke

- cenários críticos de fundação, health check e acessibilidade;
- evidência: relatório Playwright em Preview.

### FND-012 — Configurar release de produção

- GitHub Environment, aprovação, migration protegida, deploy e rollback;
- evidência: release de ensaio e identificação do mesmo commit.

### FND-013 — Aplicar baseline de segurança

- headers, CSP Report-Only, cookies, limites, WAF em log e sanitização Markdown;
- evidência: testes automatizados e relatório de headers.

### FND-014 — Configurar observabilidade

- logs estruturados, correlação, health, alertas de pipeline e consumo;
- evidência: erro sintético detectado sem segredo no log.

### FND-015 — Configurar backup e provar restore

- chave pública/privada, dump criptografado, retenção e branch temporária;
- evidência: restauração validada e duração registrada.

### FND-016 — Smoke da Fundação

- validar repositório, CI, Preview, banco, migration, auth, Blob, segurança, logs e restore;
- reconciliar documentação e evidências;
- evidência: checklist integral aprovado.

## 25. Ordem de execução

| Fase | Itens | Gate de saída |
|---|---|---|
| 0 — acessos e decisões | contas, região, admin, COST-GATE-001 e chave de backup | ações humanas identificadas e segredos fora do chat |
| 1 — repositório e toolchain | FND-001 a FND-004 | build local e checks básicos verdes |
| 2 — dados e cloud | FND-005 a FND-009 | Preview conectado a recursos não produtivos |
| 3 — entrega e segurança | FND-010 a FND-014 | pipeline, E2E, release e controles comprovados |
| 4 — continuidade | FND-015 | backup restaurado fora de produção |
| 5 — aceite | FND-016 | Fundação Operacional |

Funcionalidades do produto só começam depois da Fase 5 ou de exceção documentada no backlog.

## 26. Critério de Fundação Operacional

A Fundação recebe estado `READY` somente quando houver evidência de que:

- repositório e ruleset estão ativos;
- stack e versões correspondem à Visão do Tech Lead;
- lockfile é reproduzível;
- CI bloqueia falhas;
- Preview está acessível;
- Vercel executa em `gru1`;
- Neon executa em `aws-sa-east-1`;
- ambientes não compartilham banco de produção;
- migrations funcionam fora do runtime;
- segredos estão fora do código e logs;
- autorização administrativa rejeita usuário fora da allowlist;
- MFA de produção está resolvido;
- Blob aceita apenas upload autorizado;
- Markdown malicioso é neutralizado;
- health, logs e alertas mínimos funcionam;
- backup foi criado e restaurado;
- rollback de aplicação foi ensaiado;
- smoke test passou;
- evidências foram ligadas aos itens `FND-*`.

Criar contas ou obter um deployment `READY` não basta.

## 27. Riscos e respostas

| Risco | Resposta planejada |
|---|---|
| Clerk Pro não aprovado | reabrir decisão de autenticação; não retirar MFA |
| Neon Free atingir 0,5 GB | alerta em 80%, exportação e decisão de Launch |
| limite Hobby interromper recurso | monitorar 80%, reduzir consumo ou aprovar Pro |
| erro em migration | expand/contract, backup, workflow manual e restore testado |
| vazamento de segredo | revogar/rotacionar, investigar logs e revisar escopo |
| abuso de comentários | WAF, rate limit, honeypot e moderação |
| abuso de curtidas | identificador opaco, unicidade no banco e rate limit |
| backup corrompido | verificação e restore trimestral |
| Preview acessar produção | escopo de env, testes de proteção e secrets separados |
| região criada incorretamente | verificar antes de confirmar; recriar antes de inserir dados |
| lock-in de provedor | PostgreSQL padrão, Markdown portável e limites de SDK isolados |

## 28. Evidências permitidas

Podem ser registradas:

- URL pública de Preview/Production;
- commit SHA;
- link de workflow;
- nome de projeto, região e branch sem credencial;
- status de migration sem connection string;
- relatório de testes;
- captura sem dados sensíveis;
- hash e data do backup, nunca seu conteúdo;
- tempo e resultado do restore;
- status de WAF e headers sem regras secretas.

Não podem ser anexados tokens, cookies, connection strings, valores de `.env`, chaves privadas ou recovery codes.

## 29. Fontes oficiais consultadas

- [Processo de Desenvolvimento de MVP de Software com IA Assistida](https://github.com/jukazilli/processo-de-desenvolvimento-de-mvp-de-software-com-ia-assistida)
- [Vercel Pricing](https://vercel.com/pricing)
- [Vercel Global Network and Regions](https://vercel.com/docs/regions)
- [Vercel Deployments](https://vercel.com/docs/deployments)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Firewall](https://vercel.com/docs/vercel-firewall)
- [Vercel Blob Pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing)
- [Vercel Blob Security](https://vercel.com/docs/vercel-blob/security)
- [Neon Pricing](https://neon.com/pricing)
- [Neon Regions](https://neon.com/docs/introduction/regions)
- [Neon Branching](https://neon.com/docs/introduction/branching)
- [Neon Connection Pooling](https://neon.com/docs/connect/connection-pooling)
- [Neon History Window](https://neon.com/docs/postgres/backup-restore/history-window)
- [Neon Backup Strategies](https://neon.com/docs/postgres/backup-restore/backups)
- [Clerk Pricing](https://clerk.com/pricing)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [GitHub Pricing](https://github.com/pricing)
- [GitHub Actions](https://docs.github.com/actions)
- [GitHub Secret Scanning](https://docs.github.com/code-security/secret-scanning)

## 30. Próxima etapa

Com este plano aprovado, a próxima etapa aplicável é o Documento 08 — Backlog Canônico, Rastreabilidade e Plano de Entrega. Ele deverá transformar FND-001 a FND-016 e os requisitos funcionais em itens executáveis, com dependências, critérios de aceite, testes e evidências.
