import { ChatIcon, SettingsIcon } from "@/components/icons";
import type { RouteSectionProps } from "@solidjs/router";
import NavBar from "./NavBar";

export default function Root(props: RouteSectionProps) {
  return (
    <>
      <main class="grow overflow-auto">{props.children}</main>

      <NavBar
        items={[
          { label: "聊天", href: "/", icon: ChatIcon },
          { label: "设置", href: "/settings", icon: SettingsIcon },
        ]}
      />
    </>
  );
}
