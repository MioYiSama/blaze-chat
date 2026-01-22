<script lang="ts">
  import LucideCircleX from "~icons/lucide/circle-x";

  const { message = "未知错误" }: { message?: string } = $props();
</script>

<p class="alert alert-error font-bold text-lg px-8 py-4">
  <LucideCircleX />
  <span>{message}</span>
</p>
