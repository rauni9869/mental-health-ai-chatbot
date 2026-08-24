import { auth } from '@/app/(auth)/auth';
import { getMoodCheckInsByUserId } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CheckInForm } from '@/components/check-in-form';

const MOOD_SCORE: Record<string, number> = {
  'very-low': 1,
  low: 2,
  ok: 3,
  good: 4,
  high: 5,
};

export default async function CheckInsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/guest?redirectUrl=/check-ins');
  }

  const checkIns = await getMoodCheckInsByUserId({
    userId: session.user.id,
    limit: 30,
  });

  const recent = [...checkIns].slice(0, 14).reverse();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Private check-ins</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A between-session log. This is not a clinical record.
        </p>
      </div>
      <CheckInForm />
      {recent.length > 0 ? (
        <div className="rounded-2xl border p-4">
          <div className="text-sm font-medium">Last {recent.length} entries</div>
          <div className="mt-4 flex h-24 items-end gap-1">
            {recent.map((checkIn) => (
              <div
                className="flex-1 rounded-t bg-emerald-800/80"
                key={checkIn.id}
                style={{
                  height: `${(MOOD_SCORE[checkIn.mood] ?? 3) * 20}%`,
                }}
                title={`${checkIn.mood} · ${checkIn.createdAt.toLocaleDateString()}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      {checkIns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No check-ins yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {checkIns.map((checkIn) => (
            <li className="rounded-xl border p-3 text-sm" key={checkIn.id}>
              <div className="font-medium">
                {checkIn.mood}
                {typeof checkIn.intensity === 'number'
                  ? ` · ${checkIn.intensity}/10`
                  : ''}
              </div>
              <div className="text-muted-foreground">
                {checkIn.createdAt.toLocaleString()}
              </div>
              {checkIn.notes ? <p className="mt-2">{checkIn.notes}</p> : null}
            </li>
          ))}
        </ul>
      )}
      <Link className="text-sm underline underline-offset-2" href="/app">
        Back to chat
      </Link>
    </div>
  );
}
