import { notFound } from "next/navigation";

import { PublicationsWorkspace } from "@/components/editor/publications-workspace";
import { draftIdSchema } from "@/modules/publishing/draft-domain";
import {
  getDraftById,
  listAdminPublications,
} from "@/modules/publishing/draft-repository";

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft: draftId } = await searchParams;
  const parsedId = draftId ? draftIdSchema.safeParse(draftId) : null;
  if (draftId && !parsedId?.success) notFound();

  const [draft, publications] = await Promise.all([
    parsedId?.success ? getDraftById(parsedId.data) : null,
    listAdminPublications(),
  ]);
  if (parsedId?.success && !draft) notFound();

  return (
    <PublicationsWorkspace
      initialDraft={
        draft ? { ...draft, updatedAt: draft.updatedAt.toISOString() } : null
      }
      publications={publications.map((publication) => ({
        ...publication,
        updatedAt: publication.updatedAt.toISOString(),
      }))}
    />
  );
}
