const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'to',
  'of',
  'in',
  'on',
  'for',
  'with',
  'is',
  'are',
  'was',
  'be',
  'i',
  'me',
  'my',
  'you',
  'your',
  'it',
  'this',
  'that',
  'help',
  'please',
  'can',
  'not',
  'but',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export type SparseVector = Map<string, number>;

function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) ?? 0) + 1);
  }
  return tf;
}

function l2Normalize(vector: SparseVector): SparseVector {
  let sumSquares = 0;
  for (const value of vector.values()) {
    sumSquares += value * value;
  }
  const norm = Math.sqrt(sumSquares) || 1;
  const normalized: SparseVector = new Map();
  for (const [key, value] of vector) {
    normalized.set(key, value / norm);
  }
  return normalized;
}

export function cosineSimilarity(a: SparseVector, b: SparseVector): number {
  if (a.size > b.size) {
    return cosineSimilarity(b, a);
  }
  let dot = 0;
  for (const [key, value] of a) {
    dot += value * (b.get(key) ?? 0);
  }
  return dot;
}

export type IndexedDocument = {
  id: string;
  title: string;
  topic: string;
  text: string;
};

export type TfidfIndex = {
  documentIds: string[];
  vectors: SparseVector[];
  idf: Map<string, number>;
};

/** In-memory TF-IDF index. No external embedding API. */
export function buildTfidfIndex(documents: IndexedDocument[]): TfidfIndex {
  const tokenized = documents.map((document) =>
    tokenize(`${document.title} ${document.topic} ${document.topic} ${document.text}`),
  );
  const documentFrequency = new Map<string, number>();
  for (const tokens of tokenized) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const documentCount = documents.length || 1;
  const idf = new Map<string, number>();
  for (const [token, frequency] of documentFrequency) {
    idf.set(token, Math.log((documentCount + 1) / (frequency + 1)) + 1);
  }

  const vectors = tokenized.map((tokens) => {
    const tf = termFrequency(tokens);
    const length = tokens.length || 1;
    const raw: SparseVector = new Map();
    for (const [token, count] of tf) {
      raw.set(token, (count / length) * (idf.get(token) ?? 1));
    }
    return l2Normalize(raw);
  });

  return {
    documentIds: documents.map((document) => document.id),
    vectors,
    idf,
  };
}

export function embedQuery(query: string, idf: Map<string, number>): SparseVector {
  const tokens = tokenize(query);
  const tf = termFrequency(tokens);
  const length = tokens.length || 1;
  const raw: SparseVector = new Map();
  for (const [token, count] of tf) {
    raw.set(token, (count / length) * (idf.get(token) ?? 1));
  }
  return l2Normalize(raw);
}
