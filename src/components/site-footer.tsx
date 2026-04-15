import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#060914]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-slate-400">
          © 2026 Emre Yusuf. All rights reserved.
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
