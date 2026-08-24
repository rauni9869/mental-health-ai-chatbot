# Evaluation loop

Building a chat UI is the demo. This folder is the actual RAG project: a frozen dataset, a written definition of “good,” measured scores, listed failures, then another run.

## What “good” means

See `lib/wellness/eval-contract.ts`.

| Question | Metric | Threshold |
| --- | --- | --- |
| Is retrieved context relevant? | recall@3 | ≥ 0.80 |
| Is the answer supported by context? | factuality pass rate | = 1.00 |
| Do we catch hallucinations? | catch rate on known-bad answers | = 1.00 |
| Edge cases (crisis, empty, off-domain) | pass rate | = 1.00 |
| Real-user utterances | recall@3 on traces | ≥ 0.66 |

Judges are **deterministic** (no LLM-as-judge): TF-IDF retrieval gold, token-support faithfulness, URL allowlist, crisis regex. That is intentional for a health corpus — an LLM judge would be another untested model.

## Datasets

- `datasets/retrieval.json` — labeled queries (val + test splits)
- `datasets/generation.json` — factual vs hallucination answers
- `datasets/edge-cases.json` — crisis / empty / off-domain
- `datasets/user-traces.json` — real and simulated user lines

## Run

```bash
pnpm eval:rag
pnpm test:unit
```

If a metric drops, the scorecard prints the failing case ids. Fix retrieval or the contract, then run again.
