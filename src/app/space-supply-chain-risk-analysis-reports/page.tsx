import type { Metadata } from "next";
import { GlassPanel } from "@/components/glass-panel";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "Space Supply Chain Risk Analysis Reports | DefenseCodes",
  description:
    "Access Space Supply Chain Risk Analysis Reports covering satellite manufacturing risks, rad-hard electronics, launch dependencies, and semiconductor bottlenecks.",
};

const deliverables = [
  {
    title: "Space Supplier Mapping",
    body: "Identify critical supplier dependencies, constrained manufacturing nodes, and Tier-N visibility gaps across space industrial ecosystems.",
    items: [
      "Tier-2 and Tier-3 exposure",
      "Sole-source supplier risks",
      "Supplier concentration analysis",
      "Production bottlenecks",
    ],
  },
  {
    title: "Rad-Hard Electronics & Semiconductor Risk",
    body: "Assess vulnerabilities tied to constrained electronics and specialized semiconductor ecosystems supporting space systems.",
    items: [
      "Rad-hard electronics constraints",
      "Semiconductor sourcing risks",
      "Qualification lead times",
      "Legacy component exposure",
    ],
  },
  {
    title: "Launch & Propulsion Dependency Analysis",
    body: "Evaluate operational risks impacting launch infrastructure, propulsion systems, and constellation-scale deployment programmes.",
    items: [
      "Launch-window coupling risks",
      "Propulsion manufacturing exposure",
      "Constellation demand shocks",
      "Operational dependency analysis",
    ],
  },
  {
    title: "Quantitative Space Supply Chain Intelligence",
    body: "Structured scenario modelling and probabilistic risk analysis designed for executive and programme-level decision-making.",
    items: [
      "Stress-scenario modelling",
      "Operational disruption analysis",
      "Supply chain resilience scoring",
      "Strategic sourcing vulnerabilities",
    ],
  },
];

const audiences = [
  "Satellite manufacturers",
  "Space systems integrators",
  "Aerospace procurement leaders",
  "Launch infrastructure operators",
  "Space-focused investors",
  "Underwriting teams",
  "Strategic programme leadership",
];

const fullReportIncludes = [
  "Supplier ecosystem analysis",
  "Quantitative risk outputs",
  "Manufacturing dependency mapping",
  "Qualification bottleneck analysis",
  "Strategic sourcing intelligence",
  "Executive-ready reporting frameworks",
];

const faqs = [
  {
    q: "What is a Space Supply Chain Risk Analysis Report?",
    a: "A strategic intelligence report designed to identify supplier vulnerabilities, qualification bottlenecks, semiconductor dependencies, and operational risks across space industry supply chains.",
  },
  {
    q: "Who are these reports designed for?",
    a: "Satellite manufacturers, aerospace organizations, investors, launch infrastructure operators, procurement leaders, and strategic programme teams.",
  },
  {
    q: "What risks are analyzed?",
    a: "Reports analyze: supplier concentration risks, rad-hard electronics constraints, semiconductor bottlenecks, qualification lead times, launch infrastructure dependencies, propulsion manufacturing exposure, operational vulnerabilities, and Tier-N supplier risks.",
  },
  {
    q: "Are executive summaries free?",
    a: "Yes. Executive summaries are publicly accessible and provide an overview of strategic findings and operational risk themes.",
  },
  {
    q: "How are full reports unlocked?",
    a: "Full reports unlock securely through USDT payment using ERC-20 and BEP-20 compatible wallets.",
  },
];

const px =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]";

export default function SpaceReportsPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className={`mx-auto max-w-6xl py-16 min-[400px]:py-20 sm:py-24 ${px}`}>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl lg:text-5xl">
          Space Supply Chain Risk Analysis Reports
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          DefenseCodes delivers Space Supply Chain Risk Analysis Reports for
          organizations operating across satellite systems, propulsion
          technologies, launch infrastructure, and advanced space manufacturing
          ecosystems. Our reports help aerospace manufacturers, investors, and
          programme teams identify supplier vulnerabilities, qualification
          constraints, semiconductor bottlenecks, and manufacturing dependencies
          impacting space programme resilience and operational continuity.
        </p>
        <LandingCtas />
      </section>

      {/* ── Buy section ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Buy Space Industry Supply Chain Risk Intelligence Report
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Space programmes rely on highly specialized supplier networks exposed
            to qualification bottlenecks, rad-hard electronics shortages,
            launch-window dependencies, and constrained propulsion manufacturing
            capacity.
          </p>
          <p>
            Limited visibility into Tier-2 and Tier-3 suppliers can create hidden
            operational risks capable of disrupting:
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {[
            "Satellite deployment schedules",
            "Launch readiness timelines",
            "Constellation-scale production",
            "Space electronics sourcing",
            "Propulsion system manufacturing",
            "Mission-critical programme execution",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">
          DefenseCodes helps organizations identify and quantify these
          vulnerabilities before they impact operational performance and strategic
          programme delivery.
        </p>
        <LandingCtas />
      </section>

      {/* ── What Reports Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What DefenseCodes Reports Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Our Space Supply Chain Risk Analysis Reports provide structured
          intelligence covering operational vulnerabilities, constrained
          manufacturing ecosystems, and supplier exposure across space industry
          supply chains.
        </p>
        <div className="mt-8 grid gap-5 min-[400px]:gap-6 sm:grid-cols-2">
          {deliverables.map((d) => (
            <GlassPanel key={d.title} className="p-5 min-[400px]:p-6">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-[var(--accent)] sm:text-lg">
                {d.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{d.body}</p>
              <ul className="mt-3 space-y-1.5">
                {d.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ── Audience ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <GlassPanel className="p-8 sm:p-10">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
            Built for Space Industry Decision Makers
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
            DefenseCodes supports organizations requiring strategic visibility into
            operational and manufacturing risks across modern space supply chains.
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Designed for:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {audiences.map((a) => (
              <li key={a} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {a}
              </li>
            ))}
          </ul>
        </GlassPanel>
      </section>

      {/* ── Access Reports ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Access Space Supply Chain Intelligence Reports
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Executive summaries provide high-level visibility into operational
          vulnerabilities, supplier bottlenecks, and strategic manufacturing risks
          across space industry supply chains.
        </p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Full PDF reports include:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {fullReportIncludes.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <LandingCtas />
      </section>

      {/* ── FAQ ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          FAQs
        </h2>
        <div className="mt-8 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-white/10 pb-6 last:border-0">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-white sm:text-lg">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className={`mx-auto max-w-6xl pb-20 min-[400px]:pb-24 lg:pb-32 ${px}`}>
        <GlassPanel className="p-8 sm:p-10 lg:p-12">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
            Strategic Space Supply Chain Intelligence Starts Here
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Identify supplier vulnerabilities, manufacturing bottlenecks, and
            operational risks before they disrupt mission-critical space
            programmes.
          </p>
          <LandingCtas showNewsletter />
        </GlassPanel>
      </section>
    </div>
  );
}
