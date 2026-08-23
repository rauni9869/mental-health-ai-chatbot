'use client';

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      className="mt-6 rounded-full bg-emerald-800 px-4 py-2 text-sm text-white print:hidden"
      onClick={() => window.print()}
      type="button"
    >
      {label}
    </button>
  );
}
