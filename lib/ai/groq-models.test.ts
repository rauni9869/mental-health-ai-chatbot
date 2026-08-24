import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveGroqModelId } from './groq-models';

test('maps retired Llama Instant to GPT-OSS 20B', () => {
  assert.equal(
    resolveGroqModelId('llama-3.1-8b-instant'),
    'openai/gpt-oss-20b',
  );
});

test('leaves current Groq model IDs unchanged', () => {
  assert.equal(
    resolveGroqModelId('openai/gpt-oss-20b'),
    'openai/gpt-oss-20b',
  );
});
