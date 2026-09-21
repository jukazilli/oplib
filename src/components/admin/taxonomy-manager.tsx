"use client";

import { Search, Tags } from "lucide-react";
import { useActionState } from "react";

import {
  createTaxonomyAction,
  deleteTaxonomyAction,
  renameTaxonomyAction,
} from "@/app/admin/taxonomia/actions";
import { Button } from "@/components/ui/button";
import { initialTaxonomyActionState } from "@/modules/taxonomy/action-state";
import type { TaxonomyKind } from "@/modules/taxonomy/domain";
import type { TaxonomyItem } from "@/modules/taxonomy/repository";

const inputClass =
  "min-h-11 w-full rounded-control border bg-surface px-3 text-sm outline-none focus:border-ring";

function Feedback({ state }: { state: typeof initialTaxonomyActionState }) {
  if (state.status === "idle") return null;
  return (
    <p
      className={
        state.status === "error"
          ? "text-sm text-destructive"
          : "text-sm text-primary"
      }
      role={state.status === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

function CreateForm({ kind }: { kind: TaxonomyKind }) {
  const [state, action, pending] = useActionState(
    createTaxonomyAction,
    initialTaxonomyActionState,
  );
  const noun = kind === "category" ? "categoria" : "tag";
  return (
    <form action={action} className="rounded-card border bg-surface p-5">
      <input type="hidden" name="kind" value={kind} />
      <label className="text-sm font-semibold" htmlFor={`new-${kind}`}>
        Nova {noun}
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={`new-${kind}`}
          name="name"
          className={inputClass}
          maxLength={kind === "tag" ? 80 : 120}
          required
        />
        <Button className="shrink-0" disabled={pending}>
          {pending ? "Criando…" : "Criar"}
        </Button>
      </div>
      <div className="mt-2" aria-live="polite">
        <Feedback state={state} />
      </div>
    </form>
  );
}

function TaxonomyRow({
  item,
  kind,
  alternatives,
}: {
  item: TaxonomyItem;
  kind: TaxonomyKind;
  alternatives: TaxonomyItem[];
}) {
  const [renameState, renameAction, renaming] = useActionState(
    renameTaxonomyAction,
    initialTaxonomyActionState,
  );
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteTaxonomyAction,
    initialTaxonomyActionState,
  );
  const inUse = item.usageCount > 0;

  return (
    <li className="border-t py-5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <p className="font-semibold">{item.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            /{item.slug} · {item.usageCount} publicação(ões)
          </p>
        </div>
        <form
          action={renameAction}
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
        >
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="id" value={item.id} />
          <label className="sr-only" htmlFor={`rename-${item.id}`}>
            Novo nome para {item.name}
          </label>
          <input
            id={`rename-${item.id}`}
            name="name"
            defaultValue={item.name}
            className={inputClass}
            required
          />
          <Button variant="secondary" className="shrink-0" disabled={renaming}>
            {renaming ? "Salvando…" : "Renomear"}
          </Button>
        </form>
      </div>
      <div className="mt-2" aria-live="polite">
        <Feedback state={renameState} />
      </div>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-destructive">
          Excluir
        </summary>
        <form
          action={deleteAction}
          className="mt-3 rounded-control border border-destructive/30 bg-destructive/5 p-4"
        >
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="id" value={item.id} />
          <p className="text-sm font-semibold">Excluir {item.name}?</p>
          {inUse ? (
            <fieldset className="mt-3 space-y-3">
              <legend className="text-sm text-muted-foreground">
                Defina o destino das {item.usageCount} associação(ões).
              </legend>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="strategy"
                  value="replace"
                  defaultChecked={alternatives.length > 0}
                  disabled={alternatives.length === 0}
                />
                Substituir por
                <select
                  name="replacementId"
                  className="min-h-10 min-w-0 flex-1 rounded-control border bg-surface px-2"
                  disabled={alternatives.length === 0}
                >
                  {alternatives.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="strategy"
                  value="remove"
                  defaultChecked={alternatives.length === 0}
                />
                Remover as associações
              </label>
            </fieldset>
          ) : (
            <input type="hidden" name="strategy" value="unlinked" />
          )}
          <div className="mt-4 flex items-center gap-3">
            <Button variant="destructive" disabled={deleting}>
              {deleting ? "Excluindo…" : "Excluir permanentemente"}
            </Button>
          </div>
          <div className="mt-2" aria-live="polite">
            <Feedback state={deleteState} />
          </div>
        </form>
      </details>
    </li>
  );
}

function Collection({
  title,
  kind,
  items,
}: {
  title: string;
  kind: TaxonomyKind;
  items: TaxonomyItem[];
}) {
  return (
    <section
      aria-labelledby={`${kind}-title`}
      className="rounded-card border bg-surface p-5 sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id={`${kind}-title`}
          className="font-editorial text-2xl font-medium"
        >
          {title}
        </h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {items.length}
        </span>
      </div>
      {items.length ? (
        <ul className="mt-5">
          {items.map((item) => (
            <TaxonomyRow
              key={item.id}
              item={item}
              kind={kind}
              alternatives={items.filter(
                (candidate) => candidate.id !== item.id,
              )}
            />
          ))}
        </ul>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nenhum item encontrado.
        </p>
      )}
    </section>
  );
}

export function TaxonomyManager({
  categories,
  tags,
  search,
}: {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
  search: string;
}) {
  return (
    <>
      <header>
        <p className="font-interface text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Acervo
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Tags aria-hidden="true" className="size-7 text-primary" />
          <h1 className="font-editorial text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
            Categorias e tags
          </h1>
        </div>
      </header>

      <form role="search" className="mt-8 max-w-xl">
        <label htmlFor="taxonomy-search" className="text-sm font-semibold">
          Pesquisar
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden="true"
            className="absolute top-3.5 left-3 size-4 text-muted-foreground"
          />
          <input
            id="taxonomy-search"
            name="q"
            defaultValue={search}
            className={`${inputClass} pl-10`}
            placeholder="Nome ou slug"
          />
        </div>
      </form>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CreateForm kind="category" />
        <CreateForm kind="tag" />
      </div>

      <div className="mt-6 grid items-start gap-6 2xl:grid-cols-2">
        <Collection title="Categorias" kind="category" items={categories} />
        <Collection title="Tags" kind="tag" items={tags} />
      </div>
    </>
  );
}
