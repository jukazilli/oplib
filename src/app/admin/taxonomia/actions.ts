"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdminCommand } from "@/modules/identity/admin";
import type { TaxonomyActionState } from "@/modules/taxonomy/action-state";
import {
  parseTaxonomyName,
  taxonomyKindSchema,
} from "@/modules/taxonomy/domain";
import {
  createTaxonomyItem,
  deleteTaxonomyItem,
  renameTaxonomyItem,
} from "@/modules/taxonomy/repository";

const idSchema = z.string().uuid();

function databaseError(error: unknown): TaxonomyActionState {
  const cause =
    typeof error === "object" && error && "cause" in error
      ? error.cause
      : error;
  if (
    typeof cause === "object" &&
    cause &&
    "code" in cause &&
    cause.code === "23505"
  ) {
    return {
      status: "error",
      field: "name",
      message: "Já existe um item com esse nome ou endereço.",
    };
  }
  return {
    status: "error",
    message: "Não foi possível concluir. Tente novamente.",
  };
}

export async function createTaxonomyAction(
  _state: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  await requireAdminCommand();
  const kindResult = taxonomyKindSchema.safeParse(formData.get("kind"));
  if (!kindResult.success)
    return { status: "error", message: "Tipo inválido." };
  const values = parseTaxonomyName(formData.get("name"), kindResult.data);
  if (!values.success)
    return { status: "error", field: "name", message: values.error };
  try {
    await createTaxonomyItem(kindResult.data, values.data);
    revalidatePath("/admin/taxonomia");
    return {
      status: "success",
      message: `${kindResult.data === "category" ? "Categoria" : "Tag"} criada.`,
    };
  } catch (error) {
    return databaseError(error);
  }
}

export async function renameTaxonomyAction(
  _state: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  await requireAdminCommand();
  const kindResult = taxonomyKindSchema.safeParse(formData.get("kind"));
  const idResult = idSchema.safeParse(formData.get("id"));
  if (!kindResult.success || !idResult.success)
    return { status: "error", message: "Item inválido." };
  const values = parseTaxonomyName(formData.get("name"), kindResult.data);
  if (!values.success)
    return { status: "error", field: "name", message: values.error };
  try {
    const renamed = await renameTaxonomyItem(
      kindResult.data,
      idResult.data,
      values.data,
    );
    if (!renamed) return { status: "error", message: "Item não encontrado." };
    revalidatePath("/admin/taxonomia");
    return { status: "success", message: "Nome atualizado." };
  } catch (error) {
    return databaseError(error);
  }
}

export async function deleteTaxonomyAction(
  _state: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  await requireAdminCommand();
  const parsed = z
    .object({
      kind: taxonomyKindSchema,
      id: idSchema,
      strategy: z.enum(["unlinked", "remove", "replace"]),
      replacementId: z.union([idSchema, z.literal("")]).optional(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { status: "error", message: "Opção de exclusão inválida." };
  try {
    const result = await deleteTaxonomyItem(
      parsed.data.kind,
      parsed.data.id,
      parsed.data.strategy,
      parsed.data.replacementId || undefined,
    );
    if (result.status === "in-use")
      return {
        status: "error",
        field: "replacement",
        message: `Em uso por ${result.usageCount} publicação(ões). Escolha substituir ou remover as associações.`,
      };
    if (result.status === "invalid-replacement")
      return {
        status: "error",
        field: "replacement",
        message: "Escolha outro item para substituir.",
      };
    if (result.status === "not-found")
      return { status: "error", message: "Item não encontrado." };
    revalidatePath("/admin/taxonomia");
    return { status: "success", message: "Item excluído." };
  } catch (error) {
    return databaseError(error);
  }
}
