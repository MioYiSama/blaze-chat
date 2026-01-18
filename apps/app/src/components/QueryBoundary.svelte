<script lang="ts" generics="T extends object">
  import type { UseLiveQueryReturn } from "@tanstack/svelte-db";
  import type { Snippet } from "svelte";

  const {
    query,
    ready,
  }: {
    query: UseLiveQueryReturn<T>;
    ready: Snippet<[T[]]>;
  } = $props();
</script>

{#if query.isLoading}
  <p>Loading</p>
{:else if query.isError}
  <p>Error</p>
{:else}
  {@render ready(query.data)}
{/if}
