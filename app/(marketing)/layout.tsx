import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(40_33%_97%)] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
