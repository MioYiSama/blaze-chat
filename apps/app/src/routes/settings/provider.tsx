import { createFileRoute } from "@tanstack/solid-router";

export const Route = createFileRoute("/settings/provider")({
  staticData: {
    settingsName: "供应商",
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/provider"!</div>;
}
