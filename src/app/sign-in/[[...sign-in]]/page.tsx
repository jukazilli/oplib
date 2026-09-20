import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { safeAdminReturnUrl } from "@/modules/identity/redirect";

type SignInPageProps = {
  searchParams: Promise<{
    reason?: string | string[];
    redirect_url?: string | string[];
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const returnUrl = safeAdminReturnUrl(params.redirect_url);
  const sessionExpired = params.reason === "session_expired";

  return (
    <main className="grid min-h-svh place-items-center px-5 py-12">
      <section className="grid w-full max-w-md gap-8">
        <header className="text-center">
          <Link
            href="/"
            className="font-interface text-xs font-bold tracking-[0.2em]"
          >
            OPALIB
          </Link>
          <h1 className="mt-5 font-editorial text-4xl font-medium tracking-[-0.03em]">
            Acesso administrativo
          </h1>
          {sessionExpired ? (
            <p className="mt-3 text-sm text-muted-foreground" role="status">
              Sessão expirada. Entre novamente.
            </p>
          ) : null}
        </header>
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl={returnUrl}
            appearance={{
              elements: {
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                footerAction: "hidden",
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
