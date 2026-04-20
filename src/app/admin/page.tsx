import { AdminReportsPanel } from "@/components/admin-reports-panel";

export const metadata = {
  title: "Admin · Reports | defense.codes",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminReportsPanel />;
}
