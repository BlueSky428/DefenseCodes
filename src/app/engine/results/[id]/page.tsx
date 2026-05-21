import { ResultsView } from "@/components/engine/results-view";

export default async function ResultsPage(props: PageProps<"/engine/results/[id]">) {
  const { id } = await props.params;
  return <ResultsView simulationId={id} />;
}
