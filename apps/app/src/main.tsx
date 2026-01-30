import "@valibot/i18n/zh-CN";

import { getPrimaryColor, setRootPrimaryColor } from "#data/settings.ts";
import { RouterProvider, createRouter } from "@tanstack/solid-router";
import { render } from "solid-js/web";
import * as v from "valibot";

import { routeTree } from "./routeTree.gen";

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}

const app = document.getElementById("app");

if (!app) {
  throw new Error("Unable to find the app element");
}

v.setGlobalConfig({ lang: "zh-CN" });
setRootPrimaryColor(getPrimaryColor());

const router = createRouter({ routeTree });

render(() => <RouterProvider router={router} />, app);
