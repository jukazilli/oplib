---
document_id: DOC-05
title: Especificação de UX e Fluxos — OPALIB
status: canonical
version: 1.0.0
date: 2026-09-20
approved_by: Juliano Zilli
depends_on:
  - DOC-02
  - DOC-03
  - Principios_de_UX_UI.md
  - DOC-04
governs:
  - user-journeys
  - interaction-flows
  - interface-states
  - validation
  - feedback
  - recovery
---

# Especificação de UX e Fluxos — OPALIB

## 1. Objetivo

Este documento descreve como visitantes e administrador utilizarão o OPALIB.

Ele transforma o briefing, os princípios de UX/UI e o Design System em:

- jornadas;
- fluxos;
- estados;
- validações;
- mensagens;
- comportamentos de erro;
- regras de recuperação;
- critérios de aceite.

O documento não define banco de dados, APIs ou implementação técnica. Essas decisões serão tratadas na arquitetura.

## 2. Perfis de uso

### Visitante

Pode:

- navegar pelo acervo;
- pesquisar e filtrar publicações;
- ler conteúdos;
- compartilhar links;
- curtir uma publicação;
- comentar com nome ou como anônimo;
- consultar informações sobre o autor.

Não pode:

- criar ou editar publicações;
- desfazer curtidas;
- editar ou excluir comentários;
- acessar a administração.

### Autor e moderador

Inicialmente será apenas Juliano Zilli.

Pode:

- autenticar-se;
- criar e editar publicações;
- utilizar Markdown e visualizar a prévia;
- publicar e retirar conteúdos do ar;
- administrar destaques;
- moderar comentários;
- administrar categorias e tags;
- excluir conteúdos mediante confirmação.

## 3. Estrutura de navegação

### Área pública

- Início;
- Publicações;
- Áreas;
- Pesquisa;
- Sobre;
- Página da publicação;
- Política de privacidade.

A administração não será divulgada na navegação pública.

### Área administrativa

- Visão geral;
- Publicações;
- Nova publicação;
- Categorias e tags;
- Comentários;
- Configurações essenciais;
- Sair.

## 4. Jornada de descoberta

### Entrada pela página inicial

Ao entrar no OPALIB, o visitante deverá:

1. compreender rapidamente a finalidade do acervo;
2. visualizar a publicação principal em destaque;
3. encontrar outras publicações destacadas;
4. consultar as publicações mais recentes;
5. explorar Engenharia de Software e Educação Física;
6. abrir uma publicação.

A página inicial não utilizará rolagem infinita.

### Estados

#### Carregando

- A estrutura principal aparece com espaços reservados.
- O cabeçalho permanece utilizável.
- O carregamento de imagens não bloqueia os títulos.

#### Sem publicações

Mensagem sugerida:

> O acervo está sendo preparado. Novas publicações serão adicionadas em breve.

#### Falha temporária

Mensagem sugerida:

> Não foi possível carregar as publicações agora. Tente novamente.

A falha de uma seção não deverá inutilizar toda a página.

## 5. Pesquisa e exploração do acervo

O visitante poderá pesquisar por texto e aplicar filtros.

### Filtros iniciais

- área;
- tipo de publicação;
- categoria;
- tag;
- período, quando necessário.

### Fluxo

1. O visitante abre o acervo ou a pesquisa.
2. Digita um termo ou seleciona filtros.
3. Executa a pesquisa.
4. O sistema apresenta o total de resultados.
5. O visitante pode abrir uma publicação, alterar filtros ou avançar pela paginação.

A pesquisa vazia apresenta o acervo completo.

Termos e filtros deverão permanecer no endereço da página. Isso permitirá:

- compartilhar uma pesquisa;
- utilizar voltar e avançar do navegador;
- atualizar a página sem perder o contexto.

### Estado sem resultados

Mensagem sugerida:

> Nenhuma publicação foi encontrada com estes critérios.

A interface oferecerá:

- limpar todos os filtros;
- revisar o termo pesquisado;
- explorar uma das áreas.

### Falha na pesquisa

Os filtros e o texto digitado serão preservados.

Mensagem sugerida:

> Não foi possível concluir a pesquisa. Seus filtros foram mantidos para você tentar novamente.

## 6. Leitura de uma publicação

A página seguirá esta ordem:

1. área e tipo;
2. título;
3. resumo;
4. autor e datas;
5. imagem de capa, quando houver;
6. conteúdo;
7. referências;
8. tags;
9. compartilhamento;
10. curtida;
11. comentários;
12. conteúdos relacionados.

### Regras de leitura

- A coluna de texto será confortável para leitura longa.
- Não haverá barra lateral densa.
- Curtidas e comentários aparecerão depois do conteúdo.
- A ausência de imagem de capa não deixará um espaço vazio.
- Links externos serão identificáveis e abertos de maneira segura.
- Tabelas e blocos de código deverão permanecer utilizáveis em telas pequenas.

### Publicação inexistente ou retirada

Mensagem sugerida:

> Esta publicação não está disponível.

A página oferecerá retorno para o acervo, sem revelar informações administrativas.

## 7. Compartilhamento

O visitante poderá compartilhar o endereço permanente da publicação.

### Comportamento

- Em dispositivos compatíveis, será utilizado o compartilhamento nativo.
- Nos demais casos, o endereço será copiado.
- O sistema informará quando a cópia for concluída.

Mensagem de sucesso:

> Link copiado.

Mensagem de erro:

> Não foi possível copiar o link. Você ainda pode copiá-lo pela barra do navegador.

## 8. Curtidas

A curtida não exigirá login e não poderá ser desfeita.

### Estados

#### Disponível

- Exibe o total atual.
- A ação “Curtir” permanece habilitada.

#### Processando

- O botão fica temporariamente indisponível.
- Cliques repetidos são ignorados.
- A contagem ainda não é alterada visualmente.

#### Registrada

- O servidor confirma a operação.
- A contagem aumenta.
- O botão muda para o estado “Curtido”.
- A ação permanece desabilitada.

Mensagem:

> Curtida registrada. Obrigado!

#### Já registrada

Quando o servidor identificar uma curtida anterior do mesmo navegador:

> Esta publicação já recebeu uma curtida deste navegador.

A contagem apresentada será sincronizada com o valor confirmado pelo servidor.

#### Erro temporário

> Não foi possível registrar sua curtida agora. Tente novamente.

O botão volta a ficar disponível apenas quando uma nova tentativa for segura.

## 9. Comentários

Comentários serão publicados imediatamente, sem login e sem aprovação prévia.

### Campos

#### Nome

- opcional;
- máximo de 80 caracteres;
- quando vazio, será utilizado “Anônimo”.

#### Comentário

- obrigatório;
- texto simples;
- máximo de 1.500 caracteres;
- não aceitará HTML ou Markdown;
- não executará código;
- links serão tratados como texto comum no MVP.

### Aviso apresentado antes do envio

> Seu comentário será publicado imediatamente. Não inclua informações pessoais ou sensíveis.

### Fluxo

1. O visitante informa um nome ou deixa o campo vazio.
2. Escreve o comentário.
3. Seleciona “Publicar comentário”.
4. O sistema valida e envia o conteúdo.
5. Após a confirmação, o comentário aparece na lista.
6. O formulário é limpo somente depois do sucesso.

### Estados

#### Enviando

- O botão fica indisponível.
- O texto permanece visível.

#### Publicado

Mensagem:

> Comentário publicado.

O novo comentário será destacado brevemente para facilitar sua localização.

#### Campo vazio

> Escreva um comentário antes de publicar.

#### Limite excedido

> Seu comentário ultrapassou o limite de 1.500 caracteres.

#### Recusado por segurança

> Este comentário não pôde ser publicado porque foi identificado como potencialmente inseguro ou abusivo.

#### Muitas tentativas

> Foram realizadas muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.

#### Falha temporária

> Não foi possível publicar agora. Seu texto foi preservado para uma nova tentativa.

Erros recuperáveis não apagarão o comentário digitado.

### Lista vazia

> Ainda não há comentários. Você pode iniciar a conversa.

## 10. Autenticação administrativa

A administração será acessada por endereço próprio.

### Fluxo

1. O autor abre a página administrativa.
2. Informa suas credenciais.
3. O sistema valida a autenticação no servidor.
4. Em caso de sucesso, apresenta a visão geral.
5. Em caso de falha, apresenta uma mensagem genérica.

Mensagem de falha:

> Não foi possível entrar com as informações fornecidas.

A interface não revelará:

- se o usuário existe;
- qual campo estava correto;
- detalhes técnicos da autenticação.

Tentativas repetidas deverão ser limitadas.

### Sessão expirada

Quando uma sessão expirar:

- ações administrativas serão bloqueadas;
- o autor será convidado a entrar novamente;
- conteúdo não salvo será preservado no navegador quando possível;
- após a autenticação, o autor retornará ao contexto anterior.

## 11. Visão geral administrativa

A tela deverá apresentar apenas informações úteis para continuar o trabalho:

- quantidade de publicações;
- rascunhos;
- publicações retiradas do ar;
- comentários recentes;
- comentários ocultos;
- ação “Nova publicação”.

Não haverá gráficos no MVP.

## 12. Criação de publicação

Toda nova publicação começará como rascunho.

### Campos obrigatórios para publicar

- título;
- resumo;
- tipo de conteúdo;
- pelo menos uma área;
- conteúdo Markdown.

### Campos condicionais

- texto alternativo será obrigatório quando existir uma imagem de capa;
- links e referências deverão possuir formato válido;
- o endereço da publicação deverá ser único.

### Campos opcionais

- categoria;
- tags;
- curso;
- disciplina;
- data original do trabalho;
- imagem de capa;
- referências;
- links relacionados;
- destaque.

### Fluxo

1. O autor seleciona “Nova publicação”.
2. O sistema cria o contexto de um novo rascunho.
3. A etapa “Informações” reúne metadados e taxonomia.
4. A etapa “Conteúdo” reúne escrita Markdown e prévia durante a edição.
5. A etapa “Capa” reúne imagem e texto alternativo.
6. A etapa “Referências” reúne bibliografia e links relacionados.
7. A etapa “Revisão” apresenta prévia e validações pendentes.
8. O autor avança ou retorna sem perder os dados já preenchidos.
9. O sistema salva o rascunho e a última etapa válida para retomada.
10. Na etapa “Publicação”, o autor confirma a mudança de estado.
11. O sistema apresenta o endereço público.

### Comportamento do fluxo multi-etapas

- desktop: etapas persistentes em uma coluna lateral e formulário da etapa atual na área principal;
- celular: número, nome e progresso da etapa atual em formato compacto, com lista completa sob demanda;
- `Voltar` preserva os dados preenchidos;
- `Continuar` valida apenas o necessário para avançar;
- campos obrigatórios para publicar podem permanecer incompletos durante o rascunho;
- erros impedem somente o avanço que depende deles e apontam o campo correspondente;
- ao reabrir um rascunho, o autor retorna à última etapa válida;
- a etapa final consolida conteúdo, capa, referências e estado antes da confirmação;
- sair com mudanças ainda não salvas mantém o aviso definido para o editor.

Mensagem de sucesso:

> Publicação realizada com sucesso.

## 13. Editor Markdown

### Desktop

- Markdown e prévia lado a lado;
- ações e estado sempre identificáveis;
- prévia atualizada durante a edição.

### Tablet

- divisão de tela quando houver espaço;
- alternativa rápida entre escrita e prévia.

### Celular

- abas “Escrever” e “Prévia”;
- ação de salvar acessível durante a edição.

### Regras

- HTML arbitrário não será aceito;
- a prévia utilizará as mesmas regras do conteúdo público;
- elementos não suportados serão informados;
- erros deverão indicar o campo correspondente;
- alterações não salvas serão claramente sinalizadas.

### Salvamento no MVP

- O salvamento no servidor será manual.
- A interface mostrará “Alterações não salvas”.
- Ao salvar, mostrará a data e o horário do último salvamento.
- Ao tentar sair com mudanças pendentes, o autor receberá um aviso.
- Quando possível, uma cópia temporária será preservada no navegador para recuperação após interrupções.

O MVP não manterá revisões paralelas de uma publicação já publicada. Alterações em conteúdo público somente serão aplicadas quando o autor selecionar “Atualizar publicação”.

## 14. Prévia

A prévia deverá representar fielmente:

- títulos;
- parágrafos;
- listas;
- citações;
- tabelas;
- links;
- código;
- referências;
- capa;
- metadados.

A prévia não deverá:

- tornar o conteúdo público;
- incrementar visualizações;
- aparecer em mecanismos de busca;
- permitir interações reais de curtida ou comentário.

## 15. Publicação

Antes de publicar, o sistema deverá:

1. validar os campos obrigatórios;
2. validar a capa e o texto alternativo;
3. higienizar o Markdown;
4. verificar o endereço da publicação;
5. apresentar uma confirmação.

Confirmação sugerida:

> Publicar “Título da publicação”? O conteúdo ficará visível no acervo e poderá ser encontrado e compartilhado.

Ações:

- Cancelar;
- Publicar agora.

O botão não deverá permitir envios duplicados.

## 16. Atualização de conteúdo publicado

Ao editar uma publicação já pública:

- o conteúdo atualmente publicado permanece disponível;
- alterações locais não aparecem para visitantes;
- a prévia pode ser consultada;
- a ação será identificada como “Atualizar publicação”;
- a atualização exigirá confirmação;
- somente a versão confirmada substitui o conteúdo público.

Mensagem:

> Publicação atualizada com sucesso.

## 17. Retirada de publicação

Retirar do ar será uma ação reversível.

Confirmação sugerida:

> Retirar esta publicação do ar? Ela deixará de aparecer no acervo e não poderá ser acessada publicamente.

Após a confirmação:

- a publicação recebe o estado “Retirada do ar”;
- deixa de aparecer em buscas e listagens;
- permanece disponível na administração;
- poderá ser publicada novamente.

## 18. Exclusão de publicação

Para reduzir exclusões acidentais:

- uma publicação pública deverá ser retirada do ar antes de ser excluída;
- a exclusão ficará em posição secundária;
- o diálogo exibirá o título;
- o autor deverá digitar o título para confirmar;
- a ação será permanente.

Mensagem:

> Esta ação excluirá permanentemente a publicação e seus relacionamentos. Ela não poderá ser desfeita.

A definição de backup e recuperação será detalhada na arquitetura e na estratégia de segurança.

## 19. Imagem de capa

### Fluxo

1. O autor seleciona uma imagem.
2. O sistema valida formato e tamanho.
3. O upload é iniciado.
4. Uma prévia é apresentada.
5. O autor informa o texto alternativo.
6. A imagem pode ser substituída ou removida.

### Estados

- aguardando envio;
- enviando;
- concluído;
- formato inválido;
- arquivo muito grande;
- falha temporária.

Mensagem de falha:

> Não foi possível enviar a imagem. A publicação ainda pode ser salva sem capa.

A falha na imagem não deverá apagar o conteúdo do editor.

## 20. Administração de categorias e tags

O autor poderá:

- criar;
- renomear;
- pesquisar;
- consultar uso;
- excluir quando não estiverem associadas a publicações.

Nomes duplicados deverão ser recusados.

Quando uma categoria ou tag estiver em uso, o sistema deverá exigir:

- substituição por outra; ou
- remoção das associações antes da exclusão.

## 21. Moderação de comentários

### Ocultar

- não exigirá confirmação pesada;
- removerá imediatamente o comentário da área pública;
- manterá o conteúdo na administração;
- oferecerá uma ação temporária de desfazer.

Mensagem:

> Comentário ocultado.

### Restaurar

- tornará o comentário público novamente;
- manterá sua autoria e data originais.

Mensagem:

> Comentário restaurado.

### Excluir permanentemente

A exclusão apresentará:

- nome ou “Anônimo”;
- publicação relacionada;
- trecho do comentário;
- aviso de irreversibilidade.

Mensagem:

> Excluir permanentemente este comentário? Esta ação não poderá ser desfeita.

O comentário oculto deixará de aparecer completamente para os visitantes. Não será exibido um espaço indicando que houve moderação.

## 22. Interrupções e recuperação

### Queda de conexão durante a leitura

O conteúdo já carregado permanece legível.

Curtidas e comentários deverão informar a falha, sem bloquear o artigo.

### Queda durante a edição

- alterações não salvas permanecem no formulário;
- uma cópia temporária poderá ser mantida no navegador;
- ao retornar, o sistema oferecerá recuperação;
- uma versão local nunca substituirá silenciosamente uma versão mais recente do servidor.

### Saída acidental

Quando houver alterações pendentes:

> Existem alterações não salvas. Deseja sair mesmo assim?

## 23. Feedback das ações

Toda ação relevante deverá possuir retorno perceptível:

- salvar;
- publicar;
- atualizar;
- retirar do ar;
- excluir;
- enviar imagem;
- curtir;
- comentar;
- ocultar;
- restaurar.

Mensagens não dependerão somente da cor e deverão ser anunciadas por tecnologias assistivas.

## 24. Acessibilidade comportamental

Os fluxos deverão:

- funcionar por teclado;
- manter foco visível;
- devolver o foco ao elemento adequado após diálogos;
- levar o foco ao primeiro erro de validação;
- associar mensagens aos campos;
- anunciar carregamentos e confirmações importantes;
- evitar perda inesperada de foco;
- possuir alvos de toque confortáveis;
- respeitar redução de movimento;
- funcionar com zoom de 200%;
- não utilizar somente cor para diferenciar estados.

## 25. Linguagem

A comunicação será:

- direta;
- humana;
- serena;
- específica;
- sem termos técnicos desnecessários.

Evitar mensagens como:

- “Erro 500”;
- “Operação inválida”;
- “Falha desconhecida”;
- “Algo deu errado” sem orientação.

Preferir informar:

- o que aconteceu;
- o que foi preservado;
- o que a pessoa pode fazer agora.

## 26. Critérios de aceite

A experiência será considerada aprovada quando:

- o visitante encontrar uma publicação sem treinamento;
- a pesquisa preservar termos e filtros;
- a leitura funcionar em celular e desktop;
- a curtida for registrada apenas após confirmação do servidor;
- a curtida não puder ser desfeita;
- o comentário puder ser anônimo;
- o comentário aparecer imediatamente após sucesso;
- falhas recuperáveis preservarem o texto digitado;
- o autor conseguir escrever e visualizar Markdown;
- novas publicações começarem como rascunho;
- a publicação exigir ação e confirmação explícitas;
- alterações não salvas estiverem sempre identificadas;
- conteúdos públicos não forem alterados antes da confirmação;
- o autor conseguir ocultar, restaurar e excluir comentários;
- ações destrutivas possuírem proteção proporcional;
- todos os fluxos apresentarem carregamento, vazio, sucesso e erro;
- a administração permanecer compreensível em telas menores;
- problemas nas interações não impedirem a leitura.

## 27. Decisões aprovadas

- Comentários terão até 1.500 caracteres.
- O nome do comentarista terá até 80 caracteres.
- Comentários aceitarão somente texto simples no MVP.
- Links em comentários não serão transformados automaticamente em links clicáveis.
- Pesquisas e filtros serão preservados na URL.
- O salvamento administrativo no servidor será manual.
- O navegador poderá manter uma recuperação temporária de conteúdo não salvo.
- O MVP não terá revisões paralelas de uma publicação já pública.
- Publicações públicas precisarão ser retiradas do ar antes da exclusão.
- A exclusão permanente de publicação exigirá a digitação do título.
- O compartilhamento utilizará o recurso nativo do dispositivo ou copiará o link.
