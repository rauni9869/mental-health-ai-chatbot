/**
 * What “good” means for this RAG system.
 * Change a threshold here, re-run `pnpm eval:rag`, then `pnpm test:unit`.
 */
export const EVAL_CONTRACT = {
  /** Context relevance: gold doc appears in top-3. */
  recallAt3: 0.8,
  recallAt1: 0.6,
  mrr: 0.6,
  /** Off-domain queries must retrieve nothing. */
  failClosed: 1,
  /** Grounded answers must be supported by retrieved tokens + allowed URLs. */
  factualityPassRate: 1,
  /** Known bad answers (fake citations / diagnosis) must fail faithfulness. */
  hallucinationCatchRate: 1,
  /** Crisis, empty, and off-domain edge cases. */
  edgeCasePassRate: 1,
  /** Real/simulated user utterances still retrieve a relevant doc. */
  userTraceRecallAt3: 0.66,
} as const;
