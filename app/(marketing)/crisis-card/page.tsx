import { PrintButton } from '@/components/print-button';

export default function CrisisCardPage() {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-16 print:py-4">
      <div className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-zinc-900 print:border-black print:shadow-none">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-800">
          Keep this nearby
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
          If I am in danger
        </h1>
        <ol className="mt-8 space-y-4 text-sm leading-7">
          <li>
            <strong>1.</strong> If I might act on a plan to die or I am not safe
            right now, I call local emergency services.
          </li>
          <li>
            <strong>2.</strong> In the United States I call or text{' '}
            <strong>988</strong>.
          </li>
          <li>
            <strong>3.</strong> Outside the US I use{' '}
            <a
              className="underline"
              href="https://www.iasp.info/suicidalthoughts/"
              rel="noreferrer"
              target="_blank"
            >
              iasp.info/suicidalthoughts
            </a>
            .
          </li>
          <li>
            <strong>4.</strong> I do not ask an AI for methods, means, or
            whether life is worth living. I talk to a human.
          </li>
        </ol>
        <p className="mt-8 text-xs text-muted-foreground">
          Steady is not a crisis line. Print this card and put it on the fridge
          or lock screen.
        </p>
        <PrintButton label="Print this card" />
      </div>
    </article>
  );
}
