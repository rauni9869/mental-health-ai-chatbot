export type CrisisLevel = 'none' | 'elevated' | 'imminent';

export type CrisisAssessment = {
  level: CrisisLevel;
  matchedSignals: string[];
  reason: string;
};

const IMMINENT_PATTERNS: Array<{ id: string; pattern: RegExp }> = [
  {
    id: 'suicide-plan',
    pattern: /\b(kill myself|end my life|take my (own )?life|suicide)\b/i,
  },
  {
    id: 'active-intent',
    pattern: /\b(i (want|am going|gonna|going) to (die|kill myself|end it))\b/i,
  },
  {
    id: 'method',
    pattern: /\b(overdose|hang myself|shoot myself|jump off|slit my (wrists|throat))\b/i,
  },
  {
    id: 'goodbye',
    pattern: /\b(this is goodbye|final goodbye|nobody will miss me)\b/i,
  },
  {
    id: 'self-harm-now',
    pattern: /\b(cut(ting)? myself (right )?now|hurt myself tonight)\b/i,
  },
];

const ELEVATED_PATTERNS: Array<{ id: string; pattern: RegExp }> = [
  {
    id: 'hopeless',
    pattern: /\b(no (point|reason) (in )?liv(ing|e)|better off dead|can'?t go on)\b/i,
  },
  { id: 'self-harm', pattern: /\b(self[- ]harm|cutting|hurt myself)\b/i },
  {
    id: 'panic',
    pattern: /\b(panic attack|can'?t breathe|heart (is )?racing|i'?m freaking out)\b/i,
  },
  {
    id: 'crisis-ask',
    pattern: /\b(crisis|helpline|hotline|emergency (help|number))\b/i,
  },
];

function unique(values: string[]) {
  return [...new Set(values)];
}

export function assessCrisis(text: string): CrisisAssessment {
  const input = text.trim();
  if (!input) {
    return { level: 'none', matchedSignals: [], reason: 'empty' };
  }

  const imminent = IMMINENT_PATTERNS.filter(({ pattern }) =>
    pattern.test(input),
  ).map(({ id }) => id);

  if (imminent.length > 0) {
    return {
      level: 'imminent',
      matchedSignals: unique(imminent),
      reason:
        'Imminent-harm language detected. Skip model generation and surface crisis resources.',
    };
  }

  const elevated = ELEVATED_PATTERNS.filter(({ pattern }) =>
    pattern.test(input),
  ).map(({ id }) => id);

  if (elevated.length > 0) {
    return {
      level: 'elevated',
      matchedSignals: unique(elevated),
      reason:
        'Distress signals detected. Stay supportive, offer skills, and keep crisis resources available.',
    };
  }

  return { level: 'none', matchedSignals: [], reason: 'no crisis signals' };
}

export function extractUserText(parts: Array<{ type?: string; text?: string }>) {
  return parts
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text as string)
    .join('\n')
    .trim();
}

export type CrisisResourceLine = {
  name: string;
  contact: string;
};

export type CrisisResourcePack = {
  region: string;
  directoryUrl: string;
  lines: CrisisResourceLine[];
};

export function getCrisisResourcesForCountry(
  country?: string | null,
): CrisisResourcePack {
  const code = (country ?? '').toUpperCase();
  const directoryUrl = 'https://www.iasp.info/suicidalthoughts/';

  if (code === 'US' || code === 'USA' || code === 'UNITED STATES') {
    return {
      region: 'United States',
      directoryUrl,
      lines: [
        {
          name: '988 Suicide & Crisis Lifeline',
          contact: 'Call or text 988 (24/7)',
        },
        { name: 'Crisis Text Line', contact: 'Text HOME to 741741' },
        {
          name: 'Emergency',
          contact: 'Call 911 if you are in immediate danger',
        },
      ],
    };
  }

  if (code === 'IN' || code === 'INDIA') {
    return {
      region: 'India',
      directoryUrl,
      lines: [
        { name: 'AASRA', contact: '+91 98204 66726' },
        { name: 'iCall (TISS)', contact: '+91 91529 87821' },
        {
          name: 'Emergency',
          contact: 'Call local emergency services if you are in immediate danger',
        },
      ],
    };
  }

  if (code === 'GB' || code === 'UK' || code === 'UNITED KINGDOM') {
    return {
      region: 'United Kingdom',
      directoryUrl,
      lines: [
        { name: 'Samaritans', contact: 'Call 116 123 (24/7)' },
        { name: 'NHS', contact: 'Call 111 or 999 in an emergency' },
      ],
    };
  }

  return {
    region: 'International',
    directoryUrl,
    lines: [
      {
        name: 'IASP local resources',
        contact: 'https://www.iasp.info/suicidalthoughts/',
      },
      {
        name: 'Emergency',
        contact:
          'Call your local emergency number if you are in immediate danger',
      },
    ],
  };
}

export function buildCrisisReply(country?: string | null) {
  const local = getCrisisResourcesForCountry(country);

  return [
    "I'm really glad you reached out, and I want you to have real people with you right now. I am not a crisis service or a replacement for emergency care.",
    '',
    'If you might be in danger, please contact emergency services in your area immediately.',
    '',
    ...local.lines.map((line) => `- **${line.name}:** ${line.contact}`),
    '',
    `International directory: ${local.directoryUrl}`,
    '',
    'If you can, stay with someone you trust or move to a safer space. You do not have to handle this alone.',
  ].join('\n');
}

