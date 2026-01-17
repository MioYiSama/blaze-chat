<svelte:options customElement={{ tag: "code-block", shadow: "none" }} />

<script lang="ts">
  import type { BundledLanguage } from "../shiki.bundle";

  const {
    "data-lang": lang,
    "data-code": code,
  }: { "data-lang": BundledLanguage | "text"; "data-code": string } = $props();

  console.log(code);
</script>

<div>
  <p>{lang}</p>

  <div
    {@attach (slot) => {
      slot.appendChild($host().firstElementChild!);
    }}
  ></div>
</div>

<style>
  :global(.shiki) {
    background-color: transparent !important;
  }

  @media (prefers-color-scheme: dark) {
    :global(.shiki),
    :global(.shiki span) {
      color: var(--shiki-dark) !important;
    }
  }
</style>
