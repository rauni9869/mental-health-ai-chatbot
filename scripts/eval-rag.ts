import { evaluateRetrieval, formatRetrievalReport } from '../lib/wellness/rag-eval';
import retrievalGold from '../evals/datasets/retrieval.json';
import { formatScorecard, runEvalScorecard } from '../lib/wellness/scorecard';
import type { RagGoldQuery } from '../lib/wellness/rag-eval';

const retrieval = evaluateRetrieval(retrievalGold as RagGoldQuery[]);
console.log(formatRetrievalReport(retrieval));
console.log('');
console.log(formatScorecard(runEvalScorecard()));
