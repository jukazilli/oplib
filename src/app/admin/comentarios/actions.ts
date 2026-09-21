"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { logEvent } from "@/lib/observability/logger";
import { requireAdminCommand } from "@/modules/identity/admin";
import { changeCommentVisibility } from "@/modules/interactions/moderation/repository";

const commandSchema = z.object({
  id: z.uuid(),
  intent: z.enum(["hide", "restore"]),
});
export type ModerationResult =
  | { status: "success"; visibility: "visible" | "hidden"; message: string }
  | { status: "conflict" | "error"; message: string };

export async function changeCommentVisibilityAction(
  input: unknown,
): Promise<ModerationResult> {
  const { userId } = await requireAdminCommand();
  const parsed = commandSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Ação inválida." };
  try {
    const changed = await changeCommentVisibility(
      parsed.data.id,
      parsed.data.intent,
      userId,
    );
    if (!changed)
      return {
        status: "conflict",
        message:
          "Este comentário mudou em outra sessão. Atualize a página antes de tentar novamente.",
      };
    try {
      revalidatePath("/admin");
      if (changed.slug) revalidatePath(`/publicacoes/${changed.slug}`);
    } catch {
      logEvent({
        level: "error",
        event: "comments.cache_invalidation",
        correlationId: randomUUID(),
        module: "comments",
        result: "retry_required",
        errorCode: "CACHE_INVALIDATION_FAILED",
      });
    }
    return {
      status: "success",
      visibility: changed.status,
      message:
        parsed.data.intent === "hide"
          ? "Comentário ocultado."
          : "Comentário restaurado.",
    };
  } catch {
    return {
      status: "error",
      message: "Não foi possível alterar o comentário. Tente novamente.",
    };
  }
}
