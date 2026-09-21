"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  ImageIcon,
  Plus,
  Settings2,
  Tags,
  Trash2,
  X,
} from "lucide-react";

import {
  saveDraftAction,
  type SerializedDraft,
} from "@/app/admin/publicacoes/actions";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/editor/markdown-content";
import { adminSignInUrl } from "@/modules/identity/redirect";
import {
  CoverValidationError,
  validateCoverFile,
} from "@/modules/media/cover-policy";
import type {
  DraftCover,
  DraftReference,
  DraftValues,
} from "@/modules/publishing/draft-repository";
import { markdownWarnings } from "@/modules/publishing/markdown";
import type { TaxonomyCollection } from "@/modules/taxonomy/repository";

type LocalDraft = {
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  contentType: DraftValues["contentType"];
  areaIds: string[];
  categoryId: string;
  tagIds: string[];
  course: string;
  discipline: string;
  originalDate: string;
  references: DraftReference[];
  cover: DraftCover | null;
  baseUpdatedAt: string;
  savedLocallyAt: string;
};

const newDraftKey = "oplib:draft:new";
const emptyTaxonomy: TaxonomyCollection = {
  areas: [],
  categories: [],
  tags: [],
};
const contentTypeLabels: Record<
  Exclude<DraftValues["contentType"], "">,
  string
> = {
  academic_work: "Trabalho acadêmico",
  article: "Artigo",
  research: "Pesquisa",
  study: "Estudo",
  reflection: "Reflexão",
  project: "Projeto",
};

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
  const [slug, setSlug] = useState(initialDraft?.slug ?? "");
  const [summary, setSummary] = useState(initialDraft?.summary ?? "");
  const [markdown, setMarkdown] = useState(initialDraft?.markdown ?? "");
  const [contentType, setContentType] = useState<DraftValues["contentType"]>(
    initialDraft?.contentType ?? "",
  );
  const [areaIds, setAreaIds] = useState(initialDraft?.areaIds ?? []);
  const [categoryId, setCategoryId] = useState(initialDraft?.categoryId ?? "");
  const [tagIds, setTagIds] = useState(initialDraft?.tagIds ?? []);
  const [course, setCourse] = useState(initialDraft?.course ?? "");
  const [discipline, setDiscipline] = useState(initialDraft?.discipline ?? "");
  const [originalDate, setOriginalDate] = useState(
    initialDraft?.originalDate ?? "",
  );
  const [references, setReferences] = useState(initialDraft?.references ?? []);
  const [cover, setCover] = useState(initialDraft?.cover ?? null);
  const [classificationOpen, setClassificationOpen] = useState(false);
  const [metadataOpen, setMetadataOpen] = useState(false);
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
  const persistedCoverPathnameRef = useRef(
    initialDraft?.cover?.pathname ?? null,
  );
  const classificationRef = useRef<HTMLDivElement>(null);
  const classificationToolbarRef = useRef<HTMLButtonElement>(null);
  const classificationDialogRef = useRef<HTMLElement>(null);
  const metadataDialogRef = useRef<HTMLElement>(null);

  const key = useMemo(() => storageKey(id), [id]);
  const previewWarnings = useMemo(() => markdownWarnings(markdown), [markdown]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const dialog = classificationOpen
      ? classificationDialogRef.current
      : metadataOpen
        ? metadataDialogRef.current
        : null;
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    dialog
      .querySelector<HTMLElement>("button, select, textarea, input")
      ?.focus();
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex="0"]',
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
    document.addEventListener("keydown", keepFocus);
    return () => {
      document.removeEventListener("keydown", keepFocus);
      previousFocus?.focus();
    };
  }, [classificationOpen, metadataOpen]);

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
      if (metadataOpen) {
        setMetadataOpen(false);
        return;
      }
      if (discardIntent) {
        setDiscardIntent(null);
        return;
      }
      if (dirty) setDiscardIntent({ kind: "close" });
      else onClose?.();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [dirty, discardIntent, metadataOpen, onClose]);

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
      local.slug === slug &&
      local.summary === summary &&
      local.markdown === markdown &&
      local.contentType === contentType &&
      JSON.stringify(local.areaIds) === JSON.stringify(areaIds) &&
      local.categoryId === categoryId &&
      JSON.stringify(local.tagIds) === JSON.stringify(tagIds) &&
      local.course === course &&
      local.discipline === discipline &&
      local.originalDate === originalDate &&
      JSON.stringify(local.references) === JSON.stringify(references) &&
      JSON.stringify(local.cover) === JSON.stringify(cover)
    )
      return;

    const recoveryTimer = window.setTimeout(() => {
      if (local.baseUpdatedAt === version) {
        setTitle(local.title);
        setSlug(local.slug ?? "");
        setSummary(local.summary ?? "");
        setMarkdown(local.markdown);
        setContentType(local.contentType ?? "");
        setAreaIds(local.areaIds ?? []);
        setCategoryId(local.categoryId ?? "");
        setTagIds(local.tagIds ?? []);
        setCover(local.cover ?? null);
        setCourse(local.course ?? "");
        setDiscipline(local.discipline ?? "");
        setOriginalDate(local.originalDate ?? "");
        setReferences(local.references ?? []);
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
      slug,
      summary,
      markdown,
      contentType,
      areaIds,
      categoryId,
      tagIds,
      cover,
      course,
      discipline,
      originalDate,
      references,
      baseUpdatedAt: version,
      savedLocallyAt: new Date().toISOString(),
    };
    window.localStorage.setItem(key, JSON.stringify(local));
  }, [
    areaIds,
    categoryId,
    contentType,
    course,
    cover,
    dirty,
    discipline,
    key,
    markdown,
    originalDate,
    references,
    slug,
    summary,
    tagIds,
    title,
    version,
  ]);

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
    setSlug(local.slug ?? "");
    setSummary(local.summary ?? "");
    setMarkdown(local.markdown);
    setContentType(local.contentType ?? "");
    setAreaIds(local.areaIds ?? []);
    setCategoryId(local.categoryId ?? "");
    setTagIds(local.tagIds ?? []);
    setCover(local.cover ?? null);
    setCourse(local.course ?? "");
    setDiscipline(local.discipline ?? "");
    setOriginalDate(local.originalDate ?? "");
    setReferences(local.references ?? []);
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
    formData.set("slug", slug);
    formData.set("summary", summary);
    formData.set("markdown", markdown);
    formData.set("contentType", contentType);
    for (const areaId of areaIds) formData.append("areaIds", areaId);
    formData.set("categoryId", categoryId);
    for (const tagId of tagIds) formData.append("tagIds", tagId);
    formData.set("course", course);
    formData.set("discipline", discipline);
    formData.set("originalDate", originalDate);
    formData.set("references", JSON.stringify(references));
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
        setSlug(result.draft.slug);
        persistedCoverPathnameRef.current =
          result.draft.cover?.pathname ?? null;
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
            slug,
            summary,
            markdown,
            contentType,
            areaIds,
            categoryId,
            tagIds,
            cover,
            course,
            discipline,
            originalDate,
            references,
            baseUpdatedAt: result.draft.updatedAt,
            savedLocallyAt: new Date().toISOString(),
          });
          setTitle(result.draft.title);
          setSlug(result.draft.slug);
          setSummary(result.draft.summary);
          setMarkdown(result.draft.markdown);
          setContentType(result.draft.contentType);
          setAreaIds(result.draft.areaIds);
          setCategoryId(result.draft.categoryId);
          setTagIds(result.draft.tagIds);
          setCover(result.draft.cover);
          setCourse(result.draft.course);
          setDiscipline(result.draft.discipline);
          setOriginalDate(result.draft.originalDate);
          setReferences(result.draft.references);
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

  async function cleanupTransientCover(candidate: DraftCover | null) {
    if (!candidate || candidate.pathname === persistedCoverPathnameRef.current)
      return;
    try {
      await fetch("/api/admin/covers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: candidate.pathname }),
      });
    } catch {
      // Cleanup remains retryable server-side and must not discard the editor.
    }
  }

  async function coverDimensions(file: File) {
    if (typeof createImageBitmap !== "function") return null;
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dimensions;
    } catch {
      return null;
    }
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
      const previousCover = cover;
      const blob = await upload(prepared.pathname, file, {
        access: "public",
        contentType: file.type,
        handleUploadUrl: "/api/admin/covers",
      });
      const dimensions = await coverDimensions(file);
      setCover({
        pathname: blob.pathname,
        url: blob.url,
        altText: "",
        contentType: file.type,
        sizeBytes: file.size,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
      });
      void cleanupTransientCover(previousCover);
      markChanged("Capa anexada. Descreva a imagem antes de salvar.");
    } catch (error) {
      setMessage(
        error instanceof CoverValidationError
          ? error.message
          : "Não foi possível enviar a imagem. A publicação ainda pode ser salva sem capa.",
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
    void cleanupTransientCover(cover);
    setDiscardIntent(null);
    setDirty(false);
    if (intent.kind === "navigate") window.location.assign(intent.href);
    else onClose?.();
  }

  return (
    <section
      aria-labelledby="draft-title"
      className="flex h-svh min-h-0 flex-col overflow-hidden"
    >
      <header className="relative z-10 flex min-h-18 shrink-0 items-center gap-2 border-b bg-surface px-3 sm:px-7">
        <button
          type="button"
          onClick={closeComposer}
          className="min-h-11 font-interface text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
        <h2
          id="draft-title"
          className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 font-interface text-base font-bold sm:block"
        >
          {id ? "Editar publicação" : "Nova publicação"}
        </h2>
        <div className="ml-auto flex items-center text-muted-foreground">
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
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted hover:text-foreground disabled:opacity-50 sm:size-11"
          >
            <ImageIcon aria-hidden="true" className="size-5" />
          </button>
          <button
            ref={classificationToolbarRef}
            type="button"
            onClick={() => setClassificationOpen((open) => !open)}
            aria-label="Classificação"
            title="Classificação"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted hover:text-foreground sm:size-11"
          >
            <Tags aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setMetadataOpen((open) => !open)}
            aria-expanded={metadataOpen}
            aria-label="Detalhes da publicação"
            title="Detalhes da publicação"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted hover:text-foreground sm:size-11"
          >
            <Settings2 aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={onOpenDrafts}
            aria-label="Rascunhos"
            title="Rascunhos"
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted hover:text-foreground sm:size-11"
          >
            <FileText aria-hidden="true" className="size-5" />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
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
              <Button
                type="button"
                variant="secondary"
                onClick={keepServerCopy}
              >
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
                  {areaIds.length || categoryId || tagIds.length
                    ? `${areaIds.length + (categoryId ? 1 : 0) + tagIds.length} classificações`
                    : "Adicionar taxonomia"}
                </button>
                {classificationOpen ? (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 p-4"
                    onPointerDown={(event) => {
                      if (event.target === event.currentTarget)
                        setClassificationOpen(false);
                    }}
                  >
                    <section
                      ref={classificationDialogRef}
                      role="dialog"
                      aria-modal="true"
                      aria-label="Taxonomia"
                      className="max-h-[calc(100svh-2rem)] w-full max-w-96 overflow-y-auto rounded-card border bg-surface p-5 shadow-xl"
                    >
                      {taxonomy.areas.length ? (
                        <fieldset className="mb-4">
                          <legend className="font-interface text-sm font-semibold">
                            Áreas
                          </legend>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {taxonomy.areas.map((area) => (
                              <button
                                key={area.id}
                                type="button"
                                aria-pressed={areaIds.includes(area.id)}
                                onClick={() => {
                                  setAreaIds((current) =>
                                    current.includes(area.id)
                                      ? current.filter((id) => id !== area.id)
                                      : [...current, area.id],
                                  );
                                  markChanged();
                                }}
                                className="rounded-full border bg-background px-3 py-1.5 font-interface text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                              >
                                {area.name}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      ) : null}
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
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex items-center gap-2 font-interface text-sm md:hidden">
                <span className="font-semibold text-foreground">
                  {mobilePane === "write" ? "Composição" : "Prévia"}
                </span>
                <span className="text-muted-foreground">
                  {mobilePane === "write" ? "1 de 2" : "2 de 2"}
                </span>
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
                          void cleanupTransientCover(cover);
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

                  <div>
                    {metadataOpen ? (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/55 p-4"
                        onPointerDown={(event) => {
                          if (event.target === event.currentTarget)
                            setMetadataOpen(false);
                        }}
                      >
                        <section
                          ref={metadataDialogRef}
                          role="dialog"
                          aria-modal="true"
                          aria-label="Detalhes da publicação"
                          className="max-h-[calc(100svh-2rem)] w-full max-w-2xl overflow-y-auto rounded-card border bg-surface p-5 text-foreground shadow-xl"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-1 font-interface text-sm font-semibold sm:col-span-2">
                              Resumo
                              <textarea
                                value={summary}
                                maxLength={600}
                                rows={3}
                                onChange={(event) => {
                                  setSummary(event.target.value);
                                  markChanged();
                                }}
                                placeholder="Apresente a ideia central"
                                className="composer-field resize-none border-0 border-b bg-transparent py-2 font-normal outline-none"
                              />
                            </label>
                            <label className="grid gap-1 font-interface text-sm font-semibold">
                              Tipo
                              <select
                                value={contentType}
                                onChange={(event) => {
                                  setContentType(
                                    event.target
                                      .value as DraftValues["contentType"],
                                  );
                                  markChanged();
                                }}
                                className="min-h-11 border-0 border-b bg-transparent font-normal outline-none"
                              >
                                <option value="">Não definido</option>
                                <option value="academic_work">
                                  Trabalho acadêmico
                                </option>
                                <option value="article">Artigo</option>
                                <option value="research">Pesquisa</option>
                                <option value="study">Estudo</option>
                                <option value="reflection">Reflexão</option>
                                <option value="project">Projeto</option>
                              </select>
                            </label>
                            <label className="grid gap-1 font-interface text-sm font-semibold">
                              Data original
                              <input
                                type="date"
                                value={originalDate}
                                onChange={(event) => {
                                  setOriginalDate(event.target.value);
                                  markChanged();
                                }}
                                className="min-h-11 border-0 border-b bg-transparent font-normal outline-none"
                              />
                            </label>
                            <label className="grid gap-1 font-interface text-sm font-semibold">
                              Curso
                              <input
                                value={course}
                                maxLength={180}
                                onChange={(event) => {
                                  setCourse(event.target.value);
                                  markChanged();
                                }}
                                className="min-h-11 border-0 border-b bg-transparent font-normal outline-none"
                              />
                            </label>
                            <label className="grid gap-1 font-interface text-sm font-semibold">
                              Disciplina
                              <input
                                value={discipline}
                                maxLength={180}
                                onChange={(event) => {
                                  setDiscipline(event.target.value);
                                  markChanged();
                                }}
                                className="min-h-11 border-0 border-b bg-transparent font-normal outline-none"
                              />
                            </label>
                            <label className="grid gap-1 font-interface text-sm font-semibold sm:col-span-2">
                              Endereço permanente
                              <span className="flex items-center border-b font-normal">
                                <span className="text-muted-foreground">
                                  /publicacoes/
                                </span>
                                <input
                                  value={slug}
                                  maxLength={260}
                                  onChange={(event) => {
                                    setSlug(event.target.value);
                                    markChanged();
                                  }}
                                  placeholder="gerado pelo título ao salvar"
                                  className="min-h-11 min-w-0 flex-1 border-0 bg-transparent outline-none"
                                />
                              </span>
                            </label>
                          </div>

                          <div className="mt-6 border-t pt-4">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-interface text-sm font-bold">
                                Referências e links
                              </h3>
                              <button
                                type="button"
                                onClick={() => {
                                  setReferences((current) => [
                                    ...current,
                                    {
                                      id: "",
                                      kind: "bibliography",
                                      title: "",
                                      citation: "",
                                      url: "",
                                    },
                                  ]);
                                  markChanged();
                                }}
                                className="flex min-h-10 items-center gap-1 rounded-full px-3 font-interface text-sm font-semibold hover:bg-muted"
                              >
                                <Plus aria-hidden="true" className="size-4" />
                                Adicionar
                              </button>
                            </div>
                            <div className="mt-3 grid gap-4">
                              {references.map((reference, index) => (
                                <fieldset
                                  key={`${reference.id}-${index}`}
                                  className="grid gap-3 border-t pt-3 first:border-t-0 first:pt-0"
                                >
                                  <legend className="sr-only">
                                    Referência {index + 1}
                                  </legend>
                                  <div className="flex items-center gap-2">
                                    <select
                                      aria-label={`Tipo da referência ${index + 1}`}
                                      value={reference.kind}
                                      onChange={(event) => {
                                        setReferences((current) =>
                                          current.map((item, itemIndex) =>
                                            itemIndex === index
                                              ? {
                                                  ...item,
                                                  kind: event.target
                                                    .value as DraftReference["kind"],
                                                }
                                              : item,
                                          ),
                                        );
                                        markChanged();
                                      }}
                                      className="min-h-10 flex-1 border-0 border-b bg-transparent font-interface text-sm"
                                    >
                                      <option value="bibliography">
                                        Bibliografia
                                      </option>
                                      <option value="related_link">
                                        Link relacionado
                                      </option>
                                    </select>
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      aria-label={`Mover referência ${index + 1} para cima`}
                                      onClick={() => {
                                        setReferences((current) => {
                                          const next = [...current];
                                          const [moving] = next.splice(
                                            index,
                                            1,
                                          );
                                          if (moving)
                                            next.splice(index - 1, 0, moving);
                                          return next;
                                        });
                                        markChanged();
                                      }}
                                      className="flex size-10 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
                                    >
                                      <ArrowUp
                                        aria-hidden="true"
                                        className="size-4"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === references.length - 1}
                                      aria-label={`Mover referência ${index + 1} para baixo`}
                                      onClick={() => {
                                        setReferences((current) => {
                                          const next = [...current];
                                          const [moving] = next.splice(
                                            index,
                                            1,
                                          );
                                          if (moving)
                                            next.splice(index + 1, 0, moving);
                                          return next;
                                        });
                                        markChanged();
                                      }}
                                      className="flex size-10 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
                                    >
                                      <ArrowDown
                                        aria-hidden="true"
                                        className="size-4"
                                      />
                                    </button>
                                    <button
                                      type="button"
                                      aria-label={`Remover referência ${index + 1}`}
                                      onClick={() => {
                                        setReferences((current) =>
                                          current.filter(
                                            (_, itemIndex) =>
                                              itemIndex !== index,
                                          ),
                                        );
                                        markChanged();
                                      }}
                                      className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
                                    >
                                      <Trash2
                                        aria-hidden="true"
                                        className="size-4"
                                      />
                                    </button>
                                  </div>
                                  {(["title", "citation", "url"] as const).map(
                                    (field) => (
                                      <input
                                        key={field}
                                        aria-label={`${field === "title" ? "Título" : field === "citation" ? "Citação" : "Endereço"} da referência ${index + 1}`}
                                        value={reference[field]}
                                        placeholder={
                                          field === "title"
                                            ? "Título"
                                            : field === "citation"
                                              ? "Citação"
                                              : "https://"
                                        }
                                        onChange={(event) => {
                                          setReferences((current) =>
                                            current.map((item, itemIndex) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    [field]: event.target.value,
                                                  }
                                                : item,
                                            ),
                                          );
                                          markChanged();
                                        }}
                                        className="min-h-10 border-0 border-b bg-transparent font-interface text-sm outline-none"
                                      />
                                    ),
                                  )}
                                </fieldset>
                              ))}
                            </div>
                          </div>
                        </section>
                      </div>
                    ) : null}
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
                  {summary ||
                  contentType ||
                  course ||
                  discipline ||
                  originalDate ? (
                    <div className="mb-6 border-b pb-5">
                      {contentType ? (
                        <p className="font-interface text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
                          {contentTypeLabels[contentType]}
                        </p>
                      ) : null}
                      {summary ? (
                        <p className="mt-2 font-editorial text-xl leading-8">
                          {summary}
                        </p>
                      ) : null}
                      {[course, discipline, originalDate].filter(Boolean)
                        .length ? (
                        <p className="mt-3 font-interface text-sm text-muted-foreground">
                          {[course, discipline, originalDate]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  {markdown.trim() ? (
                    <MarkdownContent markdown={markdown} linksEnabled={false} />
                  ) : (
                    <p className="font-editorial text-lg text-muted-foreground">
                      A prévia aparecerá aqui.
                    </p>
                  )}
                  {references.length ? (
                    <section
                      className="mt-8 border-t pt-5"
                      aria-label="Referências"
                    >
                      <h3 className="font-editorial text-2xl font-semibold">
                        Referências
                      </h3>
                      <ol className="mt-3 grid gap-3 pl-5 font-interface text-sm text-muted-foreground">
                        {references.map((reference, index) => (
                          <li
                            key={`${reference.id}-${index}`}
                            className="list-decimal"
                          >
                            <span className="font-semibold text-foreground">
                              {reference.title || "Referência sem título"}
                            </span>
                            {reference.citation
                              ? ` — ${reference.citation}`
                              : ""}
                            {reference.url ? ` — ${reference.url}` : ""}
                          </li>
                        ))}
                      </ol>
                    </section>
                  ) : null}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-surface px-5 py-4 sm:px-7">
        <p
          aria-live="polite"
          className="min-w-0 flex-1 truncate font-interface text-sm text-muted-foreground"
        >
          {message}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {mobilePane === "preview" ? (
            <Button
              type="button"
              variant="secondary"
              className="md:hidden"
              onClick={() => setMobilePane("write")}
            >
              Voltar
            </Button>
          ) : null}
          <Button type="button" disabled={isPending || !dirty} onClick={save}>
            {isPending ? "Salvando…" : "Salvar rascunho"}
          </Button>
          {mobilePane === "write" ? (
            <Button
              type="button"
              variant="secondary"
              className="md:hidden"
              onClick={() => setMobilePane("preview")}
            >
              Avançar
            </Button>
          ) : null}
        </div>
      </footer>

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
