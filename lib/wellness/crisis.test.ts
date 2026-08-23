import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assessCrisis,
  extractUserText,
  getCrisisResourcesForCountry,
} from './crisis';
import { retrieveWellnessKnowledge } from './knowledge';
import { getCopingSkill } from './skills';

test('detects imminent suicide language', () => {
  const result = assessCrisis('I want to kill myself tonight');
  assert.equal(result.level, 'imminent');
  assert.ok(result.matchedSignals.length > 0);
});

test('does not flag ordinary stress as imminent', () => {
  const result = assessCrisis(
    'Work is killing my evenings and I feel burnt out',
  );
  assert.equal(result.level, 'none');
});

test('flags panic as elevated', () => {
  const result = assessCrisis("I'm having a panic attack and can't breathe");
  assert.equal(result.level, 'elevated');
});

test('extracts user text parts', () => {
  assert.equal(
    extractUserText([
      { type: 'text', text: 'hello' },
      { type: 'file' },
    ]),
    'hello',
  );
});

test('returns US crisis lines', () => {
  const pack = getCrisisResourcesForCountry('US');
  assert.equal(pack.region, 'United States');
  assert.ok(pack.lines.some((line) => line.contact.includes('988')));
});

test('retrieves panic knowledge for panic queries', () => {
  const chunks = retrieveWellnessKnowledge(
    'panic attack at night racing heart',
  );
  assert.ok(chunks.length > 0);
  assert.ok(chunks[0].sourceUrl.startsWith('https://'));
});

test('returns a known coping skill', () => {
  const skill = getCopingSkill('box-breathing');
  assert.ok(skill);
  assert.ok(skill.steps.length > 0);
});
