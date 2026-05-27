import type { Metadata } from "next";
import { GlassPanel } from "@/components/glass-panel";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "Aerospace Defense Due Diligence Reports | DefenseCodes",
  description:
    "Access Aerospace Defense Due Diligence Reports covering defense investment risk analysis, supplier vulnerabilities, export controls, and manufacturing constraints.",
};

const deliverables = [
  {
    title: "Supplier & Manufacturing Dependency Analysis",
    body: "Identify supplier concentration risks, constrained production nodes, and single-source manufacturing exposure across aerospace and defense supply chains.",
    items: [
      "Tier-2 and Tier-3 visibility",
      "Sole-source supplier exposure",
      "Manufacturing bottlenecks",
      "Production dependency mapping",
    ],
  },
  {
    title: "Defense Investment Risk Analysis",
    body: "Evaluate operational vulnerabilities capable of impacting programme stability, revenue continuity, and enterprise performance.",
    items: [
      "Programme disruption exposure",
      "Supply chain resilience gaps",
      "Strategic sourcing risks",
      "Operational dependency analysis",
    ],
  },
  {
    title: "Export Control & Regulatory Exposure",
    body: "Assess geopolitical and compliance-related risks affecting aerospace and defense operations.",
    items: [
      "ITAR-related dependencies",
      "Export-controlled components",
      "FOCI exposure analysis",
      "Cross-border supplier risks",
    ],
  },
  {
    title: "Semiconductor & Qualification Constraints",
    body: "Analyze industrial bottlenecks impacting aerospace manufacturing and advanced defense systems.",
    items: [
      "Semiconductor supply risks",
      "Qualification lead times",
      "Electronics sourcing exposure",
      "Composite manufacturing constraints",
    ],
  },
];

const audiences = [
  "Private equity firms",
  "Venture capital investors",
  "Hedge funds",
  "Aerospace & defense underwriters",
  "Strategic acquisition teams",
  "Defense investment analysts",
  "Institutional due diligence teams",
];

const faqs = [
  {
    q: "What is an Aerospace Defense Due Diligence Report?",
    a: "A strategic intelligence report designed to identify operational, manufacturing, supplier, and regulatory risks impacting aerospace and defense organizations.",
  },
  {
    q: "Who are these reports designed for?",
    a: "Private equity firms, investors, underwriters, acquisition teams, and strategic decision-makers operating within the aerospace and defense sectors.",
  },
  {
    q: "What risks are analyzed?",
    a: "Reports analyze: supplier concentration risks, semiconductor exposure, manufacturing bottlenecks, export control dependencies, qualification constraints, FOCI exposure, operational vulnerabilities, and multi-tier supply chain risks.",
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

export default function DueDiligencePage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className={`mx-auto max-w-6xl py-16 min-[400px]:py-20 sm:py-24 ${px}`}>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl lg:text-5xl">
          Aerospace Defense Due Diligence Reports
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          DefenseCodes delivers Aerospace Defense Due Diligence Reports for
          investors, underwriters, and strategic teams assessing operational and
          supply chain risks across defense and aerospace organizations. Our reports
          analyze supplier concentration, export control exposure, semiconductor
          dependencies, qualification bottlenecks, and manufacturing constraints
          impacting programme stability and enterprise value.
        </p>
        <LandingCtas />
      </section>

      {/* ── Buy section ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Buy Aerospace Defense Due Diligence & Supply Chain Risk Intelligence Report
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Defense and aerospace organizations operate within highly specialized
            industrial ecosystems exposed to geopolitical disruption, constrained
            manufacturing capacity, export controls, and fragile supplier
            dependencies.
          </p>
          <p>
            Traditional financial due diligence often fails to uncover operational
            vulnerabilities hidden within Tier-2 and Tier-3 supplier networks,
            leaving investors and underwriting teams exposed to risks capable of
            impacting:
          </p>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {[
            "Programme delivery timelines",
            "Manufacturing continuity",
            "Contract execution",
            "Regulatory exposure",
            "Long-term operational resilience",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">
          DefenseCodes helps organizations identify and assess these vulnerabilities
          before they become material operational or investment risks.
        </p>
        <LandingCtas />
      </section>

      {/* ── What Reports Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What DefenseCodes Due Diligence Reports Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Our Aerospace Defense Due Diligence Reports combine supplier ecosystem
          analysis, operational risk intelligence, and strategic manufacturing
          visibility, designed for high-consequence investment and underwriting
          decisions.
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
            Built for Aerospace & Defense Decision Makers
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
            DefenseCodes supports organizations requiring strategic visibility into
            operational and supply chain risks across aerospace and defense
            investments.
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
            Strategic Intelligence for Aerospace & Defense Investment Decisions
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Identify operational vulnerabilities, supplier dependencies, and
            manufacturing risks before they impact acquisitions, underwriting
            decisions, or programme stability.
          </p>
          <LandingCtas showNewsletter />
        </GlassPanel>
      </section>
    </div>
  );
}
