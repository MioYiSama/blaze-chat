<script lang="ts">
  import { assistantsCollection } from "$lib/data";
  import { useLiveQuery } from "@tanstack/svelte-db";
  import { uuidv7 } from "uuidv7";

  const assistantsQuery = useLiveQuery((q) =>
    q.from({ assistants: assistantsCollection }),
  );
</script>

<p>Chat Page</p>
{#if assistantsQuery.isReady}
  <p>{JSON.stringify(assistantsQuery.data)}</p>
{/if}

<button
  class="btn btn-primary"
  onclick={() => {
    assistantsCollection.insert({ id: uuidv7(), name: "a", modelId: null });
  }}>Add</button
>

<button
  class="btn btn-primary"
  onclick={() => {
    assistantsCollection.update(assistantsQuery.data[0]!.id, (draft) => {
      draft.name = uuidv7();
    });
  }}>Delete</button
>

<button
  class="btn btn-primary"
  onclick={() => {
    assistantsCollection.delete(assistantsQuery.data[0]!.id);
  }}>Delete</button
>
