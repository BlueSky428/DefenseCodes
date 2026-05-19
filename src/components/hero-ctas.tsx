"use client";

import Link from "next/link";
import { ViewReportsCta } from "@/components/wallet-cta";

const btnPrimary =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#0A0F1F] shadow-[0_0_28px_rgba(0,229,255,0.3)] transition hover:brightness-110 sm:min-h-0 sm:w-auto";

const btnSecondary =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/50 hover:bg-white/10 sm:min-h-0 sm:w-auto";

export function HeroCtas() {
  return (
    <div className="mt-8 flex min-w-0 flex-col gap-3 min-[400px]:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
      <a
        href="https://newsletter.defense.codes"
        target="_blank"
        rel="noopener noreferrer"
        className={btnSecondary}
      >
        Newsletters
      </a>
      <Link href="/case-study" className={btnSecondary}>
        Case Studies
      </Link>
      <ViewReportsCta className={btnPrimary} />
    </div>
  );
}
