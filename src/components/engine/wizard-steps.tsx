"use client";

import Link from "next/link";

const STEPS = [
  { number: 1, label: "Network", href: "/engine/simulation/new" },
  { number: 2, label: "Variables", href: "/engine/simulation/new/variables" },
  { number: 3, label: "Execute", href: "/engine/simulation/new/execute" },
];

export function WizardSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Simulation wizard steps" className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isDone = step.number < current;
        const isActive = step.number === current;

        return (
          <div key={step.number} className="flex items-center">
            {isDone ? (
              <Link
                href={step.href}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-white/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {step.label}
              </Link>
            ) : isActive ? (
              <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {step.number}
                </span>
                {step.label}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs font-medium text-slate-500">
                  {step.number}
                </span>
                {step.label}
              </div>
            )}
            {idx < STEPS.length - 1 && (
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-600" aria-hidden>
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        );
      })}
    </nav>
  );
}
