"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FileText } from "lucide-react";

import {
  saveDraftAction,
  type SerializedDraft,
} from "@/app/admin/publicacoes/actions";
import { Button } from "@/components/ui/button";

type LocalDraft = {
  title: string;
  markdown: string;
  baseUpdatedAt: string;
  savedLocallyAt: string;
};

const newDraftKey = "oplib:draft:new";

function storageKey(id: string) {
  return id ? `oplib:draft:${id}` : newDraftKey;
}

export function DraftComposer({
  initialDraft,
  onClose,
  onOpenDrafts,
}: {
  initialDraft: SerializedDraft | null;
  onClose?: () => void;
  onOpenDrafts?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [id, setId] = useState(initialDraft?.id ?? "");
  const [version, setVersion] = useState(initialDraft?.updatedAt ?? "");
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [markdown, setMarkdown] = useState(initialDraft?.markdown ?? "");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState<"title" | "markdown" | null>(
    null,
  );
  const [recovery, setRecovery] = useState<LocalDraft | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const key = useMemo(() => storageKey(id), [id]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (
        dirty &&
        !window.confirm(
          "Existem alterações não salvas. Deseja fechar mesmo assim?",
        )
      )
        return;
      onClose?.();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dirty, onClose]);

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    let local: LocalDraft;
    try {
      local = JSON.parse(raw) as LocalDraft;
    } catch {
      window.localStorage.removeItem(key);
      return;
    }
    if (local.title === title && local.markdown === markdown) return;

    const recoveryTimer = window.setTimeout(() => {
      if (local.baseUpdatedAt === version) {
        setTitle(local.title);
        setMarkdown(local.markdown);
        setDirty(true);
        setMessage("Cópia local recuperada.");
      } else {
        setRecovery(local);
        setMessage("Há uma cópia local de outra versão.");
      }
    }, 0);
    return () => window.clearTimeout(recoveryTimer);
    // Recovery is intentionally evaluated once for the loaded server version.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!dirty) return;
    const local: LocalDraft = {
      title,
      markdown,
      baseUpdatedAt: version,
      savedLocallyAt: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(local));
  }, [dirty, key, markdown, title, version]);

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const guardLinks = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("a[href]")) return;
      if (
        !window.confirm(
          "Existem alterações não salvas. Deseja sair mesmo assim?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", guardLinks, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", guardLinks, true);
    };
  }, [dirty]);

  function changeTitle(value: string) {
    setTitle(value);
    setDirty(true);
    setMessage("Alterações não salvas");
    setFieldError(null);
  }

  function changeMarkdown(value: string) {
    setMarkdown(value);
    setDirty(true);
    setMessage("Alterações não salvas");
    setFieldError(null);
  }

  function restoreLocalCopy(local: LocalDraft) {
    setTitle(local.title);
    setMarkdown(local.markdown);
    setDirty(true);
    setRecovery(null);
    setMessage("Cópia local recuperada.");
  }

  function keepServerCopy() {
    window.localStorage.removeItem(key);
    setRecovery(null);
    setDirty(false);
    setMessage("Versão salva mantida.");
  }

  function save() {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("version", version);
    formData.set("title", title);
    formData.set("markdown", markdown);
    setMessage("Salvando…");
    setFieldError(null);

    startTransition(async () => {
      const result = await saveDraftAction(formData);
      if (result.status === "success") {
        window.localStorage.removeItem(key);
        window.localStorage.removeItem(newDraftKey);
        setId(result.draft.id);
        setVersion(result.draft.updatedAt);
        setDirty(false);
        setRecovery(null);
        setMessage(
          `Salvo às ${new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(result.draft.updatedAt))}`,
        );
        router.replace(`/admin/publicacoes?draft=${result.draft.id}`);
        router.refresh();
        return;
      }
      if (result.status === "conflict") {
        setMessage(result.message);
        if (result.draft) {
          setRecovery({
            title,
            markdown,
            baseUpdatedAt: result.draft.updatedAt,
            savedLocallyAt: new Date().toISOString(),
          });
          setTitle(result.draft.title);
          setMarkdown(result.draft.markdown);
          setVersion(result.draft.updatedAt);
        }
        return;
      }
      setMessage(result.message);
      setFieldError(result.field ?? null);
    });
  }

  function closeComposer() {
    if (
      dirty &&
      !window.confirm(
        "Existem alterações não salvas. Deseja fechar mesmo assim?",
      )
    )
      return;
    onClose?.();
  }

  return (
    <section aria-labelledby="draft-title">
      <header className="flex min-h-18 items-center justify-between gap-4 border-b px-5 sm:px-7">
        <button
          type="button"
          onClick={closeComposer}
          className="min-h-11 font-interface text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
        <h2 id="draft-title" className="font-interface text-base font-bold">
          {id ? "Editar publicação" : "Nova publicação"}
        </h2>
        <button
          type="button"
          onClick={onOpenDrafts}
          aria-label="Rascunhos"
          title="Rascunhos"
          className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <FileText aria-hidden="true" className="size-5" />
        </button>
      </header>

      {recovery ? (
        <div
          className="m-5 rounded-card border border-primary/30 bg-muted p-4 sm:m-7"
          role="alert"
        >
          <p className="font-interface text-sm font-semibold">
            Escolha a versão para continuar
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => restoreLocalCopy(recovery)}
            >
              Recuperar minha cópia
            </Button>
            <Button type="button" variant="secondary" onClick={keepServerCopy}>
              Manter versão salva
            </Button>
          </div>
        </div>
      ) : null}

      <div>
        <div className="grid gap-5 p-5 sm:p-7">
          <label
            className="grid gap-2 font-interface text-sm font-semibold"
            htmlFor="draft-post-title"
          >
            Título
            <input
              ref={titleInputRef}
              id="draft-post-title"
              value={title}
              maxLength={240}
              aria-invalid={fieldError === "title"}
              onChange={(event) => changeTitle(event.target.value)}
              className="min-h-12 rounded-control border bg-background px-4 font-editorial text-lg font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <label
            className="grid gap-2 font-interface text-sm font-semibold"
            htmlFor="draft-markdown"
          >
            Conteúdo
            <textarea
              id="draft-markdown"
              value={markdown}
              rows={12}
              aria-invalid={fieldError === "markdown"}
              onChange={(event) => changeMarkdown(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter")
                  save();
              }}
              className="min-h-64 resize-y rounded-control border bg-background p-4 font-mono text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4 sm:px-7">
          <p
            aria-live="polite"
            className="font-interface text-sm text-muted-foreground"
          >
            {message}
          </p>
          <Button type="button" disabled={isPending || !dirty} onClick={save}>
            {isPending ? "Salvando…" : "Salvar rascunho"}
          </Button>
        </footer>
      </div>
    </section>
  );
}
