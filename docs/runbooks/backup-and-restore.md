# Backup criptografado e restauração

## Objetivo

Criar um backup lógico diário do PostgreSQL, criptografá-lo antes do upload, reter 7 cópias diárias e 4 semanais no Blob privado e provar a restauração sem tocar Production.

## Configuração inicial

1. Crie uma identidade `age` em uma máquina confiável: `age-keygen -o oplib-backup.agekey`.
2. Guarde `oplib-backup.agekey` offline, com cópia segura. Ela nunca entra no GitHub, Vercel, Neon, repositório, chat ou evidência.
3. Crie um Vercel Blob store com acesso **Private**, separado do store de capas.
4. Crie o GitHub Environment `Backup`, restrito à branch `main`. Não exija reviewer nesse Environment: jobs agendados também ficariam aguardando aprovação e quebrariam o RPO. Execuções manuais já exigem a confirmação explícita do workflow.
5. Cadastre no Environment apenas:
   - `DATABASE_URL_UNPOOLED`: conexão direta da branch de origem aprovada;
   - `BACKUP_BLOB_READ_WRITE_TOKEN`: token do store privado;
   - `BACKUP_ENCRYPTION_PUBLIC_KEY`: destinatário público exibido pelo `age-keygen`.

O workflow `.github/workflows/backup.yml` roda às 03:17 UTC. Toda execução programada cria uma cópia diária; no domingo, cria também uma cópia semanal do mesmo artefato criptografado. Execuções manuais exigem `CREATE_ENCRYPTED_BACKUP`; use a retenção `manual` antes de migration destrutiva.

## Verificação do backup

O job:

1. gera `pg_dump` em formato custom com PostgreSQL 17;
2. valida a estrutura com `pg_restore --list`;
3. criptografa com a chave pública `age`;
4. gera manifesto sem credenciais ou conteúdo;
5. remove o dump em claro;
6. envia dump criptografado e manifesto ao Blob privado;
7. confere o tamanho enviado e só então aplica a retenção.

Registre na evidência apenas o link da execução, o identificador, o SHA-256 do arquivo criptografado e o resultado. Não baixe nem anexe o backup.

## Restore trimestral ou de Fundação

Pré-requisitos locais: Docker, Node 22, pnpm, `age`, `jq`, a identidade offline e acesso temporário ao token do Blob.

1. No Neon, crie uma branch isolada chamada `restore-test-AAAAMMDD`, com compute read-write. Copiar a branch de origem é aceitável: o script executa `pg_restore --clean --if-exists` somente nesse clone isolado.
2. Confirme no Neon que a connection string obtida pertence à branch temporária. Nunca reutilize a URL de Production ou da origem.
3. Exporte localmente as variáveis abaixo, sem registrá-las no shell history ou no chat:

```text
BACKUP_BLOB_READ_WRITE_TOKEN
BACKUP_AGE_IDENTITY_FILE
SOURCE_DATABASE_URL
RESTORE_DATABASE_URL
EXPECTED_RESTORE_BRANCH=restore-test-AAAAMMDD
RESTORE_CONFIRMATION=RESTORE:restore-test-AAAAMMDD
```

4. Execute `bash scripts/restore-backup.sh daily <backup-id>` (ou `weekly`/`manual`).
5. Registre a saída saneada: hash, duração, quantidade de tabelas públicas e nome da branch.
6. Exclua a branch temporária no Neon imediatamente após colher a evidência e registre a exclusão.

O script recusa endpoints de origem e destino com o mesmo host, valida o hash antes de descriptografar, confirma a legibilidade do dump, restaura com falha imediata e exige ao menos uma tabela pública.

## Incidente

- Falha de job: abra incidente no mesmo dia; o RPO de 24 horas deixa de estar comprovado até novo backup verde.
- Hash divergente ou falha de descriptografia: não apague cópias anteriores; trate o backup como ilegível e investigue token, upload e custódia da chave.
- Chave privada perdida: os backups não são recuperáveis. Interrompa operações destrutivas, gere novo par e preserve a ocorrência.
- Limite do Blob próximo do esgotamento: revise retenção/provedor antes de habilitar cobrança.
- Restore acima de 4 horas: registre quebra de RTO e corrija o procedimento antes de declarar a Fundação pronta.
