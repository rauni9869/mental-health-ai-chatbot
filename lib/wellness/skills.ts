export const COPING_SKILLS = {
  'box-breathing': {
    id: 'box-breathing',
    name: 'Box breathing',
    minutes: 2,
    bestFor: 'anxiety, agitation, before sleep',
    steps: [
      'Sit upright with both feet on the floor if you can.',
      'Inhale through the nose for 4 counts.',
      'Hold for 4 counts.',
      'Exhale through the mouth for 4 counts.',
      'Hold empty for 4 counts. Repeat 4–6 rounds.',
    ],
    caution:
      'Stop if you feel dizzy. This is a nervous-system downshift, not medical treatment.',
  },
  '54321-grounding': {
    id: '54321-grounding',
    name: '5-4-3-2-1 grounding',
    minutes: 3,
    bestFor: 'panic, overwhelm, feeling unreal',
    steps: [
      'Name 5 things you can see.',
      'Name 4 things you can feel (clothes, chair, temperature).',
      'Name 3 things you can hear.',
      'Name 2 things you can smell, or remember a calming scent.',
      'Name 1 thing you can taste, or take one slow sip of water.',
    ],
    caution: 'Grounding is a stabilizer. Frequent flashbacks need clinical care.',
  },
  'thought-record': {
    id: 'thought-record',
    name: 'One-line thought record',
    minutes: 5,
    bestFor: 'rumination, self-criticism, spirals',
    steps: [
      'Situation: what happened, in one sentence.',
      'Automatic thought: write the exact sentence in your head.',
      'Emotion and intensity: name it and rate 0–10.',
      'Evidence for and against the thought.',
      'Balanced alternative: a sentence you could believe at 51%.',
      'Tiny next action in the next 10 minutes.',
    ],
    caution:
      'Do not use a thought record to argue yourself out of imminent crisis. Get human help first.',
  },
  'sleep-wind-down': {
    id: 'sleep-wind-down',
    name: '20-minute wind-down',
    minutes: 20,
    bestFor: 'racing mind at night',
    steps: [
      'Set a consistent wake time for tomorrow, even if tonight is messy.',
      'Dim lights and stop stimulating inputs.',
      'Dump worries onto paper; pick one item for tomorrow only.',
      'Do a low-arousal activity (stretch, shower, paper book).',
      'If still awake after ~20 minutes in bed, get up until sleepy.',
    ],
    caution: 'Loud snoring, gasping, or long-term insomnia need a clinician.',
  },
  'urge-surf': {
    id: 'urge-surf',
    name: 'Urge surfing',
    minutes: 10,
    bestFor: 'impulses, cravings, urge to self-soothe in a harmful way',
    steps: [
      'Name the urge without acting: "this is an urge."',
      'Locate it in the body and rate intensity 0–10.',
      'Breathe and watch the number for 2 minutes without bargaining.',
      'Delay the action for 15 minutes and change rooms or context.',
      'After the peak, choose a replacement action that is merely "good enough."',
    ],
    caution:
      'If the urge is to attempt suicide or serious self-harm, stop this skill and use crisis resources.',
  },
} as const;

export type CopingSkillId = keyof typeof COPING_SKILLS;

export function getCopingSkill(id: string) {
  if (id in COPING_SKILLS) {
    return COPING_SKILLS[id as CopingSkillId];
  }
  return null;
}

export function listCopingSkills() {
  return Object.values(COPING_SKILLS);
}

