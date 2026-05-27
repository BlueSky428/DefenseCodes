import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/glass-panel";
import { LandingCtas } from "@/components/landing-ctas";

export const metadata: Metadata = {
  title: "About DefenseCodes | Defense, Aerospace & Space Supply Chain Intelligence",
  description:
    "Learn about DefenseCodes, a strategic intelligence platform focused on defense, aerospace, and space supply chain risk analysis and operational visibility.",
};

const exposures = [
  "Sole-source supplier dependencies",
  "Export control restrictions",
  "Semiconductor bottlenecks",
  "Qualification constraints",
  "FOCI exposure",
  "Tier-2 and Tier-3 visibility gaps",
  "Composite manufacturing limitations",
  "Geopolitical disruptions",
];

const focusAreas = [
  {
    title: "Defense Supply Chain Intelligence",
    body: "Supplier concentration risks, export control exposure, semiconductor bottlenecks, and operational vulnerabilities across the Defense Industrial Base.",
    href: "/defense-supply-chain-risk-analysis-reports",
  },
  {
    title: "Space Supply Chain Risk Analysis",
    body: "Rad-hard electronics constraints, propulsion dependencies, launch infrastructure risks, and constellation-scale manufacturing exposure.",
    href: "/space-supply-chain-risk-analysis-reports",
  },
  {
    title: "Aerospace Manufacturing Intelligence",
    body: "Commercial aircraft supply chain vulnerabilities, autoclave capacity constraints, resin system dependencies, and Tier-2 production bottlenecks.",
    href: "/aerospace-supply-chain-risk-analysis-reports",
  },
];

const deliverables = [
  "Supplier landscape mapping",
  "Stress-scenario modelling",
  "Quantitative risk outputs",
  "Manufacturing dependency analysis",
  "Operational bottleneck identification",
  "Executive-ready intelligence frameworks",
];

const whyChoose = [
  {
    title: "Specialized Industry Focus",
    body: "Focused exclusively on defense, aerospace, and space supply chain intelligence across high-consequence industrial and manufacturing ecosystems.",
  },
  {
    title: "Quantitative Risk Intelligence",
    body: "Combines structured analytical frameworks, stress scenarios, and probabilistic modelling to evaluate operational and supply chain exposure.",
  },
  {
    title: "Executive-Ready Reporting",
    body: "Designed for procurement, manufacturing, investment, underwriting, engineering, and strategic programme leadership decision-making teams.",
  },
  {
    title: "High-Consequence Operational Visibility",
    body: "Built for organizations managing mission-critical industrial dependencies, production continuity challenges, and operational resilience risks.",
  },
];

const px =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]";

export default function AboutPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* ── Hero ── */}
      <section className={`mx-auto max-w-6xl py-16 min-[400px]:py-20 sm:py-24 ${px}`}>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl lg:text-5xl">
          About DefenseCodes
        </h1>
        <p className="mt-3 text-lg font-medium text-[var(--accent)]">
          Strategic Supply Chain Risk Intelligence for Defense, Aerospace, and Space
        </p>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
          DefenseCodes is a specialized intelligence platform focused on supply chain
          risk analysis across the defense, aerospace, and space sectors. We help
          organizations identify operational vulnerabilities, supplier concentration
          risks, export control exposure, manufacturing bottlenecks, and strategic
          dependencies impacting mission-critical industrial ecosystems.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
          Our intelligence reports are designed for organizations operating within
          high-consequence environments where supplier failures, qualification delays,
          semiconductor shortages, or constrained manufacturing capacity can
          materially affect programme execution, operational continuity, and long-term
          resilience.
        </p>
      </section>

      {/* ── Built Around Defense Industrial Realities ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Built Around Defense Industrial Realities
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          Modern defense and aerospace supply chains are increasingly exposed to:
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {exposures.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-slate-400">
          <p>
            DefenseCodes was created to help organizations understand and quantify
            these vulnerabilities through structured supply chain intelligence and
            quantitative risk analysis.
          </p>
          <p>
            Our work focuses on the operational realities shaping the Defense
            Industrial Base (DIB), commercial aerospace manufacturing ecosystems,
            and advanced space industry supply chains.
          </p>
        </div>
      </section>

      {/* ── Focus Areas ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Our Focus Areas
        </h2>
        <div className="mt-8 grid gap-5 min-[400px]:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area) => (
            <GlassPanel key={area.title} className="flex flex-col p-5 min-[400px]:p-6">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-[var(--accent)] sm:text-lg">
                {area.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                {area.body}
              </p>
              <Link
                href={area.href}
                className="mt-4 text-sm font-semibold text-[var(--accent)] transition hover:brightness-125"
              >
                Learn More →
              </Link>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ── What We Deliver ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          What We Deliver
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-400">
          DefenseCodes produces Supply Chain Risk Analysis Reports combining:
        </p>
        <ul className="mt-5 space-y-2">
          {deliverables.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">
          Our reports help organizations improve visibility into complex industrial
          ecosystems while supporting strategic planning, procurement analysis,
          investment due diligence, and operational risk assessment.
        </p>
      </section>

      {/* ── Why Choose DefenseCodes ── */}
      <section className={`mx-auto max-w-6xl pb-16 min-[400px]:pb-20 ${px}`}>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl lg:text-3xl">
          Why Choose DefenseCodes
        </h2>
        <div className="mt-8 grid gap-5 min-[400px]:gap-6 sm:grid-cols-2">
          {whyChoose.map((item) => (
            <GlassPanel key={item.title} className="p-5 min-[400px]:p-6">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold text-[var(--accent)] sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className={`mx-auto max-w-6xl pb-20 min-[400px]:pb-24 lg:pb-32 ${px}`}>
        <GlassPanel className="p-8 sm:p-10 lg:p-12">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
            Access Strategic Supply Chain Intelligence
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            DefenseCodes provides executive summaries free of charge, with full
            intelligence reports securely unlocked through USDT payment
            infrastructure supporting ERC-20 and BEP-20 compatible wallets.
          </p>
          <LandingCtas showNewsletter />
        </GlassPanel>
      </section>
    </div>
  );
}
