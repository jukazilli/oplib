# Registro cumulativo de testes do MVP

Este documento preserva tudo o que deverá ser validado na rodada final do MVP. Cada slice acrescenta seus testes sem apagar os anteriores. Evidências automatizadas podem ser executadas durante a implementação; itens marcados como `final` serão repetidos pelo proprietário no aceite consolidado.

## Protocolo

- Registrar por ID do backlog: objetivo, pré-condições, passos, resultado esperado e ambiente.
- Separar `automatizado`, `Preview` e `final/humano`.
- Não remover um teste porque passou numa entrega intermediária.
- Todo defeito encontrado no aceite final volta ao item de origem, sem ampliar o escopo silenciosamente.

## PUB-004 — Publicar e atualizar

- [ ] `Preview/final`: publicar um rascunho completo após confirmação.
- [ ] `Preview/final`: repetir o envio idêntico e confirmar sucesso idempotente.
- [ ] `Preview/final`: alterar a mesma publicação em duas sessões e confirmar conflito somente para conteúdos diferentes.
- [ ] `Preview/final`: atualizar conteúdo público e confirmar que a versão anterior permanece até o commit.
- [ ] `Preview`: comprovar auditoria, rollback transacional e invalidação de cache.
- [ ] `Final`: repetir o fluxo em desktop e celular, incluindo duplo clique e falha recuperável.

## PUB-005 — Retirar e republicar

- [ ] `Preview/final`: cancelar e depois confirmar `Retirar do ar`.
- [ ] `Preview/final`: confirmar estado `Retirada do ar` e disponibilidade da ação `Republicar`.
- [ ] `Preview/final`: republicar e confirmar retorno ao estado `Publicada`.
- [ ] `Preview`: comprovar datas, auditoria, conflito e rollback no banco.
- [ ] `Final`: confirmar ausência em página, listagens, pesquisa e sitemap enquanto retirada.

## WEB-001 — Shell público responsivo

- [ ] `Final`: percorrer cabeçalho e rodapé somente com teclado, com foco visível.
- [ ] `Final`: conferir localização atual e ausência de entrada administrativa na navegação pública.
- [ ] `Final`: verificar compacto, médio, amplo e zoom de 200%, sem corte ou sobreposição.
- [ ] `Automatizado`: executar axe sem violações críticas.

## WEB-004 — Página pública de leitura

- [ ] `Automatizado/Preview`: abrir uma publicação por slug e conferir título, resumo, autoria, datas, taxonomia, Markdown e referências.
- [ ] `Automatizado/Preview`: confirmar que rascunho, retirada e slug inexistente apresentam a mesma indisponibilidade pública.
- [ ] `Final`: ler uma publicação longa em celular, tablet e desktop, sem barra lateral ou elementos competindo com o texto.
- [ ] `Final`: conferir capa presente e ausente, sem espaço vazio indevido.
- [ ] `Final`: testar links externos, tabela larga e bloco de código em tela pequena.
- [ ] `Automatizado`: executar axe e confirmar hierarquia de títulos e regiões.

## WEB-003 — Acervo, pesquisa, filtros e paginação

- [ ] `Automatizado/Preview`: pesquisa vazia lista somente publicações públicas em ordem estável.
- [ ] `Automatizado/Preview`: combinar termo, área, tipo, categoria, tag e ano; conferir total e resultados.
- [ ] `Final`: compartilhar a URL filtrada, atualizar e usar voltar/avançar sem perder estado.
- [ ] `Final`: alternar Feed/Grade e navegar entre páginas sem perder filtros.
- [ ] `Final`: conferir estados sem publicações e sem resultados, incluindo `Limpar filtros`.
- [ ] `Preview`: retirar uma publicação e confirmar ausência imediata do acervo e da pesquisa.
- [ ] `Preview`: medir consulta representativa e registrar plano se houver degradação.
- [ ] `Automatizado`: executar axe e responsividade dos filtros em celular, tablet e desktop.

## PUB-006 — Destaque editorial

- [ ] `Automatizado/Preview`: destacar uma publicação pública e confirmar feedback, auditoria e invalidação da home.
- [ ] `Automatizado/Preview`: remover o destaque e confirmar ausência nas seleções públicas.
- [ ] `Preview`: criar vários destaques e confirmar principal por `publishedAt DESC, id DESC`.
- [ ] `Preview`: confirmar que rascunho e retirada não podem ser alterados nem aparecem como destaque público.
- [ ] `Final`: conferir ações `Destacar` e `Remover destaque` apenas nos estados elegíveis.

## WEB-002 — Página inicial editorial

- [ ] `Automatizado/Preview`: confirmar que principal, demais destaques e recentes contêm somente publicações públicas e ordem determinística.
- [ ] `Preview`: provocar falha isolada em destaques, recentes e áreas; confirmar que as demais seções permanecem utilizáveis.
- [ ] `Final`: conferir promessa, ação `Explorar publicações`, busca e hierarquia da primeira dobra em celular, tablet e desktop.
- [ ] `Final`: conferir capa presente/ausente, títulos acessíveis antes das imagens e ausência de layout de dashboard.
- [ ] `Final`: abrir publicação principal, recente e caminho por área.
- [ ] `Automatizado`: executar axe, estados vazio/loading e zoom de 200%.
- **Evidência:** `docs/evidence/EVID-WEB-002-01.md`; screenshots e axe pendentes no Preview.

## SEO-001 — Metadados, canonical e prévia social

- [ ] `Automatizado`: confirmar título, descrição, canonical, Open Graph e Twitter de publicação pública.
- [ ] `Automatizado`: confirmar ausência de canonical e `noindex` para slug inexistente, rascunho ou retirado.
- [ ] `Automatizado`: confirmar `noindex` em Development/Preview e indexação somente em Production com URL explícita.
- [ ] `Preview`: inspecionar HTML com bot limitado e confirmar metadados no `head`.
- [ ] `Preview`: validar card com capa e fallback institucional, incluindo texto alternativo e dimensões.
- [ ] `Final`: confirmar a origem canônica definitiva antes da publicação em Production.

## WEB-005 — Compartilhar publicação

- [ ] `Automatizado/Preview`: confirmar payload de título, resumo e URL na Web Share API.
- [ ] `Automatizado/Preview`: sem Web Share API, confirmar cópia da URL canônica e mensagem `Link copiado`.
- [ ] `Automatizado`: confirmar que cancelamento nativo não apresenta erro.
- [ ] `Automatizado/Preview`: bloquear clipboard e confirmar orientação para cópia pela barra do navegador.
- [ ] `Final`: testar compartilhamento em celular compatível e desktop sem suporte nativo.
- [ ] `Final`: confirmar que o link recebido abre a mesma publicação pública e não uma URL de Preview.

## SEO-002 — Sitemap, robots e dados estruturados

- [ ] `Automatizado/Preview`: confirmar que sitemap contém home, acervo e somente publicações `published`, com `lastModified` correto.
- [ ] `Automatizado/Preview`: retirar e republicar conteúdo, confirmando remoção e retorno no sitemap após invalidação.
- [ ] `Automatizado`: confirmar sitemap vazio e `Disallow: /` em Development/Preview ou sem origem canônica.
- [ ] `Automatizado/Production`: confirmar permissão pública e bloqueio de `/admin/`, `/api/` e `/sign-in/` no robots.
- [ ] `Automatizado/Preview`: validar Article JSON-LD, datas, canonical, autor, capa opcional e escape contra fechamento de script.
- [ ] `Final`: submeter sitemap a um validador e verificar uma publicação com teste de resultados avançados.

## LIKE-001 — Curtida anônima irreversível

- [ ] `Automatizado/Preview`: primeira curtida cria cookie protegido, persiste somente hash e incrementa após confirmação.
- [ ] `Automatizado/Preview`: repetição e duas requisições concorrentes mantêm uma linha e uma única contagem adicional.
- [ ] `Automatizado/Preview`: recarregar com o mesmo cookie mantém `Curtido` desabilitado e contador sincronizado.
- [ ] `Automatizado`: rascunho, retirada e origem cruzada são recusados sem revelar estado interno.
- [ ] `Automatizado/Preview`: falha do banco mantém contador e leitura, permitindo nova tentativa segura.
- [ ] `Final`: confirmar teclado, leitor de tela, celular e feedback `Curtida registrada. Obrigado!`.
- [ ] `Final`: confirmar ausência de ação, rota ou método para desfazer a curtida.

## COM-001 — Comentários imediatos sem cadastro

- [ ] `Automatizado/Preview`: publicar com nome e sem nome; confirmar `Anônimo`, persistência após recarga, data e ordenação mais recente primeiro.
- [ ] `Automatizado/Preview`: campo vazio, somente espaços, nome acima de 80 e comentário acima de 1.500 caracteres são recusados sem apagar conteúdo.
- [ ] `Automatizado/Preview`: HTML, Markdown e URL aparecem literalmente, sem execução, formatação ou link; comentário oculto nunca entra na lista pública.
- [ ] `Automatizado/Preview`: honeypot, envio rápido, origem cruzada e corpo excessivo são recusados; rascunho e retirada não aceitam comentário.
- [ ] `Automatizado/Preview`: quatro tentativas no mesmo navegador em cinco minutos retornam limite; validar WAF com tráfego sintético e registrar a limitação entre instâncias/cookies.
- [ ] `Final`: conferir aviso de privacidade antes do envio, estado `Publicando…`, sucesso somente depois do servidor, novo item destacado e formulário limpo só no sucesso.
- [ ] `Final`: simular rede indisponível, confirmar texto/nome preservados e repetir sem redigitar; testar celular, teclado, zoom 200%, foco e leitor de tela.
- [ ] `Final`: conferir lista vazia, acentos, quebras de linha e ausência de e-mail/login/controles sociais.

## MOD-001 — Consulta administrativa de comentários

- [ ] `Automatizado/Preview`: visitante anônimo e conta fora da allowlist não consultam a lista; administrador autorizado acessa.
- [ ] `Automatizado/Preview`: filtrar todos, visíveis e ocultos, conferir autor, data, estado, texto e vínculo correto à publicação.
- [ ] `Automatizado/Preview`: navegar mais de 50 itens, inclusive datas iguais, sem repetição ou perda; URL de filtro e cursor resiste a atualização.
- [ ] `Automatizado/Preview`: HTML, Markdown e URL maliciosos aparecem como texto inerte também na administração.
- [ ] `Final`: conferir vazio por filtro, falha de leitura e recuperação, navegação por teclado, foco, leitor de tela, celular e zoom 200%.

## MOD-002 — Ocultar e restaurar comentários

- [ ] `Automatizado/Preview`: administrador oculta sem diálogo pesado; estado e auditoria persistem na mesma transação, sem conteúdo integral no evento.
- [ ] `Automatizado/Preview`: comentário oculto some totalmente da página pública após recarga e continua no filtro administrativo `Ocultos`.
- [ ] `Automatizado/Preview`: restaurar devolve o mesmo comentário ao público, preservando nome, corpo e data original.
- [ ] `Automatizado/Preview`: duas sessões tentam ocultar/restaurar simultaneamente; somente a transição válida vence e a outra recebe conflito recuperável.
- [ ] `Automatizado/Preview`: visitante ou conta fora da allowlist não executa a ação, mesmo chamando-a diretamente.
- [ ] `Final`: após ocultar, `Desfazer` aparece por oito segundos; falha preserva o estado e permite nova tentativa.
- [ ] `Final`: testar filtro atual, teclado, foco, anúncio de sucesso/erro, celular, zoom e ausência de controles de exclusão antes de MOD-003.
