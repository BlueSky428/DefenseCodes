import { getAddress } from "ethers";

export type ReportSector = "Space" | "Defense" | "Aerospace";

export type MonteCarloRow = { label: string; value: string; note?: string };

export type RecommendationRow = {
  priority: string;
  action: string;
  horizon: string;
};

export type Report = {
  id: string;
  slug: string;
  title: string;
  sector: ReportSector;
  date: string;
  riskHighlight: string;
  author: string;
  version: string;
  classification: string;
  methodology: string;
  pageCount: number;
  priceUsdt: number;
  /** Word deliverable (`public/reports/doc/`). */
  fullReportPath: string;
  /** PDF deliverable (`public/reports/pdf/`). */
  fullReportPdfPath: string;
  executiveSummary: string[];
  monteCarlo: MonteCarloRow[];
  recommendationsPreview: RecommendationRow[];
};

export const REPORT_PRICE_USDT = 199;

const ZERO = "0x0000000000000000000000000000000000000000";

/** Next inlines `NEXT_PUBLIC_*` only for static property access, not `process.env[key]`. */
function normalizePublicAddr(raw: string | undefined, fallback: string): string {
  const v = raw?.trim();
  if (!v || /^0x0{40}$/i.test(v)) return fallback;
  try {
    // Mixed-case env values must match EIP-55; all-lowercase is fine and gets checksummed here.
    return getAddress(v.toLowerCase());
  } catch {
    return fallback;
  }
}

export const DEFAULT_TREASURY = normalizePublicAddr(
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS,
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
);

export const DEFAULT_USDT_ADDRESS = normalizePublicAddr(
  process.env.NEXT_PUBLIC_USDT_ADDRESS,
  ZERO,
);

export const reports: Report[] = [
  {
    id: "radhard-fpga",
    slug: "radhard-fpga",
    title: "Rad-Hard FPGA Supply Chain Risk",
    sector: "Space",
    date: "March 2026",
    riskHighlight:
      "~48% Microchip market share · 34.9% 24-mo disruption probability · $312M P99 tail risk",
    author: "Emre Yusuf",
    version: "v1.1",
    classification: "RESTRICTED / COMMERCIAL IN CONFIDENCE",
    methodology:
      "Monte Carlo simulation (n=10,000), supplier database analysis, ITAR/EAR review, backtest validation (MAPE 34.9%).",
    pageCount: 48,
    priceUsdt: REPORT_PRICE_USDT,
    fullReportPath: "/reports/doc/01_Space_RadHard_FPGA_Risk_2026.docx",
    fullReportPdfPath: "/reports/pdf/01_Space_RadHard_FPGA_Risk_2026.pdf",
    executiveSummary: [
      "The rad-hard FPGA market is structurally concentrated in ways that create programme-level existential risk. Microchip Technology holds an estimated 48% global market share for space-qualified FPGAs: a single-point-of-failure with no near-term full-envelope substitute. The company’s primary rad-hard FPGA fabrication fabs are located in Gresham, Oregon (Fab 4) and Colorado Springs, Colorado (Fab 5), following the planned closure and sale of Tempe Fab 2 in 2025.",
      "Monte Carlo modelling (n=10,000, 24-month horizon) indicates a 34.9% probability of a programme-impacting disruption, with P99 tail risk of $312M for a typical 5-satellite constellation. The model is validated against seven historical events (2011-2025) with a mean absolute percentage error of 34.9%.",
      "Cross-series link (China REE cascade). A China rare-earth export restriction simultaneously affects FPGA NdFeB packaging materials (this report), Hall-effect thruster SmCo magnets (Report 02), directed energy beam-steering (Report 03), and hypersonic UHTC dopants (Report 04). China introduced export licensing restrictions on tungsten, tellurium, bismuth, indium, and molybdenum in February 2025, demonstrating active willingness to use critical mineral controls as geopolitical leverage. Combined cascade P99 across all four reports: estimated $2.1-2.8B.",
    ],
    monteCarlo: [
      { label: "Disruption probability (24m)", value: "34.9%", note: "Programme-impacting event" },
      { label: "Mean impact", value: "$47M", note: "Representative constellation" },
      { label: "P90 VaR", value: "$89M", note: "" },
      { label: "P99 tail risk", value: "$312M", note: "5-satellite constellation" },
    ],
    recommendationsPreview: [
      {
        priority: "CRITICAL",
        action:
          "Initiate NanoXplore NG-Ultra qualification: Gold Path (full ESCC, €2-4M) or Accelerated Path (compatibility study, €200-400K) depending on programme phase",
        horizon: "0-3 months",
      },
      {
        priority: "CRITICAL",
        action:
          "Commission full ITAR/EAR dependency audit: map every USML Cat. XV item and sub-tier supplier",
        horizon: "0-3 months",
      },
      {
        priority: "HIGH",
        action:
          "Establish tiered FIFO buffer: Gold ($80M / 12-mo) for primes; Silver ($40M + $5M Microchip prepayment) for startups",
        horizon: "3-9 months",
      },
    ],
  },
  {
    id: "satellite-propulsion",
    slug: "satellite-propulsion",
    title: "Satellite Propulsion Supply Chain Risk",
    sector: "Space",
    date: "March 2026",
    riskHighlight:
      "41.3% disruption probability · 3 global xenon suppliers · $389M P99 tail risk",
    author: "Emre Yusuf",
    version: "v1.1",
    classification: "RESTRICTED / COMMERCIAL IN CONFIDENCE",
    methodology:
      "Monte Carlo simulation (n=10,000), geopolitical scenario modelling, SPOF mapping, xenon fractionation capacity modelling.",
    pageCount: 48,
    priceUsdt: REPORT_PRICE_USDT,
    fullReportPath: "/reports/doc/02_Space_Satellite_Propulsion_Risk_2026.docx",
    fullReportPdfPath: "/reports/pdf/02_Space_Satellite_Propulsion_Risk_2026.pdf",
    executiveSummary: [
      "Satellite propulsion supply chains face acute vulnerabilities across three concurrent risk nodes: (1) xenon propellant scarcity driven by cryogenic distillation bottlenecks rather than raw production constraints; (2) SmCo rare-earth magnet dependency for Hall-effect thrusters with ~85% China-controlled supply subject to demonstrated export restriction precedent; and (3) hydrazine phase-out pressure under EU REACH regulations creating forced green-propellant transition timelines.",
      "Monte Carlo modelling projects a 41.3% annual disruption probability (the highest in this suite), with P90 impact of $134M and P99 tail risk of $389M for a representative LEO constellation operator.",
      "Cross-series link (rare-earth cascade). A China REE export restriction simultaneously impacts this report (SmCo magnets for HET thrusters), Report 01 (NdFeB FPGA packaging), Report 03 (DEW beam-steering), and Report 04 (UHTC dopants). China restricted tungsten, tellurium, bismuth, indium, and molybdenum exports in February 2025. The escalation precedent exists and is active.",
    ],
    monteCarlo: [
      { label: "Disruption probability (annual)", value: "41.3%", note: "Highest in suite" },
      { label: "P90 impact", value: "$134M", note: "LEO constellation operator" },
      { label: "P99 tail risk", value: "$389M", note: "" },
      { label: "Xenon allocation stress", value: "28%/yr", note: "Allocation event (modelled)" },
    ],
    recommendationsPreview: [
      {
        priority: "CRITICAL",
        action:
          "Execute xenon off-take agreements with Linde and Air Products: minimum 3-year term, fixed volume allocation; include Messer as tertiary fallback",
        horizon: "0-3 months",
      },
      {
        priority: "HIGH",
        action:
          "Establish SmCo magnet reserve: 24-month supply from non-China sources (Urban Mining Company USA; Less Common Metals UK)",
        horizon: "0-6 months",
      },
      {
        priority: "HIGH",
        action:
          "Qualify krypton for station-keeping; retain xenon for orbit-raising; begin Hall thruster re-validation on krypton",
        horizon: "3-12 months",
      },
    ],
  },
  {
    id: "directed-energy",
    slug: "directed-energy",
    title: "Directed Energy Weapon Systems Risk",
    sector: "Defense",
    date: "March 2026",
    riskHighlight:
      "29.4% 24-mo disruption probability · ~40% IPG Photonics HEL share · £445M P99 tail risk",
    author: "Emre Yusuf",
    version: "v1.1",
    classification: "RESTRICTED / COMMERCIAL IN CONFIDENCE",
    methodology:
      "Monte Carlo simulation (n=10,000); SPOF analysis; allied supply chain mapping; technology roadmap dependency analysis.",
    pageCount: 48,
    priceUsdt: REPORT_PRICE_USDT,
    fullReportPath: "/reports/doc/03_Defence_DirectedEnergy_Risk_2026.docx",
    fullReportPdfPath: "/reports/pdf/03_Defence_DirectedEnergy_Risk_2026.pdf",
    executiveSummary: [
      "Directed energy weapon programmes face a specific and underappreciated supply chain vulnerability: the qualification barrier. The dominant risk is not that fibre laser gain components will become unavailable; it is that switching suppliers requires requalifying the entire laser system to defence standards, a process that takes 18-36 months and costs $5-10M per programme. This “Qualification Trap” makes the current IPG Photonics concentration structurally stable but fragile.",
      "Correction from v1.0: IPG Photonics completed the sale of its Russian subsidiary IRE-Polus in August 2024 for $51M. The company has fully exited Russia, with manufacturing relocated to Germany, USA, Italy, and Poland. The risk is now framed as supply concentration and legacy IP heritage, not an active CFIUS review of a Russian subsidiary.",
      "Cross-series link (ITAR cascade). A US ITAR/EAR tightening event simultaneously impacts this report (GaN HPM amplifiers), Report 01 (rad-hard FPGA export licences), Report 02 (propulsion US-origin components), and Report 04 (hypersonic USML controls). Combined ITAR cascade P99 loss: estimated $1.8-2.4B.",
    ],
    monteCarlo: [
      { label: "Disruption probability (24m)", value: "29.4%", note: "" },
      { label: "IPG Photonics HEL share (est.)", value: "~40%", note: "Defence-class gain fibre" },
      { label: "P99 tail risk", value: "£445M", note: "" },
      { label: "Backtest MAPE", value: "36.1%", note: "Model calibration" },
    ],
    recommendationsPreview: [
      {
        priority: "CRITICAL",
        action:
          "Initiate Joint Qualification Programme (JQP) with DragonFire / HELIOS / HYDEF to co-qualify nLIGHT YB-series gain fibre (~$1.5-3M shared vs $5-10M each)",
        horizon: "0-6 months",
      },
      {
        priority: "HIGH",
        action:
          "Pre-position ITAR pre-authorisation licences for UK DragonFire and EU HYDEF; file DDTC pre-authorisation requests now",
        horizon: "0-3 months",
      },
      {
        priority: "HIGH",
        action:
          "Negotiate preferred supplier agreement with II-VI/Coherent for spectral beam combining optics; Jenoptik as qualified secondary",
        horizon: "3-12 months",
      },
    ],
  },
  {
    id: "hypersonic-glide",
    slug: "hypersonic-glide",
    title: "Hypersonic Glide Vehicle & Missile Risk",
    sector: "Defense",
    date: "March 2026",
    riskHighlight:
      "38.7% 24-mo disruption probability · ~4 C/C suppliers · 83% China tungsten · $1.1B P99 tail",
    author: "Emre Yusuf",
    version: "v1.1",
    classification: "RESTRICTED / COMMERCIAL IN CONFIDENCE",
    methodology:
      "Monte Carlo simulation (n=10,000); thermal protection system material mapping; ITAR/EAR assessment; CVI furnace capacity modelling.",
    pageCount: 48,
    priceUsdt: REPORT_PRICE_USDT,
    fullReportPath: "/reports/doc/04_Defence_Hypersonic_Risk_2026.docx",
    fullReportPdfPath: "/reports/pdf/04_Defence_Hypersonic_Risk_2026.pdf",
    executiveSummary: [
      "Hypersonic programmes face irreversible schedule risk from two structural vulnerabilities: carbon-carbon (C/C) composite furnace capacity constrained by a 6-18 month CVI processing cycle, and tungsten heavy alloy supply dominated ~83% by China, with active export restrictions already imposed in February 2025. The P99 tail risk of $1.1B is the highest single-domain figure in this portfolio.",
      "Live risk: China imposed export licensing requirements on tungsten (alongside tellurium, bismuth, indium, and molybdenum) in February 2025. This is not a theoretical scenario: the China tungsten choke point is an active restriction.",
      "The carbon-fibre / hypersonic nexus: Boeing/Airbus A350 and 777X production rate ramps (Report 05) directly compete for C/C composite CVI furnace capacity at Textron and GrafTech: the same suppliers serving LRHW Dark Eagle TPS production. A 10% OEM composite rate increase compresses hypersonic programme furnace slot availability, lengthening lead times by an estimated 6-14 months.",
    ],
    monteCarlo: [
      { label: "Disruption probability (24m)", value: "38.7%", note: "" },
      { label: "P99 tail risk", value: "$1.1B", note: "Highest in portfolio" },
      { label: "China tungsten (global mine production)", value: "83%", note: "USGS 2025" },
      { label: "Qualified C/C suppliers (est.)", value: "~4", note: "CVI bottleneck" },
    ],
    recommendationsPreview: [
      {
        priority: "CRITICAL",
        action:
          "Pre-purchase C/C CVI production slots 24-36 months ahead at Textron and GrafTech; coordinate with Report 05 to avoid A350/777X rate ramp consuming idle capacity",
        horizon: "0-3 months",
      },
      {
        priority: "CRITICAL",
        action:
          "Secure priority access to H.C. Starck/Plansee WHA inventory ($2-5M seed) and plan $20-40M DLA joint procurement for full 96-missile buffer where applicable",
        horizon: "0-3 months",
      },
      {
        priority: "HIGH",
        action:
          "Qualify Materion as secondary hafnium source; establish 12-month UHTC precursor reserve from ATI Metals",
        horizon: "3-6 months",
      },
    ],
  },
  {
    id: "aircraft-composites",
    slug: "aircraft-composites",
    title: "Commercial Aircraft Composites Risk",
    sector: "Aerospace",
    date: "March 2026",
    riskHighlight:
      "31.8% 24-mo disruption probability · >70% Toray/Teijin/Solvay CF share · $780M P99 tail risk",
    author: "Emre Yusuf",
    version: "v1.1",
    classification: "COMMERCIAL IN CONFIDENCE",
    methodology:
      "Monte Carlo simulation (n=10,000); Tier 1-3 supplier mapping; PAN precursor root-cause analysis; demand/capacity modelling.",
    pageCount: 48,
    priceUsdt: REPORT_PRICE_USDT,
    fullReportPath: "/reports/doc/05_Aerospace_Composites_Risk_2026.docx",
    fullReportPdfPath: "/reports/pdf/05_Aerospace_Composites_Risk_2026.pdf",
    executiveSummary: [
      "Commercial aerospace composites face a structural supply-demand imbalance driven by three concurrent forces: record OEM production rate ambitions, post-COVID supply chain reconstruction, and rising competition from defence and wind energy sectors for carbon fibre feedstock. The critical enabler of this vulnerability is polyacrylonitrile (PAN) precursor: a specialised acrylonitrile grade whose supply is tied to the broader acrylic fibre market, which is structurally shrinking.",
      "Monte Carlo modelling projects a 31.8% disruption probability with P90 impact of $312M and P99 tail risk of $780M for a representative OEM. The v1.1 model incorporates a Supplier Financial Distress vector (Teijin/Solvay, 12% probability over 24 months) in addition to supply shock and demand vectors.",
      "Hypersonic nexus: this report’s C/C composite and CVI furnace capacity constraint directly competes with Report 04’s hypersonic TPS demand at Textron and GrafTech. A 10% Boeing/Airbus A350/777X production rate increase compresses hypersonic CVI slot availability, extending LRHW and ARRW delivery timelines by 6-14 months, and vice versa.",
    ],
    monteCarlo: [
      { label: "Disruption probability (24m)", value: "31.8%", note: "" },
      { label: "P90 impact", value: "$312M", note: "Representative OEM" },
      { label: "P99 tail risk", value: "$780M", note: "" },
      {
        label: "Supplier financial distress (Teijin/Solvay)",
        value: "12%",
        note: "Bernoulli over 24 months",
      },
    ],
    recommendationsPreview: [
      {
        priority: "HIGH",
        action:
          "Negotiate 18-month PAN/prepreg inventory buffer with Toray under long-term pricing; include Hexcel 8552 prepreg in same negotiation",
        horizon: "0-6 months",
      },
      {
        priority: "HIGH",
        action:
          "Coordinate C/C CVI slot scheduling with Report 04 hypersonic programme offices at Textron and GrafTech; joint scheduling removes ~40% of capacity conflict",
        horizon: "3-12 months",
      },
      {
        priority: "HIGH",
        action:
          "Initiate domestic PAN precursor qualification with SGL Carbon and Dralon; approach UK ATI and EU Clean Aviation JU for match funding",
        horizon: "6-18 months",
      },
    ],
  },
];

export function getReportBySlug(slug: string): Report | undefined {
  return reports.find((r) => r.slug === slug);
}
