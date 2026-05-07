import { GlassPanel } from "@/components/glass-panel";

export const metadata = { title: "Privacy | DefenseCodes" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-12 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] min-[400px]:py-16 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:pl-[max(2rem,env(safe-area-inset-left))] lg:pr-[max(2rem,env(safe-area-inset-right))]">
      <GlassPanel className="p-6 min-[400px]:p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white min-[400px]:text-2xl">
          Privacy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Placeholder privacy notice. This demo connects to your browser wallet
          locally; we do not operate a production backend in this repository.
          Describe data processing, retention, and subprocessors here before going
          live.
        </p>
      </GlassPanel>
    </div>
  );
}
