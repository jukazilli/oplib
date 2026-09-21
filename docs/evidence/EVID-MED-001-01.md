# EVID-MED-001-01 — Ciclo de vida da imagem de capa

- **Estado:** concluído e aceito pelo proprietário em 21/09/2026
- **Rota:** `/admin/publicacoes`

## Entrega comprovada

- upload exige administrador autenticado e pathname gerado pelo servidor;
- JPEG, PNG, WebP e AVIF são limitados a 5 MB e conferidos por assinatura;
- a prévia solicita texto alternativo antes do salvamento;
- substituição e remoção preservam título, Markdown e metadados;
- uploads ainda não persistidos são removidos ao substituir ou descartar;
- capas anteriormente persistidas são limpas somente após o novo vínculo ser salvo;
- objetos vinculados não podem ser excluídos;
- falha de limpeza mantém o registro para nova tentativa e produz evento operacional saneado;
- falha do armazenamento usa mensagem curta e não apaga a composição.
- capa, classificação, detalhes e rascunhos permanecem acessíveis no cabeçalho fixo durante a rolagem.

## Validações automatizadas

- `TEST-MED-001-01`: upload e ciclo válido;
- `TEST-MED-001-02`: tipo, assinatura, tamanho e vínculo;
- `TEST-MED-001-03`: falha do armazenamento sem perda editorial;
- `pnpm test` — 22 arquivos e 87 testes aprovados;
- `pnpm lint` — aprovado;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado.

## Aceite visual

- [x] prévia, texto alternativo e remoção são autoexplicativos;
- [x] estado de envio mantém as ações essenciais acessíveis;
- [x] falha comunica o problema sem competir com o conteúdo;
- [x] capa permanece utilizável em tela compacta;
- [x] ajuste final move capa, classificação e detalhes para o cabeçalho fixo, antes de rascunhos.
