import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runEvalScorecard } from './scorecard';

test('eval scorecard passes the published contract', () => {
  const card = runEvalScorecard();
  assert.equal(
    card.overallPass,
    true,
    `failures=${card.failures.join(', ')}`,
  );
});
