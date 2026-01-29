import { queryClient } from "#data/query.ts";
import type { FileRoutesByTo } from "#routeTree.gen.ts";
import { TanStackDevtools } from "@tanstack/solid-devtools";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtoolsPanel } from "@tanstack/solid-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/solid-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/solid-router-devtools";
import type { ComponentProps, JSXElement } from "solid-js";
import LucideMessageCircle from "~icons/lucide/message-circle";
import LucideSettings from "~icons/lucide/settings";

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RootLayout />

      <TanStackDevtools
        plugins={[
          {
            name: "Router",
            render: () => <TanStackRouterDevtoolsPanel />,
          },
          {
            name: "Query",
            render: () => <SolidQueryDevtoolsPanel />,
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

      <nav class="bg-surface py-1 sm:px-1">
        <ul class="flex size-full flex-row not-sm:justify-evenly sm:flex-col">
          <NavItem to="/" icon={LucideMessageCircle} />
          <div class="grow not-sm:hidden">{/* Spacer */}</div>
          <NavItem to="/settings" icon={LucideSettings} />
        </ul>
      </nav>
    </div>
  );
}

function NavItem(props: {
  to: keyof FileRoutesByTo;
  icon: (props: ComponentProps<"svg">) => JSXElement;
}) {
  return (
    <li>
      <Link to={props.to} class="icon-button [&.active]:text-primary block">
        <props.icon />
      </Link>
    </li>
  );
}

function NotFoundPage() {
  return (
    <div class="flex size-full items-center justify-center">
      <h1 class="large-title">
        <strong>404 Not Found</strong>
      </h1>
    </div>
  );
}
