export function SafetyBanner() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-2">
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-950 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-50">
        Steady is not therapy, diagnosis, or emergency care. If you might be in
        danger, contact local emergency services.{' '}
        <a
          className="underline underline-offset-2"
          href="https://www.iasp.info/suicidalthoughts/"
          rel="noreferrer"
          target="_blank"
        >
          Find a local crisis line
        </a>
        . In the US, call or text 988.
      </div>
    </div>
  );
}
