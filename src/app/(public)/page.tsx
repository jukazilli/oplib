export default function HomePage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <span className="font-interface text-xs font-bold tracking-[0.2em]">
          OPALIB
        </span>
        <span className="bg-opal-gradient h-px w-12" aria-hidden="true" />
      </header>
      <main className="mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-7xl content-center gap-8 px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-2 font-interface text-xs font-semibold tracking-wide text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1.5">
            Engenharia de Software
          </span>
          <span className="rounded-full border border-border px-3 py-1.5">
            Educação Física
          </span>
          <span className="rounded-full border border-border px-3 py-1.5">
            Interdisciplinar
          </span>
        </div>
        <div className="max-w-4xl">
          <h1 className="font-editorial text-5xl leading-[0.98] font-medium tracking-[-0.04em] text-balance sm:text-7xl lg:text-8xl">
            Conhecimento que atravessa áreas.
          </h1>
          <p className="mt-6 max-w-2xl font-interface text-base leading-7 text-muted-foreground sm:text-lg">
            Artigos para explorar ideias entre ciência, tecnologia e movimento.
          </p>
        </div>
      </main>
    </div>
  );
}
