import type { Icon } from "@/components/icons";
import { A, useLocation } from "@solidjs/router";
import { For } from "solid-js";

type NavBarItemProps = {
  label: string;
  href: string;
  icon: Icon;
};

export default function NavBar(props: { items: NavBarItemProps[] }) {
  return (
    <nav class="p-2 not-sm:w-full sm:order-first sm:h-full">
      <ul class="flex flex-row text-nowrap not-sm:justify-evenly sm:flex-col sm:gap-4">
        <For each={props.items}>{(item) => <NavBarItem {...item} />}</For>
      </ul>
    </nav>
  );
}

function NavBarItem(props: NavBarItemProps) {
  const location = useLocation();

  return (
    <li>
      <A
        href={props.href}
        class="hover-color flex flex-col items-center rounded px-2 py-1"
        classList={{
          "bg-primary!": props.href === location.pathname,
        }}
      >
        <props.icon />
        <span>{props.label}</span>
      </A>
    </li>
  );
}
