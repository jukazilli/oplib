"use client";

import { ArrowLeft, FileText, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { SerializedDraft } from "@/app/admin/publicacoes/actions";
import { DraftComposer } from "@/components/editor/draft-composer";
import type { TaxonomyCollection } from "@/modules/taxonomy/repository";

export type SerializedAdminPublication = SerializedDraft & {
  summary: string;
  status: "draft" | "published" | "withdrawn";
};

const statusLabels = {
  draft: "Rascunho",
  published: "Publicada",
  withdrawn: "Retirada do ar",
} as const;

export function PublicationsWorkspace({
  initialDraft,
  publications,
  taxonomy = { categories: [], tags: [] },
}: {
  initialDraft: SerializedDraft | null;
  publications: SerializedAdminPublication[];
  taxonomy?: TaxonomyCollection;
}) {
  const router = useRouter();
  const [composerDraft, setComposerDraft] = useState(initialDraft);
  const [composerOpen, setComposerOpen] = useState(Boolean(initialDraft));
  const [modalView, setModalView] = useState<"composer" | "drafts">("composer");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!composerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !modalRef.current) return;
      const controls = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keepFocusInside);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keepFocusInside);
    };
  }, [composerOpen, modalView]);

  function openComposer(draft: SerializedDraft | null) {
    setComposerDraft(draft);
    setComposerOpen(true);
    setModalView("composer");
    router.replace(
      draft ? `/admin/publicacoes?draft=${draft.id}` : "/admin/publicacoes",
    );
  }

  function closeComposer() {
    setComposerOpen(false);
    setComposerDraft(null);
    router.replace("/admin/publicacoes");
    router.refresh();
  }

  function openDraft(draft: SerializedAdminPublication) {
    setComposerDraft(draft);
    setModalView("composer");
    router.replace(`/admin/publicacoes?draft=${draft.id}`);
  }

  const drafts = publications.filter(
    (publication) => publication.status === "draft",
  );

  return (
    <section aria-labelledby="publications-title" className="mx-auto max-w-3xl">
      <header className="mb-7">
        <p className="font-interface text-xs font-bold tracking-[0.14em] text-primary uppercase">
          Acervo
        </p>
        <h1
          id="publications-title"
          className="mt-2 text-3xl font-semibold sm:text-4xl"
        >
          Publicações
        </h1>
      </header>

      <button
        type="button"
        onClick={() => openComposer(null)}
        className="flex min-h-24 w-full items-center gap-4 rounded-card border bg-surface px-5 text-left shadow-sm transition-colors hover:bg-muted focus-visible:outline-none sm:px-7"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground font-interface text-xs font-bold text-background">
          OP
        </span>
        <span className="flex-1 font-interface text-base text-muted-foreground">
          Publique algo em seu acervo
        </span>
        <span className="rounded-control border bg-background px-4 py-2 font-interface text-sm font-semibold text-foreground">
          Criar
        </span>
      </button>

      <div className="mt-7 overflow-hidden rounded-card border bg-surface">
        {publications.length ? (
          publications.map((publication) => (
            <article
              key={publication.id}
              className="relative border-b p-5 last:border-b-0 sm:p-7"
            >
              <div className="flex items-start gap-4 pr-10">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-interface text-xs font-bold">
                  OP
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-interface text-sm">
                    <strong>Seu acervo</strong>
                    <span className="text-muted-foreground">
                      {statusLabels[publication.status]}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <time
                      className="text-muted-foreground"
                      dateTime={publication.updatedAt}
                    >
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "medium",
                      }).format(new Date(publication.updatedAt))}
                    </time>
                  </div>
                  <h2 className="mt-2 font-editorial text-xl font-semibold">
                    {publication.title.trim() || "Rascunho sem título"}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 whitespace-pre-line text-muted-foreground">
                    {publication.summary.trim() ||
                      publication.markdown.trim() ||
                      "Comece a escrever para dar forma a esta publicação."}
                  </p>
                </div>
              </div>

              <details className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <summary
                  aria-label={`Mais ações para ${publication.title.trim() || "rascunho sem título"}`}
                  className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <MoreHorizontal aria-hidden="true" className="size-5" />
                </summary>
                <div className="absolute top-12 right-0 z-10 min-w-36 rounded-control border bg-surface p-1 shadow-lg">
                  {publication.status === "draft" ? (
                    <button
                      type="button"
                      onClick={() => openComposer(publication)}
                      className="min-h-10 w-full rounded-md px-3 text-left font-interface text-sm font-semibold hover:bg-muted"
                    >
                      Editar
                    </button>
                  ) : (
                    <span className="block px-3 py-2 font-interface text-xs text-muted-foreground">
                      Nenhuma ação disponível
                    </span>
                  )}
                </div>
              </details>
            </article>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="font-interface font-semibold">
              Nenhuma publicação ainda
            </p>
            <button
              type="button"
              onClick={() => openComposer(null)}
              className="mt-3 min-h-11 font-interface text-sm font-semibold text-primary"
            >
              Criar a primeira publicação
            </button>
          </div>
        )}
      </div>

      {composerOpen ? (
        <div
          className="fixed inset-0 z-50 grid items-end bg-foreground/65 p-0 sm:place-items-center sm:p-6"
          role="presentation"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              modalView === "drafts"
                ? "Rascunhos"
                : composerDraft
                  ? "Editar publicação"
                  : "Nova publicação"
            }
            className={`max-h-[95svh] w-full overflow-y-auto rounded-t-[1.5rem] bg-surface shadow-2xl sm:rounded-[1.5rem] ${modalView === "composer" ? "sm:max-w-5xl" : "sm:max-w-3xl"}`}
          >
            {modalView === "composer" ? (
              <DraftComposer
                key={composerDraft?.id ?? "new"}
                initialDraft={composerDraft}
                onClose={closeComposer}
                onOpenDrafts={() => setModalView("drafts")}
                taxonomy={taxonomy}
              />
            ) : (
              <section
                aria-labelledby="draft-library-title"
                className="min-h-[34rem]"
              >
                <header className="flex min-h-18 items-center border-b px-5 sm:px-7">
                  <button
                    type="button"
                    onClick={() => setModalView("composer")}
                    aria-label="Voltar ao composer"
                    className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <ArrowLeft aria-hidden="true" className="size-5" />
                  </button>
                  <h2
                    id="draft-library-title"
                    className="flex-1 pr-11 text-center font-interface text-base font-bold"
                  >
                    Rascunhos
                  </h2>
                </header>

                {drafts.length ? (
                  <div className="divide-y">
                    {drafts.map((draft) => (
                      <button
                        key={draft.id}
                        type="button"
                        onClick={() => openDraft(draft)}
                        className="flex w-full items-start gap-4 p-5 text-left hover:bg-muted sm:p-7"
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <FileText aria-hidden="true" className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <strong className="block font-editorial text-lg">
                            {draft.title.trim() || "Rascunho sem título"}
                          </strong>
                          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted-foreground">
                            {draft.markdown.trim() || "Rascunho vazio"}
                          </span>
                          <time
                            dateTime={draft.updatedAt}
                            className="mt-2 block font-interface text-xs text-muted-foreground"
                          >
                            Atualizado em{" "}
                            {new Intl.DateTimeFormat("pt-BR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(draft.updatedAt))}
                          </time>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-96 place-items-center p-8 text-center">
                    <div>
                      <FileText
                        aria-hidden="true"
                        className="mx-auto size-16 text-muted-foreground/60"
                      />
                      <p className="mt-5 font-interface font-semibold">
                        Ainda não há rascunhos
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Seus rascunhos aparecerão aqui.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
