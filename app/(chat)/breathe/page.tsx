import { BreathingExercise } from '@/components/breathing-exercise';
import Link from 'next/link';

export default function BreathePage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Box breathing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A two-minute reset you can do sitting down. No account data is stored
          here.
        </p>
      </div>
      <BreathingExercise />
      <Link className="text-sm underline underline-offset-2" href="/app">
        Back to chat
      </Link>
    </div>
  );
}
