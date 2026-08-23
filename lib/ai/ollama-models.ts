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

  if (/not found|no pulled models/i.test(message)) {
    return 'Ollama is running, but no usable chat model is installed. In Terminal run: ollama list. Then ollama pull llama3.1 (about 5GB) or a smaller model. If a model is already listed, put that exact name in .env.local as OLLAMA_CHAT_MODEL and restart pnpm dev.';
  }

  if (
    /econnrefused|fetch failed|network|enotfound/i.test(message) ||
    /Failed to connect/i.test(message)
  ) {
    return 'Cannot reach Ollama at 127.0.0.1:11434. Open the Ollama app from Applications and try again.';
  }

  return message || 'The local model failed to reply.';
}
