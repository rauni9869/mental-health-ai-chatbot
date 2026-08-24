export default function HowItWorksPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">How Steady works</h1>
      <p className="mt-4 text-muted-foreground">
        Built for the 1am gap, not as a replacement for clinical care.
      </p>
      <div className="mt-10 space-y-8 text-sm leading-7">
        <section>
          <h2 className="text-lg font-semibold">1. Safety screen</h2>
          <p className="mt-2">
            Every message is checked for imminent-harm language before a model
            runs. If that screen fires, you get crisis resources, not a chatbot
            improvising through a suicide plan.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">2. Open-source generation</h2>
          <p className="mt-2">
            Replies come from Groq-hosted Llama when a Groq key is set (recommended
            on laptops), or from local Ollama if you force that. Not OpenAI.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">3. Curated retrieval</h2>
          <p className="mt-2">
            Factual psychoeducation is pulled from a small corpus of public
            health pages. If nothing matches, Steady says it does not have a
            source instead of searching the web.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold">4. Skills, logs, notes</h2>
          <p className="mt-2">
            One coping skill at a time, optional mood check-ins, and documents
            you can take to a licensed clinician.
          </p>
        </section>
      </div>
    </article>
  );
}
