<svelte:options customElement={{ tag: "code-block", shadow: "none" }} />

<script lang="ts">
  import LucideCopy from "~icons/lucide/copy";
  import type { BundledLanguage } from "../shiki.bundle";
  const {
    "data-lang": lang,
    "data-code": code,
  }: { "data-lang": BundledLanguage | "text"; "data-code": string } = $props();

  async function copyCode() {
    await navigator.clipboard.writeText(code);
  }
</script>

<div
  class="shiki-container divide-y divide-base-300"
  {@attach (container) => {
    const shiki = $host().firstElementChild!;

    container.style = shiki.getAttribute("style")!;
    container.appendChild(shiki);
  }}
>
  <div class="flex flex-row items-center px-4 py-1">
    <span>{lang}</span>
    <div class="grow"><!-- Spacer --></div>
    <button class="btn btn-ghost btn-square size-10" onclick={copyCode}><LucideCopy /></button>
  </div>
</div>

<style>
  @media (prefers-color-scheme: dark) {
    :global(.shiki),
    :global(.shiki span),
    :global(.shiki-container) {
      color: var(--shiki-dark) !important;
      background-color: var(--shiki-dark-bg) !important;
    }
  }
</style>
