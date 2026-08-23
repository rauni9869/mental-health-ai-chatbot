export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Llama 3.3',
    description:
      'General Llama steered for mental health (prompt + curated notes, not a fine-tuned clinical model)',
  },
  {
    id: 'chat-model-reasoning',
    name: 'DeepSeek R1',
    description: 'Open-weight reasoning distill for careful replies',
  },
];
