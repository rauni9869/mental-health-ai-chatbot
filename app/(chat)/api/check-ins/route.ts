import { auth } from '@/app/(auth)/auth';
import { getMoodCheckInsByUserId } from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

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
