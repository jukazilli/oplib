import { UserButton } from "@clerk/nextjs";

import { requireAdmin } from "@/modules/identity/admin";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <span className="font-interface text-xs font-bold tracking-[0.2em]">
          OPALIB
        </span>
        <UserButton />
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <p className="font-interface text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Administração
        </p>
        <h1 className="mt-4 font-editorial text-5xl font-medium tracking-[-0.04em]">
          Acervo
        </h1>
      </main>
    </div>
  );
}
