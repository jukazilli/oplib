# EVID-PUB-007-01 — Lista editorial administrativa e composição modal

- **Estado:** concluído e aprovado pelo proprietário em 21/09/2026
- **Rota:** `/admin/publicacoes`

## Entrega comprovada

- lista privada ordenada pela atualização e restrita ao ambiente administrativo;
- box integralmente clicável com a copy `Publique algo em seu acervo`;
- composer aberto em diálogo modal central no desktop e painel de largura total no celular;
- foco inicial no título, contenção de foco, `Esc` e cancelamento com proteção de alterações;
- menu `Mais ações` por publicação, expondo `Editar` somente quando o comando funciona;
- ícone de folha `Rascunhos` com nome acessível e tooltip;
- biblioteca de rascunhos no mesmo modal, com título, trecho e última atualização;
- retomada de composição preservando recuperação local e tratamento de conflito de `PUB-001`;
- composer reorganizado como fluxo único inspirado no Threads, sem agrupamentos densos de formulário;
- taxonomia contextual e vínculo da capa persistidos junto ao rascunho;
- taxonomia apresentada em popover sobreposto, com fechamento externo sem perda da seleção;
- campos editoriais sem moldura de foco e confirmação de descarte renderizada pelo Design System do OPALIB;
- acesso `Meu perfil` restaurado no shell e ligado à gestão da conta administrativa do Clerk;
- upload de capa com prévia e descrição acessível no próprio composer;
- ausência de `Para você`, comunidade, seguir, reação ou mistura de autores na administração.

## Validações automatizadas

- `pnpm lint` — aprovado;
- `pnpm test` — 18 arquivos e 70 testes aprovados;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado.

## Aceite visual

- [x] box e lista possuem hierarquia correta no desktop;
- [x] composer modal corresponde à direção aprovada sem copiar semântica social;
- [x] biblioteca de rascunhos permite continuar uma composição;
- [x] celular não apresenta corte nem rolagem horizontal;
- [x] menu de três pontos permanece acessível e não compete com o conteúdo.

O proprietário aprovou o Preview após os refinamentos de composição fluida, taxonomia em popover, capa contextual, confirmação própria do OPALIB e restauração de `Meu perfil`.
