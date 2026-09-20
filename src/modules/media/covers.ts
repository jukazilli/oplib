import "server-only";

import { del } from "@vercel/blob";

export async function deleteDetachedCover(
  url: string,
  options: { isStillReferenced: () => Promise<boolean> },
) {
  if (await options.isStillReferenced()) {
    throw new Error("A capa ainda está vinculada a uma publicação.");
  }

  await del(url);
}
