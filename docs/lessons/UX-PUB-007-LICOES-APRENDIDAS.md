# PUB-007 — Lições aprendidas de UI/UX

## Escopo

Memória de produto para a composição administrativa de publicações. Estas regras devem ser consultadas antes de novos refinamentos do composer.

## Regras consolidadas

1. **Composição não é formulário administrativo.** Título, conteúdo e ferramentas devem formar um fluxo editorial contínuo, com baixa densidade e sem caixas ao redor de cada entrada.
2. **A referência do Threads governa ritmo e interação.** Ela não autoriza semântica social nem mistura o acervo privado com o feed público.
3. **Escolhas curtas são sobrepostas.** Taxonomia abre em popover ancorado; não desloca o texto para baixo. Categoria e tags permanecem selecionadas ao clicar fora.
4. **Ferramentas visíveis precisam funcionar.** O ícone de imagem envia e vincula uma capa real; ícones sem ação não entram no composer.
5. **Entradas editoriais não recebem moldura de foco.** Título e conteúdo usam caret e mudança discreta de superfície; botões e demais controles continuam com foco visível.
6. **Confirmações pertencem ao produto.** Cancelar, fechar ou navegar com alterações não salvas usa diálogo do OPALIB. O aviso nativo do navegador fica restrito ao fechamento ou recarregamento da aba, caso que não aceita personalização.
7. **Revelação progressiva preserva leveza.** Capa, texto alternativo e classificação aparecem somente quando acionados.
8. **Cada refinamento visual precisa preservar persistência.** Seleção, recuperação local, conflito otimista e vínculo da capa não podem virar apenas simulação visual.
9. **Navegação refinada não remove capacidades existentes.** Antes de simplificar o shell, conferir acesso a perfil, saída e demais utilidades pessoais. `Meu perfil` é gestão da conta administrativa; não equivale ao perfil público futuro.
10. **Editores longos usam a viewport e preservam ações.** Composição extensa não deve ficar dentro de um cartão parcialmente rolável. Cabeçalho e barra de ações permanecem fixos; no compacto, composição e prévia formam duas etapas reversíveis.

## Evidências que originaram as regras

- feedback visual do proprietário durante a revisão do Preview do PR #24;
- `src/components/editor/draft-composer.tsx`;
- `tests/unit/draft-composer.test.tsx`;
- `docs/evidence/EVID-PUB-007-01.md`.
