import Image from "next/image";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MarkdownContent } from "@/components/editor/markdown-content";
import { LikeAction } from "@/components/editorial/like-action";
import { ShareAction } from "@/components/editorial/share-action";
import { getSiteUrl } from "@/lib/seo/metadata";
import {
  publicationStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data";
import { getPublicPublicationBySlug } from "@/modules/publishing/draft-repository";
import { estimateReadingMinutes } from "@/modules/publishing/metadata";
import {
  hashVisitorId,
  validVisitorId,
  VISITOR_COOKIE_NAME,
} from "@/modules/interactions/likes/identity";
import { getLikeState } from "@/modules/interactions/likes/repository";

const getPublication = cache(getPublicPublicationBySlug);

export async function generateMetadata({
  params,
}: PageProps<"/publicacoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublication(slug);
  if (!publication) {
    return {
      title: "Publicação indisponível",
      robots: { index: false, follow: false },
    };
  }

  const path = `/publicacoes/${publication.slug}`;
  const image = publication.cover
    ? {
        url: publication.cover.url,
        ...(publication.cover.width && publication.cover.height
          ? {
              width: publication.cover.width,
              height: publication.cover.height,
            }
          : {}),
        alt: publication.cover.altText,
      }
    : {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OPALIB — conhecimento para construir, preservar e compartilhar",
      };

  return {
    title: publication.title,
    description: publication.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "pt_BR",
      siteName: "OPALIB",
      title: publication.title,
      description: publication.summary,
      url: path,
      publishedTime: publication.publishedAt.toISOString(),
      modifiedTime: publication.updatedAt.toISOString(),
      tags: publication.tagNames,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: publication.title,
      description: publication.summary,
      images: [image],
    },
  };
}

const contentTypeLabels = {
  academic_work: "Trabalho acadêmico",
  article: "Artigo",
  research: "Pesquisa",
  study: "Estudo",
  reflection: "Reflexão",
  project: "Projeto",
  "": "Publicação",
} as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export default async function PublicationPage({
  params,
}: PageProps<"/publicacoes/[slug]">) {
  const { slug } = await params;
  const publication = await getPublication(slug);
  if (!publication) notFound();
  const canonicalUrl = new URL(`/publicacoes/${publication.slug}`, getSiteUrl())
    .href;
  const visitorId = validVisitorId(
    (await cookies()).get(VISITOR_COOKIE_NAME)?.value,
  );
  const likeState = await getLikeState(
    publication.id,
    visitorId ? hashVisitorId(visitorId) : null,
  );

  return (
    <article className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(
            publicationStructuredData(publication, canonicalUrl),
          ),
        }}
      />
      <header className="mx-auto max-w-3xl">
        <p className="font-interface text-sm font-semibold text-primary">
          {[
            ...publication.areaNames,
            contentTypeLabels[publication.contentType],
          ].join(" · ")}
        </p>
        <h1 className="mt-4 font-editorial text-4xl leading-tight font-semibold tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
          {publication.title}
        </h1>
        <p className="mt-5 font-editorial text-xl leading-8 text-muted-foreground sm:text-2xl">
          {publication.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-2 gap-y-1 font-interface text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Juliano Zilli</span>
          <span aria-hidden="true">·</span>
          <time dateTime={publication.publishedAt.toISOString()}>
            {dateFormatter.format(publication.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>
            {estimateReadingMinutes(publication.markdown)} min de leitura
          </span>
        </div>
        {publication.originalDate ? (
          <p className="mt-2 font-interface text-sm text-muted-foreground">
            Trabalho original de{" "}
            {dateFormatter.format(
              new Date(`${publication.originalDate}T12:00:00.000Z`),
            )}
          </p>
        ) : null}
      </header>

      {publication.cover ? (
        <figure className="relative mt-10 aspect-[16/9] overflow-hidden rounded-card bg-muted">
          <Image
            src={publication.cover.url}
            alt={publication.cover.altText}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
        </figure>
      ) : null}

      <div className="mx-auto mt-12 max-w-[72ch]">
        <MarkdownContent markdown={publication.markdown} />

        {publication.references.length ? (
          <section
            aria-labelledby="references-title"
            className="mt-14 border-t pt-8"
          >
            <h2
              id="references-title"
              className="font-editorial text-3xl font-semibold"
            >
              Referências
            </h2>
            <ol className="mt-5 grid gap-4 pl-5 font-interface text-sm leading-6 text-muted-foreground">
              {publication.references.map((reference) => (
                <li key={reference.id} className="list-decimal pl-1">
                  <span className="font-semibold text-foreground">
                    {reference.title}
                  </span>
                  {reference.citation ? ` — ${reference.citation}` : ""}
                  {reference.url ? (
                    <>
                      {" "}
                      —{" "}
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline underline-offset-4"
                      >
                        Acessar referência
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {publication.categoryName || publication.tagNames.length ? (
          <footer className="mt-12 flex flex-wrap gap-2 border-t pt-6 font-interface text-sm">
            {[publication.categoryName, ...publication.tagNames]
              .filter(Boolean)
              .map((label) => (
                <span
                  key={label}
                  className="rounded-full border px-3 py-1.5 text-muted-foreground"
                >
                  {label}
                </span>
              ))}
          </footer>
        ) : null}

        <ShareAction
          title={publication.title}
          text={publication.summary}
          url={canonicalUrl}
        />
        <LikeAction
          slug={publication.slug}
          initialCount={likeState.count}
          initiallyLiked={likeState.liked}
        />
      </div>
    </article>
  );
}
