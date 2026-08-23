import { tool } from 'ai';
import { z } from 'zod';
import { retrieveWellnessKnowledge } from '@/lib/wellness/knowledge';

export const retrieveKnowledge = tool({
  description:
    'Retrieve grounded psychoeducation from a curated public-health corpus. Use this before giving factual mental-health information. Never invent citations.',
  inputSchema: z.object({
    query: z
      .string()
      .describe('The user situation or topic, e.g. "panic at night" or "rumination"'),
  }),
  execute: async ({ query }) => {
    const chunks = retrieveWellnessKnowledge(query, 3);
    return {
      query,
      chunks,
      disclaimer:
        'These excerpts are educational summaries with source links. They are not a diagnosis or treatment plan.',
    };
  },
});
