/** PDFs shipped under `public/case-study/` — free download, no auth. */
export type CaseStudyStaticPdf = {
  href: string;
  title: string;
  downloadFilename: string;
  subtitle: string;
  sector: "Defense" | "Space" | "Aerospace";
  description: string;
};

export const CASE_STUDY_STATIC_PDFS: readonly CaseStudyStaticPdf[] = [
  {
    href: "/case-study/DC_CaseStudy_NSIL_Fixed.pdf",
    title: "NewSpace India Limited",
    subtitle: "NSIL",
    downloadFilename: "DefenseCodes-CaseStudy-NSIL.pdf",
    sector: "Space",
    description:
      "Supply chain risk analysis covering satellite manufacturing dependencies, launch infrastructure constraints, and procurement exposure across NSIL's commercial space programme.",
  },
  {
    href: "/case-study/DC_CaseStudy_TurionSpace_Fixed.pdf",
    title: "Turion Space",
    subtitle: "TURION SPACE",
    downloadFilename: "DefenseCodes-CaseStudy-Turion-Space.pdf",
    sector: "Space",
    description:
      "Operational vulnerability assessment spanning propulsion systems, rad-hard electronics sourcing, and constellation-scale supplier concentration risks.",
  },
  {
    href: "/case-study/DC_CaseStudy_Hensoldt_Fixed.pdf",
    title: "HENSOLDT",
    subtitle: "HENSOLDT AG",
    downloadFilename: "DefenseCodes-CaseStudy-Hensoldt.pdf",
    sector: "Defense",
    description:
      "Defense electronics supply chain intelligence covering semiconductor bottlenecks, export control exposure, and FOCI-related risks across the sensor and optronics product lines.",
  },
  {
    href: "/case-study/DC_CaseStudy_TrueAnomaly_Fixed.pdf",
    title: "True Anomaly",
    subtitle: "TRUE ANOMALY",
    downloadFilename: "DefenseCodes-CaseStudy-True-Anomaly.pdf",
    sector: "Space",
    description:
      "Strategic risk assessment of space domain awareness supply chains, including qualification bottlenecks, sole-source exposure, and manufacturing dependencies in emerging space systems.",
  },
  {
    href: "/case-study/DC_CaseStudy_KNDS_Fixed.pdf",
    title: "KNDS",
    subtitle: "KNDS GROUP",
    downloadFilename: "DefenseCodes-CaseStudy-KNDS.pdf",
    sector: "Defense",
    description:
      "Multi-tier supplier vulnerability analysis for armoured vehicle and artillery programmes, covering Tier-2 visibility gaps, production bottlenecks, and cross-border regulatory exposure.",
  },
] as const;
