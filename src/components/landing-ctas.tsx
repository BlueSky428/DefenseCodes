"use client";

import { ViewReportsCta } from "@/components/wallet-cta";

const btnPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_28px_rgba(0,229,255,0.3)] transition hover:brightness-110";

const btnSecondary =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10";

export function LandingCtas({
  showNewsletter = false,
}: {
  showNewsletter?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <ViewReportsCta className={btnPrimary} />
      {showNewsletter && (
        <a
          href="https://newsletter.defense.codes"
          target="_blank"
          rel="noopener noreferrer"
          className={btnSecondary}
        >
          Subscribe to Newsletter
        </a>
      )}
    </div>
  );
}
