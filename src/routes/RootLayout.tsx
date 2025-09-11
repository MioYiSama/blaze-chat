import { useLocation, type RouteSectionProps } from "@solidjs/router";
import clsx from "clsx";

import { Flame, MessageCircle, Settings } from "lucide-solid";
import type { JSXElement } from "solid-js";

function NavItem(props: {
  path: string;
  name: string;
  icon: () => JSXElement;
}) {
  const location = useLocation();

  return (
    <a
      href={props.path}
      class={clsx("flex flex-col items-center justify-center rounded-md p-2", {
        "bg-gray-200 dark:bg-gray-800": location.pathname === props.path,
      })}
    >
      {props.icon()}
      <label class="text-sm">{props.name}</label>
    </a>
  );
}

export default function RootLayout(props: RouteSectionProps) {
  return (
    <div class="flex h-dvh w-dvw flex-col divide-y divide-gray-300 overflow-hidden md:flex-row-reverse md:divide-x md:divide-y-0 md:divide-x-reverse dark:divide-gray-700">
      <main class="grow">{props.children}</main>

      <nav class="flex w-full shrink flex-row items-center justify-evenly gap-4 p-2 md:h-full md:w-auto md:flex-col md:justify-start">
        <Flame size="2rem" class="my-2 hidden md:block" />
        <NavItem path="/chat" name="聊天" icon={() => <MessageCircle />} />
        <NavItem path="/settings" name="设置" icon={() => <Settings />} />
      </nav>
    </div>
  );
}
