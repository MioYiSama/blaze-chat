import type { RouteSectionProps } from "@solidjs/router";
import { MessageCircle, Settings } from "lucide-solid";

export default function RootLayout(props: RouteSectionProps) {
  return (
    <div class="flex h-dvh w-dvw flex-col divide-y divide-gray-300 overflow-hidden md:flex-row-reverse md:divide-x md:divide-y-0 md:divide-x-reverse dark:divide-gray-700">
      <main class="grow">{props.children}</main>

      <nav
        class="flex h-16 w-full flex-row items-center justify-evenly md:mt-4 md:h-full md:w-16 md:flex-col md:justify-start md:gap-8"
        aria-label="导航栏"
      >
        <a class="inline" href="/chat" aria-label="聊天">
          <MessageCircle />
        </a>
        <a class="inline" href="/settings" aria-label="设置">
          <Settings />
        </a>
      </nav>
    </div>
  );
}
