import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#060914]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 py-10 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:flex-row lg:items-start lg:justify-between lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
        <div className="space-y-1.5 text-sm text-slate-400">
          <p>Defense.Codes is a DBA of:</p>
          <Link
            href="https://capa.cloud"
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
            aria-label="Visit capa.cloud"
          >
            <Image
              src="/capacloud-logo.png?v=2"
              alt="CapaCloud logo"
              width={120}
              height={120}
              unoptimized
              className="h-14 w-14 object-contain"
            />
          </Link>
          <p className="font-semibold tracking-wide text-slate-200">CAPACLOUD CORP</p>
          <p>1309 Coffeen Avenue STE 1200 Sheridan Wyoming 82801</p>
          <p className="pt-2">© CapaCloud Corp 2026. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-slate-300 lg:pt-0.5">
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
