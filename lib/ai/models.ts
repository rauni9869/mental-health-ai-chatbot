export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Llama (hosted)',
    description:
      'Groq-hosted Llama when GROQ_API_KEY is set — recommended on laptops. Local Ollama only if you force it.',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Llama (careful)',
    description: 'A larger hosted Llama for slower, more careful replies',
  },
];
