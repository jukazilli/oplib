import { EyeOff, FileText, Plus, Send, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminOverview } from "@/modules/admin/overview";

const countCards = [
  { key: "published", label: "Publicadas", icon: Send },
  { key: "drafts", label: "Rascunhos", icon: FileText },
  { key: "withdrawn", label: "Retiradas", icon: Undo2 },
  { key: "hiddenComments", label: "Comentários ocultos", icon: EyeOff },
] as const;

function formatCommentDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminOverviewContent({
  overview,
}: {
  overview: AdminOverview;
}) {
  return (
    <>
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-interface text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Visão geral
          </p>
          <h1 className="mt-3 font-editorial text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
            Acervo
          </h1>
        </div>
        <Button
          disabled
          className="w-full gap-2 sm:w-auto"
          title="Disponível em breve"
        >
          <Plus aria-hidden="true" className="size-4" />
          Nova publicação
        </Button>
      </section>

      <section
        aria-label="Resumo do acervo"
        className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {countCards.map(({ key, label, icon: Icon }) => (
          <article key={key} className="rounded-card border bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-muted-foreground">
                {label}
              </p>
              <Icon aria-hidden="true" className="size-4 text-primary" />
            </div>
            <p className="mt-5 font-editorial text-4xl font-medium tabular-nums">
              {overview.counts[key]}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-card border bg-surface p-5 sm:p-7">
        <h2 className="font-editorial text-2xl font-medium">
          Comentários recentes
        </h2>
        {overview.recentComments.length === 0 ? (
          <div className="py-12 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground"
            >
              <FileText className="size-5" />
            </span>
            <p className="mt-4 font-semibold">Nenhum comentário ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Os comentários mais recentes aparecerão aqui.
            </p>
          </div>
        ) : (
          <ul className="mt-5 divide-y">
            {overview.recentComments.map((comment) => (
              <li key={comment.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold">{comment.authorName}</p>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={comment.createdAt.toISOString()}
                  >
                    {formatCommentDate(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {comment.body}
                </p>
                <p className="mt-2 text-xs font-semibold text-primary">
                  {comment.postTitle}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export function AdminOverviewError() {
  return (
    <section className="rounded-card border bg-surface p-6 sm:p-8" role="alert">
      <p className="font-interface text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        Visão geral
      </p>
      <h1 className="mt-3 font-editorial text-4xl font-medium">
        Não foi possível carregar o acervo
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Atualize a página para tentar novamente.
      </p>
    </section>
  );
}
