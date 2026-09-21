"use client";

import { ArrowLeft, FileText, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  changePublicationFeatureAction,
  changePublicationStatusAction,
  type SerializedDraft,
} from "@/app/admin/publicacoes/actions";
import { Button } from "@/components/ui/button";
import { DraftComposer } from "@/components/editor/draft-composer";
import type { TaxonomyCollection } from "@/modules/taxonomy/repository";

export type SerializedAdminPublication = SerializedDraft & {
  summary: string;
  status: "draft" | "published" | "withdrawn";
  featured: boolean;
};

const statusLabels = {
  draft: "Rascunho",
  published: "Publicada",
  withdrawn: "Retirada do ar",
} as const;

export function PublicationsWorkspace({
  initialDraft,
  publications,
  taxonomy = { areas: [], categories: [], tags: [] },
}: {
  initialDraft: SerializedAdminPublication | null;
  publications: SerializedAdminPublication[];
  taxonomy?: TaxonomyCollection;
}) {
  const router = useRouter();
  const [composerDraft, setComposerDraft] = useState(initialDraft);
  const [composerOpen, setComposerOpen] = useState(Boolean(initialDraft));
  const [modalView, setModalView] = useState<"composer" | "drafts">("composer");
  const [statusIntent, setStatusIntent] = useState<{
    publication: SerializedAdminPublication;
    intent: "withdraw" | "republish";
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isStatusPending, startStatusTransition] = useTransition();
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

  function openComposer(draft: SerializedAdminPublication | null) {
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

  function confirmStatusChange() {
    if (!statusIntent || isStatusPending) return;
    const { publication, intent } = statusIntent;
    startStatusTransition(async () => {
      const result = await changePublicationStatusAction({
        id: publication.id,
        version: publication.updatedAt,
        intent,
      });
      setStatusMessage(result.message);
      if (result.status === "success") {
        setStatusIntent(null);
        router.refresh();
      }
    });
  }

  function requestStatusChange(
    publication: SerializedAdminPublication,
    intent: "withdraw" | "republish",
  ) {
    setStatusMessage("");
    setStatusIntent({ publication, intent });
  }

  function changeFeature(publication: SerializedAdminPublication) {
    if (isStatusPending) return;
    setStatusMessage(
      publication.featured ? "Removendo destaque…" : "Destacando…",
    );
    startStatusTransition(async () => {
      const result = await changePublicationFeatureAction({
        id: publication.id,
        version: publication.updatedAt,
        featured: !publication.featured,
      });
      setStatusMessage(result.message);
      if (result.status === "success") router.refresh();
    });
  }

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

      {statusMessage ? (
        <p
          role="status"
          className="mb-4 rounded-control border bg-surface px-4 py-3 font-interface text-sm text-muted-foreground"
        >
          {statusMessage}
        </p>
      ) : null}

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
                    {publication.featured &&
                    publication.status === "published" ? (
                      <span className="font-semibold text-primary">
                        Destaque
                      </span>
                    ) : null}
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
                  {publication.status === "draft" ||
                  publication.status === "published" ? (
                    <button
                      type="button"
                      onClick={() => openComposer(publication)}
                      className="min-h-10 w-full rounded-md px-3 text-left font-interface text-sm font-semibold hover:bg-muted"
                    >
                      Editar
                    </button>
                  ) : null}
                  {publication.status === "published" ? (
                    <button
                      type="button"
                      disabled={isStatusPending}
                      onClick={() => changeFeature(publication)}
                      className="min-h-10 w-full rounded-md px-3 text-left font-interface text-sm font-semibold hover:bg-muted disabled:opacity-50"
                    >
                      {publication.featured ? "Remover destaque" : "Destacar"}
                    </button>
                  ) : null}
                  {publication.status === "published" ? (
                    <button
                      type="button"
                      onClick={() =>
                        requestStatusChange(publication, "withdraw")
                      }
                      className="min-h-10 w-full rounded-md px-3 text-left font-interface text-sm font-semibold hover:bg-muted"
                    >
                      Retirar do ar
                    </button>
                  ) : null}
                  {publication.status === "withdrawn" ? (
                    <button
                      type="button"
                      onClick={() =>
                        requestStatusChange(publication, "republish")
                      }
                      className="min-h-10 w-full rounded-md px-3 text-left font-interface text-sm font-semibold hover:bg-muted"
                    >
                      Republicar
                    </button>
                  ) : null}
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
          className={`fixed inset-0 z-50 grid bg-foreground/65 ${modalView === "composer" ? "p-0" : "items-end p-0 sm:place-items-center sm:p-6"}`}
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
            className={
              modalView === "composer"
                ? "h-svh w-screen overflow-hidden bg-surface"
                : "max-h-[95svh] w-full overflow-y-auto rounded-t-[1.5rem] bg-surface shadow-2xl sm:max-w-3xl sm:rounded-[1.5rem]"
            }
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

      {statusIntent ? (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-foreground/55 p-5"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && !isStatusPending)
              setStatusIntent(null);
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="status-change-title"
            aria-describedby="status-change-description"
            className="w-full max-w-md rounded-card border bg-surface p-6 shadow-2xl"
          >
            <h2
              id="status-change-title"
              className="font-editorial text-2xl font-semibold"
            >
              {statusIntent.intent === "withdraw"
                ? "Retirar do ar?"
                : "Republicar?"}
            </h2>
            <p
              id="status-change-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              {statusIntent.intent === "withdraw"
                ? `“${statusIntent.publication.title}” deixará de aparecer no acervo e não poderá ser acessada publicamente.`
                : `“${statusIntent.publication.title}” voltará a ficar disponível no acervo.`}
            </p>
            {statusMessage ? (
              <p role="status" className="mt-3 text-sm text-destructive">
                {statusMessage}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                disabled={isStatusPending}
                onClick={() => setStatusIntent(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={isStatusPending}
                onClick={confirmStatusChange}
                autoFocus
              >
                {isStatusPending
                  ? "Confirmando…"
                  : statusIntent.intent === "withdraw"
                    ? "Retirar do ar"
                    : "Republicar"}
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
