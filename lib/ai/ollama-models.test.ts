import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  describeOllamaModelError,
  pickOllamaModel,
} from './ollama-models';

test('uses the preferred model when it is installed', () => {
  assert.equal(
    pickOllamaModel(['llama3.2:1b', 'mistral:latest'], 'llama3.2:1b'),
    'llama3.2:1b',
  );
});

test('falls back to any installed model when preferred is missing', () => {
  assert.equal(
    pickOllamaModel(['mistral:latest'], 'llama3.2:1b'),
    'mistral:latest',
  );
});

test('prefers llama when preferred is missing', () => {
  assert.equal(
    pickOllamaModel(['mistral:latest', 'llama3.1:latest'], 'llama3.2:1b'),
    'llama3.1:latest',
  );
});

test('matches untagged preferred names to :latest', () => {
  assert.equal(pickOllamaModel(['llama3.1:latest'], 'llama3.1'), 'llama3.1:latest');
});

test('returns null when nothing is installed', () => {
  assert.equal(pickOllamaModel([], 'llama3.2:1b'), null);
});

test('explains a missing-model 404', () => {
  const text = describeOllamaModelError(
    new Error("model 'llama3.2:1b' not found"),
  );
  assert.match(text, /GROQ_API_KEY|Groq/i);
});
