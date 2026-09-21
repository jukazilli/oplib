import "server-only";

import { del } from "@vercel/blob";
import { count, eq } from "drizzle-orm";

import { getDatabase, type Database } from "@/lib/db";
import { coverAssets, posts } from "@/lib/db/schema";
import { assertCoverCanBeDeleted } from "@/modules/media/cover-policy";

export async function deleteDetachedCover(
  pathname: string,
  options: { isStillReferenced: () => Promise<boolean> },
) {
  assertCoverCanBeDeleted(await options.isStillReferenced());

  await del(pathname);
}

export async function cleanupDetachedCover(
  pathname: string,
  database?: Database,
) {
  const db = database ?? getDatabase();
  const rows = await db
    .select({
      id: coverAssets.id,
      references: count(posts.id),
    })
    .from(coverAssets)
    .leftJoin(posts, eq(posts.coverAssetId, coverAssets.id))
    .where(eq(coverAssets.pathname, pathname))
    .groupBy(coverAssets.id)
    .limit(1);
  const asset = rows[0];
  assertCoverCanBeDeleted(Boolean(asset?.references));
  await del(pathname);
  if (asset) await db.delete(coverAssets).where(eq(coverAssets.id, asset.id));
  return { deleted: true, hadDatabaseRecord: Boolean(asset) };
}
