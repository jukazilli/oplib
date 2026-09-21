import Link from "next/link";
import type { AdminComment } from "@/modules/admin/comments";
import { CommentModerationAction } from "@/components/admin/comment-moderation-action";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});
const filters = [
  { value: "all", label: "Todos" },
  { value: "visible", label: "Visíveis" },
  { value: "hidden", label: "Ocultos" },
] as const;

export function AdminCommentsList({
  comments,
  status,
  hasMore,
}: {
  comments: AdminComment[];
  status: "all" | "visible" | "hidden";
  hasMore: boolean;
}) {
  const last = comments.at(-1);
  const next = last ? `${last.createdAt.toISOString()}_${last.id}` : null;
  return (
    <section>
      <h1 className="font-editorial text-4xl font-medium tracking-tight sm:text-5xl">
        Comentários
      </h1>
      <nav
        aria-label="Filtrar comentários"
        className="mt-8 flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <Link
            key={filter.value}
            href={`/admin/comentarios?status=${filter.value}`}
            aria-current={status === filter.value ? "page" : undefined}
            className={`rounded-control border px-4 py-2 font-interface text-sm font-semibold ${status === filter.value ? "border-primary bg-muted text-foreground" : "text-muted-foreground hover:border-primary"}`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>
      {comments.length ? (
        <ul className="mt-6 divide-y rounded-card border bg-surface px-5 sm:px-7">
          {comments.map((comment) => (
            <li key={comment.id} className="py-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-interface text-sm">
                <strong>{comment.authorName}</strong>
                <time
                  dateTime={comment.createdAt.toISOString()}
                  className="text-muted-foreground"
                >
                  {dateFormatter.format(comment.createdAt)}
                </time>
              </div>
              <p className="mt-3 font-interface text-sm leading-6 break-words whitespace-pre-wrap">
                {comment.body}
              </p>
              <p className="mt-3 font-interface text-sm text-muted-foreground">
                Em{" "}
                <Link
                  href={`/admin/publicacoes?draft=${comment.postId}`}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  {comment.postTitle}
                </Link>
              </p>
              <CommentModerationAction
                id={comment.id}
                initialStatus={comment.status}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-card border bg-surface p-8 font-interface text-muted-foreground">
          {status === "all"
            ? "Ainda não há comentários."
            : `Nenhum comentário ${status === "visible" ? "visível" : "oculto"}.`}
        </p>
      )}
      {hasMore && next ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-control border px-4 font-interface text-sm font-semibold"
          href={`/admin/comentarios?status=${status}&before=${encodeURIComponent(next)}`}
        >
          Mais comentários
        </Link>
      ) : null}
    </section>
  );
}

export function AdminCommentsError() {
  return (
    <section role="alert" className="rounded-card border bg-surface p-8">
      <h1 className="font-editorial text-3xl">
        Não foi possível carregar os comentários
      </h1>
      <p className="mt-3 font-interface text-muted-foreground">
        Atualize a página para tentar novamente.
      </p>
    </section>
  );
}
