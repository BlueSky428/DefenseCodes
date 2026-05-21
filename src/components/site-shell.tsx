"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEngine = pathname.startsWith("/engine");

  if (isEngine) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <div className="min-w-0 flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
