<script lang="ts">
  import QueryBoundary from "$comp/QueryBoundary.svelte";
  import { providersCollection } from "$lib/data";
  import { useLiveQuery } from "@tanstack/svelte-db";
  import { uuidv7 } from "uuidv7";

  let providersQuery = useLiveQuery((q) => q.from({ providers: providersCollection }));

  let addProviderDialog: HTMLDialogElement;
  let apiKey = $state("");
  let baseUrl = $state("");
</script>

<h1 class="font-bold text-2xl">设置</h1>

<button class="btn btn-primary" onclick={() => addProviderDialog.showModal()}>添加供应商</button>

<QueryBoundary query={providersQuery}>
  {#snippet ready(providers)}
    <ul>
      {#each providers as provider}
        <p>{provider.name}</p>
        <a href="/settings/provider?id={provider.id}" class="btn btn-ghost">设置</a>
      {/each}
    </ul>
  {/snippet}
</QueryBoundary>

<dialog bind:this={addProviderDialog} class="modal">
  <div class="modal-box">
    <form>
      <label class="input outline-none">
        <span class="label">API Key</span>
        <input type="text" bind:value={apiKey} required />
      </label>
      <label class="input outline-none">
        <span class="label">Base URL</span>
        <input type="text" bind:value={baseUrl} placeholder="可选" required={false} />
      </label>
      <button
        type="submit"
        class="btn btn-primary"
        onclick={async () => {
          await providersCollection.insert({
            id: uuidv7(),
            name: "OpenRouter",
            type: "OpenRouter",
            apiKey,
            baseUrl: baseUrl ? baseUrl : null,
          }).isPersisted.promise;
          apiKey = "";
          baseUrl = "";
          addProviderDialog.close();
        }}>创建</button
      >
    </form>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button class="cursor-auto">close</button>
  </form>
</dialog>
