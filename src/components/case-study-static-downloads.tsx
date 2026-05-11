import { GlassPanel } from "@/components/glass-panel";
import { CASE_STUDY_STATIC_PDFS } from "@/data/case-study-static-pdfs";

export function CaseStudyStaticDownloads() {
  return (
    <GlassPanel className="p-6 min-[400px]:p-8 sm:p-10">
      <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
        Case Study Library
      </h1>

      <ul className="mt-6 space-y-3">
        {CASE_STUDY_STATIC_PDFS.map((item) => (
          <li
            key={item.href}
            className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={item.href}
                download={item.downloadFilename}
                className="inline-flex items-center justify-center rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-2 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/25"
              >
                Download PDF
              </a>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-white/10 bg-[#070b18]/60 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-[var(--accent)]/40"
              >
                Open in browser
              </a>
            </div>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
