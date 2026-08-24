import {
  buildTfidfIndex,
  cosineSimilarity,
  embedQuery,
  tokenize,
} from './vector';

export type KnowledgeDoc = {
  id: string;
  title: string;
  topic: string;
  sourceName: string;
  sourceUrl: string;
  content: string;
};

/**
 * Curated psychoeducation only. No open-web search.
 * Content is original summary language pointing at public health pages.
 */
export const WELLNESS_CORPUS: KnowledgeDoc[] = [
  {
    id: 'anxiety-body',
    title: 'What anxiety can feel like in the body',
    topic: 'anxiety',
    sourceName: 'NIMH — Anxiety Disorders',
    sourceUrl: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
    content: `Anxiety is a normal alarm system. It becomes a problem when the alarm stays on after the threat has passed. Common body signs include a racing heart, tight chest, stomach distress, restlessness, and trouble concentrating. These signs are uncomfortable, not proof that you are in medical danger, but new or severe physical symptoms still deserve medical care. Helpful first steps: slow your breathing, name five things you can see, and postpone "what if" thinking until your body settles.`,
  },
  {
    id: 'panic-wave',
    title: 'Riding out a panic wave',
    topic: 'panic',
    sourceName: 'NHS — Panic disorder',
    sourceUrl: 'https://www.nhs.uk/mental-health/conditions/panic-disorder/',
    content: `A panic attack is a sudden surge of intense fear that usually peaks within minutes. People often fear they are dying, fainting, or "going crazy." Panic is terrifying and typically not dangerous by itself. Fighting the sensations can make them louder. A grounded approach: stay where you are if you are safe, breathe out longer than you breathe in, remind yourself the wave rises and falls, and avoid caffeine or hyperventilation. Seek urgent medical help for chest pain, fainting, or symptoms that are new for you.`,
  },
  {
    id: 'low-mood',
    title: 'Low mood versus depression',
    topic: 'depression',
    sourceName: 'WHO — Depressive disorder',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/depression',
    content: `Everyone has low-mood days. Depression is different: persistent sadness or emptiness, loss of interest, sleep or appetite change, fatigue, guilt, and difficulty functioning for most of two weeks or longer. This assistant cannot diagnose depression. Useful supports include keeping a simple daily routine, gentle movement, reaching a trusted person, and talking with a licensed clinician. If hopelessness or thoughts of death appear, use crisis resources immediately.`,
  },
  {
    id: 'sleep',
    title: 'Sleep that actually restores',
    topic: 'sleep',
    sourceName: 'CDC — About Sleep',
    sourceUrl: 'https://www.cdc.gov/sleep/about/index.html',
    content: `Sleep is a core mental-health skill, not a luxury. Most adults need 7 or more hours. Helpful habits: keep a consistent wake time, dim screens in the hour before bed, keep the room dark and cool, and get daytime light. Avoid using the bed for worry spirals. If you cannot sleep after about 20 minutes, get up and do a quiet, non-screen activity until sleepy. Chronic insomnia, loud snoring, or gasping deserve a clinician, not only sleep tips.`,
  },
  {
    id: 'rumination',
    title: 'When thoughts loop',
    topic: 'rumination',
    sourceName: 'APA — Rumination',
    sourceUrl: 'https://www.apa.org/monitor/2021/03/ce-corner',
    content: `Rumination is replaying the same worry or self-criticism without moving toward a next step. It feels like problem-solving but usually increases distress. A CBT-style interrupt: write the thought down, label it as a thought not a fact, ask "what would I tell a friend?", and choose one tiny next action or a scheduled "worry window." Thought records work better than arguing with the thought in your head.`,
  },
  {
    id: 'grounding',
    title: 'Grounding when you feel unreal or flooded',
    topic: 'grounding',
    sourceName: 'VA — Grounding techniques',
    sourceUrl: 'https://www.va.gov/WHOLEHEALTHLIBRARY/tools/grounding.asp',
    content: `Grounding brings attention back to the present when emotions, trauma reminders, or dissociation pull you away. The 5-4-3-2-1 method uses senses: five things you see, four you feel, three you hear, two you smell, one you taste or a slow breath. Pair it with planting both feet on the floor. Grounding is a stabilizer, not a trauma treatment. If flashbacks or dissociation are frequent, a trauma-informed clinician is the right next step.`,
  },
  {
    id: 'boundaries-work',
    title: 'Stress from work and always-on culture',
    topic: 'burnout',
    sourceName: 'WHO — Burn-out',
    sourceUrl: 'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases',
    content: `Burnout is an occupational phenomenon: exhaustion, cynicism, and reduced efficacy tied to chronic workplace stress. It is not a personal failure. Practical buffers include protected off-hours, one realistic priority per day, and asking for workload clarity. This is not medical advice and does not replace occupational health or a therapist. If work stress includes harassment, safety issues, or despair, escalate to people and services with real authority.`,
  },
  {
    id: 'therapy-between-sessions',
    title: 'Using support between therapy sessions',
    topic: 'therapy',
    sourceName: 'SAMHSA — Find help',
    sourceUrl: 'https://www.samhsa.gov/find-help',
    content: `Between-session support works best when it is specific: practice one skill from therapy, log mood, and capture questions for the next appointment. A chatbot can help you rehearse skills and organize a thought record. It cannot provide psychotherapy, prescribe, or keep a clinical record for your clinician unless you choose to share it. If you do not have a therapist and want one, use local professional directories rather than random web search.`,
  },
  {
    id: 'substance-coping',
    title: 'Urges and coping without substances',
    topic: 'urges',
    sourceName: 'SAMHSA — National Helpline',
    sourceUrl: 'https://www.samhsa.gov/find-help/national-helpline',
    content: `Urges rise and fall like a wave, often peaking in 15–30 minutes. Urge-surfing means noticing the body sensation, breathing through it, and delaying the action rather than promising "never again" in the hottest moment. Remove easy access if you can. This assistant does not give instructions that help someone harm themselves or others, and it is not addiction treatment. In the US, SAMHSA's helpline is 1-800-662-HELP (4357).`,
  },
  {
    id: 'loneliness',
    title: 'Loneliness and reaching out',
    topic: 'loneliness',
    sourceName: 'CDC — Social connection',
    sourceUrl: 'https://www.cdc.gov/social-connectedness/about/index.html',
    content: `Loneliness is the gap between the connection you have and the connection you need. It is common and it is not a character flaw. Small, repeated contact usually beats waiting to feel ready: a short message, a walk with someone, a community or faith group, or a peer support space. Online chat can be a bridge. It should not be the only relationship in a crisis.`,
  },
];

export type RetrievedChunk = {
  id: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  excerpt: string;
  score: number;
  cosine: number;
};

const VECTOR_INDEX = buildTfidfIndex(
  WELLNESS_CORPUS.map((doc) => ({
    id: doc.id,
    title: doc.title,
    topic: doc.topic,
    text: doc.content,
  })),
);

/** Below this cosine+boost score, retrieve nothing (fail closed). */
export const RETRIEVAL_SCORE_FLOOR = 0.06;

export function retrieveWellnessKnowledge(
  query: string,
  limit = 3,
): RetrievedChunk[] {
  const terms = tokenize(query);
  if (terms.length === 0) {
    return [];
  }

  const queryVector = embedQuery(query, VECTOR_INDEX.idf);

  const scored = WELLNESS_CORPUS.map((doc, index) => {
    const cosine = cosineSimilarity(queryVector, VECTOR_INDEX.vectors[index]);
    const titleHits = tokenize(doc.title).filter((token) =>
      terms.some((term) => token.includes(term) || term.includes(token)),
    ).length;
    const topicHits = tokenize(doc.topic).filter((token) =>
      terms.some((term) => token.includes(term) || term.includes(token)),
    ).length;
    const score = cosine + 0.08 * titleHits + 0.12 * topicHits;

    return {
      id: doc.id,
      title: doc.title,
      sourceName: doc.sourceName,
      sourceUrl: doc.sourceUrl,
      excerpt: doc.content,
      score,
      cosine,
    };
  })
    .filter(
      (doc) => doc.score >= RETRIEVAL_SCORE_FLOOR && doc.cosine >= 0.09,
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

