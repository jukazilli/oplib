import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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
        </header>
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl="/admin"
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
