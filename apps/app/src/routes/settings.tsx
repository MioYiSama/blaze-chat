import type { FileRoutesByTo } from "#routeTree.gen.ts";
import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/solid-router";
import { createSignal, type Setter } from "solid-js";
import LucideChevronLeft from "~icons/lucide/chevron-left";

declare module "@tanstack/solid-router" {
  interface StaticDataRouteOption {
    settingsName?: string;
  }
}

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const [sidebar, setSidebar] = createSignal(true);

  const settingsName = useChildMatches({
    select: (matches) => matches[0]?.staticData.settingsName,
  });

  return (
    <div class="bg-surface *:bg-background grid size-full grid-flow-col grid-rows-[3.5rem_1fr] gap-px sm:grid-cols-[1fr_3fr]">
      <div class="center-child" classList={{ "not-sm:hidden": !sidebar() }}>
        <h1 class="large-title">
          <strong>设置</strong>
        </h1>
      </div>

      <nav class="size-full" classList={{ "not-sm:hidden": !sidebar() }}>
        <NavItem name="通用" to="/settings" exact={true} setSidebar={setSidebar} />
        <NavItem name="供应商" to="/settings/providers" setSidebar={setSidebar} />
      </nav>

      <div class="flex flex-row items-center px-2" classList={{ "not-sm:hidden": sidebar() }}>
        <button class="btn-ghost sm:hidden" onClick={() => setSidebar(true)}>
          <LucideChevronLeft />
        </button>

        <h2 class="title2 grow text-center">{settingsName()}</h2>
      </div>

      <div class="overflow-auto p-4" classList={{ "not-sm:hidden": sidebar() }}>
        <Outlet />
      </div>
    </div>
  );
}

function NavItem(props: {
  name: string;
  to: keyof FileRoutesByTo;
  exact?: boolean;
  setSidebar: Setter<boolean>;
}) {
  return (
    <Link
      class="link-active btn-ghost py-6 text-center"
      to={props.to}
      activeOptions={{ exact: props.exact ?? false }}
      onClick={() => props.setSidebar(false)}
    >
      {props.name}
    </Link>
  );
}
