<script module lang="ts">
  let sidebar = $state(true);

  export function showSidebar() {
    sidebar = true;
  }

  export function hideSidebar() {
    sidebar = false;
  }
</script>

<script lang="ts">
  import AssistantList from "./AssistantList.svelte";
  import AssistantListHeader from "./AssistantListHeader.svelte";
  import Chat from "./Chat.svelte";
  import ChatHeader from "./ChatHeader.svelte";

  let assistantSearchKeyword = $state("");
</script>

<div
  class="size-full bg-base-200 grid grid-flow-col grid-rows-[4rem_1fr] sm:grid-cols-[minmax(14rem,1fr)_4fr] gap-0.5"
>
  <div class={["bg-base-100", { "not-sm:hidden": !sidebar }]}>
    <AssistantListHeader bind:assistantSearchKeyword />
  </div>
  <div class={["bg-base-100 overflow-y-auto", { "not-sm:hidden": !sidebar }]}>
    <AssistantList {assistantSearchKeyword} />
  </div>
  <div class={["bg-base-100", { "not-sm:hidden": sidebar }]}>
    <ChatHeader />
  </div>
  <div class={["bg-base-100 overflow-y-auto", { "not-sm:hidden": sidebar }]}>
    <Chat />
  </div>
</div>
