export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Supportive',
    description: 'Warm, grounded between-session companion',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Careful',
    description: 'Slower reasoning for complex emotional situations',
  },
];
