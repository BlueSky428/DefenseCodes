import Link from "next/link";
import { GlassPanel } from "@/components/glass-panel";
import { WalletCta } from "@/components/wallet-cta";

const sectors = [
  {
    title: "Defense",
    body: "Weapon systems, directed energy, and hypersonic platforms where export controls, shallow supplier bases, and integration risk dominate programme schedules.",
  },
  {
    title: "Space",
    body: "Rad-hard electronics, propulsion, and constellation-scale demand shocks, modelled with qualification constraints and launch-window coupling.",
  },
  {
    title: "Aerospace",
    body: "Commercial aircraft composites and capital-intensive factory networks where autoclave capacity, resin systems, and tier-2 treaters set the pacing item.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative isolate">
        {/*
          Do not use overflow-hidden here: absolutely positioned blurs do not grow
          the section height, so the bottom of the glow was clipped to a flat line.
        */}
        <div
          className="pointer-events-none absolute -left-32 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--accent)]/20 blur-[100px] sm:-left-24 sm:h-[34rem] sm:w-[34rem] sm:blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-[-20%] h-[22rem] w-[22rem] rounded-full bg-cyan-500/10 blur-[90px] sm:-right-12 sm:h-[26rem] sm:w-[26rem] sm:blur-[100px]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-space)] font-semibold leading-tight tracking-tight">
            <span className="block text-3xl text-[var(--accent)] sm:text-4xl lg:text-5xl">
              DefenseCodes
            </span>
            <span className="mt-2 block text-xl font-medium leading-snug text-white sm:text-2xl lg:text-3xl">
              Strategic supply chain risk intelligence
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Supply Chain Risk Analysis Reports for Defense, Space, and Aerospace.
            Executive summaries are free; the full report PDF unlocks after USDT
            payment (ERC-20 or BEP-20).
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <WalletCta />
            <Link
              href="/reports"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10"
            >
              View reports
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
          Sectors we cover
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Each deliverable combines supplier landscape mapping, stress scenarios, and
          Monte Carlo outputs you can brief engineering and programme leadership on.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sectors.map((s) => (
            <GlassPanel key={s.title} className="p-6">
              <h3 className="font-[family-name:var(--font-space)] text-lg font-semibold text-[var(--accent)]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {s.body}
              </p>
            </GlassPanel>
          ))}
        </div>
      </section>
    </div>
  );
}
