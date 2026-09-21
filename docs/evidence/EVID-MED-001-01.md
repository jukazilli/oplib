# EVID-MED-001-01 — Ciclo de vida da imagem de capa

- **Estado:** técnico concluído; aceite visual do Preview pendente
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

## Validações automatizadas

- `TEST-MED-001-01`: upload e ciclo válido;
- `TEST-MED-001-02`: tipo, assinatura, tamanho e vínculo;
- `TEST-MED-001-03`: falha do armazenamento sem perda editorial;
- `pnpm test` — 22 arquivos e 87 testes aprovados;
- `pnpm lint` — aprovado;
- `pnpm typecheck` — aprovado;
- `pnpm build` — aprovado.

## Aceite visual pendente

- [ ] prévia, texto alternativo e remoção são autoexplicativos;
- [ ] estado de envio mantém as ações essenciais acessíveis;
- [ ] falha comunica o problema sem competir com o conteúdo;
- [ ] capa permanece utilizável em tela compacta.
