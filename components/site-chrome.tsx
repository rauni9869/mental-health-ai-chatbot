import Link from 'next/link';

const links = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/resources', label: 'Resources' },
  { href: '/safety', label: 'Safety' },
  { href: '/crisis-card', label: 'Crisis card' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[hsl(var(--border))]/80 bg-[hsl(var(--background))]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-semibold tracking-tight" href="/">
          <span className="flex size-8 items-center justify-center rounded-full bg-emerald-800 text-sm text-emerald-50">
            S
          </span>
          Steady
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {links.map((link) => (
            <Link className="hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-900"
            href="/app"
          >
            Open companion
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="font-semibold">Steady</div>
          <p className="mt-2 text-sm text-emerald-100/80">
            Between-session support. Not therapy, not emergency care, not a
            diagnosis.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium">Product</div>
          <div className="mt-2 flex flex-col gap-1 text-emerald-100/80">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/resources">Resource library</Link>
            <Link href="/safety">Safety policy</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/crisis-card">Crisis card</Link>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">If you are in danger</div>
          <p className="mt-2 text-emerald-100/80">
            Call local emergency services. In the US, call or text 988.{' '}
            <a
              className="underline"
              href="https://www.iasp.info/suicidalthoughts/"
              rel="noreferrer"
              target="_blank"
            >
              International directory
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
