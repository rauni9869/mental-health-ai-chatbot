type KnowledgeOutput = {
  chunks?: Array<{
    title: string;
    sourceName: string;
    sourceUrl: string;
    excerpt: string;
  }>;
  disclaimer?: string;
};

type SkillOutput = {
  id?: string;
  name?: string;
  minutes?: number;
  bestFor?: string;
  steps?: readonly string[];
  caution?: string;
  error?: string;
  available?: readonly string[];
};

type CrisisOutput = {
  region?: string;
  directoryUrl?: string;
  lines?: Array<{ name: string; contact: string }>;
};

type MoodOutput = {
  saved?: boolean;
  mood?: string;
  intensity?: number;
  createdAt?: string;
  reason?: string;
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3 text-sm">
      <div className="mb-2 font-medium">{title}</div>
      {children}
    </div>
  );
}

export function KnowledgeCard({ output }: { output: KnowledgeOutput }) {
  if (!output.chunks?.length) {
    return <Card title="Sources">No grounded excerpt matched that topic.</Card>;
  }

  return (
    <Card title="Grounded sources">
      <div className="flex flex-col gap-3">
        {output.chunks.map((chunk) => (
          <div key={chunk.sourceUrl}>
            <a
              className="font-medium underline underline-offset-2"
              href={chunk.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              {chunk.title}
            </a>
            <div className="text-muted-foreground">{chunk.sourceName}</div>
          </div>
        ))}
        {output.disclaimer ? (
          <div className="text-xs text-muted-foreground">{output.disclaimer}</div>
        ) : null}
      </div>
    </Card>
  );
}

export function SkillCard({ output }: { output: SkillOutput }) {
  if (output.error) {
    return <Card title="Coping skill">{output.error}</Card>;
  }

  return (
    <Card title={output.name ?? 'Coping skill'}>
      {output.bestFor ? (
        <div className="mb-2 text-muted-foreground">Best for: {output.bestFor}</div>
      ) : null}
      <ol className="list-decimal space-y-1 pl-4">
        {(output.steps ?? []).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {output.caution ? (
        <div className="mt-2 text-xs text-muted-foreground">{output.caution}</div>
      ) : null}
    </Card>
  );
}

export function CrisisCard({ output }: { output: CrisisOutput }) {
  return (
    <Card title={`Crisis resources${output.region ? ` · ${output.region}` : ''}`}>
      <ul className="space-y-1">
        {(output.lines ?? []).map((line) => (
          <li key={line.name}>
            <span className="font-medium">{line.name}:</span> {line.contact}
          </li>
        ))}
      </ul>
      {output.directoryUrl ? (
        <a
          className="mt-2 inline-block underline underline-offset-2"
          href={output.directoryUrl}
          rel="noreferrer"
          target="_blank"
        >
          International directory
        </a>
      ) : null}
    </Card>
  );
}

export function MoodCard({ output }: { output: MoodOutput }) {
  if (!output.saved) {
    return <Card title="Check-in">{output.reason ?? 'Check-in was not saved.'}</Card>;
  }

  return (
    <Card title="Check-in saved">
      <div>
        Mood: {output.mood}
        {typeof output.intensity === 'number' ? ` · ${output.intensity}/10` : ''}
      </div>
    </Card>
  );
}
