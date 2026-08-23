import Link from 'next/link';

const features = [
  {
    title: 'Crisis routing first',
    body: 'Imminent-harm language never goes to the model. You get human resources immediately.',
  },
  {
    title: 'Open-weight models',
    body: 'Llama 3.3 on Groq by default, or Llama on your machine with Ollama. No OpenAI key.',
  },
  {
    title: 'Grounded answers',
    body: 'Psychoeducation is retrieved from NIMH, WHO, NHS, CDC, and SAMHSA summaries — not the open web.',
  },
  {
    title: 'Private check-ins',
    body: 'Log mood between sessions and take a simple history to your clinician if you choose.',
  },
];

const steps = [
  'Say what is happening in plain language.',
  'Steady offers one skill, a citation if facts are involved, and a next 10-minute action.',
  'Save a check-in, breathe, or write a between-session note you can keep.',
];

const faqs = [
  {
    q: 'Is this therapy?',
    a: 'No. Steady is a between-session companion. It does not diagnose, prescribe, or replace a licensed clinician.',
  },
  {
    q: 'What model does it use?',
    a: 'Open-weight models: Llama 3.3 70B via Groq, or a local Llama through Ollama. You can point it at any OpenAI-compatible local server.',
  },
  {
    q: 'Will it search the web for medical advice?',
    a: 'No. Factual replies come from a small curated public-health corpus. If nothing matches, it says so.',
  },
  {
    q: 'What if I am in crisis?',
    a: 'Call local emergency services. In the US, call or text 988. Print the crisis card and keep it off-screen.',
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-800">
            Between-session companion
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.15] tracking-tight md:text-6xl">
            Support for the hours your therapist is not on call.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Steady is a private, safety-gated companion for panic waves,
            sleepless nights, and the gap between appointments. It is not a
            doctor and it will not pretend to be one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-emerald-800 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-900"
              href="/app"
            >
              Start a private session
            </Link>
            <Link
              className="rounded-full border border-emerald-800/20 bg-white px-5 py-3 text-sm font-medium hover:bg-emerald-50 dark:bg-zinc-900"
              href="/how-it-works"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Open-weight Llama by default. Chats start private. Crisis language
            skips the model.
          </p>
        </div>
        <div className="rounded-[2rem] border bg-white p-6 shadow-[0_24px_80px_-40px_rgba(6,78,59,0.45)] dark:bg-zinc-900">
          <div className="text-sm font-medium text-emerald-800">Tonight, 1:14am</div>
          <p className="mt-3 font-serif text-xl leading-8 text-zinc-800 dark:text-zinc-100">
            “My chest is tight and I cannot sleep. I do not need a lecture. I
            need something I can do in the next two minutes.”
          </p>
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 dark:bg-emerald-950/40">
            Steady answers with one breathing skill, a NIMH-backed note on what
            panic is, and a prompt to log a check-in — or 988 if the message is
            a crisis.
          </div>
        </div>
      </section>

      <section className="border-y bg-white py-16 dark:bg-zinc-900">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-4">
          {features.map((feature) => (
            <div className="rounded-2xl border border-emerald-900/10 p-5" key={feature.title}>
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl font-semibold">Three steps. No performance.</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <li className="rounded-2xl border bg-white p-5 dark:bg-zinc-900" key={step}>
              <div className="text-sm text-emerald-800">0{index + 1}</div>
              <p className="mt-2 text-sm leading-6">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t bg-white py-16 dark:bg-zinc-900">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Questions people actually ask</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Short answers. No marketing fog.
            </p>
          </div>
          <dl className="space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-medium">{item.q}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
