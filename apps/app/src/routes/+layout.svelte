<script lang="ts">
  import type { Component } from "svelte";
  import LucideMessageCircle from "~icons/lucide/message-circle";
  import LucideSettings from "~icons/lucide/settings";
  import type { LayoutProps } from "./$types";

  import { page } from "$app/state";
  import "../app.css";

  const { children }: LayoutProps = $props();
</script>

<div class="size-full flex flex-col sm:flex-row-reverse">
  <main class="grow overflow-auto">
    {@render children()}
  </main>

  <nav class="bg-base-200 w-full h-fit sm:w-fit sm:h-full px-1 py-2">
    <ul class="size-full flex flex-row sm:flex-col not-sm:justify-evenly">
      {@render NavItem("/", LucideMessageCircle, (route) => route === "/")}
      <div class="grow not-sm:hidden"><!-- Spacer --></div>
      {@render NavItem("/settings", LucideSettings, (route) => route.startsWith("/settings"))}

      {#snippet NavItem(href: string, Icon: Component, active: (route: string) => boolean)}
        <li>
          <a {href} class="btn btn-square size-10 sm:size-12">
            <Icon
              class={[
                "size-6 sm:size-8",
                { "text-accent": page.route.id && active(page.route.id) },
              ]}
            />
          </a>
        </li>
      {/snippet}
    </ul>
  </nav>
</div>
