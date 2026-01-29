import { getPrimaryColor, setRootPrimaryColor } from "#data/settings.ts";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const app = document.getElementById("app");

if (!app) {
  throw new Error("Unable to find the app element");
}

setRootPrimaryColor(getPrimaryColor());

render(() => <RouterProvider router={router} />, app);
