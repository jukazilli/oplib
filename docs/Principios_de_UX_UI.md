---
document_id: UX-PRINCIPLES
title: Princípios de UX/UI — OPALIB
status: canonical
version: 1.0.0
date: 2026-09-20
approved_by: Juliano Zilli
depends_on:
  - DOC-02
  - DOC-03
governs:
  - experience
  - interface-decisions
  - accessibility
  - responsiveness
  - language
---

# Princípios de UX/UI — OPALIB

## 1. Propósito

Este documento funciona como a constituição de experiência do OPALIB.

Ele não define ainda cores, fontes, componentes ou telas específicas. Sua função é orientar decisões quando existirem diferentes soluções de interface possíveis.

Os princípios deverão ser consultados durante:

- criação do Design System;
- definição das telas;
- especificação das jornadas;
- implementação;
- revisão visual;
- testes de usabilidade e acessibilidade.

## 2. Experiência desejada

O OPALIB deverá transmitir a sensação de entrar em uma biblioteca pessoal contemporânea: organizada, acolhedora, confiável e cheia de caminhos para novas descobertas.

A experiência deverá ser:

- simples sem parecer incompleta;
- acadêmica sem parecer burocrática;
- pessoal sem parecer informal demais;
- visualmente interessante sem competir com a leitura;
- interdisciplinar sem fragmentar a identidade;
- interativa sem assumir comportamento de rede social.

## 3. Contextos principais

### Área pública

A tarefa predominante é descobrir e ler conhecimento.

Prioridades:

1. encontrar uma publicação;
2. compreender sobre o que ela trata;
3. ler com conforto;
4. explorar conteúdos relacionados;
5. interagir depois da leitura.

### Área administrativa

A tarefa predominante é escrever, revisar e publicar com segurança.

Prioridades:

1. produzir o conteúdo;
2. conferir a prévia;
3. identificar o estado da publicação;
4. salvar o trabalho;
5. publicar conscientemente;
6. moderar comentários.

A área administrativa poderá ser mais funcional, mas deverá preservar a personalidade e os padrões do OPALIB.

## P-UX-001 — O conteúdo domina a experiência

### Objetivo

Manter o conhecimento como principal motivo de atenção.

### Regra

Em páginas de publicação, nenhum elemento visual, promocional ou interativo deverá competir com o título, o resumo e o conteúdo.

### Critérios

- o título e o início do texto devem ser reconhecidos rapidamente;
- a imagem de capa deve apoiar o assunto, não ocupar toda a experiência;
- curtidas e comentários devem aparecer depois do conteúdo ou em posição secundária;
- menus, compartilhamento e metadados devem possuir hierarquia inferior à leitura;
- não utilizar pop-ups que interrompam a leitura;
- não utilizar anúncios no MVP;
- animações não devem distrair ou atrasar o acesso ao conteúdo.

### Perguntas de avaliação

1. O leitor identifica rapidamente o assunto da publicação?
2. Algum elemento compete com o texto?
3. A página continua clara sem a imagem de capa?
4. A interação está interrompendo a leitura?

## P-UX-002 — Uma tarefa mental dominante

### Objetivo

Reduzir dúvidas sobre o que fazer em cada tela ou estado.

### Regra

Cada tela deverá possuir uma tarefa mental dominante e somente uma ação de maior hierarquia por estado.

### Critérios

- a página inicial prioriza descobrir uma publicação;
- a página de leitura prioriza ler;
- o editor prioriza escrever e revisar;
- a moderação prioriza analisar comentários;
- ações secundárias não devem competir visualmente com a principal;
- ações destrutivas não devem ser apresentadas como ações principais;
- informações sem utilidade imediata devem perder hierarquia ou aparecer sob demanda.

### Perguntas de avaliação

1. O objetivo da tela pode ser entendido rapidamente?
2. Mais de uma ação disputa a atenção?
3. Existem informações visíveis sem utilidade para a tarefa atual?
4. O usuário precisa procurar onde continuar?

## P-UX-003 — Baixa densidade com progressão de informação

### Objetivo

Permitir que leitores e administrador processem informações sem sobrecarga.

### Regra

O OPALIB deverá apresentar primeiro o conteúdo necessário para a decisão atual e revelar detalhes adicionais quando forem úteis.

### Critérios

- evitar excesso de cards, caixas, bordas e divisões;
- limitar a quantidade de informações concorrendo na mesma região;
- apresentar metadados acadêmicos de forma organizada e secundária;
- filtros avançados devem aparecer somente quando necessários;
- ações administrativas pouco frequentes devem ficar fora da área principal;
- espaços vazios devem organizar o conteúdo, e não apenas decorar;
- informações relacionadas devem permanecer visualmente próximas.

### Perguntas de avaliação

1. A tela pode ser compreendida sem ler todos os elementos?
2. Informações secundárias estão competindo com as principais?
3. Existem controles exibidos antes de serem necessários?
4. A interface parece fragmentada em caixas demais?

## P-UX-004 — Leitura longa deve ser confortável

### Objetivo

Permitir o consumo de artigos, trabalhos acadêmicos e pesquisas sem esforço visual desnecessário.

### Regra

Tipografia, largura do texto, espaçamento e contraste deverão ser definidos para leitura prolongada em diferentes dispositivos.

### Critérios

- o corpo do texto deve possuir tamanho e espaçamento confortáveis;
- as linhas não devem ser excessivamente longas;
- títulos devem formar uma hierarquia reconhecível;
- citações, listas, tabelas e blocos de código devem ser distinguíveis;
- referências bibliográficas devem permanecer legíveis;
- links devem ser reconhecidos sem depender somente de cor;
- o contraste deve atender aos requisitos de acessibilidade;
- o aumento de zoom não deve quebrar o conteúdo;
- o texto não deve depender da imagem de capa para ser compreendido.

### Perguntas de avaliação

1. É confortável ler a página por vários minutos?
2. A hierarquia entre título, subtítulos e corpo está clara?
3. O leitor consegue distinguir links, citações e referências?
4. A leitura continua adequada no celular e com zoom?

## P-UX-005 — Orientação sempre perceptível

### Objetivo

Evitar que o visitante se perca dentro do acervo.

### Regra

O usuário deverá compreender onde está, qual assunto está lendo e como continuar explorando.

### Critérios

- a identidade OPALIB deve retornar à página inicial;
- a área de conhecimento deve estar visível na publicação;
- categorias e tags devem ser reconhecíveis como caminhos de navegação;
- resultados de pesquisa devem indicar o termo pesquisado;
- páginas sem resultados devem oferecer alternativas;
- o leitor deve conseguir retornar ao contexto anterior;
- a navegação principal deve permanecer curta e previsível;
- não depender de gestos ocultos ou conhecimento prévio.

### Perguntas de avaliação

1. O leitor sabe onde está?
2. Consegue retornar ou seguir para outro conteúdo?
3. Categorias e tags ajudam ou apenas acrescentam ruído?
4. Uma pesquisa sem resultado orienta o próximo passo?

## P-UX-006 — Descoberta sem feed viciante

### Objetivo

Ajudar o leitor a encontrar conhecimento sem utilizar padrões de retenção artificial.

### Regra

A descoberta deverá ser orientada por relevância editorial, recência, área e relação temática, não por mecanismos de consumo infinito.

### Critérios

- publicações em destaque representam curadoria do autor;
- publicações recentes devem ser claramente identificadas;
- conteúdos relacionados devem possuir relação compreensível;
- não utilizar rolagem infinita no MVP;
- não utilizar urgência artificial;
- não esconder conteúdo antigo apenas por possuir menos curtidas;
- a quantidade de curtidas não deve determinar sozinha o destaque;
- o leitor deve perceber quando chegou ao final de uma lista.

### Perguntas de avaliação

1. O sistema ajuda a descobrir sem pressionar o consumo?
2. Está claro por que uma publicação foi destacada?
3. Conteúdos menos populares continuam acessíveis?
4. A navegação possui começo, contexto e término?

## P-UX-007 — Interação leve e posterior à leitura

### Objetivo

Permitir participação sem transformar o OPALIB em uma rede social.

### Regra

Curtidas e comentários deverão ser fáceis de encontrar, mas permanecer subordinados ao conteúdo.

### Critérios

- a curtida não deve dominar a página;
- o contador deve ser informativo, não competitivo;
- comentários devem aparecer depois da publicação;
- não utilizar avatares, níveis, ranking ou indicadores de popularidade pessoal;
- o formulário deve pedir apenas nome opcional e comentário;
- a opção de comentar como “Anônimo” deve ser clara;
- o visitante deve ser informado de que o comentário aparecerá imediatamente;
- não incentivar comentários com notificações ou pressão visual.

### Perguntas de avaliação

1. A interação complementa ou compete com a leitura?
2. O formulário solicita somente o necessário?
3. Está claro que o comentário será público imediatamente?
4. A interface está criando comportamento de rede social?

## P-UX-008 — Toda ação deve produzir feedback claro

### Objetivo

Eliminar incerteza depois de ações do usuário.

### Regra

Curtidas, comentários, salvamentos, publicações e moderações deverão comunicar claramente sucesso, erro ou processamento.

### Critérios

- a curtida deve mostrar que foi registrada;
- depois de curtir, a ação deverá ficar indisponível;
- a interface deverá comunicar que a curtida não pode ser desfeita;
- o comentário deverá aparecer após o envio bem-sucedido;
- erros de comentário devem preservar o texto digitado quando possível;
- salvar rascunho deve apresentar confirmação perceptível;
- publicar deve apresentar o novo estado da publicação;
- ocultar e restaurar comentários deve atualizar o estado imediatamente;
- mensagens não devem expor detalhes técnicos.

### Perguntas de avaliação

1. O usuário sabe se a ação funcionou?
2. O estado atualizado está visível?
3. Um erro obriga o usuário a repetir trabalho?
4. A mensagem explica o que aconteceu e como continuar?

## P-UX-009 — Estados devem ser explícitos

### Objetivo

Evitar erros causados por estados ambíguos.

### Regra

O estado de publicações, comentários e operações administrativas deverá ser visível e compreensível.

### Critérios

- rascunho e publicado não podem parecer iguais;
- uma publicação retirada do ar deve ser claramente identificada no painel;
- comentários visíveis e ocultos devem possuir distinção além da cor;
- alterações ainda não salvas devem ser perceptíveis;
- processos em andamento devem possuir estado de carregamento;
- controles indisponíveis devem explicar o motivo quando necessário;
- o sistema não deve aparentar sucesso antes da confirmação do servidor.

### Perguntas de avaliação

1. O estado atual é reconhecível sem abrir detalhes?
2. A distinção depende somente de cor?
3. O administrador sabe se existem alterações não salvas?
4. A interface pode indicar sucesso antes da operação terminar?

## P-UX-010 — Publicar é uma decisão consciente

### Objetivo

Evitar publicação acidental ou conteúdo não revisado.

### Regra

Escrever, salvar rascunho e publicar deverão ser ações distintas.

### Critérios

- novas publicações começam como rascunho;
- salvar não deve publicar automaticamente;
- o estado atual deve permanecer visível durante a edição;
- a prévia deve estar acessível sem perder o conteúdo;
- a ação “Publicar” deve ser inequívoca;
- a confirmação deve resumir o que ficará público;
- retirar do ar não deve ser confundido com excluir;
- exclusão permanente exige confirmação reforçada.

### Perguntas de avaliação

1. O autor sabe se o conteúdo está público?
2. Existe risco de publicar ao tentar apenas salvar?
3. A prévia representa o resultado final?
4. Retirar do ar e excluir possuem diferenças claras?

## P-UX-011 — Destruição deve ser difícil; recuperação deve ser fácil

### Objetivo

Proteger o acervo e reduzir o impacto de erros administrativos.

### Regra

Ações destrutivas deverão possuir menor destaque, confirmação proporcional ao risco e, quando previsto, caminho de recuperação.

### Critérios

- excluir nunca deve ser a ação primária;
- ocultar comentário deve ser preferido a excluir;
- comentários ocultados devem poder ser restaurados;
- excluir comentário exige confirmação;
- excluir publicação exige confirmação reforçada;
- retirar publicação do ar deve ser reversível;
- a confirmação deve nomear claramente o item afetado;
- ações destrutivas não devem usar textos vagos como “Continuar”.

### Perguntas de avaliação

1. É possível executar uma exclusão por engano?
2. A consequência está explícita?
3. Existe alternativa reversível?
4. O item afetado aparece na confirmação?

## P-UX-012 — Responsividade deve preservar intenção

### Objetivo

Garantir que o OPALIB funcione adequadamente em celular, tablet e desktop.

### Regra

Responsividade não será apenas diminuir a interface; cada tamanho deverá preservar leitura, hierarquia e acesso às ações relevantes.

### Critérios

- o conteúdo não deve exigir rolagem horizontal;
- imagens de capa devem adaptar-se sem deformação;
- tabelas e blocos de código devem possuir tratamento adequado;
- controles de toque devem possuir tamanho confortável;
- a ação principal do editor deve permanecer encontrável;
- navegação móvel não deve esconder caminhos essenciais;
- formulários devem funcionar com teclado virtual;
- a prévia Markdown deve continuar utilizável em telas menores.

### Perguntas de avaliação

1. A tarefa continua possível no celular?
2. Alguma informação importante desaparece?
3. Elementos foram apenas comprimidos?
4. Imagens, tabelas e código continuam utilizáveis?

## P-UX-013 — Acessibilidade é requisito de base

### Objetivo

Permitir que diferentes pessoas utilizem e compreendam o OPALIB.

### Regra

A experiência deverá funcionar com teclado, tecnologias assistivas, diferentes níveis de visão e preferências de movimento.

### Critérios

- todas as ações devem ser acessíveis por teclado;
- o foco deve permanecer visível;
- a ordem de foco deve acompanhar a leitura;
- imagens de capa devem possuir texto alternativo;
- campos devem possuir rótulos claros;
- erros devem estar associados ao campo correspondente;
- estados não devem depender somente de cor;
- movimentos devem respeitar preferências de redução;
- a estrutura de títulos deve ser semanticamente correta;
- controles devem possuir nomes compreensíveis para leitores de tela.

### Perguntas de avaliação

1. É possível concluir a tarefa sem mouse?
2. O foco está sempre visível?
3. Cor é o único sinal de estado?
4. A estrutura faz sentido para tecnologias assistivas?

## P-UX-014 — Uma identidade única para várias áreas

### Objetivo

Representar Engenharia de Software e Educação Física dentro do mesmo produto.

### Regra

As áreas poderão possuir sinais de diferenciação, mas deverão compartilhar estrutura, linguagem, componentes e identidade principal.

### Critérios

- não criar dois temas visuais independentes;
- utilizar rótulos claros para distinguir áreas;
- diferenças de cor, quando existirem, devem funcionar como apoio;
- publicações interdisciplinares devem ser representadas sem conflito;
- a navegação deve permitir alternar áreas sem parecer uma troca de site;
- componentes devem manter o mesmo comportamento em todo o acervo.

### Perguntas de avaliação

1. As áreas parecem pertencer ao mesmo produto?
2. A distinção continua compreensível sem cor?
3. Conteúdos interdisciplinares possuem representação natural?
4. Alguma área parece visualmente mais importante sem justificativa?

## P-UX-015 — A metáfora da opala deve ser sutil

### Objetivo

Criar identidade própria sem prejudicar serenidade e legibilidade.

### Regra

A ideia de múltiplas cores e perspectivas deverá aparecer por meio de detalhes controlados, e não por excesso de efeitos.

### Critérios

- manter uma base visual estável e tranquila;
- utilizar variações cromáticas como acentos;
- evitar gradientes intensos em grandes áreas de leitura;
- evitar brilho, transparência e efeitos que reduzam contraste;
- a marca pode expressar variedade sem mudar constantemente;
- elementos da identidade não devem aumentar o tempo de carregamento;
- a referência à opala não precisa ser literal em todas as telas.

### Perguntas de avaliação

1. A identidade é reconhecível sem dominar o conteúdo?
2. O uso de cores preserva contraste e serenidade?
3. A metáfora está enriquecendo ou decorando excessivamente?
4. A interface continuaria coerente com menos efeitos?

## P-UX-016 — Linguagem clara, humana e responsável

### Objetivo

Comunicar conhecimento e ações sem burocracia ou jargão técnico desnecessário.

### Regra

Textos da interface deverão explicar a tarefa do usuário, não a estrutura interna do sistema.

### Preferir

- “Salvar rascunho”
- “Publicar”
- “Retirar do ar”
- “Ocultar comentário”
- “Seu comentário foi publicado”
- “Nenhuma publicação encontrada”

### Evitar

- “Persistir conteúdo”
- “Alterar status da entidade”
- “Executar operação”
- “Falha no endpoint”
- “Registro processado com sucesso”

### Critérios

- mensagens devem dizer o que aconteceu;
- erros devem indicar como continuar;
- confirmações devem citar a ação e o item;
- textos não devem culpar o usuário;
- o tom deve ser humano, sereno e objetivo;
- linguagem acadêmica pertence ao conteúdo, não aos controles do sistema.

### Perguntas de avaliação

1. A mensagem pode ser entendida sem conhecimento técnico?
2. O usuário sabe como continuar?
3. O texto está descrevendo a tarefa ou a implementação?
4. O tom combina com a personalidade do OPALIB?

## P-UX-017 — Confiança deve ser perceptível

### Objetivo

Demonstrar cuidado editorial e transparência.

### Regra

O leitor deverá reconhecer autoria, datas, referências e estados sem precisar procurá-los excessivamente.

### Critérios

- autoria deve estar identificada;
- data original e data de publicação devem ser diferenciadas quando aplicável;
- referências devem possuir apresentação consistente;
- links externos devem ser reconhecíveis;
- conteúdos atualizados devem poder indicar a atualização;
- comentários devem distinguir autor informado e “Anônimo”;
- contagens não devem sugerir precisão ou identidade inexistente;
- mensagens de privacidade devem ser claras e proporcionais.

### Perguntas de avaliação

1. Está claro quem publicou o conteúdo?
2. Datas e referências podem ser compreendidas?
3. A interface faz alguma promessa que o sistema não consegue comprovar?
4. Dados anônimos estão sendo apresentados como identificados?

## P-UX-018 — A interação deve ser decidida antes de ser codificada

### Objetivo

Evitar que componentes e fluxos sejam escolhidos por hábito da ferramenta, convenção genérica ou preferência do implementador.

### Regra

Nenhuma experiência relevante será implementada enquanto seu contrato de interação permanecer ambíguo. O tipo de controle deverá decorrer da tarefa, dos dados, das permissões e dos estados esperados.

### Critérios

- cada campo define origem dos dados, cardinalidade, obrigatoriedade e possibilidade de criação;
- cada controle define comportamento com mouse, teclado, toque e tecnologia assistiva;
- carregamento, vazio, ausência de resultado, erro, sucesso e indisponibilidade são especificados quando aplicáveis;
- ações reversíveis preferem feedback com possibilidade de desfazer;
- ações destrutivas ou de grande consequência exigem confirmação proporcional;
- fluxos longos usam etapas somente quando a divisão reduz carga cognitiva e permite retomada;
- pop-up, diálogo, gaveta, popover ou tela dedicada não são escolhidos antes de se definir contexto, consequência e quantidade de informação;
- uma lacuna de interação bloqueia somente o slice afetado e vira item rastreável antes do código.

### Perguntas de avaliação

1. Por que este tipo de controle é adequado aos dados e à tarefa?
2. O usuário pode pesquisar, selecionar, criar, remover ou corrigir? Quais dessas ações são permitidas?
3. O que acontece sem opções, sem resultado, com erro ou no celular?
4. A confirmação é necessária ou apenas acrescenta atrito?
5. A decisão foi aprovada ou foi presumida pelo implementador?

## 4. Regras transversais

Toda decisão de UX/UI deverá:

- preservar o conteúdo como foco;
- reduzir carga cognitiva;
- possuir hierarquia clara;
- funcionar em celular e desktop;
- considerar teclado e tecnologias assistivas;
- comunicar estados e consequências;
- evitar coleta desnecessária;
- manter a identidade interdisciplinar;
- evitar padrões manipulativos de engajamento;
- ser sustentável para um único administrador.
- possuir contrato de interação aprovado antes da implementação quando não for trivial.

## 5. Checklist mínimo de avaliação

Antes de aprovar uma tela, fluxo ou componente, verificar:

1. Qual é a tarefa mental dominante?
2. Qual é a ação principal?
3. Existe competição visual?
4. O conteúdo continua sendo o foco?
5. O estado atual está claro?
6. Existe feedback após ações?
7. Erros permitem recuperação?
8. A experiência funciona no celular?
9. É possível utilizar com teclado?
10. Informações dependem somente de cor?
11. Algum dado desnecessário está sendo solicitado?
12. A solução parece pertencer ao OPALIB?
13. A interface está criando comportamento de rede social?
14. A solução adiciona complexidade sem valor comprovado?
15. O controle e seus estados foram definidos antes do código?

## 6. Decisões que este documento não toma

Este documento não define ainda:

- paleta de cores;
- tipografia;
- logotipo;
- grid;
- espaçamentos;
- componentes;
- formatos exatos das páginas;
- posição definitiva da navegação;
- aparência do editor Markdown;
- tecnologia de interface.

Essas decisões pertencem ao Documento 04 — Direção de UI e Design System, respeitando os princípios estabelecidos aqui.

## 7. Direção consolidada

O OPALIB deverá se comportar como uma biblioteca contemporânea, serena e pessoal, com diversidade visual sutil inspirada na opala e forte prioridade para leitura longa.
