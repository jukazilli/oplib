import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cache, Suspense } from "react";

import {
  listFeaturedPublications,
  listPublicAreas,
  listRecentPublications,
  type PublicPublicationSummary,
} from "@/modules/discovery/publications";

const getFeaturedPublications = cache(listFeaturedPublications);
const getRecentPublications = cache(listRecentPublications);
const getPublicAreas = cache(listPublicAreas);

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function PublicationImage({
  item,
  sizes,
}: {
  item: PublicPublicationSummary;
  sizes: string;
}) {
  return item.cover ? (
    <Image
      src={item.cover.url}
      alt={item.cover.altText}
      fill
      sizes={sizes}
      className="object-cover"
    />
  ) : (
    <div className="bg-opal-gradient absolute inset-0" aria-hidden="true" />
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <p className="rounded-card border bg-surface p-5 text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export async function MainFeature() {
  let item: PublicPublicationSummary | undefined;
  try {
    [item] = await getFeaturedPublications();
  } catch {
    return <SectionError message="O destaque não pôde ser carregado." />;
  }
  if (!item) {
    return (
      <div
        className="bg-opal-gradient min-h-80 rounded-card opacity-70"
        aria-hidden="true"
      />
    );
  }
  return (
    <article className="group relative min-h-80 overflow-hidden rounded-card bg-muted sm:min-h-[28rem]">
      <PublicationImage item={item} sizes="(max-width: 1024px) 100vw, 45vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <p className="font-interface text-xs font-semibold tracking-wide uppercase">
          Em destaque
        </p>
        <h2 className="mt-2 font-editorial text-3xl leading-tight font-semibold sm:text-4xl">
          <Link
            href={`/publicacoes/${item.slug}`}
            className="after:absolute after:inset-0"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-white/80">
          {item.summary}
        </p>
      </div>
    </article>
  );
}

export async function HomeDiscovery() {
  const [featuredResult, recentResult, areasResult] = await Promise.allSettled([
    getFeaturedPublications(),
    getRecentPublications(),
    getPublicAreas(),
  ]);
  const secondary =
    featuredResult.status === "fulfilled" ? featuredResult.value.slice(1) : [];

  return (
    <>
      <section aria-labelledby="outros-destaques" className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="outros-destaques"
            className="font-editorial text-3xl font-semibold"
          >
            Outros destaques
          </h2>
          <Link
            href="/publicacoes"
            className="font-interface text-sm font-semibold text-primary"
          >
            Ver todas
          </Link>
        </div>
        {featuredResult.status === "rejected" ? (
          <div className="mt-6">
            <SectionError message="Os destaques não puderam ser carregados." />
          </div>
        ) : secondary.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {secondary.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-card border bg-surface"
              >
                <div className="relative aspect-[16/10] bg-muted">
                  <PublicationImage
                    item={item}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-editorial text-2xl leading-tight font-semibold">
                    <Link
                      href={`/publicacoes/${item.slug}`}
                      className="hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section
        aria-labelledby="recentes"
        className="mt-20 grid gap-8 lg:grid-cols-[2fr_1fr]"
      >
        <div>
          <h2 id="recentes" className="font-editorial text-3xl font-semibold">
            Publicações recentes
          </h2>
          {recentResult.status === "rejected" ? (
            <div className="mt-6">
              <SectionError message="As publicações recentes não puderam ser carregadas." />
            </div>
          ) : recentResult.value.length ? (
            <div className="mt-4 divide-y">
              {recentResult.value.map((item) => (
                <article key={item.id} className="py-5">
                  <p className="font-interface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {item.areaNames[0] ?? "Publicação"}
                  </p>
                  <h3 className="mt-1 font-editorial text-2xl font-semibold">
                    <Link
                      href={`/publicacoes/${item.slug}`}
                      className="hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {item.summary}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-muted-foreground">
              O acervo está sendo preparado.
            </p>
          )}
        </div>

        <aside
          aria-labelledby="areas"
          className="rounded-card border bg-surface p-6 lg:self-start"
        >
          <h2 id="areas" className="font-editorial text-2xl font-semibold">
            Explorar por área
          </h2>
          {areasResult.status === "rejected" ? (
            <div className="mt-5">
              <SectionError message="As áreas não puderam ser carregadas." />
            </div>
          ) : areasResult.value.length ? (
            <ul className="mt-4 divide-y">
              {areasResult.value.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/publicacoes?area=${encodeURIComponent(area.slug)}`}
                    className="flex min-h-12 items-center justify-between gap-4 font-interface text-sm font-semibold hover:text-primary"
                  >
                    <span>{area.name}</span>
                    <span className="text-muted-foreground">
                      {area.publicationCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhuma área publicada.
            </p>
          )}
        </aside>
      </section>
    </>
  );
}

function FeatureSkeleton() {
  return (
    <div className="min-h-80 animate-pulse rounded-card bg-muted sm:min-h-[28rem]" />
  );
}

function DiscoverySkeleton() {
  return (
    <div
      className="mt-20 h-72 animate-pulse rounded-card bg-muted"
      aria-hidden="true"
    />
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="font-editorial text-5xl leading-[0.98] font-medium tracking-[-0.04em] text-balance sm:text-7xl">
            Conhecimento para construir, preservar e compartilhar.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            A OPALIB reúne artigos, estudos e experiências de uma jornada de
            aprendizagem dentro e fora da universidade.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/publicacoes"
              className="inline-flex min-h-12 items-center rounded-control bg-primary px-5 font-interface text-sm font-semibold text-primary-foreground"
            >
              Explorar publicações
            </Link>
          </div>
          <form
            action="/publicacoes"
            role="search"
            className="mt-8 flex max-w-xl gap-2"
          >
            <label className="flex-1">
              <span className="sr-only">Pesquisar no acervo</span>
              <input
                name="busca"
                placeholder="Pesquisar no acervo"
                className="min-h-12 w-full rounded-control border bg-surface px-4 font-interface text-sm"
              />
            </label>
            <button
              type="submit"
              className="min-h-12 rounded-control border bg-surface px-4 font-interface text-sm font-semibold"
            >
              Pesquisar
            </button>
          </form>
        </div>
        <Suspense fallback={<FeatureSkeleton />}>
          <MainFeature />
        </Suspense>
      </section>
      <Suspense fallback={<DiscoverySkeleton />}>
        <HomeDiscovery />
      </Suspense>
    </div>
  );
}
