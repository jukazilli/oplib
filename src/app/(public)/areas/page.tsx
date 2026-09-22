import Link from "next/link";
import type { Metadata } from "next";

import { listPublicAreas } from "@/modules/discovery/publications";

export const metadata: Metadata = {
  title: "Áreas",
  description: "Explore as publicações do OPALIB por área de conhecimento.",
  alternates: { canonical: "/areas" },
};

export default async function AreasPage() {
  let areas: Awaited<ReturnType<typeof listPublicAreas>>;
  try {
    areas = await listPublicAreas();
  } catch {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h1 className="font-editorial text-4xl font-semibold">Áreas</h1>
        <p className="mt-6 text-muted-foreground">
          Não foi possível carregar as áreas agora. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <h1 className="font-editorial text-4xl font-semibold">Áreas</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
        Explore as publicações por área de conhecimento.
      </p>
      {areas.length ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {areas.map((area) => (
            <li key={area.id}>
              <Link
                href={`/publicacoes?area=${encodeURIComponent(area.slug)}`}
                className="flex min-h-24 items-center justify-between gap-5 rounded-card border bg-surface p-6 font-interface hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="text-lg font-semibold">{area.name}</span>
                <span className="text-sm text-muted-foreground">
                  {area.publicationCount}{" "}
                  {area.publicationCount === 1 ? "publicação" : "publicações"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-muted-foreground">
          Nenhuma área publicada ainda.
        </p>
      )}
    </div>
  );
}
