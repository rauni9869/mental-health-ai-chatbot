import { auth } from '@/app/(auth)/auth';
import { getMoodCheckInsByUserId, saveMoodCheckIn } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';
import { z } from 'zod';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  const checkIns = await getMoodCheckInsByUserId({
    userId: session.user.id,
    limit: 30,
  });

  return Response.json(checkIns);
}

const postSchema = z.object({
  mood: z.enum(['very-low', 'low', 'ok', 'good', 'high']),
  intensity: z.number().min(0).max(10),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new ChatSDKError('unauthorized:chat').toResponse();
  }

  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await request.json());
  } catch {
    return new ChatSDKError('bad_request:api').toResponse();
  }

  const row = await saveMoodCheckIn({
    userId: session.user.id,
    mood: body.mood,
    intensity: body.intensity,
    notes: body.notes,
  });

  return Response.json(row);
}
