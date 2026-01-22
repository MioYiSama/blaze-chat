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
      .from({
        assistant: assistantsCollection,
      })
      .where(({ assistant }) => eq(assistant.id, assistantId))
      .findOne(),
  );

  const topicQuery = useLiveQuery((q) => {
    return q
      .from({ topic: topicsCollection })
      .where(({ topic }) => and(eq(topic.id, topicId), eq(topic.assistantId, assistantId)))
      .findOne();
  });
</script>

<div class="size-full grid grid-cols-[max-content_1fr_max-content] items-center px-2">
  <div>
    <button class="btn btn-ghost btn-square sm:hidden" onclick={() => showSidebar()}>
      <LucideChevronLeft />
    </button>
    <button class="btn btn-ghost btn-square">
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
    <button class="btn btn-ghost btn-square">
      <LucideEllipsis />
    </button>
  </div>
</div>
