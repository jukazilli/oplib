import { notFound } from "next/navigation";

import { PublicationsWorkspace } from "@/components/editor/publications-workspace";
import { draftIdSchema } from "@/modules/publishing/draft-domain";
import {
  getAdminPublicationById,
  listAdminPublications,
} from "@/modules/publishing/draft-repository";
import { listTaxonomy } from "@/modules/taxonomy/repository";

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft: draftId } = await searchParams;
  const parsedId = draftId ? draftIdSchema.safeParse(draftId) : null;
  if (draftId && !parsedId?.success) notFound();

  const [draft, publications, taxonomy] = await Promise.all([
    parsedId?.success ? getAdminPublicationById(parsedId.data) : null,
    listAdminPublications(),
    listTaxonomy(),
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
      taxonomy={taxonomy}
    />
  );
}
