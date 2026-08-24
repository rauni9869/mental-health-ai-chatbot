import { customProvider, type LanguageModel } from 'ai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';
import { getOpenSourceModels } from './open-source';

export type AppLanguageModelId =
  | 'chat-model'
  | 'chat-model-reasoning'
  | 'title-model'
  | 'artifact-model';

const testProvider = customProvider({
  languageModels: {
    'chat-model': chatModel,
    'chat-model-reasoning': reasoningModel,
    'title-model': titleModel,
    'artifact-model': artifactModel,
  },
});

let cached:
  | {
      at: number;
      models: {
        'chat-model': LanguageModel;
        'chat-model-reasoning': LanguageModel;
        'title-model': LanguageModel;
        'artifact-model': LanguageModel;
      };
    }
  | null = null;

async function buildOpenSourceLanguageModels() {
  if (cached && Date.now() - cached.at < 15_000) {
    return cached.models;
  }

  const models = await getOpenSourceModels();
  const mapped = {
    'chat-model': models.chat,
    'chat-model-reasoning': models.reasoning,
    'title-model': models.small,
    'artifact-model': models.small,
  };
  cached = { at: Date.now(), models: mapped };
  return mapped;
}

/** Test-only provider. Production chat must use getLanguageModel so Ollama tags can be resolved. */
export const myProvider = testProvider;

export async function getLanguageModel(id: AppLanguageModelId | string) {
  const key: AppLanguageModelId =
    id === 'chat-model-reasoning' ||
    id === 'title-model' ||
    id === 'artifact-model'
      ? id
      : 'chat-model';

  if (isTestEnvironment) {
    return testProvider.languageModel(key);
  }

  const models = await buildOpenSourceLanguageModels();
  return models[key];
}
