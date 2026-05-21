import type { ReactNode } from "react";
import { EngineShell } from "@/components/engine/engine-shell";

export const metadata = {
  title: "Defense.Codes Engine",
  description: "Defense, Space & Aerospace Supply Chain Risk Analysis Engine",
};

export default function EngineLayout({ children }: { children: ReactNode }) {
  return <EngineShell>{children}</EngineShell>;
}
