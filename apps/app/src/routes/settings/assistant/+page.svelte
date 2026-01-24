<script lang="ts">
  import { goto } from "$app/navigation";
  import { assistantsCollection, modelsCollection, providersCollection } from "$lib/data";
  import { getUrlQueryParam } from "$lib/util.svelte";
  import { eq, useLiveQuery } from "@tanstack/svelte-db";

  let id = $derived(getUrlQueryParam("id"));

  let modelsQuery = useLiveQuery((q) =>
    q
      .from({ provider: providersCollection })
      .innerJoin({ model: modelsCollection }, ({ provider, model }) =>
        eq(provider.id, model.providerId),
      ),
  );

  let model = $state("");
</script>

<p>{id}</p>

{#if modelsQuery.data}
  <form
    onsubmit={async (e) => {
      e.preventDefault();
      await assistantsCollection.update(id, (draft) => {
        draft.modelId = model;
      }).isPersisted.promise;

      await goto(`/?assistant=${id}`);
    }}
  >
    <select class="select" bind:value={model}>
      {#each modelsQuery.data as { provider, model }}
        <option value={model.id}>{provider?.name} - {model?.name}</option>
      {/each}
    </select>
    <button class="btn btn-primary" type="submit">保存</button>
  </form>
{/if}
