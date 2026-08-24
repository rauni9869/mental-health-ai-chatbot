export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Hosted open-weight',
    description:
      'Groq-hosted GPT-OSS (open weights). Llama Instant was retired on Groq’s free tier.',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Hosted (careful)',
    description: 'Same hosted open-weight model, used for slower careful replies',
  },
];
