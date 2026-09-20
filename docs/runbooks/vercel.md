# Vercel

## Projeto

- escopo: `feather-tecnologias`;
- projeto: `oplib`;
- repositório: `jukazilli/oplib`;
- framework: Next.js;
- runtime: Node 22;
- região de funções: `gru1`.

## Preview

- Preview é o staging principal do projeto.
- `DATABASE_URL` usa conexão pooled da branch Neon `preview`.
- `DATABASE_URL_UNPOOLED` usa conexão direta da mesma branch e nunca é consumida no boot da aplicação.
- Variáveis sensíveis permanecem criptografadas na Vercel e inicialmente restritas à branch Git do FND-007.
- Produção não recebe credenciais do Neon neste corte.

## Operação local da CLI

A inspeção HTTPS do Kaspersky exige que o Node receba a autoridade certificadora já confiada pelo Windows via `NODE_EXTRA_CA_CERTS`. Nunca usar `NODE_TLS_REJECT_UNAUTHORIZED=0`.

O diretório local `.vercel/` contém o vínculo do projeto, permanece ignorado pelo Git e não deve ser versionado.

## Deploy

Executar Preview sem `--prod`:

```powershell
vercel deploy . -y --scope feather-tecnologias
```

Produção exige decisão explícita, gates aprovados e comando separado com `--prod`.
