import type { UIMessage } from 'ai';

/** Title used when the LLM title call fails so a new chat can still be saved. */
export function fallbackChatTitle(message: UIMessage): string {
  const text = message.parts
    ?.map((part) => (part.type === 'text' && 'text' in part ? part.text : ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return 'New check-in';
  }

  const clipped = text.slice(0, 80).trim();
  return clipped.length < text.length ? `${clipped}…` : clipped;
}
