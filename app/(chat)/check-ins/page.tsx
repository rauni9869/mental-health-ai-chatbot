import { auth } from '@/app/(auth)/auth';
import { getMoodCheckInsByUserId } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CheckInsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/api/auth/guest');
  }

  const checkIns = await getMoodCheckInsByUserId({
    userId: session.user.id,
    limit: 30,
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Private check-ins</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A between-session log of moods you chose to save. This is not a
          clinical record.
        </p>
      </div>
      {checkIns.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No check-ins yet. Ask Steady to log how you are doing.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {checkIns.map((checkIn) => (
            <li
              className="rounded-xl border p-3 text-sm"
              key={checkIn.id}
            >
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
      <Link className="text-sm underline underline-offset-2" href="/">
        Back to chat
      </Link>
    </div>
  );
}
