"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export function LikeAction({
  slug,
  initialCount,
  initiallyLiked,
}: {
  slug: string;
  initialCount: number;
  initiallyLiked: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initiallyLiked);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(
    initiallyLiked
      ? "Esta publicação já recebeu uma curtida deste navegador."
      : "",
  );

  async function like() {
    if (pending || liked) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/publications/${encodeURIComponent(slug)}/like`,
        {
          method: "POST",
        },
      );
      const result = (await response.json()) as {
        count?: number;
        alreadyLiked?: boolean;
        message?: string;
      };
      if (!response.ok || result.count === undefined)
        throw new Error(result.message);
      setCount(result.count);
      setLiked(true);
      setMessage(
        result.alreadyLiked
          ? "Esta publicação já recebeu uma curtida deste navegador."
          : "Curtida registrada. Obrigado!",
      );
    } catch {
      setMessage(
        "Não foi possível registrar sua curtida agora. Tente novamente.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={like}
        disabled={pending || liked}
        aria-pressed={liked}
        className="inline-flex min-h-11 items-center gap-2 rounded-control border bg-surface px-4 font-interface text-sm font-semibold hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-70"
      >
        <Heart
          className="size-4"
          fill={liked ? "currentColor" : "none"}
          aria-hidden="true"
        />
        {pending ? "Registrando…" : liked ? "Curtido" : "Curtir"}
        <span aria-label={`${count} ${count === 1 ? "curtida" : "curtidas"}`}>
          {count}
        </span>
      </button>
      <p
        className="mt-2 min-h-5 font-interface text-sm text-muted-foreground"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
