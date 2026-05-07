import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#060914]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 py-10 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
        <p className="text-sm text-slate-400">
          © 2026 Defense.Codes. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-6 text-sm text-slate-300">
          <Link
            href="/terms"
            className="transition-colors hover:text-[var(--accent)]"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="transition-colors hover:text-[var(--accent)]"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
