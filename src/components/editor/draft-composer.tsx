"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

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
}: {
  initialDraft: SerializedDraft | null;
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

  const key = useMemo(() => storageKey(id), [id]);

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

  return (
    <section aria-labelledby="draft-title" className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-interface text-xs font-bold tracking-[0.14em] text-primary uppercase">
            Publicações
          </p>
          <h1
            id="draft-title"
            className="mt-2 text-3xl font-semibold sm:text-4xl"
          >
            {id ? "Editar rascunho" : "Nova publicação"}
          </h1>
        </div>
        {id ? (
          <Button asChild variant="secondary">
            <Link href="/admin/publicacoes">Novo rascunho</Link>
          </Button>
        ) : null}
      </header>

      {recovery ? (
        <div
          className="rounded-card border border-primary/30 bg-muted p-4"
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

      <div className="rounded-card border bg-surface shadow-sm">
        <div className="grid gap-5 p-5 sm:p-7">
          <label
            className="grid gap-2 font-interface text-sm font-semibold"
            htmlFor="draft-post-title"
          >
            Título
            <input
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
              rows={18}
              aria-invalid={fieldError === "markdown"}
              onChange={(event) => changeMarkdown(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter")
                  save();
              }}
              className="min-h-80 resize-y rounded-control border bg-background p-4 font-mono text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
