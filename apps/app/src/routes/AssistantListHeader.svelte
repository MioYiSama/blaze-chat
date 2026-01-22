<script lang="ts">
  import { assistantsCollection } from "$lib/data";
  import { uuidv7 } from "uuidv7";
  import LucideSearch from "~icons/lucide/search";
  import LucideUserRoundPlus from "~icons/lucide/user-round-plus";

  let { assistantSearchKeyword = $bindable("") }: { assistantSearchKeyword: string } = $props();

  function addAssistant() {
    assistantsCollection.insert({
      id: uuidv7(),
      name: "未命名助手",
      modelId: null,
    });
  }
</script>

<div class="size-full flex flex-row items-center justify-center gap-2 px-4">
  <label class="input outline-none">
    <LucideSearch />
    <input type="search" bind:value={assistantSearchKeyword} />
  </label>

  <button class="btn btn-ghost btn-square" onclick={addAssistant}>
    <LucideUserRoundPlus />
  </button>
</div>
