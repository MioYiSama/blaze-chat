<script lang="ts">
  import { modelsCollection, providersCollection } from "$lib/data";
  import { getUrlQueryParam } from "$lib/util.svelte";
  import { eq, useLiveQuery } from "@tanstack/svelte-db";
  import { uuidv7 } from "uuidv7";

  let id = $derived(getUrlQueryParam("id")!);

  let providerQuery = useLiveQuery((q) =>
    q.from({ provider: providersCollection }).where(({ provider }) => eq(id, provider.id)),
  );

  let modelsQuery = useLiveQuery((q) =>
    q.from({ model: modelsCollection }).where(({ model }) => eq(id, model.providerId)),
  );
</script>

<button
  class="btn btn-primary"
  onclick={() => {
    let identifier = prompt("输入模型id");

    if (identifier) {
      modelsCollection.insert({
        id: uuidv7(),
        identifier,
        name: identifier,
        type: "GPT",
        providerId: id,
      });
    }
  }}>添加模型</button
>

{#if providerQuery.data && modelsQuery.data}
  <ul>
    {#each modelsQuery.data as model}
      <li>{model.identifier}</li>
    {/each}
  </ul>
{/if}
