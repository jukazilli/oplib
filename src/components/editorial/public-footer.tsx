import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mt-auto bg-[#17212b] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <div className="max-w-md">
          <p className="font-interface text-xs font-bold tracking-[0.2em]">
            OPALIB
          </p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Artigos entre ciência, tecnologia e movimento.
          </p>
        </div>
        <nav
          aria-label="Navegação do rodapé"
          className="flex flex-wrap gap-x-5 gap-y-3 font-interface text-sm"
        >
          <Link href="/publicacoes" className="hover:underline">
            Publicações
          </Link>
          <Link href="/areas" className="hover:underline">
            Áreas
          </Link>
          <Link href="/sobre" className="hover:underline">
            Sobre
          </Link>
          <Link href="/privacidade" className="hover:underline">
            Privacidade
          </Link>
        </nav>
      </div>
    </footer>
  );
}
