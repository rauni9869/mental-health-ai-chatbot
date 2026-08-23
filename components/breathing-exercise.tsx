'use client';

import { useEffect, useMemo, useState } from 'react';

const PHASES = [
  { label: 'Inhale', seconds: 4 },
  { label: 'Hold', seconds: 4 },
  { label: 'Exhale', seconds: 4 },
  { label: 'Hold', seconds: 4 },
] as const;

const CYCLE = PHASES.reduce((sum, phase) => sum + phase.seconds, 0);

function phaseFromTick(tick: number) {
  const position = tick % CYCLE;
  let cursor = 0;
  for (const phase of PHASES) {
    if (position < cursor + phase.seconds) {
      return {
        label: phase.label,
        remaining: phase.seconds - (position - cursor),
      };
    }
    cursor += phase.seconds;
  }
  return { label: PHASES[0].label, remaining: PHASES[0].seconds };
}

export function BreathingExercise() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const current = useMemo(() => phaseFromTick(tick), [tick]);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const scale =
    current.label === 'Inhale' ? 1.18 : current.label === 'Exhale' ? 0.86 : 1;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div
        className="flex size-52 items-center justify-center rounded-full bg-emerald-800 text-emerald-50 shadow-inner transition-transform duration-1000 ease-in-out"
        style={{ transform: running ? `scale(${scale})` : 'scale(1)' }}
      >
        <div className="text-center">
          <div className="text-sm uppercase tracking-[0.2em]">{current.label}</div>
          <div className="mt-2 text-4xl font-semibold">{current.remaining}</div>
        </div>
      </div>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        Four counts in, four hold, four out, four hold. Stop if you feel dizzy.
        This is a nervous-system downshift, not medical treatment.
      </p>
      <button
        className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-medium text-white"
        onClick={() => {
          if (running) {
            setRunning(false);
            return;
          }
          setTick(0);
          setRunning(true);
        }}
        type="button"
      >
        {running ? 'Pause' : 'Start box breath'}
      </button>
    </div>
  );
}
