"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdminCommand } from "@/modules/identity/admin";
import { logEvent } from "@/lib/observability/logger";
import {
  parseDraftInput,
  parsePublishInput,
} from "@/modules/publishing/draft-domain";
import {
  createDraft,
  getAdminPublicationById,
  getDraftById,
  publishPublication,
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

export type PublishActionResult =
  | {
      status: "success";
      publication: SerializedDraft;
      publicUrl: string;
      warning?: string;
    }
  | { status: "conflict"; message: string }
  | { status: "error"; message: string; field?: string };

export async function publishPublicationAction(
  formData: FormData,
  expectedStatus: "draft" | "published",
): Promise<PublishActionResult> {
  const { userId: administratorId } = await requireAdminCommand();
  const parsed = parsePublishInput(formData);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      status: "error",
      field: String(issue?.path[0] ?? ""),
      message: issue?.message ?? "Revise a publicação antes de continuar.",
    };
  }
  if (expectedStatus !== "draft" && expectedStatus !== "published")
    return { status: "error", message: "Ação inválida." };

  try {
    const { id, version, ...values } = parsed.data;
    const previous = await getAdminPublicationById(id);
    const publication = await publishPublication(
      id,
      new Date(version),
      values,
      administratorId,
      expectedStatus,
    );
    if (!publication)
      return {
        status: "conflict",
        message:
          "Esta publicação mudou em outra sessão. Reabra para revisar a versão atual.",
      };
    let warning: string | undefined;
    try {
      revalidatePath("/admin");
      revalidatePath("/admin/publicacoes");
      revalidatePath("/");
      revalidatePath("/publicacoes");
      if (previous?.slug && previous.slug !== publication.slug)
        revalidatePath(`/publicacoes/${previous.slug}`);
      revalidatePath(`/publicacoes/${publication.slug}`);
    } catch {
      warning =
        "Publicação salva. A atualização da visualização pode demorar; recarregue a página antes de tentar novamente.";
      logEvent({
        level: "error",
        event: "publishing.cache_invalidation",
        correlationId: randomUUID(),
        module: "publishing",
        result: "retry_required",
        errorCode: "CACHE_INVALIDATION_FAILED",
      });
    }
    return {
      status: "success",
      publication: serializeDraft(publication),
      publicUrl: `/publicacoes/${publication.slug}`,
      warning,
    };
  } catch {
    return {
      status: "error",
      message:
        "Não foi possível concluir. Seu texto continua aqui para tentar novamente.",
    };
  }
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
