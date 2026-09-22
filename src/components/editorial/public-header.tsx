"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/", label: "Início" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/areas", label: "Áreas" },
  { href: "/sobre", label: "Sobre" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="OPALIB — Início"
          className="mr-auto font-interface text-xs font-bold tracking-[0.2em]"
        >
          OPALIB
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={
                    isCurrent(pathname, link.href) ? "page" : undefined
                  }
                  className="block rounded-control px-3 py-2 font-interface text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/publicacoes?busca="
          aria-label="Pesquisar"
          aria-current={pathname === "/pesquisa" ? "page" : undefined}
          className="flex min-h-11 items-center gap-2 rounded-control px-3 font-interface text-sm font-semibold hover:bg-muted"
        >
          <Search aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Pesquisar</span>
        </Link>

        <Link
          href="/publicacoes"
          aria-current={
            isCurrent(pathname, "/publicacoes") ? "page" : undefined
          }
          className="min-h-11 items-center rounded-control px-3 font-interface text-sm font-semibold hover:bg-muted max-md:flex md:hidden"
        >
          Publicações
        </Link>

        <details className="relative md:hidden">
          <summary
            aria-label="Abrir menu"
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-control hover:bg-muted"
          >
            <Menu aria-hidden="true" className="size-5" />
          </summary>
          <nav
            aria-label="Mais destinos"
            className="absolute top-12 right-0 z-30 min-w-44 rounded-control border bg-surface p-1 shadow-lg"
          >
            {primaryLinks
              .filter((link) => link.href !== "/publicacoes")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    isCurrent(pathname, link.href) ? "page" : undefined
                  }
                  className="block min-h-10 rounded-md px-3 py-2 font-interface text-sm font-semibold hover:bg-muted aria-[current=page]:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
