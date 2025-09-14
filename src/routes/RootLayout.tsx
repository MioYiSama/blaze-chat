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
        "bg-secondary-bg": location.pathname === props.path,
      })}
    >
      {props.icon()}
      <label class="text-sm">{props.name}</label>
    </a>
  );
}

export default function RootLayout(props: RouteSectionProps) {
  return (
    <div class="divide-secondary-bg flex h-dvh w-dvw flex-col divide-y overflow-hidden sm:flex-row-reverse sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
      <main class="grow">{props.children}</main>

      <nav
        class={clsx(
          "flex flex-row sm:flex-col",
          "items-center justify-evenly sm:justify-start",
          "w-full gap-4 p-2 sm:h-full sm:w-auto",
        )}
      >
        <Flame size="2rem" class="my-2 max-sm:hidden" />
        <NavItem path="/" name="聊天" icon={() => <MessageCircle />} />
        <NavItem path="/settings" name="设置" icon={() => <Settings />} />
      </nav>
    </div>
  );
}
