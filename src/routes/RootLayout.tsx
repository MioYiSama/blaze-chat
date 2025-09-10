import type { RouteSectionProps } from "@solidjs/router";

export default function RootLayout(props: RouteSectionProps) {
  return (
    <>
      <main class="grow">{props.children}</main>

      <nav class="flex w-full flex-row items-center justify-evenly sm:h-full sm:flex-col">
        <li class="inline">聊天</li>
        <li class="inline">设置</li>
      </nav>
    </>
  );
}
