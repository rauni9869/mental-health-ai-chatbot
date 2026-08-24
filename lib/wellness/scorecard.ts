import retrievalGold from '../../evals/datasets/retrieval.json';
import generationGold from '../../evals/datasets/generation.json';
import edgeGold from '../../evals/datasets/edge-cases.json';
import userTraces from '../../evals/datasets/user-traces.json';
import { EVAL_CONTRACT } from './eval-contract';
import {
  evaluateFaithfulness,
  evaluateRetrieval,
  groundedAnswerFromChunks,
  type RagGoldQuery,
} from './rag-eval';
import { retrieveWellnessKnowledge } from './knowledge';
import {
  assessCrisis,
  buildCrisisReply,
  type CrisisLevel,
} from './crisis';
import { evaluateCrisisContainment } from './eval';

export type QuestionScore = {
  question: string;
  pass: boolean;
  metric: string;
  value: number;
  threshold: number;
  failures: string[];
};

export type EvalScorecard = {
  contextRelevance: QuestionScore;
  factuality: QuestionScore;
  hallucinations: QuestionScore;
  edgeCases: QuestionScore;
  userPerformance: QuestionScore;
  overallPass: boolean;
  failures: string[];
};

function mean(values: number[]) {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

function score(
  question: string,
  metric: string,
  value: number,
  threshold: number,
  failures: string[],
): QuestionScore {
  return {
    question,
    metric,
    value,
    threshold,
    failures,
    pass: value + 1e-9 >= threshold,
  };
}

export function runEvalScorecard(): EvalScorecard {
  const retrieval = evaluateRetrieval(retrievalGold as RagGoldQuery[]);
  const retrievalFailures = retrieval.cases
    .filter((item) => !item.hitAt3 || !item.failClosedOk)
    .map((item) => item.id);

  const factualCases = generationGold.filter((item) => item.kind === 'factual');
  const factualFailures: string[] = [];
  const factualHits = factualCases.map((item) => {
    const chunks = retrieveWellnessKnowledge(item.query, 3);
    const answer =
      item.mode === 'from-retrieval'
        ? groundedAnswerFromChunks(chunks)
        : (item.answer ?? '');
    const result = evaluateFaithfulness(answer, chunks);
    if (item.expectPass && !result.pass) {
      factualFailures.push(item.id);
    }
    return item.expectPass === result.pass ? 1 : 0;
  });

  const halluCases = generationGold.filter((item) => item.kind === 'hallucination');
  const halluFailures: string[] = [];
  const halluHits = halluCases.map((item) => {
    const chunks = retrieveWellnessKnowledge(item.query, 3);
    const result = evaluateFaithfulness(item.answer ?? '', chunks);
    const caught = result.pass === false;
    if (!caught) {
      halluFailures.push(item.id);
    }
    return caught ? 1 : 0;
  });

  const edgeFailures: string[] = [];
  const edgeHits = edgeGold.map((item) => {
    let ok = true;
    if (item.expectRetrievalEmpty) {
      ok = retrieveWellnessKnowledge(item.input, 3).length === 0;
    }
    if (item.expectCrisisLevel) {
      const crisis = assessCrisis(item.input);
      ok = ok && crisis.level === (item.expectCrisisLevel as CrisisLevel);
      if (item.kind === 'crisis') {
        const reply = buildCrisisReply('US');
        ok =
          ok &&
          evaluateCrisisContainment(reply) &&
          (item.mustContain ?? []).every((needle) =>
            reply.toLowerCase().includes(needle.toLowerCase()),
          );
      }
    }
    if (!ok) {
      edgeFailures.push(item.id);
    }
    return ok ? 1 : 0;
  });

  const userFailures: string[] = [];
  const userHits = userTraces.map((item) => {
    const chunks = retrieveWellnessKnowledge(item.utterance, 3);
    const hit = chunks.some((chunk) => item.relevantIds.includes(chunk.id));
    if (!hit) {
      userFailures.push(item.id);
    }
    return hit ? 1 : 0;
  });

  const contextRelevance = score(
    'Is the retrieved context relevant?',
    'recall@3',
    retrieval.recallAt3,
    EVAL_CONTRACT.recallAt3,
    retrievalFailures,
  );

  const factuality = score(
    'Is the answer factually supported by retrieved context?',
    'factualityPassRate',
    mean(factualHits),
    EVAL_CONTRACT.factualityPassRate,
    factualFailures,
  );

  const hallucinations = score(
    'How often do we catch hallucinations?',
    'hallucinationCatchRate',
    mean(halluHits),
    EVAL_CONTRACT.hallucinationCatchRate,
    halluFailures,
  );

  const edgeCases = score(
    'What happens on edge cases?',
    'edgeCasePassRate',
    mean(edgeHits),
    EVAL_CONTRACT.edgeCasePassRate,
    edgeFailures,
  );

  const userPerformance = score(
    'Does retrieval still work on real-user utterances?',
    'userTraceRecallAt3',
    mean(userHits),
    EVAL_CONTRACT.userTraceRecallAt3,
    userFailures,
  );

  const questions = [
    contextRelevance,
    factuality,
    hallucinations,
    edgeCases,
    userPerformance,
  ];

  const failures = questions.flatMap((question) =>
    question.failures.map((id) => `${question.metric}:${id}`),
  );

  return {
    contextRelevance,
    factuality,
    hallucinations,
    edgeCases,
    userPerformance,
    overallPass: questions.every((question) => question.pass),
    failures,
  };
}

export function formatScorecard(card: EvalScorecard): string {
  const lines = [
    'Steady eval scorecard (define good → measure → list failures → retest)',
    '',
  ];
  for (const row of [
    card.contextRelevance,
    card.factuality,
    card.hallucinations,
    card.edgeCases,
    card.userPerformance,
  ]) {
    const mark = row.pass ? 'PASS' : 'FAIL';
    lines.push(
      `[${mark}] ${row.question}  ${row.metric}=${row.value.toFixed(3)} (need >= ${row.threshold})`,
    );
    if (row.failures.length > 0) {
      lines.push(`       failures: ${row.failures.join(', ')}`);
    }
  }
  lines.push('');
  lines.push(
    card.overallPass
      ? 'Overall: PASS'
      : `Overall: FAIL  ${card.failures.join('; ')}`,
  );
  return lines.join('\n');
}
