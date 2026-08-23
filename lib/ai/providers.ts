import { customProvider } from 'ai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';
import { getOpenSourceModels } from './open-source';

function buildOpenSourceLanguageModels() {
  const models = getOpenSourceModels();
  return {
    'chat-model': models.chat,
    'chat-model-reasoning': models.reasoning,
    'title-model': models.small,
    'artifact-model': models.small,
  };
}

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: buildOpenSourceLanguageModels(),
    });
