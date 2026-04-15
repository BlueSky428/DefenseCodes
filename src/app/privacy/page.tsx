import { GlassPanel } from "@/components/glass-panel";

export const metadata = { title: "Privacy | defense.codes" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <GlassPanel className="p-8 sm:p-10">
        <h1 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
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
