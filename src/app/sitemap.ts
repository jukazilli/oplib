import type { MetadataRoute } from "next";

import { getSiteUrl, isPublicIndexingEnabled } from "@/lib/seo/metadata";
import { listPublishedSitemapEntries } from "@/modules/discovery/publications";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isPublicIndexingEnabled()) return [];

  const siteUrl = getSiteUrl();
  const publications = await listPublishedSitemapEntries();
  return [
    { url: new URL("/", siteUrl).href, changeFrequency: "weekly", priority: 1 },
    {
      url: new URL("/publicacoes", siteUrl).href,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...publications.map((publication) => ({
      url: new URL(`/publicacoes/${publication.slug}`, siteUrl).href,
      lastModified: publication.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(publication.coverUrl ? { images: [publication.coverUrl] } : {}),
    })),
  ];
}
