#!/usr/bin/env bash
set -euo pipefail

required=(BACKUP_BLOB_READ_WRITE_TOKEN BACKUP_AGE_IDENTITY_FILE RESTORE_DATABASE_URL SOURCE_DATABASE_URL EXPECTED_RESTORE_BRANCH RESTORE_CONFIRMATION)
for variable in "${required[@]}"; do
  if [[ -z "${!variable:-}" ]]; then
    echo "Variável obrigatória ausente: $variable" >&2
    exit 1
  fi
done

if [[ ! "$EXPECTED_RESTORE_BRANCH" =~ ^restore-test-[0-9]{8}(-[a-z0-9-]+)?$ ]]; then
  echo 'EXPECTED_RESTORE_BRANCH deve seguir restore-test-AAAAMMDD.' >&2
  exit 1
fi
if [[ "$RESTORE_CONFIRMATION" != "RESTORE:$EXPECTED_RESTORE_BRANCH" ]]; then
  echo 'Confirmação de restore inválida.' >&2
  exit 1
fi
if [[ ! -f "$BACKUP_AGE_IDENTITY_FILE" ]]; then
  echo 'Identidade age offline não encontrada.' >&2
  exit 1
fi

source_host="$(node -e 'process.stdout.write(new URL(process.env.SOURCE_DATABASE_URL).hostname)')"
restore_host="$(node -e 'process.stdout.write(new URL(process.env.RESTORE_DATABASE_URL).hostname)')"
if [[ "$source_host" == "$restore_host" ]]; then
  echo 'O endpoint de restore não pode ser o endpoint de origem.' >&2
  exit 1
fi

retention_tier="${1:?Uso: scripts/restore-backup.sh <daily|weekly|manual> <backup-id>}"
backup_id="${2:?Uso: scripts/restore-backup.sh <daily|weekly|manual> <backup-id>}"
workdir="$(mktemp -d)"
chmod 700 "$workdir"
cleanup() {
  if [[ -f "$workdir/oplib.dump" ]]; then shred --remove "$workdir/oplib.dump"; fi
  rm -f "$workdir/oplib.dump.age" "$workdir/oplib.manifest.json"
  rmdir "$workdir" 2>/dev/null || true
}
trap cleanup EXIT

started_at="$(date +%s)"
node scripts/backup-download.mjs "$retention_tier" "$backup_id" "$workdir"
expected_sha="$(jq --raw-output '.encryptedSha256' "$workdir/oplib.manifest.json")"
actual_sha="$(sha256sum "$workdir/oplib.dump.age" | cut -d' ' -f1)"
test "$expected_sha" = "$actual_sha"
age --decrypt --identity "$BACKUP_AGE_IDENTITY_FILE" --output "$workdir/oplib.dump" "$workdir/oplib.dump.age"

docker run --rm --volume "$workdir:/backup:ro" postgres:17-alpine pg_restore --list /backup/oplib.dump >/dev/null
docker run --rm \
  --env RESTORE_DATABASE_URL \
  --volume "$workdir:/backup:ro" \
  postgres:17-alpine \
  sh -c 'pg_restore --dbname "$RESTORE_DATABASE_URL" --clean --if-exists --no-owner --no-privileges --exit-on-error /backup/oplib.dump'
sanity_count="$(docker run --rm --env RESTORE_DATABASE_URL postgres:17-alpine \
  sh -c 'psql "$RESTORE_DATABASE_URL" --tuples-only --no-align --command "SELECT count(*) FROM information_schema.tables WHERE table_schema = '\''public'\'';"')"
test "$sanity_count" -gt 0
duration_seconds="$(( $(date +%s) - started_at ))"

jq --null-input \
  --arg event 'backup.restore_verified' \
  --arg backupId "$backup_id" \
  --arg encryptedSha256 "$actual_sha" \
  --arg restoreBranch "$EXPECTED_RESTORE_BRANCH" \
  --argjson publicTableCount "$sanity_count" \
  --argjson durationSeconds "$duration_seconds" \
  '{event:$event, backupId:$backupId, encryptedSha256:$encryptedSha256, restoreBranch:$restoreBranch, publicTableCount:$publicTableCount, durationSeconds:$durationSeconds}'
