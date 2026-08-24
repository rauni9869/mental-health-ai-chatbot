import retrievalGold from '../../evals/datasets/retrieval.json';
import { retrieveWellnessKnowledge, type RetrievedChunk } from './knowledge';
import { tokenize } from './vector';
import { evaluateSafety } from './eval';

export type RagGoldQuery = {
  id: string;
  query: string;
  relevantIds: string[];
  failClosed?: boolean;
  split?: string;
};

export const RAG_GOLD = retrievalGold as RagGoldQuery[];

export type RetrievalCaseResult = {
  id: string;
  query: string;
  retrievedIds: string[];
  hitAt1: boolean;
  hitAt3: boolean;
  reciprocalRank: number;
  failClosedOk: boolean;
};

export type RetrievalReport = {
  n: number;
  recallAt1: number;
  recallAt3: number;
  mrr: number;
  failClosedAccuracy: number;
  cases: RetrievalCaseResult[];
};

function hitAtK(relevantIds: string[], retrievedIds: string[], k: number) {
  if (relevantIds.length === 0) {
    return retrievedIds.length === 0;
  }
  return retrievedIds.slice(0, k).some((id) => relevantIds.includes(id));
}

function reciprocalRank(relevantIds: string[], retrievedIds: string[]) {
  const index = retrievedIds.findIndex((id) => relevantIds.includes(id));
  if (index < 0) {
    return 0;
  }
  return 1 / (index + 1);
}

export function evaluateRetrieval(
  gold: RagGoldQuery[] = RAG_GOLD,
  k = 3,
): RetrievalReport {
  const cases = gold.map((item) => {
    const chunks = retrieveWellnessKnowledge(item.query, k);
    const retrievedIds = chunks.map((chunk) => chunk.id);
    const failClosedOk = item.failClosed
      ? retrievedIds.length === 0
      : true;
    const relevant = item.relevantIds;

    return {
      id: item.id,
      query: item.query,
      retrievedIds,
      hitAt1: item.failClosed
        ? retrievedIds.length === 0
        : hitAtK(relevant, retrievedIds, 1),
      hitAt3: item.failClosed
        ? retrievedIds.length === 0
        : hitAtK(relevant, retrievedIds, 3),
      reciprocalRank: item.failClosed
        ? retrievedIds.length === 0
          ? 1
          : 0
        : reciprocalRank(relevant, retrievedIds),
      failClosedOk,
    };
  });

  const ranked = cases.filter((item, index) => !gold[index].failClosed);
  const closed = cases.filter((item, index) => gold[index].failClosed);

  const mean = (values: number[]) =>
    values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;

  return {
    n: cases.length,
    recallAt1: mean(ranked.map((item) => (item.hitAt1 ? 1 : 0))),
    recallAt3: mean(ranked.map((item) => (item.hitAt3 ? 1 : 0))),
    mrr: mean(ranked.map((item) => item.reciprocalRank)),
    failClosedAccuracy: mean(closed.map((item) => (item.failClosedOk ? 1 : 0))),
    cases,
  };
}

export type FaithfulnessResult = {
  tokenSupport: number;
  unsupportedUrls: string[];
  safetyPass: boolean;
  pass: boolean;
};

const URL_PATTERN = /https?:\/\/[^\s)]+/gi;

/**
 * Citation faithfulness without an LLM judge:
 * content tokens in the answer should appear in retrieved excerpts,
 * and any URL cited must come from those excerpts.
 */
export function evaluateFaithfulness(
  answer: string,
  chunks: RetrievedChunk[],
): FaithfulnessResult {
  const excerptText = chunks.map((chunk) => chunk.excerpt).join(' ');
  const excerptTokens = new Set(tokenize(excerptText));
  const answerTokens = tokenize(answer);
  const contentTokens = answerTokens.filter((token) => token.length > 3);
  const supported = contentTokens.filter((token) => excerptTokens.has(token));
  const tokenSupport =
    contentTokens.length === 0 ? 1 : supported.length / contentTokens.length;

  const allowedUrls = new Set(chunks.map((chunk) => chunk.sourceUrl));
  const cited = answer.match(URL_PATTERN) ?? [];
  const unsupportedUrls = cited.filter((url) => {
    const clean = url.replace(/[.,;]+$/, '');
    return ![...allowedUrls].some(
      (allowed) => allowed === clean || allowed.startsWith(clean) || clean.startsWith(allowed),
    );
  });

  const safetyPass = evaluateSafety(answer).pass;
  const pass =
    tokenSupport >= 0.35 && unsupportedUrls.length === 0 && safetyPass;

  return { tokenSupport, unsupportedUrls, safetyPass, pass };
}

export function groundedAnswerFromChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return 'I do not have a grounded source in the corpus for that.';
  }
  const first = chunks[0];
  return `${first.excerpt.slice(0, 280)} Source: ${first.sourceName} ${first.sourceUrl}`;
}

export function formatRetrievalReport(report: RetrievalReport): string {
  const lines = [
    'RAG retrieval eval (TF-IDF cosine + title/topic boost, fail-closed)',
    `recall@1=${report.recallAt1.toFixed(3)}  recall@3=${report.recallAt3.toFixed(3)}  MRR=${report.mrr.toFixed(3)}  fail-closed=${report.failClosedAccuracy.toFixed(3)}  n=${report.n}`,
    '',
  ];
  for (const item of report.cases) {
    lines.push(
      `- ${item.id}: retrieved=[${item.retrievedIds.join(', ') || '∅'}] r@1=${item.hitAt1} r@3=${item.hitAt3} rr=${item.reciprocalRank.toFixed(2)}`,
    );
  }
  return lines.join('\n');
}
