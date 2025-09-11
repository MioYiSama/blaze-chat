import type { RouteSectionProps } from "@solidjs/router";
import clsx from "clsx";

import { MessageCircle, Settings } from "lucide-solid";

export default function RootLayout(props: RouteSectionProps) {
  console.log(props.location.pathname);

  return (
    <div class="flex h-dvh w-dvw flex-col divide-y divide-gray-300 overflow-hidden md:flex-row-reverse md:divide-x md:divide-x-reverse dark:divide-gray-700">
      <main class="grow">{props.children}</main>

      <nav class="flex h-16 w-full flex-row items-center justify-evenly md:mt-4 md:h-full md:w-16 md:flex-col md:justify-start md:gap-8">
        <a
          href="/chat"
          class={clsx("rounded-md p-2", {
            "bg-gray-200": props.location.pathname === "/chat",
          })}
        >
          <MessageCircle />
        </a>
        <a
          href="/settings"
          class={clsx("rounded-md p-2", {
            "bg-gray-200": props.location.pathname === "/settings",
          })}
        >
          <Settings />
        </a>
      </nav>
    </div>
  );
}
