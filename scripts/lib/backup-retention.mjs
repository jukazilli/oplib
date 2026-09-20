const RETENTION_LIMITS = Object.freeze({ daily: 7, weekly: 4 });
const RETAINED_TIERS = new Set(Object.keys(RETENTION_LIMITS));

export function parseBackupPath(pathname) {
  const match =
    /^backups\/(daily|weekly)\/(\d{4}-\d{2}-\d{2}T\d{6}Z)\/oplib\.dump\.age$/.exec(
      pathname,
    );

  if (!match) return null;

  return {
    pathname,
    tier: match[1],
    backupId: match[2],
  };
}

export function selectExpiredBackups(pathnames) {
  const grouped = { daily: [], weekly: [] };

  for (const pathname of pathnames) {
    const parsed = parseBackupPath(pathname);
    if (parsed && RETAINED_TIERS.has(parsed.tier))
      grouped[parsed.tier].push(parsed);
  }

  return Object.entries(grouped).flatMap(([tier, backups]) =>
    backups
      .sort((left, right) => right.backupId.localeCompare(left.backupId))
      .slice(RETENTION_LIMITS[tier])
      .map(({ pathname }) => pathname),
  );
}

export function relatedBackupPaths(encryptedPathname) {
  return [
    encryptedPathname,
    encryptedPathname.replace(/\.dump\.age$/, ".manifest.json"),
  ];
}
