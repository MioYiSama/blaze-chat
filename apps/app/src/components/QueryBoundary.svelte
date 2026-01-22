<script lang="ts" generics="T extends object, TData = Array<T>">
  import ErrorAlert from "$comp/ErrorAlert.svelte";
  import type { UseLiveQueryReturn } from "@tanstack/svelte-db";
  import type { Snippet } from "svelte";

  const {
    query,
    ready,
  }: {
    query: UseLiveQueryReturn<T, TData>;
    ready: Snippet<[NonNullable<TData>]>;
  } = $props();
</script>

{#if query.isLoading}
  <span class="loading loading-spinner loading-xl"></span>
{:else if query.isError}
  <ErrorAlert />
{:else if query.data}
  {@render ready(query.data)}
{/if}
