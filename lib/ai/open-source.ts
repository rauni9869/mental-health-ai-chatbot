import { groq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';

/**
 * Open-weight models only. No OpenAI.
 *
 * Default: Ollama on http://127.0.0.1:11434 (no API key).
 * Optional hosted path: set GROQ_API_KEY to use Groq-hosted Llama.
 */
export function getOpenSourceModels() {
  const groqKey = process.env.GROQ_API_KEY;
  const ollamaBaseUrl =
    process.env.OLLAMA_BASE_URL ??
    (groqKey ? undefined : 'http://127.0.0.1:11434');

  if (ollamaBaseUrl) {
    const ollama = createOpenAICompatible({
      name: 'ollama',
      baseURL: `${ollamaBaseUrl.replace(/\/$/, '').replace(/\/v1$/, '')}/v1`,
      apiKey: process.env.OLLAMA_API_KEY ?? 'ollama',
    });
    const chatId = process.env.OLLAMA_CHAT_MODEL ?? 'llama3.1';
    const smallId = process.env.OLLAMA_SMALL_MODEL ?? chatId;
    const reasoningId = process.env.OLLAMA_REASONING_MODEL ?? chatId;

    return {
      chat: ollama.chatModel(chatId),
      reasoning: wrapLanguageModel({
        model: ollama.chatModel(reasoningId),
        middleware: extractReasoningMiddleware({ tagName: 'think' }),
      }),
      small: ollama.chatModel(smallId),
    };
  }

  const chatId = process.env.GROQ_CHAT_MODEL ?? 'llama-3.3-70b-versatile';
  const reasoningId =
    process.env.GROQ_REASONING_MODEL ?? 'deepseek-r1-distill-llama-70b';
  const smallId = process.env.GROQ_SMALL_MODEL ?? 'llama-3.1-8b-instant';

  return {
    chat: groq(chatId),
    reasoning: wrapLanguageModel({
      model: groq(reasoningId),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    small: groq(smallId),
  };
}
