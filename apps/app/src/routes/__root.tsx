import { queryClient } from "#data/index.ts";
import type { FileRoutesByTo } from "#routeTree.gen.ts";
import type { Icon } from "#util/types.ts";
import { TanStackDevtools } from "@tanstack/solid-devtools";
import { FormDevtools } from "@tanstack/solid-form-devtools";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtoolsPanel } from "@tanstack/solid-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/solid-router-devtools";
import { Dynamic } from "solid-js/web";
import LucideMessageCircle from "~icons/lucide/message-circle";
import LucideSettings from "~icons/lucide/settings";

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RootLayout />

      <TanStackDevtools
        plugins={[
          {
            name: "TanStack Router",
            render: () => <TanStackRouterDevtoolsPanel />,
          },
          {
            name: "TanStack Query",
            render: () => <SolidQueryDevtoolsPanel />,
          },
          {
            name: "TanStack Form",
            render: () => <FormDevtools />,
          },
        ]}
      />
    </QueryClientProvider>
  ),
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div class="flex size-full flex-col sm:flex-row-reverse">
      <main class="grow overflow-hidden">
        <Outlet />
      </main>

      <nav class="bg-surface flex flex-row py-1 not-sm:justify-evenly sm:flex-col sm:px-1">
        <NavItem to="/" icon={LucideMessageCircle} />
        <div class="grow not-sm:hidden">{/* Spacer */}</div>
        <NavItem to="/settings" icon={LucideSettings} />
      </nav>
    </div>
  );
}

function NavItem(props: { to: keyof FileRoutesByTo; icon: Icon }) {
  return (
    <Link to={props.to} class="btn-ghost link-active">
      <Dynamic component={props.icon} />
    </Link>
  );
}

function NotFoundPage() {
  return (
    <div class="center-child size-full">
      <h1 class="large-title">
        <strong>404 Not Found</strong>
      </h1>
    </div>
  );
}
