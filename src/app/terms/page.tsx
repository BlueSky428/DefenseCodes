import { GlassPanel } from "@/components/glass-panel";

export const metadata = { title: "Terms | DefenseCodes" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
      <GlassPanel className="p-6 min-[400px]:p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
          Terms of use
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Placeholder terms. DefenseCodes provides commercial intelligence
          products subject to your organisation&apos;s procurement and compliance
          policies. Nothing on this demo site constitutes legal, investment, or
          engineering advice. Replace this page with counsel-reviewed terms before
          production launch.
        </p>
      </GlassPanel>
    </div>
  );
}
