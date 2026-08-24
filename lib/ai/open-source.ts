import { groq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { chooseInferenceBackend } from './inference';
import {
  DEFAULT_GROQ_CHAT_MODEL,
  resolveGroqModelId,
} from './groq-models';
import { listOllamaModelNames, pickOllamaModel } from './ollama-models';

/**
 * Open-weight models only. No ChatGPT/OpenAI API key.
 *
 * If GROQ_API_KEY is set, use Groq (GPT-OSS after Llama Instant was retired).
 * Otherwise use local Ollama. Set USE_OLLAMA=1 to force local even with a Groq key.
 */
export async function getOpenSourceModels() {
  if (chooseInferenceBackend() === 'groq') {
    console.info(
      'Using Groq-hosted open-weight GPT-OSS. Ollama is not used — you can quit the Ollama app.',
    );
    const requestedChat =
      process.env.GROQ_CHAT_MODEL ?? DEFAULT_GROQ_CHAT_MODEL;
    const requestedReasoning =
      process.env.GROQ_REASONING_MODEL ?? DEFAULT_GROQ_CHAT_MODEL;
    const requestedSmall =
      process.env.GROQ_SMALL_MODEL ?? DEFAULT_GROQ_CHAT_MODEL;
    const chatId = resolveGroqModelId(requestedChat);
    const reasoningId = resolveGroqModelId(requestedReasoning);
    const smallId = resolveGroqModelId(requestedSmall);

    if (chatId !== requestedChat) {
      console.info(
        `Groq model "${requestedChat}" is retired on the free tier. Using "${chatId}" instead.`,
      );
    }

    return {
      chat: groq(chatId),
      reasoning: wrapLanguageModel({
        model: groq(reasoningId),
        middleware: extractReasoningMiddleware({ tagName: 'think' }),
      }),
      small: groq(smallId),
    };
  }

  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  const root = ollamaBaseUrl.replace(/\/$/, '').replace(/\/v1$/, '');
  const ollama = createOpenAICompatible({
    name: 'ollama',
    baseURL: `${root}/v1`,
    apiKey: process.env.OLLAMA_API_KEY ?? 'ollama',
  });

  const preferredChat = process.env.OLLAMA_CHAT_MODEL ?? 'llama3.1:latest';
  const preferredSmall = process.env.OLLAMA_SMALL_MODEL ?? preferredChat;
  const preferredReasoning =
    process.env.OLLAMA_REASONING_MODEL ?? preferredChat;

  const installed = await listOllamaModelNames(root);
  const chatId = pickOllamaModel(installed, preferredChat) ?? preferredChat;
  const smallId = pickOllamaModel(installed, preferredSmall) ?? chatId;
  const reasoningId = pickOllamaModel(installed, preferredReasoning) ?? chatId;

  if (installed.length === 0) {
    throw new Error(
      `Ollama has no pulled models. Run: ollama pull ${preferredChat}`,
    );
  }

  if (chatId !== preferredChat) {
    console.warn(
      `Ollama model "${preferredChat}" is not installed. Using "${chatId}" from: ${installed.join(', ')}`,
    );
  }

  return {
    chat: ollama.chatModel(chatId),
    reasoning: wrapLanguageModel({
      model: ollama.chatModel(reasoningId),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    small: ollama.chatModel(smallId),
  };
}
