# EVID-FND-015-01 — Backup criptografado e restauração

## Estado

Em andamento. A automação, a retenção e o runbook foram implementados e validados localmente. A conclusão depende da configuração protegida, de um backup real e do restore em branch Neon temporária.

## TEST-FND-015-01 — Integridade e retenção

- `pg_dump` custom-format e `pg_restore --list` fazem parte do workflow;
- o dump é criptografado com `age` antes do upload;
- somente a chave pública integra a automação; a identidade privada permanece offline;
- Blob privado guarda o arquivo criptografado e seu manifesto;
- o tamanho do upload é conferido antes da remoção de cópias antigas;
- política testada: sete diários e quatro semanais, sem remoção automática dos manuais;
- validação local: 29 testes aprovados, incluindo três cenários de retenção.

Pendente: URL da primeira execução verde e SHA-256 saneado do arquivo criptografado.

## TEST-FND-015-02 — Restore

O script local valida hash, descriptografa com a identidade offline, confirma a estrutura do dump, restaura com `--exit-on-error` e executa consulta de sanidade. Ele exige branch com nome `restore-test-AAAAMMDD`, confirmação explícita e endpoint diferente da origem.

Pendente: duração do restore real, quantidade saneada de tabelas, versão usada e prova de remoção da branch temporária.

Nenhuma connection string, chave, conteúdo do dump ou dado de usuário será registrado nesta evidência.

## Exceção operacional

`OPS-002` permite desenvolvimento e Preview com dados sintéticos enquanto backup e restore reais permanecem pendentes. A FND-015 deve ser concluída antes de Production ou antes de conteúdo real insubstituível; até lá, RPO de 24 horas e RTO de 4 horas não estão comprovados.
