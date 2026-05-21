import { SimulationProgress } from "@/components/engine/simulation-progress";

export default async function ProgressPage(props: PageProps<"/engine/simulation/[id]/progress">) {
  const { id } = await props.params;
  return <SimulationProgress simulationId={id} />;
}
