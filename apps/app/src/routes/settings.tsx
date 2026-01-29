import { Link, Outlet, useChildMatches, createFileRoute } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import LucideChevronLeft from "~icons/lucide/chevron-left";

declare module "@tanstack/solid-router" {
  interface StaticDataRouteOption {
    settingsName?: string;
  }
}

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const [sidebar, setSidebar] = createSignal(true);

  const settingsName = useChildMatches({
    select: (matches) => matches[0]?.staticData.settingsName,
  });

  return (
    <div class="bg-surface *:bg-background grid size-full grid-flow-col grid-rows-[3.5rem_1fr] gap-px sm:grid-cols-[1fr_3fr]">
      <div class="flex items-center justify-center" classList={{ "not-sm:hidden": !sidebar() }}>
        <h1 class="large-title">
          <strong>设置</strong>
        </h1>
      </div>

      <nav classList={{ "not-sm:hidden": !sidebar() }}>
        <ul class="size-full">
          <li>
            <Link
              class="[&.active]:text-primary"
              to="/settings"
              activeOptions={{ exact: true }}
              onClick={() => setSidebar(false)}
            >
              通用
            </Link>
          </li>
          <li>
            <Link
              class="[&.active]:text-primary"
              to="/settings/provider"
              onClick={() => setSidebar(false)}
            >
              供应商
            </Link>
          </li>
        </ul>
      </nav>

      <div class="flex flex-row items-center px-2" classList={{ "not-sm:hidden": sidebar() }}>
        <button class="icon-button sm:hidden" onClick={() => setSidebar(true)}>
          <LucideChevronLeft />
        </button>

        <p class="title2 grow text-center">{settingsName()}</p>
      </div>

      <div classList={{ "not-sm:hidden": sidebar() }}>
        <Outlet />
      </div>
    </div>
  );
}
