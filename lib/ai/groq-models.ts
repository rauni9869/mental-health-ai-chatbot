/** Groq retired Llama Instant on the free/dev tier (16 Aug 2026). GPT-OSS is open-weight, hosted on Groq — not ChatGPT. */
const RETIRED_GROQ_MODELS: Record<string, string> = {
  'llama-3.1-8b-instant': 'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile': 'openai/gpt-oss-20b',
  'llama3-8b-8192': 'openai/gpt-oss-20b',
  'llama3-70b-8192': 'openai/gpt-oss-20b',
  'gemma2-9b-it': 'openai/gpt-oss-20b',
};

export const DEFAULT_GROQ_CHAT_MODEL = 'openai/gpt-oss-20b';

export function resolveGroqModelId(requested: string): string {
  return RETIRED_GROQ_MODELS[requested] ?? requested;
}
