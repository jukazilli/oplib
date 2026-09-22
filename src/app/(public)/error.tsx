"use client";

import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export default function PublicError({
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
    <section
      role="alert"
      className="mx-auto grid min-h-[60svh] w-full max-w-2xl place-content-center px-5 py-16 text-center"
    >
      <h1
        ref={titleRef}
        tabIndex={-1}
        className="font-editorial text-4xl font-semibold outline-none"
      >
        Não foi possível carregar esta página
      </h1>
      <p className="mt-3 font-interface text-sm text-muted-foreground">
        Tente novamente. O endereço atual será mantido.
      </p>
      <Button type="button" className="mx-auto mt-6" onClick={retry}>
        Tentar novamente
      </Button>
    </section>
  );
}
