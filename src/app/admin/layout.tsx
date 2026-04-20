export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-0 border-t border-[var(--accent)]/10 bg-gradient-to-b from-[#060a14] via-[#0A0F1F] to-[#050a12]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,229,255,0.12), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
