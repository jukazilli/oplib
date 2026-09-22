"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <section role="alert" className="rounded-card border bg-surface p-6 sm:p-8">
      <h1
        ref={titleRef}
        tabIndex={-1}
        className="font-editorial text-3xl font-medium outline-none sm:text-4xl"
      >
        Não foi possível carregar esta área
      </h1>
      <p className="mt-3 font-interface text-sm text-muted-foreground">
        Tente novamente. Seu endereço atual será mantido.
      </p>
      <Button type="button" className="mt-6" onClick={retry}>
        Tentar novamente
      </Button>
    </section>
  );
}
