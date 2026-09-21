# EVID-LIKE-001-01 — Curtida anônima irreversível

## Entrega

- UUID aleatório em cookie `HttpOnly`, `SameSite=Lax`, `Secure` em produção e duração de um ano.
- Persistência somente de HMAC-SHA256 com pepper secreto do servidor.
- Inserção transacional com `ON CONFLICT DO NOTHING` e constraint única existente.
- Contagem sempre devolvida pelo banco; cliente não envia nem antecipa contador.
- Repetição sincroniza o estado sem novo incremento.
- Publicação não pública e origem cruzada são recusadas.
- Erro não bloqueia a leitura e mantém a ação disponível para nova tentativa.
- Nenhum caminho de remoção/desfazer foi criado.

## Evidência local

- `pnpm test`: 36 arquivos e 151 testes aprovados.
- `pnpm lint`: aprovado sem avisos.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado; rota dinâmica `/api/publications/[slug]/like` compilada.
- `tests/unit/like-identity.test.ts`: UUID e HMAC cobertos.
- `tests/unit/likes-repository.test.ts`: inserção, conflito e publicação indisponível cobertos.
- `tests/unit/like-route.test.ts`: cookie, repetição, falha, indisponibilidade e origem cruzada cobertos.
- `tests/unit/like-action.test.tsx`: confirmação, contador, repetição, erro e estado inicial cobertos.
- `src/lib/db/schema.test.ts`: constraint `likes_post_visitor_unique` coberta pela regressão completa.

## Validação preservada para o Preview/final

- Disparar duas curtidas concorrentes com o mesmo cookie em Neon Preview.
- Recarregar e confirmar estado persistido e contador sincronizado.
- Conferir atributos reais do cookie e logs sem identificador/hash.
- Validar regra de WAF da rota com tráfego sintético.
- Testar teclado, leitor de tela, celular e falha isolada do banco.
