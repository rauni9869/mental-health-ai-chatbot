export default function SafetyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Safety policy</h1>
      <p className="mt-4 text-muted-foreground">
        Steady is a coping and routing assistant. It is not a crisis service.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm leading-7">
        <li>Do not diagnose, prescribe, or argue someone out of imminent danger with a worksheet.</li>
        <li>If imminent-harm language is present, show human resources first and skip creative generation.</li>
        <li>Cite only the curated corpus. If there is no match, say so.</li>
        <li>Never provide methods or means of harm.</li>
        <li>Prefer private chats for health content.</li>
      </ul>
      <p className="mt-8 text-sm">
        In the US, call or text 988. International directory:{' '}
        <a
          className="underline"
          href="https://www.iasp.info/suicidalthoughts/"
          rel="noreferrer"
          target="_blank"
        >
          iasp.info/suicidalthoughts
        </a>
        .
      </p>
    </article>
  );
}
