import type { PublicPublication } from "@/modules/publishing/draft-repository";

export function publicationStructuredData(
  publication: PublicPublication,
  canonicalUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: publication.title,
    description: publication.summary,
    datePublished: publication.publishedAt.toISOString(),
    dateModified: publication.updatedAt.toISOString(),
    inLanguage: "pt-BR",
    mainEntityOfPage: canonicalUrl,
    author: { "@type": "Person", name: "Juliano Zilli" },
    publisher: { "@type": "Person", name: "Juliano Zilli" },
    ...(publication.cover ? { image: [publication.cover.url] } : {}),
    ...(publication.areaNames.length
      ? {
          about: publication.areaNames.map((name) => ({
            "@type": "Thing",
            name,
          })),
        }
      : {}),
    ...(publication.tagNames.length
      ? { keywords: publication.tagNames.join(", ") }
      : {}),
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
