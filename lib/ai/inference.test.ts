import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseInferenceBackend } from './inference';

test('uses Groq when a Groq key is set so a laptop does not run local Llama', () => {
  assert.equal(
    chooseInferenceBackend({
      GROQ_API_KEY: 'gsk_test',
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
    }),
    'groq',
  );
});

test('keeps Ollama when USE_OLLAMA=1 even with a Groq key', () => {
  assert.equal(
    chooseInferenceBackend({
      GROQ_API_KEY: 'gsk_test',
      USE_OLLAMA: '1',
    }),
    'ollama',
  );
});

test('defaults to Ollama when no Groq key is set', () => {
  assert.equal(chooseInferenceBackend({}), 'ollama');
});
