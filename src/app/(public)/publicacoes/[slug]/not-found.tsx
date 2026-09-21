import Link from "next/link";

export default function PublicationNotFound() {
  return (
    <section className="mx-auto grid min-h-[60svh] max-w-2xl place-content-center px-5 py-16 text-center">
      <h1 className="font-editorial text-4xl font-semibold">
        Esta publicação não está disponível.
      </h1>
      <Link
        href="/publicacoes"
        className="mt-6 font-interface font-semibold text-primary underline underline-offset-4"
      >
        Voltar ao acervo
      </Link>
    </section>
  );
}
