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
- permanência de `/admin` para lista de espera, convites, contas e moderação global;
- separação dos papéis de proprietário da plataforma, autor e visitante;
- limites de migração e isolamento multiusuário.

## Guardas verificadas

- o grafo não substitui lista, busca ou autorização;
- hover não concentra ações destrutivas;
- `Arquivar` não cria um estado inexistente no domínio atual;
- taxonomia compartilhada não inventa relações entre publicações;
- o protótipo externo não introduz contribuição anônima no OPALIB;
- a URL pública não é usada como fronteira de autorização;
- `/admin` permanece inalterado no MVP e reservado permanentemente ao plano de controle da plataforma;
- autores futuros não recebem privilégios administrativos por possuir um acervo.

## Pendência para conclusão

O proprietário deverá revisar os critérios de aceite de `docs/decisions/UX-003.md`. A implementação exigirá decisão posterior sobre relações persistentes entre publicações e arquitetura de propriedade multiusuário.

## Aceite parcial registrado

Em 20/09/2026, Juliano Zilli confirmou que `/admin` deverá permanecer como seu plano de controle exclusivo da OPALIB para administrar lista de espera, convites, usuários e moderação da plataforma. Esse aceite parcial não libera ainda a implementação multiusuário nem encerra UX-003.
