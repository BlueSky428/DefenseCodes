import { GlassPanel } from "@/components/glass-panel";
import { CASE_STUDY_STATIC_PDFS } from "@/data/case-study-static-pdfs";

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CaseStudyStaticDownloads() {
  return (
    <div>
      {/* ── Page header ── */}
      <div className="mb-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Free Intelligence
        </p>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-semibold tracking-tight text-white min-[400px]:text-4xl">
          Case Studies
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
          Real-world supply chain risk analysis across the defense, aerospace, and
          space sectors. All case studies are publicly available — no wallet
          required.
        </p>
        <div className="mt-6 h-px w-16 bg-[var(--accent)]/40" />
      </div>

      {/* ── Card grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
        {CASE_STUDY_STATIC_PDFS.map((item) => (
          <GlassPanel
            key={item.href}
            className="group flex flex-col overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
          >
            {/* Thin accent top rule */}
            <div className="h-px w-full bg-gradient-to-r from-[var(--accent)]/50 via-[var(--accent)]/20 to-transparent" />

            <div className="flex flex-1 flex-col p-6">
              {/* Sector label */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {item.sector}
              </p>

              {/* Title */}
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-lg font-semibold leading-snug text-white">
                {item.title}
              </h2>

              {/* Description */}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {item.description}
              </p>

              {/* Divider */}
              <div className="mb-4 mt-5 h-px bg-white/[0.06]" />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={item.href}
                  download={item.downloadFilename}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-[#0A0F1F] shadow-[0_0_16px_rgba(0,229,255,0.2)] transition hover:brightness-110"
                >
                  <DownloadIcon />
                  Download PDF
                </a>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                >
                  <ExternalIcon />
                  Open in browser
                </a>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
