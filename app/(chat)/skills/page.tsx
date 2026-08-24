import { COPING_SKILLS } from '@/lib/wellness/skills';
import Link from 'next/link';

export default function SkillsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Skills you can do now</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One skill at a time. These are coping tools, not treatment.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {Object.values(COPING_SKILLS).map((skill) => (
          <li className="rounded-2xl border bg-background p-4" key={skill.id}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-medium">{skill.name}</h2>
              <span className="text-xs text-muted-foreground">
                ~{skill.minutes} min
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{skill.bestFor}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-6">
              {skill.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">{skill.caution}</p>
          </li>
        ))}
      </ul>
      <Link className="text-sm underline underline-offset-2" href="/breathe">
        Open the box-breathing timer
      </Link>
    </div>
  );
}
