"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { changeCommentVisibilityAction } from "@/app/admin/comentarios/actions";

export function CommentModerationAction({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: "visible" | "hidden";
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [undoAvailable, setUndoAvailable] = useState(false);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    },
    [],
  );

  async function change(intent: "hide" | "restore") {
    if (pending) return;
    setPending(true);
    setMessage("");
    try {
      const result = await changeCommentVisibilityAction({ id, intent });
      if (result.status !== "success") {
        setMessage(result.message);
        return;
      }
      setStatus(result.visibility);
      setMessage(result.message);
      if (undoTimer.current) clearTimeout(undoTimer.current);
      if (intent === "hide") {
        setUndoAvailable(true);
        undoTimer.current = setTimeout(() => {
          setUndoAvailable(false);
          router.refresh();
        }, 8000);
      } else {
        setUndoAvailable(false);
        router.refresh();
      }
    } catch {
      setMessage("Não foi possível alterar o comentário. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 font-interface text-sm">
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status === "hidden" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}
      >
        {status === "hidden" ? "Oculto" : "Visível"}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => change(status === "visible" ? "hide" : "restore")}
        className="min-h-11 rounded-control border px-4 font-semibold hover:border-primary disabled:opacity-60"
      >
        {pending
          ? "Salvando…"
          : status === "visible"
            ? "Ocultar comentário"
            : "Restaurar comentário"}
      </button>
      {status === "hidden" && undoAvailable ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => change("restore")}
          className="min-h-11 font-semibold text-primary underline underline-offset-4 disabled:opacity-60"
        >
          Desfazer
        </button>
      ) : null}
      <span aria-live="polite" className="text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
