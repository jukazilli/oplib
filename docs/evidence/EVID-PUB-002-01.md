# EVID-PUB-002-01 — Editor e prévia Markdown segura

- **Estado:** concluído e aprovado pelo proprietário em 21/09/2026
- **Rota:** `/admin/publicacoes`

## Entrega comprovada

- um único componente renderiza Markdown para a prévia e fica disponível à futura leitura pública;
- CommonMark e GFM cobrem títulos, parágrafos, listas, citações, tabelas, links e código;
- HTML bruto não é interpretado;
- sanitização por allowlist é aplicada após a transformação;
- esquemas perigosos de URL são removidos;
- links da prévia preservam aparência sem executar navegação;
- conteúdo não suportado produz aviso curto no contexto da prévia;
- desktop apresenta escrita e prévia lado a lado;
- compacto percorre `Composição` e `Prévia` com `Avançar`/`Voltar`;
- cabeçalho e barra inferior permanecem fixos enquanto apenas o conteúdo central rola.

## Validações automatizadas

- `TEST-PUB-002-01`: estruturas CommonMark/GFM;
- `TEST-PUB-002-02`: corpus com HTML, script, handler e URL perigosa;
- `TEST-PUB-002-03`: integração responsiva no composer e pipeline compartilhado;
- `pnpm test` — 20 arquivos e 76 testes aprovados;
- `pnpm lint` — aprovado;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado.

`pnpm audit --prod` continua reportando duas vulnerabilidades moderadas transitivas sob `@clerk/ui` (`uuid` e `stream-json`). Elas não pertencem ao pipeline Markdown e não possuem correção direta neste corte; permanecem como risco herdado para atualização da dependência proprietária.

## Aceite visual

- [x] colunas mantêm leitura confortável no desktop;
- [x] avanço e retorno entre as duas etapas são claros no celular;
- [x] prévia vazia e avisos não tornam o composer denso;
- [x] salvamento permanece acessível nos dois modos.

O proprietário aprovou o Preview após o refinamento para viewport completa, duas etapas em telas compactas e ações persistentes durante a rolagem.
