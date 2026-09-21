"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { FileText, ImageIcon, Tags, X } from "lucide-react";

import {
  saveDraftAction,
  type SerializedDraft,
} from "@/app/admin/publicacoes/actions";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/editor/markdown-content";
import { adminSignInUrl } from "@/modules/identity/redirect";
import { validateCoverFile } from "@/modules/media/cover-policy";
import type { DraftCover } from "@/modules/publishing/draft-repository";
import { markdownWarnings } from "@/modules/publishing/markdown";
import type { TaxonomyCollection } from "@/modules/taxonomy/repository";

type LocalDraft = {
  title: string;
  markdown: string;
  categoryId: string;
  tagIds: string[];
  cover: DraftCover | null;
  baseUpdatedAt: string;
  savedLocallyAt: string;
};

const newDraftKey = "oplib:draft:new";
const emptyTaxonomy: TaxonomyCollection = { categories: [], tags: [] };

function storageKey(id: string) {
  return id ? `oplib:draft:${id}` : newDraftKey;
}

export function DraftComposer({
  initialDraft,
  onClose,
  onOpenDrafts,
  taxonomy = emptyTaxonomy,
}: {
  initialDraft: SerializedDraft | null;
  onClose?: () => void;
  onOpenDrafts?: () => void;
  taxonomy?: TaxonomyCollection;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [id, setId] = useState(initialDraft?.id ?? "");
  const [version, setVersion] = useState(initialDraft?.updatedAt ?? "");
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [markdown, setMarkdown] = useState(initialDraft?.markdown ?? "");
  const [categoryId, setCategoryId] = useState(initialDraft?.categoryId ?? "");
  const [tagIds, setTagIds] = useState(initialDraft?.tagIds ?? []);
  const [cover, setCover] = useState(initialDraft?.cover ?? null);
  const [classificationOpen, setClassificationOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mobilePane, setMobilePane] = useState<"write" | "preview">("write");
  const [discardIntent, setDiscardIntent] = useState<
    { kind: "close" } | { kind: "navigate"; href: string } | null
  >(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState<"title" | "markdown" | null>(
    null,
  );
  const [recovery, setRecovery] = useState<LocalDraft | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const classificationRef = useRef<HTMLDivElement>(null);
  const classificationToolbarRef = useRef<HTMLButtonElement>(null);

  const key = useMemo(() => storageKey(id), [id]);
  const previewWarnings = useMemo(() => markdownWarnings(markdown), [markdown]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!classificationOpen) return;
    const closeClassification = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopImmediatePropagation();
          setClassificationOpen(false);
        }
        return;
      }
      if (
        event.target instanceof Node &&
        !classificationRef.current?.contains(event.target) &&
        !classificationToolbarRef.current?.contains(event.target)
      )
        setClassificationOpen(false);
    };
    document.addEventListener("pointerdown", closeClassification);
    document.addEventListener("keydown", closeClassification);
    return () => {
      document.removeEventListener("pointerdown", closeClassification);
      document.removeEventListener("keydown", closeClassification);
    };
  }, [classificationOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (discardIntent) {
        setDiscardIntent(null);
        return;
      }
      if (dirty) setDiscardIntent({ kind: "close" });
      else onClose?.();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dirty, discardIntent, onClose]);

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
    if (
      local.title === title &&
      local.markdown === markdown &&
      local.categoryId === categoryId &&
      JSON.stringify(local.tagIds) === JSON.stringify(tagIds) &&
      JSON.stringify(local.cover) === JSON.stringify(cover)
    )
      return;

    const recoveryTimer = window.setTimeout(() => {
      if (local.baseUpdatedAt === version) {
        setTitle(local.title);
        setMarkdown(local.markdown);
        setCategoryId(local.categoryId ?? "");
        setTagIds(local.tagIds ?? []);
        setCover(local.cover ?? null);
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
      categoryId,
      tagIds,
      cover,
      baseUpdatedAt: version,
      savedLocallyAt: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(local));
  }, [categoryId, cover, dirty, key, markdown, tagIds, title, version]);

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const guardLinks = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
      setDiscardIntent({ kind: "navigate", href: anchor.href });
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
    setCategoryId(local.categoryId ?? "");
    setTagIds(local.tagIds ?? []);
    setCover(local.cover ?? null);
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
    formData.set("categoryId", categoryId);
    for (const tagId of tagIds) formData.append("tagIds", tagId);
    if (cover) formData.set("cover", JSON.stringify(cover));
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
            categoryId,
            tagIds,
            cover,
            baseUpdatedAt: result.draft.updatedAt,
            savedLocallyAt: new Date().toISOString(),
          });
          setTitle(result.draft.title);
          setMarkdown(result.draft.markdown);
          setCategoryId(result.draft.categoryId);
          setTagIds(result.draft.tagIds);
          setCover(result.draft.cover);
          setVersion(result.draft.updatedAt);
        }
        return;
      }
      setMessage(result.message);
      setFieldError(result.field ?? null);
    });
  }

  function markChanged(nextMessage = "Alterações não salvas") {
    setDirty(true);
    setMessage(nextMessage);
    setFieldError(null);
  }

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
    markChanged();
  }

  async function attachCover(file: File) {
    setIsUploading(true);
    setMessage("Enviando capa…");
    try {
      await validateCoverFile(file);
      const pathnameResponse = await fetch("/api/admin/covers/pathname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type }),
      });
      const prepared = (await pathnameResponse.json()) as {
        pathname?: string;
        error?: string;
      };
      if (pathnameResponse.status === 401) {
        window.location.assign(adminSignInUrl(window.location.pathname, true));
        return;
      }
      if (!pathnameResponse.ok || !prepared.pathname)
        throw new Error(prepared.error ?? "Não foi possível preparar o envio.");
      const blob = await upload(prepared.pathname, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/admin/covers",
      });
      setCover({
        pathname: blob.pathname,
        url: blob.url,
        altText: "",
        contentType: file.type,
        sizeBytes: file.size,
        width: null,
        height: null,
      });
      markChanged("Capa anexada. Descreva a imagem antes de salvar.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a capa.",
      );
    } finally {
      setIsUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  }

  function closeComposer() {
    if (dirty) setDiscardIntent({ kind: "close" });
    else onClose?.();
  }

  function discardChanges() {
    if (!discardIntent) return;
    window.localStorage.removeItem(key);
    window.localStorage.removeItem(newDraftKey);
    const intent = discardIntent;
    setDiscardIntent(null);
    setDirty(false);
    if (intent.kind === "navigate") window.location.assign(intent.href);
    else onClose?.();
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

      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-3 sm:gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground font-interface text-xs font-bold text-background">
            OP
          </span>
          <div className="min-w-0 flex-1 border-l pl-4">
            <div
              ref={classificationRef}
              className="relative flex flex-wrap items-center gap-x-2 gap-y-1"
            >
              <input
                ref={titleInputRef}
                id="draft-post-title"
                aria-label="Título"
                placeholder="Título da publicação"
                value={title}
                maxLength={240}
                aria-invalid={fieldError === "title"}
                onChange={(event) => changeTitle(event.target.value)}
                className="composer-field min-w-48 flex-1 border-0 bg-transparent font-interface text-base font-bold outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:bg-muted/30 focus-visible:ring-0"
              />
              <span aria-hidden="true" className="text-muted-foreground">
                ›
              </span>
              <button
                type="button"
                onClick={() => setClassificationOpen((open) => !open)}
                aria-expanded={classificationOpen}
                className="min-h-10 rounded-full px-2 font-interface text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {categoryId || tagIds.length
                  ? `${(categoryId ? 1 : 0) + tagIds.length} classificações`
                  : "Adicionar taxonomia"}
              </button>
              {classificationOpen ? (
                <section
                  aria-label="Taxonomia"
                  className="absolute top-full right-0 z-20 mt-2 w-[min(24rem,calc(100vw-4rem))] rounded-card border bg-surface p-4 shadow-xl"
                >
                  <label className="grid gap-2 font-interface text-sm font-semibold">
                    Categoria
                    <select
                      value={categoryId}
                      onChange={(event) => {
                        setCategoryId(event.target.value);
                        markChanged();
                      }}
                      className="min-h-11 rounded-control border bg-background px-3 font-normal"
                    >
                      <option value="">Sem categoria</option>
                      {taxonomy.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {taxonomy.tags.length ? (
                    <fieldset className="mt-4">
                      <legend className="font-interface text-sm font-semibold">
                        Tags
                      </legend>
                      <div className="mt-2 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                        {taxonomy.tags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            aria-pressed={tagIds.includes(tag.id)}
                            onClick={() => toggleTag(tag.id)}
                            className="rounded-full border bg-background px-3 py-1.5 font-interface text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}
                </section>
              ) : null}
            </div>

            <div
              role="tablist"
              aria-label="Modo do editor"
              className="mt-3 grid grid-cols-2 rounded-full bg-muted p-1 md:hidden"
            >
              {(["write", "preview"] as const).map((pane) => (
                <button
                  key={pane}
                  type="button"
                  role="tab"
                  aria-selected={mobilePane === pane}
                  onClick={() => setMobilePane(pane)}
                  className="min-h-10 rounded-full px-4 font-interface text-sm font-semibold text-muted-foreground aria-selected:bg-surface aria-selected:text-foreground aria-selected:shadow-sm"
                >
                  {pane === "write" ? "Escrever" : "Prévia"}
                </button>
              ))}
            </div>

            <div className="mt-3 md:grid md:grid-cols-2 md:gap-6">
              <div
                className={
                  mobilePane === "preview" ? "hidden md:block" : "block"
                }
              >
                <p className="mb-3 hidden font-interface text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase md:block">
                  Escrever
                </p>
                <textarea
                  id="draft-markdown"
                  aria-label="Conteúdo"
                  placeholder="Comece a escrever…"
                  value={markdown}
                  rows={10}
                  aria-invalid={fieldError === "markdown"}
                  onChange={(event) => changeMarkdown(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      (event.ctrlKey || event.metaKey) &&
                      event.key === "Enter"
                    )
                      save();
                  }}
                  className="composer-field min-h-72 w-full resize-none border-0 bg-transparent p-0 font-editorial text-lg leading-8 outline-none placeholder:text-muted-foreground focus-visible:bg-muted/20 focus-visible:ring-0"
                />

                {cover ? (
                  <div className="relative mt-4 overflow-hidden rounded-card border">
                    <Image
                      src={cover.url}
                      alt=""
                      width={960}
                      height={540}
                      className="h-auto max-h-72 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCover(null);
                        markChanged("Capa removida.");
                      }}
                      aria-label="Remover capa"
                      className="absolute top-2 right-2 flex size-10 items-center justify-center rounded-full bg-background/90 shadow"
                    >
                      <X aria-hidden="true" className="size-5" />
                    </button>
                    <label className="block border-t bg-background p-3 font-interface text-sm font-semibold">
                      Texto alternativo
                      <input
                        value={cover.altText}
                        onChange={(event) => {
                          setCover({ ...cover, altText: event.target.value });
                          markChanged();
                        }}
                        placeholder="Descreva o conteúdo da imagem"
                        maxLength={300}
                        className="composer-field mt-1 min-h-10 w-full border-0 bg-transparent font-normal outline-none focus-visible:bg-muted/30"
                      />
                    </label>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-1 text-muted-foreground">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    aria-label="Selecionar imagem de capa"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void attachCover(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploading}
                    aria-label={cover ? "Substituir capa" : "Adicionar capa"}
                    title={cover ? "Substituir capa" : "Adicionar capa"}
                    className="flex size-11 items-center justify-center rounded-full hover:bg-muted hover:text-foreground disabled:opacity-50"
                  >
                    <ImageIcon aria-hidden="true" className="size-5" />
                  </button>
                  <button
                    ref={classificationToolbarRef}
                    type="button"
                    onClick={() => setClassificationOpen((open) => !open)}
                    aria-label="Classificação"
                    title="Classificação"
                    className="flex size-11 items-center justify-center rounded-full hover:bg-muted hover:text-foreground"
                  >
                    <Tags aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>

              <section
                role="tabpanel"
                aria-label="Prévia"
                className={
                  mobilePane === "write"
                    ? "hidden md:block md:border-l md:pl-6"
                    : "block md:border-l md:pl-6"
                }
              >
                <p className="mb-3 hidden font-interface text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase md:block">
                  Prévia
                </p>
                {previewWarnings.length ? (
                  <div
                    className="mb-4 rounded-control bg-muted p-3"
                    role="status"
                  >
                    {previewWarnings.map((warning) => (
                      <p
                        key={warning}
                        className="font-interface text-sm text-muted-foreground"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                ) : null}
                {markdown.trim() ? (
                  <MarkdownContent markdown={markdown} linksEnabled={false} />
                ) : (
                  <p className="font-editorial text-lg text-muted-foreground">
                    A prévia aparecerá aqui.
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
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

      {discardIntent ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-foreground/55 p-5">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="discard-title"
            aria-describedby="discard-description"
            className="w-full max-w-md rounded-card border bg-surface p-6 shadow-2xl"
          >
            <h3
              id="discard-title"
              className="font-editorial text-2xl font-semibold"
            >
              Alterações não salvas
            </h3>
            <p
              id="discard-description"
              className="mt-2 text-sm leading-6 text-muted-foreground"
            >
              Se você fechar agora, as alterações desta composição serão
              descartadas.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={discardChanges}
              >
                Descartar alterações
              </Button>
              <Button
                type="button"
                autoFocus
                onClick={() => setDiscardIntent(null)}
              >
                Continuar editando
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
