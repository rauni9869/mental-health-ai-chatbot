export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-4 text-muted-foreground">
        Steady is designed so health text is not a public demo. This page is
        product policy, not legal advice.
      </p>
      <div className="mt-10 space-y-6 text-sm leading-7">
        <p>
          Chats default to private. Do not paste names, addresses, medical record
          numbers, or anyone else&apos;s information.
        </p>
        <p>
          Mood check-ins are stored per signed-in or guest account so you can
          review them. Delete the account or ask the operator to purge rows if
          you self-host.
        </p>
        <p>
          If you deploy Steady, you are the data controller. Add a real privacy
          notice, retention limits, and a BAA before calling this HIPAA.
        </p>
        <p>
          Models run on Groq when GROQ_API_KEY is set (prompt text goes to Groq).
          Local Ollama is optional for machines that can run a 5GB model. Do not
          send content you would not type into that vendor.
        </p>
      </div>
    </article>
  );
}
