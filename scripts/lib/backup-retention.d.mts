export type BackupTier = 'daily' | 'weekly';

export interface ParsedBackupPath {
  pathname: string;
  tier: BackupTier;
  backupId: string;
}

export function parseBackupPath(pathname: string): ParsedBackupPath | null;
export function selectExpiredBackups(pathnames: string[]): string[];
export function relatedBackupPaths(encryptedPathname: string): string[];
