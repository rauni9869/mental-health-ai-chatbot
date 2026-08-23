import { tool } from 'ai';
import { z } from 'zod';
import { getCrisisResourcesForCountry } from '@/lib/wellness/crisis';

export const getCrisisResources = tool({
  description:
    'Return trusted crisis and emergency resources. Call this whenever the user may be in crisis, asks for a helpline, or mentions self-harm or suicide. Do not search the open web for this.',
  inputSchema: z.object({
    country: z
      .string()
      .optional()
      .describe('ISO country code or country name if known from the user'),
  }),
  execute: async ({ country }) => {
    return getCrisisResourcesForCountry(country);
  },
});
