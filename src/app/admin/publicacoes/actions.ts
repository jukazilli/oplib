"use server";

import { revalidatePath } from "next/cache";

import { requireAdminCommand } from "@/modules/identity/admin";
import { parseDraftInput } from "@/modules/publishing/draft-domain";
import {
  createDraft,
  getDraftById,
  updateDraft,
  type DraftRecord,
} from "@/modules/publishing/draft-repository";

export type DraftActionResult =
  | { status: "success"; draft: SerializedDraft }
  | { status: "conflict"; draft: SerializedDraft | null; message: string }
  | { status: "error"; message: string; field?: "title" | "markdown" };

export type SerializedDraft = Omit<DraftRecord, "updatedAt"> & {
  updatedAt: string;
};

function serializeDraft(draft: DraftRecord): SerializedDraft {
  return { ...draft, updatedAt: draft.updatedAt.toISOString() };
}

export async function saveDraftAction(
  formData: FormData,
): Promise<DraftActionResult> {
  await requireAdminCommand();
  const parsed = parseDraftInput(formData);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0];
    return {
      status: "error",
      field: field === "title" || field === "markdown" ? field : undefined,
      message: issue?.message ?? "Revise os campos e tente novamente.",
    };
  }

  try {
    const { id, version, ...values } = parsed.data;
    const saved = id
      ? version
        ? await updateDraft(id, new Date(version), values)
        : null
      : await createDraft(values);

    if (!saved) {
      const current = id ? await getDraftById(id) : null;
      return {
        status: "conflict",
        draft: current ? serializeDraft(current) : null,
        message: current
          ? "Este rascunho mudou em outra sessão. Escolha qual versão manter."
          : "Este rascunho não está mais disponível.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/publicacoes");
    return { status: "success", draft: serializeDraft(saved) };
  } catch {
    return {
      status: "error",
      message:
        "Não foi possível salvar. Seu texto continua aqui para tentar novamente.",
    };
  }
}
