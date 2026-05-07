import Image from "next/image";
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
    <div className="min-w-0 overflow-x-clip">
      <section className="relative isolate">
        {/*
          Do not use overflow-hidden here: absolutely positioned blurs do not grow
          the section height, so the bottom of the glow was clipped to a flat line.
        */}
        <div
          className="pointer-events-none absolute -left-24 top-[-8%] h-[18rem] w-[18rem] rounded-full bg-[var(--accent)]/20 blur-[72px] min-[400px]:-left-28 min-[400px]:h-[22rem] min-[400px]:w-[22rem] sm:-left-24 sm:top-[-10%] sm:h-[30rem] sm:w-[30rem] sm:blur-[100px] md:h-[34rem] md:w-[34rem] md:blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 bottom-[-15%] h-[14rem] w-[14rem] rounded-full bg-cyan-500/10 blur-[64px] min-[400px]:h-[18rem] min-[400px]:w-[18rem] sm:-right-12 sm:bottom-[-20%] sm:h-[24rem] sm:w-[24rem] sm:blur-[90px] md:h-[26rem] md:w-[26rem] md:blur-[100px]"
          aria-hidden
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 py-16 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:gap-12 min-[400px]:py-20 sm:gap-12 sm:py-24 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:grid-cols-2 lg:gap-14 lg:py-28 lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
          <div className="min-w-0">
            <h1 className="mt-2 max-w-3xl font-[family-name:var(--font-space)] font-semibold leading-tight tracking-tight min-[400px]:mt-4">
              <span className="block text-[clamp(1.5rem,6vw+0.25rem,3rem)] text-[var(--accent)] sm:text-4xl lg:text-5xl">
                DefenseCodes
              </span>
              <span className="mt-2 block text-lg font-medium leading-snug text-white min-[400px]:text-xl sm:text-2xl lg:text-3xl">
                Strategic supply chain risk intelligence
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 min-[400px]:mt-6 sm:text-lg">
              Supply Chain Risk Analysis Reports for Defense, Space, and Aerospace.
              Executive summaries are free; the full report PDF unlocks after USDT
              payment (ERC-20 or BEP-20).
            </p>
            <div className="mt-8 flex min-w-0 flex-col gap-3 min-[400px]:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <WalletCta />
              <Link
                href="/reports"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10 sm:min-h-0"
              >
                View reports
              </Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/logo.png"
              alt="DefenseCodes"
              width={500}
              height={500}
              sizes="(max-width: 480px) 85vw, (max-width: 1024px) 320px, 400px"
              priority
              unoptimized
              className="h-auto w-full max-w-[min(100%,240px)] min-[400px]:max-w-[280px] sm:max-w-[300px] sm:drop-shadow-[0_0_48px_rgba(50,197,255,0.12)] md:max-w-[340px] lg:max-w-[min(100%,400px)] max-sm:mix-blend-lighten"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl pb-16 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:pb-20 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
          Sectors we cover
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Each deliverable combines supplier landscape mapping, stress scenarios, and
          Monte Carlo outputs you can brief engineering and programme leadership on.
        </p>
        <div className="mt-8 grid gap-5 min-[400px]:mt-10 min-[400px]:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <GlassPanel key={s.title} className="p-5 min-[400px]:p-6">
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
