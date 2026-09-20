import "server-only";

import { del } from "@vercel/blob";

import { assertCoverCanBeDeleted } from "@/modules/media/cover-policy";

export async function deleteDetachedCover(
  url: string,
  options: { isStillReferenced: () => Promise<boolean> },
) {
  assertCoverCanBeDeleted(await options.isStillReferenced());

  await del(url);
}
