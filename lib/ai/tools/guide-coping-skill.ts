import { tool } from 'ai';
import { z } from 'zod';
import { getCopingSkill, listCopingSkills } from '@/lib/wellness/skills';

export const guideCopingSkill = tool({
  description:
    'Return a short, stepwise coping skill the user can do now. Prefer this over generic pep talk when the user is anxious, spiraling, sleepless, or overwhelmed.',
  inputSchema: z.object({
    skillId: z
      .enum([
        'box-breathing',
        '54321-grounding',
        'thought-record',
        'sleep-wind-down',
        'urge-surf',
      ])
      .describe('Which structured skill to guide'),
  }),
  execute: async ({ skillId }) => {
    const skill = getCopingSkill(skillId);
    if (!skill) {
      return {
        error: 'Unknown skill',
        available: listCopingSkills().map((item) => item.id),
      };
    }
    return skill;
  },
});
