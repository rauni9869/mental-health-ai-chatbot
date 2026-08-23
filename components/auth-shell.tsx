import Link from 'next/link';
import type { ReactNode } from 'react';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(40_33%_97%)] dark:bg-zinc-950">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-800 text-sm text-emerald-50">
            S
          </span>
          Steady
        </Link>
        <Link className="text-sm text-muted-foreground hover:text-foreground" href="/safety">
          Safety
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 md:items-center">
        <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
