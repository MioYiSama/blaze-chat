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
    <nav class="h-max w-full shrink-0 p-2 sm:order-first sm:h-full sm:w-max">
      <ul class="flex flex-row not-sm:justify-evenly sm:w-max sm:flex-col sm:gap-4">
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
        class="hover:bg-secondary flex flex-col items-center rounded px-2 py-1 transition-colors"
        classList={{
          "bg-primary!": props.href === location.pathname,
        }}
      >
        <props.icon />
        <span class="select-none sm:text-lg">{props.label}</span>
      </A>
    </li>
  );
}
