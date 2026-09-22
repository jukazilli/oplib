import { PublicFooter } from "@/components/editorial/public-footer";
import { PublicHeader } from "@/components/editorial/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-control bg-surface px-4 py-3 font-interface font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Ir para o conteúdo
      </a>
      <PublicHeader />
      <main id="conteudo" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
