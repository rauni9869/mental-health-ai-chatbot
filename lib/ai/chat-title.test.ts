import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fallbackChatTitle } from './chat-title';
import type { UIMessage } from 'ai';

test('uses first text for a short title', () => {
  const message = {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'I cannot sleep' }],
  } as UIMessage;
  assert.equal(fallbackChatTitle(message), 'I cannot sleep');
});

test('clips long messages', () => {
  const message = {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'a'.repeat(100) }],
  } as UIMessage;
  const title = fallbackChatTitle(message);
  assert.ok(title.length <= 81);
  assert.ok(title.endsWith('…'));
});

test('empty parts become New check-in', () => {
  const message = {
    id: '1',
    role: 'user',
    parts: [],
  } as UIMessage;
  assert.equal(fallbackChatTitle(message), 'New check-in');
});
