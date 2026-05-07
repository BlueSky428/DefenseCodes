import { Suspense } from "react";
import { AdminReportsPanel } from "@/components/admin-reports-panel";

export const metadata = {
  title: "Admin · Reports | DefenseCodes",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl py-16 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] text-center text-sm text-slate-500 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">
          Loading admin…
        </div>
      }
    >
      <AdminReportsPanel />
    </Suspense>
  );
}
