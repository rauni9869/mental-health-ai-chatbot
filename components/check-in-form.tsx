'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MOODS = ['very-low', 'low', 'ok', 'good', 'high'] as const;

export function CheckInForm() {
  const router = useRouter();
  const [mood, setMood] = useState<(typeof MOODS)[number]>('ok');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="rounded-2xl border bg-background p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        const response = await fetch('/api/check-ins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood, intensity, notes }),
        });
        setSaving(false);
        if (!response.ok) {
          setError('Could not save this check-in. Try again in a moment.');
          return;
        }
        setNotes('');
        router.refresh();
      }}
    >
      <div className="text-sm font-medium">Log how you are right now</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {MOODS.map((value) => (
          <button
            className={`rounded-full border px-3 py-1 text-xs ${
              mood === value
                ? 'border-emerald-800 bg-emerald-800 text-white'
                : 'hover:bg-muted'
            }`}
            key={value}
            onClick={() => setMood(value)}
            type="button"
          >
            {value.replace('-', ' ')}
          </button>
        ))}
      </div>
      <label className="mt-4 block text-xs text-muted-foreground">
        Intensity {intensity}/10
        <input
          className="mt-2 w-full"
          max={10}
          min={0}
          onChange={(event) => setIntensity(Number(event.target.value))}
          type="range"
          value={intensity}
        />
      </label>
      <textarea
        className="mt-3 w-full rounded-xl border bg-transparent p-3 text-sm"
        maxLength={500}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Optional note. Keep it short."
        value={notes}
      />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      <button
        className="mt-3 rounded-full bg-emerald-800 px-4 py-2 text-sm text-white disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        {saving ? 'Saving…' : 'Save check-in'}
      </button>
    </form>
  );
}
