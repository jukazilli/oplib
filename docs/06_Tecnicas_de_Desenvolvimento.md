---
document_id: DOC-06
title: Técnicas de Desenvolvimento — OPALIB
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
governs:
  - code-quality
  - coding-conventions
  - testing
  - quality-gates
  - dependency-policy
  - database-changes
  - git-workflow
  - ai-agent-execution
---

# Técnicas de Desenvolvimento — OPALIB

## 1. Objetivo

Este documento define como humanos e agentes de IA deverão escrever, revisar, testar e manter o código do OPALIB.

Ele funciona como contrato obrigatório de implementação. Não escolhe a stack completa, o framework, a biblioteca de autenticação ou a arquitetura. Essas decisões pertencem ao Documento 07 e à Visão do Tech Lead.

A regra central é:

> Código é comunicação entre pessoas e máquinas. Uma implementação produzida por IA está sujeita ao mesmo padrão exigido de um desenvolvedor humano experiente.

## 2. Princípios técnicos

O projeto deverá priorizar:

- legibilidade acima de soluções engenhosas;
- explicitude acima de comportamento oculto;
- baixa complexidade operacional;
- alterações pequenas e coerentes;
- segurança por padrão;
- testes proporcionais ao risco;
- dependências justificadas;
- reutilização sem abstração prematura;
- desempenho orientado por evidência;
- documentação próxima das decisões;
- compatibilidade com manutenção por uma única pessoa.

O código não deverá depender da memória da conversa que o originou para ser compreendido.

## 3. Idiomas

### 3.1. Código e material técnico

O idioma técnico padrão será inglês para:

- variáveis;
- funções e métodos;
- classes, interfaces, types e enums;
- módulos e arquivos de código;
- contratos e eventos;
- nomes de testes;
- comentários e docstrings;
- mensagens internas de desenvolvimento;
- identificadores de logs.

### 3.2. Produto e documentação

- A interface do MVP será escrita em português do Brasil.
- A documentação canônica do produto poderá permanecer em português.
- Termos oficiais de integrações externas poderão manter o nome original.
- Não deverão ser misturados português e inglês dentro do mesmo identificador técnico.

## 4. Legibilidade e Clean Code

Toda unidade de código deverá possuir responsabilidade clara e nome que revele intenção.

O projeto deverá favorecer:

- alta coesão;
- baixo acoplamento;
- dependências explícitas;
- fluxo de controle compreensível;
- funções focadas;
- módulos com fronteiras semânticas;
- validação de estados inválidos;
- separação entre regra de negócio e infraestrutura conforme a arquitetura aprovada;
- ausência de código morto;
- ausência de duplicação sem justificativa.

Deverão ser evitados:

- funções ou arquivos que concentrem responsabilidades não relacionadas;
- condicionais profundamente aninhadas;
- strings e números mágicos;
- parâmetros booleanos ambíguos;
- efeitos colaterais escondidos;
- estado global desnecessário;
- pastas genéricas como `utils`, `helpers` ou `common` usadas como depósito;
- wrappers sem responsabilidade real;
- abstrações criadas para funcionalidades hipotéticas;
- camadas cerimoniais que não reduzam risco nem complexidade.

Não haverá limite universal de linhas. O critério será coesão e facilidade de compreensão.

## 5. Convenções de naming

- Funções deverão utilizar verbos que expressem ação ou resultado.
- Booleanos deverão ser lidos como afirmações, como `isPublished`, `hasPendingChanges` ou `canModerateComment`.
- Coleções deverão informar o que contêm, como `visibleComments` ou `publishedPosts`.
- Identificadores vagos como `data`, `item`, `thing`, `processData` e `handleStuff` deverão ser evitados quando o contexto não tornar o significado inequívoco.
- Abreviações particulares não deverão ser criadas para economizar caracteres.
- Termos conhecidos, como `id`, `url` e `api`, poderão seguir as convenções da linguagem aprovada.
- Nomes do domínio deverão permanecer consistentes entre código, banco, contratos e testes.

O glossário técnico inicial utilizará:

- `post` para publicação;
- `comment` para comentário;
- `like` para curtida;
- `knowledgeArea` para área de conhecimento;
- `category` para categoria;
- `tag` para tag;
- `coverImage` para imagem de capa;
- `admin` para o único perfil administrativo do MVP.

## 6. Comentários e documentação no código

Comentários deverão explicar o motivo de uma decisão não óbvia, e não narrar a sintaxe.

São usos aceitáveis:

- restrição externa;
- invariante importante;
- decisão de segurança;
- workaround temporário;
- razão de uma otimização;
- comportamento incomum de um provedor.

Regras:

- comentários técnicos serão escritos em inglês;
- código comentado deverá ser removido;
- comentários desatualizados serão tratados como defeito;
- `TODO` e `FIXME` deverão possuir contexto e referência rastreável quando representarem dívida real;
- agentes não deverão gerar blocos artificiais de comentários para explicar cada linha.

## 7. Reutilização e abstração

Antes de criar uma função, componente, tipo, schema, serviço ou adapter, o implementador deverá procurar comportamento semanticamente equivalente no repositório.

Deverão ser avaliados:

- componentes existentes;
- regras de domínio;
- validators;
- contratos e schemas;
- adapters;
- funções de acesso a dados;
- testes relacionados;
- padrões utilizados por módulos vizinhos.

Reutilizar será correto quando comportamento, invariantes e motivo de mudança forem compatíveis.

Duas estruturas visualmente parecidas não deverão ser unificadas automaticamente quando representarem conceitos diferentes.

Duplicação deverá ser analisada considerando:

1. se representa a mesma regra;
2. se as ocorrências devem evoluir juntas;
3. se existe um local canônico para a responsabilidade;
4. se a extração melhora a compreensão;
5. se o novo contrato possui nome claro.

## 8. Type safety e contratos

A stack selecionada deverá oferecer verificação estática ou mecanismo equivalente adequado à aplicação.

Quando houver suporte, deverá ser utilizada a configuração estrita disponível.

Não será permitido utilizar tipos genéricos, casts, supressões ou equivalentes apenas para silenciar o verificador.

Dados externos deverão ser validados na fronteira, incluindo:

- formulários públicos;
- parâmetros de URL;
- conteúdo Markdown;
- comentários;
- uploads;
- variáveis de ambiente;
- respostas de serviços externos;
- dados recebidos por endpoints administrativos.

Tipos de compilação não substituirão validação em runtime para dados não confiáveis.

## 9. Organização de módulos

A estrutura definitiva será estabelecida no Documento 07. Independentemente da estrutura escolhida:

- regras de negócio não deverão ficar espalhadas em componentes visuais;
- acesso ao banco deverá possuir pontos identificáveis;
- validação deverá ocorrer nas fronteiras;
- código público e administrativo deverá respeitar autorização no servidor;
- módulos não deverão importar detalhes internos de outros módulos sem contrato aprovado;
- componentes de interface não deverão conhecer credenciais ou segredos;
- o renderizador Markdown deverá permanecer isolado e testável;
- curtidas e comentários deverão possuir regras próprias, sem depender apenas do estado do cliente.

## 10. Política de versões e toolchain

Depois da aprovação da stack pela Visão do Tech Lead:

- runtime, package manager e ferramentas centrais deverão possuir versões declaradas;
- deverá existir um único lockfile canônico;
- instalações reproduzíveis serão obrigatórias em CI;
- atualizações principais não serão feitas automaticamente;
- alterações de versão deverão registrar impacto, migração e evidência de testes;
- versões em fim de suporte deverão ser substituídas por plano controlado;
- a CI deverá usar a mesma linha de runtime definida para desenvolvimento e produção.

Não será permitido misturar package managers no mesmo projeto.

## 11. Política de dependências

Antes de adicionar uma dependência, deverá ser verificado:

- se a plataforma já oferece a capacidade;
- se uma dependência existente já resolve o problema;
- se o benefício justifica bundle, superfície de ataque e manutenção;
- se o pacote é mantido e compatível com a stack;
- se a licença é aceitável;
- se introduz lock-in desnecessário;
- se funciona nos ambientes de execução previstos.

Toda nova dependência relevante deverá possuir justificativa no pull request.

Dependências não utilizadas serão removidas. Alertas de segurança deverão ser avaliados e classificados, não ignorados indiscriminadamente.

Agentes deverão consultar a documentação da versão efetivamente instalada antes de utilizar APIs sujeitas a mudança.

## 12. Tratamento de erros

Falhas não deverão ser ignoradas para manter uma aparência de funcionamento.

Cada fronteira deverá definir quando:

- retornar erro de domínio;
- converter erro externo;
- interromper a operação;
- realizar retry seguro;
- registrar log;
- degradar uma funcionalidade;
- apresentar feedback ao usuário.

Regras para o OPALIB:

- falhas em curtidas ou comentários não deverão impedir a leitura do artigo;
- falhas ao salvar ou publicar não deverão produzir sucesso visual falso;
- dados digitados deverão ser preservados quando a falha for recuperável;
- erros administrativos não deverão revelar detalhes de autenticação;
- mensagens públicas deverão seguir a microcopy aprovada no Documento 05;
- respostas técnicas deverão evitar stack traces, SQL, tokens ou detalhes internos.

## 13. Logging e observabilidade

Logs deverão ser estruturados, úteis e proporcionais ao tamanho do produto.

Quando aplicável, deverão registrar:

- categoria do evento;
- resultado;
- identificador de correlação;
- duração;
- origem lógica;
- código de erro estável.

Nunca deverão registrar:

- senhas;
- tokens;
- cookies de sessão;
- strings completas de conexão;
- segredos;
- conteúdo integral de comentários por padrão;
- Markdown integral de publicações por padrão;
- dados técnicos de visitantes além do estritamente necessário.

Ações administrativas relevantes deverão gerar trilha suficiente para investigação, sem criar um sistema de auditoria desproporcional ao MVP.

## 14. Segredos e configuração

- Segredos nunca deverão ser enviados ao navegador.
- Credenciais não deverão ser salvas no código ou em arquivos versionados.
- Arquivos locais de ambiente contendo segredos deverão ser ignorados pelo Git.
- Um arquivo de exemplo poderá documentar apenas nomes e formatos seguros.
- Variáveis obrigatórias deverão ser validadas na inicialização.
- Credenciais deverão possuir o menor privilégio necessário.
- Produção, preview e desenvolvimento deverão utilizar configurações separadas.
- Vazamentos suspeitos exigirão revogação e rotação imediatas.

## 15. Segurança de entrada e saída

Toda entrada será tratada como não confiável.

Deverão existir controles para:

- validação de esquema;
- limites de tamanho;
- normalização controlada;
- sanitização de Markdown;
- rejeição de HTML arbitrário;
- proteção contra scripts e protocolos perigosos;
- validação de upload;
- limitação de frequência;
- proteção contra repetição de curtidas;
- proteção contra spam em comentários;
- autorização administrativa no servidor;
- proteção contra ações cross-site quando aplicável.

Escape de saída deverá ser responsabilidade da camada apropriada. Sanitização não deverá depender apenas da interface.

## 16. Banco de dados e migrations

Alterações de banco deverão ser feitas por migrations versionadas.

Regras:

- nenhuma alteração manual em produção será considerada fonte canônica;
- migrations aplicadas não deverão ser reescritas;
- mudanças destrutivas deverão ser separadas em etapas seguras;
- migrations deverão ser revisáveis e reproduzíveis;
- constraints e índices deverão refletir invariantes reais;
- unicidade da curtida por publicação e navegador deverá possuir proteção no servidor e persistência adequada;
- operações críticas deverão ser atômicas;
- dados de teste não deverão contaminar produção;
- rollback deverá ser planejado quando tecnicamente seguro;
- restauração de backup não substitui uma migration correta.

## 17. Desempenho

O projeto deverá evitar desde o início:

- consultas N+1;
- carregamento excessivo de colunas ou relacionamentos;
- requisições redundantes;
- imagens sem otimização;
- reprocessamento desnecessário de Markdown;
- dependências pesadas para capacidades simples;
- renders evitáveis em superfícies críticas;
- filtros que exijam varreduras incompatíveis com o volume previsto;
- operações administrativas bloqueantes sem feedback.

Otimizações que reduzam legibilidade exigirão evidência e justificativa.

O fluxo esperado será: implementar corretamente, eliminar ineficiências óbvias, medir caminhos críticos, otimizar o gargalo real e medir novamente.

## 18. Estratégia de testes

Testes fazem parte da implementação e deverão cobrir comportamento, não detalhes acidentais.

### 18.1. Testes unitários

Deverão cobrir regras puras e invariantes, incluindo:

- transições de estado de publicação;
- validação de campos;
- geração e validação de endereço permanente;
- regras de comentário;
- regras de curtida;
- sanitização e política de Markdown;
- permissões administrativas;
- funções de domínio críticas.

### 18.2. Testes de integração

Deverão validar fronteiras reais ou equivalentes confiáveis, incluindo:

- persistência no banco;
- constraints e migrations;
- criação, edição, publicação e retirada;
- registro idempotente de curtida;
- comentário imediato e moderação;
- autenticação e autorização administrativas;
- upload e metadados de capa;
- pesquisa e filtros.

### 18.3. Testes ponta a ponta

As jornadas críticas deverão possuir cobertura em navegador:

- localizar e ler uma publicação;
- pesquisar e filtrar o acervo;
- curtir uma vez e impedir repetição normal;
- publicar comentário anônimo e com nome;
- entrar na administração;
- criar rascunho, visualizar e publicar;
- editar uma publicação pública mediante confirmação;
- ocultar, restaurar e excluir comentário;
- retirar publicação do ar;
- validar comportamento essencial em viewport compacto e amplo.

### 18.4. Testes de segurança

Deverão incluir casos positivos e negativos para:

- acesso administrativo não autorizado;
- Markdown malicioso;
- HTML e scripts em comentários;
- protocolos perigosos em links;
- uploads inválidos;
- repetição e concorrência em curtidas;
- rate limiting;
- exposição acidental de segredos;
- enumeração de credenciais.

### 18.5. Regressão

Todo bug corrigido com possibilidade real de reaparecer deverá deixar um teste de regressão ou check equivalente, quando tecnicamente viável.

### 18.6. Mocks

- Mocks deverão representar contratos, não esconder integrações mal compreendidas.
- Regras de domínio não deverão depender de mocks excessivos.
- Integrações críticas deverão possuir ao menos um teste contra implementação real, ambiente isolado ou contrato verificável.
- Testes não deverão afirmar sucesso apenas porque o mock foi configurado para retornar sucesso.

## 19. Acessibilidade e qualidade visual

Mudanças de interface deverão preservar:

- HTML semântico;
- navegação por teclado;
- foco visível;
- associação entre campos e erros;
- anúncios de estados importantes;
- contraste aprovado;
- zoom de 200%;
- movimento reduzido;
- funcionamento sem depender somente de cor;
- responsividade nas faixas definidas no Documento 04.

Componentes novos deverão demonstrar estados padrão, foco, carregamento, vazio, erro, sucesso e desabilitado quando aplicáveis.

## 20. Quality gates

Depois da definição da stack, deverão existir comandos canônicos e reproduzíveis para:

- instalação;
- desenvolvimento;
- lint;
- formatação;
- typecheck ou verificação equivalente;
- testes unitários;
- testes de integração;
- testes ponta a ponta;
- build de produção;
- verificação de migrations;
- auditoria de dependências e segredos.

Pull requests não deverão ser mesclados quando gates obrigatórios falharem.

Não será permitido obter um resultado verde por meio de:

- desabilitação silenciosa de regra;
- exclusão de teste válido;
- supressão ampla de tipo;
- redução artificial de cobertura;
- substituição de teste real por placeholder.

## 21. Política Git

### 21.1. Branches

- `main` representará o estado integrado e deverá permanecer implantável.
- Alterações de código deverão preferencialmente ocorrer em branches curtas.
- Branches deverão representar uma finalidade identificável.
- Mudanças documentais pequenas poderão seguir o fluxo autorizado do projeto.

### 21.2. Commits

- Cada commit deverá representar uma unidade coerente.
- Mensagens deverão explicar a mudança de forma objetiva.
- Commits não deverão incluir segredos, arquivos temporários ou artefatos locais.
- Alterações não relacionadas deverão permanecer separadas.

Formato preferencial:

- `feat:` nova capacidade;
- `fix:` correção;
- `docs:` documentação;
- `test:` testes;
- `refactor:` melhoria sem mudança funcional intencional;
- `chore:` manutenção;
- `ci:` automação de integração e entrega.

### 21.3. Pull requests

Quando aplicável, o pull request deverá informar:

- problema resolvido;
- escopo;
- documentos e itens de backlog relacionados;
- decisões técnicas relevantes;
- testes executados;
- evidências visuais quando houver interface;
- migrations e plano de rollout;
- riscos e rollback;
- dependências adicionadas.

## 22. Revisão de código

A revisão deverá verificar:

- aderência ao requisito;
- coerência com documentos canônicos;
- legibilidade;
- segurança;
- autorização no servidor;
- validação de dados;
- testes e regressões;
- impacto de banco;
- acessibilidade;
- desempenho óbvio;
- dependências;
- ausência de mudanças fora do escopo;
- possibilidade de operação e rollback.

Código produzido por IA não receberá revisão mais permissiva.

## 23. Auto-revisão obrigatória

Antes de considerar uma alteração pronta, o autor ou agente deverá revisar o próprio diff e responder:

- existe uma solução mais simples?
- algo equivalente já existia?
- foi introduzida duplicação?
- algum nome está vago?
- existe mais de uma responsabilidade?
- há comportamento implícito perigoso?
- comentários explicam motivos?
- existe código morto, debug ou placeholder?
- foi adicionada dependência sem necessidade?
- foram alterados arquivos fora do escopo?
- erros e estados negativos foram tratados?
- as fronteiras arquiteturais foram respeitadas?
- testes cobrem regra, falha e regressão?
- há impacto de desempenho evidente?
- outro engenheiro entenderia a mudança sem consultar a conversa original?

## 24. Regras específicas para agentes de IA

Antes de escrever código, o agente deverá:

1. ler os documentos canônicos relevantes;
2. inspecionar a implementação e o código vizinho;
3. procurar componentes e regras reutilizáveis;
4. identificar convenções locais;
5. escolher a menor mudança coerente;
6. declarar bloqueios quando faltar decisão material.

Durante a implementação, deverá:

- preservar mudanças do usuário;
- evitar reescrever arquivos inteiros sem necessidade;
- não instalar dependências sem justificativa;
- não inventar requisito, stack ou arquitetura;
- não utilizar atalhos inseguros;
- produzir testes junto com a mudança;
- manter código, testes e documentação sincronizados.

Antes de entregar, deverá:

- revisar o diff;
- executar todos os gates aplicáveis;
- remover debug e arquivos temporários;
- informar exatamente o que foi validado;
- não declarar sucesso quando um gate não foi executado ou falhou;
- atualizar a rastreabilidade exigida pelo backlog.

Se uma solicitação entrar em conflito com produto, arquitetura, segurança ou stack canônica, o agente deverá interromper a decisão material e apresentar o conflito ao responsável.

## 25. Anti-padrões de código gerado por IA

Deverão ser identificados e removidos:

- tipos equivalentes com nomes diferentes;
- arquivos gigantes gerados de uma vez;
- abstrações para cenários não solicitados;
- wrappers sem responsabilidade;
- `try/catch` genérico ao redor de grandes blocos;
- uso indiscriminado de tipos inseguros;
- comentários que narram sintaxe;
- nomes genéricos;
- placeholders apresentados como conclusão;
- TODOs sem rastreabilidade;
- dependências desnecessárias;
- reescrita ampla para uma alteração localizada;
- padrões diferentes em módulos vizinhos;
- implementação apenas do caminho feliz;
- otimizações não medidas;
- complexidade criada para demonstrar sofisticação.

## 26. Definition of Done

Uma alteração somente será considerada concluída quando, conforme aplicável:

- atende ao documento e item de backlog de origem;
- utiliza naming técnico em inglês;
- mantém responsabilidade e fronteiras claras;
- reutiliza código existente quando semanticamente adequado;
- não introduz duplicação ou abstração injustificada;
- não adiciona dependência sem justificativa;
- não contém código morto, debug ou placeholder;
- valida entradas não confiáveis;
- autoriza operações sensíveis no servidor;
- não ignora erros silenciosamente;
- não expõe segredos ou dados desnecessários;
- possui testes proporcionais ao risco;
- possui regressão para bug corrigido quando viável;
- passa por lint, formatação, verificação de tipos, testes e build aplicáveis;
- respeita acessibilidade e responsividade quando altera interface;
- possui migration segura quando altera banco;
- possui evidência verificável;
- teve o diff auto-revisado;
- mantém documentação e rastreabilidade atualizadas;
- pode ser compreendida sem depender da conversa que a originou.

## 27. Separação de responsabilidades documentais

- Este documento define como o código será escrito e mantido.
- O Documento 07 definirá as propriedades técnicas e a arquitetura.
- A Visão do Tech Lead escolherá linguagens, runtimes, frameworks, bibliotecas e ferramentas.
- A Infraestrutura e o Plano de Fundação definirão ambientes, serviços, provisionamento e preparação operacional.

Nenhuma dessas camadas deverá substituir silenciosamente a responsabilidade das demais.
