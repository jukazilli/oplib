# TL-STACK-002 — Node.js 22 LTS

- **Estado:** aprovado
- **Data:** 20 de setembro de 2026
- **Responsável:** Juliano Zilli
- **Afeta:** FND-002, FND-007, CI e Vercel

## Decisão

O OPALIB adotará Node.js 22 LTS. O ambiente local de desenvolvimento foi verificado com Node.js `22.12.0`, que será a referência inicial para a versão exata a ser materializada no `FND-002`.

## Motivo

Priorizar a linha LTS já instalada e validada na máquina de desenvolvimento reduz divergência entre o ambiente local e a Fundação inicial. Desenvolvimento, CI e Vercel deverão usar a mesma versão exata.

## Consequências

- as referências canônicas a Node.js 24 foram substituídas por Node.js 22;
- `.nvmrc`, `package.json`, CI e Vercel serão configurados no `FND-002` e nos itens de infraestrutura correspondentes;
- uma futura atualização de linha principal exigirá decisão própria, revisão de compatibilidade e suíte completa.
