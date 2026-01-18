<script lang="ts">
  import { page } from "$app/state";
  import LucideCircleX from "~icons/lucide/circle-x";
</script>

<div class="size-full flex flex-col items-center justify-center">
  <p class="alert alert-error font-bold text-2xl px-8 py-4">
    <LucideCircleX class="size-8" />
    <span>{page.status}: {page.error?.message}</span>
  </p>
</div>
