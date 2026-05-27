import type { Metadata } from "next";
import { GlassPanel } from "@/components/glass-panel";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "Defense Supply Chain Risk Analysis Reports | DefenseCodes",
  description:
    "Access Defense Supply Chain Risk Analysis Reports covering supplier vulnerabilities, export controls, bottlenecks, FOCI risks, and manufacturing constraints.",
};

const deliverables = [
  {
    title: "Defense Supplier Mapping",
    items: [
      "Single-source supplier exposure",
      "Supplier concentration risks",
      "Tier-N visibility gaps",
      "Production bottlenecks",
    ],
    body: "Gain visibility into critical supplier ecosystems across the Defense Industrial Base, including Tier-1, Tier-2, and Tier-3 dependencies.",
  },
  {
    title: "Quantitative Risk Analysis",
    items: [
      "Stress-scenario modelling",
      "Operational disruption analysis",
      "Supply chain resilience scoring",
      "Strategic sourcing exposure",
    ],
    body: "Structured scenario modelling and Monte Carlo outputs designed to evaluate operational exposure and supply chain resilience.",
  },
  {
    title: "Export Control & FOCI Intelligence",
    items: [
      "ITAR-related dependencies",
      "FOCI exposure analysis",
      "Cross-border supplier risks",
      "Export-controlled components",
    ],
    body: "Analyze geopolitical and regulatory risks impacting defense manufacturing and supplier ecosystems.",
  },
  {
    title: "Semiconductor & Manufacturing Constraints",
    items: [
      "Semiconductor bottlenecks",
      "Qualification lead times",
      "Composite manufacturing constraints",
      "Electronics sourcing dependencies",
    ],
    body: "Assess constrained industrial capabilities affecting defense electronics and advanced manufacturing programmes.",
  },
];

const audiences = [
  "Chief Supply Chain Officers",
  "Defense programme leadership teams",
  "Aerospace manufacturing executives",
  "Strategic procurement leaders",
  "Defense-focused private equity firms",
  "Aerospace & defense underwriting teams",
  "National security investment analysts",
];

const faqs = [
  {
    q: "What is a Defense Supply Chain Risk Analysis Report?",
    a: "A DefenseCodes intelligence report designed to identify operational vulnerabilities, supplier concentration risks, qualification bottlenecks, export control exposure, and manufacturing dependencies across defense industrial supply chains.",
  },
  {
    q: "Who are the reports designed for?",
    a: "Defense contractors, aerospace manufacturers, strategic procurement teams, investors, underwriting organizations, and executive leadership operating within the Defense Industrial Base.",
  },
  {
    q: "What types of risks are analyzed?",
    a: "Reports analyze: sole-source supplier exposure, semiconductor bottlenecks, export control risks, FOCI exposure, qualification constraints, manufacturing bottlenecks, obsolescence risks, and Tier-N supplier vulnerabilities.",
  },
  {
    q: "Are executive summaries publicly accessible?",
    a: "Yes. Executive summaries are available free and provide an overview of strategic findings and supply chain risk themes.",
  },
  {
    q: "How are full reports unlocked?",
    a: "Full intelligence reports unlock securely through USDT payment infrastructure supporting ERC-20 and BEP-20 compatible wallets.",
  },
];

const px =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]";

export default function DefenseReportsPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className={`mx-auto max-w-6xl py-16 min-[400px]:py-20 sm:py-24 ${px}`}>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl lg:text-5xl">
          Defense Supply Chain Risk Analysis Reports
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Identify critical defense supply chain vulnerabilities before they disrupt
          mission-critical programmes. Our reports help defense contractors,
          programme leadership teams, procurement executives, investors, and
          underwriters identify mission-critical supply chain vulnerabilities before
          they impact readiness, delivery schedules, or programme execution.
        </p>
        <LandingCtas />
      </section>

      {/* ── Buy section ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Buy Defense Supply Chains Risk Intelligence Report
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Modern defense programmes rely on fragile supplier ecosystems exposed to
            export controls, semiconductor shortages, qualification bottlenecks, FOCI
            risks, and constrained manufacturing capacity across the Defense Industrial
            Base (DIB).
          </p>
          <p>
            Limited visibility into Tier-2 and Tier-3 suppliers makes it difficult to
            identify hidden vulnerabilities before they disrupt weapon system
            production, aerospace programmes, sustainment operations, and mission
            readiness.
          </p>
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-slate-400">
          DefenseCodes helps organizations assess:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {[
            "Supplier concentration and sole-source risks",
            "Semiconductor and electronics exposure",
            "Export-controlled dependencies",
            "Qualification and production bottlenecks",
            "Geopolitical supply chain vulnerabilities",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <LandingCtas />
      </section>

      {/* ── What Reports Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What DefenseCodes Reports Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Our Defense Supply Chain Risk Analysis Reports help defense, aerospace, and
          space organizations identify supplier vulnerabilities, operational
          bottlenecks, export control exposure, and strategic manufacturing risks
          across mission-critical supply chains.
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
            Built for Defense Industry Decision Makers
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
            DefenseCodes supports organizations requiring strategic visibility into
            defense industrial vulnerabilities and supplier ecosystem exposure.
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
          <LandingCtas />
        </GlassPanel>
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
            Buy Defense Supply Chain Risk Analysis Report
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Access strategic intelligence covering supplier concentration risks,
            semiconductor bottlenecks, export control exposure, qualification
            constraints, and manufacturing dependencies across the Defense Industrial
            Base. Executive summaries are available free. Unlock full Defense Supply
            Chain Risk Analysis Reports through secure USDT payment infrastructure.
          </p>
          <LandingCtas />
        </GlassPanel>
      </section>
    </div>
  );
}
