<script lang="ts">
  import { page } from "$app/state";
  import ErrorAlert from "$comp/ErrorAlert.svelte";
</script>

<div class="size-full flex flex-col items-center justify-center">
  <ErrorAlert message="{page.status}: {page.error?.message}" />
</div>
