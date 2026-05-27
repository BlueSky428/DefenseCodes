import type { Metadata } from "next";
import { GlassPanel } from "@/components/glass-panel";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "Aerospace Supply Chain Risk Analysis Reports | DefenseCodes",
  description:
    "Access Aerospace Supply Chain Risk Analysis Reports covering supplier bottlenecks, autoclave constraints, resin systems, and manufacturing risks.",
};

const deliverables = [
  {
    title: "Aerospace Supplier Mapping",
    body: "Identify critical supplier dependencies, constrained production nodes, and Tier-N visibility gaps across aerospace manufacturing ecosystems.",
    items: [
      "Tier-2 supplier exposure",
      "Supplier concentration risks",
      "Sole-source dependencies",
      "Production bottlenecks",
    ],
  },
  {
    title: "Composite Manufacturing & Autoclave Constraints",
    body: "Assess operational risks tied to advanced aerospace manufacturing infrastructure and composite production systems.",
    items: [
      "Autoclave capacity limitations",
      "Composite manufacturing exposure",
      "Aerospace-grade material constraints",
      "Production pacing dependencies",
    ],
  },
  {
    title: "Resin Systems & Material Supply Risks",
    body: "Analyze vulnerabilities across specialized aerospace material and chemical supply ecosystems.",
    items: [
      "Resin system dependencies",
      "Aerospace material shortages",
      "Specialty chemical exposure",
      "Qualification lead times",
    ],
  },
  {
    title: "Quantitative Aerospace Supply Chain Intelligence",
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
  "Commercial aircraft manufacturers",
  "Aerospace suppliers",
  "Procurement leaders",
  "Aerospace investors",
  "Underwriting teams",
  "Manufacturing executives",
  "Strategic programme leadership",
];

const fullReportIncludes = [
  "Supplier ecosystem analysis",
  "Quantitative risk outputs",
  "Manufacturing dependency mapping",
  "Composite production intelligence",
  "Strategic sourcing analysis",
  "Executive-ready reporting frameworks",
];

const faqs = [
  {
    q: "What is an Aerospace Supply Chain Risk Analysis Report?",
    a: "A strategic intelligence report designed to identify supplier vulnerabilities, manufacturing bottlenecks, material dependencies, and operational risks across commercial aerospace supply chains.",
  },
  {
    q: "Who are these reports designed for?",
    a: "Commercial aircraft manufacturers, aerospace suppliers, procurement leaders, investors, underwriting teams, and manufacturing executives.",
  },
  {
    q: "What risks are analyzed?",
    a: "Reports analyze: supplier concentration risks, autoclave capacity constraints, resin system dependencies, aerospace material shortages, manufacturing bottlenecks, qualification lead times, operational vulnerabilities, and Tier-N supplier exposure.",
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

export default function AerospaceReportsPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className={`mx-auto max-w-6xl py-16 min-[400px]:py-20 sm:py-24 ${px}`}>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl lg:text-5xl">
          Aerospace Supply Chain Risk Analysis Reports
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          DefenseCodes delivers Aerospace Supply Chain Risk Analysis Reports for
          organizations operating across commercial aircraft manufacturing and
          advanced aerospace production ecosystems. Our reports help aerospace
          manufacturers, suppliers, investors, and procurement teams identify
          supplier vulnerabilities, production bottlenecks, qualification
          constraints, and manufacturing dependencies impacting operational
          continuity. Executive summaries are free. Full intelligence reports
          unlock securely through USDT payment via ERC-20 and BEP-20 compatible
          wallets.
        </p>
        <LandingCtas />
      </section>

      {/* ── Buy section ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Buy Aerospace Supply Chains Risks Analysis Report
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Modern aerospace manufacturing depends on highly specialized supplier
            ecosystems exposed to constrained production capacity, long qualification
            cycles, and fragile material sourcing networks.
          </p>
          <p>
            Autoclave capacity limitations, resin system dependencies,
            aerospace-grade material shortages, and Tier-2 supplier bottlenecks
            continue to create operational risks capable of disrupting:
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {[
            "Commercial aircraft production schedules",
            "Composite manufacturing operations",
            "Aircraft delivery timelines",
            "Aerospace supplier continuity",
            "Production ramp-up initiatives",
            "Long-term manufacturing resilience",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">
          DefenseCodes helps organizations identify and quantify these
          vulnerabilities before they impact programme execution and manufacturing
          performance.
        </p>
      </section>

      {/* ── What Reports Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What DefenseCodes Reports Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Our Aerospace Supply Chain Risk Analysis Reports provide structured
          intelligence covering manufacturing exposure, constrained supplier
          ecosystems, and operational bottlenecks across commercial aerospace
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
            Built for Aerospace Industry Decision Makers
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
            DefenseCodes supports organizations requiring strategic visibility into
            operational and manufacturing risks across commercial aerospace supply
            chains.
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
          Access Aerospace Supply Chain Intelligence Reports
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Executive summaries provide high-level visibility into operational
          vulnerabilities, supplier bottlenecks, and manufacturing risks across
          commercial aerospace supply chains.
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
            Strategic Aerospace Supply Chain Intelligence Starts Here
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Identify supplier vulnerabilities, manufacturing bottlenecks, and
            operational risks before they disrupt commercial aircraft production and
            aerospace programme delivery.
          </p>
          <LandingCtas showNewsletter />
        </GlassPanel>
      </section>
    </div>
  );
}
