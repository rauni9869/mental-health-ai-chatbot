const FALLBACK_NAMES = [
  'llama3.1:latest',
  'llama3.1',
  'llama3.1:8b',
  'llama3.2:1b',
  'llama3.2:latest',
  'llama3.2',
  'llama3:latest',
  'llama3',
  'phi3:mini',
  'tinyllama:latest',
  'tinyllama',
];

export function pickOllamaModel(
  installed: string[],
  preferred?: string | string[],
): string | null {
  if (installed.length === 0) {
    return null;
  }

  const prefs = [
    ...(Array.isArray(preferred) ? preferred : preferred ? [preferred] : []),
    ...FALLBACK_NAMES,
  ];

  for (const want of prefs) {
    const match = installed.find(
      (name) =>
        name === want ||
        name === `${want}:latest` ||
        (want.includes(':') ? false : name.startsWith(`${want}:`)),
    );
    if (match) {
      return match;
    }
  }

  const llama = installed.find((name) => name.toLowerCase().startsWith('llama'));
  return llama ?? installed[0] ?? null;
}

type OllamaTagsResponse = {
  models?: Array<{ name?: string; model?: string }>;
};

export async function listOllamaModelNames(baseUrl: string): Promise<string[]> {
  const root = baseUrl.replace(/\/$/, '').replace(/\/v1$/, '');
  try {
    const response = await fetch(`${root}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      return [];
    }
    const body = (await response.json()) as OllamaTagsResponse;
    return (body.models ?? [])
      .map((model) => model.name || model.model)
      .filter((name): name is string => Boolean(name));
  } catch {
    return [];
  }
}

export function describeOllamaModelError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/invalid api key|unauthorized|401/i.test(message)) {
    return 'Groq rejected the API key. Check GROQ_API_KEY in .env.local, then restart pnpm dev.';
  }

  if (/rate limit|429/i.test(message)) {
    return 'The hosted model is rate-limited. Wait a minute and send the message again.';
  }

  if (/not found|no pulled models/i.test(message)) {
    return 'No local chat model is installed. Laptops should use Groq instead: add GROQ_API_KEY from https://console.groq.com/keys, comment out OLLAMA_BASE_URL, quit Ollama, and restart pnpm dev.';
  }

  if (
    /econnrefused|fetch failed|network|enotfound/i.test(message) ||
    /Failed to connect/i.test(message)
  ) {
    return 'Cannot reach a local Ollama process. On a laptop, use Groq (GROQ_API_KEY) instead of running llama3.1 on the Mac. Quit Ollama so it stops using RAM.';
  }

  return message || 'The model failed to reply.';
}
