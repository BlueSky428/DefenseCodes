import { notFound } from "next/navigation";
import { reports as builtinReports } from "@/data/reports";
import { mergeReportFromDb } from "@/lib/report-overrides";
import { resolveReportBySlug } from "@/lib/reports-catalog";
import { ReportDetail } from "@/components/report-detail";
import { ReportAccessGate } from "@/components/report-access-gate";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams() {
  return builtinReports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const report = await resolveReportBySlug(slug);
  if (!report) return { title: "Report | defense.codes" };
  return { title: `${report.title} | defense.codes` };
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = await resolveReportBySlug(slug);
  if (!base) notFound();
  const report = await mergeReportFromDb(base);

  return (
    <ReportAccessGate>
      <ReportDetail report={report} />
    </ReportAccessGate>
  );
}
