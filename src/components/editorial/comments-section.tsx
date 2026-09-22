"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicComment } from "@/modules/interactions/comments/contract";

const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function CommentsSection({
  slug,
  initialComments,
}: {
  slug: string;
  initialComments: PublicComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [pending, setPending] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const startedAt = useRef(0);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (!highlightedId) return;
    const timeout = window.setTimeout(() => setHighlightedId(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [highlightedId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      setHasError(true);
      setMessage("Escreva um comentário antes de publicar.");
      bodyRef.current?.focus();
      return;
    }
    if (body.length > 1500) {
      setHasError(true);
      setMessage("Seu comentário ultrapassou o limite de 1.500 caracteres.");
      bodyRef.current?.focus();
      return;
    }
    setPending(true);
    setHasError(false);
    setMessage("");
    const form = new FormData(event.currentTarget);
    let responseMessage = "";
    try {
      const response = await fetch(
        `/api/publications/${encodeURIComponent(slug)}/comments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            authorName,
            body,
            website: form.get("website") ?? "",
            startedAt: startedAt.current,
          }),
        },
      );
      const result = (await response.json()) as {
        comment?: PublicComment;
        message?: string;
      };
      if (!response.ok || !result.comment) {
        responseMessage = result.message ?? "";
        throw new Error("comment_request_failed");
      }
      setComments((current) => [result.comment!, ...current]);
      setHighlightedId(result.comment.id);
      setAuthorName("");
      setBody("");
      startedAt.current = Date.now();
      setHasError(false);
      setMessage("Comentário publicado.");
    } catch {
      setHasError(true);
      setMessage(
        responseMessage ||
          "Não foi possível publicar agora. Seu texto foi preservado para uma nova tentativa.",
      );
      bodyRef.current?.focus();
    } finally {
      setPending(false);
    }
  }

  return (
    <section aria-labelledby="comments-title" className="mt-12 border-t pt-8">
      <h2 id="comments-title" className="font-editorial text-3xl font-semibold">
        Comentários
      </h2>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <label className="grid gap-2 font-interface text-sm font-semibold">
          Nome{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            maxLength={80}
            className="min-h-11 rounded-control border bg-surface px-3 font-normal"
          />
        </label>
        <label className="grid gap-2 font-interface text-sm font-semibold">
          Comentário
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            aria-invalid={hasError}
            aria-describedby="comment-notice comment-count comment-message"
            className="rounded-control border bg-surface p-3 font-normal"
          />
        </label>
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px]"
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="font-interface text-sm text-muted-foreground">
            <p id="comment-notice">
              Seu comentário será publicado imediatamente. Não inclua
              informações pessoais ou sensíveis.
            </p>
            <p id="comment-count">{body.length}/1.500</p>
          </div>
          <button
            disabled={pending}
            className="min-h-11 rounded-control bg-primary px-5 font-interface text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Publicando…" : "Publicar comentário"}
          </button>
        </div>
        <p
          id="comment-message"
          role={hasError ? "alert" : "status"}
          aria-live="polite"
          className="min-h-5 font-interface text-sm text-muted-foreground"
        >
          {message}
        </p>
      </form>
      <div className="mt-8 grid gap-6">
        {comments.length ? (
          comments.map((comment) => (
            <article
              key={comment.id}
              className={`border-l-2 pl-4 ${highlightedId === comment.id ? "border-primary bg-muted/40 py-3 pr-3" : "border-border"}`}
            >
              <header className="flex flex-wrap gap-x-2 font-interface text-sm">
                <strong>{comment.authorName}</strong>
                <time
                  className="text-muted-foreground"
                  dateTime={comment.createdAt}
                >
                  {formatter.format(new Date(comment.createdAt))}
                </time>
              </header>
              <p className="mt-2 font-interface leading-7 whitespace-pre-wrap">
                {comment.body}
              </p>
            </article>
          ))
        ) : (
          <p className="font-interface text-muted-foreground">
            Ainda não há comentários. Você pode iniciar a conversa.
          </p>
        )}
      </div>
    </section>
  );
}
