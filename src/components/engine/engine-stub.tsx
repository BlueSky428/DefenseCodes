export function EngineStub({
  title,
  badge,
  description,
}: {
  title: string;
  badge: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
      <div className="max-w-md">
        <span className="rounded border border-white/10 bg-white/[0.03] px-2 py-px font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
          {badge}
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-space)] text-2xl font-semibold text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-slate-700">
          Module Pending Deployment
        </p>
      </div>
    </div>
  );
}
