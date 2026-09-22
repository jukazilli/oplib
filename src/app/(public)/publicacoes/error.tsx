"use client";

export default function PublicationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-content-center px-5 py-16 text-center">
      <h1 className="font-editorial text-4xl font-semibold">
        Não foi possível carregar as publicações.
      </h1>
      <button
        type="button"
        onClick={reset}
        className="mx-auto mt-6 min-h-11 rounded-control bg-primary px-5 font-interface text-sm font-semibold text-primary-foreground"
      >
        Tentar novamente
      </button>
    </section>
  );
}
