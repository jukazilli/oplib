"use client";

import {
  BookOpenText,
  FolderTree,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Settings2,
} from "lucide-react";
import type { ReactNode } from "react";

import { SignOutControl } from "@/components/admin/sign-out-control";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard, available: true },
  { label: "Publicações", icon: BookOpenText, available: false },
  { label: "Nova publicação", icon: Plus, available: false },
  { label: "Categorias e tags", icon: FolderTree, available: false },
  { label: "Comentários", icon: MessageSquareText, available: false },
  { label: "Configurações", icon: Settings2, available: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="border-b bg-surface lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex min-h-20 items-center justify-between px-5 lg:px-7">
          <div>
            <p className="font-interface text-xs font-bold tracking-[0.2em]">
              OPALIB
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Administração</p>
          </div>
          <div className="lg:hidden">
            <SignOutControl compact />
          </div>
        </div>

        <nav
          aria-label="Administração"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-4 lg:pb-4"
        >
          {navigation.map(({ label, icon: Icon, available }) => (
            <span
              key={label}
              aria-current={available ? "page" : undefined}
              aria-disabled={available ? undefined : "true"}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-control px-3 font-interface text-sm font-semibold",
                available
                  ? "bg-muted text-foreground"
                  : "cursor-not-allowed text-muted-foreground opacity-60",
              )}
              title={available ? undefined : "Disponível em uma próxima etapa"}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </span>
          ))}
        </nav>

        <div className="hidden border-t p-4 lg:block">
          <SignOutControl />
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
