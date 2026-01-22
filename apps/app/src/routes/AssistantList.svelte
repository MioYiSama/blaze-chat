<script lang="ts">
  import QueryBoundary from "$comp/QueryBoundary.svelte";
  import { assistantsCollection, ZeroUUID } from "$lib/data";
  import { getUrlQueryParam } from "$lib/util.svelte";
  import { useLiveQuery } from "@tanstack/svelte-db";
  import LucideBotMessageSquare from "~icons/lucide/bot-message-square";
  import { hideSidebar } from "./+page.svelte";

  const { assistantSearchKeyword }: { assistantSearchKeyword: string } = $props();

  const assistantId = $derived(getUrlQueryParam("assistant") ?? ZeroUUID);
  const assistantsQuery = useLiveQuery((q) => q.from({ assistants: assistantsCollection }));
</script>

<QueryBoundary query={assistantsQuery}>
  {#snippet ready(assistants)}
    <ul class="overflow-y-scroll pl-6 divide-y divide-base-200">
      {#each assistants.filter( (assistant) => assistant.name.includes(assistantSearchKeyword), ) as { id, name }}
        <li>
          <a
            href="?assistant={id}"
            onclick={() => hideSidebar()}
            class={[
              "btn btn-ghost gap-4 my-1 p-0 text-lg w-full h-20",
              {
                "text-accent": assistantId === id,
              },
            ]}
          >
            <LucideBotMessageSquare class="size-8" />
            <span>{name}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/snippet}
</QueryBoundary>
