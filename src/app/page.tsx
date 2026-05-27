import type { Metadata } from "next";
import Image from "next/image";
import { GlassPanel } from "@/components/glass-panel";
import { HeroCtas } from "@/components/hero-ctas";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "DefenseCodes | Supply Chain Risk Intelligence Reports",
  description:
    "DefenseCodes delivers premium Supply Chain Risk Analysis Reports for the defense, aerospace, and space sectors. Our reports help engineering, programme, investment, and underwriting teams identify supplier vulnerabilities, bottlenecks, qualification risks, export control exposure, and single-source dependencies before they disrupt mission-critical operations. Executive summaries are available free. Full intelligence reports are unlocked securely via USDT payment in ERC-20 or BEP-20.",
};

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

const deliverables = [
  {
    title: "Supplier Landscape Mapping",
    body: "Gain visibility into Tier-1, Tier-2, and Tier-3 supplier ecosystems, including concentration risks, sole-source dependencies, and constrained manufacturing nodes.",
  },
  {
    title: "Quantitative Risk Modelling",
    body: "Scenario-driven analysis supported by Monte Carlo simulations to evaluate operational exposure, delivery risk, and supply chain resilience under disruption events.",
  },
  {
    title: "Compliance & Strategic Exposure Intelligence",
    body: "Assess risks associated with export controls, FOCI exposure, DFARS and CMMC supply chain requirements, qualification bottlenecks, and obsolescence and end-of-life components.",
  },
  {
    title: "Executive-Level Reporting",
    body: "Structured intelligence designed for engineering, programme, investment, procurement, underwriting, and strategic leadership teams managing complex defense supply chain risks.",
  },
];

const faqs = [
  {
    q: "What is a DefenseCodes Supply Chain Risk Analysis Report?",
    a: "A DefenseCodes Supply Chain Risk Analysis Report is a strategic intelligence deliverable designed to identify vulnerabilities, bottlenecks, qualification risks, supplier concentration issues, and geopolitical exposure across defense, aerospace, and space supply chains.",
  },
  {
    q: "Who uses DefenseCodes reports?",
    a: "DefenseCodes reports are designed for defense contractors, aerospace manufacturers, space industry operators, investment firms, insurers, procurement teams, and executive leadership responsible for managing supply chain exposure.",
  },
  {
    q: "What risks do the reports analyze?",
    a: "Reports analyze risks including: single-source supplier exposure, semiconductor shortages, export control constraints, FOCI risks, obsolescence and end-of-life components, qualification bottlenecks, manufacturing capacity limitations, and Tier-N supplier visibility challenges.",
  },
  {
    q: "Are executive summaries free?",
    a: "Yes. Executive summaries are publicly available and provide an overview of the report findings and strategic themes.",
  },
  {
    q: "How do I access the full report PDFs?",
    a: "Full reports unlock after USDT payment using ERC-20 or BEP-20 compatible wallets.",
  },
];

const px =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]";

export default function HomePage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className="relative isolate">
        <div
          className="pointer-events-none absolute -left-24 top-[-8%] h-[18rem] w-[18rem] rounded-full bg-[var(--accent)]/20 blur-[72px] min-[400px]:-left-28 min-[400px]:h-[22rem] min-[400px]:w-[22rem] sm:-left-24 sm:top-[-10%] sm:h-[30rem] sm:w-[30rem] sm:blur-[100px] md:h-[34rem] md:w-[34rem] md:blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 bottom-[-15%] h-[14rem] w-[14rem] rounded-full bg-cyan-500/10 blur-[64px] min-[400px]:h-[18rem] min-[400px]:w-[18rem] sm:-right-12 sm:bottom-[-20%] sm:h-[24rem] sm:w-[24rem] sm:blur-[90px] md:h-[26rem] md:w-[26rem] md:blur-[100px]"
          aria-hidden
        />
        <div
          className={`mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 py-16 min-[400px]:gap-12 min-[400px]:py-20 sm:gap-12 sm:py-24 lg:grid-cols-2 lg:gap-14 lg:py-28 ${px}`}
        >
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
              DefenseCodes delivers premium Supply Chain Risk Analysis Reports for
              the defense, aerospace, and space sectors. Our reports help
              engineering, programme, investment, and underwriting teams identify
              supplier vulnerabilities, bottlenecks, qualification risks, export
              control exposure, and single-source dependencies before they disrupt
              mission-critical operations.
              <br className="mt-3 block" />
              Executive summaries are available free. Full intelligence reports are
              unlocked securely via USDT payment in ERC-20 or BEP-20.
            </p>
            <HeroCtas />
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

      {/* ── Trusted Intelligence ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Trusted Intelligence for High-Stakes Supply Chains
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Modern defense and aerospace programmes depend on deeply interconnected
            supplier networks exposed to geopolitical shocks, export controls,
            semiconductor shortages, obsolescence risks, and foreign ownership
            concerns.
          </p>
          <p>
            DefenseCodes provides quantitative supply chain risk intelligence
            designed for organizations operating across the Defense Industrial Base
            (DIB), aerospace manufacturing, and advanced space systems.
          </p>
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Our reports support:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {[
            "Chief Supply Chain Officers",
            "Programme leadership teams",
            "Defense investors and private equity firms",
            "Aerospace and defense underwriters",
            "Strategic sourcing and procurement leaders",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <LandingCtas />
      </section>

      {/* ── Sectors we cover — UNTOUCHED ── */}
      <section
        className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}
      >
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

      {/* ── What Our Reports Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What Our Supply Chain Risk Reports Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Each Supply Chain Risk Analysis Report combines supplier landscape
          mapping, stress scenario modelling, and quantitative risk analysis to
          help organizations identify critical vulnerabilities across multi-tier
          supply chains.
        </p>
        <div className="mt-8 grid gap-5 min-[400px]:mt-10 min-[400px]:gap-6 sm:grid-cols-2">
          {deliverables.map((d) => (
            <GlassPanel key={d.title} className="p-5 min-[400px]:p-6">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-[var(--accent)] sm:text-lg">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {d.body}
              </p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          FAQ
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="border-b border-white/10 pb-6 last:border-0"
            >
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-white sm:text-lg">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className={`mx-auto max-w-6xl pb-20 min-[400px]:pb-24 lg:pb-32 ${px}`}
      >
        <GlassPanel className="p-8 sm:p-10 lg:p-12">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
            Supply Chain Risk Analysis Report for Defense, Aerospace, and Space
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Identify vulnerabilities before they disrupt programmes, investments,
            manufacturing schedules, or operational readiness. Access executive
            summaries or unlock full intelligence reports today.
          </p>
          <LandingCtas showNewsletter />
        </GlassPanel>
      </section>
    </div>
  );
}
