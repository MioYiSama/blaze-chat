<script lang="ts">
  import QueryBoundary from "$comp/QueryBoundary.svelte";
  import { assistantsCollection } from "$lib/data";
  import { useLiveQuery } from "@tanstack/svelte-db";

  const assistantsQuery = useLiveQuery((q) => q.from({ assistants: assistantsCollection }));
</script>

<QueryBoundary query={assistantsQuery}>
  {#snippet ready(data)}
    {#each data as assistant}
      <p>{JSON.stringify(assistant)}</p>
    {/each}
  {/snippet}
</QueryBoundary>
