import { GlassPanel } from "@/components/glass-panel";

export const metadata = { title: "Terms | DefenseCodes" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <GlassPanel className="p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
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
