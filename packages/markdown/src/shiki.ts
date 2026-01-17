import type { RehypeShikiCoreOptions } from "@shikijs/rehype/core";
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
  type BundledTheme,
} from "./shiki.bundle";

export const highlighter = createHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: Object.keys(bundledThemes),
});

export const shikiOptions: RehypeShikiCoreOptions = {
  lazy: true,
  defaultLanguage: "text",
  fallbackLanguage: "text",
  themes: {
    light: "github-light-default" satisfies BundledTheme,
    dark: "github-dark-default" satisfies BundledTheme,
  },
  transformers: [
    {
      root(node) {
        node.children = [
          {
            type: "element",
            tagName: "code-block",
            properties: {
              "data-lang": this.options.lang,
              "data-code": this.source,
            },
            children: node.children.filter((e) => e.type !== "doctype"),
          },
        ];
      },
    },
  ],
};
