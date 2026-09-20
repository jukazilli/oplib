# EVID-FND-007-01 — Preview Vercel

- **Item:** FND-007
- **Data:** 20 de setembro de 2026
- **Projeto:** `feather-tecnologias/oplib`
- **Commit de configuração:** `44b12ad`

## TEST-FND-007-01 — deployment Preview

A Vercel confirmou:

- target `preview`;
- status `Ready`;
- funções em `gru1`;
- URL `https://oplib-fkvx7s3oj-feather-tecnologias.vercel.app`.

O build utilizou Next.js 16, pnpm 9 e Node 22. O repositório fixa `22.12.0`; a plataforma selecionou um patch mais recente do Node 22 e emitiu apenas um aviso não bloqueante.

## TEST-FND-007-02 — matriz de ambiente

Na Vercel, `DATABASE_URL` e `DATABASE_URL_UNPOOLED` aparecem como `Encrypted`, no ambiente Preview e limitadas à branch `feat/fnd-007-vercel-preview`. Ambas apontam exclusivamente para a branch Neon `preview`; a primeira usa pooling e a segunda conexão direta.

Production não recebeu variáveis de banco neste corte.

## Desvio observado

Ao criar um projeto novo pela CLI, a Vercel classificou automaticamente o primeiro artefato como Production, apesar da ausência de `--prod`. Esse artefato foi construído antes da configuração das variáveis, contém somente a página estática e não possui acesso ao Neon. Nenhuma promoção adicional de produção foi realizada.

Nenhum token, senha, host de banco ou connection string foi incluído nesta evidência.
