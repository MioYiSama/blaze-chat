import DOMPurify from "dompurify";
import { unified } from "unified";
import { highlighter, shikiOptions } from "./shiki";

const processor = (async () => {
  const [
    remarkParse,
    remarkGfm,
    remarkMath,
    remarkRehype,
    rehypeRaw,
    rehypeKatex,
    rehypeShiki,
    rehypeStringify,
  ] = await Promise.all([
    (await import("remark-parse")).default,
    (await import("remark-gfm")).default,
    (await import("remark-math")).default,
    (await import("remark-rehype")).default,
    (await import("rehype-raw")).default,
    (await import("rehype-katex")).default,
    (await import("@shikijs/rehype/core")).default,
    (await import("rehype-stringify")).default,
  ]);

  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeShiki, await highlighter, shikiOptions)
    .use(rehypeStringify);
})();

export async function processMarkdown(content: string): Promise<string> {
  const result = await (await processor).process(content);

  return DOMPurify.sanitize(result.toString(), {
    ADD_TAGS: ["code-block"],
  });
}
