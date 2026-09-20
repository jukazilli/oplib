---
document_id: DOC-03
title: Visão de Product Owner — OPALIB
status: canonical
version: 1.0.0
date: 2026-09-20
approved_by: Juliano Zilli
depends_on:
  - DOC-02
governs:
  - product-decisions
  - priorities
  - business-rules
  - product-trade-offs
  - evolution
---

# Visão de Product Owner — OPALIB

## 1. Propósito deste documento

Este documento define como o OPALIB deverá tomar decisões quando existirem diferentes caminhos possíveis para atender ao briefing.

O Briefing de Produto e Escopo define o que será construído. Esta Visão de Product Owner define:

- o que deve receber prioridade;
- quais valores devem orientar o produto;
- quais trade-offs são aceitáveis;
- quais regras não podem ser alteradas silenciosamente;
- como evitar crescimento desnecessário de escopo;
- qual deve ser a ordem de evolução do produto.

## 2. Visão do Product Owner

O OPALIB deverá ser reconhecido como um acervo pessoal de conhecimento confiável, acessível e vivo.

A experiência deverá valorizar a profundidade do conteúdo sem transformar a leitura em uma atividade pesada. O produto deverá permitir que conhecimentos acadêmicos e profissionais sejam publicados de maneira organizada, encontrados com facilidade e consumidos com conforto.

O OPALIB não deverá competir com redes sociais, plataformas acadêmicas formais ou sistemas completos de gestão de conteúdo. Seu valor estará na combinação de:

- autoria pessoal;
- organização;
- leitura agradável;
- descoberta;
- interação simples;
- segurança;
- identidade interdisciplinar.

## 3. Personalidade do produto

A personalidade do OPALIB deverá ser:

- **curiosa:** demonstra interesse contínuo por aprender;
- **confiável:** apresenta conteúdo organizado e referências claras;
- **acessível:** comunica conhecimento sem criar barreiras desnecessárias;
- **reflexiva:** valoriza análise, aprendizado e evolução;
- **interdisciplinar:** aproxima diferentes áreas sem perder clareza;
- **humana:** preserva a presença e a trajetória do autor;
- **serena:** evita excesso visual, urgência artificial e estímulos desnecessários.

O OPALIB não deverá parecer:

- excessivamente corporativo;
- uma rede social;
- um portal universitário burocrático;
- um currículo estático;
- uma plataforma genérica de artigos;
- uma vitrine com foco apenas em autopromoção.

## 4. Princípios de decisão do produto

### PO-001 — O conteúdo vem primeiro

Quando houver conflito entre destacar o conteúdo e apresentar elementos visuais ou interativos, o conteúdo deverá receber prioridade.

Consequências:

- a leitura deve ocupar a maior parte da atenção;
- curtidas e comentários não devem competir com o artigo;
- elementos decorativos não devem dificultar a compreensão;
- anúncios e distrações não fazem parte do MVP;
- a imagem de capa complementa o conteúdo, mas não o substitui.

### PO-002 — Encontrar deve ser fácil

O leitor não deverá conhecer previamente a estrutura do OPALIB para localizar uma publicação.

Consequências:

- publicações recentes e em destaque devem estar facilmente acessíveis;
- áreas, categorias e tags devem usar termos compreensíveis;
- a pesquisa deve possuir posição perceptível;
- a navegação não deve depender de menus profundos;
- páginas vazias ou sem resultados devem orientar o próximo passo.

### PO-003 — Ler não exige cadastro

Nenhuma barreira de conta deverá ser colocada entre o visitante e o conhecimento publicado.

Consequências:

- leitura, curtida e comentário permanecem sem login;
- conteúdos públicos não devem ser bloqueados por autenticação;
- não haverá pop-ups insistentes solicitando cadastro;
- o produto não deverá criar perfis de leitores silenciosamente.

### PO-004 — Publicar deve ser simples e seguro

O processo de autoria deverá permitir que Juliano se concentre no conteúdo.

Consequências:

- Markdown será o único formato de autoria;
- a prévia deverá representar com fidelidade o resultado publicado;
- publicações começam como rascunho;
- publicar exige uma ação explícita;
- erros de preenchimento devem ser claros;
- ações destrutivas exigem confirmação;
- segurança administrativa não poderá ser removida em troca de conveniência.

### PO-005 — Interação é complementar

Curtidas e comentários existem para aproximar o leitor do conteúdo, não para transformar o OPALIB em uma rede social.

Consequências:

- não haverá perfis públicos;
- não haverá seguidores;
- não haverá feed baseado em popularidade;
- não haverá disputa por posição ou gamificação;
- a contagem de curtidas não deverá dominar a hierarquia visual;
- comentários deverão aparecer depois do conteúdo principal.

### PO-006 — Privacidade antes de métricas detalhadas

O OPALIB deverá coletar somente os dados necessários para funcionar, proteger-se contra abuso e compreender o uso básico do conteúdo.

Consequências:

- curtidas não serão associadas publicamente a pessoas;
- comentários não exigirão e-mail;
- não serão criados perfis comportamentais de leitores;
- métricas detalhadas não justificam coleta excessiva;
- controles antispam deverão utilizar o mínimo de informação necessário.

### PO-007 — Segurança faz parte do produto

Segurança não será tratada como uma atividade posterior.

Consequências:

- autorização administrativa será verificada em todas as operações protegidas;
- conteúdo Markdown e comentários serão interpretados com segurança;
- comentários públicos passarão por controles automáticos;
- falhas de interação não deverão impedir a leitura;
- mecanismos de recuperação deverão proteger o acervo;
- decisões que aumentem a superfície de ataque exigirão justificativa.

### PO-008 — Simplicidade antes de expansão

Uma funcionalidade nova somente deverá entrar quando resolver uma necessidade real do acervo, do autor ou dos leitores.

Consequências:

- o MVP permanecerá com um único autor;
- funcionalidades sociais avançadas permanecerão fora do escopo;
- não serão criadas abstrações para cenários hipotéticos;
- uma solução simples e sustentável será preferida quando atender ao mesmo objetivo;
- crescimento técnico deverá acompanhar necessidade comprovada.

### PO-009 — A identidade interdisciplinar deve permanecer visível

Engenharia de Software e Educação Física não deverão parecer dois sites separados.

Consequências:

- as duas áreas utilizarão a mesma linguagem de produto;
- publicações interdisciplinares poderão pertencer a mais de uma área;
- a identidade visual deverá acomodar diferentes assuntos;
- a organização deverá permitir exploração por área sem fragmentar o acervo.

### PO-010 — O acervo deve permanecer durável

Uma publicação deve continuar acessível e compreensível depois de meses ou anos.

Consequências:

- endereços publicados devem permanecer estáveis;
- alterações de título não devem quebrar links existentes;
- datas e referências devem ser preservadas;
- o conteúdo não deve depender de tendências visuais passageiras;
- exclusões de publicações devem ser excepcionais e protegidas.

## 5. Ordem de prioridades

Quando duas necessidades competirem por tempo ou complexidade, a ordem de prioridade será:

1. integridade e segurança do acervo;
2. qualidade e legibilidade do conteúdo;
3. capacidade de escrever, revisar e publicar;
4. navegação, pesquisa e descoberta;
5. responsividade e acessibilidade;
6. estabilidade e desempenho;
7. moderação e proteção das interações;
8. curtidas e comentários;
9. refinamentos visuais;
10. recursos futuros de crescimento.

Uma funcionalidade de interação não deverá atrasar ou comprometer a publicação e a leitura do conteúdo principal.

## 6. Objetivos da versão MVP

O MVP deverá provar que:

- Juliano consegue criar uma publicação em Markdown;
- a prévia representa adequadamente o conteúdo final;
- uma publicação pode ser salva como rascunho;
- somente o administrador consegue publicar ou alterar artigos;
- o público consegue encontrar e ler conteúdos;
- as áreas de conhecimento permanecem organizadas;
- imagens de capa funcionam em diferentes tamanhos de tela;
- um visitante consegue curtir uma vez por navegador;
- a curtida aumenta o contador e não pode ser desfeita;
- um visitante consegue comentar sem cadastro;
- o comentário aparece imediatamente;
- o administrador consegue ocultar, restaurar ou excluir comentários;
- comportamentos abusivos básicos são limitados;
- o acervo permanece disponível e recuperável.

## 7. Jornadas prioritárias

### Jornada 1 — Descobrir e ler

1. O visitante acessa o OPALIB.
2. Visualiza publicações recentes ou em destaque.
3. Explora uma área, categoria ou pesquisa um assunto.
4. Abre uma publicação.
5. Lê o conteúdo com conforto.
6. Consulta referências ou outros conteúdos relacionados.

Essa é a jornada pública de maior prioridade.

### Jornada 2 — Publicar conhecimento

1. O autor acessa a área administrativa.
2. Cria uma nova publicação.
3. Preenche as informações necessárias.
4. Escreve o conteúdo em Markdown.
5. Acompanha a prévia.
6. Adiciona uma imagem de capa, quando desejar.
7. Salva como rascunho.
8. Revisa o conteúdo.
9. Publica explicitamente.

Essa é a jornada administrativa de maior prioridade.

### Jornada 3 — Interagir sem cadastro

1. O visitante termina ou avança na leitura.
2. Visualiza as opções de interação.
3. Registra uma curtida ou escreve um comentário.
4. A curtida atualiza o contador.
5. O comentário é publicado imediatamente.
6. Nenhuma conta é criada.

### Jornada 4 — Moderar comentários

1. O administrador entra na área protegida.
2. Consulta comentários publicados.
3. Identifica a publicação de origem.
4. Mantém, oculta ou exclui o comentário.
5. Um comentário ocultado poderá ser restaurado.
6. Uma exclusão permanente exigirá confirmação.

## 8. Regras centrais de produto

### Publicações

- Toda publicação nova começa como rascunho.
- Apenas o administrador pode publicar, editar, retirar do ar ou excluir.
- Publicar deve ser uma ação explícita.
- Uma publicação retirada do ar não deve aparecer para visitantes.
- A prévia do Markdown deve se aproximar do conteúdo publicado.
- A imagem de capa é opcional.
- Quando houver capa, o texto alternativo deverá ser informado.
- PDFs e anexos para download não fazem parte do MVP.
- O conteúdo completo deverá ser consumido dentro do OPALIB.
- O endereço público deverá ser estável.

### Curtidas

- A curtida não exige autenticação.
- Cada navegador poderá curtir uma publicação uma vez em condições normais.
- Curtir aumenta o contador em uma unidade.
- A curtida não poderá ser desfeita pelo visitante.
- Depois da curtida, a ação deverá indicar que foi concluída.
- Nenhuma lista de pessoas que curtiram deverá existir.
- A contagem não deverá ser utilizada para ocultar conteúdos menos populares.

### Comentários

- O comentário não exige autenticação ou e-mail.
- O nome é opcional.
- Sem nome, o comentário será exibido como “Anônimo”.
- O comentário será publicado imediatamente.
- Comentários deverão possuir limite de tamanho.
- Conteúdo inseguro ou identificado como abuso poderá ser recusado.
- Comentários aparecem depois do conteúdo da publicação.
- Não haverá respostas encadeadas no MVP.

### Moderação

- Ocultar deverá ser a ação preferencial quando for necessário retirar um comentário da área pública sem apagá-lo imediatamente.
- Comentários ocultados poderão ser restaurados.
- Excluir será uma ação permanente e deverá exigir confirmação.
- Apenas o administrador poderá moderar comentários.
- O visitante não poderá editar ou excluir um comentário depois do envio.
- A moderação não deverá alterar o conteúdo original do comentário.

### Organização

- Uma publicação poderá pertencer a mais de uma área quando for interdisciplinar.
- Categorias devem representar agrupamentos amplos e úteis.
- Tags devem representar assuntos específicos.
- O sistema deverá evitar categorias ou tags duplicadas com pequenas variações de escrita.
- Informações acadêmicas, como curso e disciplina, serão opcionais quando não se aplicarem.

## 9. Trade-offs aprovados

### Conteúdo sobre ornamentação

Se uma escolha visual prejudicar legibilidade, desempenho ou acessibilidade, ela deverá ser simplificada.

### Simplicidade sobre flexibilidade hipotética

O produto não deverá ser preparado para múltiplos autores antes que essa necessidade exista.

### Privacidade sobre análise detalhada

O OPALIB aceitará possuir menos informações sobre os visitantes para evitar coleta desnecessária.

### Interação imediata sobre moderação prévia

Comentários serão publicados imediatamente, aceitando o risco de exposição temporária a conteúdo inadequado.

Esse risco deverá ser reduzido por controles automáticos e moderação posterior.

### Engajamento leve sobre dinâmica social

Curtidas e comentários serão mantidos simples, sem perfis, seguidores, ranking ou notificações.

### Curadoria humana sobre automação editorial

O autor decide o que publicar, destacar, organizar e retirar do ar.

O MVP não delegará decisões editoriais a inteligência artificial.

### Segurança administrativa sobre acesso rápido

Caso exista conflito entre reduzir etapas de autenticação e proteger o acervo, a proteção do acervo terá prioridade.

### Desempenho sobre arquivos originais pesados

Imagens poderão ser otimizadas para carregamento, desde que preservem qualidade visual suficiente.

## 10. Critérios de valor

Uma funcionalidade deverá demonstrar pelo menos um dos seguintes valores para justificar sua inclusão:

- ajuda o autor a publicar;
- ajuda o leitor a encontrar;
- melhora a experiência de leitura;
- preserva ou organiza conhecimento;
- protege o acervo;
- facilita compartilhamento;
- permite interação simples;
- reduz esforço de manutenção;
- melhora acessibilidade;
- evita perda ou corrupção de conteúdo.

Funcionalidades baseadas apenas em tendência, aparência ou possibilidade futura não serão suficientes.

## 11. Indicadores iniciais

O MVP poderá acompanhar indicadores simples, sem criar um sistema analítico complexo:

- quantidade de publicações;
- publicações por área;
- frequência de publicação;
- visualizações quando isso puder ser feito com privacidade;
- quantidade de curtidas;
- quantidade de comentários;
- comentários ocultados ou excluídos;
- pesquisas sem resultado;
- falhas de publicação;
- tentativas de abuso bloqueadas.

Esses indicadores deverão apoiar decisões, não transformar o OPALIB em uma busca por engajamento.

## 12. Ordem macro de evolução

### Etapa 1 — Fundação segura

- repositório;
- qualidade de código;
- ambientes;
- banco de dados;
- autenticação administrativa;
- segurança;
- publicação na Vercel;
- backups e recuperação.

### Etapa 2 — Núcleo editorial

- criação e edição em Markdown;
- prévia;
- rascunhos;
- publicação;
- imagem de capa;
- organização por áreas, categorias e tags.

### Etapa 3 — Experiência pública

- página inicial;
- listagens;
- publicação individual;
- pesquisa;
- navegação;
- responsividade;
- acessibilidade;
- compartilhamento e descoberta.

### Etapa 4 — Interações

- curtidas;
- comentários;
- proteção contra abuso;
- moderação.

### Etapa 5 — Aprendizado e refinamento

- observar o uso real;
- corrigir dificuldades;
- melhorar organização;
- avaliar conteúdos relacionados;
- revisar necessidades futuras sem ampliar escopo automaticamente.

## 13. Decisões que não devem ser revertidas sem revisão documental

As seguintes decisões exigem revisão explícita do briefing e desta Visão de Product Owner:

- deixar de ser um acervo centrado em conteúdo;
- transformar o OPALIB em uma rede social;
- exigir cadastro para leitura;
- exigir login ou e-mail para comentar;
- permitir publicação pública por terceiros;
- adicionar múltiplos autores ao MVP;
- substituir Markdown por um editor visual;
- oferecer anexos para download no MVP;
- permitir que o visitante desfaça uma curtida;
- adicionar perfis, seguidores ou ranking;
- coletar dados pessoais desnecessários;
- introduzir inteligência artificial para decidir o que deve ser publicado;
- adotar uma solução que aumente significativamente a complexidade operacional sem necessidade comprovada.

## 14. Proteção contra crescimento de escopo

Antes de acrescentar uma funcionalidade, deverão ser respondidas estas perguntas:

1. Qual problema real ela resolve?
2. Esse problema já foi observado?
3. Ela pertence ao objetivo do OPALIB?
4. Pode ser resolvida de forma mais simples?
5. A funcionalidade cria necessidade de cadastro?
6. Aumenta coleta de dados?
7. Aumenta risco de segurança?
8. Aumenta manutenção para uma única pessoa?
9. Pode esperar até depois do MVP?
10. Exige revisão de um documento canônico?

Se não houver valor claro, a funcionalidade deverá permanecer fora do escopo.

## 15. Regra final de decisão

Quando existir dúvida entre duas soluções, o OPALIB deverá escolher aquela que:

1. protege melhor o acervo;
2. mantém o conteúdo no centro;
3. facilita leitura e descoberta;
4. reduz esforço de publicação;
5. preserva a privacidade;
6. evita complexidade desnecessária;
7. permanece sustentável para um único administrador.

O OPALIB deverá crescer como o conhecimento que armazena: de forma contínua, organizada e consciente.
