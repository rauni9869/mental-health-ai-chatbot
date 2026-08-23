# Steady

Steady is a **between-session mental health companion**. It is built for the gap that generic chatbots keep missing: people need grounded coping at 1am, a private log they can take to therapy, and **immediate human crisis routing** — not Wikipedia, not a diagnosis, and not a therapist impersonator.

This is a production-minded rewrite of a 2025 LangChain + GPT-3.5 assistant. The old stack searched the open web. That is the wrong retrieval policy for mental health. Steady only cites a curated public-health corpus (NIMH, WHO, NHS, CDC, SAMHSA, IASP) and fails closed when the corpus has no match.

## The problem

People already talk to AI when they cannot reach a clinician. Unconstrained assistants:

- invent clinical advice
- miss suicidal intent
- retrieve random web pages
- treat health chats as public demos

Steady is designed around those failure modes.

## What it does

1. **Crisis gate** — regex safety screen before the model. Imminent-harm language skips generation and returns local resources (988 in the US, IASP internationally).
2. **Grounded RAG** — keyword retrieval over a small, reviewed corpus. No DuckDuckGo. No Wikipedia.
3. **One skill at a time** — box breathing, 5-4-3-2-1, thought records, sleep wind-down, urge surfing.
4. **Private check-ins** — mood logs stored per user, not as a public chat.
5. **Artifacts** — thought records and between-session notes the user can keep.
6. **Deterministic evals** — unit tests for crisis detection plus policy guards against diagnosis, means, and prescribing.

## What it is not

Steady is not psychotherapy, not a medical device, not HIPAA-grade unless you add a BAA and a covered stack, and not a substitute for emergency services.

## Stack

Next.js App Router, AI SDK tool calling, Postgres/Drizzle, NextAuth. Generation uses **open-weight** models only: local Llama via Ollama by default (no LLM API key). Groq-hosted Llama is optional. There is no OpenAI dependency.

FastAPI + LangChain are gone on purpose: one deployable app, typed tools, and a pre-model safety gate.

## Local setup

Nothing installed yet? Full from-zero commands (Mac, Windows, Linux): **[RUN.md](./RUN.md)**.

Short version:

```bash
pnpm setup:local
ollama pull llama3.1
pnpm dev
```

Open http://localhost:3000 then http://localhost:3000/app

```bash
pnpm test:unit
```

## Production notes

- Keep chats **private** by default. Public links are the wrong default for health text.
- Do not add open-web search for clinical questions.
- Re-run `pnpm test:unit` before changing crisis patterns.
- If you operate this for real users, add a lawyer, a clinician reviewer, logging redaction, and a real abuse/crisis operations plan.
