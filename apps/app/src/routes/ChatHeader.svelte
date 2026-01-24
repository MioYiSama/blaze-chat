<script lang="ts">
  import QueryBoundary from "$comp/QueryBoundary.svelte";
  import { assistantsCollection, topicsCollection, ZeroUUID } from "$lib/data";
  import { getUrlQueryParam } from "$lib/util.svelte";
  import { and, eq, useLiveQuery } from "@tanstack/svelte-db";
  import LucideChevronLeft from "~icons/lucide/chevron-left";
  import LucideEllipsis from "~icons/lucide/ellipsis";
  import LucideHistory from "~icons/lucide/history";
  import LucideMessageCirclePlus from "~icons/lucide/message-circle-plus";
  import { showSidebar } from "./+page.svelte";

  const assistantId = $derived(getUrlQueryParam("assistant") ?? ZeroUUID);
  const topicId = $derived(getUrlQueryParam("topic"));

  const assistantQuery = useLiveQuery((q) =>
    q
      .from({ assistant: assistantsCollection })
      .where(({ assistant }) => eq(assistant.id, assistantId))
      .findOne(),
  );

  const topicsQuery = useLiveQuery((q) =>
    q.from({ topics: topicsCollection }).where(({ topics }) => eq(topics.assistantId, assistantId)),
  );

  const topicQuery = useLiveQuery((q) =>
    q
      .from({ topic: topicsCollection })
      .where(({ topic }) => and(eq(topic.id, topicId), eq(topic.assistantId, assistantId)))
      .findOne(),
  );

  let historyDialog: HTMLDialogElement;
</script>

<div class="size-full grid grid-cols-[max-content_1fr_max-content] items-center px-2">
  <div>
    <button class="btn btn-ghost btn-square sm:hidden" onclick={() => showSidebar()}>
      <LucideChevronLeft />
    </button>
    <button class="btn btn-ghost btn-square" onclick={() => historyDialog.showModal()}>
      <LucideHistory />
    </button>
  </div>

  <div class="flex flex-col items-center">
    <QueryBoundary query={assistantQuery}>
      {#snippet ready(assistant)}
        <h1 class="font-bold text-lg">{assistant.name}</h1>
      {/snippet}
    </QueryBoundary>

    <QueryBoundary query={topicQuery}>
      {#snippet ready(topic)}
        <p class="text-sm">{topic.name}</p>
      {/snippet}
    </QueryBoundary>
  </div>

  <div>
    {#if topicId}
      <a class="btn btn-ghost btn-square" href="?assistant={assistantId}">
        <LucideMessageCirclePlus />
      </a>
    {/if}
    <a href="/settings/assistant?id={assistantId}" class="btn btn-ghost btn-square">
      <LucideEllipsis />
    </a>
  </div>
</div>

<dialog bind:this={historyDialog} class="modal">
  <div class="modal-box max-h-3/4 overflow-hidden flex flex-col">
    <h1 class="font-bold text-center text-xl">话题列表</h1>

    <ul class="flex flex-col items-center overflow-y-scroll flex-1 min-h-0">
      <QueryBoundary query={topicsQuery}>
        {#snippet ready(topics)}
          {#each topics as { id, name }}
            <li>
              <a
                href="?assistant={assistantId}&topic={id}"
                onclick={() => historyDialog.close()}
                class="btn btn-ghost text-lg font-normal py-8"
              >
                {name}
              </a>
            </li>
          {/each}
        {/snippet}
      </QueryBoundary>
    </ul>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button class="cursor-auto">close</button>
  </form>
</dialog>
