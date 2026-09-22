# Registro cumulativo de testes do MVP

Este documento preserva tudo o que deverá ser validado na rodada final do MVP. Cada slice acrescenta seus testes sem apagar os anteriores. Evidências automatizadas podem ser executadas durante a implementação; itens marcados como `final` serão repetidos pelo proprietário no aceite consolidado.

## Protocolo

- Registrar por ID do backlog: objetivo, pré-condições, passos, resultado esperado e ambiente.
- Separar `automatizado`, `Preview` e `final/humano`.
- Não remover um teste porque passou numa entrega intermediária.
- Todo defeito encontrado no aceite final volta ao item de origem, sem ampliar o escopo silenciosamente.

A cobertura transversal e a prova local de cada estado estão mapeadas em `docs/testing/UX-001_STATE_MATRIX.md`; este ledger contém o que deve ser repetido no ambiente indicado ou no gate final.

## FND-015 — Backup criptografado e restauração

- [ ] `Ambiente`: gerar uma identidade `age`, guardar a chave privada offline e cadastrar no ambiente GitHub `Backup` apenas `BACKUP_ENCRYPTION_PUBLIC_KEY`, `DATABASE_URL_UNPOOLED` do ambiente autorizado e `BACKUP_BLOB_READ_WRITE_TOKEN` do store privado.
- [ ] `CI`: sem cada secret, confirmar falha imediata no preflight mostrando somente o nome ausente; com os três presentes, nenhuma chave ou connection string pode aparecer no log.
- [ ] `Preview`: executar backup manual, registrar run, ID, tamanho e SHA-256 saneado; baixar novamente, conferir hash e validar `pg_restore --list` após descriptografia offline.
- [ ] `Preview`: criar branch Neon temporária `restore-test-AAAAMMDD`, restaurar com endpoint diferente da origem, executar sanidade, registrar duração e quantidade de tabelas e remover a branch.
- [ ] `Final`: confirmar ao menos um backup diário válido, retenção 7/4, posse testada da identidade offline, RPO de 24 horas e RTO inferior a 4 horas antes de Production ou exclusão permanente.

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

- [ ] `Preview/final`: abrir `/areas` pelo cabeçalho e rodapé; conferir título, ausência de `404`, somente áreas com publicações no ar e contagens corretas.
- [ ] `Preview/final`: selecionar cada área e conferir `/publicacoes?area=<slug>` com filtro ativo, URL preservada após recarga e resultados da área correta; testar Voltar/Avançar.
- [ ] `Preview/final`: com nenhuma publicação no ar, conferir estado vazio sem links fictícios; com falha temporária da consulta, conferir mensagem legível sem erro técnico exposto.
- [ ] `Final`: repetir `/areas` com teclado, foco visível, leitor de tela, celular e zoom 200%; conferir singular/plural nas contagens e ausência de cortes.
- [ ] `Final`: percorrer cabeçalho e rodapé somente com teclado, com foco visível.
- [ ] `Final`: conferir localização atual e ausência de entrada administrativa na navegação pública.
- [ ] `Final`: verificar compacto, médio, amplo e zoom de 200%, sem corte ou sobreposição.
- [ ] `Automatizado`: executar axe sem violações críticas.
- [ ] `Preview/final`: seguir cada link publicado no cabeçalho e rodapé; `/areas`, `/sobre` e `/privacidade` não podem terminar em `404` no gate final. `/sobre` e `/privacidade` aguardam conteúdo aprovado em DEC-002/WEB-006.
- [ ] `Preview`: confirmar que o prefetch da navegação não gera `404` ou ruído de console para destinos já oferecidos ao visitante.

## AUTH-001 — Entrada administrativa

- [ ] `Preview/final`: abrir `/sign-in` desautenticado; rótulos, ações, ajuda e erros do Clerk devem estar em português do Brasil, preservando a mensagem genérica para identidade/senha incorretas.
- [ ] `Preview/final`: comparar desktop e celular após a localização; conferir botão, campo, foco, contraste, recuperação de sessão e ausência de cadastro público.
- [ ] `Final`: confirmar com leitor de tela o nome acessível do provedor Google; a renderização de Preview ainda acrescenta `Sign in with Google` antes do texto traduzido. Verificar se o SDK/configuração permite correção suportada sem substituir o componente de autenticação.

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

## UX-001 / QUAL-002 — Degradação da leitura

- [ ] `Automatizado/Preview`: provocar falha somente na leitura de curtidas; artigo, referências, compartilhamento e comentários permanecem disponíveis, sem contador falso.
- [ ] `Automatizado/Preview`: provocar falha somente na leitura de comentários; artigo e curtida permanecem, sem formulário que aparenta publicar.
- [ ] `Automatizado/Preview`: provocar ambas as falhas; artigo continua legível, mensagens permitem recarga e logs não contêm erros brutos ou conteúdo.
- [ ] `Final`: repetir em celular e desktop, conferir anúncio das mensagens, foco e recuperação após restabelecer o serviço.
- [ ] `Final`: completar a matriz UX-001 de carregamento, vazio, sucesso, erro e retry para cada fluxo, incluindo editor com mudanças não salvas.

## QUAL-002 — Desempenho do Preview

- [ ] `CI/Preview`: executar o workflow `E2E Preview` e confirmar três medições móveis para Início, Publicações e Áreas, com resumo de mediana por rota.
- [ ] `CI`: baixar o artefato e confirmar que os JSON não contêm `extraHeaders`, segredo de bypass, credenciais, conteúdo privado ou relatório HTML.
- [ ] `Preview`: registrar FCP, LCP, TBT, CLS, Speed Index, nota de performance e bytes transferidos com conteúdo editorial representativo; investigar todo aviso antes de promover limiares a gate.
- [ ] `Preview`: comparar capa presente/ausente, Feed/Grade, filtros longos e publicação longa; conferir imagem responsiva, fontes, JavaScript não usado e terceiros.
- [ ] `Preview`: confirmar que Início, Publicações e Áreas não carregam o runtime cliente do Clerk; comparar JavaScript transferido/não usado antes e depois do provedor ficar restrito a `/sign-in` e `/admin`.
- [ ] `Preview`: atrasar banco/taxonomia em Áreas e Publicações; título e introdução devem aparecer antes dos resultados, com um único anúncio de carregamento, sem conteúdo falso, salto de foco ou duplicação do shell.
- [ ] `CI/Preview`: comparar LCP e `elementRenderDelay` antes/depois do shell síncrono; confirmar que o elemento LCP continua sendo texto estático e que nenhuma imagem ou fonte virou nova regressão.
- [ ] `CI/Preview`: durante o streaming de Publicações, confirmar CLS ≤ 0,1 e ausência de deslocamento do rodapé quando filtros, resultados ou estado vazio substituírem o fallback; repetir em viewport móvel e amplo.
- [ ] `Preview/final`: após restringir o provedor, repetir entrada, sessão expirada, perfil e logout; localização, tema, redirecionamento e proteção administrativa devem permanecer iguais.
- [ ] `Preview`: medir a consulta crítica do acervo com combinações representativas e registrar plano quando houver regressão evidente.
- [ ] `Final`: repetir em rede/dispositivo representativos e confrontar a medição sintética com dados de campo disponíveis; nenhuma nota isolada aprova o desempenho do MVP.

## UX-001 — Recuperação e saída do editor

- [ ] `Automatizado`: confirmar que cópia local da mesma versão é recuperada sem perder título e conteúdo; uma cópia de versão anterior exige escolha explícita e mantém a versão mais nova do servidor até a escolha.
- [ ] `Automatizado`: escolher `Manter versão salva` e conferir remoção da cópia local; escolher `Recuperar minha cópia` e conferir campos recuperados sem publicação automática.
- [ ] `Preview`: editar título e conteúdo, tentar fechar, navegar por link e atualizar a página; cancelar a saída deve preservar todos os campos, e confirmar descarte deve remover a cópia temporária.
- [ ] `Preview`: interromper rede durante edição/salvamento, voltar e confirmar recuperação do texto; após salvamento confirmado, recarregar sem reapresentar alterações antigas.
- [ ] `Final`: repetir saída e recuperação por teclado, leitor de tela, celular e zoom 200%; conferir foco no diálogo e retorno ao campo de edição após cancelar.
- [ ] `Automatizado/Preview`: ao abrir a confirmação de descarte, `Continuar editando` recebe foco; `Tab` não escapa do diálogo; `Escape` ou a ação segura fecha a confirmação e devolve foco ao controle que a abriu.
- [ ] `Automatizado/Preview`: com composição alterada, confirmar cópia local atualizada e proteção de recarga; após descarte explícito, confirmar remoção da cópia e ausência de recuperação indevida.

## UX-001 — Recuperação do comentário público

- [ ] `Automatizado/Preview`: enviar comentário vazio e provocar falha de rede; o foco retorna ao campo `Comentário`, o erro é anunciado e o campo expõe estado inválido.
- [ ] `Automatizado/Preview`: após falha, nome e comentário permanecem intactos; nova tentativa confirmada publica uma única vez, limpa os campos e anuncia sucesso.
- [ ] `Final`: repetir com teclado e leitor de tela em celular e desktop; confirmar que detalhes técnicos nunca aparecem e que a mensagem controlada de rate limit continua acionável.

## UX-001 — Erro administrativo recuperável

- [ ] `Automatizado/Preview`: provocar falha de leitura em Publicações e Taxonomia; o shell permanece, a URL e seus parâmetros não mudam, o título seguro recebe foco e nenhum detalhe técnico ou `digest` aparece.
- [ ] `Automatizado/Preview`: restaurar a dependência e acionar `Tentar novamente`; o mesmo segmento volta a renderizar sem recarregar para outra rota.
- [ ] `Final`: repetir por teclado e leitor de tela em desktop e celular, confirmando anúncio único, foco visível e ausência de perda do contexto administrativo.

## UX-001 — Carregamento administrativo

- [ ] `Automatizado/Preview`: atrasar a leitura de Visão geral, Publicações, Taxonomia e Comentários; o shell permanece interativo, `Carregando área administrativa` é anunciado uma vez e os placeholders não entram na árvore acessível.
- [ ] `Final`: navegar entre as quatro áreas em rede lenta, com teclado e leitor de tela, confirmando que não há salto de foco, anúncio duplicado ou conteúdo falso durante a espera.

## UX-001 — Erro público recuperável

- [ ] `Automatizado/Preview`: provocar falha total em Áreas e na leitura individual; o shell e a URL permanecem, o título seguro recebe foco, nenhum detalhe técnico aparece e `Tentar novamente` refaz o segmento atual.
- [ ] `Automatizado/Preview`: provocar isoladamente falhas de destaque, recentes e áreas na Home; somente a seção afetada degrada, as demais continuam disponíveis e a falha não vira sucesso ou conteúdo vazio falso.
- [ ] `Final`: repetir recuperação pública por teclado e leitor de tela em celular e desktop, confirmando anúncio único, foco visível e retorno do conteúdo após restabelecer a dependência.

## UX-001 — Carregamento público

- [ ] `Automatizado/Preview`: atrasar Áreas e uma leitura individual; cabeçalho e rodapé permanecem disponíveis, `Carregando conteúdo` é anunciado uma vez e os placeholders não entram na árvore acessível.
- [ ] `Automatizado/Preview`: confirmar que Home continua carregando seções de forma independente e que o acervo mantém seu skeleton específico, sem dois anúncios simultâneos.
- [ ] `Final`: navegar em rede lenta com teclado e leitor de tela no celular e desktop, confirmando ausência de salto de foco, anúncio repetido ou conteúdo enganoso.

## SEC-001 — Proveniência das mutações públicas

- [ ] `Automatizado`: enviar POST de curtida e comentário com `Origin` divergente e confirmar `403` sem persistência ou cookie novo.
- [ ] `Automatizado`: repetir sem `Origin` mas com `Sec-Fetch-Site: cross-site` e `same-site`; ambos devem ser recusados antes de persistir.
- [ ] `Automatizado`: sem `Origin` e sem Fetch Metadata, confirmar que `Referer` divergente ou inválido é recusado; `Referer` da própria origem é aceito.
- [ ] `Preview`: em navegador legítimo, curtir e comentar normalmente; inspecionar headers e confirmar que o endurecimento não bloqueou o fluxo real.
- [ ] `Final`: repetir tentativa cross-site controlada e conferir resposta genérica, ausência de efeito e logs sem dados privados; concluir a matriz SEC-001 de autorização, XSS, upload, payload, rate limit, dependências e WAF.
- [ ] `CI`: confirmar que `pnpm audit --prod --audit-level high` executa com instalação congelada e impede merge quando houver alerta alto ou crítico; falha de acesso ao registro não deve ser tratada como sucesso.
- [ ] `Final`: repetir auditoria de todas as dependências de produção, revisar os alertas moderados transitivos de `@clerk/ui` e registrar resolução ou aceite formal fundamentado; confirmar ausência de alertas altos/críticos antes da promoção.
- [ ] `Automatizado/Preview`: enviar comentário com `text/plain`, formulário e tipo ausente; confirmar `415`, `no-store` e nenhuma persistência ou consumo de rate limit.
- [ ] `Automatizado/Preview`: enviar JSON truncado, array, valores com tipos incorretos e corpo acima de 10 KB por header e por bytes reais; confirmar erro `400` genérico, sem eco, cookie novo, persistência ou log de indisponibilidade.
- [ ] `Final`: confirmar que o formulário legítimo continua enviando JSON compatível e que erros de payload não apagam nome ou comentário digitado.
- [ ] `Automatizado/Preview`: chamar preparação, upload e remoção de capa sem sessão e com conta fora da allowlist; confirmar `401`/`404` genéricos, `no-store` e nenhum token, objeto ou exclusão.
- [ ] `Automatizado/Preview`: tentar SVG/GIF, MIME divergente dos bytes, arquivo vazio, acima de 5 MB, pathname com travessia e fora do prefixo; confirmar recusa e remoção de qualquer blob divergente já enviado.
- [ ] `Automatizado/Preview`: inspecionar token de upload e confirmar tipos aprovados, limite de 5 MB, overwrite desativado, UUID/chave do ambiente e cache anual.
- [ ] `Final`: enviar cada formato aprovado, conferir visualização e alt; simular falha e confirmar que o editor e sua composição permanecem intactos, sem objeto órfão ou acesso ao prefixo de Production.
- [ ] `Automatizado/Preview`: publicar corpus Markdown com tags HTML, atributos de evento, SVG/MathML, código cercado e links `javascript:`, `data:`, `vbscript:`, `file:` e variações codificadas; confirmar ausência de execução e navegação perigosa na prévia e página pública.
- [ ] `Automatizado/Preview`: inserir imagem Markdown inline e por referência apontando para servidor monitorado; confirmar que nenhuma requisição é feita, apenas o alt aparece e o editor orienta usar a capa.
- [ ] `Automatizado/Preview`: publicar comentário com HTML/script no nome e corpo, Markdown e URL; conferir texto literal sem elemento ativo no público e na administração.
- [ ] `Final`: abrir links HTTP(S) internos/externos legítimos, confirmar destino e proteção de aba externa; repetir conteúdo malicioso com CSP ativa e inspecionar console/rede.
- [ ] `Automatizado/Preview`: pesquisar e filtrar com aspas, `%`, `_`, tautologia, comentário, `UNION`, múltiplas instruções e Unicode; confirmar consulta válida, nenhum erro bruto, nenhuma ampliação indevida de resultados e nenhuma alteração no banco.
- [ ] `Automatizado`: compilar filtros públicos e confirmar que todos os valores não confiáveis permanecem em `params`, nunca no texto SQL; varrer por `sql.raw` e concatenação antes do gate final.
- [ ] `Final`: repetir o corpus nos campos administrativos de taxonomia, título, slug e comentários; conferir validação segura, dados preservados e logs sem query ou connection string.
- [ ] `Automatizado/Preview`: enviar três comentários válidos pelo mesmo visitante em menos de cinco minutos; o quarto deve retornar `429`, sem persistência, e outro visitante deve continuar autorizado.
- [ ] `Preview`: após o `429`, confirmar mensagem clara e preservação do nome/texto; repetir depois de cinco minutos e confirmar novo envio sem trocar o cookie.
- [ ] `Automatizado`: preencher 10.000 janelas locais distintas, confirmar recusa fechada da chave seguinte sem crescimento do estado e aceitação após o vencimento liberar espaço.
- [ ] `Preview/WAF`: aplicar tráfego sintético controlado a comentários e curtidas, confirmar limites distintos na borda e documentar que múltiplas instâncias e rotação de cookie não dependem apenas da memória local.
- [ ] `Automatizado`: forçar negação de identidade nas oito Server Actions administrativas e confirmar que nenhum parser, repositório, cache ou auditoria de sucesso é alcançado; repetir `401`/`404` nas rotas de capa.
- [ ] `CI`: introduzir em branch descartável uma atribuição secreta fictícia e confirmar que `pnpm security:secrets` bloqueia o job sem imprimir o valor; remover a fixture e confirmar o job verde.
- [ ] `Automatizado`: inspecionar o contrato público de ambiente e os artefatos estáticos do build; somente `NEXT_PUBLIC_*` aprovado pode aparecer, sem URLs de banco, pepper, tokens Blob, chave Clerk secreta ou chave de backup.
- [ ] `Final`: revisar GitHub Secret Scanning/CodeQL e histórico do repositório; se houver detecção real, revogar primeiro, rotacionar por ambiente e registrar o incidente sem copiar a credencial para evidências.
- [ ] `Automatizado/CI`: executar `pnpm audit --prod --json` e confirmar zero alertas; `pnpm why @clerk/ui`, `jayson`, `uuid@8.3.2` e `stream-json@1.9.1` não devem reconstruir a antiga cadeia Solana.
- [ ] `Preview`: comparar entrada administrativa, perfil e sessão expirada antes/depois da remoção de `@clerk/ui`; conferir cores, tipografia, borda, foco, campos, botão, erro e responsividade sem regressão visual.
- [ ] `Final`: após qualquer atualização de Clerk, revisar `authenticationTheme` contra o contrato suportado, repetir login/logout/MFA e somente então atualizar tokens ou classes.

## QUAL-001 — Acessibilidade e responsividade

- [ ] `Preview/final`: em Início, Publicações e Áreas, confirmar ausência de overflow em 768 × 1024 e 1440 × 900; no teclado, `Tab` inicial revela `Ir para o conteúdo` e `Enter` leva foco ao conteúdo principal.
- [ ] `Preview/final`: com `prefers-reduced-motion: reduce`, animações e transições tornam-se praticamente instantâneas, sem repetição; conferir também visualmente que nenhum estado importante depende do movimento.
- [ ] `Preview/final`: no cabeçalho compacto, o link iconográfico de pesquisa deve ser anunciado como `Pesquisar`; confirmar que nenhum controle perde nome acessível ao ocultar texto por breakpoint.
- [ ] `Preview/final`: em 320 px, confirmar `scrollWidth === innerWidth` em Início, Áreas e Publicações; no acervo, repetir com filtros de nomes longos, resultados em Feed/Grade e paginação.
- [ ] `Preview`: executar axe em home, acervo, leitura e fluxos administrativos autenticados, sem violação crítica.
- [ ] `Final`: percorrer as jornadas críticas por teclado e leitor de tela; conferir foco, nomes acessíveis e anúncios de estados.
- [ ] `Final`: verificar celular, tablet, desktop, zoom 200% e preferência por movimento reduzido.
- [ ] `Ambiente`: disponibilizar chave pública Clerk no ambiente local ou acesso autorizado ao Preview para a auditoria de navegador; tentativa local retornou 500 por chave ausente e o Preview protegido redirecionou ao login Vercel.
