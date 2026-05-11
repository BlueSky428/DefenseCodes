/** PDFs shipped under `public/case-study/` — free download, no auth. */
export type CaseStudyStaticPdf = {
  href: string;
  title: string;
  downloadFilename: string;
};

export const CASE_STUDY_STATIC_PDFS: readonly CaseStudyStaticPdf[] = [
  {
    href: "/case-study/DC_CaseStudy_NSIL_Fixed.pdf",
    title: "NEWSPACE INDIA LIMITED",
    downloadFilename: "DefenseCodes-CaseStudy-NSIL.pdf",
  },
  {
    href: "/case-study/DC_CaseStudy_TurionSpace_Fixed.pdf",
    title: "TURION SPACE",
    downloadFilename: "DefenseCodes-CaseStudy-Turion-Space.pdf",
  },
  {
    href: "/case-study/DC_CaseStudy_Hensoldt_Fixed.pdf",
    title: "HENSOLDT",
    downloadFilename: "DefenseCodes-CaseStudy-Hensoldt.pdf",
  },
  {
    href: "/case-study/DC_CaseStudy_TrueAnomaly_Fixed.pdf",
    title: "TRUE ANOMALY",
    downloadFilename: "DefenseCodes-CaseStudy-True-Anomaly.pdf",
  },
  {
    href: "/case-study/DC_CaseStudy_KNDS_Fixed.pdf",
    title: "KNDS",
    downloadFilename: "DefenseCodes-CaseStudy-KNDS.pdf",
  },
] as const;
