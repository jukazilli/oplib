import { notFound } from "next/navigation";

import { DraftComposer } from "@/components/editor/draft-composer";
import { draftIdSchema } from "@/modules/publishing/draft-domain";
import { getDraftById } from "@/modules/publishing/draft-repository";

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft: draftId } = await searchParams;
  const parsedId = draftId ? draftIdSchema.safeParse(draftId) : null;
  if (draftId && !parsedId?.success) notFound();

  const draft = parsedId?.success ? await getDraftById(parsedId.data) : null;
  if (parsedId?.success && !draft) notFound();

  return (
    <DraftComposer
      initialDraft={
        draft ? { ...draft, updatedAt: draft.updatedAt.toISOString() } : null
      }
    />
  );
}
