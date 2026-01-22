<script lang="ts">
  import { goto } from "$app/navigation";
  import QueryBoundary from "$comp/QueryBoundary.svelte";
  import { topicsCollection, ZeroUUID } from "$lib/data";
  import { getUrlQueryParam } from "$lib/util.svelte";
  import { Markdown } from "@blaze-chat/markdown";
  import { and, eq, useLiveQuery } from "@tanstack/svelte-db";
  import { uuidv7 } from "uuidv7";
  import LucideBot from "~icons/lucide/bot";
  import LucideSend from "~icons/lucide/send";
  import LucideUserRound from "~icons/lucide/user-round";

  let textareaHeight = $state(128);
  let dragging = false;
  let textareaContent = $state("");

  const assistantId = $derived(getUrlQueryParam("assistant") ?? ZeroUUID);
  const topicId = $derived(getUrlQueryParam("topic"));

  const topicQuery = useLiveQuery((q) => {
    return q
      .from({ topic: topicsCollection })
      .where(({ topic }) => and(eq(topic.id, topicId), eq(topic.assistantId, assistantId)))
      .findOne();
  });
</script>

<div class="size-full grid" style="grid-template-rows: 1fr 6px {textareaHeight}px;">
  <ul class="flex flex-col gap-4 p-2 overflow-y-scroll">
    <QueryBoundary query={topicQuery}>
      {#snippet ready(topic)}
        {#each topic.messages as { role, content }}
          <li
            class={[
              "flex flex-col gap-2",
              { "items-start": role === "assistant", "items-end": role === "user" },
            ]}
          >
            <div class="bg-base-300 rounded-[50%] p-1">
              {#if role === "assistant"}
                <LucideBot />
              {:else if role === "user"}
                <LucideUserRound />
              {/if}
            </div>

            <div class="bg-secondary min-w-0 max-w-full lg:max-w-3/4 rounded-xl px-4 py-3">
              <Markdown {content} />
            </div>
          </li>
        {/each}
      {/snippet}
    </QueryBoundary>
  </ul>

  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="h-full cursor-row-resize hover:bg-neutral transition-colors"
    aria-label="splitter"
    role="separator"
    onpointerdown={(e) => {
      dragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onpointermove={(e) => {
      if (dragging) {
        textareaHeight = Math.max(80, Math.min(512, textareaHeight - e.movementY));
      }
    }}
    onpointerup={() => {
      dragging = false;
    }}
  >
    <!-- Splitter -->
  </div>

  <div class="flex flex-col p-2 bg-base-300">
    <textarea
      class="w-full grow bg-transparent p-1 outline-none resize-none text-sm"
      placeholder="请输入消息"
      bind:value={textareaContent}
    ></textarea>

    <button
      class="btn btn-primary self-end"
      onclick={async () => {
        if (topicId) {
          const tx = topicsCollection.update(topicId, (draft) => {
            draft.messages.push({
              role: "user",
              content: textareaContent,
            });
          });

          await tx.isPersisted.promise;
        } else {
          const id = uuidv7();

          const tx = topicsCollection.insert({
            id,
            assistantId,
            name: "未命名话题",
            messages: [
              {
                role: "user",
                content: textareaContent,
              },
            ],
          });

          await tx.isPersisted.promise;

          await goto(`?assistant=${assistantId}&topic=${id}`);
        }

        textareaContent = "";
      }}
    >
      <LucideSend />
      <span>发送</span>
    </button>
  </div>
</div>
