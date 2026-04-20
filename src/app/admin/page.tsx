import { Suspense } from "react";
import { AdminReportsPanel } from "@/components/admin-reports-panel";

export const metadata = {
  title: "Admin · Reports | defense.codes",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-sm text-slate-500">
          Loading admin…
        </div>
      }
    >
      <AdminReportsPanel />
    </Suspense>
  );
}
