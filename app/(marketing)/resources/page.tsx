const resources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    detail: 'US · Call or text 988, 24/7',
    href: 'https://988lifeline.org',
  },
  {
    name: 'IASP local resources',
    detail: 'Find a crisis line by country',
    href: 'https://www.iasp.info/suicidalthoughts/',
  },
  {
    name: 'NIMH anxiety overview',
    detail: 'Public psychoeducation on anxiety disorders',
    href: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
  },
  {
    name: 'WHO depression fact sheet',
    detail: 'What depression is, and when to seek care',
    href: 'https://www.who.int/news-room/fact-sheets/detail/depression',
  },
  {
    name: 'SAMHSA find help',
    detail: 'US treatment and helpline directory',
    href: 'https://www.samhsa.gov/find-help',
  },
  {
    name: 'NHS panic disorder',
    detail: 'What a panic attack is, and what to do',
    href: 'https://www.nhs.uk/mental-health/conditions/panic-disorder/',
  },
];

export default function ResourcesPage() {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Trusted resources</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        These are public health pages and crisis services. Steady cites a
        subset of them in-session. They are not a substitute for your own
        clinician.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <a
            className="rounded-2xl border bg-white p-5 hover:border-emerald-800 dark:bg-zinc-900"
            href={resource.href}
            key={resource.href}
            rel="noreferrer"
            target="_blank"
          >
            <div className="font-medium">{resource.name}</div>
            <p className="mt-1 text-sm text-muted-foreground">{resource.detail}</p>
          </a>
        ))}
      </div>
    </article>
  );
}
