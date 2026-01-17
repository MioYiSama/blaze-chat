<script lang="ts">
  import { processMarkdown } from "../process";
  import "./CodeBlock.svelte";

  import "github-markdown-css/github-markdown.css";
  import "katex/dist/katex.min.css";

  const { content }: { content: string } = $props();
</script>

<atricle
  class="markdown-body
    prose prose-zinc dark:prose-invert
    prose-code:before:content-none prose-code:after:content-none"
>
  {#await processMarkdown(content) then html}
    {@html html}
  {/await}
</atricle>
