import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTfidfIndex,
  cosineSimilarity,
  embedQuery,
  tokenize,
} from './vector';

test('tokenize drops stop words', () => {
  assert.deepEqual(tokenize('the panic attack in the night'), [
    'panic',
    'attack',
    'night',
  ]);
});

test('cosine is higher for matching documents than unrelated ones', () => {
  const index = buildTfidfIndex([
    {
      id: 'panic',
      title: 'Panic attacks',
      topic: 'panic',
      text: 'A panic wave peaks within minutes with racing heart and fear of dying.',
    },
    {
      id: 'sleep',
      title: 'Sleep habits',
      topic: 'sleep',
      text: 'Keep a consistent wake time and dim screens before bed.',
    },
  ]);
  const query = embedQuery('panic racing heart minutes', index.idf);
  const panic = cosineSimilarity(query, index.vectors[0]);
  const sleep = cosineSimilarity(query, index.vectors[1]);
  assert.ok(panic > sleep);
});
