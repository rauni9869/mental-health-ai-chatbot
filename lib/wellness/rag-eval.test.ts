import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retrieveWellnessKnowledge } from './knowledge';
import {
  evaluateFaithfulness,
  evaluateRetrieval,
  groundedAnswerFromChunks,
} from './rag-eval';

test('RAG recall@3 is at least 0.8 on the gold set', () => {
  const report = evaluateRetrieval();
  assert.ok(
    report.recallAt3 >= 0.8,
    `recall@3=${report.recallAt3} cases=${JSON.stringify(report.cases)}`,
  );
  assert.ok(report.recallAt1 >= 0.6, `recall@1=${report.recallAt1}`);
  assert.ok(report.mrr >= 0.6, `mrr=${report.mrr}`);
  assert.equal(report.failClosedAccuracy, 1);
});

test('off-domain queries fail closed', () => {
  assert.equal(
    retrieveWellnessKnowledge('binary heap insert complexity big-o').length,
    0,
  );
});

test('grounded answers from retrieved chunks pass faithfulness', () => {
  const chunks = retrieveWellnessKnowledge(
    'panic attack dying racing heart minutes',
    3,
  );
  assert.ok(chunks.length > 0);
  const answer = groundedAnswerFromChunks(chunks);
  const result = evaluateFaithfulness(answer, chunks);
  assert.equal(result.pass, true);
  assert.ok(result.tokenSupport >= 0.5);
});

test('invented citations and diagnoses fail faithfulness', () => {
  const chunks = retrieveWellnessKnowledge('cannot sleep screens', 3);
  const result = evaluateFaithfulness(
    'You have bipolar. See https://example.com/fake-study for 200mg sertraline.',
    chunks,
  );
  assert.equal(result.pass, false);
  assert.ok(result.unsupportedUrls.length > 0 || result.safetyPass === false);
});
