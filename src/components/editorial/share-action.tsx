"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

type ShareState = "idle" | "copied" | "error";

export function ShareAction({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}) {
  const [state, setState] = useState<ShareState>("idle");

  async function share() {
    setState("idle");
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState("error");
    }
  }

  return (
    <div className="mt-10 border-t pt-6">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 items-center gap-2 rounded-control border bg-surface px-4 font-interface text-sm font-semibold hover:border-primary hover:text-primary"
      >
        {state === "copied" ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Share2 className="size-4" aria-hidden="true" />
        )}
        {state === "copied" ? "Link copiado" : "Compartilhar"}
      </button>
      <div className="mt-3 font-interface text-sm" aria-live="polite">
        {state === "error" ? (
          <p className="text-muted-foreground">
            Não foi possível copiar o link. Você ainda pode copiá-lo pela barra
            do navegador.
          </p>
        ) : null}
      </div>
    </div>
  );
}
