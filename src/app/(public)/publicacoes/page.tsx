import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  parsePublicSearch,
  type PublicSearch,
} from "@/modules/discovery/domain";
import {
  searchPublications,
  type PublicPublicationSummary,
} from "@/modules/discovery/publications";
import { estimateReadingMinutes } from "@/modules/publishing/metadata";
import { contentTypeValues } from "@/modules/publishing/draft-domain";
import { listTaxonomy } from "@/modules/taxonomy/repository";

export const metadata: Metadata = {
  title: "Publicações",
  description: "Explore artigos, estudos, pesquisas e reflexões no OPALIB.",
  alternates: { canonical: "/publicacoes" },
};

const typeLabels: Record<(typeof contentTypeValues)[number], string> = {
  academic_work: "Trabalho acadêmico",
  article: "Artigo",
  research: "Pesquisa",
  study: "Estudo",
  reflection: "Reflexão",
  project: "Projeto",
};
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });

function searchHref(search: PublicSearch, changes: Partial<PublicSearch>) {
  const next = { ...search, ...changes };
  const params = new URLSearchParams();
  if (next.busca) params.set("busca", next.busca);
  if (next.area) params.set("area", next.area);
  if (next.tipo) params.set("tipo", next.tipo);
  if (next.categoria) params.set("categoria", next.categoria);
  if (next.tag) params.set("tag", next.tag);
  if (next.ano) params.set("ano", String(next.ano));
  if (next.ordem !== "recentes") params.set("ordem", next.ordem);
  if (next.view !== "feed") params.set("view", next.view);
  if (next.pagina > 1) params.set("pagina", String(next.pagina));
  const query = params.toString();
  return query ? `/publicacoes?${query}` : "/publicacoes";
}

function PublicationMeta({ item }: { item: PublicPublicationSummary }) {
  return (
    <p className="font-interface text-sm text-muted-foreground">
      {[...item.areaNames, typeLabels[item.contentType]].join(" · ")}
      <span aria-hidden="true"> · </span>
      <time dateTime={item.publishedAt.toISOString()}>
        {dateFormatter.format(item.publishedAt)}
      </time>
      <span aria-hidden="true"> · </span>
      {estimateReadingMinutes(item.markdown)} min
    </p>
  );
}

function FeedItem({ item }: { item: PublicPublicationSummary }) {
  return (
    <article className="grid gap-5 border-b py-8 last:border-b-0 sm:grid-cols-[1fr_13rem]">
      <div className="min-w-0">
        <PublicationMeta item={item} />
        <h2 className="mt-2 font-editorial text-3xl leading-tight font-semibold">
          <Link
            href={`/publicacoes/${item.slug}`}
            className="hover:text-primary"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 leading-7 text-muted-foreground">
          {item.summary}
        </p>
        <Link
          href={`/publicacoes/${item.slug}`}
          className="mt-5 inline-block font-interface text-sm font-semibold text-primary underline underline-offset-4"
        >
          Ler publicação
        </Link>
      </div>
      {item.cover ? (
        <div className="relative order-first aspect-[16/10] overflow-hidden rounded-card bg-muted sm:order-last">
          <Image
            src={item.cover.url}
            alt={item.cover.altText}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-cover"
          />
        </div>
      ) : null}
    </article>
  );
}

function GridItem({ item }: { item: PublicPublicationSummary }) {
  return (
    <article className="overflow-hidden rounded-card border bg-surface">
      <div className="relative aspect-[16/10] bg-muted">
        {item.cover ? (
          <Image
            src={item.cover.url}
            alt={item.cover.altText}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className="bg-opal-gradient absolute inset-x-0 bottom-0 h-1"
            aria-hidden="true"
          />
        )}
      </div>
      <div className="p-5">
        <PublicationMeta item={item} />
        <h2 className="mt-2 font-editorial text-2xl leading-tight font-semibold">
          <Link
            href={`/publicacoes/${item.slug}`}
            className="hover:text-primary"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {item.summary}
        </p>
      </div>
    </article>
  );
}

export default async function PublicationsPage({
  searchParams,
}: PageProps<"/publicacoes">) {
  const search = parsePublicSearch(await searchParams);
  const [result, taxonomy] = await Promise.all([
    searchPublications(search),
    listTaxonomy(),
  ]);
  const hasFilters = Boolean(
    search.busca ||
    search.area ||
    search.tipo ||
    search.categoria ||
    search.tag ||
    search.ano,
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <header className="max-w-3xl">
        <h1 className="font-editorial text-4xl font-semibold sm:text-5xl">
          Publicações
        </h1>
      </header>

      <form
        action="/publicacoes"
        className="mt-8 grid gap-3 rounded-card border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4"
        role="search"
      >
        <label className="sm:col-span-2 lg:col-span-4">
          <span className="sr-only">Pesquisar no acervo</span>
          <input
            name="busca"
            defaultValue={search.busca}
            placeholder="Pesquisar no acervo"
            className="min-h-12 w-full rounded-control border bg-background px-4 font-interface"
          />
        </label>
        <FilterSelect
          name="area"
          label="Área"
          value={search.area}
          items={taxonomy.areas}
        />
        <label className="grid gap-1 font-interface text-xs font-semibold">
          Tipo
          <select
            name="tipo"
            defaultValue={search.tipo}
            className="min-h-11 rounded-control border bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            {contentTypeValues.map((value) => (
              <option key={value} value={value}>
                {typeLabels[value]}
              </option>
            ))}
          </select>
        </label>
        <FilterSelect
          name="categoria"
          label="Categoria"
          value={search.categoria}
          items={taxonomy.categories}
        />
        <FilterSelect
          name="tag"
          label="Tag"
          value={search.tag}
          items={taxonomy.tags}
        />
        <label className="grid gap-1 font-interface text-xs font-semibold">
          Ano
          <input
            name="ano"
            inputMode="numeric"
            pattern="[0-9]{4}"
            defaultValue={search.ano}
            placeholder="Todos"
            className="min-h-11 rounded-control border bg-background px-3 text-sm"
          />
        </label>
        <label className="grid gap-1 font-interface text-xs font-semibold">
          Ordem
          <select
            name="ordem"
            defaultValue={search.ordem}
            className="min-h-11 rounded-control border bg-background px-3 text-sm"
          >
            <option value="recentes">Mais recentes</option>
            <option value="antigas">Mais antigas</option>
          </select>
        </label>
        <input type="hidden" name="view" value={search.view} />
        <div className="flex items-end gap-3 sm:col-span-2">
          <button
            type="submit"
            className="min-h-11 rounded-control bg-primary px-5 font-interface text-sm font-semibold text-primary-foreground"
          >
            Pesquisar
          </button>
          {hasFilters && result.items.length ? (
            <Link
              href="/publicacoes"
              className="min-h-11 content-center font-interface text-sm font-semibold text-primary underline underline-offset-4"
            >
              Limpar filtros
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <p className="font-interface text-sm text-muted-foreground">
          {result.total} {result.total === 1 ? "publicação" : "publicações"}
        </p>
        <nav
          aria-label="Visualização"
          className="flex rounded-control border bg-surface p-1 font-interface text-sm font-semibold"
        >
          <Link
            href={searchHref(search, { view: "feed", pagina: 1 })}
            aria-current={search.view === "feed" ? "page" : undefined}
            className="rounded-md px-3 py-2 aria-[current=page]:bg-muted"
          >
            Feed
          </Link>
          <Link
            href={searchHref(search, { view: "grid", pagina: 1 })}
            aria-current={search.view === "grid" ? "page" : undefined}
            className="rounded-md px-3 py-2 aria-[current=page]:bg-muted"
          >
            Grade
          </Link>
        </nav>
      </div>

      {result.items.length ? (
        <div
          className={
            search.view === "grid"
              ? "mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              : "mt-2"
          }
        >
          {result.items.map((item) =>
            search.view === "grid" ? (
              <GridItem key={item.id} item={item} />
            ) : (
              <FeedItem key={item.id} item={item} />
            ),
          )}
        </div>
      ) : (
        <div className="py-20 text-center">
          <h2 className="font-editorial text-3xl font-semibold">
            {hasFilters
              ? "Nenhuma publicação encontrada"
              : "O acervo está sendo preparado"}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {hasFilters
              ? "Revise a pesquisa ou limpe os filtros."
              : "Novas publicações serão adicionadas em breve."}
          </p>
          {hasFilters ? (
            <Link
              href="/publicacoes"
              className="mt-5 inline-block font-interface font-semibold text-primary underline underline-offset-4"
            >
              Limpar filtros
            </Link>
          ) : null}
        </div>
      )}

      {result.pageCount > 1 ? (
        <nav
          aria-label="Paginação"
          className="mt-10 flex items-center justify-center gap-4 font-interface text-sm font-semibold"
        >
          {result.page > 1 ? (
            <Link
              href={searchHref(search, { pagina: result.page - 1 })}
              className="rounded-control border bg-surface px-4 py-3"
            >
              Anterior
            </Link>
          ) : null}
          <span>
            Página {result.page} de {result.pageCount}
          </span>
          {result.page < result.pageCount ? (
            <Link
              href={searchHref(search, { pagina: result.page + 1 })}
              className="rounded-control border bg-surface px-4 py-3"
            >
              Próxima
            </Link>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}

function FilterSelect({
  name,
  label,
  value,
  items,
}: {
  name: string;
  label: string;
  value: string;
  items: { name: string; slug: string }[];
}) {
  return (
    <label className="grid gap-1 font-interface text-xs font-semibold">
      {label}
      <select
        name={name}
        defaultValue={value}
        className="min-h-11 rounded-control border bg-background px-3 text-sm"
      >
        <option value="">Todas</option>
        {items.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
