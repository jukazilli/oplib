import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { listTaxonomy } from "@/modules/taxonomy/repository";

export default async function TaxonomyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const taxonomy = await listTaxonomy(q);
  return <TaxonomyManager {...taxonomy} search={q} />;
}
