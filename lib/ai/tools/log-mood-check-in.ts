import { tool } from 'ai';
import { z } from 'zod';
import type { Session } from 'next-auth';
import { saveMoodCheckIn } from '@/lib/db/queries';

export const logMoodCheckIn = ({
  session,
  chatId,
}: {
  session: Session;
  chatId: string;
}) =>
  tool({
    description:
      'Save a private mood check-in for the signed-in user so they can see patterns between therapy sessions. Use when the user reports how they feel, rates mood, or asks to log a check-in.',
    inputSchema: z.object({
      mood: z
        .enum(['very-low', 'low', 'ok', 'good', 'high'])
        .describe('Coarse mood label'),
      intensity: z.number().min(0).max(10).describe('0-10 intensity'),
      notes: z
        .string()
        .max(500)
        .optional()
        .describe('Optional short note in the user\'s words'),
    }),
    execute: async ({ mood, intensity, notes }) => {
      if (!session.user?.id) {
        return {
          saved: false,
          reason: 'No signed-in user. Check-ins were not stored.',
        };
      }

      const row = await saveMoodCheckIn({
        userId: session.user.id,
        chatId,
        mood,
        intensity,
        notes,
      });

      return {
        saved: true,
        id: row.id,
        mood,
        intensity,
        notes: notes ?? null,
        createdAt: row.createdAt.toISOString(),
      };
    },
  });
