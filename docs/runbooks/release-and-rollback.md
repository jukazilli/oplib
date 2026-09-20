# Release e rollback

## Objetivo

Promover para Production exatamente o commit aprovado no Preview e restaurar rapidamente um deployment anterior conhecido quando necessário.

O fluxo é manual. Um push ou merge não aplica migration nem promove Production por este workflow.

## Pré-requisitos

- o commit está em `main` e todos os checks estão verdes;
- o Preview desse commit passou pelo workflow `E2E Preview`;
- o GitHub Environment `Production` possui aprovação humana;
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` e `DATABASE_URL_UNPOOLED` estão nos secrets do Environment `Production`;
- a Vercel possui as variáveis de runtime necessárias em Production;
- migrations destrutivas têm backup e aprovação específicos.

## Ensaio seguro

1. Abra `Actions > Production Release > Run workflow`.
2. Selecione `rehearse`.
3. Informe o SHA completo do commit e a URL exata do Preview correspondente.
4. Informe `REHEARSE` na confirmação.
5. Confira no resumo da execução que o mesmo SHA foi baixado e que quality gates e smoke passaram.

O ensaio não acessa credenciais de Production e não altera tráfego.

## Promoção

1. Confirme os pré-requisitos e identifique previamente o deployment Production conhecido como bom.
2. Execute o workflow a partir de `main` com `operation=promote`, o SHA completo, a URL do Preview aprovado e `confirmation=PROMOTE`.
3. Aprove o GitHub Environment `Production`.
4. O workflow confirma que o commit pertence a `main`, aplica migrations pela conexão direta e promove o deployment informado.
5. Execute smoke na URL pública e verifique erros nos logs antes de encerrar o release.

Se a migration falhar, a promoção não ocorre.

## Rollback

1. Identifique um deployment que já tenha servido Production e seja conhecido como bom.
2. Execute o workflow a partir de `main` com `operation=rollback`, o SHA esperado desse deployment, sua URL e `confirmation=ROLLBACK`.
3. Aprove o GitHub Environment `Production`.
4. Faça smoke e confira os logs imediatamente após o retorno.

Rollback de aplicação não desfaz schema. Alterações de banco devem ser retrocompatíveis; correção de schema usa nova migration ou restauração segundo o procedimento de banco.

## Interrupção e escalada

- não promova se URL e commit não puderem ser relacionados;
- não repita migration com falha sem diagnosticar seu estado;
- se o deployment anterior não for elegível para rollback, interrompa e selecione outro deployment que já tenha servido Production;
- registre URL da execução, SHA, deployment promovido ou restaurado e resultado do smoke na evidência do item.
