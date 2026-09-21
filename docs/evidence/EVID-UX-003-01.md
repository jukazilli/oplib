# EVID-UX-003-01 — Grafo do acervo e perfis isolados

- **Estado:** parcial; aceite do proprietário pendente
- **Decisão em revisão:** `docs/decisions/UX-003.md`

## Material consolidado

- referência Obsidian fornecida pelo proprietário;
- inspeção autenticada do repositório privado `jukazilli/graph`;
- contrato de visualização alternativa `Lista` e `Grafo`;
- semântica de nós e relações editoriais explícitas;
- cartão contextual e guardas de ações administrativas;
- equivalência para teclado, toque e leitor de tela;
- direção futura de perfil público e estúdio privado;
- limites de migração e isolamento multiusuário.

## Guardas verificadas

- o grafo não substitui lista, busca ou autorização;
- hover não concentra ações destrutivas;
- `Arquivar` não cria um estado inexistente no domínio atual;
- taxonomia compartilhada não inventa relações entre publicações;
- o protótipo externo não introduz contribuição anônima no OPALIB;
- a URL pública não é usada como fronteira de autorização;
- `/admin` permanece inalterado no MVP.

## Pendência para conclusão

O proprietário deverá revisar os critérios de aceite de `docs/decisions/UX-003.md`. A implementação exigirá decisão posterior sobre relações persistentes entre publicações e arquitetura de propriedade multiusuário.
