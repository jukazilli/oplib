# EVID-FND-004-01 — Configuração e segredos

- **Item:** FND-004
- **Data:** 20 de setembro de 2026
- **Branch:** `feat/fnd-004-env-security`

## Implementação

- `.env.example` sem valores;
- schemas Zod separados por capacidade e exposição;
- módulo de servidor protegido por `server-only`;
- contrato público limitado a variáveis `NEXT_PUBLIC_*` aprovadas;
- variantes `.env.*` ignoradas, exceto `.env.example`;
- runbook de configuração para local, Preview e Production.

## TEST-FND-004-01 — falha antecipada

- schema de banco sem URLs: rejeitado;
- URL que não utiliza PostgreSQL: rejeitada pelo contrato;
- `VISITOR_ID_PEPPER` menor que 32 caracteres: rejeitado;
- mensagens de erro informam o nome da variável, nunca seu valor;
- 2 arquivos de teste e 4 testes aprovados.

## TEST-FND-004-02 — exposição e varredura

- uma chave secreta extra é removida pelo schema público;
- `.env.local`, `.env.preview` e `.env.production` confirmados como ignorados pelo Git;
- build executado com sentinela de segredo e valor ausente dos artefatos gerados;
- busca no Git não encontrou atribuição de valor para variáveis sensíveis fora de `.env.example`;
- lint, typecheck, testes, build e format check aprovados.

Nenhum segredo real foi criado, visualizado ou armazenado durante este corte.
